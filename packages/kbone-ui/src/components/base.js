
import {
    os,
} from '../utils/tool'

const SIMULATING_TOUCH_MIN_MOVE = 5

let globalConfig = {}

export default class Base extends HTMLElement {
    constructor() {
        super()

        this._mode = globalConfig.mode || 'open'
        this._style = globalConfig.style && globalConfig.style[this.tagName.toLowerCase()] || ''

        this._simulatingTouchTarget = null
        this._simulatingTouchPos = null
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onBaseTouchStart = this.onBaseTouchStart.bind(this)
        this.onBaseTouchMove = this.onBaseTouchMove.bind(this)
        this.onBaseTouchEnd = this.onBaseTouchEnd.bind(this)
        this.onBaseTouchCancel = this.onBaseTouchCancel.bind(this)
    }

    connectedCallback() {
        if (os.isPc) {
            this.addEventListener('mousedown', this.onMouseDown, {capture: true, passive: false})
            this.addEventListener('mousemove', this.onMouseMove, {capture: true, passive: false})
            document.body.addEventListener('mouseup', this.onMouseUp, {capture: true, passive: false})
        }
        this.addEventListener('blur', this.onBlur, {capture: true, passive: false})
        this.shadowRoot.addEventListener('touchstart', this.onBaseTouchStart)
        this.shadowRoot.addEventListener('touchmove', this.onBaseTouchMove)
        this.shadowRoot.addEventListener('touchend', this.onBaseTouchEnd)
        this.shadowRoot.addEventListener('touchcancel', this.onBaseTouchCancel)
        window.addEventListener('scroll', this.onBaseTouchCancel)
    }

    disconnectedCallback() {
        if (os.isPc) {
            this.removeEventListener('mousedown', this.onMouseDown, {capture: true, passive: false})
            this.removeEventListener('mousemove', this.onMouseMove, {capture: true, passive: false})
            document.body.removeEventListener('mouseup', this.onMouseUp, {capture: true, passive: false})
        }
        this.removeEventListener('blur', this.onBlur, {capture: true, passive: false})
        this.shadowRoot.removeEventListener('touchstart', this.onBaseTouchStart)
        this.shadowRoot.removeEventListener('touchmove', this.onBaseTouchMove)
        this.shadowRoot.removeEventListener('touchend', this.onBaseTouchEnd)
        this.shadowRoot.removeEventListener('touchcancel', this.onBaseTouchCancel)
        window.removeEventListener('scroll', this.onBaseTouchCancel)
    }

    attributeChangedCallback() {
        // ignore
    }

    static get observedAttributes() {
        return ['disabled', 'hidden']
    }

