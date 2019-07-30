const parser = require('./parser')

let noCheckReduce

function generateHtml(node) {
    // 文本节点
    if (node.type === 'text') return node.content

    // 判断节点属性
    for (const attr of node.attrs) {
        // 检查是否需要删减
        if (attr.name === 'check-reduce') {
            noCheckReduce = false
            return ''
        }

        // 检查是否需要替换 tagname
        if (attr.name === 'check-replace-tagname') {
            node.tagName = attr.value
        }
    }

    const content = []

    // begin
    content.push(`<${node.tagName} ${node.attrs.map(attr => (attr.value ? attr.name + '="' + attr.value + '"' : attr.name)).join(' ')}>`)
    // content
    if (!node.unary) content.push(node.children.map(child => generateHtml(child)).join(''))
    // end
    content.push(`</${node.tagName}>`)

    return content.join('')
}

module.exports = function(source) {
    let content = []
    noCheckReduce = true
    try {
        parser.parse(source).forEach(node => {
            content.push(generateHtml(node))
        })
    } catch (err) {
        content = [source]
        console.error(err)
    }

    if (noCheckReduce) return source
    else return content.join('\n')
}
