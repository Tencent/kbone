import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxRadio extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxRadio.observedAttributes, () => {
            this.i = this.shadowRoot.querySelector('i')
        })
    }

    static register() {
        customElements.define('wx-radio', WxRadio)
    }

    connectedCallback() {
        super.connectedCallback()

        this._parent = findParent(this, parentNode => parentNode.tagName === 'WX-RADIO-GROUP')
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this._parent = null
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'value') {

        } else if (name === 'checked') {
            
        } else if (name === 'disabled') {
            
        } else if (name === 'color') {
            
        }
    }

    static get observedAttributes() {
        return ['value', 'checked', 'disabled', 'color', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get value() {
        return this.getAttribute('value') || ''
    }

    get checked() {
        return this.getBoolValue('checked')
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get color() {
        return this.getAttribute('color') || '#09BB07'
    }
}
