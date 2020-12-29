import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const MODE_LIST = ['scaleToFill', 'aspectFit', 'aspectFill', 'top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']

export default class WxImage extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxImage.observedAttributes, () => {
            this._changeId = 0 // 记录不同 src 对应的 id

            this.onResize = this.onResize.bind(this)
            this.div = this.shadowRoot.querySelector('#div')
        })
    }

    static register() {
        customElements.define('wx-image', WxImage)
    }

    connectedCallback() {
        super.connectedCallback()

        this._originalHeight = this.style.height || ''
        this._originalWidth = this.style.width || ''

        // 监听尺寸变化
        if (this._resizeObserver) this._resizeObserver = this._resizeObserver.disconnect()
        this._resizeObserver = new ResizeObserver(this.onResize)
        this._resizeObserver.observe(this)

        this.addEventListener('longpress', this.onLongPress)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._resizeObserver) this._resizeObserver.disconnect()
        this._resizeObserver = null

        this.removeEventListener('longpress', this.onLongPress)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'src') {
            if (oldValue === newValue) return
            this._changeId++
            this.init(this.lazyLoad)
        } else if (name === 'mode') {
            const mode = this.mode
            if (MODE_LIST.indexOf(mode) === -1) {
                // 如果不是合法的 mode, 则不禁用组件的 background-* 属性
                this.div.style.backgroundSize = '100% 100%'
                this.div.style.backgroundRepeat = 'no-repeat'
                return
            }

            if (oldValue === 'widthFix' || oldValue === 'heightFix') {
                this.style.height = this._originalHeight
                this.style.width = this._originalWidth
            }

            // 先重置 div style 的 background-* 属性
            this.div.style.backgroundSize = 'auto auto'
            this.div.style.backgroundPosition = '0% 0%'
            this.div.style.backgroundRepeat = 'no-repeat'

            switch (mode) {
                case 'scaleToFill':
                    this.div.style.backgroundSize = '100% 100%'
                    break
                case 'aspectFit':
                    this.div.style.backgroundSize = 'contain'
                    this.div.style.backgroundPosition = 'center center'
                    break
                case 'aspectFill':
                    this.div.style.backgroundSize = 'cover'
                    this.div.style.backgroundPosition = 'center center'
                    break
                case 'widthFix':
                case 'heightFix':
                    this.div.style.backgroundSize = '100% 100%'
                    this.onResize()
                    break
                case 'top':
                    this.div.style.backgroundPosition = 'top center'
                    break
                case 'bottom':
                    this.div.style.backgroundPosition = 'bottom center'
                    break
                case 'center':
                    this.div.style.backgroundPosition = 'center center'
                    break
                case 'left':
                    this.div.style.backgroundPosition = 'center left'
                    break
                case 'right':
                    this.div.style.backgroundPosition = 'center right'
                    break
                case 'top left':
                    this.div.style.backgroundPosition = 'top left'
                    break
                case 'top right':
                    this.div.style.backgroundPosition = 'top right'
                    break
                case 'bottom left':
                    this.div.style.backgroundPosition = 'bottom left'
                    break
                case 'bottom right':
                    this.div.style.backgroundPosition = 'bottom right'
                    break
                default:
                    break
            }
        } else if (name === 'lazy-load') {
            if (oldValue === newValue) return
            if (!this.lazyLoad) this.init(this.lazyLoad) // true 转为 false 时，重新判断展示
        }
    }

    static get observedAttributes() {
        return ['src', 'mode', 'webp', 'lazy-load', 'show-menu-by-longpress', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get src() {
        return this.getAttribute('src')
    }

    get mode() {
        return this.getAttribute('mode') || 'scaleToFill'
    }

    get webp() {
        // 交由浏览器来支持
        return null
    }

    get lazyLoad() {
        return this.getBoolValue('lazy-load')
    }

    get showMenuByLongpress() {
        return this.getBoolValue('show-menu-by-longpress')
    }

    /**
     * 监听尺寸变化
     */
    onResize() {
        if (this.mode === 'widthFix' && this._ratio !== undefined) this.style.height = `${this.getWidth() / this._ratio}px`
        if (this.mode === 'heightFix' && this._ratio !== undefined) this.style.width = `${this.getHeight() * this._ratio}px`
    }

    /**
     * 初始化
     */
    init(lazyLoad) {
        if (!lazyLoad) {
            this.showImage(this._changeId)
        } else {
            this.removeIntersectionObserver() // 先移除再重新监听
            this.addIntersectionObserver()
        }
    }

    /**
     * 展示图片
     */
    showImage(changeId) {
        if (!this.src) return
        this._hasBeenShown = true // 标记这个图片已经至少被加载过一次

        this._loaded = false
        const src = this.src

        let img = new Image()
        img.onerror = evt => {
            evt.stopPropagation()

            if (changeId !== this._changeId) return
            if (src) this.dispatchEvent(new CustomEvent('error', {bubbles: true, cancelable: true, detail: {errMsg: `GET ${src} 404 (Not Found)`}}))

            img = undefined
        }
        img.referrerPolicy = 'origin'
        img.onload = evt => {
            evt.stopPropagation()

            this._loaded = true

            if (changeId !== this._changeId) return
            if (src) this.dispatchEvent(new CustomEvent('load', {bubbles: true, cancelable: true, detail: {width: img.width, height: img.height}}))

            this._ratio = img.width / img.height
            if (this.mode === 'widthFix' || this.mode === 'heightFix') {
                if (this.mode === 'heightFix') this.style.width = `${this.getHeight() * this._ratio}px`
                if (this.mode === 'widthFix') this.style.height = `${this.getWidth() / this._ratio}px`
                this.onResize()
            }

            img = undefined
        }

        this.removeIntersectionObserver()
        img.src = src
        this.div.style.backgroundImage = `url('${src}')`
    }

    /**
     * 监听可见区域变化
     */
    addIntersectionObserver() {
        if (this._intersectionObserver) this._intersectionObserver.disconnect()

        this._intersectionObserver = new IntersectionObserver(entries => {
            if (entries[0].intersectionRatio > 0.1) this.showImage(this._changeId)
        }, {
            rootMargin: `${document.documentElement.clientWidth * 2}px ${document.documentElement.clientHeight * 2}px`,
            threshold: 0.1
        })
        this._intersectionObserver.observe(this)
    }

    /**
     * 取消监听可见区域变化
     */
    removeIntersectionObserver() {
        if (this._intersectionObserver) this._intersectionObserver.disconnect()
        this._intersectionObserver = null
    }

    /**
     * 计算组件宽度
     */
    getWidth() {
        const style = window.getComputedStyle(this)
        const borderWidth = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0)
        const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0)

        return this.offsetWidth - borderWidth - padding
    }

    /**
     * 计算组件高度
     */
    getHeight() {
        const style = window.getComputedStyle(this)
        const borderHeight = (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0)
        const padding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)

        return this.offsetHeight - borderHeight - padding
    }

    /**
     * 监听长按
     */
    onLongPress() {
        if (!this.showMenuByLongpress || !this._loaded) return
        console.error('[wx-image] show-menu-by-longpress 属性不支持')
    }
}
