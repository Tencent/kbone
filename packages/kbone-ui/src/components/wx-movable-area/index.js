import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

/**
 * 计算距离原点的距离
 */
const getLen = v => Math.sqrt(v.x * v.x + v.y * v.y)

/**
 * 判断是否是祖先节点
 */
const isAncestor = (node, ancestor) => {
    const parentNode = node.parentNode

    if (!parentNode || parentNode.tagName === 'WX-MOVABLE-AREA' || parentNode === document.documentElement) return false
    else if (parentNode === ancestor) return true
    else return isAncestor(parentNode, ancestor)
}

export default class WxMovableArea extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxMovableArea.observedAttributes, () => {
            this.onUpdate = this.onUpdate.bind(this)
            this.onHandleTouchStart = this.onHandleTouchStart.bind(this)
            this.onHandleTouchMove = this.onHandleTouchMove.bind(this)
            this.onHandleTouchEnd = this.onHandleTouchEnd.bind(this)

            this._gapV = {x: null, y: null} // 两指间的坐标差
            this._pinchStartLen = null // 两指间的距离
            this._views = []
        })
    }

    static register() {
        customElements.define('wx-movable-area', WxMovableArea)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听属性变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.onUpdate)
        this._observer.observe(this, {
            attributes: true,
            attributeFilter: ['class', 'style'],
        })
        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.onUpdate)
        this._resizeObserver.observe(this)

        this.addEventListener('touchstart', this.onHandleTouchStart)
        this.addEventListener('touchmove', this.onHandleTouchMove)
        this.addEventListener('touchend', this.onHandleTouchEnd)
        this.addEventListener('touchcancel', this.onHandleTouchEnd)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
        if (this._resizeObserver) this._resizeObserver.disconnect()
        this._resizeObserver = null

        this.removeEventListener('touchstart', this.onHandleTouchStart)
        this.removeEventListener('touchmove', this.onHandleTouchMove)
        this.removeEventListener('touchend', this.onHandleTouchEnd)
        this.removeEventListener('touchcancel', this.onHandleTouchEnd)
    }

    static get observedAttributes() {
        return ['scale-area', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get scaleArea() {
        return this.getBoolValue('scale-area')
    }

    /**
     * 监听 wx-movable-view 变化
     */
    onMovableViewChanged() {
        this._views = Array.prototype.slice.call(this.querySelectorAll('wx-movable-view'), 0)
        this.updateArea()
    }

    /**
     * 更新高宽
     */
    updateArea(isForce) {
        const {height, width} = this.getWH()

        this._height = height // 保存现在 wx-movable-area 的h eight
        this._width = width // 保存现在 wx-movable-area 的 width

        // 更新每个 movable-view 的父级 movable-area 和可移动区域
        this._views.forEach(view => {
            if (view._parent !== this || isForce) view.setParent(this)
        })
    }

    /**
     * 获取高宽
     */
    getWH() {
        const style = window.getComputedStyle(this)
        const rect = this.getBoundingClientRect()

        const h = ['Left', 'Right'].map(item => parseFloat(style[`border${item}Width`]) + parseFloat(style[`padding${item}`]))
        const v = ['Top', 'Bottom'].map(item => parseFloat(style[`border${item}Width`]) + parseFloat(style[`padding${item}`]))

        return {
            height: rect.height - v[0] - v[1],
            width: rect.width - h[0] - h[1],
        }
    }

    /**
     * 监听更新
     */
    onUpdate() {
        const rect = this.getBoundingClientRect() || {}
        const offsetWidth = this.offsetWidth
        const offsetHeight = this.offsetHeight
        const isTransformed = rect.width !== offsetWidth || rect.height !== offsetHeight

        // 判断尺寸变化
        if (offsetWidth !== this._offsetWidth || offsetHeight !== this._offsetHeight) this.updateArea(true)

        this._views.forEach(view => view._isTransformed = isTransformed)

        this._offsetWidth = offsetWidth
        this._offsetHeight = offsetHeight
    }

    /**
     * 获取某节点祖先中和给定 wx-movable-view 节点相匹配的项
     */
    getWxMovableView(node) {
        if (!node) return

        const views = this._views
        for (let i = 0, len = views.length; i < len; i++) {
            if (node === views[i] || isAncestor(node, views[i])) return views[i]
        }
    }

    /**
     * 监听触摸事件
     */
    onHandleTouchStart(evt) {
        const touches = evt.touches

        if (!touches) return

        if (touches.length > 1) {
            const v = {
                x: touches[1].pageX - touches[0].pageX,
                y: touches[1].pageY - touches[0].pageY
            }

            this._pinchStartLen = getLen(v)
            this._gapV = v

            // 当放缩区域只限制在 wx-movable-view 里面时，获取对应的 wx-movable-view
            if (!this.scaleArea) {
                // 必须所有手指在同一个 wx-movable-view 上
                const scaleMovableView0 = this.getWxMovableView(touches[0].target, this._views)
                const scaleMovableView1 = this.getWxMovableView(touches[1].target, this._views)
                if (scaleMovableView0 && scaleMovableView0 === scaleMovableView1) {
                    this._scaleMovableView = scaleMovableView0
                } else {
                    this._scaleMovableView = null
                }
            }
        }
    }

    onHandleTouchMove(evt) {
        const touches = evt.touches

        if (!touches) return

        if (touches.length > 1) {
            // 阻止外层滚动
            evt.preventDefault()

            const v = {
                x: touches[1].pageX - touches[0].pageX,
                y: touches[1].pageY - touches[0].pageY
            }

            if (this._gapV.x !== null && this._pinchStartLen > 0) {
                const scale = getLen(v) / this._pinchStartLen

                // 更新放缩
                if (scale && scale !== 1) {
                    if (this.scaleArea) {
                        // 更新每个 wx-movable-view 的放缩情况
                        this._views.forEach(view => view.setScale(scale))
                    } else if (this._scaleMovableView) {
                        this._scaleMovableView.setScale(scale)
                    }
                }
            }

            this._gapV = v
        }
    }

    onHandleTouchEnd(evt) {
        const touches = evt.touches

        if (touches && touches.length) return

        this._gapV.x = 0
        this._gapV.y = 0
        this._pinchStartLen = null

        if (this.scaleArea) {
            // 更新每个 wx-movable-view 的放缩情况
            this._views.forEach(view => view.endScale())
        } else if (this._scaleMovableView) {
            this._scaleMovableView.endScale()
        }
    }
}
