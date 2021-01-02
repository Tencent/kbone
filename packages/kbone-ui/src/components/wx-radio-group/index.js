import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxRadioGroup extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxRadioGroup.observedAttributes)
    }

    static register() {
        customElements.define('wx-radio-group', WxRadioGroup)
    }

    connectedCallback() {
        super.connectedCallback()

        this._selectedItem = null
        this._value = ''
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this._selectedItem = null
        this._value = ''
    }

    get value() {
        return this._value
    }

    /**
     * 增加 checkbox
     */
    addItem(item) {
        if (item.checked) {
            if (this._selectedItem) this._selectedItem.checked = false
            this._value = item.value
            this._selectedItem = item
        }
    }

    /**
     * 删除 checkbox
     */
    removeItem(item) {
        if (this._selectedItem === item) {
            this._selectedItem = null
            this._value = ''
        }
    }

    /**
     * 更新 checkbox 的 value
     */
    renameItem(item, oldValue, newValue) {
        if (this._selectedItem === item) this._value = newValue
    }

    /**
     * 监听 checkbox 的更新
     */
    onItemChange(item) {
        if (this._selectedItem === item) this.removeItem(item)
        else this.addItem(item)
    }
}
