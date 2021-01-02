import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxPickerView extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxPickerView.observedAttributes, () => {
            this._columns = []
        })
    }

    static register() {
        customElements.define('wx-picker-view', WxPickerView)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                let list = []
                if (mutation.addedNodes && mutation.addedNodes.length) list = list.concat(Array.prototype.slice.call(mutation.addedNodes, 0))
                if (mutation.removedNodes && mutation.removedNodes.length) list = list.concat(Array.prototype.slice.call(mutation.removedNodes, 0))
                if (list.length) {
                    const wxPickerViewColumnList = list.filter(node => node.tagName === 'WX-PICKER-VIEW-COLUMN')
                    if (wxPickerViewColumnList.length) this.updateColumns()
                }
            })
        })
        this._observer.observe(this, {
            childList: true,
            subtree: true,
        })

        this.initColumns()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && name === 'value') {
            this._columns.forEach((column, index) => {
                column.setCurrent(this.value[index] || 0)
                column.update()
            })
        }
    }

    static get observedAttributes() {
        return ['value', 'indicator-style', 'indicator-class', 'mask-style', 'mask-class', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get value() {
        return this.getObjectValue('value', [])
    }

    get indicatorStyle() {
        return this.getAttribute('indicator-style')
    }

    get indicatorClass() {
        return this.getAttribute('indicator-class')
    }

    get maskStyle() {
        return this.getAttribute('mask-style')
    }

    get maskClass() {
        return this.getAttribute('mask-class')
    }

    /**
     * 初始化 wx-picker-view-column
     */
    initColumns() {
        this._columns = Array.prototype.slice.call(this.querySelectorAll('wx-picker-view-column'), 0)
        this._height = this.offsetHeight
    }

    /**
     * 更新 wx-picker-view-column
     */
    updateColumns() {
        this._columns = Array.prototype.slice.call(this.querySelectorAll('wx-picker-view-column'), 0)
        if (!this._columns.length) return

        const hasChanged = this._columns.some(column => column._height !== column.offsetHeight)
        if (!hasChanged && this._height === this.offsetHeight || this.offsetHeight === 0) {
            this._height = this.offsetHeight
            return
        }

        this._height = this.offsetHeight
        this._columns.forEach(column => {
            column.setHeight(this._height)
            column.update()
        })
    }

    /**
     * 监听 wx-picker-view-column 的更新
     */
    onColumnUpdate(column) {
        const index = this._columns.indexOf(column)
        if (index === -1) return

        column.setStyle(this.indicatorStyle, this.maskStyle)
        column.setClass(this.indicatorClass, this.maskClass)
        column.setHeight(this._height)
        column.setCurrent(this.value[index] || 0)
        column.init()

        column.setCurrent(this.value[index] || 0)
        column.update()
    }

    /**
     * 监听 wx-picker-view-column 的孩子更新
     */
    onColumnChildrenUpdate(column) {
        const index = this._columns.indexOf(column)
        if (index === -1) return

        column.setCurrent(this.value[index] || 0)
        column.update()
    }

    /**
     * 监听 wx-picker-view-column 的 value 变化
     */
    onColumnValueChanged() {
        const value = this._columns.map(column => column._current || 0)
        this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {value}}))
    }

    /**
     * 监听 wx-picker-view-column 的 value 变化开始
     */
    onColumnValueChangeStart() {
        this.dispatchEvent(new CustomEvent('pickstart', {bubbles: true, cancelable: true}))
    }

    /**
     * 监听 wx-picker-view-column 的 value 变化结束
     */
    onColumnValueChangeEnd() {
        this.dispatchEvent(new CustomEvent('pickend', {bubbles: true, cancelable: true}))
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue() {
        return this._columns.map(column => column._current || 0)
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        this.setAttribute('value', '[]')
    }
}
