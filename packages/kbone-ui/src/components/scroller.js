import Base from './base'
import {
    Spring,
} from '../utils/animation-spring'
import {
    animation,
} from '../utils/tool'

const UNDERSCROLL_TRACKING = 0.5

/**
 * 摩擦力类，用于计算惯性
 */
class Friction {
    constructor(drag) {
        this._drag = drag
        this._dragLog = Math.log(drag)
        this._x = 0
        this._v = 0
        this._startTime = 0
    }

    set(x, v) {
        this._x = x
        this._v = v
        this._startTime = Date.now()
    }

    setVelocityByEnd(endPos) {
        this._v = (endPos - this._x) * this._dragLog / ((this._drag ** 100) - 1)
    }

    x(dt) {
        if (dt === undefined) dt = (Date.now() - this._startTime) / 1000
        let powDragDt
        if (dt === this._dt && this._powDragDt) {
            powDragDt = this._powDragDt
        } else {
            powDragDt = this._powDragDt = this._drag ** dt
        }
        this._dt = dt
        return this._x + this._v * powDragDt / this._dragLog - this._v / this._dragLog
    }

    dx(dt) {
        if (dt === undefined) dt = (Date.now() - this._startTime) / 1000
        let powDragDt
        if (dt === this._dt && this._powDragDt) {
            powDragDt = this._powDragDt
        } else {
            powDragDt = this._powDragDt = this._drag ** dt
        }
        this._dt = dt
        return this._v * powDragDt
    }

    done() {
        return Math.abs(this.dx()) < 3
    }

    reconfigure(drag) {
        const x = this.x()
        const v = this.dx()
        this._drag = drag
        this._dragLog = Math.log(drag)
        this.set(x, v)
    }

    configuration() {
        return [{
            label: 'Friction',
            read: () => this._drag,
            write: drag => this.reconfigure(drag),
            min: 0.001,
            max: 0.1,
            step: 0.001,
        }]
    }
}

/**
 * 滚动类，整合弹性和摩擦力
 */
class Scroll {
    constructor(extent) {
        this._extent = extent
        this._friction = new Friction(0.01)
        this._spring = new Spring(1, 90, 20)
        this._startTime = 0
        this._springing = false
        this._springOffset = 0
    }

    snap(x0, x1) {
        this._springOffset = 0
        this._springing = true
        this._spring.snap(x0)
        this._spring.setEnd(x1)
    }

    set(x, v) {
        this._friction.set(x, v)

        // 如果超出范围或为 0，则开始处理弹性
        if (x > 0 && v >= 0) {
            this._springOffset = 0
            this._springing = true
            this._spring.snap(x)
            this._spring.setEnd(0)
        } else if (x < -this._extent && v <= 0) {
            this._springOffset = 0
            this._springing = true
            this._spring.snap(x)
            this._spring.setEnd(-this._extent)
        } else {
            this._springing = false
        }
        this._startTime = Date.now()
    }

    x(t) {
        if (!this._startTime) return 0
        if (!t) t = (Date.now() - this._startTime) / 1000
        if (this._springing) return this._spring.x() + this._springOffset
        let x = this._friction.x(t)
        const dx = this.dx(t)
        if ((x > 0 && dx >= 0) || (x < -this._extent && dx <= 0)) {
            this._springing = true
            this._spring.setEnd(0, dx)
            if (x < -this._extent) this._springOffset = -this._extent
            else this._springOffset = 0
            x = this._spring.x() + this._springOffset
        }

        return x
    }

    dx(t) {
        let dx = 0

        if (this._lastTime === t) dx = this._lastDx
        else if (this._springing) dx = this._spring.dx(t)
        else dx = this._friction.dx(t)

        this._lastTime = t
        this._lastDx = dx
        return dx
    }

    done() {
        if (this._springing) return this._spring.done()
        else return this._friction.done()
    }

    setVelocityByEnd(endPos) {
        this._friction.setVelocityByEnd(endPos)
    }

    configuration() {
        const config = this._friction.configuration()
        config.push(...this._spring.configuration())
        return config
    }
}

