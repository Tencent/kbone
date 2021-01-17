import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxLabel extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxLabel.observedAttributes)
    }

    static register() {
        customElements.define('wx-label', WxLabel)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('tap', this.onTap)
    }

    static get observedAttributes() {
        return ['for', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get for() {
        return this.getAttribute('for')
    }

    /**
     * 监听点击事件
     */
    onTap(evt) {
        // 已经被底层组件处理过，就不再处理
        if (evt._isProcessed) return
        evt._isProcessed = true

        if (evt.detail.source === 'label') return

        let relatedNode
        if (this.for) {
            relatedNode = document.getElementById(this.for)
        } else {
            relatedNode = this.querySelector('wx-button')
            if (!relatedNode) relatedNode = this.querySelector('wx-checkbox')
            if (!relatedNode) relatedNode = this.querySelector('wx-radio')
            if (!relatedNode) relatedNode = this.querySelector('wx-switch')
        }

        if (!relatedNode) return

        const customEvt = new CustomEvent('tap', {
            bubbles: false,
            cancelable: true,
            detail: Object.assign({source: 'label'}, evt.detail)
        })
        if (relatedNode.tagName === 'WX-BUTTON') {
            const targets = document.elementsFromPoint(evt.detail.clientX, evt.detail.clientY)
            if (targets && targets.indexOf(relatedNode) === -1) {
                // 如果 tap 事件不是从 wx-button 触发出来
                relatedNode.dispatchEvent(customEvt)
            }
        } else if (relatedNode.tagName === 'WX-CHECKBOX' || relatedNode.tagName === 'WX-RADIO') {
            relatedNode.onTap(customEvt)
        } else if (relatedNode.tagName === 'WX-SWITCH') {
            relatedNode.onInputTap(customEvt)
        }
    }
}
