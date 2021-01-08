import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    transformRGB2Hex,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxTextarea extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxTextarea.observedAttributes, () => {
            this.onTextareaFocus = this.onTextareaFocus.bind(this)
            this.onTextareaBlur = this.onTextareaBlur.bind(this)
            this.onTextareaInput = this.onTextareaInput.bind(this)
            this.onTextareaKeyDown = this.onTextareaKeyDown.bind(this)
            this.updateTextarea = this.updateTextarea.bind(this)
            this.wrapped = this.shadowRoot.querySelector('#wrapped')
            this.placeholderDom = this.shadowRoot.querySelector('#placeholder')
            this.textarea = this.shadowRoot.querySelector('#textarea')
            this.compute = this.shadowRoot.querySelector('#compute')
            this.stylecompute = this.shadowRoot.querySelector('#stylecompute')
        })
    }

    static register() {
        customElements.define('wx-textarea', WxTextarea)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听属性变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.updateTextarea)
        this._observer.observe(this, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        })
        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.updateTextarea)
        this._resizeObserver.observe(this)

        this.textarea.addEventListener('focus', this.onTextareaFocus)
        this.textarea.addEventListener('blur', this.onTextareaBlur)
        this.textarea.addEventListener('input', this.onTextareaInput)
        this.textarea.addEventListener('keydown', this.onTextareaKeyDown)

        this.onPlaceholderClassChange(this.placeholderClass)
        this.checkPlaceholderStyle(this.value)
        this.__scale = 750 / window.innerWidth
        this.adjustComputedStyle()
        this.checkRows(this.value)

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

        this.textarea.removeEventListener('focus', this.onTextareaFocus)
        this.textarea.removeEventListener('blur', this.onTextareaBlur)
        this.textarea.removeEventListener('input', this.onTextareaInput)
        this.textarea.removeEventListener('keydown', this.onTextareaKeyDown)
        this.textarea.removeEventListener('keyup', this.onTextareaKeyUp)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'value') {
            let value = this.value
            if (this.maxlength > 0 && value.length > this.maxlength) value = value.slice(0, this.maxlength)
            this.checkPlaceholderStyle(value)
            this.textarea.value = value
            if (!isInit) this.checkRows(value)
        } else if (name === 'placeholder') {
            if (oldValue === newValue) return
            this.placeholderDom.innerText = this.placeholder
        } else if (name === 'placeholder-style') {
            if (oldValue === newValue) return
            this.stylecompute.style.cssText = `${this.placeholderStyle}; display: none;`
            this.adjustComputedPlaceholderStyle()
        } else if (name === 'placeholder-class') {
            if (oldValue === newValue) return
            this.onPlaceholderClassChange(this.placeholderClass)
        } else if (name === 'disabled') {
            this.textarea.disabled = this.disabled
        } else if (name === 'maxlength') {
            if (oldValue === newValue) return
            const maxlength = this.maxlength
            if (maxlength > 0) {
                const value = this.value.slice(0, maxlength)
                if (value !== this.value) this.value = value
                this.textarea.setAttribute('maxlength', maxlength)
            } else {
                this.textarea.removeAttribute('maxlength')
            }
        } else if (name === 'focus') {
            if (isInit) return
            this.doFocus(this.focus)
        } else if (name === 'auto-height') {
            this.onAutoHeightChange(this.autoHeight)
        }
    }

    static get observedAttributes() {
        return ['value', 'placeholder', 'placeholder-style', 'placeholder-class', 'disabled', 'maxlength', 'auto-focus', 'focus', 'auto-height', 'fixed', 'cursor-spacing', 'cursor', 'show-confirm-bar', 'selection-start', 'selection-end', 'adjust-position', 'hold-keyboard', 'disable-default-padding', 'confirm-type', ...Base.observedAttributes]
    }

    get value() {
        return this.getAttribute('value') || ''
    }

    set value(value) {
        this.setAttribute('value', value)
    }

    get placeholder() {
        return this.getAttribute('placeholder')
    }

    get placeholderStyle() {
        return this.getAttribute('placeholder-style')
    }

    get placeholderClass() {
        return this.getAttribute('placeholder-class') || 'textarea-placeholder'
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get maxlength() {
        return this.getNumberValue('maxlength', 140)
    }

    get autoFocus() {
        return this.getBoolValue('auto-focus')
    }

    get focus() {
        return this.getBoolValue('focus')
    }

    get autoHeight() {
        return this.getBoolValue('auto-height')
    }

    get fixed() {
        return this.getBoolValue('fixed')
    }

    get cursorSpacing() {
        // cursor-spacing 不支持
        return null
    }

    get cursor() {
        return this.getNumberValue('cursor', -1)
    }

    set cursor(value) {
        this.setAttribute('cursor', value)
    }

    get showConfirmBar() {
        // show-confirm-bar 不支持
        return null
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

    get disableDefaultPadding() {
        // disable-default-padding 不支持
        return null
    }

    get confirmType() {
        // confirm-type 不支持
        return null
    }

    /**
     * 聚焦
     */
    doFocus(focus) {
        if (!this._isFocusing && focus) {
            if (!this.disabled) {
                window.requestAnimationFrame(() => {
                    this.textarea.focus({preventScroll: true})
                    if (this.selectionStart !== -1) this.textarea.setSelectionRange(this.selectionStart, this.selectionEnd)
                    else this.textarea.setSelectionRange(this.cursor, this.cursor)
                    this.selectionStart = -1
                    this.selectionEnd = -1
                    this.cursor = -1
                })
            }
        } else if (this._isFocusing && !focus) {
            this.textarea.blur()
        }
    }

    /**
     * 调整样式
     */
    adjustComputedStyle() {
        window.requestAnimationFrame(() => {
            const style = window.getComputedStyle(this)
            const rect = this.getBoundingClientRect()

            const h = ['Left', 'Right'].map(item => parseFloat(style[`border${item}Width`]) + parseFloat(style[`padding${item}`]))
            const v = ['Top', 'Bottom'].map(item => parseFloat(style[`border${item}Width`]) + parseFloat(style[`padding${item}`]))

            const textarea = this.textarea

            textarea.style.width = (rect.width - h[0] - h[1]) + 'px'
            textarea.style.height = (rect.height - v[0] - v[1]) + 'px'
            textarea.style.fontWeight = style.fontWeight
            textarea.style.fontSize = style.fontSize || '16px'
            textarea.style.color = style.color
            textarea.style.lineHeight = Math.max(parseFloat(style.fontSize) * 1.2, parseFloat(style.lineHeight)) + 'px'
            textarea.style.textAlign = style.textAlign

            this.compute.style.fontSize = style.fontSize || '16px'
            this.compute.style.width = textarea.style.width
            this.placeholderDom.style.width = textarea.style.width
            this.placeholderDom.style.height = textarea.style.height

            const styleMaxHeight = parseFloat(style.maxHeight.replace('px'))
            if (this.autoHeight && this._lineHeight && this._lineHeight > styleMaxHeight) this.style.maxHeight = this._lineHeight + 'px'
        })
    }

    /**
     * 获取行信息
     */
    getCurrentRows(value, callback) {
        window.requestAnimationFrame(() => {
            const newLine = value.lastIndexOf('\n') === value.length - 1
            this.compute.innerText = (newLine ? value + 'a' : value) || 'a'
            const style = window.getComputedStyle(this.compute)
            const lineHeight = (parseFloat(style.fontSize) || 16) * 1.2

            callback({
                height: Math.max(this.compute.scrollHeight, lineHeight),
                heightRpx: this.__scale * this.compute.scrollHeight,
                lineHeight,
                lineCount: Math.floor(this.compute.scrollHeight / lineHeight)
            })
        })
    }

    /**
     * 监听 textarea 聚焦
     */
    onTextareaFocus() {
        this._isFocusing = true
        this.dispatchEvent(new CustomEvent('focus', {bubbles: true, cancelable: true, detail: {value: this.value, height: 0}}))
    }

    /**
     * 监听 textarea 失焦
     */
    onTextareaBlur() {
        this._isFocusing = false
        this.dispatchEvent(new CustomEvent('blur', {bubbles: true, cancelable: true, detail: {value: this.value, cursor: this.textarea.selectionEnd}}))
    }

    /**
     * 监听输入框键盘键入
     */
    onTextareaKeyDown(evt) {
        // 事件触发顺序，keydown -> input -> keyup
        this._keyCode = evt.keyCode
    }

    /**
     * 监听 textarea 输入
     */
    onTextareaInput(evt) {
        evt.stopPropagation()
        this.value = evt.target.value
        this.dispatchEvent(new CustomEvent('input', {bubbles: true, cancelable: true, detail: {value: evt.target.value, cursor: this.textarea.selectionEnd, keyCode: this._keyCode}}))
    }

    /**
     * 更新 textarea
     */
    updateTextarea() {
        this.adjustComputedStyle()
        this.onAutoHeightChange(this.autoHeight)
    }

    /**
     * 监听 placeholder 的 class 变化
     */
    onPlaceholderClassChange(value) {
        this.stylecompute.className = value.split(/\s+/).join(' ')
        this.adjustComputedPlaceholderStyle()
    }

    /**
     * 检查 placeholder 的样式
     */
    adjustComputedPlaceholderStyle() {
        const stylecompute = this.stylecompute
        const style = window.getComputedStyle(stylecompute)

        // 处理 fontWeight
        let fontWeight = parseInt(style.fontWeight, 10)
        if (isNaN(fontWeight)) fontWeight = style.fontWeight
        else if (fontWeight < 500) fontWeight = 'normal'
        else if (fontWeight >= 500) fontWeight = 'bold'

        if (this.placeholderStyle) this.placeholderStyle.split(';')

        const placeholderDom = this.placeholderDom
        placeholderDom.style.position = 'absolute'
        placeholderDom.style.fontSize = `${parseFloat(style.fontSize) || 16}px`
        placeholderDom.style.fontWeight = fontWeight
        placeholderDom.style.color = transformRGB2Hex(style.color)
    }

    /**
     * 检查 placeholder 的样式
     */
    checkPlaceholderStyle(value) {
        if (!value) {
            this.adjustComputedPlaceholderStyle()
            this.placeholderDom.style.display = ''
        } else {
            this.placeholderDom.style.display = 'none'
        }
    }

    /**
     * 监听 auto-height 变化
     */
    onAutoHeightChange(autoHeight) {
        if (autoHeight) {
            this.getCurrentRows(this.value, rows => {
                const height = rows.height < rows.lineHeight ? rows.lineHeight : rows.height
                this.style.height = height + 'px'
                this.adjustComputedStyle()
            })
        }
    }

    /**
     * 检查行
     */
    checkRows(value) {
        this.getCurrentRows(value, rows => {
            if (this.lastRows !== rows.lineCount) {
                this.lastRows = rows.lineCount
                if (this.autoHeight) {
                    const height = rows.height < rows.lineHeight ? rows.lineHeight : rows.height
                    this._lineHeight = height / (rows.lineCount || 1)
                    this.style.height = height + 'px'
                    this.adjustComputedStyle()
                }
                this.dispatchEvent(new CustomEvent('linechange', {bubbles: true, cancelable: true, detail: rows}))
            }
        })
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        this.value = this.textarea.value
        return this.value
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.textarea.value = ''
        this.value = ''
    }
}
