/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/label.html
 */
module.exports = {
    properties: [{
        name: 'for',
        get(domNode) {
            return domNode.getAttribute('for') || ''
        },
    }],
    handles: {},
}
