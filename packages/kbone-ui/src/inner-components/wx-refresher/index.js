import Base from '../../components/base'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'
import refresher from './refresher'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const DEFAULT_DOT_INIT_OFFSET = -12
const DEFAULT_DOT_FULL_OFFSET = 1
const DEFAULT_TOTAL_OFFSET = DEFAULT_DOT_FULL_OFFSET - DEFAULT_DOT_INIT_OFFSET

const DEFAULT_MAX_HEIGHT = 53
const DEFAULT_THRESHOLD = 55
const DEFAULT_MARGIN_TOP = 15
const DEFAULT_EXTRA_MOVE = 2

export default class WxRefresher extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxRefresher.observedAttributes, () => {
            this.onPulling = this.onPulling.bind(this)
            this.onRefresh = this.onRefresh.bind(this)
            this.onRestore = this.onRestore.bind(this)
            this.onAbort = this.onAbort.bind(this)
            this.container = this.shadowRoot.querySelector('#container')
            this.defaultStyleDom = this.shadowRoot.querySelector('.wx--refresher-default')
            this.customStyleDom = this.shadowRoot.querySelector('.wx--refresher-custom')
            this.dot1 = this.shadowRoot.querySelector('#dot1')
            this.dot2 = this.shadowRoot.querySelector('#dot2')
            this.dot3 = this.shadowRoot.querySelector('#dot3')

            this._defaultStyle = 'black'
        })
    }

    static register() {
        customElements.define('wx-refresher', WxRefresher)
    }

    connectedCallback() {
        super.connectedCallback()

        const parentNode = findParent(this, parentNode => parentNode.host && parentNode.host.tagName === 'WX-SCROLL-VIEW') // 目前只在 wx-scroll-view 中使用
        if (parentNode) {
            this._content = parentNode.querySelector('#content')

            if (this._content) this._content.classList.add('wx--refresher--content--private')

            // 处理下拉刷新
            this._refresher = refresher({
                parentNode: parentNode.host,
                contentNode: this._content,
                scrollerNode: parentNode.querySelector('#main'),
                container: this.container,
                threshold: this.threshold,
                onPulling: this.onPulling,
                onRefresh: this.onRefresh,
                onRestore: this.onRestore,
                onAbort: this.onAbort,
            })
        }

        this.dispatchEvent(new CustomEvent('ready', {bubbles: false, cancelable: true, detail: {ready: true}}))
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._refresher) this._refresher.dispose()
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (isInit) return
        if (name === 'default-style') {
            const value = this.defaultStyle
            if (!value || value === 'none') this._defaultStyle = ''
            else if (value !== 'white' && value !== 'black') this._defaultStyle = ''
            else this._defaultStyle = value

            this.defaultStyleDom.classList.toggle('hidden', !this._defaultStyle)
            this.customStyleDom.classList.toggle('hidden', this._defaultStyle)

            this.dot1.classList.toggle('wx-refresher-default-white', this._defaultStyle === 'white')
            this.dot2.classList.toggle('wx-refresher-default-white', this._defaultStyle === 'white')
            this.dot3.classList.toggle('wx-refresher-default-white', this._defaultStyle === 'white')
        } else if (name === 'threshold') {
            if (oldValue === newValue) return
            if (!this._defaultStyle && this._refresher) this._refresher.updateThreshold(this.threshold)
        } else if (name === 'background') {
            this.container.style.background = this.background
        } else if (name === 'triggered') {
            if (!this._refresher) return
            if (this.triggered) this._refresher.triggerOpen()
            else this._refresher.triggerClose()
        }
    }

    static get observedAttributes() {
        return ['default-style', 'threshold', 'background', 'triggered', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get defaultStyle() {
        return this.getAttribute('default-style') || 'black'
    }

    get threshold() {
        return this.getNumberValue('threshold', DEFAULT_THRESHOLD)
    }

    get background() {
        return this.getAttribute('background') || '#FFF'
    }

    get triggered() {
        return this.getBoolValue('triggered')
    }

    /**
     * 监听下拉
     */
    onPulling(dy) {
        this.dispatchEvent(new CustomEvent('pulling', {bubbles: false, cancelable: true, detail: {dy}}))

        if (!this._defaultStyle) return
        if (this.dot1.classList.contains('wx-refresher-default-dot-1-fold')) this.dot1.classList.remove('wx-refresher-default-dot-1-fold')
        if (this.dot3.classList.contains('wx-refresher-default-dot-3-fold')) this.dot3.classList.remove('wx-refresher-default-dot-3-fold')

        const progress = dy <= DEFAULT_MARGIN_TOP + DEFAULT_EXTRA_MOVE ? 0 : (dy - DEFAULT_MARGIN_TOP - DEFAULT_EXTRA_MOVE) / (DEFAULT_MAX_HEIGHT - DEFAULT_MARGIN_TOP - DEFAULT_EXTRA_MOVE)
        const offset = dy <= this.threshold ? DEFAULT_DOT_INIT_OFFSET + DEFAULT_TOTAL_OFFSET * progress : DEFAULT_DOT_FULL_OFFSET

        const normlizedOffset = parseInt(offset * 100, 10) / 100
        this.dot1.style.transform = `translateX(${-normlizedOffset}px)`
        this.dot3.style.transform = `translateX(${normlizedOffset}px)`
    }

    /**
     * 监听刷新
     */
    onRefresh(dy) {
        this.dispatchEvent(new CustomEvent('refresh', {bubbles: false, cancelable: true, detail: {dy}}))

        if (!this._defaultStyle) return
        this.dot1.classList.add('wx-refresher-default-dot-1-blink-anim')
        this.dot2.classList.add('wx-refresher-default-dot-2-blink-anim')
        this.dot3.classList.add('wx-refresher-default-dot-3-blink-anim')
    }

    /**
     * 监听恢复
     */
    onRestore(dy) {
        this.dispatchEvent(new CustomEvent('restore', {bubbles: false, cancelable: true, detail: {dy}}))

        if (!this._defaultStyle) return
        this.dot1.classList.remove('wx-refresher-default-dot-1-blink-anim')
        this.dot2.classList.remove('wx-refresher-default-dot-2-blink-anim')
        this.dot3.classList.remove('wx-refresher-default-dot-3-blink-anim')

        this.dot1.classList.add('wx-refresher-default-dot-1-fold')
        this.dot3.classList.add('wx-refresher-default-dot-3-fold')
    }

    /**
     * 监听中断
     */
    onAbort(dy) {
        this.dispatchEvent(new CustomEvent('abort', {bubbles: false, cancelable: true, detail: {dy}}))

        if (!this._defaultStyle) return
        this.dot1.classList.remove('wx-refresher-default-dot-1-blink-anim')
        this.dot2.classList.remove('wx-refresher-default-dot-2-blink-anim')
        this.dot3.classList.remove('wx-refresher-default-dot-3-blink-anim')
    }

    /**
     * 禁止下拉刷新
     */
    disableRefresher(disable) {
        if (!this._refresher) return
        this._refresher.updateLock(disable)
    }
}
