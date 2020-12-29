import Hover from '../hover'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxView extends Hover {
    constructor() {
        super()

        this.initShadowRoot(template, WxView.observedAttributes)
    }

    static register() {
        customElements.define('wx-view', WxView)
    }

    static get observedAttributes() {
        return [...Hover.observedAttributes]
    }
}
