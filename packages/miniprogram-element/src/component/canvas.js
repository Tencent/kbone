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
            this.callSingleEvent('canvastouchstart', evt)
        },

        onCanvasTouchMove(evt) {
            this.callSingleEvent('canvastouchmove', evt)
        },

        onCanvasTouchEnd(evt) {
            this.callSingleEvent('canvastouchend', evt)
        },

        onCanvasTouchCancel(evt) {
            this.callSingleEvent('canvastouchcancel', evt)
        },

        onCanvasLongTap(evt) {
            this.callSingleEvent('longtap', evt)
        },

        onCanvasError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}
