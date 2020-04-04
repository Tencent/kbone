/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/editor.html
 */
module.exports = {
    properties: [{
        name: 'readOnly',
        get(domNode) {
            return !!domNode.getAttribute('read-only')
        },
    }, {
        name: 'placeholder',
        get(domNode) {
            return domNode.getAttribute('placeholder') || ''
        },
    }, {
        name: 'showImgSize',
        get(domNode) {
            return !!domNode.getAttribute('show-img-size')
        },
    }, {
        name: 'showImgToolbar',
        get(domNode) {
            return !!domNode.getAttribute('show-img-toolbar')
        },
    }, {
        name: 'showImgResize',
        get(domNode) {
            return !!domNode.getAttribute('show-img-resize')
        },
    }],
    handles: {
        onEditorReady(evt) {
            this.callSingleEvent('ready', evt)
        },

        onEditorFocus(evt) {
            this.callSingleEvent('focus', evt)
        },

        onEditorBlur(evt) {
            this.callSingleEvent('blur', evt)
        },

        onEditorInput(evt) {
            this.callSingleEvent('input', evt)
        },

        onEditorStatusChange(evt) {
            this.callSingleEvent('statuschange', evt)
        },
    },
}
