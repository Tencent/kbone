/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html
 */
module.exports = {
    properties: [{
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || ''
        },
    }, {
        name: 'openGid',
        get(domNode) {
            return domNode.getAttribute('open-gid') || ''
        },
    }, {
        name: 'lang',
        get(domNode) {
            return domNode.getAttribute('lang') || 'en'
        },
    }, {
        name: 'defaultText',
        get(domNode) {
            return domNode.getAttribute('default-text') || ''
        },
    }, {
        name: 'defaultAvatar',
        get(domNode) {
            return domNode.getAttribute('default-avatar') || ''
        },
    }],
    handles: {
        onOpenDataError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}
