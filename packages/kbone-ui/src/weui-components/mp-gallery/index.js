import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpGallery extends WeuiBase {
    constructor() {
        super()

        this._currentImgs = []

        this.initShadowRoot(template, MpGallery.observedAttributes, () => {
            this.onChange = this.onChange.bind(this)
            this.hide = this.hide.bind(this)
            this.doDeleteImg = this.doDeleteImg.bind(this)
            this.gallery = this.shadowRoot.querySelector('.weui-gallery')
            this.info = this.shadowRoot.querySelector('.weui-gallery__info')
            this.swiper = this.shadowRoot.querySelector('.weui-gallery__img__wrp')
            this.deleteDom = this.shadowRoot.querySelector('.weui-gallery__opr')
            this.deleteInner = this.shadowRoot.querySelector('.weui-gallery__del')
        })
    }

    static register() {
        customElements.define('mp-gallery', MpGallery)
    }

    connectedCallback() {
        super.connectedCallback()

        this.swiper.addEventListener('change', this.onChange)
        this.swiper.addEventListener('tap', this.hide)
        this.deleteInner.addEventListener('tap', this.doDeleteImg)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.swiper.removeEventListener('change', this.onChange)
        this.swiper.removeEventListener('tap', this.hide)
        this.deleteInner.removeEventListener('tap', this.doDeleteImg)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class' || name === 'show') {
            this.updateClass()
        } else if (name === 'img-urls') {
            this._currentImgs = this.imgUrls
            this.updateInfo()
            this.updateSwiper()
        } else if (name === 'current') {
            this.updateInfo()
            this.swiper.setAttribute('current', this.current)
        } else if (name === 'show-delete') {
            this.deleteDom.classList.toggle('hide', !this.showDelete)
        }
    }

    static get observedAttributes() {
        return ['show', 'img-urls', 'current', 'show-delete', 'hide-on-click', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get show() {
        return this.getBoolValue('show')
    }

    set show(value) {
        this.setAttribute('show', value)
    }

    get imgUrls() {
        return this.getObjectValue('img-urls', [])
    }

    get current() {
        return this.getNumberValue('current')
    }

    set current(value) {
        this.setAttribute('current', value)
    }

    get showDelete() {
        return this.getBoolValue('show-delete', true)
    }

    get hideOnClick() {
        return this.getBoolValue('hide-on-click', true)
    }

    /**
     * 更新样式
     */
    updateClass() {
        this.gallery.className = `weui-gallery ${this.show ? 'weui-gallery_show' : ''} ${this.extClass}`
    }

    /**
     * 更新 info
     */
    updateInfo() {
        this.info.innerText = `${this.current + 1}/${this._currentImgs.length}`
    }

    /**
     * 更新 swiper
     */
    updateSwiper() {
        const imgUrls = this._currentImgs
        if (imgUrls.length) {
            this.swiper.innerHTML = imgUrls.map(item => `<wx-swiper-item>
                    <wx-image mode="aspectFit" class="weui-gallery__img" src="${item}"></wx-image>
                </wx-swiper-item>`).join('')
        } else {
            this.swiper.innerHTML = ''
        }
    }

    /**
     * 监听 swiper 的 change 事件
     */
    onChange(evt) {
        this.current = evt.detail.current
        this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {current: evt.detail.current}}))
    }

    /**
     * 删除图片
     */
    doDeleteImg() {
        const imgUrls = this._currentImgs
        const current = this.current
        const spliceImgUrls = imgUrls.splice(current, 1)

        const swiperItem = this.swiper.querySelectorAll('wx-swiper-item')[current]
        if (swiperItem) swiperItem.parentNode.removeChild(swiperItem)

        this.dispatchEvent(new CustomEvent('delete', {bubbles: true, cancelable: true, detail: {url: spliceImgUrls[0], index: current}}))

        if (!imgUrls.length) {
            this.hide()
        } else {
            this.current = 0
            this._currentImgs = imgUrls
            this.updateInfo()
        }
    }

    /**
     * 隐藏
     */
    hide() {
        if (this.hideOnClick) {
            this.show = false
            this.dispatchEvent(new CustomEvent('hide', {bubbles: true, cancelable: true}))
        }
    }
}