class ScrollHandler {
    constructor(element, options) {
        options = options || {}

        this._element = element
        this._options = options

        this._enableSnap = options.enableSnap || false
        this._itemSize = options.itemSize || 0
        this._enableX = options.enableX || false
        this._enableY = options.enableY || false
        this._shouldDispatchScrollEvent = !!options.onScroll

        if (this._enableX) {
            this._extent = (options.scrollWidth || this._element.offsetWidth) - this._element.parentElement.offsetWidth
            this._scrollWidth = options.scrollWidth
        } else {
            this._extent = (options.scrollHeight || this._element.offsetHeight) - this._element.parentElement.offsetHeight
            this._scrollHeight = options.scrollHeight
        }

        this._position = 0
        this._scroll = new Scroll(this._extent)
        this._onTransitionEnd = this.onTransitionEnd.bind(this)

        this.updatePosition()
    }

    onTouchStart() {
        this._startPosition = this._position
        this._lastChangePos = this._startPosition

        if (this._startPosition > 0) this._startPosition /= UNDERSCROLL_TRACKING
        else if (this._startPosition < -this._extent) this._startPosition = (this._startPosition + this._extent) / UNDERSCROLL_TRACKING - this._extent

        if (this._animation) {
            this._animation.cancel()
            this._scrolling = false
        }

        this.updatePosition()

        if (this._options.onTouchStart) this._options.onTouchStart()
    }

    onTouchMove(dx, dy) {
        let pos = this._startPosition

        if (this._enableX) pos += dx
        else if (this._enableY) pos += dy

        if (pos > 0) pos *= UNDERSCROLL_TRACKING
        else if (pos < -this._extent) pos = (pos + this._extent) * UNDERSCROLL_TRACKING - this._extent

        this._position = pos
        this.updatePosition()
        this.dispatchScroll()

        if (pos < 0 && pos > -this._extent) {
            const currIdx = Math.floor(Math.abs(pos / this._itemSize))
            if (Math.abs(pos - this._lastChangePos) > this._itemSize / 2 && typeof this._lastIdx === 'number' && this._lastIdx !== currIdx) {
                this._lastChangePos = pos
            }
            this._lastIdx = currIdx
        }
    }

    onTouchEnd(dx, dy, velocity) {
        if (this._enableSnap && this._position > -this._extent && this._position < 0) {
            if (this._enableY && (Math.abs(dy) < this._itemSize && Math.abs(velocity.y) < 300 || Math.abs(velocity.y) < 150)) {
                this.snap()
                return
            }
            if (this._enableX && (Math.abs(dx) < this._itemSize && Math.abs(velocity.x) < 300 || Math.abs(velocity.x) < 150)) {
                this.snap()
                return
            }
        }

        if (this._enableX) this._scroll.set(this._position, velocity.x)
        else if (this._enableY) this._scroll.set(this._position, velocity.y)

        // 滚动结束点刚好处在某一项
        let next
        if (this._enableSnap) {
            const endPos = this._scroll._friction.x(100)
            const left = endPos % this._itemSize
            next = (Math.abs(left) > this._itemSize / 2) ? endPos - (this._itemSize - Math.abs(left)) : endPos - left

            if (next <= 0 && next >= -this._extent) this._scroll.setVelocityByEnd(next)
        }

        this._lastTime = Date.now()
        this._lastDelay = 0
        this._scrolling = true
        this._lastChangePos = this._position
        this._lastIdx = Math.floor(Math.abs(this._position / this._itemSize))

        this._animation = animation(this._scroll, () => {
            const now = Date.now()
            const t = (now - this._scroll._startTime) / 1000
            const pos = this._scroll.x(t)
            this._position = pos
            this.updatePosition()

            const v = this._scroll.dx(t)
            const isSpringing = this._scroll._springing

            if (Math.abs(v) <= 800 || isSpringing) {
                this._lastIdx = Math.floor(Math.abs(pos / this._itemSize))
            }

            if (!isSpringing) {
                const currIdx = Math.floor(Math.abs(pos / this._itemSize))
                const left = Math.abs(pos % this._itemSize)
                if (Math.abs(pos - this._lastChangePos) > this._itemSize / 2) {
                    if (this._lastIdx !== currIdx || (v < 5 && (left < 1 || this._itemSize - left < 1))) {
                        this._lastChangePos = pos
                    }
                }
                this._lastIdx = currIdx
            }

            if (this._shouldDispatchScrollEvent && now - this._lastTime > this._lastDelay) {
                this.dispatchScroll()
                // 速度的反比函数，速度越慢 delay 越大，隔 delay ms 触发 scroll 事件
                this._lastDelay = Math.abs(2000 / v)
                this._lastTime = now
            }
        }, () => {
            if (this._enableSnap) {
                if (next <= 0 && next >= -this._extent) {
                    this._position = next
                    this.updatePosition()
                }
                if (typeof this._options.onSnap === 'function') this._options.onSnap(Math.floor(Math.abs(this._position) / this._itemSize))
            }
            if (this._shouldDispatchScrollEvent) this.dispatchScroll()
            this._scrolling = false
        })
    }

