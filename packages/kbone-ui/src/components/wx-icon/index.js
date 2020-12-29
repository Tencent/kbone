import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import fontStyle from './font.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxIcon extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxIcon.observedAttributes, () => {
            this.i = this.shadowRoot.querySelector('i')
        })
    }

    static register() {
        const fontStyleDom = document.createElement('style')
        fontStyleDom.innerHTML = fontStyle
        document.head.appendChild(fontStyleDom)

        customElements.define('wx-icon', WxIcon)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'type') {
            this.i.className = `wx-icon-${this.type}`
        } else if (name === 'size') {
            this.i.style.fontSize = `${this.size}px`
        } else if (name === 'color') {
            this.i.style.color = this.color
        }
    }

    static get observedAttributes() {
        return ['type', 'size', 'color', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get type() {
        return this.getAttribute('type')
    }

    get size() {
        return this.getNumberValue('size', 23)
    }

    get color() {
        return this.getAttribute('color')
    }
}
