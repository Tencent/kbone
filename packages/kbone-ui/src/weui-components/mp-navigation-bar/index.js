import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpNavigationBar extends WeuiBase {
    constructor() {
        super()

        this._displayStyle = ''

        this.initShadowRoot(template, MpNavigationBar.observedAttributes, () => {
            this.navigationBar = this.shadowRoot.querySelector('.weui-navigation-bar')
            this.inner = this.shadowRoot.querySelector('.weui-navigation-bar__inner')
            this.backButton = this.shadowRoot.querySelector('.weui-navigation-bar__buttons')
            this.backButtonInner = this.shadowRoot.querySelector('.weui-navigation-bar__btn_goback')
            this.slotLeft = this.shadowRoot.querySelector('#slot-left')
            this.loadingDom = this.shadowRoot.querySelector('.weui-navigation-bar__loading')
            this.titleDom = this.shadowRoot.querySelector('#title')
            this.slotCenter = this.shadowRoot.querySelector('#slot-center')
        })
    }

    static register() {
        customElements.define('mp-navigation-bar', MpNavigationBar)
    }

    connectedCallback() {
        super.connectedCallback()

        this.backButtonInner.addEventListener('tap', this.doBack)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.backButtonInner.removeEventListener('tap', this.doBack)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.navigationBar.className = `weui-navigation-bar ${this.extClass}`
        } else if (name === 'title') {
            const title = this.title
            this.titleDom.classList.toggle('hide', !title)
            this.slotCenter.classList.toggle('hide', !!title)
            if (title) this.titleDom.innerText = title
        } else if (name === 'back') {
            const back = this.back
            this.backButton.classList.toggle('hide', !back)
            this.slotLeft.classList.toggle('hide', back)
        } else if (name === 'background' || name === 'color') {
            this.updateInnerStyle()
        } else if (name === 'loading') {
            this.loadingDom.classList.toggle('hide', !this.loading)
        } else if (name === 'show') {
            const show = this.show
            if (this.animated) this._displayStyle = `opacity: ${show ? '1' : '0'};-webkit-transition:opacity 0.5s;transition:opacity 0.5s;`
            else this._displayStyle = `display: ${show ? '' : 'none'}`
            this.updateInnerStyle()
        }
    }

    static get observedAttributes() {
        return ['title', 'back', 'delta', 'background', 'color', 'loading', 'show', 'animated', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title')
    }

    get back() {
        return this.getBoolValue('back', true)
    }

    get delta() {
        return this.getNumberValue('delta', 1)
    }

    get background() {
        return this.getAttribute('background') || '#f8f8f8'
    }

    get color() {
        return this.getAttribute('color') || ''
    }

    get loading() {
        return this.getBoolValue('loading')
    }

    get show() {
        return this.getBoolValue('show', true)
    }

    get animated() {
        return this.getBoolValue('animated', true)
    }

    updateInnerStyle() {
        this.inner.style.cssText = `color: ${this.color};background: ${this.background};${this._displayStyle};`
    }

    /**
     * 点击后退按钮
     */
    doBack() {
        this.dispatchEvent(new CustomEvent('back', {bubbles: true, cancelable: true, detail: {delta: this.delta}}))
    }
}
