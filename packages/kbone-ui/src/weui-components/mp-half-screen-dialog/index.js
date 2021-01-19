import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpHalfScreenDialog extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpHalfScreenDialog.observedAttributes, () => {
            this.onClose = this.onClose.bind(this)
            this.onButtonTap = this.onButtonTap.bind(this)
            this.cnt = this.shadowRoot.querySelector('#cnt')
            this.maskDom = this.shadowRoot.querySelector('.weui-mask')
            this.dialog = this.shadowRoot.querySelector('.weui-half-screen-dialog')
            this.closeDom = this.shadowRoot.querySelector('.weui-half-screen-dialog__hd__side')
            this.titleDom = this.shadowRoot.querySelector('.weui-half-screen-dialog__title.default')
            this.subTitleDom = this.shadowRoot.querySelector('.weui-half-screen-dialog__subtitle.default')
            this.slotTitle = this.shadowRoot.querySelector('.weui-half-screen-dialog__title.slot')
            this.descDom = this.shadowRoot.querySelector('.weui-half-screen-dialog__desc')
            this.tipsDom = this.shadowRoot.querySelector('.weui-half-screen-dialog__tips')
            this.slotDesc = this.shadowRoot.querySelector('#slot-desc')
            this.footerDom = this.shadowRoot.querySelector('#footer')
            this.slotFooter = this.shadowRoot.querySelector('#slot-footer')
        })
    }

    static register() {
        customElements.define('mp-half-screen-dialog', MpHalfScreenDialog)
    }

    connectedCallback() {
        super.connectedCallback()

        this.maskDom.addEventListener('tap', this.onClose)
        this.maskDom.addEventListener('touchmove', this.stopEvent)
        this.closeDom.addEventListener('tap', this.onClose)
        this.footerDom.addEventListener('tap', this.onButtonTap)

        this.updateTitle()
        this.updateDesc()
        this.updateButtons()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.maskDom.removeEventListener('tap', this.onClose)
        this.maskDom.removeEventListener('touchmove', this.stopEvent)
        this.closeDom.removeEventListener('tap', this.onClose)
        this.footerDom.removeEventListener('tap', this.onButtonTap)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            const extClass = this.extClass
            this.dialog.className = `weui-half-screen-dialog ${extClass}`
        } else if (name === 'closabled') {
            this.closeDom.classList.toggle('hide', !this.closabled)
        } else if (name === 'title') {
            this.updateTitle()
        } else if (name === 'sub-title') {
            this.subTitleDom.innerText = this.subTitle
        } else if (name === 'desc') {
            this.updateDesc()
        } else if (name === 'tips') {
            this.tipsDom.innerText = this.tips
        } else if (name === 'mask') {
            this.maskDom.classList.toggle('hide', !this.mask)
        } else if (name === 'show') {
            this.cnt.className = this.show ? 'weui-show' : 'weui-hidden'
        } else if (name === 'buttons') {
            this.updateButtons()
        }
    }

    static get observedAttributes() {
        return ['closabled', 'title', 'sub-title', 'desc', 'tips', 'mask-closable', 'mask', 'show', 'buttons', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get closabled() {
        return this.getBoolValue('closabled', true)
    }

    get title() {
        return this.getAttribute('title')
    }

    get subTitle() {
        return this.getAttribute('sub-title')
    }

    get desc() {
        return this.getAttribute('desc')
    }

    get tips() {
        return this.getAttribute('tips')
    }

    get maskClosable() {
        return this.getBoolValue('mask-closable', true)
    }

    get mask() {
        return this.getBoolValue('mask', true)
    }

    get show() {
        return this.getBoolValue('show')
    }

    set show(value) {
        this.setAttribute('show', value)
    }

    get buttons() {
        return this.getObjectValue('buttons', [])
    }

    /**
     * 更新标题
     */
    updateTitle() {
        const title = this.title
        if (title) {
            this.titleDom.classList.toggle('hide', false)
            this.subTitleDom.classList.toggle('hide', false)
            this.slotTitle.classList.toggle('hide', true)
            this.titleDom.innerText = title
            this.subTitleDom.innerText = this.subTitle
        } else {
            this.titleDom.classList.toggle('hide', true)
            this.subTitleDom.classList.toggle('hide', true)
            this.slotTitle.classList.toggle('hide', false)
        }
    }

    /**
     * 更新描述
     */
    updateDesc() {
        const desc = this.desc
        if (desc) {
            this.descDom.classList.toggle('hide', false)
            this.tipsDom.classList.toggle('hide', false)
            this.slotDesc.classList.toggle('hide', true)
            this.descDom.innerText = desc
            this.tipsDom.innerText = this.tips
        } else {
            this.descDom.classList.toggle('hide', true)
            this.tipsDom.classList.toggle('hide', true)
            this.slotDesc.classList.toggle('hide', false)
        }
    }

    /**
     * 更新按钮
     */
    updateButtons() {
        const buttons = this.buttons
        if (buttons.length) {
            this.footerDom.innerHTML = buttons.map((item, index) => `<wx-button type="${item.type}" class="weui-btn weui-btn_${item.type} ${item.className}" data-index="${index}">${item.text}</wx-button>`).join('')

            this.footerDom.classList.toggle('hide', false)
            this.slotFooter.classList.toggle('hide', true)
        } else {
            this.footerDom.classList.toggle('hide', true)
            this.slotFooter.classList.toggle('hide', false)

            setTimeout(() => {
                const slotFooterDom = this.querySelector('[slot=footer]')
                if (slotFooterDom) slotFooterDom.classList.toggle('weui-half-screen-dialog__ft', true)
            }, 0)
        }
    }

    /**
     * 监听按钮点击
     */
    onButtonTap(evt) {
        const button = findParent(evt.target, node => node.tagName === 'WX-BUTTON')
        if (button) {
            const index = +button.dataset.index
            const item = this.buttons[index]

            this.dispatchEvent(new CustomEvent('buttontap', {bubbles: true, cancelable: true, detail: {index, item}}))
        }
    }

    /**
     * 监听关闭
     */
    onClose(evt) {
        const type = evt.currentTarget.dataset.type
        if (this.maskClosable || type === 'close') {
            this.show = false

            this.dispatchEvent(new CustomEvent('close', {bubbles: true, cancelable: true}))
        }
    }

    /**
     * 阻止事件冒泡
     */
    stopEvent(evt) {
        evt.stopPropagation()
    }
}
