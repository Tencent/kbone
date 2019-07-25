const mp = require('miniprogram-render')
const _ = require('./utils')

const {
    cache,
    tool,
} = mp.$$adapter

module.exports = {
    /**
     * 初始化
     */
    init(data) {
        const tagName = this.domNode.tagName
        if (tagName === 'WX-COMPONENT') this.initWxComponent(data)
        if (tagName === 'IMG') _.checkComponentAttr('image', this.domNode, data)
        if (tagName === 'INPUT') _.checkComponentAttr('input', this.domNode, data)
        if (tagName === 'VIDEO') this.initVideo(data)

        // 因为无法支持 iframe，所以需要显示提示文字
        if (tagName === 'IFRAME') this.initNotSupport(data)
    },

    /**
     * 特殊内置组件
     */
    initWxComponent(data) {
        const wxCompName = this.domNode.$$behavior

        data.wxCompName = this.domNode.$$behavior
        data.content = this.domNode.$$content
        data.class = this.domNode.$$domInfo.class || ''
        data.style = this.domNode.style.cssText

        if (data.wxCompName === 'button') {
            _.checkAttrUpdate(this.data, this.domNode, data, ['disabled', 'openType'])
        } else if (wxCompName === 'picker') {
            _.checkComponentAttr('picker', this.domNode, data)
        }
    },

    /**
     * 不支持组件，均转换成 view
     */
    initNotSupport(data) {
        _.checkComponentAttr('view', this.domNode, data)
        
        // TODO: remove
        data.content = this.domNode.$$content
    },

    /**
     * image
     */
    onImgLoad(evt) {
        if (!this.domNode) return

        // 设置宽高
        this.domNode.$$width = evt.detail.width
        this.domNode.$$height = evt.detail.height

        this.callSimpleEvent('load', evt)
    },

    onImgError() {
        this.callSimpleEvent('error')
    },

    /**
     * input
     */
    onInputInput(evt) {
        if (!this.domNode) return

        this.domNode.value = evt.detail.value
        this.callSimpleEvent('input', evt)
    },

    onInputBlur() {
        this.callSimpleEvent('blur')
    },

    onInputFocus() {
        this.callSimpleEvent('focus')
    },

    onInputConfirm() {
        this.callSimpleEvent('confirm')
    },

    /**
     * video
     */
    initVideo(data) {
        const window = cache.getWindow(this.pageId)

        data.wxCompName = 'video'
        data.src = tool.completeURL(this.domNode.src, window.location.origin, true)
        data.poster = tool.completeURL(this.domNode.poster, window.location.origin, true)

        _.checkAttrUpdate(this.data, this.domNode, data, ['autoplay', 'loop', 'muted', 'controls'])
    },

    onVideoPlay() {
        this.callSimpleEvent('play')
    },

    onVideoPause() {
        this.callSimpleEvent('pause')
    },

    onVideoEnded() {
        this.callSimpleEvent('ended')
    },

    onVideoTimeUpdate(evt) {
        if (!this.domNode) return

        this.domNode.setAttribute('currentTime', evt.detail.currentTime)
        this.callSimpleEvent('timeupdate', evt)
    },

    onVideoWaiting() {
        this.callSimpleEvent('waiting')
    },

    onVideoError() {
        this.callSimpleEvent('error')
    },

    onVideoProgress(evt) {
        if (!this.domNode) return

        this.domNode.setAttribute('buffered', evt.detail.buffered)
        this.callSimpleEvent('progress', evt)
    },

    /**
     * picker
     */
    onPickerChange(evt) {
        if (!this.domNode) return

        this.domNode.setAttribute('value', evt.detail.value)
        this.callSimpleEvent('change', evt)
    },

    onPickerColumnChange() {
        this.callSimpleEvent('columnchange')
    },

    onPickerCancel() {
        this.callSimpleEvent('cancel')
    },
}
