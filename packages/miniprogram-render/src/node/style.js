const originalStyleList = require('./style-list')
const tool = require('../util/tool')
const Pool = require('../util/pool')
const cache = require('../util/cache')

const pool = new Pool()
let styleList = [].concat(originalStyleList)
let isInitStyleList = false

/**
 * 样式名转连接符
 */
function toDash(name) {
    if (name.indexOf('webkit') === 0) name = name.replace('webkit', 'Webkit')
    return tool.toDash(name)
}

/**
 * 样式名转驼峰
 */
function toCamel(name) {
    if (name.indexOf('-webkit-') === 0) name = name.replace('-webkit-', 'webkit-')
    return tool.toCamel(name)
}

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

            const name = toCamel(rule.substr(0, split).trim())
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
     * 初始化 style 列表
     */
    static $$initStyleList(extraStyleList = []) {
        if (isInitStyleList) return

        isInitStyleList = true
        styleList = styleList.concat(extraStyleList)

        // 设置各个属性的 getter、setter
        // const properties = {}
        styleList.forEach(name => {
            Object.defineProperty(Style.prototype, name, {
                get() {
                    return this.getPropertyValue(name)
                },
                set(value) {
                    this.setProperty(name, value)
                }
            })
        })
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
        this.$__cssTextCache = ''
        this.$__vars = {}
        this.$__style = {}
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        this.$_doUpdate = null
        this.$_disableCheckUpdate = false
        this.$__cssTextCache = null
        this.$__vars = null
        this.$__style = null
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
     * 克隆实例
     */
    $$clone(style) {
        this.$__cssTextCache = style.$__cssTextCache
        this.$__vars = Object.assign({}, style.$__vars)
        this.$__style = Object.assign({}, style.$__style)
    }

    /**
     * 检查更新
     */
    $_checkUpdate() {
        this.$__cssTextCache = null // 清除 cssText 缓存
        if (this.$_disableCheckUpdate) return
        this.$_doUpdate()
    }

    /**
     * 对外属性和方法
     */
    get cssText() {
        if (this.$__cssTextCache !== null) return this.$__cssTextCache

        const joinTextArr = []
        const style = this.$__style
        const styleNames = Object.keys(style)
        for (let i = 0; i < styleNames.length; i += 1) {
            const name = styleNames[i]
            const styleContent = style[name]
            if (!styleContent) continue

            joinTextArr.push(`${toDash(name)}:${styleContent}`)
        }

        const vars = this.$__vars
        const varNames = Object.keys(vars)
        for (let i = 0; i < varNames.length; i += 1) {
            const name = varNames[i]
            const varContent = vars[name]
            if (!varContent) continue

            joinTextArr.push(`${name}:${varContent}`)
        }

        const joinText = joinTextArr.length ? `${joinTextArr.join(';')};` : ''

        this.$__cssTextCache = joinText

        return joinText
    }

    set cssText(styleText) {
        if (typeof styleText !== 'string') return
        if (styleText === this.$__cssTextCache) return

        // 当既有单引号又有双引号时不进行替换
        if (!(styleText.indexOf('"') > -1 && styleText.indexOf('\'') > -1)) {
            styleText = styleText.replace(/"/g, '\'')
        }

        // 解析样式
        const rules = parse(styleText)

        this.$_disableCheckUpdate = true // 将每条规则的设置合并为一次更新
        this.$__vars = {}
        this.$__style = {}
        const ruleNames = Object.keys(rules)
        for (let i = 0; i < ruleNames.length; i += 1) {
            const name = ruleNames[i]
            this.setProperty(name, rules[name])
        }
        this.$_disableCheckUpdate = false
        this.$_checkUpdate()
    }

    setProperty(name, value) {
        if (typeof name !== 'string') return
        value = value !== undefined ? '' + value : undefined

        const config = cache.getConfig()

        const isVar = name.startsWith('--')
        const container = isVar ? this.$__vars : this.$__style
        const oldValue = container[name]

        if (oldValue === value) return

        // 判断 value 是否需要删减
        if (value && config.optimization.styleValueReduce && value.length > config.optimization.styleValueReduce) {
            console.warn(`property "${name}" will be deleted, because it's greater than ${config.optimization.styleValueReduce}`)
            value = undefined
        }

        container[name] = value
        this.$_checkUpdate()
    }

    getPropertyValue(name) {
        if (typeof name !== 'string') return ''

        const isVar = name.startsWith('--')

        if (isVar) {
            return this.$__vars[name] || ''
        } else {
            return this.$__style[toCamel(name)] || ''
        }
    }
}

module.exports = Style
