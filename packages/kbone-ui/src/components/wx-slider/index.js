import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const SLIDE_ACTIVE_COLOR = '#1AAD19'
const SLIDE_BACKGROUND_COLOR = '#E9E9E9'

/**
 * 判断数值相等
 */
function isNumEqual(a, b) {
    return parseInt(a * 1000, 10) === parseInt(b * 1000, 10)
}

/**
 * 获取小数位数
 */
function getDecimalsLength(num) {
    if (isNaN(num) || num % 1 === 0) return 0

    num = num.toString()

    if (/\./.test(num)) return num.split('.')[1].length
    else return +num.split('e-')[1]
}

export default class WxSlider extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxSlider.observedAttributes, () => {
            this.onHandleTouchStart = this.onHandleTouchStart.bind(this)
            this.onHandleTouchMove = this.onHandleTouchMove.bind(this)
            this.onHandleTouchEnd = this.onHandleTouchEnd.bind(this)
            this.onHandleTouchCancel = this.onHandleTouchCancel.bind(this)
            this.onWrapperTap = this.onWrapperTap.bind(this)
            this.sliderWrapper = this.shadowRoot.querySelector('.wx-slider-wrapper')
            this.wrapperDom = this.shadowRoot.querySelector('#wrapper')
            this.sliderHandleWrapper = this.shadowRoot.querySelector('.wx-slider-handle-wrapper')
            this.handleDom = this.shadowRoot.querySelector('#handle')
            this.sliderThumb = this.shadowRoot.querySelector('.wx-slider-thumb')
            this.sliderTrack = this.shadowRoot.querySelector('.wx-slider-track')
            this.stepDom = this.shadowRoot.querySelector('#step')
            this.sliderValue = this.shadowRoot.querySelector('.wx-slider-value')
            this.sliderValueP = this.sliderValue.querySelector('p')
        })
    }

    static register() {
        customElements.define('wx-slider', WxSlider)
    }

    connectedCallback() {
        super.connectedCallback()

        this._startValue = null

        this.handleDom.addEventListener('touchstart', this.onHandleTouchStart)
        this.handleDom.addEventListener('touchmove', this.onHandleTouchMove)
        this.handleDom.addEventListener('touchend', this.onHandleTouchEnd)
        this.handleDom.addEventListener('touchcancel', this.onHandleTouchCancel)
        this.wrapperDom.addEventListener('tap', this.onWrapperTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.handleDom.removeEventListener('touchstart', this.onHandleTouchStart)
        this.handleDom.removeEventListener('touchmove', this.onHandleTouchMove)
        this.handleDom.removeEventListener('touchend', this.onHandleTouchEnd)
        this.handleDom.removeEventListener('touchcancel', this.onHandleTouchCancel)
        this.wrapperDom.removeEventListener('tap', this.onWrapperTap)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'min' || name === 'max' || name === 'value') {
            const value = this.adjustValue(this.value)
            const width = `${(value - this.min) * 100 / (this.max - this.min)}%`

            this.handleDom.style.left = width
            this.sliderThumb.style.left = width
            this.sliderTrack.style.width = width
            this.sliderValueP.style.width = `${this.max.toString().length}ch`

            this.sliderValueP.innerText = value % 1 === 0 ? value : value.toFixed(Math.max(getDecimalsLength(this.max), getDecimalsLength(this.min), getDecimalsLength(this.step)))
        } else if (name === 'color' || name === 'background-color') {
            let color = SLIDE_BACKGROUND_COLOR
            if (this.backgroundColor !== SLIDE_BACKGROUND_COLOR) color = this.backgroundColor
            else if (this.color !== SLIDE_BACKGROUND_COLOR) color = this.color
            this.sliderHandleWrapper.style.backgroundColor = color
        } else if (name === 'selected-color' || name === 'active-color') {
            let color = SLIDE_ACTIVE_COLOR
            if (this.activeColor !== SLIDE_ACTIVE_COLOR) color = this.activeColor
            else if (this.selectedColor !== SLIDE_ACTIVE_COLOR) color = this.selectedColor
            this.sliderTrack.style.backgroundColor = color
        } else if (name === 'block-size') {
            const blockSize = Math.min(Math.max(this.blockSize, 12), 28)
            const marginSize = blockSize / 2

            this.sliderThumb.style.width = `${blockSize}px`
            this.sliderThumb.style.height = `${blockSize}px`
            this.sliderThumb.style.marginLeft = `-${marginSize}px`
            this.sliderThumb.style.marginTop = `-${marginSize}px`
        } else if (name === 'block-color') {
            this.sliderThumb.style.backgroundColor = this.blockColor
        } else if (name === 'show-value') {
            this.sliderValue.style.display = this.showValue ? 'block' : 'none'
        } else if (name === 'disabled') {
            this.sliderWrapper.classList.toggle('wx-slider-disabled', this.disabled)
        }
    }

    static get observedAttributes() {
        return ['min', 'max', 'step', 'disabled', 'value', 'color', 'selected-color', 'active-color', 'background-color', 'block-size', 'block-color', 'show-value', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get min() {
        return this.getNumberValue('min')
    }

    get max() {
        return this.getNumberValue('max', 100)
    }

    get step() {
        return this.getNumberValue('step', 1)
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get value() {
        return this.getNumberValue('value')
    }

    set value(value) {
        this.setAttribute('value', value)
    }

    get color() {
        return this.getAttribute('color') || SLIDE_BACKGROUND_COLOR
    }

    get selectedColor() {
        return this.getAttribute('selected-color') || SLIDE_ACTIVE_COLOR
    }

    get activeColor() {
        return this.getAttribute('active-color') || SLIDE_ACTIVE_COLOR
    }

    get backgroundColor() {
        return this.getAttribute('background-color') || SLIDE_BACKGROUND_COLOR
    }

    get blockSize() {
        return this.getNumberValue('block-size', 28)
    }

    get blockColor() {
        return this.getAttribute('block-color') || '#FFFFFF'
    }

    get showValue() {
        return this.getBoolValue('show-value')
    }

    /**
     * 监听触摸事件
     */
    onHandleTouchStart(evt) {
        if (this.disabled) return
        if (evt.touches.length === 1 && !this._startEvt) {
            this._startEvt = evt
            if (this._startValue === null) this._startValue = this.value
        }
    }

    onHandleTouchMove(evt) {
        if (this.disabled) return
        if (evt.touches.length === 1 && this._startEvt) {
            evt.preventDefault()
            evt.stopPropagation()

            this.onValueChanged(evt.touches[0].pageX)
            this.dispatchEvent(new CustomEvent('changing', {bubbles: true, cancelable: true, detail: {value: this.value}}))
        }
    }

    onHandleTouchEnd(evt) {
        if (this.disabled) return
        if (evt.touches.length === 0 && this._startEvt) {
            this.dispatchChangeEvent(evt.changedTouches[0].pageX)
            this._startEvt = null
            this._startValue = null
        }
    }

    onHandleTouchCancel(evt) {
        if (this.disabled) return
        if (this._startEvt) {
            this.dispatchChangeEvent(evt.touches[0].pageX)
            this._startEvt = null
            this._startValue = null
        }
    }

    /**
     * 触发 change 事件
     */
    dispatchChangeEvent(x) {
        if (this.onValueChanged(x)) this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value: this.value}}))
    }

    /**
     * 监听值变化
     */
    onValueChanged(x) {
        const width = this.stepDom.offsetWidth
        const startLocation = this.stepDom.getBoundingClientRect().left
        const currentValue = this.adjustValue((x - startLocation) * (this.max - this.min) / width + this.min)

        if (this._startValue === null) {
            if (isNumEqual(currentValue, this.value)) return false
        } else if (isNumEqual(currentValue, this._startValue)) {
            return false
        }

        this.value = currentValue
        return true
    }

    /**
     * 调整值
     */
    adjustValue(value) {
        if (value < this.min) return this.min
        if (value > this.max) return this.max
        return Math.round((value - this.min) / this.step) * this.step + this.min
    }

    /**
     * 监听 wrapper 点击
     */
    onWrapperTap(evt) {
        if (this.disabled) return
        this.dispatchChangeEvent(evt.detail.pageX)
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        return this.value
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.value = this.min
    }
}
