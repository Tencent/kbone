const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class HTMLSelectElement extends Element {
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
        return new HTMLSelectElement(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init(options, tree)
        this.$_initRect()
    }

    /**
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        this.$_initRect()
        super.$_triggerParentUpdate()
    }

     /**
     * 更新当前组件
     */
    $_triggerMeUpdate() {
        super.$_triggerMeUpdate()
        super.$_triggerParentUpdate()
    }

    /**
     * 初始化
     */
    $_initRect() {
        if ( typeof this.value != 'undefined') {
            this.childNodes.filter(c => c.tagName && c.tagName.toLowerCase() === "option").map(c => {
                if (c.value === this.value) {
                    return c.selected = true
                }
                return c.selected = false
            })
        } else {
            this.childNodes.filter(c => c.tagName && c.tagName.toLowerCase() === "option").map((e, i) => {
                e.$_style.display = `${ (i < 1) ? 'inline-block' : 'none'}`
            })
        }
        this.$_triggerMeUpdate()
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
        if (value) html += ` value="${value}"`

        const selectedIndex = node.selectedIndex
        if (selectedIndex) html += ` selectedIndex="${selectedIndex}"`

        const disabled = node.disabled
        if (disabled) html += ' disabled'

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.type = node.type || ''
        this.value = node.value || ''
        this.selectedIndex = node.selectedIndex || ''
        this.disabled = node.disabled || ''
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        return {
            value: this.value,
            disabled: this.disabled,
        }
    }

    /**
     * 对外属性和方法
     */
    get rangeKey() {
        return 'name'
    }

    get selectedIndex() {
        let value = this.$_attrs.get('selectedIndex')
        // 首次加载
        if (typeof value == "undefined") {
            // 从 options 推算
            const options = this.options
            if (options) {
                const selectedIndex = options.findIndex((o) => o.selected)
                value = selectedIndex > -1 ? selectedIndex : 0
                if (typeof this.value != "undefined") {
                    const defaultIndexByValue = options.findIndex((o) => o.value === this.value)
                    if (defaultIndexByValue > -1) value = defaultIndexByValue
                }
            } else {
                value = 0
            }
            this.selectedIndex = value
        }

        return Number(value)
    }

    set selectedIndex(index) {
        if (index > -1) {
            this.$_attrs.set('selectedIndex', index)
            this.value = this.options && this.options[index] ? this.options[index].value : ''
        } else {
            this.value = this.options && this.options[0] ? this.options[0].value : ''
        }
    }

    get type() {
        return 'select'
    }

    get name() {
        return this.$_attrs.get('name')
    }

    set name(value) {
        value = '' + value
        return this.$_attrs.set('name', value)
    }

    get value() {
        const value = this.$_attrs.get('value')
        return value
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

    get options() {
        const options = this.$_children.filter(c => c.tagName && c.tagName.toLowerCase() === "option").map(c => {
            return {
                name: c.label,
                value: c.value,
                get selected() { return c.selected },
                set selected(value) { c.selected = value; }
            }
        })
        return options || []
    }

    get multiple() {
        return this.$_attrs.get('multiple')
    }

    set multiple(value) {
        value = !!value
        this.$_attrs.set('multiple', value)
    }

    get autofocus() {
        return !!this.$_attrs.get('autofocus')
    }

    set autofocus(value) {
        value = !!value
        this.$_attrs.set('autofocus', value)
    }


    focus() {
        this.$_attrs.set('focus', true)
    }

    blur() {
        this.$_attrs.set('focus', false)
    }
}

module.exports = HTMLSelectElement
