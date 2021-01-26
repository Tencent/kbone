import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpCell extends WeuiBase {
    constructor() {
        super()

        this._outerClass = ''

        this.initShadowRoot(template, MpCell.observedAttributes, () => {
            this.cell = this.shadowRoot.querySelector('#cell')
            this.headerCnt = this.shadowRoot.querySelector('.weui-cell__hd')
            this.iconDom = this.shadowRoot.querySelector('#icon')
            this.slotIcon = this.shadowRoot.querySelector('#slot-icon')
            this.titleForm = this.shadowRoot.querySelector('#title-form')
            this.titleDom = this.shadowRoot.querySelector('#title')
            this.slotTitle = this.shadowRoot.querySelector('#slot-title')
            this.valueDom = this.shadowRoot.querySelector('#value')
            this.slotValue = this.shadowRoot.querySelector('#slot-value')
            this.footerCnt = this.shadowRoot.querySelector('#footer-cnt')
            this.footerDom = this.shadowRoot.querySelector('#footer')
            this.slotFooter = this.shadowRoot.querySelector('#slot-footer')

            this.errorDom = this.shadowRoot.querySelector('#error')

            this.onTap = this.onTap.bind(this)
        })
    }

    static register() {
        customElements.define('mp-cell', MpCell)
    }

    connectedCallback() {
        super.connectedCallback()

        this.cell.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.cell.removeEventListener('tap', this.onTap)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'icon') {
            const icon = this.icon
            if (icon) this.iconDom.setAttribute('src', icon)
            this.iconDom.classList.toggle('hide', !icon)
            this.slotIcon.classList.toggle('hide', !!icon)
        } else if (name === 'title') {
            this.updateTitle()
        } else if (name === 'hover') {
            if (this.hover) {
                this.cell.setAttribute('hover-class', 'weui-cell_active weui-active')
            } else {
                this.cell.setAttribute('hover-class', '')
            }
        } else if (name === 'link') {
            this.updateClass()
            this.updateForLink()
        } else if (name === 'value') {
            this.updateValue()
        } else if (name === 'show-error') {
            this.updateClass()
            this.updateError()
        } else if (name === 'footer') {
            this.updateFooter()
        } else if (name === 'inline') {
            this.updateClass()
        } else if (name === 'has-header') {
            this.headerCnt.classList.toggle('hide', !this.hasHeader)
        }
    }

    static get observedAttributes() {
        return ['icon', 'title', 'hover', 'link', 'value', 'show-error', 'prop', 'footer', 'inline', 'has-header', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get icon() {
        return this.getAttribute('icon')
    }

    get title() {
        return this.getAttribute('title') || ''
    }

    get hover() {
        return this.getBoolValue('hover')
    }

    get link() {
        return this.getBoolValue('link')
    }

    get value() {
        return this.getAttribute('value') || ''
    }

    get showError() {
        return this.getBoolValue('show-error')
    }

    get prop() {
        return this.getAttribute('prop')
    }

    get footer() {
        return this.getAttribute('footer') || ''
    }

    get inline() {
        return this.getBoolValue('inline', true)
    }

    get hasHeader() {
        return this.getBoolValue('has-header', true)
    }

    updateClass() {
        const extClass = this.extClass || ''
        this.cell.className = `weui-cell ${this.link ? 'weui-cell_access' : ''} ${this.showError && this._error ? 'weui-cell_warn' : ''} ${this._inForm ? 'weui-cell-inform' : ''} ${extClass} ${this._outerClass} ${this.inline ? '' : 'weui-cell_label-block'} ${this._setInGroupForm ? 'in-group-form' : ''}`

        // 给当前 dom 也加上 extClass
        const extClassList = extClass.trim().split(/\s+/ig).filter(item => !!item)
        if (this._extClassList && this._extClassList.length) {
            this._extClassList.forEach(item => {
                // 删掉不需要的 extClass
                if (extClassList.indexOf(item) === -1) this.classList.toggle(item, false)
            })
        }
        if (extClassList.length) extClassList.forEach(item => this.classList.toggle(item, true))
        this._extClassList = extClassList
    }

    updateForLink() {
        const link = this.link
        this.footerCnt.className = `weui-cell__ft ${link ? 'weui-cell__ft_in-access' : ''}`
        this.updateError()
    }

    updateTitle() {
        const inForm = this._inForm
        const title = this.title
        this.titleForm.classList.toggle('hide', !inForm || !title)
        this.titleDom.classList.toggle('hide', inForm || !title)
        this.slotTitle.classList.toggle('hide', !!title)

        this.titleForm.innerText = title
        this.titleDom.innerText = title
    }

    updateValue() {
        const value = this.value
        this.valueDom.classList.toggle('hide', !value)
        this.slotValue.classList.toggle('hide', !!value)

        this.valueDom.innerText = value
    }

    updateFooter() {
        const footer = this.footer
        this.footerDom.classList.toggle('hide', !footer)
        this.slotFooter.classList.toggle('hide', !!footer)

        this.footerDom.innerText = footer
    }

    updateError() {
        this.errorDom.classList.toggle('hide', !this.showError || !this._error || this.link)
    }

    setError(error) {
        this._error = error || false
        this.updateClass()
        this.updateError()
    }

    setInForm() {
        this._inForm = true
        this.updateClass()
        this.updateTitle()
    }

    /**
     * 提供给外部设置样式的接口
     */
    setOuterClass(className) {
        this._outerClass = className
        className.split(/\s+/ig).forEach(item => {
            if (item) this.classList.toggle(item, true)
        })
        this.updateClass()
    }

    setInGroupForm(isInGroupForm) {
        this._setInGroupForm = isInGroupForm
        this.updateClass()
    }

    onTap() {
        const url = this.url
        const link = this.link
        if (url && link) {
            window.open(url)
            this.dispatchEvent(new CustomEvent('navigatesuccess', {bubbles: true, cancelable: true}))
        }
    }
}
