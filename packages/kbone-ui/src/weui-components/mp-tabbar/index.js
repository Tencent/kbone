import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'
import {
    findParent,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

export default class MpTabbar extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpTabbar.observedAttributes, () => {
            this.onTap = this.onTap.bind(this)
            this.tabbar = this.shadowRoot.querySelector('.weui-tabbar')
        })
    }

    static register() {
        customElements.define('mp-tabbar', MpTabbar)
    }

    connectedCallback() {
        super.connectedCallback()

        this.tabbar.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.tabbar.removeEventListener('tap', this.onTap)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            const extClass = this.extClass
            this.tabbar.className = `weui-tabbar ${extClass}`
        } else if (name === 'list') {
            this.updateList()
        } else if (name === 'current') {
            this.updateCurrent()
        }
    }

    static get observedAttributes() {
        return ['list', 'current', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get list() {
        return this.getObjectValue('list', [])
    }

    get current() {
        return this.getNumberValue('current')
    }

    set current(value) {
        this.setAttribute('current', value)
    }

    /**
     * 更新列表
     */
    updateList() {
        const list = this.list
        if (list.length) {
            const current = this.current
            this.tabbar.innerHTML = list.map((item, index) => `<div data-index='${index}' class="weui-tabbar__item ${current === index ? 'weui-bar__item_on' : ''}">
                  <div style="position: relative;display:inline-block;">
                    <wx-image src="${current === index ? item.selectedIconPath : item.iconPath}" class="weui-tabbar__icon"></wx-image>
                    ${(item.badge || item.dot) ? '<mp-badge content="' + (item.badge || '') + '" style="position: absolute;top:-2px;left:calc(100% - 3px)"></mp-badge>' : ''}
                  </div>
                  <div class="weui-tabbar__label">${item.text}</div>
                </div>`).join('')
        } else {
            this.tabbar.innerHTML = ''
        }
    }

    /**
     * 更新当前项
     */
    updateCurrent() {
        const list = this.list
        const current = this.current
        Array.prototype.slice.call(this.tabbar.childNodes).forEach((item, index) => {
            const image = item.querySelector('wx-image')
            if (current === index) {
                item.classList.toggle('weui-bar__item_on', true)
                image.setAttribute('src', list[index].selectedIconPath)
            } else {
                item.classList.toggle('weui-bar__item_on', false)
                image.setAttribute('src', list[index].iconPath)
            }
        })
    }

    /**
     * 监听 tabbar 点击
     */
    onTap(evt) {
        const tabbarItem = findParent(evt.target, node => node.classList && node.classList.contains('weui-tabbar__item'))
        if (tabbarItem) {
            const index = +tabbarItem.dataset.index
            const item = this.list[index]

            if (index === this.current) return
            this.current = index
            this.dispatchEvent(new CustomEvent('change', {bubbles: true, cancelable: true, detail: {index, item}}))
        }
    }
}
