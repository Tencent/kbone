/* eslint-disable import/no-extraneous-dependencies */
/**
 * 解析 node_modules 并进行打包
 */
const path = require('path')
const fs = require('fs')
const acorn = require('acorn')
const sourcemap = require('source-map')

/**
 * 获取唯一 id
 */
let seed = +new Date()
function getId() {
    return ++seed
}

/**
 * 递归创建目录
 */
function recursiveMkdir(dir) {
    const prevDir = path.dirname(dir)
    try {
        fs.accessSync(prevDir)
    } catch (err) {
        // 不存在上级目录，递归创建
        recursiveMkdir(prevDir)
    }

    try {
        fs.accessSync(dir)

        const stat = fs.statSync(dir)
        if (stat && !stat.isDirectory()) {
            // 已存在同名文件，重命名
            fs.renameSync(dir, `${dir}.bak`)
            console.warn(`${dir} already exists but is not a directory, so it will be rename to a file with the suffix ending in '.bak'`)

            fs.mkdirSync(dir)
        }
    } catch (err) {
        // 不存在该目录，则创建
        fs.mkdirSync(dir)
    }
}

/**
 * 复制文件
 */
function copyFile(sourcePath, distPath) {
    const content = fs.readFileSync(sourcePath)

    writeFile(content, distPath)
}

/**
 * 写入文件
 */
function writeFile(content, distPath) {
    recursiveMkdir(path.dirname(distPath))
    fs.writeFileSync(distPath, content)
}

/**
 * 遍历节点
 */
function walkNode(node, callback) {
    callback(node)

    // 有 type 字段的我们认为是一个节点
    Object.keys(node).forEach((key) => {
        const item = node[key]
        if (Array.isArray(item)) {
            item.forEach((sub) => {
                if (sub && sub.type) walkNode(sub, callback)
            })
        }

        if (item && item.type) walkNode(item, callback)
    })
}

/**
 * 解析 js 中的依赖
 */
