import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const FORM_ITEM_LIST = ['wx-checkbox', 'wx-input', 'wx-picker', 'wx-picker-view', 'wx-radio', 'wx-slider', 'wx-switch', 'wx-textarea']

export default class WxForm extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxForm.observedAttributes, () => {
            this.onFormSubmit = this.onFormSubmit.bind(this)
            this.onFormReset = this.onFormReset.bind(this)
        })
    }

    static register() {
        customElements.define('wx-form', WxForm)
    }

    connectedCallback() {
        super.connectedCallback()

        this.shadowRoot.addEventListener('formsubmit', this.onFormSubmit)
        this.shadowRoot.addEventListener('formreset', this.onFormReset)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.shadowRoot.removeEventListener('formsubmit', this.onFormSubmit)
        this.shadowRoot.removeEventListener('formreset', this.onFormReset)
    }

    static get observedAttributes() {
        return ['report-submit', 'report-submit-timeout', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get reportSubmit() {
        // report-submit 不支持
        return null
    }

    get reportSubmitTimeout() {
        // report-submit-timeout 不支持
        return null
    }

    /**
     * 获取表单项
     */
    getFormItem() {
        const res = {}
        FORM_ITEM_LIST.forEach(tagName => res[tagName] = this.querySelectorAll(`${tagName}[name]`))
        return res
    }

    /**
     * 监听表单提交
     */
    onFormSubmit() {
        const formItemMap = this.getFormItem()
        const data = {}
        let count = 0
        FORM_ITEM_LIST.forEach(tagName => {
            formItemMap[tagName].forEach(item => {
                if (typeof item.getFormValue === 'function') {
                    if (item.tagName === 'WX-INPUT' || item.tagName === 'WX-PICKER') {
                        count++
                        item.getFormValue(value => {
                            data[item.getAttribute('name')] = value
                            if (--count) this.triggerSubmitEvent(data)
                        })
                    } else data[item.getAttribute('name')] = item.getFormValue()
                }
            })
        })
        if (!count) this.triggerSubmitEvent(data)
    }

    /**
     * 触发提交事件
     */
    triggerSubmitEvent(data) {
        this.dispatchEvent(new CustomEvent('submit', {bubbles: true, cancelable: true, detail: {value: data}}))
    }

    /**
     * 监听表单重置
     */
    onFormReset() {
        const formItemMap = this.getFormItem()
        FORM_ITEM_LIST.forEach(tagName => {
            formItemMap[tagName].forEach(item => {
                if (typeof item.resetFormValue === 'function') item.resetFormValue()
            })
        })
        this.dispatchEvent(new CustomEvent('reset', {bubbles: true, cancelable: true, detail: {}}))
    }
}
