import Scroller from '../scroller'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxPickerView extends Scroller {
    constructor() {
        super()

        this.initShadowRoot(template, WxPickerView.observedAttributes, () => {
            this.onResize = this.onResize.bind(this)
            this.main = this.shadowRoot.querySelector('#main')
            this.mask = this.shadowRoot.querySelector('#mask')
            this.indicator = this.shadowRoot.querySelector('#indicator')
            this.content = this.shadowRoot.querySelector('#content')

            this._columns = []
        })
    }

    static register() {
        customElements.define('wx-picker-view-column', WxPickerView)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(() => {
            if (this._parent) this._parent.onColumnChildrenUpdate(this)
        })
        this._observer.observe(this, {
            childList: true,
            subtree: true,
        })
        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.onResize)
        this._resizeObserver.observe(this.indicator)

        this.addEventListener('tap', this.onTap)
        this.main.addEventListener('touchstart', this.onScrollerTouchStart)
        this.main.addEventListener('touchmove', this.onScrollerTouchMove)
        this.main.addEventListener('touchend', this.onScrollerTouchEnd)
        this.main.addEventListener('touchcancel', this.onScrollerTouchEnd)

        // 通知上层的 wx-picker-view 更新
        this._parent = findParent(this, parentNode => parentNode.tagName === 'WX-PICKER-VIEW')
        if (this._parent) this._parent.onColumnUpdate(this)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
        if (this._resizeObserver) this._resizeObserver.disconnect()
        this._resizeObserver = null
        this._parent = null

        this.removeEventListener('tap', this.onTap)
        this.main.removeEventListener('touchstart', this.onScrollerTouchStart)
        this.main.removeEventListener('touchmove', this.onScrollerTouchMove)
        this.main.removeEventListener('touchend', this.onScrollerTouchEnd)
        this.main.removeEventListener('touchcancel', this.onScrollerTouchEnd)
    }

    /**
     * 大小发生变化
     */
    onResize() {
        const itemHeight = this.indicator.offsetHeight

        Array.prototype.slice.call(this.children, 0).forEach(child => {
            child.style.height = `${itemHeight}px`
            child.style.overflow = 'hidden'
        })

        this._itemHeight = itemHeight
        this._scroller.update()
    }

    /**
     * 监听点击
     */
    onTap(evt) {
        // 已经被底层组件处理过，就不再处理
        if (evt._isProcessed) return
        evt._isProcessed = true

        const target = this.shadowRoot.elementsFromPoint(evt.detail.clientX, evt.detail.clientY)
        if (target === evt.currentTarget || this._scroller.isScrolling()) return

        const rect = this.getBoundingClientRect()
        const offsetY = evt.detail.clientY - rect.top - this._height / 2 // 偏离中心多远
        const halfItemHeight = this._itemHeight / 2

        if (Math.abs(offsetY) <= halfItemHeight) return

        let offset = Math.ceil((Math.abs(offsetY) - halfItemHeight) / this._itemHeight) // 偏离 indicator 多少个单位
        offset = offsetY < 0 ? -offset : offset

        this._current += offset
        this._scroller._snapping = true
        this._scroller.scrollTo(this._current * this._itemHeight)

        if (this._parent) this._parent.onColumnValueChanged()
        if (this._isUpdatingValue) {
            if (this._parent) this._parent.onColumnValueChangeEnd()
            this._isUpdatingValue = false
        }
    }

    /**
     * 设置当前值，由 wx-picker-view 调用
     */
    setCurrent(index) {
        const len = Math.max(this.children.length - 1, 0)
        this._current = Math.min(index, len)
    }

    /**
     * 设置样式，由 wx-picker-view 调用
     */
    setStyle(style, maskStyle) {
        this.indicator.setAttribute('style', style || '')
        this.mask.setAttribute('style', maskStyle || '')
    }

    /**
     * 设置类，由 wx-picker-view 调用
     */
    setClass(clazz, maskClass) {
        this.indicator.className = `wx-picker__indicator ${clazz || ''}`
        this.mask.className = `wx-picker__mask ${maskClass || ''}`
    }

    /**
     * 设置高度，由 wx-picker-view 调用
     */
    setHeight(height) {
        const itemHeight = this.indicator.offsetHeight

        Array.prototype.slice.call(this.children, 0).forEach(child => {
            child.style.height = `${itemHeight}px`
            child.style.overflow = 'hidden'
        })

        this._itemHeight = itemHeight
        this.main.style.height = height + 'px'

        const halfMaskHeight = (height - itemHeight) / 2
        this.mask.style.backgroundSize = `100% ${halfMaskHeight}px`
        this.indicator.style.top = `${halfMaskHeight}px`
        this.content.style.padding = `${halfMaskHeight}px 0`

        this._height = this.offsetHeight
    }

    /**
     * 初始化
     */
    init() {
        this._isUpdatingValue = false
        this.initScroller(this.content, {
            enableY: true,
            enableX: false,
            enableSnap: true,
            itemSize: this._itemHeight,
            onTouchStart: () => {
                if (!this._isUpdatingValue && !this._scroller.isScrolling()) {
                    if (this._parent) this._parent.onColumnValueChangeStart()
                }
                this._isUpdatingValue = true
            },
            onSnap: index => {
                if (index !== this._current) {
                    this._current = index
                    if (this._parent) this._parent.onColumnValueChanged()
                }
                if (this._isUpdatingValue) {
                    if (this._parent) this._parent.onColumnValueChangeEnd()
                    this._isUpdatingValue = false
                }
            }
        })
    }

    /**
     * 更新
     */
    update() {
        this._scroller.update(this._current * this._itemHeight, undefined, this._itemHeight)
    }
}
