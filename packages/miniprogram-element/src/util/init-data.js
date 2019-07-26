const video = require('../component/video')
const image = require('../component/image')
const input = require('../component/input')
const textarea = require('../component/textarea')
const picker = require('../component/picker')

module.exports = {
    'wx-component': [
        {name: 'class', value: ''},
        {name: 'style', value: ''},
        {name: 'content', value: ''},
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
    input: input.properties,
    textarea: textarea.properties,
    video: video.properties,
    picker: picker.properties,
    image: image.properties,
    /**
     * TODO
     */
    iframe: [
        {name: 'content', value: ''},
    ],
    /**
     * TODO
     */
    button: [
        {name: 'openType', value: undefined},
        {name: 'disabled', value: false},
    ],
}
