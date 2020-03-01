/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
 */
module.exports = {
    properties: [{
        name: 'nodes',
        get(domNode) {
            return domNode.getAttribute('nodes') || []
        },
    }, {
        name: 'space',
        get(domNode) {
            return domNode.getAttribute('space') || ''
        },
    }],
    handles: {},
}
