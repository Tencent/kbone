import Hover from '../hover'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxButton extends Hover {
    constructor() {
        super({
            defaultHoverClass: 'button-hover',
        })

        this.initShadowRoot(template, WxButton.observedAttributes)
    }

    static register() {
        customElements.define('wx-button', WxButton)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('tap', this.onTap)
    }

    static get observedAttributes() {
        return ['size', 'type', 'plain', 'loading', 'form-type', 'open-type', 'lang', 'session-from', 'send-message-title', 'send-message-path', 'send-message-img', 'app-parameter', 'show-message-card', ...Hover.observedAttributes]
    }

    /**
     * 属性
     */
    get size() {
        return this.getAttribute('size')
    }

    get type() {
        return this.getAttribute('type')
    }

    get plain() {
        return this.getBoolValue('plain')
    }

    get loading() {
        return this.getBoolValue('loading')
    }

    get formType() {
        return this.getAttribute('form-type')
    }

    get openType() {
        // open-type 不支持
        return null
    }

    get lang() {
        // lang 不支持
        return null
    }

    get sessionFrom() {
        // session-from 不支持
        return null
    }

    get sendMessageTitle() {
        // send-message-title 不支持
        return null
    }

    get sendMessagePath() {
        // send-message-path 不支持
        return null
    }

    get sendMessageImg() {
        // send-message-img 不支持
        return null
    }

    get appParameter() {
        // app-parameter 不支持
        return null
    }

    get showMessageCard() {
        // show-message-card 不支持
        return null
    }

    get hoverStartTime() {
        return this.getNumberValue('hover-start-time', 20)
    }

    get hoverStayTime() {
        return this.getNumberValue('hover-stay-time', 70)
    }

    /**
     * 监听按钮点击
     */
    onTap(evt) {
        // 已经被底层组件处理过，就不再处理
        if (evt._isProcessed) return
        evt._isProcessed = true

        if (this.formType === 'submit') this.dispatchEvent(new CustomEvent('formsubmit', {bubbles: true, cancelable: true}))
        else if (this.formType === 'reset') this.dispatchEvent(new CustomEvent('formreset', {bubbles: true, cancelable: true}))

        if (this._lock) return
        this._lock = true
        setTimeout(() => this._lock = false, 1000)

        if (this.openType) {
            // 不支持依赖微信客户端的 openType
            console.error(`[wx-button] openType ${this.openType} 不支持`)
        }
    }
}
