import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxSwitch extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxSwitch.observedAttributes, () => {
            this.onInputTap = this.onInputTap.bind(this)
            this.switchInput = this.shadowRoot.querySelector('#switchInput')
            this.checkboxInput = this.shadowRoot.querySelector('#checkboxInput')
        })
    }

    static register() {
        customElements.define('wx-switch', WxSwitch)
    }

    connectedCallback() {
        super.connectedCallback()

        this.switchInput.addEventListener('tap', this.onInputTap)
        this.checkboxInput.addEventListener('tap', this.onInputTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.switchInput.removeEventListener('tap', this.onInputTap)
        this.checkboxInput.removeEventListener('tap', this.onInputTap)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'checked') {
            this.switchInput.classList.toggle('wx-switch-input-checked', this.checked)
            this.checkboxInput.classList.toggle('wx-checkbox-input-checked', this.checked)
            this.switchInput.style.backgroundColor = this.checked ? this.color : ''
            this.checkboxInput.style.color = this.checked ? this.color : ''
            this.switchInput.style.borderColor = this.checked ? this.color : ''
        } else if (name === 'type') {
            const isCheckbox = this.type === 'checkbox'
            this.switchInput.style.display = isCheckbox ? 'none' : 'block'
            this.checkboxInput.style.display = isCheckbox ? 'block' : 'none'
        } else if (name === 'color') {
            this.switchInput.style.backgroundColor = this.checked ? this.color : ''
            this.checkboxInput.style.color = this.checked ? this.color : ''
            this.switchInput.style.borderColor = this.checked ? this.color : ''
        } else if (name === 'disabled') {
            this.switchInput.classList.toggle('wx-switch-input-disabled', this.disabled)
            this.checkboxInput.classList.toggle('wx-checkbox-input-disabled', this.disabled)
        }
    }

    static get observedAttributes() {
        return ['checked', 'type', 'color', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get checked() {
        return this.getBoolValue('checked')
    }

    set checked(value) {
        this.setAttribute('checked', value)
    }

    get type() {
        return this.getAttribute('type') || 'switch'
    }

    get color() {
        return this.getAttribute('color') || '#04BE02'
    }

    /**
     * 监听点击
     */
    onInputTap() {
        if (this.disabled) return

        this.checked = !this.checked
        this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value: this.checked}}))
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        return this.checked
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.checked = 'false'
    }
}
