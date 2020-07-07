const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')
const tool = require('../../util/tool')

const pool = new Pool()

class HTMLOptionElement extends Element {
    /**
     * 创建实例
     */
    static $$create(options, tree) {
        const config = cache.getConfig()

        if (config.optimization.elementMultiplexing) {
            // 复用 element 节点
            const instance = pool.get()

            if (instance) {
                instance.$$init(options, tree)
                return instance
            }
        }

        return new HTMLOptionElement(options, tree)
    }

    /**
     * 覆写父类的回收实例方法
     */
    $$recycle() {
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.elementMultiplexing) {
            // 复用 element 节点
            pool.add(this)
        }
    }

    /**
     * 调用 $_generateHtml 接口时用于处理额外的属性，
     */
    $$dealWithAttrsForGenerateHtml(html, node) {
        const value = node.value
        if (value) html += ` value="${tool.tool.escapeForHtmlGeneration(value)}"`

        const label = node.label
        if (label) html += ` label="${tool.tool.escapeForHtmlGeneration(label)}"`

        const selected = node.selected
        if (selected) html += ' selected'

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.label = node.label || ''
        this.value = node.value || ''
        this.disabled = !!node.disabled
        this.selected = !!node.selected
    }

    /**
     * 更新 selected，不触发 select 的更新
     */
    $$updateSelected(value) {
        value = !!value
        this.$_attrs.set('selected', value)
    }

    get label() {
        return this.$_attrs.get('label') || this.textContent
    }

    set label(value) {
        value = '' + value
        this.$_attrs.set('label', value)
    }

    get value() {
        const value = this.$_attrs.get('value')
        return value !== undefined ? value : this.label
    }

    set value(value) {
        value = '' + value
        this.$_attrs.set('value', value)
    }

    get disabled() {
        return !!this.$_attrs.get('disabled')
    }

    set disabled(value) {
        value = !!value
        this.$_attrs.set('disabled', value)
    }

    set selected(value) {
        this.$$updateSelected(value)

        // 同步更新 select 的 selectedIndex 和 value，只考虑父亲节点中 select
        const parentNode = this.parentNode
        if (parentNode && parentNode.tagName === 'SELECT') {
            parentNode.value = this.value
        }
    }

    get selected() {
        return !!this.$_attrs.get('selected')
    }
}

module.exports = HTMLOptionElement
