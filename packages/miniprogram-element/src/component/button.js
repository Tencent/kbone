/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/button.html
 */
module.exports = {
    properties: [{
        name: 'size',
        get(domNode) {
            return domNode.getAttribute('size') || 'default'
        },
    }, {
        name: 'type',
        get(domNode) {
            // 如果使用默认值 default，基础库中会补充 wx-button[type=default]，导致部分样式优先级处理有问题
            return domNode.getAttribute('type') || undefined
        },
    }, {
        name: 'plain',
        get(domNode) {
            return !!domNode.getAttribute('plain')
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'loading',
        get(domNode) {
            return !!domNode.getAttribute('loading')
        },
    }, {
        name: 'formType',
        get(domNode) {
            return domNode.getAttribute('form-type') || ''
        },
    }, {
        name: 'openType',
        get(domNode) {
            return domNode.getAttribute('open-type') || ''
        },
    }, {
        name: 'hoverClass',
        get(domNode) {
            return domNode.getAttribute('hover-class') || 'button-hover'
        },
    }, {
        name: 'hoverStopPropagation',
        get(domNode) {
            return !!domNode.getAttribute('hover-stop-propagation')
        },
    }, {
        name: 'hoverStartTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-start-time'))
            return !isNaN(value) ? value : 20
        },
    }, {
        name: 'hoverStayTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-stay-time'))
            return !isNaN(value) ? value : 70
        },
    }, {
        name: 'lang',
        get(domNode) {
            return domNode.getAttribute('lang') || 'en'
        },
    }, {
        name: 'sessionFrom',
        get(domNode) {
            return domNode.getAttribute('session-from') || ''
        },
    }, {
        name: 'sendMessageTitle',
        get(domNode) {
            return domNode.getAttribute('send-message-title') || ''
        },
    }, {
        name: 'sendMessagePath',
        get(domNode) {
            return domNode.getAttribute('send-message-path') || ''
        },
    }, {
        name: 'sendMessageImg',
        get(domNode) {
            return domNode.getAttribute('send-message-img') || ''
        },
    }, {
        name: 'appParameter',
        get(domNode) {
            return domNode.getAttribute('app-parameter') || ''
        },
    }, {
        name: 'showMessageCard',
        get(domNode) {
            return !!domNode.getAttribute('show-message-card')
        },
    }, {
        name: 'businessId',
        get(domNode) {
            return domNode.getAttribute('business-id') || ''
        },
    }],
    handles: {
        onButtonGetUserInfo(evt) {
            this.callSingleEvent('getuserinfo', evt)
        },

        onButtonContact(evt) {
            this.callSingleEvent('contact', evt)
        },

        onButtonGetPhoneNumber(evt) {
            this.callSingleEvent('getphonenumber', evt)
        },

        onButtonError(evt) {
            this.callSingleEvent('error', evt)
        },

        onButtonOpenSetting(evt) {
            this.callSingleEvent('opensetting', evt)
        },

        onButtonLaunchApp(evt) {
            this.callSingleEvent('launchapp', evt)
        },

        onButtonGetRealnameAuthInfo(evt) {
            // 已废弃，建议使用：https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-checkrealnameinfo.html
            this.callSingleEvent('getrealnameauthinfo', evt)
        },
    },
}
