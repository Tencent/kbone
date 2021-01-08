import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxCheckbox extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCheckbox.observedAttributes, () => {
            this.input = this.shadowRoot.querySelector('#input')
        })
    }

    static register() {
        customElements.define('wx-checkbox', WxCheckbox)
    }

    connectedCallback() {
        super.connectedCallback()

        this._parent = findParent(this, parentNode => parentNode.tagName === 'WX-CHECKBOX-GROUP')
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
            this.input.classList.toggle('wx-checkbox-input-checked', this.checked)
            this.input.style.color = this.checked ? this.color : ''
        } else if (name === 'disabled') {
            this.input.classList.toggle('wx-checkbox-input-disabled', this.disabled)
        } else if (name === 'color') {
            this.input.style.color = this.checked ? this.color : ''
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

        if (this.disabled) return

        this.checked = !this.checked
        if (this._parent) {
            this._parent.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                cancelable: true,
                detail: {
                    value: Array.prototype.slice.call(this._parent.value),
                }
            }))
        }
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        return this._parent ? Array.prototype.slice.call(this._parent.value) : []
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.setAttribute('checked', 'false')
        if (this._parent) this._parent.removeItem(this)
    }
}
