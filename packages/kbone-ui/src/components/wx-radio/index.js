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
            this.input = this.shadowRoot.querySelector('#input')
        })
    }

    static register() {
        customElements.define('wx-radio', WxRadio)
    }

    connectedCallback() {
        super.connectedCallback()

        this._parent = findParent(this, parentNode => parentNode.tagName === 'WX-RADIO-GROUP')
        if (this._parent) this._parent.addItem(this)
        this.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this._parent = null
        if (this._parent) this._parent.removeItem(this)
        this.removeEventListener('tap', this.onTap)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (oldValue === newValue) return
        if (name === 'value') {
            if (this._parent) this._parent.renameItem(this, oldValue, newValue)
        } else if (name === 'checked') {
            if (this._parent) this._parent.onItemChange(this, oldValue, newValue)
            this.input.classList.toggle('wx-radio-input-checked', this.checked)
            const color = this.checked && !this.disabled ? this.color : ''
            this.input.style.backgroundColor = color
            this.input.style.borderColor = color
        } else if (name === 'disabled') {
            this.input.classList.toggle('wx-radio-input-disabled', this.disabled)
        } else if (name === 'color') {
            const color = this.checked && !this.disabled ? this.color : ''
            this.input.style.backgroundColor = color
            this.input.style.borderColor = color
        }
    }

    static get observedAttributes() {
        return ['value', 'checked', 'disabled', 'color', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get value() {
        return this.getAttribute('value')
    }

    get checked() {
        return this.getBoolValue('checked')
    }

    set checked(value) {
        this.setAttribute('checked', value)
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get color() {
        return this.getAttribute('color') || '#09BB07'
    }

    /**
     * 监听点击事件
     */
    onTap(evt) {
        // 已经被底层组件处理过，就不再处理
        if (evt._isProcessed) return
        evt._isProcessed = true

        if (this.disabled || this.checked) return

        this.checked = true
        if (this._parent) {
            this._parent.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
                detail: {
                    value: this._parent.value,
                }
            }))
        }
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        return this._parent ? this._parent.value : ''
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.setAttribute('checked', 'false')
        if (this._parent) this._parent.removeItem(this)
    }
}
