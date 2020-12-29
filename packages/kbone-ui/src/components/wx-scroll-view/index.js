import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const SCROLL_BOUNDARY_DELTA = 200

export default class WxScrollView extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxScrollView.observedAttributes, () => {
            this.onScroll = this.onScroll.bind(this)
            this.onHandleTouchStart = this.onHandleTouchStart.bind(this)
            this.onHandleTouchMove = this.onHandleTouchMove.bind(this)
            this.onHandleTouchEnd = this.onHandleTouchEnd.bind(this)
            this.onRefresherPulling = this.onRefresherPulling.bind(this)
            this.onRefresherRefresh = this.onRefresherRefresh.bind(this)
            this.onRefresherRestore = this.onRefresherRestore.bind(this)
            this.onRefresherAbort = this.onRefresherAbort.bind(this)
            this.onScrollBarMouseDown = this.onScrollBarMouseDown.bind(this)
            this.onScrollBarMouseMove = this.onScrollBarMouseMove.bind(this)
            this.onScrollBarMouseUp = this.onScrollBarMouseUp.bind(this)
            this.onWrapMouseOver = this.onWrapMouseOver.bind(this)
            this.onWrapMouseOut = this.onWrapMouseOut.bind(this)
            this.onResize = this.onResize.bind(this)
            this.wrap = this.shadowRoot.querySelector('#wrap')
            this.main = this.shadowRoot.querySelector('#main')
            this.refresher = this.shadowRoot.querySelector('#refresher')
            this.content = this.shadowRoot.querySelector('#content')
            this.barWrap = this.shadowRoot.querySelector('#barWrap')
            this.scrollbar = this.shadowRoot.querySelector('#scrollbar')

