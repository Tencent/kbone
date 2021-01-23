import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpCells extends WeuiBase {
    constructor() {
        super()

        this._checkboxCount = 0
        this._childClass = ''
        this._outerClass = ''

        this.initShadowRoot(template, MpCells.observedAttributes, () => {
            this.checkChildNode = this.checkChildNode.bind(this)
            this.cells = this.shadowRoot.querySelector('#cells')
            this.inner = this.shadowRoot.querySelector('#inner')
            this.titleDom = this.shadowRoot.querySelector('#title')
            this.footerDom = this.shadowRoot.querySelector('#footer')
            this.slotFooter = this.shadowRoot.querySelector('#slot-footer')
        })
    }

    static register() {
        customElements.define('mp-cells', MpCells)
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
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'title') {
            this.updateTitle()
        } else if (name === 'footer') {
            this.updateFooter()
        }
    }

    static get observedAttributes() {
        return ['title', 'footer', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title') || ''
    }

    get footer() {
        return this.getAttribute('footer') || ''
    }

    /**
     * 检查孩子节点
     */
    checkChildNode() {
        const cellList = this.querySelectorAll('mp-cell')
        Array.prototype.slice.call(cellList, 0).forEach((item, index) => {
            if (index === 0) item.setOuterClass('')
            else item.setOuterClass('weui-cell_wxss')
        })

        const checkboxGroupList = this.querySelectorAll('mp-checkbox-group')
        this._checkboxCount = checkboxGroupList.length
        checkboxGroupList.forEach(item => this._checkboxIsMulti = item.multi)
        this.updateInnerClass()
    }

    /**
     * 检查 mp-checkbox-group
     */
    checkCheckBoxGroup() {
        const child = this.querySelector('mp-checkbox-group')
        this._childClass = child && child.multi ? 'weui-cells_checkbox' : ''
        this.updateClass()
    }

    updateTitle() {
        const title = this.title
        this.titleDom.classList.toggle('hide', !title)
        this.titleDom.innerText = title
    }

    updateFooter() {
        const footer = this.footer
        this.footerDom.classList.toggle('hide', !footer)
        this.slotFooter.classList.toggle('hide', !!footer)

        this.footerDom.innerText = footer
    }

    updateClass() {
        this.cells.className = `${this.extClass} weui-cells__group ${this._outerClass} ${this._childClass}`
    }

    updateInnerClass() {
        this.inner.className = `weui-cells weui-cells_after-title ${this._checkboxCount > 0 && this._checkboxIsMulti ? 'weui-cells_checkbox' : ''}`
    }

    setCellMulti(multi) {
        this._checkboxIsMulti = multi
        this.updateInnerClass()
    }

    setOuterClass(className) {
        this._outerClass = className
        className.split(/\s+/ig).forEach(item => {
            if (item) this.classList.toggle(item, true)
        })
        this.updateClass()
    }
}
