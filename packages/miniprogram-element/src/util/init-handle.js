const mp = require('miniprogram-render')
const _ = require('./tool')
const view = require('../component/view')
const video = require('../component/video')
const image = require('../component/image')
const input = require('../component/input')
const textarea = require('../component/textarea')
const picker = require('../component/picker')
const button = require('../component/button')
const map = require('../component/map')
const livePlayer = require('../component/live-player')
const livePusher = require('../component/live-pusher')

const {
    Event,
} = mp.$$adapter
const {
    WX_COMP_NAME_MAP,
    NOT_SUPPORT,
} = _

module.exports = {
    /**
     * 初始化
     */
    init(data) {
        const domNode = this.domNode
        const tagName = domNode.tagName

        if (tagName === 'WX-COMPONENT') {
            // 无可替换 html 标签
            data.wxCompName = domNode.$$behavior
            const wxCompName = WX_COMP_NAME_MAP[data.wxCompName]
            if (wxCompName) _.checkComponentAttr(wxCompName, domNode, data)
        } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
            // 不支持标签
            data.wxCompName = 'not-support'
            data.content = domNode.textContent
        } else {
            // 可替换 html 标签
            const wxCompName = WX_COMP_NAME_MAP[tagName]
            if (wxCompName) _.checkComponentAttr(wxCompName, domNode, data)
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

    ...view.handles,
    ...input.handles,
    ...textarea.handles,
    ...video.handles,
    ...picker.handles,
    ...image.handles,
    ...button.handles,
    ...map.handles,
    ...livePlayer.handles,
    ...livePusher.handles,
}