    /**
     * 属性
     */
    get behavior() {
        return this.tagName.toLowerCase().slice(3)
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get hidden() {
        return this.getAttribute('hidden')
    }

    /**
     * 设置全局配置
     */

    static setGlobal(options = {}) {
        globalConfig = options
    }

    /**
     * 初始化 shadowRoot
     */
    initShadowRoot(template, attributes, afterAttach) {
        this.attachShadow({mode: this._mode}).appendChild(template.content.cloneNode(true))
        this.addExtraStyle(this._style)

        if (afterAttach) afterAttach()

        // 初始化属性
        attributes.forEach(name => this.attributeChangedCallback(name, null, this[name], true))
    }

    /**
     * 扩展样式
     */
    addExtraStyle(style) {
        if (typeof style !== 'string' || !style.trim()) return
        const styleDom = document.createElement('style')
        styleDom.innerHTML = style
        this.shadowRoot.appendChild(styleDom)
    }

    /**
     * 获取布尔值的属性
     */
    getBoolValue(name, defaultValue = false) {
        const value = this.getAttribute(name)
        if (defaultValue) {
            // 默认值为 true 的话，null 表示 true
            return value !== 'false'
        } else {
            return value !== 'false' && value !== null
        }
    }

    /**
     * 获取数字值的属性
     */
    getNumberValue(name, defaultValue = 0) {
        return this.filterNumberValue(this.getAttribute(name), defaultValue)
    }

    /**
     * 调整数字值的属性
     */
    filterNumberValue(value, defaultValue = 0) {
        value = parseFloat(value)
        return !isNaN(value) ? value : defaultValue
    }

    /**
     * 获取对象值的属性
     */
    getObjectValue(name, defaultValue) {
        return this.filterObjectValue(this.getAttribute(name), defaultValue)
    }

    /**
     * 调整对象值的属性
     */
    filterObjectValue(value, defaultValue) {
        if (value === null) return defaultValue
        try {
            value = JSON.parse(value)
        } catch (err) {
            value = defaultValue
        }
        return value
    }

    /**
     * 判断是否滚动
     */
    isScrolling() {
        const now = +new Date()
        let element = this

        while (element) {
            if (element._scrolling && now - element._scrolling < 50) return true
            element = element.parentNode
        }
        return false
    }

    /**
     * 触发 touch 事件
     */
    triggerTouchEvent(eventName, evt, inChangedTouches) {
        const touchEvent = new TouchEvent(eventName, {
            cancelable: true,
            bubbles: true,
            touches: inChangedTouches ? [] : [new Touch({
                identifier: 0,
                pageX: evt.pageX,
                pageY: evt.pageY,
                clientX: evt.clientX,
                clientY: evt.clientY,
                screenX: evt.screenX,
                screenY: evt.screenY,
                target: this._simulatingTouchTarget,
            })],
            targetTouches: [],
            changedTouches: [new Touch({
                identifier: 0,
                pageX: evt.pageX,
                pageY: evt.pageY,
                clientX: evt.clientX,
                clientY: evt.clientY,
                screenX: evt.screenX,
                screenY: evt.screenY,
                target: this._simulatingTouchTarget,
            })],
        })
        this._simulatingTouchTarget.dispatchEvent(touchEvent)
    }

    /**
     * 模拟移动端事件
     */
    onMouseDown(evt) {
        if (this._simulatingTouchTarget || evt.button !== 0) return
        const targets = this.shadowRoot.elementsFromPoint(evt.clientX, evt.clientY)
        if (!targets || !targets.length) return
        this._simulatingTouchTarget = targets[0] === this ? this.shadowRoot : targets[0] // 如果是 this，换成 shadowRoot，触发 touch 事件监听
        this._simulatingTouchPos = {x: evt.clientX, y: evt.clientY}
        this.triggerTouchEvent('touchstart', evt, false)
    }

    onMouseMove(evt) {
        if (!this._simulatingTouchTarget || evt.button !== 0) return
        if (this._simulatingTouchPos) {
            if (Math.abs(this._simulatingTouchPos.x - evt.clientX) < SIMULATING_TOUCH_MIN_MOVE && Math.abs(this._simulatingTouchPos.y - evt.clientY) < SIMULATING_TOUCH_MIN_MOVE) return
            this._simulatingTouchPos = null
        }
        this.triggerTouchEvent('touchmove', evt, false)
    }

    onMouseUp(evt) {
        if (!this._simulatingTouchTarget || evt.button !== 0) return
        this.triggerTouchEvent('touchend', evt, true)
        this._simulatingTouchTarget = null
    }

    onBlur(evt) {
        if (!this._simulatingTouchTarget) return
        this.triggerTouchEvent('touchcancel', evt, true)
        this._simulatingTouchTarget = null
    }

    /**
     * 移动端事件升级
     */
    onBaseTouchStart(evt) {
        if (!evt.touches) return

        this._baseX1 = this._baseX2 = evt.touches[0].pageX
        this._baseY1 = this._baseY2 = evt.touches[0].pageY

        if (evt.touches.length > 1) {
            // 多指不触发 tap
            this._preventTap = true
            this._longTapTimeout = clearTimeout(this._longTapTimeout)
        } else {
            const target = evt.target === this.shadowRoot ? this : evt.target // 如果是 shadowRoot，表示没有子节点触发事件，则换回 this
            this._preventTap = false
            this._longTapTimeout = setTimeout(() => {
                // 触发 longpress 后不处罚 tap
                this._preventTap = true
                if (target) target.dispatchEvent(new CustomEvent('longpress', {bubbles: true, cancelable: true}))
            }, 350)
        }
    }

    onBaseTouchMove(evt) {
        if (!evt.touches) return

        const currentX = evt.touches[0].pageX
        const currentY = evt.touches[0].pageY

        if (evt.touches.length > 1 || (Math.abs(this._baseX1 - this._baseX2) > 10 || Math.abs(this._baseY1 - this._baseY2) > 10)) {
            // 多指 或 存在移动，不触发 tap
            this._preventTap = true
        }

        this._longTapTimeout = clearTimeout(this._longTapTimeout)
        this._baseX2 = currentX
        this._baseY2 = currentY
    }

    onBaseTouchEnd(evt) {
        if (!evt.changedTouches) return

        this._longTapTimeout = clearTimeout(this._longTapTimeout)
        if ((this._baseX2 && Math.abs(this._baseX1 - this._baseX2) <= 30) && (this._baseY2 && Math.abs(this._baseY1 - this._baseY2) <= 30)) {
            const target = evt.target === this.shadowRoot ? this : evt.target // 如果是 shadowRoot，表示没有子节点触发事件，则换回 this
            const pageX = evt.changedTouches[0].pageX
            const pageY = evt.changedTouches[0].pageY
            const clientX = evt.changedTouches[0].clientX
            const clientY = evt.changedTouches[0].clientY
            this._tapTimeout = setTimeout(() => {
                if (!this._preventTap) {
                    if (target) {
                        target.dispatchEvent(new CustomEvent('tap', {
                            bubbles: true,
                            cancelable: true,
                            detail: {
                                pageX, pageY, clientX, clientY
                            }
                        }))
                    }
                }
            }, 0)
        }

        this._baseX1 = this._baseX2 = this._baseY1 = this._baseY2 = null
    }

    onBaseTouchCancel() {
        this._preventTap = true
        this._tapTimeout = clearTimeout(this._tapTimeout)
        this._longTapTimeout = clearTimeout(this._longTapTimeout)
    }
}
