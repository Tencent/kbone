import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxCanvas extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCanvas.observedAttributes, () => {
            this.onTap = this.onTap.bind(this)
            this.input = this.shadowRoot.querySelector('#input')
        })
    }

    static register() {
        customElements.define('wx-canvas', WxCanvas)
    }

    connectedCallback() {
        super.connectedCallback()

    }

    disconnectedCallback() {
        super.disconnectedCallback()

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
}
