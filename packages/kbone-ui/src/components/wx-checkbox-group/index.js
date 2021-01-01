import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxCheckboxGroup extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCheckboxGroup.observedAttributes)
    }

    static register() {
        customElements.define('wx-checkbox-group', WxCheckboxGroup)
    }

    connectedCallback() {
        super.connectedCallback()

        this._value = []
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this._value = null
    }

    get value() {
        return this._value
    }

    /**
     * 增加 checkbox
     */
    addItem(item) {
        if (item.checked) {
            this._value.push(item.value)
        }
    }

    /**
     * 删除 checkbox
     */
    removeItem(item) {
        if (item.checked) {
            const index = this._value.indexOf(item.value)
            if (index >= 0) this._value.splice(index, 1)
        }
    }

    /**
     * 更新 checkbox 的 value
     */
    renameItem(item, oldValue, newValue) {
        if (item.checked) {
            const index = this._value.indexOf(oldValue)
            if (index >= 0) this._value[index] = newValue
        }
    }

    /**
     * 监听 checkbox 的更新
     */
    onItemChange(item) {
        if (item.checked) {
            this._value.push(item.value)
        } else {
            const index = this._value.indexOf(item.value)
            if (index >= 0) this._value.splice(index, 1)
        }
    }
}
