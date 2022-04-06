const styleList = require('./style-list')
const tool = require('../util/tool')
const Pool = require('../util/pool')
const cache = require('../util/cache')

const pool = new Pool()

/**
 * 解析样式串
 */
function parse(styleText) {
    const rules = {}

    if (styleText) {
        styleText = tool.decodeContent(styleText)
        styleText = styleText.replace(/url\([^)]+\)/ig, all => all.replace(/;/ig, ':#||#:')) // 先处理值里面的分号
        styleText.split(';').forEach(rule => {
            rule = rule.trim()
            if (!rule) return

            const split = rule.indexOf(':')
            if (split === -1) return

            const name = tool.toCamel(rule.substr(0, split).trim())
            rules[name] = rule.substr(split + 1).replace(/:#\|\|#:/ig, ';').trim()
        })
    }

    return rules
}

class Style {
    constructor(onUpdate) {
        this.$$init(onUpdate)
    }

    /**
     * 创建实例
     */
    static $$create(onUpdate) {
        const config = cache.getConfig()

        if (config.optimization.domExtendMultiplexing) {
            // 复用 dom 扩展对象
            const instance = pool.get()

            if (instance) {
                instance.$$init(onUpdate)
                return instance
            }
        }

        return new Style(onUpdate)
    }

    /**
     * 初始化实例
     */
    $$init(onUpdate) {
        this.$_doUpdate = onUpdate || (() => {})
        this.$_disableCheckUpdate = false // 是否禁止检查更新
        this.$__vars = null
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        this.$_doUpdate = null
        this.$_disableCheckUpdate = false
        this.$__vars = null

        styleList.forEach(name => {
            this[`$_${name}`] = undefined
        })
    }

    /**
     * 回收实例
     */
    $$recycle() {
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.domExtendMultiplexing) {
            // 复用 dom 扩展对象
            pool.add(this)
        }
    }

    /**
     * css 变量存储
     */
    get $_vars() {
        if (!this.$__vars) this.$__vars = {}
        return this.$__vars
    }

    /**
     * 检查更新
     */
    $_checkUpdate() {
        if (!this.$_disableCheckUpdate) {
            this.$_doUpdate()
        }
    }

    /**
     * 对外属性和方法
     */
    get cssText() {
        let joinText = styleList
            .filter(name => this[`$_${name}`])
            .map(name => `${tool.toDash(name)}:${this['$_' + name]}`)
            .join(';')
            .trim()
        joinText = joinText ? `${joinText};` : ''

        if (this.$__vars) {
            const vars = this.$_vars
            const varsText = Object
                .keys(vars)
                .filter(name => vars[name])
                .map(name => `${name}:${vars[name]}`)
                .join(';')
                .trim()
            joinText = varsText ? `${joinText}${varsText};` : joinText
        }

        return joinText
    }

    set cssText(styleText) {
        if (typeof styleText !== 'string') return

        // 当既有单引号又有双引号时不进行替换
        if (!(styleText.indexOf('\"') > -1 && styleText.indexOf('\'') > -1)) {
            styleText = styleText.replace(/"/g, '\'')
        }

        // 解析样式
        const rules = parse(styleText)

        this.$_disableCheckUpdate = true // 将每条规则的设置合并为一次更新
        for (const name of styleList) {
            this.setProperty(name, rules[name])
        }
        this.$_disableCheckUpdate = false
        this.$_checkUpdate()
    }

    setProperty(name, value) {
        if (typeof name !== 'string') return ''

        if (name.indexOf('--') === 0) {
            this.$_vars[name] = value // css 变量
            this.$_checkUpdate()
        } else this[name] = value
    }

    getPropertyValue(name) {
        if (typeof name !== 'string') return ''

        if (name.indexOf('--') === 0) return this.$_vars[name] || ''
        else return this[tool.toCamel(name)] || ''
    }
}

/**
 * 设置各个属性的 getter、setter
 */
const properties = {}
styleList.forEach(name => {
    properties[name] = {
        get() {
            return this[`$_${name}`] || ''
        },
        set(value) {
            const config = cache.getConfig()
            const oldValue = this[`$_${name}`]
            value = value !== undefined ? '' + value : undefined

            // 判断 value 是否需要删减
            if (value && config.optimization.styleValueReduce && value.length > config.optimization.styleValueReduce) {
                console.warn(`property "${name}" will be deleted, because it's greater than ${config.optimization.styleValueReduce}`)
                value = undefined
            }

            this[`$_${name}`] = value
            if (oldValue !== value) this.$_checkUpdate()
        },
    }
})
Object.defineProperties(Style.prototype, properties)

module.exports = Style
