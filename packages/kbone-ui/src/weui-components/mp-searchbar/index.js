import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpSearchbar extends WeuiBase {
    constructor() {
        super()

        this._lastSearch = Date.now()
        this.__searchState = false
        this.__value = ''
        this.__result = []

        this.initShadowRoot(template, MpSearchbar.observedAttributes, () => {
            this.onFocus = this.onFocus.bind(this)
            this.onBlur = this.onBlur.bind(this)
            this.onInput = this.onInput.bind(this)
            this.clearInput = this.clearInput.bind(this)
            this.showInput = this.showInput.bind(this)
            this.hideInput = this.hideInput.bind(this)
            this.onSelectResult = this.onSelectResult.bind(this)
            this.searchbar = this.shadowRoot.querySelector('.weui-search-bar')
            this.inputDom = this.shadowRoot.querySelector('.weui-search-bar__input')
            this.clearDom = this.shadowRoot.querySelector('.weui-icon-clear')
            this.labelDom = this.shadowRoot.querySelector('.weui-search-bar__label')
            this.cancelDom = this.shadowRoot.querySelector('.weui-search-bar__cancel-btn')
            this.resultCnt = this.shadowRoot.querySelector('#result-cnt')
        })
    }

    static register() {
        customElements.define('mp-searchbar', MpSearchbar)
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.focus) this.__searchState = true

        this.inputDom.addEventListener('input', this.onInput)
        this.inputDom.addEventListener('focus', this.onFocus)
        this.inputDom.addEventListener('blur', this.onBlur)
        this.clearDom.addEventListener('tap', this.clearInput)
        this.labelDom.addEventListener('tap', this.showInput)
        this.cancelDom.addEventListener('tap', this.hideInput)
        this.resultCnt.addEventListener('tap', this.onSelectResult)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.inputDom.removeEventListener('input', this.onInput)
        this.inputDom.removeEventListener('focus', this.onFocus)
        this.inputDom.removeEventListener('blur', this.onBlur)
        this.clearDom.removeEventListener('tap', this.clearInput)
        this.labelDom.removeEventListener('tap', this.showInput)
        this.cancelDom.removeEventListener('tap', this.hideInput)
        this.resultCnt.removeEventListener('tap', this.onSelectResult)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            const extClass = this.extClass
            this.searchbar.className = `weui-search-bar ${extClass}`
            this.resultCnt.setAttribute('ext-class', `searchbar-result ${extClass}`)
        } else if (name === 'focus') {
            this.inputDom.setAttribute('focus', this.focus)
        } else if (name === 'placeholder') {
            this.inputDom.setAttribute('placeholder', this.placeholder)
        } else if (name === 'value') {
            this.inputDom.setAttribute('value', this.value)
        } else if (name === 'cancel-text') {
            this.cancelDom.innerText = this.cancelText
        } else if (name === 'cancel') {
            this.cancelDom.classList.toggle('hide', !this._searchState || !this.cancel)
        }
    }

    static get observedAttributes() {
        return ['focus', 'placeholder', 'value', 'search', 'throttle', 'cancel-text', 'cancel', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get focus() {
        return this.getBoolValue('focus')
    }

    set focus(value) {
        this.setAttribute('focus', value)
    }

    get placeholder() {
        return this.getAttribute('placeholder') || '搜索'
    }

    get value() {
        return this.getAttribute('value')
    }

    get search() {
        let value = this.getAttribute('kbone-func-search') || this.getAttribute('search')
        if (typeof value === 'string') value = window[value]
        return value
    }

    get throttle() {
        return this.getNumberValue('throttle', 500)
    }

    get cancelText() {
        return this.getAttribute('cancel-text') || '取消'
    }

    get cancel() {
        return this.getBoolValue('cancel', true)
    }

    get _searchState() {
        return this.__searchState
    }

    set _searchState(value) {
        this.__searchState = value
        this.searchbar.classList.toggle('weui-search-bar_focusing', value)
        this.cancelDom.classList.toggle('hide', !value || !this.cancel)
        this.resultCnt.classList.toggle('hide', !value || !this._result.length)
    }

    get _value() {
        return this.__value
    }

    set _value(value) {
        this.__value = value
        this.clearDom.classList.toggle('hidden', !!value)
    }

    get _result() {
        return this.__result
    }

    set _result(value) {
        this.__result = value
        if (value.length) {
            this.resultCnt.innerHTML = value.map((item, index) => `<mp-cell class="result" body-class="weui-cell_primary" data-index="${index}" hover="true">
                    <div>${item.text}</div>
                </mp-cell>`).join('')
        } else {
            this.resultCnt.innerHTML = ''
        }
        this.resultCnt.classList.toggle('hide', !this._searchState || !value.length)
    }

    /**
     * 监听输入框事件
     */
    onInput(evt) {
        const throttle = this.throttle

        this._value = evt.detail.value
        this.dispatchEvent(new CustomEvent('input', {bubbles: true, cancelable: true, detail: evt.detail}))

        if (Date.now() - this._lastSearch < throttle) return
        if (typeof this.search !== 'function') return

        this._lastSearch = Date.now()
        if (this._timerId) this._timerId = clearTimeout(this._timerId)
        this._timerId = setTimeout(() => {
            this.search(this._value)
                .then(json => this._result = json)
                .catch(err => console.error('search error', err))
        }, throttle)
    }

    onFocus(evt) {
        this.dispatchEvent(new CustomEvent('focus', {bubbles: true, cancelable: true, detail: evt.detail}))
    }

    onBlur(evt) {
        this.focus = false
        this.dispatchEvent(new CustomEvent('blur', {bubbles: true, cancelable: true, detail: evt.detail}))
    }

    /**
     * 清理 input
     */
    clearInput() {
        this._value = ''
        this.inputDom.setAttribute('value', '')
        this._result = []
        this.focus = true
        this.dispatchEvent(new CustomEvent('clear', {bubbles: true, cancelable: true}))
    }

    /**
     * 展示 input
     */
    showInput() {
        this._searchState = true
        this.focus = true
    }

    /**
     * 隐藏 input
     */
    hideInput() {
        this._searchState = false
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, cancelable: true}))
    }

    /**
     * 监听结果选中
     */
    onSelectResult(evt) {
        const cell = findParent(evt.target, node => node.tagName === 'MP-CELL')
        if (cell) {
            const index = +cell.dataset.index
            const item = this._result[index]
            this.dispatchEvent(new CustomEvent('selectresult', {bubbles: true, cancelable: true, detail: {index, item}}))
        }
    }
}
