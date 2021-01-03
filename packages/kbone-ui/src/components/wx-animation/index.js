import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxAnimation extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxAnimation.observedAttributes)
    }

    static register() {
        customElements.define('wx-animation', WxAnimation)
    }
}
