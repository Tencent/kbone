import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const PROGRESS_BACKGROUND_COLOR = '#EBEBEB'
const PROGRESS_ACTIVE_COLOR = '#09BB07'

export default class WxProgress extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxProgress.observedAttributes, () => {
            this.wxProgressBar = this.shadowRoot.querySelector('.wx-progress-bar')
            this.wxProgressInnerBar = this.shadowRoot.querySelector('.wx-progress-inner-bar')
            this.wxProgressInfo = this.shadowRoot.querySelector('.wx-progress-info')
        })
    }

    static register() {
        customElements.define('wx-progress', WxProgress)
    }

    connectedCallback() {
        super.connectedCallback()

        this._lastPercent = this.percent || 0
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._timerId) this._timerId = clearInterval(this._timerId)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'percent') {
            if (this._timerId) this._timerId = clearInterval(this._timerId)
            this._lastPercent = oldValue || 0
            if (!isInit) requestAnimationFrame(() => this.activeAnimation(this.active)) // 在 Web 框架中，可能先设置 percent 再设置 active
        } else if (name === 'show-info') {
            this.wxProgressInfo.style.display = this.showInfo ? 'block' : 'none'
        } else if (name === 'border-radius') {
            this.wxProgressBar.style.borderRadius = `${this.borderRadius}px`
        } else if (name === 'font-size') {
            this.wxProgressInfo.style.fontSize = `${this.fontSize}px`
        } else if (name === 'stroke-width') {
            this.wxProgressBar.style.height = `${this.strokeWidth}px`
        } else if (name === 'color' || name === 'active-color') {
            let color = PROGRESS_ACTIVE_COLOR
            if (this.activeColor !== PROGRESS_ACTIVE_COLOR) color = this.activeColor
            else if (this.color !== PROGRESS_ACTIVE_COLOR) color = this.color
            this.wxProgressInnerBar.style.backgroundColor = color
        } else if (name === 'background-color') {
            this.wxProgressBar.style.backgroundColor = this.backgroundColor
        }
    }

    static get observedAttributes() {
        return ['percent', 'show-info', 'border-radius', 'font-size', 'stroke-width', 'color', 'active-color', 'background-color', 'active', 'active-mode', 'duration', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get percent() {
        let value = this.getNumberValue('percent')
        if (value > 100) value = 100
        if (value < 0) value = 0
        return value
    }

    get showInfo() {
        return this.getBoolValue('show-info')
    }

    get borderRadius() {
        return this.getNumberValue('border-radius')
    }

    get fontSize() {
        return this.getNumberValue('font-size', 16)
    }

    get strokeWidth() {
        return this.getNumberValue('stroke-width', 6)
    }

    get color() {
        return this.getAttribute('color') || PROGRESS_ACTIVE_COLOR
    }

    get activeColor() {
        return this.getAttribute('active-color') || PROGRESS_ACTIVE_COLOR
    }

    get backgroundColor() {
        return this.getAttribute('background-color') || PROGRESS_BACKGROUND_COLOR
    }

    get active() {
        return this.getBoolValue('active')
    }

    get activeMode() {
        return this.getAttribute('active-mode', 'backwards')
    }

    get duration() {
        return this.getNumberValue('duration', 30)
    }

    /**
     * 旧的进度值
     */
    get _lastPercent() {
        let value = this.filterNumberValue(this.__lastpercent)
        if (value > 100) value = 100
        if (value < 0) value = 0
        return value
    }

    set _lastPercent(value) {
        this.__lastpercent = value
    }

    /**
     * 当前进度值
     */
    get _curentPercent() {
        return this.__curentPercent
    }

    set _curentPercent(value) {
        this.__curentPercent = value
        this.wxProgressInnerBar.style.width = `${value}%`
        this.wxProgressInfo.innerText = `${value}%`
    }

    /**
     * 执行变化
     */
    activeAnimation(active) {
        if (active) {
            // 带动画
            this._curentPercent = this.activeMode === 'forwards' ? this._lastPercent : 0
            const next = () => {
                if (this.percent <= this._curentPercent + 1) {
                    this._curentPercent = this.percent
                    if (this._timerId) this._timerId = clearInterval(this._timerId)
                    this.dispatchEvent(new CustomEvent('activeend', {bubbles: true, cancelable: true, detail: {curPercent: this._curentPercent}}))
                    return
                }
                ++this._curentPercent
            }
            if (this._timerId) this._timerId = clearInterval(this._timerId)
            this._timerId = setInterval(next, this.duration)
            next()
        } else {
            // 不带动画
            this._curentPercent = this.percent
        }
    }
}
