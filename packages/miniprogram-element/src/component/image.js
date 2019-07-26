// eslint-disable-next-line import/no-extraneous-dependencies
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/image.html
 */
module.exports = {
    properties: [{
        name: 'renderingMode',
        get(domNode) {
            return domNode.getAttribute('rendering-mode') || 'img'
        },
    }, {
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }, {
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'scaleToFill'
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
    }],
    handles: {
        onImgLoad(evt) {
            if (!this.domNode) return
    
            // 设置宽高
            this.domNode.$$width = evt.detail.width
            this.domNode.$$height = evt.detail.height
    
            this.callSimpleEvent('load', evt)
        },
    
        onImgError(evt) {
            this.callSimpleEvent('error', evt)
        },
    },
}
