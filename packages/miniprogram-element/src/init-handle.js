// eslint-disable-next-line import/no-extraneous-dependencies
const mp = require('miniprogram-render')
const _ = require('./utils')

const {
    Event,
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
        if (tagName === 'VIDEO') _.checkComponentAttr('video', this.domNode, data)

        // 因为无法支持 iframe，所以需要显示提示文字
        if (tagName === 'IFRAME') this.initNotSupport(data)
    },

    /**
     * 触发简单节点事件
     */
    callSimpleEvent(eventName, evt) {
        if (!this.domNode) return

        this.domNode.$$trigger(eventName, {
            event: new Event({
                name: eventName,
                target: this.domNode,
                eventPhase: Event.AT_TARGET,
                detail: evt && evt.detail,
            }),
            currentTarget: this.domNode,
        })
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

    onImgError(evt) {
        this.callSimpleEvent('error', evt)
    },

    /**
     * input
     */
    onInputInput(evt) {
        if (!this.domNode) return

        this.domNode.value = evt.detail.value
        this.callSimpleEvent('input', evt)
    },

    onInputFocus(evt) {
        this.callSimpleEvent('focus', evt)
    },

    onInputBlur(evt) {
        this.callSimpleEvent('blur', evt)
    },

    onInputConfirm(evt) {
        this.callSimpleEvent('confirm', evt)
    },

    onInputKeyBoardHeightChange(evt) {
        this.callSimpleEvent('keyboardheightchange', evt)
    },

    /**
     * video
     */
    onVideoPlay(evt) {
        this.callSimpleEvent('play', evt)
    },

    onVideoPause(evt) {
        this.callSimpleEvent('pause', evt)
    },

    onVideoEnded(evt) {
        this.callSimpleEvent('ended', evt)
    },

    onVideoTimeUpdate(evt) {
        if (!this.domNode) return

        this.domNode.$$setAttributeWithoutUpdate('currentTime', evt.detail.currentTime)
        this.callSimpleEvent('timeupdate', evt)
    },

    onVideoFullScreenChange(evt) {
        this.callSimpleEvent('fullscreenchange', evt)
    },

    onVideoWaiting(evt) {
        this.callSimpleEvent('waiting', evt)
    },

    onVideoError(evt) {
        this.callSimpleEvent('error', evt)
    },

    onVideoProgress(evt) {
        if (!this.domNode) return

        this.domNode.$$setAttributeWithoutUpdate('buffered', evt.detail.buffered)
        this.callSimpleEvent('progress', evt)
    },

    /**
     * picker
     */
    onPickerChange(evt) {
        if (!this.domNode) return

        this.domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)
        this.callSimpleEvent('change', evt)
    },

    onPickerColumnChange(evt) {
        this.callSimpleEvent('columnchange', evt)
    },

    onPickerCancel(evt) {
        this.callSimpleEvent('cancel', evt)
    },
}
