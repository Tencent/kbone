import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpMsg extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpMsg.observedAttributes, () => {
            this.msg = this.shadowRoot.querySelector('.weui-msg')
            this.iconDom = this.shadowRoot.querySelector('#icon')
            this.iconImg = this.shadowRoot.querySelector('#icon-img')
            this.titleDom = this.shadowRoot.querySelector('.weui-msg__title')
            this.descDom = this.shadowRoot.querySelector('.weui-msg__desc span')
            this.slotDesc = this.shadowRoot.querySelector('#slot-desc')
        })
    }

    static register() {
        customElements.define('mp-msg', MpMsg)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.msg.className = `weui-msg ${this.extClass}`
        } else if (name === 'type') {
            const type = this.type
            this.iconDom.classList.toggle('hide', !type)
            this.iconImg.classList.toggle('hide', type)
            if (type) this.iconDom.setAttribute('type', type)
        } else if (name === 'size') {
            this.iconDom.setAttribute('size', this.size)
        } else if (name === 'icon') {
            const icon = this.icon
            this.iconDom.classList.toggle('hide', icon)
            this.iconImg.classList.toggle('hide', !icon)
            if (icon) this.iconImg.setAttribute('src', icon)
        } else if (name === 'title') {
            this.titleDom.innerText = this.title
        } else if (name === 'desc') {
            const desc = this.desc
            this.descDom.classList.toggle('hide', !desc)
            this.slotDesc.classList.toggle('hide', desc)
            if (desc) this.descDom.innerText = desc
        }
    }

    static get observedAttributes() {
        return ['type', 'size', 'icon', 'title', 'desc', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get type() {
        return this.getAttribute('type')
    }

    get size() {
        return this.getNumberValue('size', 64)
    }

    get icon() {
        return this.getAttribute('icon')
    }

    get title() {
        return this.getAttribute('title')
    }

    get desc() {
        return this.getAttribute('desc')
    }
}