    onTransitionEnd() {
        this._element.style.transition = ''
        this._element.style.webkitTransition = ''
        this._element.removeEventListener('transitionend', this._onTransitionEnd)
        this._element.removeEventListener('webkitTransitionEnd', this._onTransitionEnd)
        if (this._snapping) this._snapping = false
        this.dispatchScroll()
    }

    snap() {
        const h = this._itemSize
        const left = this._position % h
        const next = (Math.abs(left) > this._itemSize / 2) ? this._position - (h - Math.abs(left)) : this._position - left

        if (this._position === next) return

        this._snapping = true
        this.scrollTo(-next)
        if (typeof this._options.onSnap === 'function') this._options.onSnap(Math.floor(Math.abs(this._position) / this._itemSize))
    }

    scrollTo(pos, time) {
        if (this._animation) {
            this._animation.cancel()
            this._scrolling = false
        }

        if (typeof pos === 'number') this._position = -pos

        if (this._position < -this._extent) this._position = -this._extent
        else if (this._position > 0) this._position = 0

        this._element.style.transition = `transform ${time || 0.2}s ease-out`
        this._element.style.webkitTransition = `-webkit-transform ${time || 0.2}s ease-out`
        this.updatePosition()
        this._element.addEventListener('transitionend', this._onTransitionEnd)
        this._element.addEventListener('webkitTransitionEnd', this._onTransitionEnd)
    }

    dispatchScroll() {
        if (typeof this._options.onScroll !== 'function') return
        if (Math.round(this._lastPos) === Math.round(this._position)) return

        this._lastPos = this._position

        const evt = {
            target: {
                scrollLeft: this._enableX ? -this._position : 0,
                scrollTop: this._enableY ? -this._position : 0,
                scrollHeight: this._scrollHeight || this._element.offsetHeight,
                scrollWidth: this._scrollWidth || this._element.offsetWidth,
                offsetHeight: this._element.parentElement.offsetHeight,
                offsetWidth: this._element.parentElement.offsetWidth,
            }
        }

        this._options.onScroll(evt)
    }

    update(pos, offset, itemSize) {
        let extent = 0
        const last = this._position

        if (this._enableX) {
            extent = this._element.childNodes.length ? (offset || this._element.offsetWidth) - this._element.parentElement.offsetWidth : 0
            this._scrollWidth = offset
        } else {
            extent = this._element.childNodes.length ? (offset || this._element.offsetHeight) - this._element.parentElement.offsetHeight : 0
            this._scrollHeight = offset
        }

        if (typeof pos === 'number') this._position = -pos

        if (this._position < -extent) this._position = -extent
        else if (this._position > 0) this._position = 0

        this._itemSize = itemSize || this._itemSize
        this.updatePosition()
        if (last !== this._position) {
            this.dispatchScroll()
            if (typeof this._options.onSnap === 'function') this._options.onSnap(Math.floor(Math.abs(this._position) / this._itemSize))
        }

        this._extent = extent
        this._scroll._extent = extent
    }

