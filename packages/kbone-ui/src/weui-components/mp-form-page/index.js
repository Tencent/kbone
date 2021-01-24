import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpFormPage extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpFormPage.observedAttributes, () => {
            this.checkChildNode = this.checkChildNode.bind(this)
            this.titleCnt = this.shadowRoot.querySelector('.weui-form__text-area.title')
            this.titleDom = this.shadowRoot.querySelector('.weui-form__title')
            this.subtitleDom = this.shadowRoot.querySelector('.weui-form__desc')
            this.slotTitle = this.shadowRoot.querySelector('.weui-form__text-area.slot-title')
        })
    }

    static register() {
        customElements.define('mp-form-page', MpFormPage)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.checkChildNode)
        this._observer.observe(this, {
            childList: true,
            subtree: true,
        })

        this.checkChildNode()
    }

    disconnectedCallback() {
        super.disconnectedCallback()


        if (this._observer) this._observer.disconnect()
        this._observer = null
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'title' || name === 'subtitle') {
            const title = this.title
            const subtitle = this.subtitle
            this.titleDom.innerText = title
            this.subtitleDom.innerText = subtitle
            this.titleCnt.classList.toggle('hide', !title && !subtitle)
            this.slotTitle.classList.toggle('hide', title || subtitle)
        }
    }

    static get observedAttributes() {
        return ['title', 'subtitle', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title') || ''
    }

    get subtitle() {
        return this.getAttribute('subtitle') || ''
    }

    /**
     * 监听子节点变化
     */
    checkChildNode() {
        const childList = Array.prototype.slice.call(this.querySelectorAll('mp-cells'))
        childList.forEach((item, index) => {
            if (index === 0) item.setOuterClass('weui-cells__group weui-cells__group_form weui-cells_form')
            else item.setOuterClass('weui-cells__group_wxss weui-cells__group weui-cells__group_form weui-cells_form')
        })

        const cellList = Array.prototype.slice.call(this.querySelectorAll('mp-cell'))
        cellList.forEach(item => item.setInGroupForm(true))

        const checkboxList = Array.prototype.slice.call(this.querySelectorAll('mp-checkbox'))
        checkboxList.forEach(item => item.setInGroupForm(true))
    }
}
