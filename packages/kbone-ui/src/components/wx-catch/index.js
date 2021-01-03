import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const TOUCH_EVENT_LIST = ['touchstart', 'touchmove', 'touchend', 'touchcancel']

export default class WxCatch extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCatch.observedAttributes)
        this._count = 0
        this.onCatchEvent._isInner = true
    }

    static register() {
        customElements.define('wx-catch', WxCatch)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('touchstart', this.onCatchEvent)
        this.addEventListener('touchmove', this.onCatchEvent)
        this.addEventListener('touchend', this.onCatchEvent)
        this.addEventListener('touchcancel', this.onCatchEvent)
        this.addEventListener('click', this.onCatchEvent)
        this.addEventListener('tap', this.onCatchEvent)
        this.addEventListener('longpress', this.onCatchEvent)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('touchstart', this.onCatchEvent)
        this.removeEventListener('touchmove', this.onCatchEvent)
        this.removeEventListener('touchend', this.onCatchEvent)
        this.removeEventListener('touchcancel', this.onCatchEvent)
        this.removeEventListener('click', this.onCatchEvent)
        this.removeEventListener('tap', this.onCatchEvent)
        this.removeEventListener('longpress', this.onCatchEvent)
    }

    addEventListener(type, listener, options) {
        if (TOUCH_EVENT_LIST.indexOf(type) >= 0 && !listener._isInner) this._count++
        super.addEventListener(type, listener, options)
    }

    removeEventListener(type, listener, options) {
        if (TOUCH_EVENT_LIST.indexOf(type) >= 0 && !listener._isInner) this._count--
        super.removeEventListener(type, listener, options)
    }

    onCatchEvent(evt) {
        evt.preventDefault()
        evt.stopPropagation()

        if (evt.type === 'tap' && !this._count) {
            // 当 touch 事件被 catch 的时候，会阻止 click 事件，所以当前节点没有绑定 touch 事件的时候，要恢复 click 事件
            evt.target.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}))
        }
    }
}
