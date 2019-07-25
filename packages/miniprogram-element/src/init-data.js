const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

module.exports = {
    'wx-component': [
        { name: 'class', value: '' },
        { name: 'style', value: '' },
        { name: 'content', value: '' },
    ],
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/component/view.html
     */
    view: [{
        name: 'hoverClass',
        get(domNode) {
            return domNode.getAttribute('hover-class') || 'none'
        },
    }, {
        name: 'hoverStopPropagation',
        get(domNode) {
            return !!domNode.getAttribute('hover-stop-propagation')
        },
    },
    {
        name: 'hoverStartTime',
        get(domNode) {
            const value = domNode.getAttribute('hover-start-time')
            return value !== undefined ? value : 50
        },
    }, {
        name: 'hoverStayTime',
        get(domNode) {
            const value = domNode.getAttribute('hover-stay-time')
            return value !== undefined ? value : 400
        },
    }],
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/component/input.html
     */
    input: [{
        name: 'value',
        get(domNode) {
            return domNode.value
        },
    }, {
        name: 'type',
        get(domNode) {
            const value = domNode.type
            if (value === 'number') return 'digit' // 调整为带小数点
            return value || 'text'
        },
    }, {
        name: 'password',
        get(domNode) {
            const value = domNode.getAttribute('password')
            const typeValue = domNode.getAttribute('type')
            return value !== undefined ? !!value : (typeValue === 'password')
        },
    }, {
        name: 'placeholder',
        get(domNode) {
            return domNode.placeholder
        },
    }, {
        name: 'placeholderStyle',
        get(domNode) {
            return domNode.getAttribute('placeholder-style') || ''
        },
    }, {
        name: 'placeholderClass',
        get(domNode) {
            return domNode.getAttribute('placeholder-class') || 'input-placeholder'
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return domNode.disabled
        },
    }, {
        name: 'maxlength',
        get(domNode) {
            return +domNode.maxlength
        },
    }, {
        name: 'cursorSpacing',
        get(domNode) {
            return domNode.getAttribute('cursor-spacing') || 0
        },
    }, {
        name: 'autoFocus',
        get(domNode) {
            return !!domNode.getAttribute('auto-focus')
        },
    }, {
        name: 'focus',
        get(domNode) {
            if (typeof domNode.$$focus === 'boolean') return domNode.$$focus
            return false
        },
    }, {
        name: 'confirmType',
        get(domNode) {
            return domNode.getAttribute('confirm-type') || 'done'
        },
    }, {
        name: 'confirmHold',
        get(domNode) {
            return !!domNode.getAttribute('confirm-hold')
        },
    }, {
        name: 'cursor',
        get(domNode) {
            const value = +domNode.getAttribute('cursor')
            return !isNaN(value) ? value : undefined
        },
    }, {
        name: 'selectionStart',
        get(domNode) {
            const value = domNode.getAttribute('selection-start')
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionEnd',
        get(domNode) {
            const value = domNode.getAttribute('selection-end')
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'adjustPosition',
        get(domNode) {
            const value = domNode.getAttribute('adjust-position')
            return value !== undefined ? !!value : true
        },
    }],
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/component/video.html
     * TODO
     */
    video: [
    {
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return tool.completeURL(domNode.src, window.location.origin, true)
        },
    }, {
        name: 'autoplay',
        get(domNode) {
            return domNode.autoplay
        },
    }, {
        name: 'loop',
        get(domNode) {
            return domNode.loop
        },
    }, {
        name: 'muted',
        get(domNode) {
            return domNode.muted
        },
    }, {
        name: 'controls',
        get(domNode) {
            return domNode.controls
        },
    }, {
        name: 'poster',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return tool.completeURL(domNode.src, window.location.origin, true)
        },
    }],
    /**
     * TODO
     */
    button: [
        { name: 'openType', value: undefined },
        { name: 'disabled', value: false },
    ],
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
     */
    picker: [{
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'selector'
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'range',
        get(domNode) {
            return domNode.getAttribute('range') || []
        },
    }, {
        name: 'rangeKey',
        get(domNode) {
            return domNode.getAttribute('range-key') || ''
        },
    }, {
        name: 'value',
        get(domNode) {
            const mode = domNode.getAttribute('mode') || 'selector'
            const value = domNode.getAttribute('value')
            if (mode === 'selector' || mode === 'multiSelector') {
                return +value || 0
            } else if (mode === 'time') {
                return value || ''
            } else if (mode === 'date') {
                return value || '0'
            } else if (mode === 'region') {
                return value || []
            }

            return value
        },
    }, {
        name: 'start',
        get(domNode) {
            return domNode.getAttribute('start') || ''
        },
    }, {
        name: 'end',
        get(domNode) {
            return domNode.getAttribute('end') || ''
        },
    }, {
        name: 'fields',
        get(domNode) {
            return domNode.getAttribute('fields') || 'day'
        },
    }, {
        name: 'customItem',
        get(domNode) {
            return domNode.getAttribute('custom-item') || ''
        }
    }],
    /**
     * TODO
     */
    iframe: [
        { name: 'content', value: '' },
    ],
    /**
     * https://developers.weixin.qq.com/miniprogram/dev/component/image.html
     */
    image: [{
        name: 'renderingMode',
        get(domNode) {
            return domNode.getAttribute('rendering-mode') || 'img'
        },
    }, {
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return tool.completeURL(domNode.src, window.location.origin, true)
        },
    }, {
        name: 'mode',
        get(domNode) {
            const value = domNode.getAttribute('mode')
            return value !== undefined ? value : 'scaleToFill'
        },
    }, {
        name: 'lazyLoad',
        get(domNode) {
            return !!domNode.getAttribute('lazy-load')
        },
    }, {
        name: 'showMenuByLongpress',
        get(domNode) {
            return !!domNode.getAttribute('show-menu-by-longpress')
        },
    }]
}
