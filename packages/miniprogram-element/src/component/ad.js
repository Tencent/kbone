/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
module.exports = {
    properties: [{
        name: 'unitId',
        get(domNode) {
            return domNode.getAttribute('unit-id') || ''
        },
    }, {
        name: 'adIntervals',
        get(domNode) {
            const value = +domNode.getAttribute('ad-intervals')
            return !isNaN(value) ? value : 0
        },
    }],
    handles: {
        onAdLoad(evt) {
            this.callSimpleEvent('load', evt)
        },

        onAdError(evt) {
            this.callSimpleEvent('error', evt)
        },

        onAdClose(evt) {
            this.callSimpleEvent('close', evt)
        },
    },
}