            this._lastScrollTop = 0
            this._lastScrollLeft = 0
            this._lastScrollToUpperTime = 0
            this._lastScrollToLowerTime = 0
        })
    }

    static register() {
        customElements.define('wx-scroll-view', WxScrollView)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.onResize)
        this._resizeObserver.observe(this)
        this._resizeObserver.observe(this.content)

        this.onScrollXChanged(this.scrollX)
        this.onScrollYChanged(this.scrollY)
        this.onScrollTopChanged(this.scrollTop)
        this.onScrollLeftChanged(this.scrollLeft)
        this.onScrollIntoViewChanged(this.scrollIntoView)

        this.main.addEventListener('touchstart', this.onHandleTouchStart)
        this.main.addEventListener('touchmove', this.onHandleTouchMove)
        this.main.addEventListener('touchend', this.onHandleTouchEnd)
        this.main.addEventListener('touchcancel', this.onHandleTouchEnd)
        this.main.addEventListener('scroll', this.onScroll)

        this.refresher.addEventListener('pulling', this.onRefresherPulling)
        this.refresher.addEventListener('refresh', this.onRefresherRefresh)
        this.refresher.addEventListener('restore', this.onRefresherRestore)
        this.refresher.addEventListener('abort', this.onRefresherAbort)

        this.scrollbar.addEventListener('mousedown', this.onScrollBarMouseDown)
        window.addEventListener('mousemove', this.onScrollBarMouseMove)
        window.addEventListener('mouseup', this.onScrollBarMouseUp)
        this.wrap.addEventListener('mouseover', this.onWrapMouseOver)
        this.wrap.addEventListener('mouseout', this.onWrapMouseOut)

        if (window.getComputedStyle(this).display === 'flex' && !this.enableFlex) console.error('[wx-scroll-view] 设置 enable-flex 属性以使 flexbox 布局生效。')
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._resizeObserver) this._resizeObserver.disconnect()
        this._resizeObserver = null

        this.main.removeEventListener('touchstart', this.onHandleTouchStart)
        this.main.removeEventListener('touchmove', this.onHandleTouchMove)
        this.main.removeEventListener('touchend', this.onHandleTouchEnd)
        this.main.removeEventListener('touchcancel', this.onHandleTouchEnd)
        this.main.removeEventListener('scroll', this.onScroll)

        this.refresher.removeEventListener('pulling', this.onRefresherPulling)
        this.refresher.removeEventListener('refresh', this.onRefresherRefresh)
        this.refresher.removeEventListener('restore', this.onRefresherRestore)
        this.refresher.removeEventListener('abort', this.onRefresherAbort)

        this.scrollbar.removeEventListener('mousedown', this.onScrollBarMouseDown)
        window.removeEventListener('mousemove', this.onScrollBarMouseMove)
        window.removeEventListener('mouseup', this.onScrollBarMouseUp)
        this.wrap.removeEventListener('mouseover', this.onWrapMouseOver)
        this.wrap.removeEventListener('mouseout', this.onWrapMouseOut)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'scroll-x') {
            if (oldValue === newValue) return
            this.onScrollXChanged(this.scrollX)
        } else if (name === 'scroll-y') {
            if (oldValue === newValue) return
            this.onScrollYChanged(this.scrollY)
        } else if (name === 'scroll-top') {
            const value = this.scrollTop
            if (isInit) this._lastScrollTop = value
            this.onScrollTopChanged(value)
        } else if (name === 'scroll-left') {
            const value = this.scrollLeft
            if (isInit) this._lastScrollLeft = value
            this.onScrollLeftChanged(value)
        } else if (name === 'scroll-into-view') {
            this.onScrollIntoViewChanged(this.scrollIntoView)
        } else if (name === 'enable-flex') {
            this.wrap.classList.toggle('wx-scroll-view-flex', this.enableFlex)
            this.main.classList.toggle('wx-scroll-view-flex', this.enableFlex)
        } else if (name === 'refresher-enabled') {
            this.refresher.classList.toggle('hidden', !this.refresherEnabled)
        } else if (name === 'refresher-threshold') {
            this.refresher.setAttribute('threshold', this.refresherThreshold)
        } else if (name === 'refresher-default-style') {
            this.refresher.setAttribute('default-style', this.refresherDefaultStyle)
        } else if (name === 'refresher-background') {
            this.refresher.setAttribute('background', this.refresherBackground)
        } else if (name === 'refresher-triggered') {
            if (this.refresherEnabled) {
                this.refresher.disableRefresher(false)
                this.refresher.setAttribute('triggered', this.refresherTriggered)
            }
        }
    }

    static get observedAttributes() {
        return ['scroll-x', 'scroll-y', 'upper-threshold', 'lower-threshold', 'scroll-top', 'scroll-left', 'scroll-into-view', 'scroll-with-animation', 'enable-back-to-top', 'enable-flex', 'scroll-anchoring', 'refresher-enabled', 'refresher-threshold', 'refresher-default-style', 'refresher-background', 'refresher-triggered', 'enhanced', 'bounces', 'show-scrollbar', 'paging-enabled', 'fast-deceleration', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get scrollX() {
        return this.getBoolValue('scroll-x')
    }

    get scrollY() {
        return this.getBoolValue('scroll-y')
    }

    get upperThreshold() {
        return this.getNumberValue('upper-threshold', 50)
    }

    get lowerThreshold() {
        return this.getNumberValue('lower-threshold', 50)
    }

    get scrollTop() {
        return this.getNumberValue('scroll-top', 0)
    }

    get scrollLeft() {
        return this.getNumberValue('scroll-left', 0)
    }

    get scrollIntoView() {
        return this.getAttribute('scroll-into-view')
    }

    get scrollWithAnimation() {
        return this.getBoolValue('scroll-with-animation')
    }

    get enableBackToTop() {
        // enable-back-to-top 不支持
        return null
    }

    get enableFlex() {
        return this.getBoolValue('enable-flex')
    }

    get scrollAnchoring() {
        // scroll-anchoring 不支持
        return null
    }

    get refresherEnabled() {
        return this.getBoolValue('refresher-enabled')
    }

    get refresherThreshold() {
        return this.getNumberValue('refresher-threshold', 45)
    }

    get refresherDefaultStyle() {
        return this.getAttribute('refresher-default-style') || 'black'
    }

    get refresherBackground() {
        return this.getAttribute('refresher-background') || '#FFF'
    }

    get refresherTriggered() {
        return this.getBoolValue('refresher-triggered')
    }

    get enhanced() {
        // enhanced 不支持
        return null
    }

    get bounces() {
        // bounces 不支持
        return null
    }

    get showScrollbar() {
        // show-scrollbar 不支持
        return null
    }

    get pagingEnabled() {
        // paging-enabled 不支持
        return null
    }

    get fastDeceleration() {
        // fast-deceleration 不支持
        return null
    }

    /**
     * 监听触摸事件
     */
    onHandleTouchStart(evt) {
        if (evt.touches.length === 1 && !this._isStart) {
            this._isStart = true
            this._x = this._startX = evt.touches[0].pageX
            this._y = this._startY = evt.touches[0].pageY
            this._noBubble = null

            if (this.main.scrollHeight > this.main.offsetHeight) this._touchStartY = this._y
            this.refresher.disableRefresher(!this.refresherEnabled)
        }
    }

    onHandleTouchMove(evt) {
        if (evt.touches.length === 1 && this._isStart) {
            const x = evt.touches[0].pageX
            const y = evt.touches[0].pageY
            const dx = x - this._startX
            const dy = y - this._startY

            if (this._noBubble === null && this.scrollY) {
                if (Math.abs(this._y - y) / Math.abs(this._x - x) > 1) this._noBubble = true
                else this._noBubble = false

                if (this.isScrollingOnBoundary(dx, dy, evt.currentTarget)) this._noBubble = false
            }

            if (this._noBubble === null && this.scrollX) {
                if (Math.abs(this._x - x) / Math.abs(this._y - y) > 1) this._noBubble = true
                else this._noBubble = false

                if (this.isScrollingOnBoundary(dx, dy, evt.currentTarget)) this._noBubble = false
            }

            this._x = x
            this._y = y

            if (this._noBubble) evt.stopPropagation()
            if (this._touchStartY < y) {
                // 下拉
                if (this.main.scrollTop > 0) evt.stopPropagation()
            } else {
                // 上拉
                // eslint-disable-next-line no-lonely-if
                if (this.main.scrollHeight > this.main.offsetHeight + this.main.scrollTop && !this._refreshing) evt.stopPropagation()
            }
        }
    }

    onHandleTouchEnd() {
        this._isStart = false
    }

    /**
     * 监听下拉刷新相关事件
     */
    onRefresherPulling(evt) {
        this.dispatchEvent(new CustomEvent('refresherpulling', {bubbles: true, cancelable: true, detail: {dy: evt.detail.dy}}))
    }

    onRefresherRefresh(evt) {
        this._refreshing = true
        this.dispatchEvent(new CustomEvent('refresherrefresh', {bubbles: true, cancelable: true, detail: {dy: evt.detail.dy}}))
    }

    onRefresherRestore(evt) {
        this._refreshing = false
        this.dispatchEvent(new CustomEvent('refresherrestore', {bubbles: true, cancelable: true, detail: {dy: evt.detail.dy}}))
    }

    onRefresherAbort(evt) {
        this._refreshing = false
        this.dispatchEvent(new CustomEvent('refresherabort', {bubbles: true, cancelable: true, detail: {dy: evt.detail.dy}}))
    }

    /**
     * 监听滚动条触摸事件
     */
    onScrollBarMouseDown(evt) {
        this._scrollStartX = this.scrollbar.offsetLeft
        this._isMouseMove = true
        this._scrollTouchStartX = evt.pageX
    }

    onScrollBarMouseMove(evt) {
        if (!this._isMouseMove) return
        const dx = evt.pageX - this._scrollTouchStartX

        // 调整位置
        const main = this.main
        const scrollbar = this.scrollbar
        const newPosition = this._scrollStartX + dx
        const scrollRange = newPosition + scrollbar.clientWidth

        if (scrollRange <= main.clientWidth && newPosition >= 0) {
            scrollbar.style.left = newPosition + 'px'
            main.scrollLeft = newPosition / (main.clientWidth - scrollbar.clientWidth) * (main.scrollWidth - main.clientWidth)
        } else if (scrollRange > main.clientWidth) {
            scrollbar.style.left = main.clientWidth - scrollbar.clientWidth + 'px'
            main.scrollLeft = main.scrollWidth - main.clientWidth
        } else if (newPosition < 0) {
            scrollbar.style.left = 0
            main.scrollLeft = 0
        }
    }

    onScrollBarMouseUp() {
        if (this._isMouseMove) this._isMouseMove = false
    }

    onWrapMouseOver() {
        if (this._isMouseMove || !this.scrollX) return

        // 初始化或者当屏幕 resize 时，设置 bar 的宽度
        const scrollWidth = this.main.scrollWidth
        const barWidth = this.main.clientWidth

        // 设置 scrollBar 的宽度
        if (scrollWidth > barWidth) this.scrollbar.style.width = barWidth / scrollWidth * 100 + '%'

        this.barWrap.style.display = 'block'
    }

    onWrapMouseOut() {
        if (this._isMouseMove || !this.scrollX) return
        this.barWrap.style.display = 'none'
    }

    /**
     * 滚动到具体位置
     */
    scrollTo(value, direction) {
        const main = this.main

        if (value < 0) value = 0
        else if (direction === 'x' && value > main.scrollWidth - main.offsetWidth) value = main.scrollWidth - main.offsetWidth
        else if (direction === 'y' && value > main.scrollHeight - main.offsetHeight) value = main.scrollHeight - main.offsetHeight

        let position = 0
        let transform = ''

        if (direction === 'x') position = main.scrollLeft - value
        else if (direction === 'y') position = main.scrollTop - value

        if (position === 0) return

        this.content.style.transition = 'transform .3s ease-out'
        this.content.style.webkitTransition = '-webkit-transform .3s ease-out'

        if (direction === 'x') transform = `translateX(${position}px) translateZ(0)`
        else if (direction === 'y') transform = `translateY(${position}px) translateZ(0)`

        if (this._onTransitionEnd) this.content.removeEventListener('transitionend', this._onTransitionEnd)
        if (this._onTransitionEnd) this.content.removeEventListener('webkitTransitionEnd', this._onTransitionEnd)
        this._onTransitionEnd = this.onTransitionEnd.bind(this, value, direction)
        this.content.addEventListener('transitionend', this._onTransitionEnd)
        this.content.addEventListener('webkitTransitionEnd', this._onTransitionEnd)

        if (direction === 'x') main.style.overflowX = 'hidden'
        else if (direction === 'y') main.style.overflowY = 'hidden'

        this.content.style.transform = transform
        this.content.style.webkitTransform = transform
    }

    /**
     * 判断是否到达滚动边界
     */
    isScrollingOnBoundary(dx, dy, node) {
        if (!this.scrollX && !this.scrollY) return false

        const delta = this.scrollX ? dx : dy
        const scrollDelta = this.scrollX ? node.scrollLeft : node.scrollTop
        const maxScrollDelta = this.scrollX ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight

        return (delta > 0 && scrollDelta <= 0) || (delta < 0 && scrollDelta >= maxScrollDelta)
    }

    /**
     * 监听滚动事件
     */
    onScroll(evt) {
        evt.preventDefault()
        evt.stopPropagation()

        if (document.webkitIsFullScreen) return // 全屏

        const node = evt.target

        this.dispatchEvent(new CustomEvent('scroll', {
            bubbles: true,
            cancelable: true,
            detail: {
                scrollLeft: node.scrollLeft,
                scrollTop: node.scrollTop,
                scrollHeight: node.scrollHeight,
                scrollWidth: node.scrollWidth,
                deltaX: this._lastScrollLeft - node.scrollLeft,
                deltaY: this._lastScrollTop - node.scrollTop
            }
        }))

        if (this.scrollY) {
            const toTop = this._lastScrollTop - node.scrollTop > 0
            const toBottom = this._lastScrollTop - node.scrollTop < 0

            if (node.scrollTop <= this.upperThreshold && toTop) {
                if (evt.timeStamp - this._lastScrollToUpperTime > SCROLL_BOUNDARY_DELTA) {
                    this.dispatchEvent(new CustomEvent('scrolltoupper', {bubbles: true, cancelable: true, detail: {direction: 'top'}}))
                    this._lastScrollToUpperTime = evt.timeStamp
                }
            }

            if (node.scrollTop + node.offsetHeight + this.lowerThreshold >= node.scrollHeight && toBottom) {
                if (evt.timeStamp - this._lastScrollToLowerTime > SCROLL_BOUNDARY_DELTA) {
                    this.dispatchEvent(new CustomEvent('scrolltolower', {bubbles: true, cancelable: true, detail: {direction: 'bottom'}}))
                    this._lastScrollToLowerTime = evt.timeStamp
                }
            }
        }

        if (this.scrollX) {
            const toLeft = this._lastScrollLeft - node.scrollLeft > 0
            const toRight = this._lastScrollLeft - node.scrollLeft < 0

            if (node.scrollLeft <= this.upperThreshold && toLeft) {
                if (evt.timeStamp - this._lastScrollToUpperTime > SCROLL_BOUNDARY_DELTA) {
                    this.dispatchEvent(new CustomEvent('scrolltoupper', {bubbles: true, cancelable: true, detail: {direction: 'left'}}))
                    this._lastScrollToUpperTime = evt.timeStamp
                }
            }

            if (node.scrollLeft + node.offsetWidth + this.lowerThreshold >= node.scrollWidth && toRight) {
                if (evt.timeStamp - this._lastScrollToLowerTime > SCROLL_BOUNDARY_DELTA) {
                    this.dispatchEvent(new CustomEvent('scrolltolower', {bubbles: true, cancelable: true, detail: {direction: 'right'}}))
                    this._lastScrollToLowerTime = evt.timeStamp
                }
            }
        }

        this._lastScrollTop = node.scrollTop
        this._lastScrollLeft = node.scrollLeft
    }

    /**
     * 监听横向滚动开关
     */
    onScrollXChanged(newValue) {
        if (newValue) {
            if (this.scrollY) {
                if (this._resizeObserver) this._resizeObserver.unobserve(this)
                if (this._resizeObserver) this._resizeObserver.unobserve(this.content)
                this.main.style.overflowX = 'auto'
                this.main.style.paddingBottom = ''
                this.wrap.style.overflowY = ''
                this.wrap.style.height = ''
                this.content.style.height = '100%'
                return
            }

            if (this._isAutoHeight === undefined) this.checkIsAutoHeight()

            this.main.style.overflowX = 'auto'
            this.main.style.paddingBottom = '20px'
            this.wrap.style.overflowY = 'hidden'

            // 初渲染时 wx-scroll-view 没设置高度，就以内容为准；否则以该高度为准
            if (this._isAutoHeight) {
                this.wrap.style.height = this.content.offsetHeight + 'px'
                this.content.style.height = ''
            } else {
                this.wrap.style.height = ''
                this.content.style.height = this.offsetHeight + 'px'
            }

            if (this._resizeObserver) this._resizeObserver.observe(this)
            if (this._resizeObserver) this._resizeObserver.observe(this.content)
        } else {
            if (this._resizeObserver) this._resizeObserver.unobserve(this)
            if (this._resizeObserver) this._resizeObserver.unobserve(this.content)
            this.main.style.overflowX = 'hidden'
            this.main.style.paddingBottom = ''
            this.wrap.style.overflowY = ''
            this.wrap.style.height = ''
            this.content.style.height = '100%'
        }
    }

    /**
     * 监听纵向开关
     */
    onScrollYChanged(newValue) {
        this.main.style.overflowY = newValue ? 'auto' : 'hidden'
    }

    /**
     * 监听 scroll-top 变化
     */
    onScrollTopChanged(newValue) {
        if (this.scrollY) {
            if (this.scrollWithAnimation) this.scrollTo(newValue, 'y')
            else this.main.scrollTop = newValue
        }
    }

    /**
     * 监听 scroll-left 变化
     */
    onScrollLeftChanged(newValue) {
        if (this.scrollX) {
            if (this.scrollWithAnimation) this.scrollTo(newValue, 'x')
            else this.main.scrollLeft = newValue
        }
    }

    /**
     * 监听 scroll-into-view 变化
     */
    onScrollIntoViewChanged(newValue) {
        if (!newValue) return

        // 选择器不能以数字开头
        if (!/^[_a-zA-Z][-_a-zA-Z0-9:]*$/.test(newValue)) {
            console.error(`[wx-scroll-view] scroll-into-view="${newValue}" 有误，id 属性值格式错误，应以字母开头，且只能包含字母、数字、中划线、下划线、英文冒号和英文句点。`)
            return
        }

        const element = this.querySelector(`#${newValue}`)
        if (element) {
            const mainRect = this.main.getBoundingClientRect()
            const elementRect = element.getBoundingClientRect()

            if (this.scrollX) {
                const relLeft = elementRect.left - mainRect.left
                const scrollLeft = this.main.scrollLeft
                const left = scrollLeft + relLeft

                if (this.scrollWithAnimation) this.scrollTo(left, 'x')
                else this.main.scrollLeft = left
            }

            if (this.scrollY) {
                const relTop = elementRect.top - mainRect.top
                const scrollTop = this.main.scrollTop
                const top = scrollTop + relTop

                if (this.scrollWithAnimation) this.scrollTo(top, 'y')
                else this.main.scrollTop = top
            }
        }
    }

    /**
     * 监听动画结束
     */
    onTransitionEnd(value, direction) {
        if (this.onTransitionEndTimer) this.onTransitionEndTimer = clearTimeout(this.onTransitionEndTimer)

        this.content.style.transition = ''
        this.content.style.webkitTransition = ''
        this.content.style.transform = ''
        this.content.style.webkitTransform = ''

        const main = this.main
        if (direction === 'x') {
            main.style.overflowX = this.scrollX ? 'auto' : 'hidden'
            main.scrollLeft = value
        } else if (direction === 'y') {
            main.style.overflowY = this.scrollY ? 'auto' : 'hidden'
            main.scrollTop = value
        }
        this._isTransitionEnd = true
        this.content.removeEventListener('transitionend', this._onTransitionEnd)
        this.content.removeEventListener('webkitTransitionEnd', this._onTransitionEnd)
    }

    /**
     * 检查是否自适应高度
     */
    checkIsAutoHeight() {
        this.wrap.style.height = 0
        let style = getComputedStyle(this)
        let bbw = Math.round(parseFloat(style.borderBottomWidth)) || 0
        let btw = Math.round(parseFloat(style.borderTopWidth)) || 0
        let pt = Math.round(parseFloat(style.paddingTop)) || 0
        let pb = Math.round(parseFloat(style.paddingBottom)) || 0
        this._isAutoHeight = this.offsetHeight === (bbw + btw + pt + pb)

        // 如果有 min-height，设置高度为 0 就没用了，所以补充下述判断
        // eslint-disable-next-line no-bitwise
        const largeHeight = (Math.random() * 10000) | 0
        this.wrap.style.height = largeHeight + 'px'
        style = getComputedStyle(this)
        bbw = Math.round(parseFloat(style.borderBottomWidth)) || 0
        btw = Math.round(parseFloat(style.borderTopWidth)) || 0
        pt = Math.round(parseFloat(style.paddingTop)) || 0
        pb = Math.round(parseFloat(style.paddingBottom)) || 0
        this._isAutoHeight = this._isAutoHeight || this.offsetHeight === (bbw + btw + pt + pb + largeHeight)
    }

    /**
     * 监听尺寸变化
     */
    onResize() {
        window.requestAnimationFrame(() => {
            if (this.offsetHeight === this._lastOutterHeight && this.content.offsetHeight === this._lastContenHeight) return

            this.checkIsAutoHeight()

            if (this._isAutoHeight) {
                this.wrap.style.height = this.content.offsetHeight + 'px'
                this.content.style.height = ''
            } else {
                this.wrap.style.height = ''
                this.content.style.height = this.offsetHeight + 'px'
            }

            this._lastOutterHeight = this.offsetHeight
            this._lastContenHeight = this.content.offsetHeight
        })
    }
}
