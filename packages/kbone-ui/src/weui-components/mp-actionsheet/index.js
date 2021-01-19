import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpActionsheet extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpActionsheet.observedAttributes, () => {
            this.onClose = this.onClose.bind(this)
            this.onGroupsTap = this.onGroupsTap.bind(this)
            this.maskDom = this.shadowRoot.querySelector('.weui-mask')
            this.actionsheet = this.shadowRoot.querySelector('.weui-actionsheet')
            this.titleDom = this.shadowRoot.querySelector('.weui-actionsheet__title')
            this.titleInner = this.titleDom.querySelector('.weui-actionsheet__title-text')
            this.slotTitle = this.shadowRoot.querySelector('#slot-title')
            this.groupsCnt = this.shadowRoot.querySelector('#groups')
            this.cancelDom = this.shadowRoot.querySelector('.weui-actionsheet__action.cancel')
            this.cancelInner = this.cancelDom.querySelector('.weui-actionsheet__cell')
        })
    }

    static register() {
        customElements.define('mp-actionsheet', MpActionsheet)
    }

    connectedCallback() {
        super.connectedCallback()

        this.maskDom.addEventListener('tap', this.onClose)
        this.groupsCnt.addEventListener('tap', this.onGroupsTap)
        this.cancelInner.addEventListener('tap', this.onClose)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.maskDom.removeEventListener('tap', this.onClose)
        this.groupsCnt.removeEventListener('tap', this.onGroupsTap)
        this.cancelInner.addEventListener('tap', this.onClose)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.updateClass()
        } else if (name === 'title') {
            const title = this.title
            this.titleDom.classList.toggle('hide', !title)
            this.slotTitle.classList.toggle('hide', !!title)
            if (title) this.titleInner.innerText = title
        } else if (name === 'show-cancel') {
            this.cancelDom.classList.toggle('hide', !this.showCancel)
            this.updateGroups()
        } else if (name === 'cancel-text') {
            this.cancelInner.innerText = this.cancelText
        } else if (name === 'mask-class' || name === 'mask') {
            this.updateMask()
        } else if (name === 'show') {
            this.updateMask()
            this.updateClass()
        } else if (name === 'actions') {
            this.updateGroups()
        }
    }

    static get observedAttributes() {
        return ['title', 'show-cancel', 'cancel-text', 'mask-class', 'mask-closable', 'mask', 'show', 'actions', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get title() {
        return this.getAttribute('title')
    }

    get showCancel() {
        return this.getAttribute('show-cancel', true)
    }

    get cancelText() {
        return this.getAttribute('cancel-text')
    }

    get maskClass() {
        return this.getAttribute('mask-class') || ''
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

    get actions() {
        let value = this.getObjectValue('actions', [])
        if (value.length > 0 && typeof value[0] !== 'string' && !Array.isArray(value[0])) value = [value]
        return value
    }

    /**
     * 更新遮盖层
     */
    updateMask() {
        this.maskDom.className = `weui-mask ${this.show ? '' : 'weui-mask_hidden'} ${this.maskClass} ${this.mask ? '' : 'hide'}`
    }

    /**
     * 更新样式
     */
    updateClass() {
        this.actionsheet.className = `weui-actionsheet ${this.show ? 'weui-actionsheet_toggle' : ''} ${this.extClass}`
    }

    /**
     * 更新列表
     */
    updateGroups() {
        const actions = this.actions
        if (actions.length) {
            const showCancel = this.showCancel
            this.groupsCnt.innerHTML = actions.map((item, index) => {
                const inner = typeof item !== 'string' ? item.map((subItem, subIndex) => `<wx-view
                        class="weui-actionsheet__cell ${subItem.type === 'warn' ? 'weui-actionsheet__cell_warn' : ''}"
                        hover-class="weui-active"
                        data-groupindex="${index}"
                        data-index="${subIndex}" 
                        data-value="${subItem.value}"
                    >${subItem.text}</wx-view>`).join('') : `<slot name="${item}"></slot>`
                return `<div class="${!showCancel && index === actions.length - 1 ? 'weui-actionsheet__action' : 'weui-actionsheet__menu'}">${inner}</div>`
            }).join('')
        } else {
            this.groupsCnt.innerHTML = ''
        }
    }

    /**
     * 监听选项点击
     */
    onGroupsTap(evt) {
        const actionDom = findParent(evt.target, node => node.classList && node.classList.contains('weui-actionsheet__cell'))
        if (actionDom) {
            const index = +actionDom.dataset.index
            const groupindex = +actionDom.dataset.groupindex
            const value = +actionDom.dataset.value

            this.dispatchEvent(new CustomEvent('actiontap', {bubbles: true, cancelable: true, detail: {index, groupindex, value}}))
        }
    }

    /**
     * 监听关闭
     */
    onClose(evt) {
        const type = evt.currentTarget.dataset
        if (this.maskClosable || type) {
            this.show = false
            this.dispatchEvent(new CustomEvent('close', {bubbles: true, cancelable: true}))
        }
    }
}
