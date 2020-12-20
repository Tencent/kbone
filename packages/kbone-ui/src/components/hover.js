import Base from './base'

export default class Hover extends Base {
    constructor(options = {}) {
        super(options)

        this._defaultHoverClass = options.defaultHoverClass || ''
        this._hoverClassList = []
    }

    connectedCallback() {
        super.connectedCallback()

        if ((this.hoverClass || this._defaultHoverClass) && this.hoverClass !== 'none') {
            this.onHoverClassChange(this.hoverClass || this._defaultHoverClass)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.unbindHover()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'hover-class') {
            this.onHoverClassChange(this.hoverClass)
        }
    }

    static get observedAttributes() {
        return ['hover-class', 'hover-stop-propagation', 'hover-start-time', 'hover-stay-time', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get hoverClass() {
        return this.getAttribute('hover-class')
    }

    get hoverStopPropagation() {
        return this.getBoolValue('hover-stop-propagation')
    }

    get hoverStartTime() {
        return this.getNumberValue('hover-start-time', 50)
    }

    get hoverStayTime() {
        return this.getNumberValue('hover-stay-time', 400)
    }

    /**
     * 监听 hover-class 变化
     */
    onHoverClassChange(newValue) {
        newValue = newValue || ''
        if (newValue) this._defaultHoverClass = ''

        // 只有启用点击态的时候去绑定事件，以减少事件绑定开销
        const list = newValue.split(/\s/)
        this._hoverClassList = []
        if (newValue === 'none' && !this.hoverStopPropagation) return this.unbindHover()

        list.forEach(item => {
            if (item) this._hoverClassList.push(item)
        })
        this.bindHover()
    }

    /**
     * 监听事件
     */
    bindHover() {
        if (this._hasBindHover) return
        this._hasBindHover = true
        this.addEventListener('touchstart', this.onHoverTouchStart)
        this.addEventListener('touchend', this.onHoverTouchEnd)
        this.addEventListener('touchcancel', this.onHoverTouchCancel)
    }

    /**
     * 取消监听事件
     */
    unbindHover() {
        if (!this._hasBindHover) return
        this._hasBindHover = false
        this.removeEventListener('touchstart', this.onHoverTouchStart)
        this.removeEventListener('touchend', this.onHoverTouchEnd)
        this.removeEventListener('touchcancel', this.onHoverTouchCancel)
    }

    /**
     * 监听 touchstart 事件
     */
    onHoverTouchStart(evt) {
        if (this.isScrolling()) return
        if (evt._hoverPropagationStopped) return
        if (this.hoverStopPropagation) evt._hoverPropagationStopped = true

        this._hoverTouch = true

        if (!this.disabled && this.hoverClass !== 'none') {
            if (evt.touches.length > 1) return

            if (this._hoverStartTimeId) this._hoverStartTimeId = clearTimeout(this._hoverStartTimeId)
            this._hoverStartTimeId = setTimeout(() => {
                // hover start 触发
                this._hovering = true

                if (this._defaultHoverClass) {
                    this.classList.toggle(this._defaultHoverClass, true)
                } else if (this._hoverClassList.length) {
                    this._hoverClassList.forEach(item => this.classList.toggle(item, true))
                }

                // 手指已经松开后才触发 hover start
                if (!this._hoverTouch) {
                    window.requestAnimationFrame(() => {
                        if (this._hoverStayTimeId) this._hoverStayTimeId = clearTimeout(this._hoverStayTimeId)
                        this._hoverStayTimeId = setTimeout(this.resetHover.bind(this), this.hoverStayTime)
                    })
                }
            }, this.hoverStartTime)
        }
    }

    /**
     * 监听 touchend 事件
     */
    onHoverTouchEnd() {
        this._hoverTouch = false
        if (this._hovering) {
            // 已经触发了 hover start
            window.requestAnimationFrame(() => {
                if (this._hoverStayTimeId) this._hoverStayTimeId = clearTimeout(this._hoverStayTimeId)
                this._hoverStayTimeId = setTimeout(this.resetHover.bind(this), this.hoverStayTime)
            })
        }
    }

    /**
     * 监听 touchcancel 事件
     */
    onHoverTouchCancel() {
        this._hoverTouch = false
        if (this._hoverStartTimeId) this._hoverStartTimeId = clearTimeout(this._hoverStartTimeId)
        this.resetHover()
    }

    /**
     * 重制 hover 状态
     */
    resetHover() {
        if (this._hovering) {
            // 已经触发了 hover start
            this._hovering = false

            if (this._defaultHoverClass) {
                this.classList.toggle(this._defaultHoverClass, false)
            } else if (this._hoverClassList.length) {
                this._hoverClassList.forEach(item => {
                    if (this.classList.contains(item)) this.classList.toggle(item, false)
                })
            }
        }
    }
}
