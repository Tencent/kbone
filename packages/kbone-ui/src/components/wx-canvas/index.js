import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxCanvas extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCanvas.observedAttributes, () => {
            this.onCanvasTouchStart = this.onCanvasTouchStart.bind(this)
            this.onCanvasTouchMove = this.onCanvasTouchMove.bind(this)
            this.onCanvasTouchEnd = this.onCanvasTouchEnd.bind(this)
            this.onCanvasTouchCancel = this.onCanvasTouchCancel.bind(this)
            this.onCanvasLongPress = this.onCanvasLongPress.bind(this)
            this.canvas = this.shadowRoot.querySelector('#canvas')
        })
    }

    static register() {
        customElements.define('wx-canvas', WxCanvas)
    }

    connectedCallback() {
        super.connectedCallback()

        this.canvas.addEventListener('touchstart', this.onCanvasTouchStart)
        this.canvas.addEventListener('touchmove', this.onCanvasTouchMove)
        this.canvas.addEventListener('touchend', this.onCanvasTouchEnd)
        this.canvas.addEventListener('touchcancel', this.onCanvasTouchCancel)
        this.canvas.addEventListener('longpress', this.onCanvasLongPress)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.canvas.removeEventListener('touchstart', this.onCanvasTouchStart)
        this.canvas.removeEventListener('touchmove', this.onCanvasTouchMove)
        this.canvas.removeEventListener('touchend', this.onCanvasTouchEnd)
        this.canvas.removeEventListener('touchcancel', this.onCanvasTouchCancel)
        this.canvas.removeEventListener('longpress', this.onCanvasLongPress)
    }

    static get observedAttributes() {
        return ['type', 'canvas-id', 'disable-scroll', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get type() {
        return this.getAttribute('type')
    }

    get canvasId() {
        // canvas-id 不支持
        return null
    }

    get disableScroll() {
        return this.getBoolValue('disable-scroll')
    }

    get width() {
        return this.canvas.width
    }

    set width(value) {
        this.canvas.width = value
    }

    get height() {
        return this.canvas.height
    }

    set height(value) {
        this.canvas.height = value
    }

    /**
     * canvas 事件处理
     */
    onCanvasTouchStart(evt) {
        const newEvt = new TouchEvent('canvastouchstart', evt)
        this.dispatchEvent(newEvt)
    }

    onCanvasTouchMove(evt) {
        const newEvt = new TouchEvent('canvastouchmove', evt)
        this.dispatchEvent(newEvt)
    }

    onCanvasTouchEnd(evt) {
        const newEvt = new TouchEvent('canvastouchend', evt)
        this.dispatchEvent(newEvt)
    }

    onCanvasTouchCancel(evt) {
        const newEvt = new TouchEvent('canvastouchcancel', evt)
        this.dispatchEvent(newEvt)
    }

    onCanvasLongPress() {
        this.dispatchEvent(new CustomEvent('longtap', {bubbles: true, cancelable: true}))
    }

    /**
     * 准备 canvas
     */
    $$prepare() {
        return new Promise(resolve => resolve(this))
    }

    getContext(type) {
        return this.canvas.getContext(type)
    }

    createPath2D(...args) {
        return new Path2D(...args)
    }

    createImage(...args) {
        return new Image(...args)
    }

    createImageData(...args) {
        return new ImageData(...args)
    }

    requestAnimationFrame(...args) {
        return window.requestAnimationFrame(...args)
    }

    cancelAnimationFrame(...args) {
        return window.cancelAnimationFrame(...args)
    }

    toDataURL() {
        return this.canvas.toDataURL()
    }
}
