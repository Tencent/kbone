import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

const typeClassMap = {
    warn: 'weui-toptips_warn',
    info: 'weui-toptips_info',
    success: 'weui-toptips_success',
    error: 'weui-toptips_error',
}

export default class MpToptips extends WeuiBase {
    constructor() {
        super()

        this._className = ''

        this.initShadowRoot(template, MpToptips.observedAttributes, () => {
            this.toptips = this.shadowRoot.querySelector('.weui-toptips')
            this.msgDom = this.shadowRoot.querySelector('#msg')
            this.slotMsg = this.shadowRoot.querySelector('#slot-msg')
        })
    }

    static register() {
        customElements.define('mp-toptips', MpToptips)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'type') {
            this._className = typeClassMap[this.type] || ''
            this.updateClass()
        } else if (name === 'show') {
            this.showToptips()
        } else if (name === 'msg') {
            this.updateMsg()
        }
    }

    static get observedAttributes() {
        return ['type', 'show', 'msg', 'delay', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get type() {
        return this.getAttribute('type')
    }

    get show() {
        return this.getBoolValue('show')
    }

    set show(value) {
        this.setAttribute('show', value)
    }

    get msg() {
        return this.getAttribute('msg') || ''
    }

    get delay() {
        return this.getNumberValue('delay', 2000)
    }

    updateMsg() {
        const msg = this.msg
        this.msgDom.classList.toggle('hide', !msg)
        this.slotMsg.classList.toggle('hide', !!msg)

        this.msgDom.innerText = msg
    }

    updateClass() {
        this.toptips.className = `weui-toptips ${this._className} ${this.extClass} ${this.show ? 'weui-toptips_show' : ''}`
    }

    showToptips() {
        if (this.show && this.delay) {
            setTimeout(() => {
                this.show = false
                this.dispatchEvent(new CustomEvent('hide', {bubbles: true, cancelable: true}))
            }, this.delay)
        }
        this.updateClass()
    }
}
