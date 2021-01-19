import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpDialog extends WeuiBase {
    constructor() {
        super()

        this._buttons = []

        this.initShadowRoot(template, MpDialog.observedAttributes, () => {
            this.onButtonTap = this.onButtonTap.bind(this)
            this.onClose = this.onClose.bind(this)
            this.stopEvent = this.stopEvent.bind(this)
            this.maskDom = this.shadowRoot.querySelector('.weui-mask')
            this.dialog = this.shadowRoot.querySelector('.weui-dialog__wrp')
            this.dialogInner = this.shadowRoot.querySelector('.weui-dialog')
            this.titleDom = this.shadowRoot.querySelector('.weui-dialog__title span')
            this.slotTitle = this.shadowRoot.querySelector('#slot-title')
            this.footer = this.shadowRoot.querySelector('#footer')
            this.slotFooter = this.shadowRoot.querySelector('#slot-footer')
        })
    }

    static register() {
        customElements.define('mp-dialog', MpDialog)
    }

    connectedCallback() {
        super.connectedCallback()

        this.maskDom.addEventListener('tap', this.onClose)
        this.dialog.addEventListener('tap', this.onClose)
        this.dialogInner.addEventListener('tap', this.stopEvent)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.maskDom.removeEventListener('tap', this.onClose)
        this.dialog.removeEventListener('tap', this.onClose)
        this.dialogInner.removeEventListener('tap', this.stopEvent)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            const hasHide = this.dialog.classList.contains('hide')
            this.dialog.className = `weui-dialog__wrp ${this.extClass} ${hasHide ? 'hide' : ''}`
        } else if (name === 'title') {
            const title = this.title
            this.titleDom.classList.toggle('hide', !title)
            this.slotTitle.classList.toggle('hide', !!title)
            if (title) this.titleDom.innerText = title
        } else if (name === 'buttons') {
            const buttons = this.buttons
            if (buttons && buttons.length) {
                this.footer.classList.toggle('hide', false)
                this.slotFooter.classList.toggle('hide', true)

                if (buttons.length === 1) {
                    buttons[0].className = 'weui-dialog__btn_primary'
                } else {
                    buttons.forEach((item, index) => {
                        if (index === 0) item.className = 'weui-dialog__btn_default'
                        else item.className = 'weui-dialog__btn_primary'
                    })
                }

                const documentFragment = document.createDocumentFragment()
                buttons.forEach((item, index) => {
                    const wxView = document.createElement('wx-view')
                    wxView.dataset.index = index
                    if (item.text) wxView.innerText = item.text
                    wxView.setAttribute('hover-class', 'weui-active')
                    wxView.className = `weui-dialog__btn ${item.className || ''} ${item.extClass || ''}`
                    wxView.addEventListener('tap', this.onButtonTap)
                    documentFragment.appendChild(wxView)
                })
                this.footer.innerHTML = ''
                this.footer.appendChild(documentFragment)
                this._buttons = buttons
            } else {
                this.footer.classList.toggle('hide', true)
                this.slotFooter.classList.toggle('hide', false)
            }
        } else if (name === 'mask') {
            this.maskDom.classList.toggle('hide', !this.mask)
        } else if (name === 'show') {
            const show = this.show
            this.maskDom.classList.toggle('weui-mask_hidden', !show)
            this.dialog.classList.toggle('hide', !show)
        }
    }

    static get observedAttributes() {
        return ['title', 'buttons', 'mask', 'mask-closable', 'show', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title')
    }

    get buttons() {
        return this.getObjectValue('buttons')
    }

    get mask() {
        return this.getBoolValue('mask', true)
    }

    get maskClosable() {
        return this.getBoolValue('mask-closable', true)
    }

    get show() {
        return this.getBoolValue('show')
    }

    set show(value) {
        this.setAttribute('show', value)
    }

    /**
     * 监听按钮点击
     */
    onButtonTap(evt) {
        const {index} = evt.currentTarget.dataset
        this.dispatchEvent(new CustomEvent('buttontap', {bubbles: true, cancelable: true, detail: {index, item: this._buttons[index]}}))
    }

    /**
     * 监听关闭
     */
    onClose() {
        if (!this.maskClosable) return
        this.show = false
        this.dispatchEvent(new CustomEvent('close', {bubbles: true, cancelable: true}))
    }

    /**
     * 阻止事件冒泡
     */
    stopEvent(evt) {
        evt.stopPropagation()
    }
}
