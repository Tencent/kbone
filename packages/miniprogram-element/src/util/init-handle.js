const _ = require('./tool')
const component = require('./component')

const {
    USE_TEMPLATE,
} = _
const {
    wxCompNameMap,
    handles,
} = component

module.exports = {
    /**
     * 初始化
     */
    init(data) {
        const domNode = this.domNode
        const tagName = domNode.tagName

        // 使用 template 渲染
        if (USE_TEMPLATE.indexOf(tagName) !== -1 || USE_TEMPLATE.indexOf(domNode.behavior) !== -1) return

        if (tagName === 'WX-COMPONENT') {
            // 内置组件
            data.wxCompName = domNode.behavior
            const wxCompName = wxCompNameMap[data.wxCompName]
            if (wxCompName) _.checkComponentAttr(wxCompName, domNode, data)
            else console.warn(`value "${data.wxCompName}" is not supported for wx-component's behavior`)
        } else if (tagName === 'WX-CUSTOM-COMPONENT') {
            // 自定义组件
            data.wxCustomCompName = domNode.behavior
            data.nodeId = this.nodeId
            data.pageId = this.pageId
        }
    },

    ...handles,
}
