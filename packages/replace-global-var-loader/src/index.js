const acorn = require('acorn')
const acornGlobals = require('acorn-globals')
const MagicString = require('magic-string')

const ignoreGlobalVar = [
    'define', 'module', 'exports', 'require', 'global', 'window', 'document',
    // js 全局变量
    'Array', 'ArrayBuffer', 'Boolean', 'DataView', 'Date', 'Error', 'EvalError', 'Float32Array', 'Float64Array', 'Function', 'Infinity', 'Int16Array', 'Int32Array', 'Int8Array', 'Intl', 'Intl.Collator', 'Intl.DateTimeFormat', 'Intl.NumberFormat', 'JSON', 'Map', 'Math', 'NaN', 'Number', 'Object', 'Promise', 'Proxy', 'RangeError', 'ReferenceError', 'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'SyntaxError', 'TypeError', 'URIError', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'WeakMap', 'WeakSet', 'WebAssembly', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape', 'eval', 'isFinite', 'isNaN', 'null', 'parseFloat', 'parseInt', 'undefined', 'unescape', 'console', 'requestAnimationFrame', 'cancelAnimationFrame',
    // 直接在 window 里实现
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
    // 小程序特有全局量
    'App', 'getApp', 'Page', 'getCurrentPages', 'wx', 'requirePlugin', 'definePlugin'
]

module.exports = function(source) {
    // 解析代码
    const ast = acorn.parse(source, {
        sourceType: 'script',
        locations: true,
        ecmaVersion: 'latest',
    })
    const magicString = new MagicString(source)

    // 查找全局变量
    const globalVars = acornGlobals(ast)

    // 替换全局变量
    globalVars.forEach(globalVar => {
        globalVar.nodes.forEach(node => {
            if (node.name && ignoreGlobalVar.indexOf(node.name) < 0) {
                magicString.overwrite(node.start, node.end, `window['${node.name}']`)
            }
        })
    })

    return magicString.toString()
}
