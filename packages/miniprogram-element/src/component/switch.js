/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
module.exports = {
    properties: [{
        name: 'checked',
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
            this.callSingleEvent('change', evt)
        },
    },
}
