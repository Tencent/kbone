/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
 */

/**
 * 兼容 canvas 相关 touch 事件，基础库没有提供 currentTarget 的问题
 */
function dealWithEvt(evt) {
    if (!evt.currentTarget || !evt.currentTarget.dataset.privateNodeId) {
        // 取 target
        evt.currentTarget = evt.currentTarget || {dataset: {}}
        evt.currentTarget.dataset.privateNodeId = evt.target.dataset.privateNodeId
    }
}

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
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchstart', evt)
            this.onTouchStart(evt)
        },

        onCanvasTouchMove(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchmove', evt)
            this.onTouchMove(evt)
        },

        onCanvasTouchEnd(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchend', evt)
            this.onTouchEnd(evt)
        },

        onCanvasTouchCancel(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchcancel', evt)
            this.onTouchCancel(evt)
        },

        onCanvasLongTap(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('longtap', evt)
        },

        onCanvasError(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('error', evt)
        },
    },
}
