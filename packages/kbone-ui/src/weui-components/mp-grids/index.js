import WeuiBase from '../weui-base'
import tpl from './index.html'
import style from './index.less'
import weuiStyle from '../../styles/weui.less'

const template = document.createElement('template')
template.innerHTML = `<style>${weuiStyle}${style}</style>${tpl}`

const defaultGridProps = {
    target: 'self',
    url: '',
    openType: 'navigate',
    delta: 1,
    appId: '',
    path: '',
    extraData: '',
    version: 'release',
    hoverClass: 'navigator-hover',
    hoverStopPropagation: false,
    hoverStartTime: 50,
    hoverStayTime: 600,
    bindsuccess: () => {},
    bindfail: () => {},
    bindcomplete: () => {}
}

export default class MpGrids extends WeuiBase {
    constructor() {
        super()

        this.initShadowRoot(template, MpGrids.observedAttributes, () => {
            this.onTap = this.onTap.bind(this)
            this.gridsDom = this.shadowRoot.querySelector('.weui-grids')
        })
    }

    static register() {
        customElements.define('mp-grids', MpGrids)
    }

    connectedCallback() {
        super.connectedCallback()

        this.gridsDom.addEventListener('tap', this.onTap)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.gridsDom.removeEventListener('tap', this.onTap)
    }

    attributeChangedCallback(name, oldValue, newValue, isInit) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (!isInit && oldValue === newValue) return
        if (name === 'ext-class') {
            this.gridsDom.className = `weui-grids ${this.extClass}`
        } else if (name === 'grids') {
            this._grids = this.grids.map(item => Object.assign({}, defaultGridProps, item))
            this.updateGrids()
        }
    }

    static get observedAttributes() {
        return ['grids', ...WeuiBase.observedAttributes]
    }

    /**
     * 属性
     */
    get grids() {
        return this.getObjectValue('grids', [])
    }

    /**
     * 更新表格
     */
    updateGrids() {
        const grids = this._grids
        if (grids.length) {
            this.gridsDom.innerHTML = grids.map((item, index) => `<wx-view
                    class="weui-grid"
                    data-index="${index}"
                    hover-class="${item.hoverClass}"
                    hover-stop-propagation="${item.hoverStopPropagation}"
                    hover-start-time="${item.hoverStartTime}"
                    hover-stay-time="${item.hoverStayTime}"    
                >
                    <div class="weui-grid__icon"><wx-image class="weui-grid__icon_img" src="${item.imgUrl}"></wx-image></div>
                    <div class="weui-grid__label">${item.text}</div>
                </wx-view>`).join('')
        } else {
            this.gridsDom.innerHTML = ''
        }
    }

    /**
     * 监听点击事件
     */
    onTap(evt) {
        const index = +evt.target.dataset.index
        const item = this._grids[index]

        if (item) {
            this.dispatchEvent(new CustomEvent('gridtap', {bubbles: true, cancelable: true, detail: {index, data: item}}))
        }
    }
}
