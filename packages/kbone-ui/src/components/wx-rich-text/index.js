import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import HtmlFilter from '../../utils/html-filter'
import HtmlParser from '../../utils/html-parser'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxRichText extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxRichText.observedAttributes, () => {
            this.richText = this.shadowRoot.querySelector('#rich-text')
        })
    }

    static register() {
        customElements.define('wx-rich-text', WxRichText)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'nodes') {
            this.parse(this.nodes)
        }
    }

    static get observedAttributes() {
        return ['nodes', 'space', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get nodes() {
        let value = this.getObjectValue('nodes')
        if (!value) value = this.getAttribute('nodes')
        return value
    }

    get space() {
        return this.getAttribute('space')
    }

    /**
     * 解析
     */
    parse(nodes) {
        if (nodes === null) return
        if (typeof nodes === 'string') nodes = HtmlParser.parse(nodes)

        if (Array.isArray(nodes)) {
            this.richText.innerHTML = ''
            const child = HtmlFilter.parse(nodes, document.createDocumentFragment(), HtmlFilter.createSpaceDecode(this.space))
            this.richText.appendChild(child)
        } else {
            console.error('[wx-rich-text] nodes 属性只支持 String 和 Array 类型，请检查输入的值')
        }
    }
}
