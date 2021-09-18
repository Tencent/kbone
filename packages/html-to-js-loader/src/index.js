const parser = require('./parser')

module.exports = function(source) {
    // 解析成 ast
    let ast = null
    try {
        ast = parser.parse(source)
    } catch (err) {
        console.error(err)
        return source
    }

    if (!ast) return source

    const code = [
        `const evtMap = {}`,
        `const generateDomTree = node => {
                const {
                    type,
                    tagName = '',
                    attrs = [],
                    children = [],
                    content = '',
                } = node
        
                if (type === 'element') {
                    const element = document.createElement(tagName)
                    for (const attr of attrs) {
                        const name = attr.name
                        let value = attr.value

                        if (name.indexOf('on') === 0) {
                            element[name] = evtMap[value].bind(element)
                        } else {
                            if (name === 'style') value = value && value.replace('"', '\\'') || ''
                            element.setAttribute(name, value)
                        }
                    }
        
                    for (let child of children) {
                        child = generateDomTree(child)
                        if (child) element.appendChild(child)
                    }
        
                    return element
                } else if (type === 'text') {
                    return document.createTextNode(content
                        .replace(/&nbsp;/g, '\\u00A0')
                        .replace(/&ensp;/g, '\\u2002')
                        .replace(/&emsp;/g, '\\u2003')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&apos;/g, '\\'')
                        .replace(/&amp;/g, '&'))
                } else if (type === 'comment') {
                    return document.createComment()
                }
            }`,
        `const fragment = document.createDocumentFragment()`,
        `let node = null`,
    ]

    // 生成 dom 树
    let id = +new Date()
    const dealWithAstNode = node => {
        if (node.type === 'element') {
            if (node.attrs) {
                // 处理 onxxx 事件句柄
                for (const attr of node.attrs) {
                if (attr.name.indexOf('on') === 0) {
                    const currentId = ++id;
                    const value = attr.value.trim().replace(/^javascript:(void)?(\(0?\))?;?/ig, '')
                    code.push(`evtMap[${currentId}] = function() {${value}}`);
                    attr.value = `${currentId}`;
                }
                }
            }

            if (node.children) {
                for (let child of node.children) {
                    dealWithAstNode(child);
                }
            }
        }
    }
    ast.forEach((item) => {
        dealWithAstNode(item);
        code.push(`node = generateDomTree(${JSON.stringify(item)})`);
        code.push(`if (node) fragment.appendChild(node)`);
    })

    return `
        module.exports = function () {
            ${code.join("\n")}
            return fragment
        }
    `
}
