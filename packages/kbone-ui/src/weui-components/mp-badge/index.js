import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpBadge extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpBadge.observedAttributes, () => {
            this.badge = this.shadowRoot.querySelector('#badge')
        })
    }

    static register() {
        customElements.define('mp-badge', MpBadge)
    }

    connectedCallback() {
        super.connectedCallback()

        this.updateBadge()
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class' || name === 'content') {
            this.updateBadge()
        }
    }

    static get observedAttributes() {
        return ['content', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get content() {
        return this.getAttribute('content') || ''
    }

    updateBadge() {
        const content = this.content
        this.badge.className = `weui-badge ${this.extClass} ${!content ? 'weui-badge_dot' : ''}`
        this.badge.innerText = content
    }
}
