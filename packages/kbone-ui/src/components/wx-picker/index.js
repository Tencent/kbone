import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import dialogTpl from './dialog.html'
import dialogStyle from './dialog.less'
import regionJson from './region.json'
import {
    formatTime,
    isEqual,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

const DAY_NUM = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * 过滤日期
 */
function filterDate(date) {
    const splitRes = date.split('-').map(item => +item || 0)
    if (splitRes.length === 3) return [splitRes[0] - 1900, splitRes[1] - 1, splitRes[2] - 1]
    if (splitRes.length === 2) return [splitRes[0] - 1900, splitRes[1] - 1]
    if (splitRes.length === 1) return [splitRes[0] - 1900]
    return []
}

export default class WxPicker extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxPicker.observedAttributes, () => {
            this.onWrapperTap = this.onWrapperTap.bind(this)
            this.onCancel = this.onCancel.bind(this)
            this.onConfirm = this.onConfirm.bind(this)
            this.onPickerViewChange = this.onPickerViewChange.bind(this)
            this.wrapper = this.shadowRoot.querySelector('#wrapper')

            // 构造弹框
            this.dialog = document.createElement('div')
            this.dialog.className = 'wx-picker-dialog wx-picker-dialog-out'
            this.dialog.innerHTML = `<style>${dialogStyle}</style>${dialogTpl}`
            this.mask = this.dialog.querySelector('.wx-picker-dialog-mask')
            this.titleDiv = this.dialog.querySelector('.wx-picker-dialog-title')
            this.cancelBtn = this.dialog.querySelector('.wx-picker-dialog-cancel')
            this.confirmBtn = this.dialog.querySelector('.wx-picker-dialog-confirm')
            this.pickerView = this.dialog.querySelector('wx-picker-view')
        })
    }

    static register() {
        customElements.define('wx-picker', WxPicker)
    }

    connectedCallback() {
        super.connectedCallback()

        this.wrapper.addEventListener('tap', this.onWrapperTap)
        this.mask.addEventListener('click', this.onCancel)
        this.cancelBtn.addEventListener('click', this.onCancel)
        this.confirmBtn.addEventListener('click', this.onConfirm)
        this.pickerView.addEventListener('change', this.onPickerViewChange)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.wrapper.removeEventListener('tap', this.onWrapperTap)
        this.mask.removeEventListener('click', this.onCancel)
        this.cancelBtn.removeEventListener('click', this.onCancel)
        this.confirmBtn.removeEventListener('click', this.onConfirm)
        this.pickerView.removeEventListener('change', this.onPickerViewChange)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'header-text') {
            this.titleDiv.innerText = this.headerText
        } else if (name === 'mode' || name === 'fields' || name === 'custom-item') {
            const mode = this.mode
            if (mode === 'time') {
                this.adjustPickerViewColumn(2)

                const hour = []
                const minute = []
                for (let i = 0; i < 24; i++) hour.push(`<div class="wx-picker-dialog-item">${(i < 10 ? '0' : '') + i}</div>`)
                for (let i = 0; i < 60; i++) minute.push(`<div class="wx-picker-dialog-item">${(i < 10 ? '0' : '') + i}</div>`)
                this.pickerView.children[0].innerHTML = hour.join('')
                this.pickerView.children[1].innerHTML = minute.join('')
            } else if (mode === 'date') {
                const fields = this.fields
                const len = fields === 'year' ? 1 : fields === 'month' ? 2 : 3
                this.adjustPickerViewColumn(len)

                const year = []
                const month = []
                const day = []
                for (let i = 0; i < 200; i++) year.push(`<div class="wx-picker-dialog-item">${i + 1900}年</div>`)
                this.pickerView.children[0].innerHTML = year.join('')
                if (fields === 'month' || fields === 'day') {
                    for (let i = 0; i < 12; i++) month.push(`<div class="wx-picker-dialog-item">${i + 1}月</div>`)
                    this.pickerView.children[1].innerHTML = month.join('')
                }
                if (fields === 'day') {
                    for (let i = 0; i < 31; i++) day.push(`<div class="wx-picker-dialog-item">${i + 1}日</div>`)
                    this.pickerView.children[2].innerHTML = day.join('')
                }
            } else if (mode === 'region') {
                this.adjustPickerViewColumn(3)
                const customItem = this.customItem
                if (customItem && !this._hasInitCustomItem) {
                    // 自定义第一项
                    this._regionJson.unshift([customItem, []])
                    this._regionJson.forEach(item1 => {
                        item1[1].unshift([customItem, []])
                        item1[1].forEach(item2 => {
                            item2[1].unshift(customItem)
                        })
                    })
                    this._hasInitCustomItem = true
                }

                const list1 = []
                const list2 = []
                const list3 = []
                this._regionJson.forEach(item => list1.push(`<div class="wx-picker-dialog-item">${item[0]}</div>`))
                this._regionJson[0][1].forEach(item => list2.push(`<div class="wx-picker-dialog-item">${item[0]}</div>`))
                this._regionJson[0][1][0][1].forEach(item => list3.push(`<div class="wx-picker-dialog-item">${item}</div>`))
                this.pickerView.children[0].innerHTML = list1.join('')
                this.pickerView.children[1].innerHTML = list2.join('')
                this.pickerView.children[2].innerHTML = list3.join('')
            }
        } else if (name === 'range' || name === 'range-key') {
            const mode = this.mode
            if (mode === 'selector') {
                const range = this.range
                const oldRange = this.filterObjectValue(oldValue, [])
                const rangeKey = this.rangeKey
                let filterRange
                let filterOldRange
                if (rangeKey) {
                    filterRange = range.map(item => item[rangeKey])
                    filterOldRange = oldRange.map(item => item[rangeKey])
                } else {
                    filterRange = range
                    filterOldRange = oldRange
                }

                this.adjustPickerViewColumn(1)
                if (!isEqual(filterRange, filterOldRange)) this.pickerView.children[0].innerHTML = filterRange.map(item => `<div class="wx-picker-dialog-item">${item}</div>`).join('')
            } else if (mode === 'multiSelector') {
                const range = this.range
                const oldRange = this.filterObjectValue(oldValue, [])
                const rangeKey = this.rangeKey
                let filterRange
                let filterOldRange
                if (rangeKey) {
                    filterRange = range.map(item => item.map(subItem => subItem[rangeKey]))
                    filterOldRange = oldRange.map(item => item.map(subItem => subItem[rangeKey]))
                } else {
                    filterRange = range
                    filterOldRange = oldRange
                }

                this.adjustPickerViewColumn(filterRange.length)
                filterRange.forEach((item, index) => {
                    if (isEqual(item, filterOldRange[index])) return
                    this.pickerView.children[index].innerHTML = item.map(subItem => `<div class="wx-picker-dialog-item">${subItem}</div>`).join('')
                })
            }
        } else if (name === 'start' || name === 'end') {
            const mode = this.mode
            if (mode === 'time') {
                this._start = this._end = null
                if (this.start) this._start = this.start.split(':').map(item => +item || 0)
                if (this.end) this._end = this.end.split(':').map(item => +item || 0)
            } else if (mode === 'date') {
                this._start = this._end = null
                if (this.start) this._start = filterDate(this.start)
                if (this.end) this._end = filterDate(this.end)
            }
        }
    }

    static get observedAttributes() {
        return ['header-text', 'mode', 'disabled', 'range', 'range-key', 'value', 'start', 'end', 'fields', 'custom-item', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get headerText() {
        return this.getAttribute('header-text') || ''
    }

    get mode() {
        return this.getAttribute('mode') || 'selector'
    }

    get disabled() {
        return this.getBoolValue('disabled')
    }

    get range() {
        return this.getObjectValue('range', [])
    }

    get rangeKey() {
        return this.getAttribute('range-key')
    }

    get value() {
        const mode = this.mode
        if (mode === 'selector') return this.getNumberValue('value')
        else if (mode === 'multiSelector') return this.getObjectValue('value', [])
        else if (mode === 'time') return this.getAttribute('value')
        else if (mode === 'date') {
            const fields = this.fields
            const value = this.getAttribute('value')
            if (fields === 'year') return value || formatTime(new Date(), 'yyyy')
            else if (fields === 'month') return value || formatTime(new Date(), 'yyyy-MM')
            else return value || formatTime(new Date(), 'yyyy-MM-dd')
        } else if (mode === 'region') return this.getObjectValue('value', [])
        return ''
    }

    get start() {
        return this.getAttribute('start')
    }

    get end() {
        return this.getAttribute('end')
    }

    get fields() {
        return this.getAttribute('fields') || 'day'
    }

    get customItem() {
        return this.getAttribute('custom-item')
    }

    get _regionJson() {
        if (!this.__regionJson) this.__regionJson = JSON.parse(JSON.stringify(regionJson))
        return this.__regionJson
    }

    /**
     * 调整 wx-picker-view-column 数量
     */
    adjustPickerViewColumn(len) {
        if (this.pickerView.children.length !== len || Array.prototype.some.call(this.pickerView.children, child => child.tagName !== 'WX-PICKER-VIEW-COLUMN')) {
            this.pickerView.innerHTML = ''
            for (let i = 0; i < len; i++) this.pickerView.appendChild(document.createElement('wx-picker-view-column'))
        }
    }

    /**
     * 调整日期列
     */
    adjustDateColumn(date) {
        if (this.mode === 'date' && this.fields === 'day') {
            const year = date[0] + 1900
            const month = date[1] + 1

            let num = DAY_NUM[month - 1]
            if (month === 2) {
                const isLeapYear = !(year % 100 ? year % 4 : year % 400)
                if (isLeapYear) num = 29 // 闰年
            }

            const day = []
            for (let i = 0; i < num; i++) day.push(`<div class="wx-picker-dialog-item">${i + 1}日</div>`)
            this.pickerView.children[2].innerHTML = day.join('')
        }
    }

    /**
     * 调整市、县/区列
     */
    adjustRegionColumn(value, needUpdate1 = true, needUpdate2 = true) {
        const item1 = this._regionJson.find(item => item[0] === value[0])

        if (needUpdate1) {
            const list1 = []
            item1[1].forEach(item => list1.push(`<div class="wx-picker-dialog-item">${item[0]}</div>`))
            this.pickerView.children[1].innerHTML = list1.join('')
        }
        if (needUpdate2) {
            const item2 = item1[1].find(item => item[0] === value[1])
            const list2 = []
            item2[1].forEach(item => list2.push(`<div class="wx-picker-dialog-item">${item}</div>`))
            this.pickerView.children[2].innerHTML = list2.join('')
        }
    }

    /**
     * 获取调整后时间
     */
    getLimitTime(time) {
        const timeNum = time[0] * 100 + time[1]
        if (this._start && this._start[0] * 100 + this._start[1] > timeNum) time = this._start
        if (this._end && this._end[0] * 100 + this._end[1] < timeNum) time = this._end

        return time
    }

    /**
     * 获取调整后日期
     */
    getLimitDate(date) {
        const dateNum = date[0] * 10000 + (date[1] || 0) * 100 + (date[2] || 0)
        if (this._start && this._start[0] * 10000 + (this._start[1] || 0) * 100 + (this._start[2] || 0) > dateNum) date = this._start
        if (this._end && this._end[0] * 10000 + (this._end[1] || 0) * 100 + (this._end[2] || 0) < dateNum) date = this._end

        return date
    }

    /**
     * 获取调整后省市，返回的是序号
     */
    getLimitRegion(region) {
        const index1 = this._regionJson.findIndex(item => item[0] === region[0])
        const index2 = index1 >= 0 ? this._regionJson[index1][1].findIndex(item => item[0] === region[1]) : 0
        const index3 = index2 >= 0 ? this._regionJson[index1][1][index2][1].findIndex(item => item === region[2]) : 0

        return [index1 === -1 ? 0 : index1, index2 === -1 ? 0 : index2, index3 === -1 ? 0 : index3]
    }

    /**
     * 监听标签点击
     */
    onWrapperTap() {
        if (this.disabled) return
        this._isPickerShowInit = true

        // 转化 wx-picker 的值为 wx-picker-view 的值
        const value = this.value
        const mode = this.mode
        if (mode === 'selector') this.pickerView.setAttribute('value', [value])
        else if (mode === 'multiSelector') this.pickerView.setAttribute('value', value)
        else if (mode === 'time') {
            const time = (value || this.start || '00:00').split(':').map(item => +item || 0)
            this.pickerView.setAttribute('value', this.getLimitTime(time))
        } else if (mode === 'date') {
            const date = this.getLimitDate(filterDate(value))
            this.adjustDateColumn(date)
            this.pickerView.setAttribute('value', date)
        } else if (mode === 'region') {
            this.adjustRegionColumn(value)
            this.pickerView.setAttribute('value', this.getLimitRegion(value))
        }

        this._isPickerShow = true
        document.body.appendChild(this.dialog)
        this.dialog.classList.replace('wx-picker-dialog-out', 'wx-picker-dialog-in')
        this._isPickerShowInit = false
        this._value = value
    }

    /**
     * 监听取消
     */
    onCancel() {
        this.hidePickerView()
        this.dispatchEvent(new CustomEvent('cancel', {bubbles: true, cancelable: true}))
    }

    /**
     * 监听确认
     */
    onConfirm() {
        const detail = {value: this._value === null ? this.value : this._value}
        if (this._getFormValueCb) this._getFormValueCb(detail.value)

        const mode = this.mode
        if (mode === 'multiSelector' || mode === 'region') this.setAttribute('value', detail.value)
        else this.setAttribute('value', detail.value)
        this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail}))
        this.hidePickerView()
    }

    /**
     * 隐藏 picker-view
     */
    hidePickerView() {
        this._isPickerShow = false
        const onTransitionEnd = () => {
            document.body.removeChild(this.dialog)
            this.dialog.removeEventListener('transitionend', onTransitionEnd)
        }
        this.dialog.addEventListener('transitionend', onTransitionEnd)
        this.dialog.classList.replace('wx-picker-dialog-in', 'wx-picker-dialog-out')
    }

    /**
     * 监听 wx-picker-view 相关事件
     */
    onPickerViewChange(evt) {
        // 在显示 picker-view 时会有设置 value 过程，此时直接忽略
        if (this._isPickerShowInit) return

        // 调整 wx-picker-view 返回的值为 wx-picker 的值，同时调整 wx-picker-view-column
        let value = evt.detail.value
        const mode = this.mode
        if (mode === 'selector') {
            value = value[0]
        } else if (mode === 'multiSelector') {
            const detail = {}
            const lastValue = this._value === null ? this.value : this._value
            let needTriggerEvt = false
            for (let i = 0, len = value.length; i < len; i++) {
                if (lastValue[i] !== value[i]) {
                    detail.value = value[i]
                    detail.column = i
                    needTriggerEvt = true
                    break
                }
            }
            if (needTriggerEvt) this.dispatchEvent(new CustomEvent('columnchange', {bubbles: true, cancelable: true, detail}))
        } else if (mode === 'time') {
            const time = this.getLimitTime(value)
            if (!isEqual(time, value)) this.pickerView.setAttribute('value', time)
            value = `${(time[0] < 10 ? '0' : '') + time[0]}:${(time[1] < 10 ? '0' : '') + time[1]}`
        } else if (mode === 'date') {
            const date = this.getLimitDate(value)
            const lastValue = this._value === null ? this.value : this._value
            const lastDate = this.getLimitDate(filterDate(lastValue))

            if (date[0] !== lastDate[0] || date[1] !== lastDate[1]) {
                this.adjustDateColumn(date)
                this.pickerView.setAttribute('value', date)
            } else if (!isEqual(date, value)) {
                this.pickerView.setAttribute('value', date)
            }

            const fields = this.fields
            if (fields === 'year') value = formatTime(new Date(date[0] + 1900, 0), 'yyyy')
            else if (fields === 'month') value = formatTime(new Date(date[0] + 1900, (date[1] || 0)), 'yyyy-MM')
            else value = formatTime(new Date(date[0] + 1900, (date[1] || 0), (date[2] || 0) + 1), 'yyyy-MM-dd')
        } else if (mode === 'region') {
            const item1 = this._regionJson[value[0]]
            const item2 = item1[1][value[1]] || item1[1][0]
            const item3 = item2[1][value[2]] || item2[1][0]
            value = [item1[0], item2[0], item3] // 序号转为省市名称
            const lastValue = this._value === null ? this.value : this._value
            this.adjustRegionColumn(value, value[0] !== lastValue[0], value[1] !== lastValue[1])
        }

        // 记录当前的值
        this._value = value
    }

    /**
     * 获取组件值，由 wx-form 调用
     */
    getFormValue(cb) {
        if (this._isPickerShow) this._getFormValueCb = cb
        else cb(this.value)
    }

    /**
     * 重置组件值，由 wx-form 调用
     */
    resetFormValue() {
        const mode = this.mode
        let value = ''
        if (mode === 'selector') value = 0
        else if (mode === 'multiSelector') value = []
        else if (mode === 'time') value = ''
        else if (mode === 'date') {
            const fields = this.fields
            if (fields === 'year') value = formatTime(new Date(), 'yyyy')
            else if (fields === 'month') value = formatTime(new Date(), 'yyyy-MM')
            else value = formatTime(new Date(), 'yyyy-MM-dd')
        } else if (mode === 'region') value = []

        this.setAttribute('value', value)
    }
}
