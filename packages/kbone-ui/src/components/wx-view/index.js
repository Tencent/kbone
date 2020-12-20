import Hover from '../hover'
import tpl from './index.html'
import style from './index.less'

let template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`
template = template.content

export default class WxView extends Hover {
    constructor() {
        super()

        this.initShadowRoot(template.cloneNode(true), WxView.observedAttributes)
    }

    static register() {
        customElements.define('wx-view', WxView)
    }

    static get observedAttributes() {
        return [...Hover.observedAttributes]
    }
}
