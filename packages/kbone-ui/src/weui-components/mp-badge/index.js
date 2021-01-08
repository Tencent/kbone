import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

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

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (oldValue === newValue) return
        if (name === 'ext-class' || name === 'content') {
            this.badge.className = `weui-badge ${this.extClass} ${this.content ? 'weui-badge_dot' : ''}`
            if (name === 'content') this.badge.innerText = this.content
        }
    }

    static get observedAttributes() {
        return ['ext-class', 'content', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get extClass() {
        return this.getAttribute('ext-class')
    }

    get content() {
        return this.getAttribute('content')
    }
}
