const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

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
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()
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
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init(options, tree)
    }

    /**
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        this.$_initRect()
        super.$_triggerParentUpdate()
    }

    /**
     * 初始化
     */
    $_initRect() {
        // 默认选项在自带 display
        if (!this.$_style.display) {
            this.$_style.display = `${this.selected ? 'inline-block' : 'none'}`
        }
        this.$_triggerMeUpdate()
    }

    /**
     * 调用 $_generateHtml 接口时用于处理额外的属性，
     */
    $$dealWithAttrsForGenerateHtml(html, node) {

        const value = node.value
        if (value) html += ` value="${value}"`

        const label = node.label
        if (label) html += ` label="${label}"`

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
        this.selected = node.selected || ''
    }

    get label() {
        return this.$_attrs.get('label') || this.textContent
    }

    get disabled() {
        return !!this.$_attrs.get('disabled')
    }

    get value() {
        const value = this.$_attrs.get('value')

        if (typeof value != 'undefined') {
            return value
        }
        return this.label
    }

    set disabled(value) {
        value = !!value
        this.$_attrs.set('disabled', value)
    }

    set selected(value) {
        this.$_style.display = `${value ? 'inline-block' : 'none'}`
        this.$_attrs.set('selected', value)
    }

    get selected() {
        return !!this.$_attrs.get('selected')
    }

}

module.exports = HTMLOptionElement
