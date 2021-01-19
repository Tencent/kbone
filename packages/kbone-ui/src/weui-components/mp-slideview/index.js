import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

const REBOUNCE_TIME = 0.2

export default class MpSlideview extends WeuiBase {
    constructor() {
        super()

        this._rebounce = 0
        this._transformX = 0
        this._buttons = null

        this.initShadowRoot(template, MpSlideview.observedAttributes, () => {
            this.onButtonTap = this.onButtonTap.bind(this)
            this.onTouchStart = this.onTouchStart.bind(this)
            this.onTouchMove = this.onTouchMove.bind(this)
            this.onTouchEnd = this.onTouchEnd.bind(this)
            this.onTransitionEnd = this.onTransitionEnd.bind(this)
            this.slideview = this.shadowRoot.querySelector('.weui-slideview')
            this.leftDom = this.shadowRoot.querySelector('.weui-slideview__left')
            this.rightDom = this.shadowRoot.querySelector('.weui-slideview__right')
            this.buttonsCnt = this.shadowRoot.querySelector('.weui-slideview__buttons')
        })
    }

    static register() {
        customElements.define('mp-slideview', MpSlideview)
    }

    connectedCallback() {
        super.connectedCallback()

        this.buttonsCnt.addEventListener('tap', this.onButtonTap)
        this.leftDom.addEventListener('touchstart', this.onTouchStart)
        this.leftDom.addEventListener('touchmove', this.onTouchMove)
        this.leftDom.addEventListener('touchend', this.onTouchEnd)
        this.leftDom.addEventListener('transitionend', this.onTransitionEnd)
        this.updateClass()
        this.updateRight()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.buttonsCnt.removeEventListener('tap', this.onButtonTap)
        this.leftDom.removeEventListener('touchstart', this.onTouchStart)
        this.leftDom.removeEventListener('touchmove', this.onTouchMove)
        this.leftDom.removeEventListener('touchend', this.onTouchEnd)
        this.leftDom.removeEventListener('transitionend', this.onTransitionEnd)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'buttons') {
            this.updateButtons()
        } else if (name === 'icon') {
            this.updateClass()
            this.updateButtons()
        } else if (name === 'show') {
            if (this.disable) return
            if (this.show) {
                this.showButtons(this.duration)
            } else {
                this.hideButtons()
            }
        }
    }

    static get observedAttributes() {
        return ['disable', 'buttons', 'icon', 'show', 'duration', 'throttle', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get disable() {
        return this.getBoolValue('disable')
    }

    get buttons() {
        return this.getObjectValue('buttons', [])
    }

    get icon() {
        return this.getBoolValue('icon')
    }

    get show() {
        return this.getBoolValue('show')
    }

    set show(value) {
        this.setAttribute('show', value)
    }

    get duration() {
        return this.getNumberValue('duration', 350)
    }

    get throttle() {
        return this.getNumberValue('throttle', 40)
    }

    /**
     * 更新 class
     */
    updateClass() {
        this.slideview.className = `weui-slideview weui-movable-view ${this.icon ? 'weui-slideview_icon' : ''} ${this.extClass}`
    }

    /**
     * 更新右边部分
     */
    updateRight() {
        const leftRect = this.leftDom.getBoundingClientRect()
        const buttonsRect = []
        Array.prototype.slice.call(this.shadowRoot.querySelectorAll('.btn')).forEach(item => {
            const rect = item.getBoundingClientRect()
            buttonsRect.push({
                width: rect.width,
                left: rect.left,
            })
        })

        if (buttonsRect.length) {
            this._buttons = buttonsRect

            let max = 0
            let total = 0
            for (let i = buttonsRect.length - 1; i >= 0; i--) {
                max += buttonsRect[i].width
                total += buttonsRect[i].width
                buttonsRect[i].max = total
                buttonsRect[i].transformX = 0
            }
            this._max = max

            this.rightDom.style.lineHeight = `${leftRect.height}px`
            this.rightDom.style.left = `${leftRect.width}px`
            this.rightDom.style.width = `${max}px`

            if (!this.disable && this.show) this.showButtons()
        }
    }

    /**
     * 更新按钮
     */
    updateButtons() {
        const buttons = this.buttons
        if (buttons.length) {
            const icon = this.icon
            this.buttonsCnt.innerHTML = buttons.map((item, index) => {
                const className = icon ? '' : item.type === 'warn' ? 'weui-slideview__btn-group_warn' : 'weui-slideview__btn-group_default'
                return `<div class='btn weui-slideview__btn__wrp ${className} ${item.extClass}'>
                    <div data-index="${index}" class='weui-slideview__btn'>
                        ${!icon ? '<wx-text>' + item.text + '</wx-text>' : '<wx-image class="weui-slideview__btn__icon"src="' + item.src + '"></wx-image>'}
                    </div>
                </div>`
            }).join('')
            this.buttonsCnt.classList.toggle('hide', false)
            this.updateRight()
        } else {
            this.buttonsCnt.classList.toggle('hide', true)
        }
    }

    /**
     * 展示按钮
     */
    showButtons(duration = 0) {
        if (!this._buttons) return

        const rebounceTime = this._rebounce ? REBOUNCE_TIME : 0
        const moveX = this._max
        this._out = true
        const rebounce = this._rebounce || 0
        this.leftDom.style.transform = `translate3d(${-moveX - rebounce}px, 0, 0)`
        this.leftDom.style.webkitTransform = `translate3d(${-moveX - rebounce}px, 0, 0)`
        this.leftDom.style.transition = `transform ${duration}s`
        this.leftDom.style.webkitTransition = `transform ${duration}s`
        this._transformX = -moveX

        let transformTotal = 0
        const buttonsDom = this.shadowRoot.querySelectorAll('.btn')
        for (let i = buttonsDom.length - 1; i >= 0; i--) {
            const item = buttonsDom[i]
            const transform = this._buttons[i].width / this._max * moveX
            const transformX = (-(transform + transformTotal))

            item.style.transform = `translate3d(${transformX}px, 0, 0)`
            item.style.webkitTransform = `translate3d(${transformX}px, 0, 0)`
            item.style.transition = `transform ${duration ? duration + rebounceTime : duration}s`
            item.style.webkitTransition = `transform ${duration ? duration + rebounceTime : duration}s`
            this._buttons[i].transformX = 0
            transformTotal += transform
        }
    }

    /**
     * 隐藏按钮
     */
    hideButtons() {
        if (!this._buttons) return

        let duration = this.duration
        duration = duration ? duration / 1000 : 0
        this.leftDom.style.transform = 'translate3d(0px, 0, 0)'
        this.leftDom.style.webkitTransform = 'translate3d(0px, 0, 0)'
        this.leftDom.style.transition = `transform ${duration}s`
        this.leftDom.style.webkitTransition = `transform ${duration}s`
        this._transformX = 0

        const buttonsDom = this.shadowRoot.querySelectorAll('.btn')
        for (let i = buttonsDom.length - 1; i >= 0; i--) {
            const item = buttonsDom[i]
            item.style.transform = 'translate3d(0px, 0, 0)'
            item.style.webkitTransform = 'translate3d(0px, 0, 0)'
            item.style.transition = `transform ${duration}s`
            item.style.webkitTransition = `transform ${duration}s`
            this._buttons[i].transformX = 0
        }

        this.show = false
    }

    /**
     * 监听按钮点击
     */
    onButtonTap(evt) {
        const button = findParent(evt.target, node => node.classList && node.classList.contains('weui-slideview__btn'))
        if (button) {
            const index = +button.dataset.index
            const item = this.buttons[index]

            this.hideButtons()
            this.dispatchEvent(new CustomEvent('buttontap', {bubbles: true, cancelable: true, detail: {index, data: item.data}}))
        }
    }

    /**
     * 监听触摸事件
     */
    onTouchStart(evt) {
        if (this.disable) return
        if (!this._buttons) return
        this._isMoving = true
        this._startX = evt.touches[0].pageX
        this._startY = evt.touches[0].pageY
        this._firstAngle = 0
    }

    onTouchMove(evt) {
        if (!this._buttons || !this._isMoving) return
        evt.preventDefault()
        evt.stopPropagation()

        const pageX = evt.touches[0].pageX - this._startX
        const pageY = evt.touches[0].pageY - this._startY

        // 左侧45度角为界限，大于45度则允许水平滑动
        if (this._firstAngle === 0) this._firstAngle = Math.abs(pageX) - Math.abs(pageY)
        if (this._firstAngle < 0) return

        let moveX = pageX > 0 ? Math.min(this._max, pageX) : Math.max(-this._max, pageX)
        if (this._out) {
            // 往回滑动的情况
            if (moveX < 0) return // 已经是划出来了，还要往左滑动，忽略
            this.leftDom.style.transform = `translateX(${this._transformX + moveX}px)`
            this.leftDom.style.webkitTransform = `translateX(${this._transformX + moveX}px)`
            this.leftDom.style.transition = ''
            this.leftDom.style.webkitTransition = ''

            let transformTotal = 0
            const buttonsDom = this.shadowRoot.querySelectorAll('.btn')
            for (let i = buttonsDom.length - 1; i >= 0; i--) {
                const item = buttonsDom[i]
                const transform = this._buttons[i].width / this._max * moveX
                const transformX = this._buttons[i].max - Math.min(this._buttons[i].max, transform + transformTotal)

                item.style.transform = `translateX(${-transformX}px)`
                item.style.webkitTransform = `translateX(${-transformX}px)`
                item.style.transition = ''
                item.style.webkitTransition = ''
                transformTotal += transform
            }
        } else {
            if (moveX > 0) moveX = 0
            this.leftDom.style.transform = `translateX(${moveX}px)`
            this.leftDom.style.webkitTransform = `translateX(${moveX}px)`
            this.leftDom.style.transition = ''
            this.leftDom.style.webkitTransition = ''
            this._transformX = moveX

            let transformTotal = 0
            const buttonsDom = this.shadowRoot.querySelectorAll('.btn')
            for (let i = buttonsDom.length - 1; i >= 0; i--) {
                const item = buttonsDom[i]
                const transform = this._buttons[i].width / this._max * moveX
                const transformX = Math.max(-this._buttons[i].max, transform + transformTotal)

                item.style.transform = `translateX(${transformX}px)`
                item.style.webkitTransform = `translateX(${transformX}px)`
                item.style.transition = ''
                item.style.webkitTransition = ''
                this.buttons[i].transformX = transformX
                transformTotal += transform
            }
        }
    }

    onTouchEnd(evt) {
        if (!this._buttons || !this._isMoving) return
        if (this._firstAngle < 0) return // 左侧45度角为界限，大于45度则允许水平滑动

        const duration = this.duration / 1000
        this._isMoving = false

        if (Math.abs(evt.changedTouches[0].pageX - this._startX) < this.throttle || evt.changedTouches[0].pageX - this._startX > 0) {
            // 方向也要控制
            this._out = false
            this.leftDom.style.transform = 'translate3d(0px, 0, 0)'
            this.leftDom.style.webkitTransform = 'translate3d(0px, 0, 0)'
            this.leftDom.style.transition = `transform ${duration}s`
            this.leftDom.style.webkitTransition = `transform ${duration}s`

            const buttonsDom = this.shadowRoot.querySelectorAll('.btn')
            for (let i = buttonsDom.length - 1; i >= 0; i--) {
                const item = buttonsDom[i]
                item.style.transform = 'translate3d(0px, 0, 0)'
                item.style.webkitTransform = 'translate3d(0px, 0, 0)'
                item.style.transition = `transform ${duration}s`
                item.style.webkitTransition = `transform ${duration}s`
            }

            this.dispatchEvent(new CustomEvent('hide', {bubbles: true, cancelable: true}))
            return
        }

        this.showButtons(duration)
        this.dispatchEvent(new CustomEvent('show', {bubbles: true, cancelable: true}))
    }

    /**
     * 监听 transitionend 事件
     */
    onTransitionEnd() {
        // 回弹效果
        if (this._out && this._rebounce) {
            this.leftDom.style.transform = `translate3d(${-this._max}px, 0, 0)`
            this.leftDom.style.webkitTransform = `translate3d(${-this._max}px, 0, 0)`
            this.leftDom.style.transition = `transform ${REBOUNCE_TIME}s`
            this.leftDom.style.webkitTransition = `transform ${REBOUNCE_TIME}s`
        }
    }
}