function parseDeps(code, jsPath) {
    const deps = [] // 依赖列表
    let adjustList = []
    const ast = acorn.parse(code, {
        sourceType: 'module',
        locations: true,
        allowHashBang: true,
        onComment(block, text, start, end) {
            if (!block && code[start] === '#') {
                // 处理 # 开头的注释
                adjustList.push({start, end, adjustContent: ''})
            }
        },
    })

    // 从根节点开始
    walkNode(ast, (node) => {
        // require 我们认为是一个函数调用，并且函数名为 require，参数只有一个，且必须是字面量
        const callee = node.callee
        const args = node.arguments
        if (node.type === 'CallExpression' && callee && callee.type === 'Identifier' && callee.name === 'require' && args && args.length === 1) {
            if (args[0].type === 'Literal') {
                deps.push(args[0].value)
            } else {
                // require 变量
                console.warn(`require variable is not allowed: ${jsPath} at line ${node.loc.start.line} ~ ${node.loc.end.line}`)
            }
        }

        // 处理 'use strict'
        if (node.type === 'ExpressionStatement') {
            if (node.expression && node.expression.value === 'use strict') {
                adjustList.push({start: node.start, end: node.end, adjustContent: ''})
            }
        }

        // import 声明
        if (node.type === 'ImportDeclaration') {
            const source = node.source
            const specifiers = node.specifiers
            const adjust = {start: node.start, end: node.end}
            const adjustContent = []

            if (source && source.type === 'Literal') {
                // from './xx'
                deps.push(source.value)
                adjustContent.push(`var __TEMP__ = require('${source.value}');`)
            }

            if (specifiers && Array.isArray(specifiers)) {
                specifiers.forEach(specifier => {
                    if (specifier.type === 'ImportSpecifier') {
                        // import { xx, xx as xx }
                        const local = specifier.local
                        const imported = specifier.imported

                        if (local.type === 'Identifier' && imported.type === 'Identifier') {
                            adjustContent.push(`var ${local.name} = __TEMP__['${imported.name}'];`)
                        }
                    } else if (specifier.type === 'ImportDefaultSpecifier') {
                        // import xx
                        const local = specifier.local

                        if (local.type === 'Identifier') {
                            adjustContent.push(`var ${local.name} = __REQUIRE_DEFAULT__(__TEMP__);`)
                        }
                    } else if (specifier.type === 'ImportNamespaceSpecifier') {
                        // import * as xx
                        const local = specifier.local

                        if (local.type === 'Identifier') {
                            adjustContent.push(`var ${local.name} = __REQUIRE_WILDCARD__(__TEMP__);`)
                        }
                    }
                })
            }

            adjust.adjustContent = adjustContent.join('')
            adjustList.push(adjust)
        }


        // export 语句
        if (node.type === 'ExportNamedDeclaration') {
            const source = node.source
            const specifiers = node.specifiers
            const declaration = node.declaration
            let hasImport = false
            const adjust = {start: node.start, end: node.end}
            const adjustContent = ['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });']

            if (source && source.type === 'Literal') {
                // from './xx'
                deps.push(source.value)
                adjustContent.push(`var __TEMP__ = require('${source.value}');`)
                hasImport = true
            }

            if (!declaration) {
                // ignore
            } else if (declaration.type === 'VariableDeclaration') {
                const declarations = declaration.declarations

                if (declarations && Array.isArray(declarations)) {
                    declarations.forEach(declare => {
                        if (declare.type === 'VariableDeclarator') {
                            // export var xx = 'xx', xx = 'xx'
                            const id = declare.id
                            const init = declare.init

                            if (id && id.type === 'Identifier') {
                                adjust.notAddLines = true
                                adjustContent.push(`var ${id.name} = exports.${id.name} = ${init ? code.substring(init.start, init.end) : 'undefined'};`)
                            }
                        }
                    })
                }
            } else if (declaration.type === 'FunctionDeclaration') {
                // export function xx() {}
                const id = declaration.id

                if (id && id.type === 'Identifier') {
                    adjust.notAddLines = true
                    adjustContent.push(`exports.${id.name} = ${code.substring(declaration.start, declaration.end)};`)
                }
            } else if (declaration.type === 'ClassDeclaration') {
                // export class {}
                const id = declaration.id

                if (id && id.type === 'Identifier') {
                    adjust.notAddLines = true
                    adjustContent.push(`exports.${id.name} = ${code.substring(declaration.start, declaration.end)};`)
                }
            }

            if (specifiers && Array.isArray(specifiers)) {
                specifiers.forEach(specifier => {
                    if (specifier.type === 'ExportSpecifier') {
                        // export { xx, xx as xx }
                        const local = specifier.local
                        const exported = specifier.exported

                        if (local.type === 'Identifier' && exported.type === 'Identifier') {
                            adjustContent.push(`Object.defineProperty(exports, '${exported.name}', { enumerable: true, configurable: true, get: function() { return ${hasImport ? '__TEMP__.' : ''}${local.name}; } });`)
                        }
                    }
                })
            }

            adjust.adjustContent = adjustContent.join('')
            adjustList.push(adjust)
        } else if (node.type === 'ExportAllDeclaration') {
            // export *
            const source = node.source
            const adjust = {start: node.start, end: node.end}
            const adjustContent = ['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });']

            if (source && source.type === 'Literal') {
                // from './xx'
                deps.push(source.value)
                adjustContent.push(`var __TEMP__ = require('${source.value}');`)
            }

            adjustContent.push('Object.keys(__TEMP__).forEach(function(k) { if (k === "default" || k === "__esModule") return; Object.defineProperty(exports, k, { enumerable: true, configurable: true, get: function() { return __TEMP__[k]; } }); });')
            adjust.adjustContent = adjustContent.join('')
            adjustList.push(adjust)
        } else if (node.type === 'ExportDefaultDeclaration') {
            // export default xx
            const declaration = node.declaration
            const adjust = {start: node.start, end: node.end}
            const adjustContent = ['if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });']

            if (declaration) {
                adjust.notAddLines = true
                adjustContent.push(`exports.default = ${code.substring(declaration.start, declaration.end)};`)
            }

            adjust.adjustContent = adjustContent.join('')
            adjustList.push(adjust)
        }

        // require 赋值
        const expression = node.expression
        if (node.type === 'ExpressionStatement' && expression && expression.type === 'AssignmentExpression' && expression.right.type === 'Identifier' && expression.right.name === 'require') {
            console.warn(`assign require function to a variable is not allowed: ${jsPath} at line ${node.loc.start.line} ~ ${node.loc.end.line}`)
        }

        // 声明变量等于 require
        const declarations = node.declarations
        if (node.type === 'VariableDeclaration' && declarations.length > 0) {
            declarations.forEach((declaration) => {
                const init = declaration.init
                if (declaration.type === 'VariableDeclarator' && init && init.type === 'Identifier' && init.name === 'require') {
                    console.warn(`assign require function to a variable is not allowed: ${jsPath} at line ${node.loc.start.line} ~ ${node.loc.end.line}`)
                }
            })
        }
    })

    // 从后往前调整代码
    adjustList = adjustList.sort((a, b) => b.start - a.start)
    adjustList.forEach(adjust => {
        const sourceCode = code.substring(adjust.start, adjust.end)
        const lines = adjust.notAddLines ? 0 : sourceCode.split('\n').length

        code = code.substring(0, adjust.start) + adjust.adjustContent + (new Array(lines)).join('\n') + code.substring(adjust.end)
    })

    return {deps, parsedContent: code}
}

/**
 * 解析 node_modules 的 js 文件
 */
