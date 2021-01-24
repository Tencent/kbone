const cache = require('./cache')

/**
 * 判断是否是内置组件
 */
const WX_COMPONENT_MAP = {}
const WX_COMPONENT_LIST = [
    'cover-image', 'cover-view', 'match-media', 'movable-area', 'movable-view', 'scroll-view', 'swiper', 'swiper-item', 'view',
    'icon', 'progress', 'rich-text', 'text',
    'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
    'functional-page-navigator', 'navigator',
    'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video', 'voip-room',
    'map',
    'canvas',
    'ad', 'ad-custom', 'official-account', 'open-data', 'web-view',
    // 特殊补充
    'capture', 'catch', 'animation'
]
WX_COMPONENT_LIST.forEach(name => WX_COMPONENT_MAP[name] = name)
function checkIsWxComponent(tagName, notNeedPrefix) {
    const hasPrefix = tagName.indexOf('wx-') === 0
    if (notNeedPrefix) {
        return hasPrefix ? WX_COMPONENT_MAP[tagName.slice(3)] : WX_COMPONENT_MAP[tagName]
    } else {
        return hasPrefix ? WX_COMPONENT_MAP[tagName.slice(3)] : false
    }
}

/**
 * 驼峰转连字符
 */
function toDash(str) {
    return str.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`)
}

/**
 * 连字符转驼峰
 */
function toCamel(str) {
    return str.replace(/-([a-zA-Z])/g, (all, $1) => $1.toUpperCase())
}

/**
 * 获取唯一 id
 */
let seed = +new Date()
function getId() {
    return seed++
}

/**
 * 从 pageId 中获取小程序页面 route
 */
function getPageRoute(pageId) {
    return pageId.split('-')[2]
}

/**
 * 从 pageRoute 中获取小程序页面名称
 */
function getPageName(pageRoute) {
    const pluginMatchRes = pageRoute.match(/(?:^|\/)__plugin__\/(?:.*?)(\/.*)/)
    if (pluginMatchRes && pluginMatchRes[1]) {
        // 插件页面的 route 需要特殊处理
        pageRoute = pluginMatchRes[1]
    }
    const splitPageRoute = pageRoute.split('/')
    return splitPageRoute[1] === 'pages' ? splitPageRoute[2] : splitPageRoute[1]
}

/**
 * 节流，一个同步流中只调用一次该函数
 */
const waitFuncSet = new Set()
function throttle(func) {
    return () => {
        if (waitFuncSet.has(func)) return

        waitFuncSet.add(func)

        Promise.resolve().then(() => {
            if (waitFuncSet.has(func)) {
                waitFuncSet.delete(func)
                func()
            }
        }).catch(console.error)
    }
}

/**
 * 清空节流缓存
 */
function flushThrottleCache() {
    waitFuncSet.forEach(waitFunc => waitFunc && waitFunc())
    waitFuncSet.clear()
}

/**
 * 补全 url
 */
function completeURL(url, defaultOrigin, notTransHttps) {
    const config = cache.getConfig()

    // 处理 url 前缀
    if (url.indexOf('//') === 0) {
        url = 'https:' + url
    } else if (url[0] === '/') {
        url = (config.origin || defaultOrigin) + url
    }

    if (!notTransHttps && url.indexOf('http:') === 0) {
        url = url.replace(/^http:/ig, 'https:')
    }

    return url
}

/**
 * 解码特殊字符
 */
function decodeContent(content) {
    return content
        .replace(/&nbsp;/g, '\u00A0')
        .replace(/&ensp;/g, '\u2002')
        .replace(/&emsp;/g, '\u2003')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
        .replace(/&amp;/g, '&')
}

/**
 * 判断该标签在小程序中是否支持
 */
const NOT_SUPPORT_TAG_NAME_LIST = ['IFRAME']
function isTagNameSupport(tagName) {
    return NOT_SUPPORT_TAG_NAME_LIST.indexOf(tagName) === -1
}

/**
 * 处理 innerHTML/outerHTML 的属性值过滤
 */
function escapeForHtmlGeneration(value) {
    return value.replace(/"/g, '&quot;')
}

/**
 * setData 封装
 */
function setData(instance, data) {
    const pageId = instance.pageId
    const window = pageId ? cache.getWindow(pageId) : null
    if (window && window._startInit) {
        // 统计 init 阶段的 setData
        window._iniCount++
        instance.setData(data, () => {
            window._iniCount--
            if (!window._startInit && window._iniCount <= 0) {
                // 回调全部回来了
                window.document.$$trigger('DOMContentLoaded')
                window._iniCount = 0
            }
        })
        return
    }

    // 普通 setData
    instance.setData(data)
}

module.exports = {
    checkIsWxComponent,
    toDash,
    toCamel,
    getId,
    getPageRoute,
    getPageName,
    throttle,
    flushThrottleCache,
    completeURL,
    decodeContent,
    isTagNameSupport,
    escapeForHtmlGeneration,
    setData,
}
