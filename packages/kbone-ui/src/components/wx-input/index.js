import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxInput extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxInput.observedAttributes, () => {
            this.onInputFocus = this.onInputFocus.bind(this)
            this.onInputBlur = this.onInputBlur.bind(this)
            this.onInputInput = this.onInputInput.bind(this)
            this.onInputKeyDown = this.onInputKeyDown.bind(this)
            this.onInputKeyUp = this.onInputKeyUp.bind(this)
            this.updateInput = this.updateInput.bind(this)
            this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this)
            this.wrapper = this.shadowRoot.querySelector('#wrapper')
            this.inputDom = this.shadowRoot.querySelector('#input')
            this.placeholderDom = this.shadowRoot.querySelector('#placeholder')
        })
    }

    static register() {
        customElements.define('wx-input', WxInput)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听属性变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.updateInput)
        this._observer.observe(this, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        })
        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.updateInput)
        this._resizeObserver.observe(this)

        this.inputDom.addEventListener('focus', this.onInputFocus)
        this.inputDom.addEventListener('blur', this.onInputBlur)
        this.inputDom.addEventListener('input', this.onInputInput)
        this.inputDom.addEventListener('keydown', this.onInputKeyDown)
        this.inputDom.addEventListener('keyup', this.onInputKeyUp)
        document.addEventListener('touchstart', this.onDocumentTouchStart)

        this.onPlaceholderClassChange(this.placeholderClass)
        this.checkPlaceholderStyle(this.value)
        this._value = this.value
        this.updateInput()

        // 自动聚焦
        if (window._isLoaded) {
            if (this._focusTimer) this._focusTimer = clearTimeout(this._focusTimer)
            this._focusTimer = setTimeout(() => this.doFocus(this.autoFocus || this.focus), 500)
        } else {
            window.addEventListener('load', () => {
                if (this._focusTimer) this._focusTimer = clearTimeout(this._focusTimer)
                this._focusTimer = setTimeout(() => this.doFocus(this.autoFocus || this.focus), 500)
            })
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
        if (this._resizeObserver) this._resizeObserver.disconnect()
        this._resizeObserver = null

        this.inputDom.removeEventListener('focus', this.onInputFocus)
        this.inputDom.removeEventListener('blur', this.onInputBlur)
        this.inputDom.removeEventListener('input', this.onInputInput)
        this.inputDom.removeEventListener('keydown', this.onInputKeyDown)
        this.inputDom.removeEventListener('keyup', this.onInputKeyUp)
        document.removeEventListener('touchstart', this.onDocumentTouchStart)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'value') {
            let value = this.value
            if (this.maxlength > 0 && value.length > this.maxlength) value = value.slice(0, this.maxlength)
            this.checkPlaceholderStyle(value)
            this.inputDom.value = value
            this._value = value
        } else if (name === 'type' || name === 'password') {
            if (oldValue === newValue) return
            const type = this.type
            this.inputDom.setAttribute('type', this.password || type === 'password' ? 'password' : type === 'number' ? type : 'text')
        } else if (name === 'placeholder') {
            if (oldValue === newValue) return
            this.checkPlaceholderStyle(this.value)
            this.placeholderDom.innerText = this.placeholder
        } else if (name === 'placeholder-style') {
            if (oldValue === newValue) return
            this.placeholderDom.style.cssText = this.placeholderStyle
        } else if (name === 'placeholder-class') {
            if (oldValue === newValue) return
            this.onPlaceholderClassChange(this.placeholderClass)
        } else if (name === 'disabled') {
            this.inputDom.disabled = this.disabled
        } else if (name === 'maxlength') {
            if (oldValue === newValue) return
            const maxlength = this.maxlength
            if (maxlength > 0) {
                const value = this.value.slice(0, maxlength)
                if (value !== this.value) this.value = value
                this.inputDom.setAttribute('maxlength', maxlength)
            } else {
                this.inputDom.removeAttribute('maxlength')
            }
        } else if (name === 'focus') {
            if (isInit) return
            this.doFocus(this.focus)
        }
    }

    static get observedAttributes() {
        return ['value', 'type', 'password', 'placeholder', 'placeholder-style', 'placeholder-class', 'disabled', 'maxlength', 'cursor-spacing', 'auto-focus', 'focus', 'confirm-type', 'always-embed', 'confirm-hold', 'cursor', 'selection-start', 'selection-end', 'adjust-position', 'hold-keyboard', ...Base.observedAttributes]
    }

    get value() {
        return this.getAttribute('value') || ''
    }

    set value(value) {
        this.setAttribute('value', value)
    }

    get type() {
        return this.getAttribute('type') || 'text'
    }

    get password() {
        return this.getBoolValue('password')
    }

    get placeholder() {
        return this.getAttribute('placeholder')
    }

    get placeholderStyle() {
        return this.getAttribute('placeholder-style')
    }

    get placeholderClass() {
        return this.getAttribute('placeholder-class') || 'input-placeholder'
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get maxlength() {
        return this.getNumberValue('maxlength', 140)
    }

    get cursorSpacing() {
        // cursor-spacing 不支持
        return null
    }

    get autoFocus() {
        return this.getBoolValue('auto-focus')
    }

    get focus() {
        return this.getBoolValue('focus')
    }

    get confirmType() {
        // confirm-type 不支持
        return null
    }

    get alwaysEmbed() {
        // always-embed 不支持
        return null
    }

    get confirmHold() {
        return this.getBoolValue('confirm-hold')
    }

    get cursor() {
        return this.getNumberValue('cursor', -1)
    }

    set cursor(value) {
        this.setAttribute('cursor', value)
    }

    get selectionStart() {
        return this.getNumberValue('selection-start', -1)
    }

    set selectionStart(value) {
        this.setAttribute('selection-start', value)
    }

    get selectionEnd() {
        return this.getNumberValue('selection-end', -1)
    }

    set selectionEnd(value) {
        this.setAttribute('selection-end', value)
    }

    get adjustPosition() {
        // adjust-position 不支持
        return null
    }

    get holdKeyboard() {
        // hold-keyboard 不支持
        return null
    }

    /**
     * 聚焦
     */
    doFocus(focus) {
        if (!this._isFocusing && focus) {
            window.requestAnimationFrame(() => {
                this.onInputFocus(null, this.cursor, this.selectionStart, this.selectionEnd)
            })
        } else if (this._isFocusing && !focus) {
            this.inputDom.blur()
        }
    }

    /**
     * 监听页面触摸
     */
    onDocumentTouchStart(evt) {
        let target = evt.target

        while (target) {
            if (target === this.wrapper) return
            target = target.parentNode
        }
        window.requestAnimationFrame(() => {
            if (this._isFocusing) this.inputDom.blur()
        })
    }

    /**
     * 监听输入框聚焦
     */
    onInputFocus(evt, cursor, selectionStart, selectionEnd) {
        if (evt) evt.stopPropagation()
        if (this.disabled || this._isFocusing) return

        this._isFocusing = true
        this.dispatchEvent(new CustomEvent('focus', {bubbles: true, cancelable: true, detail: {value: this.value, height: 0}}))
        this.inputDom.focus()
        if (typeof selectionStart === 'number' && typeof selectionEnd === 'number' && selectionStart !== -1) {
            this.inputDom.setSelectionRange(selectionStart, selectionEnd)
        } else if (typeof cursor === 'number') {
            this.inputDom.setSelectionRange(cursor, cursor)
        }
        this.cursor = -1
        this.selectionStart = -1
        this.selectionEnd = -1
    }

    /**
     * 监听输入框失焦
     */
    onInputBlur(evt) {
        evt.stopPropagation()
        this._isFocusing = false
        this.value = this._value
        if (this._getFormValueCb) this._getFormValueCb(this.value)

        this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value: this.value}}))
        this.dispatchEvent(new CustomEvent('blur', {bubbles: true, cancelable: true, detail: {value: this.value, cursor: this.inputDom.selectionEnd}}))
        this.checkPlaceholderStyle(this.value)
    }

    /**
     * 监听输入框键盘键入
     */
    onInputKeyDown(evt) {
        // 事件触发顺序，keydown -> input -> keyup
        this._keyCode = evt.keyCode
    }

    /**
     * 监听输入框键盘放开
     */
    onInputKeyUp(evt) {
        if (evt.keyCode === 13) {
            this.dispatchEvent(new CustomEvent('confirm', {bubbles: true, cancelable: true, detail: {value: this._value}}))
            if (!this.confirmHold) {
                this.value = this._value
                this.inputDom.blur()
            }
        }
    }

    /**
     * 监听输入框输入
     */
    onInputInput(evt) {
        evt.stopPropagation()
        let value = evt.target.value
        if (this.type === 'digit') {
            // 处理小数输入
            value = value.trim()
            let newValue = parseFloat(value)
            if (isNaN(newValue)) {
                value = ''
            } else {
                newValue = newValue.toString()
                if (value.length !== newValue.length + 1 || value.indexOf('.') !== value.length - 1) {
                    // 最后一个字符不是小数点
                    value = newValue
                }
            }
        } else if (this.type === 'idcard') {
            // 处理身份证输入
            if (!/^\d*X{0,1}\d*$/ig.test(value)) value = this._value
            value = value.toUpperCase()
        }
        evt.target.value = value
        if (this._value === value) return

        this._value = value
        this.checkPlaceholderStyle(value)

        this.dispatchEvent(new CustomEvent('input', {bubbles: true, cancelable: true, detail: {value, cursor: this.inputDom.selectionStart, keyCode: this._keyCode}}))
    }

    /**
     * 更新输入框
     */
    updateInput() {
        const style = window.getComputedStyle(this)
        const rect = this.getBoundingClientRect()

        const v = ['Top', 'Bottom'].map(item => parseFloat(style[`border${item}Width`]) + parseFloat(style[`padding${item}`]))
        const input = this.inputDom

        const height = (rect.height - v[0] - v[1])
        if (height !== this._lastHeight) {
            input.style.height = height + 'px'
            input.style.lineHeight = height + 'px'
            this._lastHeight = height
        }
        input.style.color = style.color

        const placeholder = this.placeholderDom
        placeholder.style.height = (rect.height - v[0] - v[1]) + 'px'
        placeholder.style.lineHeight = placeholder.style.height
    }

    /**
     * 监听 placeholder 的 class 变化
     */
    onPlaceholderClassChange(value) {
        this._placeholderClass = value.split(/\s+/)
        this.placeholderDom.className = this._placeholderClass.join(' ')
    }

    /**
     * 检查 placeholder 的样式
     */
    checkPlaceholderStyle(value) {
        const list = this._placeholderClass || []
        const placeholder = this.placeholderDom
        if (value) {
            if (this._placeholderShow) {
                placeholder.classList.remove('input-placeholder')
                placeholder.setAttribute('style', '')
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        if (placeholder.classList.contains(list[i])) placeholder.classList.remove(list[i])
                    }
                }
            }
            placeholder.style.display = 'none'
            this._placeholderShow = false
        } else {
            if (!this._placeholderShow) {
                placeholder.classList.add('input-placeholder')
                if (this.placeholderStyle) placeholder.setAttribute('style', this.placeholderStyle)
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        placeholder.classList.add(list[i])
                    }
                }
            }
            placeholder.style.display = ''
            this.updateInput()
            this._placeholderShow = true
        }
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue(cb) {
        if (this._isFocusing) this._getFormValueCb = cb
        else cb(this.value)
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        if (this._isFocusing) this._isFocusing = false
        this.value = ''
    }
}
