import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxSwiper extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxSwiper.observedAttributes, () => {
            this.resetLayout = this.resetLayout.bind(this)
            this.animateFrame = this.animateFrame.bind(this)
            this.onHandleWheel = this.onHandleWheel.bind(this)
            this.onHandleTouchStart = this.onHandleTouchStart.bind(this)
            this.onHandleTouchMove = this.onHandleTouchMove.bind(this)
            this.onHandleTouchEnd = this.onHandleTouchEnd.bind(this)
            this.onHandleTouchCancel = this.onHandleTouchCancel.bind(this)
            this.slidesWrapper = this.shadowRoot.querySelector('#slidesWrapper')
            this.slides = this.shadowRoot.querySelector('#slides')
            this.slideFrame = this.shadowRoot.querySelector('#slideFrame')
            this.slidesDots = this.shadowRoot.querySelector('#slidesDots')

            this._invalid = true
            this._currentSource = ''
            this._lastPosition = 0
            this._itemIdItemMap = {}
            this._items = []

            this._touchViewportPosition = 0
            this._touchSpeed = 0
            this._touchTs = 0
            this._last = 0

            this.__currentItemId = ''
        })
    }

    static register() {
        customElements.define('wx-swiper', WxSwiper)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                let list = []
                if (mutation.addedNodes && mutation.addedNodes.length) list = list.concat(Array.prototype.slice.call(mutation.addedNodes, 0))
                if (mutation.removedNodes && mutation.removedNodes.length) list = list.concat(Array.prototype.slice.call(mutation.removedNodes, 0))
                if (list.length) {
                    const wxSwiperItemList = list.filter(node => node.tagName === 'WX-SWIPER-ITEM')
                    if (wxSwiperItemList.length) {
                        this.updateItems()
                        this.resetLayout('subtree')
                    }
                }
            })
        })
        this._observer.observe(this, {
            childList: true,
            subtree: true,
        })

        this.updateItems()
        this.resetLayout()

        this.slidesWrapper.addEventListener('touchstart', this.onHandleTouchStart)
        this.slidesWrapper.addEventListener('touchmove', this.onHandleTouchMove)
        this.slidesWrapper.addEventListener('touchend', this.onHandleTouchEnd)
        this.slidesWrapper.addEventListener('touchcancel', this.onHandleTouchCancel)

        window.addEventListener('resize', this.resetLayout)
        if (this._enableWheel) this.addEventListener('wheel', this.onHandleWheel)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null

        if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)

        this.slidesWrapper.removeEventListener('touchstart', this.onHandleTouchStart)
        this.slidesWrapper.removeEventListener('touchmove', this.onHandleTouchMove)
        this.slidesWrapper.removeEventListener('touchend', this.onHandleTouchEnd)
        this.slidesWrapper.removeEventListener('touchcancel', this.onHandleTouchCancel)

        window.removeEventListener('resize', this.resetLayout)
        if (this._enableWheel) this.removeEventListener('wheel', this.onHandleWheel)

        this._items = []
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'indicator-dots') {
            this.slidesDots.style.display = this.indicatorDots ? 'block' : 'none'
        } else if (name === 'indicator-color' || name === 'indicator-active-color') {
            for (let i = 0, len = this.slidesDots.childNodes.length; i < len; i++) {
                const slidesDot = this.slidesDots.childNodes[i]
                if (slidesDot.nodeType !== slidesDot.ELEMENT_NODE) continue
                if (slidesDot.classList.contains('wx-swiper-dot-active')) {
                    if (this.indicatorActiveColor) slidesDot.style.backgroundColor = this.indicatorActiveColor
                } else if (this.indicatorColor) {
                    slidesDot.style.backgroundColor = this.indicatorColor
                }
            }
        } else if (name === 'autoplay' || name === 'interval') {
            if ((name === 'autoplay' && this.autoplay) || (name === 'interval' && this.interval)) this.scheduleAutoplay()
            else if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)
        } else if (name === 'current') {
            newValue = parseInt(newValue, 10) || 0
            oldValue = parseInt(oldValue, 10) || 0

            const source = this._currentSource
            this._currentSource = ''

            if (!this._items.length || newValue !== this.normalizeCurrentValue(newValue) || oldValue !== this.normalizeCurrentValue(oldValue)) {
                return this.resetLayout()
            }
            if (!source) this.animateViewport(newValue, '', 0)
            if (newValue !== oldValue) {
                const newItem = this._items[newValue]
                if (newItem) {
                    this._currentItemId = newItem.itemId
                    this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {current: this.current, source}}))
                }
                this.updateDots(newValue)
            }
        } else if (name === 'circular' || name === 'vertical') {
            if (name === 'vertical') {
                this.slidesDots.classList.toggle('wx-swiper-dots-horizontal', !this.vertical)
                this.slidesDots.classList.toggle('wx-swiper-dots-vertical', this.vertical)
            }

            this.resetLayout()
        } else if (name === 'previous-margin' || name === 'next-margin' || name === 'snap-to-edge') {
            this._needCheckMargin = true
            this.resetLayout()
        } else if (name === 'display-multiple-items') {
            this.resetLayout()
            if (!isInit && this.displayMultipleItems > this._items.length) console.error('[wx-swiper] display-multiple-items 不能大于 wx-swiper-item 数量')
        } else if (name === 'skip-hidden-item-layout') {
            this.resetLayout()
        } else if (name === 'kbone-enable-wheel') {
            if (this._enableWheel) this.addEventListener('wheel', this.onHandleWheel)
            else this.removeEventListener('wheel', this.onHandleWheel)
        }
    }

    static get observedAttributes() {
        return ['indicator-dots', 'indicator-color', 'indicator-active-color', 'autoplay', 'current', 'interval', 'duration', 'circular', 'vertical', 'previous-margin', 'next-margin', 'snap-to-edge', 'display-multiple-items', 'easing-function', 'skip-hidden-item-layout', 'kbone-enable-wheel', ...Base.observedAttributes]
    }

    /*
     * 属性
     */
    get indicatorDots() {
        return this.getBoolValue('indicator-dots')
    }

    get indicatorColor() {
        return this.getAttribute('indicator-color') || 'rgba(0, 0, 0, .3)'
    }

    get indicatorActiveColor() {
        return this.getAttribute('indicator-active-color') || '#000000'
    }

    get autoplay() {
        return this.getBoolValue('autoplay')
    }

    get current() {
        return this.getNumberValue('current')
    }

    set current(value) {
        this.setAttribute('current', value)
    }

    get interval() {
        return this.getNumberValue('interval', 5000)
    }

    get duration() {
        return this.getNumberValue('duration', 500)
    }

    get circular() {
        return this.getBoolValue('circular')
    }

    get vertical() {
        return this.getBoolValue('vertical')
    }

    get previousMargin() {
        return this.getNumberValue('previous-margin')
    }

    get nextMargin() {
        return this.getNumberValue('next-margin')
    }

    get snapToEdge() {
        return this.getBoolValue('snap-to-edge')
    }

    get displayMultipleItems() {
        return this.getNumberValue('display-multiple-items', 1)
    }

    get easingFunction() {
        return this.getAttribute('easing-function') || 'default'
    }

    get skipHiddenItemLayout() {
        return this.getBoolValue('skip-hidden-item-layout')
    }

    /**
     * kbone 提供的特殊属性，因为纯 Web 实现的 wheel 触发有缺陷
     */
    get _enableWheel() {
        return this.getBoolValue('kbone-enable-wheel', true)
    }

    get _currentItemId() {
        return this.__currentItemId
    }

    set _currentItemId(value) {
        this.__currentItemId = value
        this.onCurrentItemIdChanged(value)
    }

    /**
     * 监听 wx-swiper-item 的 item-id 变化
     */
    onItemIdUpdated(newItemId, oldItemId) {
        if (newItemId === oldItemId) return
        this.updateItems()
        if (this._currentItemId) this.onCurrentItemIdChanged()
    }

    /**
     * 监听当前 item id 变化
     */
    onCurrentItemIdChanged(value) {
        if (!this._currentSource || !value) return
        this.current = this.getPositionFromCurrent()
    }

    /**
     * 更新 wx-swiper-item 列表
     */
    updateItems() {
        this._items = Array.prototype.slice.call(this.querySelectorAll('wx-swiper-item'), 0)
        this._items.forEach(item => {
            if (!item.itemId) return
            if (!this._itemIdItemMap[item.itemId]) this._itemIdItemMap[item.itemId] = item
        })
    }

    /**
     * 自动播放
     */
    scheduleAutoplay() {
        if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)
        if (this._invalid || this._items.length <= this.displayMultipleItems) return
        const frameFunc = () => {
            this._currentSource = 'autoplay'
            if (this._isCircular) {
                // 循环播发
                this.current = this.normalizeCurrentValue(this.current + 1)
            } else {
                // 非循环播放，超过非展示区域，播放第一张
                this.current = this.current + this.displayMultipleItems < this._items.length ? this.current + 1 : 0
            }
            this.animateViewport(this.current, 'autoplay', 1)
            this._scheduleTimeout = setTimeout(frameFunc, this.interval)
        }
        this._scheduleTimeout = setTimeout(frameFunc, this.interval)
    }

    /**
     * 更新指示点
     */
    updateDots(active) {
        const slidesDots = this.slidesDots
        slidesDots.innerHTML = ''

        const items = this._items
        const fragment = document.createDocumentFragment()

        for (let i = 0, len = items.length; i < len; i++) {
            const dot = document.createElement('div')
            dot.classList.add('wx-swiper-dot')

            if ((!this._invalid && (i >= active && i < active + this.displayMultipleItems)) || i < active + this.displayMultipleItems - len) {
                dot.classList.toggle('wx-swiper-dot-active', true)
                if (this.indicatorActiveColor) dot.style.backgroundColor = this.indicatorActiveColor
            } else {
                dot.classList.toggle('wx-swiper-dot-active', false)
                if (this.indicatorColor) dot.style.backgroundColor = this.indicatorColor
            }
            fragment.appendChild(dot)
        }

        slidesDots.appendChild(fragment)
    }

    /**
     * 对当前值进行调整
     */
    normalizeCurrentValue(value) {
        const itemCount = this._items.length
        if (!itemCount) return -1

        const roundedValue = (Math.round(value) + itemCount) % itemCount
        if (this._isCircular) {
            // 循环播发
            if (itemCount <= this.displayMultipleItems) return 0 // 所有 item 都要被显示
        } else if (roundedValue > itemCount - this.displayMultipleItems) {
            // 处于最后一个 displayMultipleItems 中间，则取最后一个 displayMultipleItems 开始的地方
            return itemCount - this.displayMultipleItems
        }
        return roundedValue
    }

    /**
     * 返回当前的位置
     */
    getPositionFromCurrent() {
        let position
        if (this._currentItemId) {
            position = this._items.indexOf(this._itemIdItemMap[this._currentItemId])
        } else {
            position = (this._items.length && this.current === this.normalizeCurrentValue(this.current)) ? this.current : -2
        }
        return position
    }

    /**
     * 重置布局
     */
    resetLayout(type) {
        if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)
        if (this._animateFrameData) {
            // 残存的动画数据，则做完最后更新
            this.updateViewport(this._animateFrameData.toPosition)
            this._animateFrameData = null
        }

        const items = this._items

        // 重置 current 为 currentItemId
        if (this._currentItemId) {
            this.current = this.getPositionFromCurrent()
        }

        // 设置基础样式
        const slides = this.slides
        const slideFrame = this.slideFrame
        if (this.vertical) {
            if (this._needCheckMargin) {
                slides.style.left = 0
                slides.style.right = 0
                slides.style.top = `${this.previousMargin}px`
                slides.style.bottom = `${this.nextMargin}px`
            }
            slideFrame.style.width = '100%'
            slideFrame.style.height = Math.abs(100 / this.displayMultipleItems) + '%'
        } else {
            if (this._needCheckMargin) {
                slides.style.top = 0
                slides.style.bottom = 0
                slides.style.left = `${this.previousMargin}px`
                slides.style.right = `${this.nextMargin}px`
            }
            slideFrame.style.height = '100%'
            slideFrame.style.width = Math.abs(100 / this.displayMultipleItems) + '%'
        }

        // 初始化 wx-swiper-item 位置样式
        for (let i = 0; i < items.length; i++) {
            if (this.skipHiddenItemLayout) {
                // 初始化各个滑块的 display
                items[i].style.display = items[i]._originalDisplay
            }
            this.updateItemPosition(i, i)
        }

        // 更新窗口
        this._isCircular = this.circular && items.length > this.displayMultipleItems // 是否循环滑动
        const lastPosition = this._lastPosition
        this._lastPosition = -2
        const position = this.getPositionFromCurrent()

        if (position >= 0) {
            this._invalid = false
            if (this._isTouch) {
                // touch 触发滑动
                this.updateViewport(lastPosition + position - this._touchViewportPosition, true)
                this._touchViewportPosition = position
            } else {
                this.updateViewport(position, true)
            }
            if (this.autoplay) this.scheduleAutoplay() // 自动播放
        } else {
            this._invalid = true
            this.updateViewport(-this.displayMultipleItems - 1, true)

            if (type === 'subtree' && this._items.length && this.current > this._items.length - 1) {
                this.current = 0
                console.error('[wx-swiper] current 无效')
            }
        }
        this.updateDots(position)
    }

    /**
     * 更新 wx-swiper-item 位置样式
     */
    updateItemPosition(index, position) {
        const x = this.vertical ? '0' : position * 100 + '%'
        const y = this.vertical ? position * 100 + '%' : '0'
        const transform = 'translate(' + x + ', ' + y + ') translateZ(0)'
        const item = this._items[index]
        item.style['-webkit-transform'] = transform
        item.style.transform = transform
        item._position = position
    }

    /**
     * 获取窗口最小 position
     */
    getViewportMin() {
        const objName = this.vertical ? {
            left: 'offsetTop',
            width: 'offsetHeight'
        } : {
            left: 'offsetLeft',
            width: 'offsetWidth'
        }

        if (this.snapToEdge && this.previousMargin && !this.circular && this._items.length >= 2) {
            return this.slides[objName.left] / this.slideFrame[objName.width]
        }

        return 0
    }

    /**
     * 获取窗口最大 position
     */
    getViewportMax() {
        const objName = this.vertical ? {
            left: 'offsetTop',
            width: 'offsetHeight'
        } : {
            left: 'offsetLeft',
            width: 'offsetWidth'
        }

        if (this.snapToEdge && this.nextMargin && !this.circular && this._items.length >= 2) {
            const right = this.slidesWrapper[objName.width] - this.slides[objName.left] - this.slides[objName.width]
            return this._items.length - this.displayMultipleItems - (right / this.slideFrame[objName.width])
        }

        return this._items.length - this.displayMultipleItems
    }

    /**
     * 计算新的位置
     * 
     * 当 swiper-item 的个数大于等于 2，关闭 circular 并且开启 previous-margin 或 next-margin 的时候，可以指定这个边距是否应用到第一个、最后一个元素
     */
    calcNewPosition(position) {
        if (!this.snapToEdge || this._items.length < 2 || this.circular) return position

        const propName = this.vertical ? {
            left: 'offsetTop',
            width: 'offsetHeight'
        } : {
            left: 'offsetLeft',
            width: 'offsetWidth'
        }

        if (position === 0 && this.previousMargin) {
            position = this.slides[propName.left] / this.slideFrame[propName.width]
        }
        if (position === this._items.length - this.displayMultipleItems && this.nextMargin) {
            const right = this.slidesWrapper[propName.width] - this.slides[propName.left] - this.slides[propName.width]
            position = this._items.length - this.displayMultipleItems - (right / this.slideFrame[propName.width])
        }

        return position
    }

    /**
     * 更新窗口
     * 
     * 这里的 position 是按照以一个窗口的宽度作为一个单位来算，1.5 表示 1.5 倍窗口宽度
     */
    updateViewport(position, isFromResetLayout) {
        const items = this._items

        if (Math.floor(this._lastPosition * 2) !== Math.floor(position * 2) || Math.ceil(this._lastPosition * 2) !== Math.ceil(position * 2)) {
            // 小数分别在 (0, 0.5)、0.5、(0.5, 1) 三个区间中任意两个区间
            if (this._isCircular && !this._invalid) {
                // 循环播放，每次更新窗口前需要检查 wx-swiper-item 的位置
                const positionEnd = position + this.displayMultipleItems

                for (let i = 0, len = items.length; i < len; i++) {
                    const item = items[i]
                    const expect1 = Math.floor(position / len) * len + i // 预估该项在当前圈的 position
                    const expect2 = expect1 + len // 下一圈
                    const expect3 = expect1 - len // 上一圈

                    // 寻找距离窗口最短的位置
                    const dist1 = Math.max(position - (expect1 + 1), expect1 - positionEnd, 0)
                    const dist2 = Math.max(position - (expect2 + 1), expect2 - positionEnd, 0)
                    const dist3 = Math.max(position - (expect3 + 1), expect3 - positionEnd, 0)
                    const dist = Math.min(dist1, dist2, dist3)
                    const expect = [expect1, expect2, expect3][[dist1, dist2, dist3].indexOf(dist)]

                    if (item._position !== expect) this.updateItemPosition(i, expect)
                }
            }
            if (this.skipHiddenItemLayout) {
                // 将暂时不在窗口中的滑块设为 display: none
                const items = this._items
                for (let i = 0, len = items.length; i < len; i++) {
                    const item = items[i]
                    item.style.display = item._position <= position - 2 || item._position >= position + this.displayMultipleItems + 1 ? 'none' : item._originalDisplay
                }
            }
        }
        if (isFromResetLayout) {
            position = this.calcNewPosition(position)
        }

        // 更新窗口的位置
        const slideFrame = this.slideFrame
        const x = this.vertical ? '0' : -position * 100 + '%'
        const y = this.vertical ? -position * 100 + '%' : '0'
        const transform = 'translate(' + x + ', ' + y + ') translateZ(0)'
        slideFrame.style['-webkit-transform'] = transform
        slideFrame.style.transform = transform
        this._lastPosition = position

        // 触发 transition 事件
        const scrollPosition = {
            scrollLeft: this.vertical ? 0 : position * slideFrame.offsetWidth,
            scrollTop: this.vertical ? position * slideFrame.offsetHeight : 0,
            scrollWidth: (this.vertical ? 1 : this._items.length) * slideFrame.offsetWidth,
            scrollHeight: (this.vertical ? this._items.length : 1) * slideFrame.offsetHeight,
        }

        if (!this._scrollPosition || (this._scrollPosition.scrollLeft !== scrollPosition.scrollLeft || this._scrollPosition.scrollTop !== scrollPosition.scrollTop)) {
            if (this._animateFrameData && this._animateFrameData.source === 'touch' && !this._isSwiping || !this._isAnimateFrame) {
                this._scrollPosition = scrollPosition
                return
            }

            let dx = 0
            let dy = 0
            if (!this.vertical) dx = this.getTransitionDelta('X', scrollPosition.scrollLeft)
            else dy = this.getTransitionDelta('Y', scrollPosition.scrollTop)

            this.dispatchEvent(new CustomEvent('transition', {bubbles: true, cancelable: true, detail: {dx, dy}}))
        }
        this._scrollPosition = scrollPosition
    }

    /**
     * 获取偏移
     */
    getTransitionDelta(type, value) {
        const frameWidth = this.slideFrame[type === 'X' ? 'offsetWidth' : 'offsetHeight']
        const propName = `_lastPosition${type}`
        const lastValue = this[propName]
        const offset = Math.abs(parseInt(lastValue, 10) - parseInt(value, 10))
        if (typeof lastValue === 'number' && offset > frameWidth || this._transposed) {
            this._transposed = true
            const rearFramePosition = (this._items.length - 1) * frameWidth
            if (this._isCircular) {
                // 前 -> 后
                if (Math.sign(lastValue) < 0) {
                    value = -(frameWidth - (value - rearFramePosition))
                } else if (Math.sign(lastValue) > 0) {
                    // 后 -> 前
                    value = rearFramePosition + (frameWidth + value)
                }
            }
        } else if (this.autoplay && this._last === this._items.length - 1 && value <= 0 && (typeof lastValue !== 'number' || value > lastValue)) {
            this[propName] = value
            return frameWidth - Math.abs(value)
        } else {
            this[propName] = value
        }
        return value - this._last * frameWidth
    }

    /**
     * 执行帧动画
     */
    animateFrame() {
        if (!this._animateFrameData) {
            this._isAnimateViewport = false
            return
        }

        this._isAnimateFrame = true
        const {
            source,
            fromPosition,
            startTime,
            toPosition: prevPosition,
        } = this._animateFrameData

        const toPosition = this.calcNewPosition(prevPosition)
        const duration = this.duration
        const currentDuration = startTime + duration - Date.now()
        if (currentDuration <= 0) {
            // 当前滑动动画结束
            this.updateViewport(toPosition)
            this._animateFrameData = null
            this._isAnimateViewport = false

            if (this._items[this.current]) {
                if (source !== 'touch' || this._isSwiping) {
                    this.dispatchEvent(new CustomEvent('animationfinish', {bubbles: true, cancelable: true, detail: {current: this.current, source}}))
                }
                this._isSwiping = false
                this._isAnimateFrame = false
                this._transposed = false
                this._lastPositionX = null
                this._lastPositionY = null
                this._last = this.current
            }
            return
        }

        // 计算动画下一帧
        let delta
        let elapsed = Date.now() - startTime
        switch (this.easingFunction) {
            case 'easeInCubic': {
                elapsed /= duration
                delta = (toPosition - fromPosition) * elapsed * elapsed * elapsed + fromPosition
                break
            }
            case 'easeOutCubic': {
                elapsed = elapsed / duration - 1
                delta = (toPosition - fromPosition) * (elapsed * elapsed * elapsed + 1) + fromPosition
                break
            }
            case 'easeInOutCubic': {
                elapsed /= duration / 2
                if (elapsed < 1) {
                    delta = (toPosition - fromPosition) / 2 * elapsed * elapsed * elapsed + fromPosition
                } else {
                    elapsed -= 2
                    delta = (toPosition - fromPosition) / 2 * (elapsed * elapsed * elapsed + 2) + fromPosition
                }
                break
            }
            case 'linear': {
                delta = (toPosition - fromPosition) * elapsed / duration + fromPosition
                break
            }
            case 'default': default: {
                const acc = (fromPosition - toPosition) * 2 / (duration * duration)
                const currentDistance = acc * currentDuration * currentDuration / 2
                delta = toPosition + currentDistance
                break
            }
        }
        this.updateViewport(delta)
        requestAnimationFrame(this.animateFrame)
    }

    /**
     * 执行窗口动画
     */
    animateViewport(toPosition, source, direction) {
        const itemCount = this._items.length
        let fromPosition = this._lastPosition
        if (this._isCircular) {
            // 循环播发
            if (direction < 0) {
                // 将 from 和 to 的差距调整到一个列表长度内，且必须是反向（from > to）
                while (fromPosition < toPosition) fromPosition += itemCount
                while (fromPosition - itemCount > toPosition) fromPosition -= itemCount
            } else if (direction > 0) {
                // 将 from 和 to 的差距调整到一个列表长度内，且必须是正向（from < to）
                while (fromPosition > toPosition) fromPosition -= itemCount
                while (fromPosition + itemCount < toPosition) fromPosition += itemCount
            } else {
                // 将 from 和 to 的差距调整到一个列表长度内，支持正向和反向播发
                while (fromPosition + itemCount < toPosition) fromPosition += itemCount
                while (fromPosition - itemCount > toPosition) fromPosition -= itemCount
                if (fromPosition + itemCount - toPosition < toPosition - fromPosition) fromPosition += itemCount
                if (toPosition - (fromPosition - itemCount) < fromPosition - toPosition) fromPosition -= itemCount
            }
        }
        this._animateFrameData = {
            fromPosition,
            toPosition,
            startTime: Date.now(),
            source,
        }
        if (!this._isAnimateViewport) {
            // 避免重复 requestAnimationFrame
            this._isAnimateViewport = true
            requestAnimationFrame(this.animateFrame)
        }
    }

    /**
     * 监听滚轮事件
     */
    onHandleWheel(evt) {
        evt.preventDefault()

        if (!this._wheelStartTs) {
            if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)
            this._touchViewportPosition = this._lastPosition
            this._wheelX = 0
            this._wheelY = 0
        }
        this._wheelStartTs = Date.now()

        const deltaX = evt.deltaX
        const deltaY = evt.deltaY

        this._isSwiping = true

        const viewportMax = this.getViewportMax()
        const viewportMin = this.getViewportMin()
        const doUpdateViewport = (d, v) => {
            let position = this._touchViewportPosition + d
            this._touchSpeed = this._touchSpeed * 0.6 + v * 0.4
            if (!this._isCircular) {
                // 非循环播放
                if (position < viewportMin || position > viewportMax) {
                    if (position < viewportMin) position = 0.25 / (0.5 - position) - 0.5
                    else if (position > viewportMax) position = viewportMax + 0.5 - 0.25 / (position - viewportMax + 0.5)
                    this._touchSpeed = 0
                }
            }
            this.updateViewport(position)
        }

        this._wheelY += deltaY
        this._wheelX += deltaX
        if (this.vertical) {
            doUpdateViewport(this._wheelY / this.slideFrame.offsetHeight, deltaY)
        } else {
            doUpdateViewport(this._wheelX / this.slideFrame.offsetWidth, deltaX)
        }

        if (this._wheelTimeout) this._wheelTimeout = clearTimeout(this._wheelTimeout)
        const check = () => {
            if (Date.now() - this._wheelStartTs < 30) {
                // 距离上一次 wheel 事件在 50ms 内，就判定为还在滚动
                this._wheelTimeout = setTimeout(check, 5)
            } else {
                // 滚动结束
                this._wheelStartTs = null
                this.dealWithTouchEnd()
            }
        }
        this._wheelTimeout = setTimeout(check, 5)
    }

    /**
     * 监听触摸事件
     */
    onHandleTouchStart(evt) {
        if (this._invalid) return
        this._isTouch = true
        this._userDirectionChecked = false

        if (this._scheduleTimeout) this._scheduleTimeout = clearTimeout(this._scheduleTimeout)
        this._touchViewportPosition = this._lastPosition
        this._touchSpeed = 0
        this._touchTs = Date.now()

        this._startX = this._lastX = evt.touches[0].pageX
        this._startY = this._lastY = evt.touches[0].pageY
    }

    onHandleTouchMove(evt) {
        if (this._invalid || !this._isTouch) return

        evt.preventDefault()

        const x = evt.touches[0].pageX
        const y = evt.touches[0].pageY
        const dx = x - this._startX
        const dy = y - this._startY
        const ddx = x - this._lastX
        const ddy = y - this._lastY
        this._lastX = x
        this._lastY = y

        // 方向检查
        if (!this._userDirectionChecked) {
            this._userDirectionChecked = true

            const absDx = Math.abs(dx)
            const absDy = Math.abs(dy)

            // 方向符合预期，取消动画
            if (this._animateFrameData && (absDx < absDy && this.vertical || absDx > absDy && !this.vertical)) this._animateFrameData = null

            // 方向不符合预期，取消触摸判定
            if (absDx >= absDy && this.vertical) this._isTouch = false
            else if (absDx <= absDy && !this.vertical) this._isTouch = false

            if (!this._isTouch) {
                // 触摸不生效，重启自动播放
                if (this.autoplay) this.scheduleAutoplay()
                return
            }
        }

        this._isSwiping = true
        this._isAnimateFrame = true

        const now = Date.now()
        const deltaTs = now === this._touchTs ? 1 : now - this._touchTs
        this._touchTs = now

        const viewportMax = this.getViewportMax()
        const viewportMin = this.getViewportMin()
        const doUpdateViewport = (d, v) => {
            let position = this._touchViewportPosition + d
            this._touchSpeed = this._touchSpeed * 0.6 + v * 0.4
            if (!this._isCircular) {
                // 非循环播放
                if (position < viewportMin || position > viewportMax) {
                    if (position < viewportMin) position = 0.25 / (0.5 - position) - 0.5
                    else if (position > viewportMax) position = viewportMax + 0.5 - 0.25 / (position - viewportMax + 0.5)
                    this._touchSpeed = 0
                }
            }
            this.updateViewport(position)
        }

        if (this.vertical) {
            doUpdateViewport(-dy / this.slideFrame.offsetHeight, -ddy / deltaTs)
        } else {
            doUpdateViewport(-dx / this.slideFrame.offsetWidth, -ddx / deltaTs)
        }
    }

    onHandleTouchEnd() {
        if (this._invalid || !this._isTouch) return
        this.dealWithTouchEnd(false)
    }

    onHandleTouchCancel() {
        if (this._invalid || !this._isTouch) return
        this.dealWithTouchEnd(true)
    }

    dealWithTouchEnd(isCancel) {
        if (this.autoplay) this.scheduleAutoplay()
        this._isTouch = false
        const direction = !this._touchSpeed ? 0 : this._touchSpeed / Math.abs(this._touchSpeed)

        let extraMovement = 0
        if (!isCancel && Math.abs(this._touchSpeed) > 0.2) extraMovement = 0.5 * direction

        const toPosition = this.normalizeCurrentValue(this._lastPosition + extraMovement)
        if (isCancel) {
            // 恢复之前的位置
            this.updateViewport(this._touchViewportPosition)
        } else if (this.current !== toPosition) {
            this._currentSource = 'touch'
            this.current = toPosition
            this.animateViewport(toPosition, 'touch', extraMovement)
        } else {
            this.animateViewport(toPosition, 'touch', extraMovement)
        }
    }
}
