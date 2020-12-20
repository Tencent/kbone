// 标签过滤规则，白名单，NA 表示不支持任何属性，FA 表示过滤属性
const RULES = {
    a: 'NA',
    abbr: 'NA',
    address: 'NA',
    article: 'NA',
    aside: 'NA',
    b: 'NA',
    bdi: 'NA',
    bdo: 'FA',
    big: 'NA',
    blockquote: 'NA',
    br: 'NA',
    caption: 'NA',
    center: 'NA',
    cite: 'NA',
    code: 'NA',
    col: 'FA',
    colgroup: 'FA',
    dd: 'NA',
    del: 'NA',
    div: 'NA',
    dl: 'NA',
    dt: 'NA',
    em: 'NA',
    fieldset: 'NA',
    font: 'NA',
    footer: 'NA',
    h1: 'NA',
    h2: 'NA',
    h3: 'NA',
    h4: 'NA',
    h5: 'NA',
    h6: 'NA',
    header: 'NA',
    hr: 'NA',
    i: 'NA',
    img: 'FA',
    ins: 'NA',
    label: 'NA',
    legend: 'NA',
    li: 'NA',
    mark: 'NA',
    nav: 'NA',
    ol: 'FA',
    p: 'NA',
    pre: 'NA',
    q: 'NA',
    rt: 'NA',
    ruby: 'NA',
    s: 'NA',
    section: 'NA',
    small: 'NA',
    span: 'NA',
    strong: 'NA',
    sub: 'NA',
    sup: 'NA',
    table: 'FA',
    tbody: 'NA',
    td: 'FA',
    tfoot: 'NA',
    th: 'FA',
    thead: 'NA',
    tr: 'FA',
    tt: 'NA',
    u: 'NA',
    ul: 'NA'
}

// 属性过滤规则，白名单，NF 表示不过滤
const ATTRS_RULES = {
    bdo: {
        dir: 'NF'
    },
    col: {
        span: 'NF',
        width: 'NF'
    },
    colgroup: {
        span: 'NF',
        width: 'NF'
    },
    img: {
        alt: 'NF',
        src: 'NF',
        height: 'NF',
        width: 'NF'
    },
    ol: {
        start: 'NF',
        type: 'NF'
    },
    table: {
        width: 'NF'
    },
    td: {
        colspan: 'NF',
        height: 'NF',
        rowspan: 'NF',
        width: 'NF'
    },
    th: {
        colspan: 'NF',
        height: 'NF',
        rowspan: 'NF',
        width: 'NF'
    },
    tr: {
        colspan: 'NF',
        height: 'NF',
        rowspan: 'NF',
        width: 'NF'
    }
}

/**
 * 解析实体字符
 */
const tempDiv = document.createElement('div')
function decodeEntities(str) {
    return str.replace(/&(([a-zA-Z]+)|(#x{0,1}[\da-zA-Z]+));/ig, all => {
        tempDiv.innerHTML = all
        return tempDiv.innerText
    })
}

const HtmlFilter = {
    createSpaceDecode(space) {
        if (space) {
            if (space === 'nbsp') {
                return str => str.replace(/ /g, '\u00A0')
            } else if (space === 'ensp') {
                return str => str.replace(/ /g, '\u2002')
            } else if (space === 'emsp') {
                return str => str.replace(/ /g, '\u2003')
            }
        }
        return str => str
    },

    parse(nodes, parent, spaceDecode) {
        nodes.map(node => {
            if (typeof node === 'object') {
                if (!node.type || node.type === 'node') {
                    // dom 结点
                    if (typeof node.name === 'string' && node.name !== '') {
                        const name = node.name.toLowerCase()

                        if (Object.prototype.hasOwnProperty.call(RULES, name)) {
                            const rule = RULES[name]
                            const dom = document.createElement(name)

                            if (dom) {
                                // 属性
                                if (typeof node.attrs === 'object') {
                                    Object.keys(node.attrs).forEach(key => {
                                        const value = decodeEntities(node.attrs[key])

                                        if (key === 'class' || key === 'style' || key.startsWith('data-')) {
                                            // 直接放过的属性
                                            dom.setAttribute(key, value)
                                        } else if (rule === 'FA' && ATTRS_RULES[name] && ATTRS_RULES[name][key]) {
                                            // 白名单中的属性
                                            dom.setAttribute(key, value)
                                        }
                                    })
                                }

                                // 子节点
                                if (Array.isArray(node.children) && node.children.length) HtmlFilter.parse(node.children, dom, spaceDecode)

                                parent.appendChild(dom)
                            }
                        }
                    }
                } else if (node.type === 'text' && typeof node.text === 'string' && node.text !== '') {
                    // 文本结点
                    node.text = decodeEntities(spaceDecode(node.text))
                    parent.appendChild(document.createTextNode(node.text))
                }
            }
        })

        return parent
    }
}

export default HtmlFilter
