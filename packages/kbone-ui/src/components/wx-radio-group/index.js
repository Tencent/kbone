import Base from '../base'
import tpl from './index.html'
import style from './index.less'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${tpl}`

export default class WxRadioGroup extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxRadioGroup.observedAttributes, () => {
            this.i = this.shadowRoot.querySelector('i')
        })
    }

    static register() {
        customElements.define('wx-radio-group', WxRadioGroup)
    }
}
