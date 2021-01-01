import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    SpringTD,
} from '../../utils/animation-spring'
import {
    findParent,
    throttleRAF,
    animation,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const MOVABLE_VIEW_SCALE_MIN = 0.5
const MOVABLE_VIEW_SCALE_MAX = 10

/**
 * 获取两个 element 之间的 offsetX
 */
const getX = (elem, parent) => (elem !== parent && elem.offsetParent ? elem.offsetLeft + getX(elem.offsetParent, parent) : 0)

/**
 * 获取两个 element 之间的 offsetY
 */
const getY = (elem, parent) => (elem !== parent && elem.offsetParent ? elem.offsetTop + getY(elem.offsetParent, parent) : 0)

/**
 * 浮点数减法运算，保留 1 位小数
 */
const sub = (arg1, arg2) => +((arg1 * 1000 - arg2 * 1000) / 1000).toFixed(1)

/**
 * 带误差的相等判断
 */
const almostEqual = (a, b) => (a > (b - 0.1)) && (a < (b + 0.1))

/**
 * 摩擦力类，用于计算惯性
 */
class Friction {
    constructor(mass, frictionCoefficient) {
        this._m = mass
        this._f = frictionCoefficient * 1000
        this._startTime = 0
        this._v = 0
    }

    /**
     * 设置速度的时候就知道加速度的方向了，知道最多能位移多少
     */
    setV(x_v, y_v) {
        const _v = ((x_v ** 2) + (y_v ** 2)) ** 0.5
        this._x_v = x_v
        this._y_v = y_v
        if (!_v) {
            this._x_a = this._y_a = this._t = 0
        } else {
            this._x_a = -this._f * this._x_v / _v // x 方向的加速度，方向与速度方向相反
            this._y_a = -this._f * this._y_v / _v // y 方向的加速度，方向与速度方向相反
            this._t = Math.abs(x_v / this._x_a) || Math.abs(y_v / this._y_a) // 算一下最多移动的时间
        }
        this._lastDt = null // 记录上次计算出来的时间间隔
        this._startTime = (new Date()).getTime()
    }

    /**
     * 设置现在的位移
     */
    setS(x_s, y_s) {
        this._x_s = x_s
        this._y_s = y_s
    }

    /**
     * 规定向右、下为正方向
     */
    s(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        if (dt > this._t) {
        // 如果按帧渲染的时间大于可移动的时间，修改之
            dt = this._t
            this._lastDt = dt
        }

        let x = this._x_v * dt + 0.5 * this._x_a * (dt ** 2) + this._x_s
        let y = this._y_v * dt + 0.5 * this._y_a * (dt ** 2) + this._y_s

        if (this._x_a > 0 && x < this._endPositionX || this._x_a < 0 && x > this._endPositionX) x = this._endPositionX
        if (this._y_a > 0 && y < this._endPositionY || this._y_a < 0 && y > this._endPositionY) y = this._endPositionY

        return {x, y}
    }

    ds(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        if (dt > this._t) dt = this._t
        return {
            dx: this._x_v + this._x_a * dt,
            dy: this._y_v + this._y_a * dt
        }
    }

    delta() {
        return {
            x: -1.5 * (this._x_v ** 2) / this._x_a || 0,
            y: -1.5 * (this._y_v ** 2) / this._y_a || 0
        }
    }

    dt() {
        return -this._x_v / this._x_a
    }

    done() {
        const isDone = almostEqual(this.s().x, this._endPositionX) || almostEqual(this.s().y, this._endPositionY) || this._lastDt === this._t
        this._lastDt = null
        return isDone
    }

    setEnd(x, y) {
        this._endPositionX = x
        this._endPositionY = y
    }

    reconfigure(mass, frictionCoefficient) {
        this._m = mass
        this._f = frictionCoefficient * 1000
    }
}

export default class WxMovableView extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxMovableView.observedAttributes, () => {
            this.onHandleTouchStart = this.onHandleTouchStart.bind(this)
            this.onHandleTouchMove = this.onHandleTouchMove.bind(this)
            this.onHandleTouchEnd = this.onHandleTouchEnd.bind(this)

            this._x = 0 // this.x 需要过滤，使用 this._x 代替
            this._y = 0 // this.y 需要过滤，使用 this._y 代替
            this._scaleValue = 1 // this.scaleValue 需要顾虑，使用 this._scaleValue 代替

            // wx-movable-area 的宽高
            this._areaWidth = 0
            this._areaHeight = 0

            this._offset = {x: 0, y: 0} // 当前 wx-movable-view 相对于 wx-movable-area 的偏移
            this._scaleOffset = {x: 0, y: 0} // 放缩造成的偏移

            this._translateX = 0 // 保存元素的 translateX
            this._translateY = 0 // 保存元素的 translateY
            this._scale = 1 // 保存元素的 scale
            this._oldScale = 1 // 保存元素上一次放缩结束后的 scale

            // x和y的变化范围
            this._minX = 0
            this._minY = 0
            this._maxX = 0
            this._maxY = 0

            this._STD = new SpringTD(1, 90, 20) // 弹簧模型，用于回弹和移动时的动画
            this._friction = new Friction(1, 2) // 二维方向摩擦力模型，用于惯性滚动

            // 用于计算移动速度
            this._touchInfo = {
                historyX: [0, 0],
                historyY: [0, 0],
                historyT: [0, 0],
            }
        })
    }

    static register() {
        customElements.define('wx-movable-view', WxMovableView)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听属性变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    this.updateWH() // 更新宽高
                    this.updateBoundary() // 更新边界
                    this.revise()
                } else if (mutation.attributeName === 'style') {
                    if (this._notCheckStyle) {
                        // 避免循环触发，只考虑用户设置的 style
                        this._notCheckStyle = false
                        return
                    }

                    this.setTransform(this._translateX, this._translateY, this._scale, '', true, false)
                    this.style.transformOrigin = 'center'

                    this.updateWH() // 更新宽高
                    this.updateBoundary() // 更新边界
                    this.revise()
                }
            })
        })
        this._observer.observe(this, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        })

        this.addEventListener('touchstart', this.onHandleTouchStart)
        this.addEventListener('touchmove', this.onHandleTouchMove)
        this.addEventListener('touchend', this.onHandleTouchEnd)
        this.addEventListener('touchcancel', this.onHandleTouchEnd)

        this.updateWxMovableArea()
        this._notCheckStyle = true
        this.style.transformOrigin = 'center' // 将变形中心设为组件中心，用于放缩功能
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
        this._parent = null

        this.removeEventListener('touchstart', this.onHandleTouchStart)
        this.removeEventListener('touchmove', this.onHandleTouchMove)
        this.removeEventListener('touchend', this.onHandleTouchEnd)
        this.removeEventListener('touchcancel', this.onHandleTouchEnd)

        this.updateWxMovableArea()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'direction') {
            this._xMove = this.direction === 'horizontal' || this.direction === 'all'
            this._yMove = this.direction === 'vertical' || this.direction === 'all'
        } else if (name === 'x') {
            this._x = this.x
            if (!this._xMove) return
            if (this._x + this._scaleOffset.x === this._translateX) {
                this._x = this._translateX
                return
            }

            if (this._SFA) this._SFA = this._SFA.cancel()
            // 这里不直接用 this._translateY，不然同时设置 x、y 会有时序问题
            this.animationTo(this._x + this._scaleOffset.x, this._y + this._scaleOffset.y, this._duringScaleValueAnimation ? this._scaleValue : this._scale)
        } else if (name === 'y') {
            this._y = this.y
            if (!this._yMove) return
            if (this._y + this._scaleOffset.y === this._translateY) {
                this._y = this._translateY
                return
            }

            if (this._SFA) this._SFA = this._SFA.cancel()
            // 这里不直接用 this._translateX，不然同时设置 x、y 会有时序问题
            this.animationTo(this._x + this._scaleOffset.x, this._y + this._scaleOffset.y, this._duringScaleValueAnimation ? this._scaleValue : this._scale)
        } else if (name === 'damping') {
            const value = this.damping <= 0 ? 0.01 : this.damping
            this._STD.reconfigure(1, (value ** 2) * 9 / 40, value)
        } else if (name === 'friction') {
            const value = this.friction <= 0 ? 2 : this.friction
            this._friction.reconfigure(1, value)
        } else if (name === 'scale-min' || name === 'scale-max') {
            if (!this.scale) return false

            this.updateScale(this._scale, true)
            this._oldScale = this._scale
        } else if (name === 'scale-value') {
            if (!this.scale) return false

            this._scaleValue = this.adjustScale(this.scaleValue)

            this._duringScaleValueAnimation = true
            this.updateScale(this._scaleValue, true, () => this._duringScaleValueAnimation = false)
            this._oldScale = this._scaleValue
        }
    }

    static get observedAttributes() {
        return ['direction', 'inertia', 'out-of-bounds', 'x', 'y', 'damping', 'friction', 'disabled', 'scale', 'scale-min', 'scale-max', 'scale-value', 'animation', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get direction() {
        return this.getAttribute('direction') || 'none'
    }

    get inertia() {
        return this.getBoolValue('inertia')
    }

    get outOfBounds() {
        return this.getBoolValue('out-of-bounds')
    }

    get x() {
        return this.getNumberValue('x')
    }

    get y() {
        return this.getNumberValue('y')
    }

    get damping() {
        return this.getNumberValue('damping', 20)
    }

    get friction() {
        return this.getNumberValue('friction', 2)
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get scale() {
        return this.getBoolValue('scale')
    }

    get scaleMin() {
        return this.getNumberValue('scale-min', 0.5)
    }

    get scaleMax() {
        return this.getNumberValue('scale-max', 10)
    }

    get scaleValue() {
        return this.getNumberValue('scale-value', 1)
    }

    get animation() {
        return this.getBoolValue('animation', true)
    }

    /**
     * 通知上层的 wx-movable-area 更新
     */
    updateWxMovableArea() {
        const parentNode = findParent(this, parentNode => parentNode.tagName === 'WX-MOVABLE-AREA')
        if (parentNode) parentNode.onMovableViewChanged()
    }

    /**
     * 监听触摸事件
     */
    onHandleTouchStart(evt) {
        if (this._isScaling || this.disabled) return

        if (this._FA) this._FA = this._FA.cancel()
        if (this._SFA) this._SFA = this._SFA.cancel()

        this._touchInfo.historyX = [0, 0]
        this._touchInfo.historyY = [0, 0]
        this._touchInfo.historyT = [0, 0]

        if (this._xMove) this._baseX = this._translateX
        if (this._yMove) this._baseY = this._translateY

        this._notCheckStyle = true
        this.style.willChange = 'transform'
        this._checkCanMove = null // 表示能否进行移动，和 disabled 无关，和第一次移动的方向有关
        this._firstMoveDirection = null // 表示第一次移动的方向
        this._isTouching = true

        this._startX = evt.touches[0].pageX
        this._startY = evt.touches[0].pageY
    }

    onHandleTouchMove(evt) {
        if (this._isScaling || this.disabled || !this._isTouching) return

        let x = this._translateX
        let y = this._translateY
        const dx = evt.touches[0].pageX - this._startX
        const dy = evt.touches[0].pageY - this._startY

        // 记录第一次移动的方向
        if (this._firstMoveDirection === null) this._firstMoveDirection = Math.abs(dx / dy) > 1 ? 'htouchmove' : 'vtouchmove'

        if (this._xMove) {
            x = dx + this._baseX

            this._touchInfo.historyX.shift()
            this._touchInfo.historyX.push(x)

            if (!this._yMove && this._checkCanMove === null) {
                // horizontal 并且是第一次 move 的时候
                this._checkCanMove = Math.abs(dx / dy) <= 1
            }
        }
        if (this._yMove) {
            y = dy + this._baseY

            this._touchInfo.historyY.shift()
            this._touchInfo.historyY.push(y)

            if (!this._xMove && this._checkCanMove === null) {
                // vertical 并且是第一次 move 的时候
                this._checkCanMove = Math.abs(dy / dx) <= 1
            }
        }

        this._touchInfo.historyT.shift()
        this._touchInfo.historyT.push(evt.timeStamp)

        if (!this._checkCanMove) {
            // 阻止外层滚动
            evt.preventDefault()

            let source = 'touch'
            if (x < this._minX) { // 超过边界
                if (this.outOfBounds) {
                    source = 'touch-out-of-bounds'
                    x = this._minX - Math.sqrt(this._minX - x)
                } else {
                    x = this._minX
                }
            } else if (x > this._maxX) {
                if (this.outOfBounds) {
                    source = 'touch-out-of-bounds'
                    x = this._maxX + Math.sqrt(x - this._maxX)
                } else {
                    x = this._maxX
                }
            }
            if (y < this._minY) {
                if (this.outOfBounds) {
                    source = 'touch-out-of-bounds'
                    y = this._minY - Math.sqrt(this._minY - y)
                } else {
                    y = this._minY
                }
            } else if (y > this._maxY) {
                if (this.outOfBounds) {
                    source = 'touch-out-of-bounds'
                    y = this._maxY + Math.sqrt(y - this._maxY)
                } else {
                    y = this._maxY
                }
            }

            throttleRAF(() => this.setTransform(x, y, this._scale, source))
        }

        // 触发 vtouchmove 和 htouchmove
        this.dispatchEvent(new CustomEvent(this._firstMoveDirection, {bubbles: true, cancelable: true}))
    }

    onHandleTouchEnd() {
        if (this._isScaling || this.disabled || !this._isTouching) return

        this._notCheckStyle = true
        this.style.willChange = 'auto'
        this._isTouching = false

        if (this._checkCanMove) return

        // 有边界回弹，直接返回，不做惯性滑动
        if (this.revise('out-of-bounds')) return

        if (this.inertia) {
            // 带有惯性
            const v_x = (this._touchInfo.historyX[1] - this._touchInfo.historyX[0]) * 1000 / (this._touchInfo.historyT[1] - this._touchInfo.historyT[0]) // x 方向的初速度
            const v_y = (this._touchInfo.historyY[1] - this._touchInfo.historyY[0]) * 1000 / (this._touchInfo.historyT[1] - this._touchInfo.historyT[0]) // y 方向的初速度

            this._friction.setV(v_x, v_y) // 给定一个初速度
            this._friction.setS(this._translateX, this._translateY)
            const deltaX = this._friction.delta().x
            const deltaY = this._friction.delta().y
            let distX = deltaX + this._translateX // 目标 x
            let distY = deltaY + this._translateY // 目标 y

            if (distX < this._minX) {
                distX = this._minX
                distY = this._translateY + (this._minX - this._translateX) * deltaY / deltaX
            } else if (distX > this._maxX) {
                distX = this._maxX
                distY = this._translateY + (this._maxX - this._translateX) * deltaY / deltaX
            }
            if (distY < this._minY) {
                distY = this._minY
                distX = this._translateX + (this._minY - this._translateY) * deltaX / deltaY
            } else if (distY > this._maxY) {
                distY = this._maxY
                distX = this._translateX + (this._maxY - this._translateY) * deltaX / deltaY
            }
            this._friction.setEnd(distX, distY) // 设置 x 和 y 的目标位置

            if (this._FA) this._FA = this._FA.cancel()
            this._FA = animation(this._friction, () => {
                const {x, y} = this._friction.s()
                this.setTransform(x, y, this._scale, 'friction')
            }, () => {
                if (this._FA) this._FA = this._FA.cancel()
            })
        }
    }

    /**
     * 获取约束范围内的 x，y
     */
    getLimitXY(x, y) {
        let outOfBounds = false

        if (x > this._maxX) {
            x = this._maxX
            outOfBounds = true
        } else if (x < this._minX) {
            x = this._minX
            outOfBounds = true
        }

        if (y > this._maxY) {
            y = this._maxY
            outOfBounds = true
        } else if (y < this._minY) {
            y = this._minY
            outOfBounds = true
        }

        return {x, y, outOfBounds}
    }

    /**
     * 设置父级 wx-movable-area，由 wx-movabel-area 调用
     */
    setParent(parent) {
        if (this._FA) this._FA = this._FA.cancel()
        if (this._SFA) this._SFA = this._SFA.cancel()

        const scale = this.scale ? this._scaleValue : 1

        this._parent = parent

        this._areaWidth = this._parent._width || 0
        this._areaHeight = this._parent._height || 0

        this.updateOffset()
        this.updateWH(scale) // 更新宽高
        this.updateBoundary() // 更新边界

        // 此处会根据用户传入的 x、y 重置位置
        this._translateX = this._x + this._scaleOffset.x
        this._translateY = this._y + this._scaleOffset.y

        // 初始化移动，不需要动画，也不需要触发 change 事件
        const {x, y} = this.getLimitXY(this._translateX, this._translateY)

        this.setTransform(x, y, scale, '', true)

        this._oldScale = scale
    }

    /**
     * 更新偏移
     */
    updateOffset() {
        this._offset.x = getX(this, this._parent)
        this._offset.y = getY(this, this._parent)
    }

    /**
     * 更新宽高
     */
    updateWH(scale) {
        scale = scale || this._scale
        scale = this.adjustScale(scale)

        const rect = this.getBoundingClientRect()

        // 真实宽高，需要除以放缩
        this._height = rect.height / this._scale
        this._width = rect.width / this._scale

        // 视觉宽高
        const viewHeight = this._height * scale
        const viewWidth = this._width * scale

        // 放缩造成的偏移，因为放缩后 x 和 y 坐标仍旧指向放缩前的位置，这里计算出偏移是为了将 x 和 y 转换成放缩后的坐标
        this._scaleOffset.x = (viewWidth - this._width) / 2
        this._scaleOffset.y = (viewHeight - this._height) / 2
    }

    /**
     * 更新边界
     */
    updateBoundary() {
        // 计算 x 方向的边界
        const x1 = 0 - this._offset.x + this._scaleOffset.x
        const x2 = this._areaWidth - this._width - this._offset.x - this._scaleOffset.x
        this._minX = Math.min(x1, x2)
        this._maxX = Math.max(x1, x2)

        // 计算 y 方向的边界
        const y1 = 0 - this._offset.y + this._scaleOffset.y
        const y2 = this._areaHeight - this._height - this._offset.y - this._scaleOffset.y
        this._minY = Math.min(y1, y2)
        this._maxY = Math.max(y1, y2)
    }

    /**
     * 结束双指放缩，由 wx-movabel-area 调用
     */
    endScale() {
        this._isScaling = false
        this._oldScale = this._scale
    }

    /**
     * 设置放缩，由 wx-movabel-area 调用
     */
    setScale(scale) {
        if (!this.scale) return

        // 为了保证每次放缩都是基于 touchstart 时的放缩大小进行计算，而不是每次 touchmove 都以上一次 touchmove 为基准
        scale *= this._oldScale

        this._isScaling = true
        this.updateScale(scale)
    }

    /**
     * 更新放缩
     */
    updateScale(scale, needAnimation, cb) {
        if (!this.scale) return

        scale = this.adjustScale(scale)

        if (!this._isTransformed) {
            // wx-movable-area 存在 transform
            this.updateWH(scale) // 更新宽高
            this.updateBoundary() // 更新边界
        }

        const {x, y} = this.getLimitXY(this._translateX, this._translateY)

        // 设置scale 和 调整位置
        if (needAnimation) {
            this.animationTo(x, y, scale, '', true, true, cb)
        } else {
            throttleRAF(() => this.setTransform(x, y, scale, '', true, true))
        }
    }

    /**
     * 调整scale值
     */
    adjustScale(scale) {
        // 控制放缩范围
        scale = Math.max(MOVABLE_VIEW_SCALE_MIN, this.scaleMin, scale)
        scale = Math.min(MOVABLE_VIEW_SCALE_MAX, this.scaleMax, scale)

        return scale
    }

    /**
     * 动画
     */
    animationTo(x, y, scale, source, notTriggerChange, needTriggerScale, cb) {
        if (this._FA) this._FA = this._FA.cancel()
        if (this._SFA) this._SFA = this._SFA.cancel()

        // 做个保护，可能因为时序问题取到的 x、y、scale 是新设置的
        if (!this._xMove) x = this._translateX
        if (!this._yMove) y = this._translateY
        if (!this.scale) scale = this._scale

        const obj = this.getLimitXY(x, y)
        x = obj.x
        y = obj.y

        if (this.animation) {
            this._STD._springX._solution = null
            this._STD._springY._solution = null
            this._STD._springScale._solution = null
            this._STD._springX._endPosition = this._translateX
            this._STD._springY._endPosition = this._translateY
            this._STD._springScale._endPosition = this._scale
            this._STD.setEnd(x, y, scale, 1)

            this._SFA = animation(this._STD, () => {
                const options = this._STD.x()
                const {x, y, scale} = options
                this.setTransform(x, y, scale, source, notTriggerChange, needTriggerScale)
            }, () => {
                if (this._SFA) this._SFA = this._SFA.cancel()
                this.setTransform(x, y, scale, source, notTriggerChange, needTriggerScale)
                if (cb && typeof cb === 'function') cb()
            })
        } else {
            // 不需要动画
            this.setTransform(x, y, scale, source, notTriggerChange, needTriggerScale)
        }
    }

    /**
     * 过界回弹，回弹返回 true，否则返回 false
     */
    revise(source) {
        const {x, y, outOfBounds} = this.getLimitXY(this._translateX, this._translateY)
        if (outOfBounds) this.animationTo(x, y, this._scale, source)
        return outOfBounds
    }

    /**
     * 使用 translate 实现移动，使用 scale 实现放缩
     */
    setTransform(x, y, scale, source = '', notTriggerChange, needTriggerScale) {
        if (isNaN(x) || typeof x !== 'number') x = this._translateX || 0
        if (isNaN(y) || typeof y !== 'number') y = this._translateY || 0
        x = +x.toFixed(1)
        y = +y.toFixed(1)
        scale = +scale.toFixed(3)

        const changeX = sub(x, this._scaleOffset.x)
        const changeY = sub(y, this._scaleOffset.y)
        if ((this._translateX !== x || this._translateY !== y) && !notTriggerChange) {
            // 触发change事件
            this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {x: changeX, y: changeY, source}}))
        }

        if (!this.scale) scale = this._scale

        scale = this.adjustScale(scale)

        scale = +scale.toFixed(3)
        if (needTriggerScale && scale !== this._scale) {
            // 触发scale事件
            this.dispatchEvent(new CustomEvent('scale', {bubbles: true, cancelable: true, detail: {x: changeX, y: changeY, scale}}))
        }

        const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ')'
        this._notCheckStyle = true
        this.style.transform = transform
        this.style.webkitTransform = transform

        this._translateX = x // 保存 translateX
        this._translateY = y // 保存 translateY
        this._scale = scale // 保存 scale
    }
}
