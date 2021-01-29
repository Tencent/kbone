import Base from '../base'
import tpl from './index.html'
import style from './index.less'
import {
    toDash,
} from '../../utils/tool'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`


export default class WxMatchMedia extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxMatchMedia.observedAttributes, () => {
            this.update = this.update.bind(this)
        })
    }

    static register() {
        customElements.define('wx-match-media', WxMatchMedia)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (oldValue === newValue) return
        if (name === 'min-width' || name === 'max-width' || name === 'width' || name === 'min-height' || name === 'max-height' || name === 'height' || name === 'orientation') {
            window.requestAnimationFrame(this.update)
        }
    }

    static get observedAttributes() {
        return ['min-width', 'max-width', 'width', 'min-height', 'max-height', 'height', 'orientation', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get minWidth() {
        return this.getNumberValue('min-width', null)
    }

    get maxWidth() {
        return this.getNumberValue('max-width', null)
    }

    get width() {
        return this.getNumberValue('width', null)
    }

    get minHeight() {
        return this.getNumberValue('min-height', null)
    }

    get maxHeight() {
        return this.getNumberValue('max-height', null)
    }

    get height() {
        return this.getNumberValue('height', null)
    }

    get orientation() {
        return this.getAttribute('orientation')
    }

    /**
     * 监听条件变化
     */
    update() {
        if (this._isUpdating) return
        this._isUpdating = true

        if (this._observer && this._listener) this._observer.removeListener(this._listener)

        const media = this.getMediaQuery()
        this._observer = window.matchMedia(media)
        this._listener = evt => {
            this.style.display = evt.matches ? 'block' : 'none'
        }
        this._observer.addListener(this._listener)
        this._listener({matches: this._observer.matches})

        this._isUpdating = false
    }

    /**
     * 获取媒体查询串
     */
    getMediaQuery() {
        let query = '';
        ['minWidth', 'maxWidth', 'width', 'minHeight', 'maxHeight', 'height'].forEach(field => {
            let value = this[field]
            if (typeof value !== 'number') return
            if (value < 0) value = ''
            if (query) query += ' and '
            query += `(${toDash(field)}: ${value}px)`
        });
        ['orientation'].forEach(field => {
            let value = this[field]
            if (typeof value !== 'string') return
            value = /^[-_a-z0-9]+$/i.test(value) ? value : ''
            if (query) query += ' and '
            query += `(${toDash(field)}: ${value})`
        })
        return query
    }
}
