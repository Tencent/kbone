import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpLoading extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpLoading.observedAttributes, () => {
            this.loading = this.shadowRoot.querySelector('#wx_loading_view')
            this.tipsDom = this.shadowRoot.querySelector('.weui-loadmore__tips')
            this.dotWhite = this.shadowRoot.querySelector('#dot-white')
            this.dotGray = this.shadowRoot.querySelector('#dot-gray')
            this.circle = this.shadowRoot.querySelector('#circle')
        })
    }

    static register() {
        customElements.define('mp-loading', MpLoading)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'show') {
            this.updateClass()
        } else if (name === 'animated') {
            this.updateStyle()
            this.updateClass()
        } else if (name === 'duration') {
            this.updateStyle()
        } else if (name === 'type') {
            const type = this.type
            this.dotWhite.classList.toggle('hide', type !== 'dot-white')
            this.dotGray.classList.toggle('hide', type !== 'dot-gray')
            this.circle.classList.toggle('hide', type !== 'circle')
        } else if (name === 'tips') {
            this.tipsDom.innerText = this.tips
        }
    }

    static get observedAttributes() {
        return ['show', 'animated', 'duration', 'type', 'tips', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get show() {
        return this.getBoolValue('show', true)
    }

    get animated() {
        return this.getAttribute('animated')
    }

    get duration() {
        return this.getNumberValue('duration', 350)
    }

    get type() {
        return this.getAttribute('type') || 'dot-gray'
    }

    get tips() {
        const value = this.getAttribute('tips')
        return value === undefined || value === null ? '加载中' : (value || '')
    }

    updateStyle() {
        this.loading.style.transition = this.animated ? `height ${this.duration}ms ease` : ''
    }

    updateClass() {
        this.loading.className = `wx_loading_view ${this.animated ? 'wx_loading_view__animated' : ''} ${!this.show ? 'wx_loading_view__hide' : ''} ${this.extClass}`
    }
}
