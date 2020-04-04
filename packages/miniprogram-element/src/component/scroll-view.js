/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
 */
module.exports = {
    properties: [{
        name: 'scrollX',
        get(domNode) {
            return !!domNode.getAttribute('scroll-x')
        },
    }, {
        name: 'scrollY',
        get(domNode) {
            return !!domNode.getAttribute('scroll-y')
        },
    }, {
        name: 'upperThreshold',
        get(domNode) {
            return domNode.getAttribute('upper-threshold') || '50'
        },
    }, {
        name: 'lowerThreshold',
        get(domNode) {
            return domNode.getAttribute('lower-threshold') || '50'
        },
    }, {
        name: 'scrollTop',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-top') || ''
        },
    }, {
        name: 'scrollLeft',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-left') || ''
        },
    }, {
        name: 'scrollIntoView',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-into-view') || ''
        },
    }, {
        name: 'scrollWithAnimation',
        get(domNode) {
            return !!domNode.getAttribute('scroll-with-animation')
        },
    }, {
        name: 'enableBackToTop',
        get(domNode) {
            return !!domNode.getAttribute('enable-back-to-top')
        },
    }, {
        name: 'enableFlex',
        get(domNode) {
            return !!domNode.getAttribute('enable-flex')
        },
    }],
    handles: {
        onScrollViewScrolltoupper(evt) {
            this.callSingleEvent('scrolltoupper', evt)
        },

        onScrollViewScrolltolower(evt) {
            this.callSingleEvent('scrolltolower', evt)
        },

        onScrollViewScroll(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('scroll-into-view', '')
            domNode.$$setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop)
            domNode.$$setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.scrollIntoView = ''
            domNode._oldValues.scrollTop = evt.detail.scrollTop
            domNode._oldValues.scrollLeft = evt.detail.scrollLeft

            this.callSingleEvent('scroll', evt)
        },
    },
}
