import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import FormValidator from './form-validator'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

function diffObject(oldVal, newVal) {
    if (!oldVal && newVal) return newVal
    if (!newVal && oldVal) return oldVal
    const diffObj = {}
    let isDiff = false
    for (const key in newVal) {
        if (oldVal[key] !== newVal[key]) {
            isDiff = true
            diffObj[key] = newVal[key]
        }
    }
    for (const key in oldVal) {
        if (oldVal[key] !== newVal[key]) {
            isDiff = true
            diffObj[key] = newVal[key]
        }
    }
    return isDiff ? diffObj : null
}

export default class MpForm extends WeuiBase {
    constructor() {
        super()

        this._formItems = {}

        this.initShadowRoot(template, MpForm.observedAttributes, () => {
            this.checkChildNode = this.checkChildNode.bind(this)
            this.cnt = this.shadowRoot.querySelector('#cnt')
        })
    }

    static register() {
        customElements.define('mp-form', MpForm)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.checkChildNode)
        this._observer.observe(this, {
            childList: true,
            subtree: true,
        })

        this.initRules()
        this._formValidator = new FormValidator(this.models, this._newRules)
        this.checkChildNode()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.cnt.className = this.extClass
        } else if (name === 'rules') {
            const newRules = this.initRules()
            if (this._formValidator) this._formValidator.setRules(newRules)
        } else if (name === 'models') {
            const models = this.models
            const oldModles = this.filterObjectValue(oldValue)
            if (!this._formValidator) return

            this._formValidator.setModel(models)
            const diffObj = diffObject(oldModles, models)
            if (diffObj) {
                let isValid = true
                const errors = []
                const errorMap = {}
                Object.keys(diffObj).forEach(key => {
                    this._formValidator.validateField(key, diffObj[key], (isValided, error) => {
                        if (error && error[key]) {
                            errors.push(error[key])
                            errorMap[key] = error[key]
                        }
                        isValid = isValided
                    })
                })

                Object.keys(diffObj).forEach(key => this.showError(key, errorMap[key])) // 展示错误列表
                this.dispatchEvent(new CustomEvent(
                    isValid ? 'success' : 'fail',
                    {bubbles: true, cancelable: true, detail: isValid ? {trigger: 'change'} : {errors, trigger: 'change'}}
                ))
            }
        }
    }

    static get observedAttributes() {
        return ['rules', 'models', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get rules() {
        return this.getObjectValue('rules', [])
    }

    get models() {
        return this.getObjectValue('models')
    }

    /**
     * 监听子节点变化
     */
    checkChildNode() {
        // 清除旧节点
        const formItems = this._formItems
        const props = Object.keys(formItems)
        props.forEach(prop => {
            if (!this.contains(formItems[prop]) || prop !== formItems[prop].prop) delete formItems[prop]
        })

        // 补充新节点
        const cellsList = Array.prototype.slice.call(this.querySelectorAll('mp-cell'))
        const checkboxGroupList = Array.prototype.slice.call(this.querySelectorAll('mp-checkbox-group'))

        cellsList.concat(checkboxGroupList).forEach(item => {
            if (item.prop) formItems[item.prop] = item
            if (item.setInForm) item.setInForm()
        })
    }

    /**
     * 初始化规则
     */
    initRules() {
        const newRules = {}
        this.rules.forEach(rule => {
            if (rule.name && rule.rules) {
                newRules[rule.name] = rule.rules || []
            }
        })
        this._newRules = newRules
        return newRules
    }

    /**
     * 展示错误
     */
    showError(prop, error) {
        const formItem = this._formItems[prop]
        if (formItem && formItem.showError) formItem.setError(error)
    }

    /**
     * 校验表单
     */
    validate(cb) {
        return this._formValidator.validate((isValid, errors) => {
            Object.keys(this._newRules).forEach(key => this.showError(key, errors && errors[key])) // 展示错误列表
            const handleError = this.handleErrors(errors)
            this.dispatchEvent(new CustomEvent(
                isValid ? 'success' : 'fail',
                {bubbles: true, cancelable: true, detail: isValid ? {trigger: 'validate'} : {errors: handleError, trigger: 'validate'}}
            ))
            if (cb) cb(isValid, handleError)
        })
    }

    /**
     * 校验表单项
     */
    validateField(name, value, cb) {
        return this._formValidator.validateField(name, value, (isValid, errors) => {
            this.showError(name, errors)
            const handleError = this.handleErrors(errors)
            this.dispatchEvent(new CustomEvent(
                isValid ? 'success' : 'fail',
                {bubbles: true, cancelable: true, detail: isValid ? {trigger: 'validate'} : {errors: handleError, trigger: 'validate'}}
            ))
            if (cb) cb(isValid, handleError)
        })
    }

    /**
     * 处理错误列表
     */
    handleErrors(errors) {
        if (errors) {
            const newErrors = []
            this.rules.forEach(rule => {
                if (errors[rule.name]) {
                    errors[rule.name].name = rule.name
                    newErrors.push(errors[rule.name])
                }
            })
            return newErrors
        }
        return errors
    }

    /**
     * 增加校验方法
     */
    addMethod(ruleName, method) {
        return this._formValidator.addMethod(ruleName, method)
    }
}
