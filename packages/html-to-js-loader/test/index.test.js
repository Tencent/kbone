const loader = require('../src/index')

const defaultStartCode = `
        module.exports = function () {
            const evtMap = {}
const generateDomTree = node => {
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
            }
const fragment = document.createDocumentFragment()
let node = null`
const defaultEndCode = `if (node) fragment.appendChild(node)
            return fragment
        }
    `

test('html-to-js-loader', () => {
    let res = loader(`
        <!-- a.html -->
        <div id="app">
            <div class="cnt"></div>
            <button onclick="console.log('123')"></button>
            <ul>
                <!-- 这是一段注释 -->
                <li>item1</li>
                <li>item2</li>
                <li>item3</li>
            </ul>
        </div>
    `)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
node = generateDomTree({"type":"comment","content":"a.html"})
if (node) fragment.appendChild(node)
evtMap[1111111111111] = function() {console.log('123')}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"id","value":"app"}],"unary":false,"children":[{"type":"element","tagName":"div","attrs":[{"name":"class","value":"cnt"}],"unary":false,"children":[]},{"type":"element","tagName":"button","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]},{"type":"element","tagName":"ul","attrs":[],"unary":false,"children":[{"type":"comment","content":"这是一段注释"},{"type":"element","tagName":"li","attrs":[],"unary":false,"children":[{"type":"text","content":"item1"}]},{"type":"element","tagName":"li","attrs":[],"unary":false,"children":[{"type":"text","content":"item2"}]},{"type":"element","tagName":"li","attrs":[],"unary":false,"children":[{"type":"text","content":"item3"}]}]}]})
${defaultEndCode}`)

    // 无效点击
    res = loader(`<div onclick="javascript:;">`)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
evtMap[1111111111111] = function() {}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]})
${defaultEndCode}`)

    // 无效点击2
    res = loader(`<div onclick="javascript:void;">`)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
evtMap[1111111111111] = function() {}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]})
${defaultEndCode}`)

    // 无效点击3
    res = loader(`<div onclick="javascript:void(0);">`)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
evtMap[1111111111111] = function() {}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]})
${defaultEndCode}`)

    // 无效点击4
    res = loader(`<div onclick="javascript:void(0)">`)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
evtMap[1111111111111] = function() {}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]})
${defaultEndCode}`)

    // 点击前缀处理
    res = loader(`<div onclick="javascript:console.log('hahaha')">`)
    res = res.replace(/[\d]{13}/ig, '1111111111111')
    expect(res).toBe(`${defaultStartCode}
evtMap[1111111111111] = function() {console.log('hahaha')}
node = generateDomTree({"type":"element","tagName":"div","attrs":[{"name":"onclick","value":"1111111111111"}],"unary":false,"children":[]})
${defaultEndCode}`)
})
