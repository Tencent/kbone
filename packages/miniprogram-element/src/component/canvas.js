/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
 */
module.exports = {
    properties: [{
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || ''
        },
    }, {
        name: 'canvasId',
        get(domNode) {
            return domNode.getAttribute('canvas-id') || ''
        },
    }, {
        name: 'disableScroll',
        get(domNode) {
            return !!domNode.getAttribute('disable-scroll')
        },
    }],
    handles: {
        onCanvasTouchStart(evt) {
            this.callSimpleEvent('canvastouchstart', evt)
        },

        onCanvasTouchMove(evt) {
            this.callSimpleEvent('canvastouchmove', evt)
        },

        onCanvasTouchEnd(evt) {
            this.callSimpleEvent('canvastouchend', evt)
        },

        onCanvasTouchCancel(evt) {
            this.callSimpleEvent('canvastouchcancel', evt)
        },

        onCanvasLongTap(evt) {
            this.callSimpleEvent('longtap', evt)
        },

        onCanvasError(evt) {
            this.callSimpleEvent('error', evt)
        },
    },
}
