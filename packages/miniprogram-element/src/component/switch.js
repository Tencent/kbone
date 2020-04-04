/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
module.exports = {
    properties: [{
        name: 'checked',
        canBeUserChanged: true,
        get(domNode) {
            return !!domNode.getAttribute('checked')
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || 'switch'
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || '#04BE02'
        },
    }],
    handles: {
        onSwitchChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('checked', evt.detail.value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.checked = evt.detail.value

            this.callSingleEvent('change', evt)
        },
    },
}
