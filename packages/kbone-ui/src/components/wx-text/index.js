import Base from '../base'
import tpl from './index.html'

const template = document.createElement('template')
template.innerHTML = `${tpl}`

export default class WxText extends Base {
    constructor() {
        super()

        this.initShadowRoot(template, WxText.observedAttributes, () => {
            this.main = this.shadowRoot.querySelector('#main')
        })
    }

    static register() {
        customElements.define('wx-text', WxText)
    }

    connectedCallback() {
        super.connectedCallback()

        // 监听子节点变化
        if (this._observer) this._observer.disconnect()
        this._observer = new MutationObserver(this.update.bind(this))
        this._observer.observe(this, {
            attributes: true,
            childList: true,
            subtree: true,
        })

        this.update()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this._observer) this._observer.disconnect()
        this._observer = null
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue)

        if (name === 'user-select') {
            if (this.userSelect) {
                this.main.style.display = 'inline-block'
                this.main.style.willChange = 'transform'
            } else {
                this.main.style.display = 'inline'
                this.main.style.willChange = 'unset'
            }
        }
    }

    static get observedAttributes() {
        return ['user-select', 'space', 'decode', ...Base.observedAttributes]
    }

    /**
     * 属性
     */
    get userSelect() {
        return this.getBoolValue('user-select')
    }

    get space() {
        return this.getAttribute('space')
    }

    get decode() {
        return this.getBoolValue('decode')
    }

    /**
     * html 解码
     */
    htmlDecode(str) {
        if (this.space) {
            if (this.space === 'nbsp') {
                str = str.replace(/ /g, '\u00A0')
            } else if (this.space === 'ensp') {
                str = str.replace(/ /g, '\u2002')
            } else if (this.space === 'emsp') {
                str = str.replace(/ /g, '\u2003')
            }
        }
        if (this.decode) {
            return str
                .replace(/&nbsp;/g, '\u00A0')
                .replace(/&ensp;/g, '\u2002')
                .replace(/&emsp;/g, '\u2003')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, '\'')
                .replace(/&amp;/g, '&')
        } else {
            return str
        }
    }

    /**
     * 更新内容
     */
    update() {
        const fragment = document.createDocumentFragment()

        for (let i = 0, len = this.childNodes.length; i < len; i++) {
            const node = this.childNodes.item(i)
            if (node.nodeType === node.TEXT_NODE) {
                const texts = this.htmlDecode(node.textContent).split('\n')
                texts.forEach((text, j) => {
                    if (j) fragment.appendChild(document.createElement('br'))
                    fragment.appendChild(document.createTextNode(text))
                })
            } else if (node.nodeType === node.ELEMENT_NODE) {
                fragment.appendChild(node.cloneNode(true))
            }
        }

        this.main.innerHTML = ''
        this.main.appendChild(fragment)
    }
}
