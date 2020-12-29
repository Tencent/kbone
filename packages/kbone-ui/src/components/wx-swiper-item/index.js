import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxSwiperItem extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxSwiperItem.observedAttributes)
    }

    static register() {
        customElements.define('wx-swiper-item', WxSwiperItem)
    }

    connectedCallback() {
        super.connectedCallback()

        this.style.position = 'absolute'
        this.style.width = '100%'
        this.style.height = '100%'
        this.__originalDisplay = this.style.display // 给 wx-swiper 使用
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'item-id') {
            if (oldValue === newValue) return
            const parentNode = findParent(this, parentNode => parentNode.tagName === 'WX-SWIPER')
            if (parentNode) parentNode.onItemIdUpdated(newValue, oldValue)
        }
    }

    static get observedAttributes() {
        return ['item-id', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get itemId() {
        return this.getAttribute('item-id')
    }

    get _originalDisplay() {
        return this.__originalDisplay
    }
}
