import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

import Base64 from './base64'
import iconData from './icondata'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpIcon extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpIcon.observedAttributes, () => {
            this.iconDom = this.shadowRoot.querySelector('.weui-icon')
        })
    }

    static register() {
        customElements.define('mp-icon', MpIcon)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.iconDom.className = `weui-icon ${this.extClass}`
        } else if (name === 'type') {
            const iconDataItem = iconData[this.icon]
            if (iconDataItem) this.updateSrc(iconDataItem[this.type])
        } else if (name === 'icon') {
            const iconDataItem = iconData[this.icon]
            if (iconDataItem) this.updateSrc(iconDataItem[this.type])
            this.updateStyle()
        } else if (name === 'size') {
            this.updateStyle()
        } else if (name === 'color') {
            this.updateStyle()
        }
    }

    static get observedAttributes() {
        return ['type', 'icon', 'size', 'color', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get type() {
        return this.getAttribute('type') || 'outline'
    }

    get icon() {
        return this.getAttribute('icon')
    }

    get size() {
        return this.getNumberValue('size', 20)
    }

    get color() {
        return this.getAttribute('color') || '#000'
    }

    updateStyle() {
        const icon = this.icon
        const size = this.size
        this.iconDom.style.background = this.color
        this.iconDom.style.width = size + 'px'
        this.iconDom.style.height = ((icon === 'arrow' || icon === 'back') ? (2 * size) : size) + 'px'
    }

    updateSrc(rawData) {
        if (!rawData) return // type 不存在

        const base64 = Base64.encode(rawData)
        const src = `url(data:image/svg+xml;base64,${base64})`
        this.iconDom.style.maskImage = src
        this.iconDom.style.webkitMaskImage = src
        this.iconDom.style.mozMaskImage = src
    }
}