function parseJs(rootDir, jsPath, jsList, idMap) {
    jsPath = path.normalize(jsPath)
    if (idMap[jsPath]) return idMap[jsPath]

    const content = fs.readFileSync(jsPath, 'utf8')
    const id = getId()
    const name = path.relative(rootDir, jsPath) // 源文件的相对路径

    if (/\.json$/.test(jsPath)) {
        // 解析到 json 文件
        const jsInfo = {
            id,
            name,
            content: `module.exports = ${content}`,
            deps: [],
            depsMap: {},
        }

        idMap[jsPath] = id // 记录已经解析过的 js
        jsList.push(jsInfo)
    } else {
        const {deps, parsedContent} = parseDeps(content, jsPath)
        const jsInfo = {
            id,
            name,
            content: parsedContent,
            deps,
            depsMap: {},
        }

        idMap[jsPath] = id // 记录已经解析过的 js
        jsList.push(jsInfo)

        for (const dep of deps) {
            let depId
            let depPath = path.join(path.dirname(jsPath), dep)

            if (!/\.js$/.test(depPath) && !/\.json$/.test(depPath)) {
                // fs.stat 会以不区分大小的方式判断文件格式的问题，下述代码会先判断目录再补充后缀判断文件，可能会引发同名不同大小写的路径被优先判断成目录，所以此处优先判断一下文件是否存在
                const testDepPath = depPath + '.js'

                try {
                    fs.accessSync(testDepPath)
                    depPath = testDepPath
                } catch (err) {
                    // ignore
                }
            }

            try {
                const fileStat = fs.statSync(depPath)
                if (fileStat && fileStat.isDirectory()) {
                    // 目录，补全 index.js
                    depPath = path.join(depPath, 'index.js')
                }
            } catch (err) {
                // ignore
            }

            if (!/\.js$/.test(depPath) && !/\.json$/.test(depPath)) {
                // 缺少后缀
                depPath += '.js'
            }

            try {
                // 解析依赖的 js 文件
                fs.accessSync(depPath)
                depId = parseJs(rootDir, depPath, jsList, idMap)
            } catch (err) {
                // ignore
            }

            if (depId) {
                jsInfo.depsMap[dep] = depId // 记录依赖路径和 id 的对应关系
            }
        }
    }

    return id
}

/**
 * 添加 js 信息用于生成 sourcemap
 */
function addJsToMap(map, code, source, start) {
    const codeLen = code.split('\n').length

    for (let i = 1; i <= codeLen; i++) {
        map.addMapping({
            generated: {
                line: start + i,
                column: 0
            },
            original: {
                line: i,
                column: 0
            },
            source,
        })
        map.setSourceContent(source, code)
    }
}

/**
 * 打包 node_modules 的 js 文件
 */
function packJs(mainJsPath) {
    const map = new sourcemap.SourceMapGenerator({file: 'index.js'})
    const jsList = []
    const idMap = {}

    parseJs(path.dirname(mainJsPath), mainJsPath, jsList, idMap) // 解析 js

    const jsContent = [
        'module.exports = (function() {',
        'var __MODS__ = {};',
        'var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };',
        'var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };',
        'var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };',
        'var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };'
    ]
    if (jsList.length) {
        // 入口文件
        const mainJsInfo = jsList.shift()
        jsContent.push(`__DEFINE__(${mainJsInfo.id}, function(require, module, exports) {`)
        addJsToMap(map, mainJsInfo.content, mainJsInfo.name, jsContent.length) // 添加到 sourcemap
        jsContent.push(mainJsInfo.content)
        jsContent.push(`}, function(modId) {var map = ${JSON.stringify(mainJsInfo.depsMap)}; return __REQUIRE__(map[modId], modId); })`)

        // 其他依赖文件
        for (const jsInfo of jsList) {
            jsContent.push(`__DEFINE__(${jsInfo.id}, function(require, module, exports) {`)
            addJsToMap(map, jsInfo.content, jsInfo.name, jsContent.length) // 添加到 sourcemap
            jsContent.push(jsInfo.content)
            jsContent.push(`}, function(modId) { var map = ${JSON.stringify(jsInfo.depsMap)}; return __REQUIRE__(map[modId], modId); })`)
        }

        jsContent.push(`return __REQUIRE__(${mainJsInfo.id});`)
    }
    jsContent.push('})()')
    jsContent.push('//# sourceMappingURL=index.js.map')

    return {
        js: jsContent.join('\n'),
        map: map.toString(),
    }
}

/**
 * 获取目录中的 node_moudles
 */
function pack(entry, output) {
    const pack = packJs(entry)

    if (pack) {
        writeFile(pack.js, path.join(output, './index.js'))
        writeFile(pack.map, path.join(output, './index.js.map'))
    }
}

module.exports = {
    pack,
    copyFile,
}
