/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html
 */
module.exports = {
    properties: [{
        name: 'value',
        get(domNode) {
            let value = domNode.getAttribute('value')
            if (typeof value === 'string') value = value.split(',').map(item => parseInt(item, 10)) // react 会直接将属性值转成字符串
            return value !== undefined ? value : []
        },
    }, {
        name: 'indicatorStyle',
        get(domNode) {
            return domNode.getAttribute('indicator-style') || ''
        },
    }, {
        name: 'indicatorClass',
        get(domNode) {
            return domNode.getAttribute('indicator-class') || ''
        },
    }, {
        name: 'maskStyle',
        get(domNode) {
            return domNode.getAttribute('mask-style') || ''
        },
    }, {
        name: 'maskClass',
        get(domNode) {
            return domNode.getAttribute('mask-class') || ''
        },
    }],
    handles: {
        onPickerViewChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)
            this.callSingleEvent('change', evt)
        },

        onPickerViewPickstart(evt) {
            this.callSingleEvent('pickstart', evt)
        },

        onPickerViewPickend(evt) {
            this.callSingleEvent('pickend', evt)
        },
    },
}
