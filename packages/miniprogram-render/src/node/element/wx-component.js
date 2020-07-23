const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')
const tool = require('../../util/tool')

const pool = new Pool()

class WxComponent extends Element {
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

        return new WxComponent(options, tree)
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

    get behavior() {
        return this.$_attrs.get('behavior') || ''
    }

    set behavior(value) {
        if (!value || typeof value !== 'string') return

        this.$_attrs.set('behavior', value)
    }

    get value() {
        return this.$_attrs.get('value')
    }

    set value(value) {
        this.$_attrs.set('value', value)
    }

    get scrollTop() {
        return this.$_attrs.get('scroll-top') || 0
    }

    set scrollTop(value) {
        value = parseInt(value, 10)

        if (!isNaN(value)) {
            this.$_attrs.set('scroll-top', value)
        }
    }

    get scrollLeft() {
        return this.$_attrs.get('scroll-left') || 0
    }

    set scrollLeft(value) {
        value = parseInt(value, 10)

        if (!isNaN(value)) {
            this.$_attrs.set('scroll-left', value)
        }
    }

    setAttribute(name, value) {
        super.setAttribute(name, value)

        if (name === 'scroll-into-view') {
            // TODO：scroll-into-view 先转成 scroll-top 来处理，等基础库支持
            tool.flushThrottleCache() // 先清空 setData
            Promise.resolve().then(() => {
                const scrollItem = this.ownerDocument.getElementById(value)
                if (!scrollItem) return

                const propName = this.getAttribute('scroll-x') ? 'scroll-left' : this.getAttribute('scroll-y') ? 'scroll-top' : ''
                if (!propName) return

                const window = cache.getWindow(this.$_pageId)
                Promise.all([
                    new Promise(resolve => window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`).fields({rect: true, scrollOffset: true}).exec(resolve)),
                    scrollItem.$$getBoundingClientRect()
                ]).then(res => {
                    const rectName = propName === 'scroll-left' ? 'left' : 'top'
                    const scrollRect = res[0][0]
                    const itemRect = res[1]

                    super.setAttribute(propName, itemRect[rectName] - scrollRect[rectName] + scrollRect[tool.toCamel(propName)])
                }).catch(console.error)
            }).catch(console.error)
        }
    }
}

module.exports = WxComponent
