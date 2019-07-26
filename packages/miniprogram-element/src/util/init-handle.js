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
const WX_COMP_NAME_MAP = {
    picker: 'picker',
    IMG: 'image',
    INPUT: 'input',
    TEXTAREA: 'textarea',
    VIDEO: 'video',
}

module.exports = {
    WX_COMP_NAME_MAP,

    /**
     * 初始化
     */
    init(data) {
        const tagName = this.domNode.tagName
        if (tagName === 'WX-COMPONENT') {
            this.initWxComponent(data)
        } else if (tagName === 'IFRAME') {
            this.initNotSupport(data) // 因为无法支持 iframe，所以需要显示提示文字
        } else {
            const wxCompName = WX_COMP_NAME_MAP[tagName]
            if (wxCompName) _.checkComponentAttr(wxCompName, this.domNode, data)
        }
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
        data.wxCompName = this.domNode.$$behavior
        data.content = this.domNode.$$content
        data.class = this.domNode.$$domInfo.class || ''
        data.style = this.domNode.style.cssText

        if (this.domNode.$$behavior === 'button') {
            _.checkAttrUpdate(this.data, this.domNode, data, ['disabled', 'openType'])
        } else {
            const wxCompName = WX_COMP_NAME_MAP[this.domNode.$$behavior]
            if (wxCompName) _.checkComponentAttr(wxCompName, this.domNode, data)
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
