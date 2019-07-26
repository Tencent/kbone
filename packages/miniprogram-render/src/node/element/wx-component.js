const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

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

    get $$behavior() {
        return this.getAttribute('behavior') || ''
    }

    get $$content() {
        return this.textContent
    }

    /**
     * 对外属性和方法
     */
    get disabled() {
        return !!this.$_attrs.get('disabled')
    }

    set disabled(value) {
        value = !!value
        this.$_attrs.set('disabled', value)
    }

    get openType() {
        return this.getAttribute('open-type') || ''
    }

    set openType(value) {
        value = '' + value
        this.$_attrs.set('open-type', value)
    }
}

module.exports = WxComponent
