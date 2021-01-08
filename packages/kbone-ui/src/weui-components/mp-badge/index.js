import Base from '../../components/base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class MpBadge extends Base {
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
            let className = 'weui-badge'
            const extClass = this.extClass
            if (extClass) className += ` ${extClass}`
            if (this.content) className += ` weui-badge_dot`
            this.badge.className = className

            if (name === 'content') this.badge.innerText = this.content
        }
    }

    static get observedAttributes() {
        return ['ext-class', 'content', ...Base.observedAttributes]
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
