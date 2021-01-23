import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpCheckbox extends WeuiBase {
    constructor() {
        super()

        this._outerClass = ''

        this.initShadowRoot(template, MpCheckbox.observedAttributes, () => {
            this.onTap = this.onTap.bind(this)
            this.cell = this.shadowRoot.querySelector('#cell')
            this.slotIcon = this.shadowRoot.querySelector('#slot-icon')
            this.labelDom = this.shadowRoot.querySelector('#label')
            this.slotFooter = this.shadowRoot.querySelector('#slot-footer')
        })
    }

    static register() {
        customElements.define('mp-checkbox', MpCheckbox)
    }

    connectedCallback() {
        super.connectedCallback()

        this.cell.addEventListener('tap', this.onTap)
        this._parent = findParent(this, node => node.tagName === 'MP-CHECKBOX-GROUP')
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.cell.removeEventListener('tap', this.onTap)
        this._parent = null
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'multi') {
            const multi = this.multi
            this.cell.setAttribute('has-footer', !multi)
            this.cell.setAttribute('has-header', multi)
            this.updateClass()
            this.updateInner()
        } else if (name === 'checked' || name === 'value') {
            this.updateInner()
        } else if (name === 'label') {
            this.labelDom.innerText = this.label
        }
    }

    static get observedAttributes() {
        return ['multi', 'checked', 'value', 'label', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get multi() {
        return this.getBoolValue('multi', true)
    }

    set multi(value) {
        return this.setAttribute('multi', value)
    }

    get checked() {
        return this.getBoolValue('checked')
    }

    set checked(value) {
        this.setAttribute('checked', value)
    }

    get value() {
        return this.getAttribute('value') || ''
    }

    get label() {
        return this.getAttribute('label') || 'label'
    }

    /**
     * 更新样式
     */
    updateClass() {
        this.cell.className = `weui-check__label ${this._outerClass} ${this.extClass} ${!this.multi ? 'weui-cell_radio' : 'weui-cell_checkbox'} ${this._setInGroupForm ? 'in-group-form' : ''}`
    }

    /**
     * 更新内部实现
     */
    updateInner() {
        const multi = this.multi
        if (multi) {
            this.slotFooter.innerHTML = ''
            const dom = this.slotIcon.querySelector('.weui-check')
            if (!dom) {
                this.slotIcon.innerHTML = `<wx-checkbox value="${this.value}" ${this.checked ? 'checked="true"' : ''} class="weui-check"></wx-checkbox>
                    <wx-icon class="weui-icon-checked"></wx-icon>`
            } else {
                dom.setAttribute('value', this.value)
                if (this.checked) dom.setAttribute('checked', true)
                else dom.removeAttribute('checked')
            }
        } else {
            this.slotIcon.innerHTML = ''
            const dom = this.slotIcon.querySelector('.weui-check')
            if (!dom) {
                this.slotFooter.innerHTML = `<wx-radio value="${this.value}" ${this.checked ? 'checked="true"' : ''} class="weui-check"></wx-radio>
                    <wx-icon class="weui-icon-checked"></wx-icon>`
            } else {
                dom.setAttribute('value', this.value)
                if (this.checked) dom.setAttribute('checked', true)
                else dom.removeAttribute('checked')
            }
        }
    }

    /**
     * 监听 tap 事件
     */
    onTap() {
        if (this.multi) {
            const checked = !this.checked
            this.checked = checked
            if (this._parent) this._parent.onChange(this)
        } else {
            const checked = this.checked
            if (checked) return
            this.checked = true
            if (this._parent) this._parent.onChange(this)
        }
        this.dispatchEvent(new CustomEvent('change', {bubbles: false, cancelable: true, detail: {value: this.value, checked: this.checked}}))
    }

    /**
     * 提供给外部设置样式的接口
     */
    setOuterClass(className) {
        this._outerClass = className
        className.split(/\s+/ig).forEach(item => {
            if (item) this.classList.toggle(item, true)
        })
        this.updateClass()
    }

    setInGroupForm(isInGroupForm) {
        this._setInGroupForm = isInGroupForm
        this.updateClass()
    }
}
