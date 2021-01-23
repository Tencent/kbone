import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpCheckboxGroup extends WeuiBase {
    constructor() {
        super()

        this._targetList = []

        this.initShadowRoot(template, MpCheckboxGroup.observedAttributes, () => {
            this.onChange = this.onChange.bind(this)
            this.checkChildNode = this.checkChildNode.bind(this)
            this.group = this.shadowRoot.querySelector('#group')
        })
    }

    static register() {
        customElements.define('mp-checkbox-group', MpCheckboxGroup)
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

        this._parent = findParent(this, node => node.tagName === 'MP-CELLS')
        this.checkChildNode()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null

        this._parent = null
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.group.className = this.extClass
        } else if (name === 'multi') {
            const multi = this.multi
            this._targetList.forEach(item => item.multi = multi)
            if (this._parent) this._parent.setCellMulti(multi)
        }
    }

    static get observedAttributes() {
        return ['multi', 'prop', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get multi() {
        return this.getBoolValue('multi', true)
    }

    get prop() {
        return this.getAttribute('prop') || ''
    }

    /**
     * 监听 change 事件
     */
    onChange(target) {
        if (this.multi) {
            const value = []
            this._targetList.forEach(item => {
                if (item.checked) value.push(item.value)
            })
            this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value}}))
        } else {
            let value = ''
            this._targetList.forEach(item => {
                if (item === target) value = item.value
                else item.checked = false
            })
            this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value}}))
        }
    }

    /**
     * 检查 mp-checkbox
     */
    checkChildNode() {
        const childList = Array.prototype.slice.call(this.querySelectorAll('mp-checkbox'))
        const multi = this.multi
        childList.forEach((item, index) => {
            if (index === 0) item.setOuterClass('')
            else item.setOuterClass('weui-cell_wxss')

            item.multi = multi
        })

        this._targetList = childList
    }
}
