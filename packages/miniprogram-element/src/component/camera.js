/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/camera.html
 */
module.exports = {
    properties: [{
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'normal'
        },
    }, {
        name: 'resolution',
        get(domNode) {
            return domNode.getAttribute('resolution') || 'medium'
        },
    }, {
        name: 'devicePosition',
        get(domNode) {
            return domNode.getAttribute('device-position') || 'back'
        },
    }, {
        name: 'flash',
        get(domNode) {
            return domNode.getAttribute('flash') || 'auto'
        },
    }, {
        name: 'frameSize',
        get(domNode) {
            return domNode.getAttribute('frame-size') || 'medium'
        },
    }],
    handles: {
        onCameraStop(evt) {
            this.callSingleEvent('stop', evt)
        },

        onCameraError(evt) {
            this.callSingleEvent('error', evt)
        },

        onCameraInitDone(evt) {
            this.callSingleEvent('initdone', evt)
        },

        onCameraScanCode(evt) {
            this.callSingleEvent('scancode', evt)
        },
    },
}
