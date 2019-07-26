// eslint-disable-next-line import/no-extraneous-dependencies
const mp = require('miniprogram-render')
const _ = require('./tool')
const video = require('../component/video')
const image = require('../component/image')
const input = require('../component/input')
const textarea = require('../component/textarea')
const picker = require('../component/picker')

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
        else if (tagName === 'IMG') _.checkComponentAttr('image', this.domNode, data)
        else if (tagName === 'INPUT') _.checkComponentAttr('input', this.domNode, data)
        else if (tagName === 'TEXTAREA') _.checkComponentAttr('textarea', this.domNode, data)
        else if (tagName === 'VIDEO') _.checkComponentAttr('video', this.domNode, data)
        else if (tagName === 'IFRAME') this.initNotSupport(data) // 因为无法支持 iframe，所以需要显示提示文字
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

    ...input.handles,
    ...textarea.handles,
    ...video.handles,
    ...picker.handles,
    ...image.handles,
}