    updatePosition() {
        let transform = ''

        if (this._enableX) transform = `translateX(${this._position}px) translateZ(0)`
        else if (this._enableY) transform = `translateY(${this._position}px) translateZ(0)`

        this._element.style.webkitTransform = transform
        this._element.style.transform = transform
    }

    isScrolling() {
        return this._scrolling || this._snapping
    }
}

export default class Scroller extends Base {
    constructor(options = {}) {
        super(options)

        this.onScrollerTouchStart = this.onScrollerTouchStart.bind(this)
        this.onScrollerTouchMove = this.onScrollerTouchMove.bind(this)
        this.onScrollerTouchEnd = this.onScrollerTouchEnd.bind(this)
    }

    /**
     * 初始化 scroller
     */
    initScroller(element, options) {
        this._touchInfo = {trackingID: -1, maxDy: 0, maxDx: 0}
        this._scroller = new ScrollHandler(element, options)
        this._initedScroller = true
    }

    /**
     * 监听触摸事件
     */
    onScrollerTouchStart(evt) {
        const touchInfo = this._touchInfo

        if (!this._scroller) return

        touchInfo.trackingID = 'touch'
        touchInfo.x = evt.pageX
        touchInfo.y = evt.pageY
        touchInfo.maxDx = 0
        touchInfo.maxDy = 0
        touchInfo.historyX = [0]
        touchInfo.historyY = [0]
        touchInfo.historyTime = [evt.timeStamp]

        this._scrollerStartX = evt.touches[0].pageX
        this._scrollerStartY = evt.touches[0].pageY

        if (this._scroller.onTouchStart) this._scroller.onTouchStart()
    }

    onScrollerTouchMove(evt) {
        const touchInfo = this._touchInfo
        if (!this._scroller || touchInfo.trackingID === -1) return

        evt.preventDefault()

        const dx = evt.touches[0].pageX - this._scrollerStartX
        const dy = evt.touches[0].pageY - this._scrollerStartY

        touchInfo.maxDx = Math.max(touchInfo.maxDx, Math.abs(dx))
        touchInfo.maxDy = Math.max(touchInfo.maxDy, Math.abs(dy))

        touchInfo.historyX.push(dx)
        touchInfo.historyY.push(dy)
        touchInfo.historyTime.push(evt.timeStamp)
        while (touchInfo.historyTime.length > 10) {
            touchInfo.historyTime.shift()
            touchInfo.historyX.shift()
            touchInfo.historyY.shift()
        }

        if (this._scroller.onTouchMove) this._scroller.onTouchMove(dx, dy, evt.timeStamp)
    }

    onScrollerTouchEnd(evt) {
        const touchInfo = this._touchInfo
        if (!this._scroller || touchInfo.trackingID === -1) return

        evt.preventDefault()

        let dx = 0
        let dy = 0
        if (evt.type === 'touchend') {
            dx = evt.changedTouches[0].pageX - this._scrollerStartX
            dy = evt.changedTouches[0].pageY - this._scrollerStartX
        } else {
            dx = evt.touches[0].pageX - this._scrollerStartX
            dy = evt.touches[0].pageY - this._scrollerStartX
        }

        touchInfo.trackingID = -1

        const sampleCount = touchInfo.historyTime.length
        const velocity = {x: 0, y: 0}
        if (sampleCount > 2) {
            let index = touchInfo.historyTime.length - 1
            const lastTime = touchInfo.historyTime[index]
            const lastX = touchInfo.historyX[index]
            const lastY = touchInfo.historyY[index]
            while (index > 0) {
                index--
                const t = touchInfo.historyTime[index]
                const dt = lastTime - t
                if (dt > 30 && dt < 50) {
                    velocity.x = (lastX - touchInfo.historyX[index]) / (dt / 1000)
                    velocity.y = (lastY - touchInfo.historyY[index]) / (dt / 1000)
                    break
                }
            }
        }
        touchInfo.historyTime = []
        touchInfo.historyX = []
        touchInfo.historyY = []

        if (this._scroller.onTouchEnd) this._scroller.onTouchEnd(dx, dy, velocity)
    }
}
