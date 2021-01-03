import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxCapture extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxCapture.observedAttributes)
    }

    static register() {
        customElements.define('wx-capture', WxCapture)
    }

    addEventListener(type, listener, options) {
        if (typeof options === 'object') options.capture = true
        else options = true

        super.addEventListener(type, listener, options)
    }

    removeEventListener(type, listener, options) {
        if (typeof options === 'object') options.capture = true
        else options = true

        super.removeEventListener(type, listener, options)
    }
}
