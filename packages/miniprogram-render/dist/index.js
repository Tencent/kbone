module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1589353392144, function(require, module, exports) {
const tool = require('./util/tool')
const cache = require('./util/cache')
const Window = require('./window')
const Document = require('./document')
const EventTarget = require('./event/event-target')
const Event = require('./event/event')

module.exports = {
    createPage(route, config) {
        if (config) cache.setConfig(config)

        const pageId = `p-${tool.getId()}-/${route}`
        const window = new Window(pageId)
        const nodeIdMap = {}
        const document = new Document(pageId, nodeIdMap)

        cache.init(pageId, {
            window,
            document,
            nodeIdMap,
        })

        return {
            pageId,
            window,
            document,
        }
    },

    destroyPage(pageId) {
        cache.destroy(pageId)
    },

    // 开放给 miniprogram-element
    $$adapter: {
        cache,
        EventTarget,
        Event,
        tool,
    },
}

}, function(modId) {var map = {"./util/tool":1589353392145,"./util/cache":1589353392146,"./window":1589353392147,"./document":1589353392148,"./event/event-target":1589353392149,"./event/event":1589353392150}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392145, function(require, module, exports) {
const cache = require('./cache')

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
        }).catch(() => {
            // ignore
        })
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

module.exports = {
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
}

}, function(modId) { var map = {"./cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392146, function(require, module, exports) {
const pageMap = {}
let configCache = {}
const cookieCache = {}

/**
 * 初始化
 */
function init(pageId, options) {
    pageMap[pageId] = {
        window: options.window,
        document: options.document,
        nodeIdMap: options.nodeIdMap,
    }
}

/**
 * 销毁
 */
function destroy(pageId) {
    delete pageMap[pageId]
}

/**
 * 获取 document
 */
function getDocument(pageId) {
    return pageMap[pageId] && pageMap[pageId].document
}

/**
 * 获取 window
 */
function getWindow(pageId) {
    return pageMap[pageId] && pageMap[pageId].window
}

/**
 * 存储 domNode 映射
 */
function setNode(pageId, nodeId, domNode = null) {
    const document = pageMap[pageId] && pageMap[pageId].document

    // 运行前调用，不做任何操作
    if (!document) return
    // 相当于删除映射
    if (!domNode) return pageMap[pageId].nodeIdMap[nodeId] = domNode

    let parentNode = domNode.parentNode

    while (parentNode && parentNode !== document.body) {
        parentNode = parentNode.parentNode
    }

    pageMap[pageId].nodeIdMap[nodeId] = parentNode === document.body ? domNode : null
}

/**
 * 根据 nodeId 获取 domNode
 */
function getNode(pageId, nodeId) {
    return pageMap[pageId] && pageMap[pageId].nodeIdMap[nodeId]
}

/**
 * 存储全局 config
 */
function setConfig(config) {
    configCache = config
}

/**
 * 获取全局 config
 */
function getConfig() {
    return configCache
}

/**
 * 获取全局 cookie
 */
function getCookie() {
    return cookieCache
}

module.exports = {
    init,
    destroy,
    getDocument,
    getWindow,
    setNode,
    getNode,
    setConfig,
    getConfig,
    getCookie,
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392147, function(require, module, exports) {
const Document = require('./document')
const EventTarget = require('./event/event-target')
const Event = require('./event/event')
const OriginalCustomEvent = require('./event/custom-event')
const Location = require('./bom/location')
const Navigator = require('./bom/navigator')
const Screen = require('./bom/screen')
const History = require('./bom/history')
const Miniprogram = require('./bom/miniprogram')
const LocalStorage = require('./bom/local-storage')
const SessionStorage = require('./bom/session-storage')
const Performance = require('./bom/performance')
const OriginalXMLHttpRequest = require('./bom/xml-http-request')
const Node = require('./node/node')
const Element = require('./node/element')
const TextNode = require('./node/text-node')
const Comment = require('./node/comment')
const ClassList = require('./node/class-list')
const Style = require('./node/style')
const Attribute = require('./node/attribute')
const cache = require('./util/cache')
const tool = require('./util/tool')

let lastRafTime = 0
const WINDOW_PROTOTYPE_MAP = {
    location: Location.prototype,
    navigator: Navigator.prototype,
    performance: Performance.prototype,
    screen: Screen.prototype,
    history: History.prototype,
    localStorage: LocalStorage.prototype,
    sessionStorage: SessionStorage.prototype,
    event: Event.prototype,
}
const ELEMENT_PROTOTYPE_MAP = {
    attribute: Attribute.prototype,
    classList: ClassList.prototype,
    style: Style.prototype,
}
const subscribeMap = {}
const globalObject = {}

class Window extends EventTarget {
    constructor(pageId) {
        super()

        const timeOrigin = +new Date()
        const that = this

        this.$_pageId = pageId

        this.$_outerHeight = 0
        this.$_outerWidth = 0
        this.$_innerHeight = 0
        this.$_innerWidth = 0

        this.$_location = new Location(pageId)
        this.$_navigator = new Navigator()
        this.$_screen = new Screen()
        this.$_history = new History(this.$_location)
        this.$_miniprogram = new Miniprogram(pageId)
        this.$_localStorage = new LocalStorage(this)
        this.$_sessionStorage = new SessionStorage(this)
        this.$_performance = new Performance(timeOrigin)

        this.$_nowFetchingWebviewInfoPromise = null // 正在拉取 webview 端信息的 promise 实例

        this.$_fetchDeviceInfo()
        this.$_initInnerEvent()

        // 补充实例的属性，用于 'xxx' in XXX 判断
        this.onhashchange = null

        this.$_elementConstructor = function HTMLElement(...args) {
            return Element.$$create(...args)
        }
        this.$_customEventConstructor = class CustomEvent extends OriginalCustomEvent {
            constructor(name = '', options = {}) {
                options.timeStamp = +new Date() - timeOrigin
                super(name, options)
            }
        }
        this.$_xmlHttpRequestConstructor = class XMLHttpRequest extends OriginalXMLHttpRequest {
            constructor() {
                super(that)
            }
        }

        // react 环境兼容
        this.HTMLIFrameElement = function() {}
    }

    /**
     * 初始化内部事件
     */
    $_initInnerEvent() {
        // 监听 location 的事件
        this.$_location.addEventListener('hashchange', ({oldURL, newURL}) => {
            this.$$trigger('hashchange', {
                event: new Event({
                    name: 'hashchange',
                    target: this,
                    eventPhase: Event.AT_TARGET,
                    $$extra: {
                        oldURL,
                        newURL,
                    },
                }),
                currentTarget: this,
            })
        })

        // 监听 history 的事件
        this.$_history.addEventListener('popstate', ({state}) => {
            this.$$trigger('popstate', {
                event: new Event({
                    name: 'popstate',
                    target: this,
                    eventPhase: Event.AT_TARGET,
                    $$extra: {state},
                }),
                currentTarget: this,
            })
        })
    }

    /**
     * 拉取设备参数
     */
    $_fetchDeviceInfo() {
        try {
            const info = wx.getSystemInfoSync()

            this.$_outerHeight = info.screenHeight
            this.$_outerWidth = info.screenWidth
            this.$_innerHeight = info.windowHeight
            this.$_innerWidth = info.windowWidth

            this.$_screen.$$reset(info)
            this.$_navigator.$$reset(info)
        } catch (err) {
            // ignore
        }
    }

    /**
     * 拉取处理切面必要的信息
     */
    $_getAspectInfo(descriptor) {
        if (!descriptor || typeof descriptor !== 'string') return

        descriptor = descriptor.split('.')
        const main = descriptor[0]
        const sub = descriptor[1]
        let method = descriptor[1]
        let type = descriptor[2]
        let prototype

        // 找出对象原型
        if (main === 'window') {
            if (WINDOW_PROTOTYPE_MAP[sub]) {
                prototype = WINDOW_PROTOTYPE_MAP[sub]
                method = type
                type = descriptor[3]
            } else {
                prototype = Window.prototype
            }
        } else if (main === 'document') {
            prototype = Document.prototype
        } else if (main === 'element') {
            if (ELEMENT_PROTOTYPE_MAP[sub]) {
                prototype = ELEMENT_PROTOTYPE_MAP[sub]
                method = type
                type = descriptor[3]
            } else {
                prototype = Element.prototype
            }
        } else if (main === 'textNode') {
            prototype = TextNode.prototype
        } else if (main === 'comment') {
            prototype = Comment.prototype
        }

        return {prototype, method, type}
    }

    /**
     * 暴露给小程序用的对象
     */
    get $$miniprogram() {
        return this.$_miniprogram
    }

    /**
     * 获取全局共享对象
     */
    get $$global() {
        return globalObject
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        super.$$destroy()

        const pageId = this.$_pageId

        Object.keys(subscribeMap).forEach(name => {
            const handlersMap = subscribeMap[name]
            if (handlersMap[pageId]) handlersMap[pageId] = null
        })
    }

    /**
     * 小程序端的 getComputedStyle 实现
     * https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.fields.html
     */
    $$getComputedStyle(dom, computedStyle = []) {
        tool.flushThrottleCache() // 先清空 setData
        return new Promise((resolve, reject) => {
            if (dom.tagName === 'BODY') {
                this.$$createSelectorQuery().select('.miniprogram-root').fields({computedStyle}, res => (res ? resolve(res) : reject())).exec()
            } else {
                this.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${dom.$$nodeId}`).fields({computedStyle}, res => (res ? resolve(res) : reject())).exec()
            }
        })
    }

    /**
     * 强制清空 setData 缓存
     */
    $$forceRender() {
        tool.flushThrottleCache()
    }

    /**
     * 触发节点事件
     */
    $$trigger(eventName, options = {}) {
        if (eventName === 'error' && typeof options.event === 'string') {
            // 此处触发自 App.onError 钩子
            const errStack = options.event
            const errLines = errStack.split('\n')
            let message = ''
            for (let i = 0, len = errLines.length; i < len; i++) {
                const line = errLines[i]
                if (line.trim().indexOf('at') !== 0) {
                    message += (line + '\n')
                } else {
                    break
                }
            }

            const error = new Error(message)
            error.stack = errStack
            options.event = new this.$_customEventConstructor('error', {
                target: this,
                $$extra: {
                    message,
                    filename: '',
                    lineno: 0,
                    colno: 0,
                    error,
                },
            })
            options.args = [message, error]

            // window.onerror 比较特殊，需要调整参数
            if (typeof this.onerror === 'function' && !this.onerror.$$isOfficial) {
                const oldOnError = this.onerror
                this.onerror = (event, message, error) => {
                    oldOnError.call(this, message, '', 0, 0, error)
                }
                this.onerror.$$isOfficial = true // 标记为官方封装的方法
            }
        }

        super.$$trigger(eventName, options)
    }

    /**
     * 获取原型
     */
    $$getPrototype(descriptor) {
        if (!descriptor || typeof descriptor !== 'string') return

        descriptor = descriptor.split('.')
        const main = descriptor[0]
        const sub = descriptor[1]

        if (main === 'window') {
            if (WINDOW_PROTOTYPE_MAP[sub]) {
                return WINDOW_PROTOTYPE_MAP[sub]
            } else if (!sub) {
                return Window.prototype
            }
        } else if (main === 'document') {
            if (!sub) {
                return Document.prototype
            }
        } else if (main === 'element') {
            if (ELEMENT_PROTOTYPE_MAP[sub]) {
                return ELEMENT_PROTOTYPE_MAP[sub]
            } else if (!sub) {
                return Element.prototype
            }
        } else if (main === 'textNode') {
            if (!sub) {
                return TextNode.prototype
            }
        } else if (main === 'comment') {
            if (!sub) {
                return Comment.prototype
            }
        }
    }

    /**
     * 扩展 dom/bom 对象
     */
    $$extend(descriptor, options) {
        if (!descriptor || !options || typeof descriptor !== 'string' || typeof options !== 'object') return

        const prototype = this.$$getPrototype(descriptor)
        const keys = Object.keys(options)

        if (prototype) keys.forEach(key => prototype[key] = options[key])
    }

    /**
     * 对 dom/bom 对象方法追加切面方法
     */
    $$addAspect(descriptor, func) {
        if (!descriptor || !func || typeof descriptor !== 'string' || typeof func !== 'function') return

        const {prototype, method, type} = this.$_getAspectInfo(descriptor)

        // 处理切面
        if (prototype && method && type) {
            const methodInPrototype = prototype[method]
            if (typeof methodInPrototype !== 'function') return

            // 重写原始方法
            if (!methodInPrototype.$$isHook) {
                prototype[method] = function(...args) {
                    const beforeFuncs = prototype[method].$$before || []
                    const afterFuncs = prototype[method].$$after || []

                    if (beforeFuncs.length) {
                        for (const beforeFunc of beforeFuncs) {
                            const isStop = beforeFunc.apply(this, args)
                            if (isStop) return
                        }
                    }

                    const res = methodInPrototype.apply(this, args)

                    if (afterFuncs.length) {
                        for (const afterFunc of afterFuncs) {
                            afterFunc.call(this, res)
                        }
                    }

                    return res
                }
                prototype[method].$$isHook = true
                prototype[method].$$originalMethod = methodInPrototype
            }

            // 追加切面方法
            if (type === 'before') {
                prototype[method].$$before = prototype[method].$$before || []
                prototype[method].$$before.push(func)
            } else if (type === 'after') {
                prototype[method].$$after = prototype[method].$$after || []
                prototype[method].$$after.push(func)
            }
        }
    }

    /**
     * 删除对 dom/bom 对象方法追加前置/后置处理
     */
    $$removeAspect(descriptor, func) {
        if (!descriptor || !func || typeof descriptor !== 'string' || typeof func !== 'function') return

        const {prototype, method, type} = this.$_getAspectInfo(descriptor)

        // 处理切面
        if (prototype && method && type) {
            const methodInPrototype = prototype[method]
            if (typeof methodInPrototype !== 'function' || !methodInPrototype.$$isHook) return

            // 移除切面方法
            if (type === 'before' && methodInPrototype.$$before) {
                methodInPrototype.$$before.splice(methodInPrototype.$$before.indexOf(func), 1)
            } else if (type === 'after' && methodInPrototype.$$after) {
                methodInPrototype.$$after.splice(methodInPrototype.$$after.indexOf(func), 1)
            }

            if ((!methodInPrototype.$$before || !methodInPrototype.$$before.length) && (!methodInPrototype.$$after || !methodInPrototype.$$after.length)) {
                prototype[method] = methodInPrototype.$$originalMethod
            }
        }
    }

    /**
     * 订阅广播事件
     */
    $$subscribe(name, handler) {
        if (typeof name !== 'string' || typeof handler !== 'function') return

        const pageId = this.$_pageId
        subscribeMap[name] = subscribeMap[name] || {}
        subscribeMap[name][pageId] = subscribeMap[name][pageId] || []
        subscribeMap[name][pageId].push(handler)
    }

    /**
     * 取消订阅广播事件
     */
    $$unsubscribe(name, handler) {
        const pageId = this.$_pageId

        if (typeof name !== 'string' || !subscribeMap[name] || !subscribeMap[name][pageId]) return

        const handlers = subscribeMap[name][pageId]
        if (!handler) {
            // 取消所有 handler 的订阅
            handlers.length = 0
        } else if (typeof handler === 'function') {
            const index = handlers.indexOf(handler)
            if (index !== -1) handlers.splice(index, 1)
        }
    }

    /**
     * 发布广播事件
     */
    $$publish(name, data) {
        if (typeof name !== 'string' || !subscribeMap[name]) return

        Object.keys(subscribeMap[name]).forEach(pageId => {
            const handlers = subscribeMap[name][pageId]
            if (handlers && handlers.length) {
                handlers.forEach(handler => {
                    if (typeof handler !== 'function') return

                    try {
                        handler.call(null, data)
                    } catch (err) {
                        console.error(err)
                    }
                })
            }
        })
    }

    /**
     * 对外属性和方法
     */
    get document() {
        return cache.getDocument(this.$_pageId) || null
    }

    get location() {
        return this.$_location
    }

    set location(href) {
        this.$_location.href = href
    }

    get navigator() {
        return this.$_navigator
    }

    get CustomEvent() {
        return this.$_customEventConstructor
    }

    get Event() {
        return Event
    }

    get self() {
        return this
    }

    get localStorage() {
        return this.$_localStorage
    }

    get sessionStorage() {
        return this.$_sessionStorage
    }

    get screen() {
        return this.$_screen
    }

    get history() {
        return this.$_history
    }

    get outerHeight() {
        return this.$_outerHeight
    }

    get outerWidth() {
        return this.$_outerWidth
    }

    get innerHeight() {
        return this.$_innerHeight
    }

    get innerWidth() {
        return this.$_innerWidth
    }

    get Image() {
        return this.document.$$imageConstructor
    }

    get setTimeout() {
        return setTimeout.bind(null)
    }

    get clearTimeout() {
        return clearTimeout.bind(null)
    }

    get setInterval() {
        return setInterval.bind(null)
    }

    get clearInterval() {
        return clearInterval.bind(null)
    }

    get HTMLElement() {
        return this.$_elementConstructor
    }

    get Element() {
        return Element
    }

    get Node() {
        return Node
    }

    get RegExp() {
        return RegExp
    }

    get Math() {
        return Math
    }

    get Number() {
        return Number
    }

    get Boolean() {
        return Boolean
    }

    get String() {
        return String
    }

    get Date() {
        return Date
    }

    get Symbol() {
        return Symbol
    }

    get parseInt() {
        return parseInt
    }

    get parseFloat() {
        return parseFloat
    }

    get performance() {
        return this.$_performance
    }

    get SVGElement() {
        // 不作任何实现，只作兼容使用
        console.warn('window.SVGElement is not supported')
        return function() {}
    }

    get XMLHttpRequest() {
        return this.$_xmlHttpRequestConstructor
    }

    open(url) {
        // 不支持 windowName 和 windowFeatures
        this.location.$$open(url)
    }

    close() {
        wx.navigateBack({
            delta: 1,
        })
    }

    getComputedStyle() {
        // 不作任何实现，只作兼容使用
        console.warn('window.getComputedStyle is not supported, please use window.$$getComputedStyle instead of it')
        return {
            // vue transition 组件使用
            transitionDelay: '',
            transitionDuration: '',
            animationDelay: '',
            animationDuration: '',
        }
    }

    requestAnimationFrame(callback) {
        if (typeof callback !== 'function') return

        const now = new Date()
        const nextRafTime = Math.max(lastRafTime + 16, now)
        return setTimeout(() => {
            callback(nextRafTime)
            lastRafTime = nextRafTime
        }, nextRafTime - now)
    }

    cancelAnimationFrame(timeId) {
        return clearTimeout(timeId)
    }
}

module.exports = Window

}, function(modId) { var map = {"./document":1589353392148,"./event/event-target":1589353392149,"./event/event":1589353392150,"./event/custom-event":1589353392151,"./bom/location":1589353392165,"./bom/navigator":1589353392175,"./bom/screen":1589353392176,"./bom/history":1589353392177,"./bom/miniprogram":1589353392178,"./bom/local-storage":1589353392179,"./bom/session-storage":1589353392180,"./bom/performance":1589353392181,"./bom/xml-http-request":1589353392182,"./node/node":1589353392154,"./node/element":1589353392155,"./node/text-node":1589353392162,"./node/comment":1589353392163,"./node/class-list":1589353392156,"./node/style":1589353392158,"./node/attribute":1589353392160,"./util/cache":1589353392146,"./util/tool":1589353392145}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392148, function(require, module, exports) {
const EventTarget = require('./event/event-target')
const Tree = require('./tree/tree')
const Node = require('./node/node')
const Element = require('./node/element')
const TextNode = require('./node/text-node')
const Comment = require('./node/comment')
const tool = require('./util/tool')
const cache = require('./util/cache')
const A = require('./node/element/a')
const Image = require('./node/element/image')
const Input = require('./node/element/input')
const Textarea = require('./node/element/textarea')
const Video = require('./node/element/video')
const Canvas = require('./node/element/canvas')
const NotSupport = require('./node/element/not-support')
const WxComponent = require('./node/element/wx-component')
const WxCustomComponent = require('./node/element/wx-custom-component')
const Cookie = require('./bom/cookie')

const CONSTRUCTOR_MAP = {
    A,
    IMG: Image,
    INPUT: Input,
    TEXTAREA: Textarea,
    VIDEO: Video,
    CANVAS: Canvas,
    'WX-COMPONENT': WxComponent,
}
const WX_COMPONENT_MAP = {}
const WX_COMPONENT_LIST = [
    'movable-view', 'cover-image', 'cover-view', 'movable-area', 'scroll-view', 'swiper', 'swiper-item', 'view',
    'icon', 'progress', 'rich-text', 'text',
    'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea',
    'functional-page-navigator', 'navigator',
    'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video',
    'map',
    'canvas',
    'ad', 'official-account', 'open-data', 'web-view',
    // 特殊补充
    'capture', 'catch', 'animation'
]
WX_COMPONENT_LIST.forEach(name => WX_COMPONENT_MAP[name] = name)
let WX_CUSTOM_COMPONENT_MAP = {}

/**
 * 判断是否是内置组件
 */
function checkIsWxComponent(tagName, notNeedPrefix) {
    const hasPrefix = tagName.indexOf('wx-') === 0
    if (notNeedPrefix) {
        return hasPrefix ? WX_COMPONENT_MAP[tagName.slice(3)] : WX_COMPONENT_MAP[tagName]
    } else {
        return hasPrefix ? WX_COMPONENT_MAP[tagName.slice(3)] : false
    }
}

class Document extends EventTarget {
    constructor(pageId, nodeIdMap) {
        super()

        const config = cache.getConfig()
        const runtime = config.runtime || {}
        const cookieStore = runtime.cookieStore
        WX_CUSTOM_COMPONENT_MAP = runtime.usingComponents || {}

        this.$_pageId = pageId
        const pageRoute = tool.getPageRoute(pageId)
        const pageName = tool.getPageName(pageRoute)

        // 用于封装特殊标签和对应构造器
        const that = this
        this.$_imageConstructor = function HTMLImageElement(width, height) {
            return Image.$$create({
                tagName: 'img',
                nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
                attrs: {},
                width,
                height,
            }, that.$_tree)
        }

        this.$_pageId = pageId
        this.$_tree = new Tree(pageId, {
            type: 'element',
            tagName: 'body',
            attrs: {},
            unary: false,
            nodeId: 'e-body',
            children: [],
        }, nodeIdMap, this)
        this.$_cookie = new Cookie(pageName)
        this.$_config = null

        // documentElement
        this.$_node = this.$$createElement({
            tagName: 'html',
            attrs: {},
            nodeId: `a-${tool.getId()}`, // 运行前生成，使用 a- 前缀
            type: Node.DOCUMENT_NODE,
        })
        this.$_node.$$updateParent(this) // documentElement 的 parentNode 是 document
        this.$_node.scrollTop = 0

        // head 元素
        this.$_head = this.createElement('head')

        // 更新 body 的 parentNode
        this.$_tree.root.$$updateParent(this.$_node)

        // 持久化 cookie
        if (cookieStore !== 'memory' && cookieStore !== 'globalmemory') {
            try {
                const key = cookieStore === 'storage' ? `PAGE_COOKIE_${pageName}` : 'PAGE_COOKIE'
                const cookie = wx.getStorageSync(key)
                if (cookie) this.$$cookieInstance.deserialize(cookie)
            } catch (err) {
                // ignore
            }
        }
    }

    /**
     * Image 构造器
     */
    get $$imageConstructor() {
        return this.$_imageConstructor
    }

    get $$pageId() {
        return this.$_pageId
    }

    /**
     * 完整的 cookie，包括 httpOnly 也能获取到
     */
    get $$cookie() {
        return this.$_cookie.getCookie(this.URL, true)
    }

    /**
     * 获取 cookie 实例
     */
    get $$cookieInstance() {
        return this.$_cookie
    }

    /**
     * 创建内置组件的时候是否支持不用前缀写法
     */
    get $$notNeedPrefix() {
        if (!this.$_config) this.$_config = cache.getConfig()
        return this.$_config && this.$_config.runtime && this.$_config.runtime.wxComponent === 'noprefix'
    }

    /**
     * 设置页面显示状态
     */
    set $$visibilityState(value) {
        this.$_visibilityState = value
    }

    /**
     * 触发节点事件
     */
    $$trigger(eventName, options) {
        this.documentElement.$$trigger(eventName, options)
    }

    /**
     * 内部所有节点创建都走此接口，统一把控
     */
    $$createElement(options, tree) {
        const originTagName = options.tagName
        const tagName = originTagName.toUpperCase()
        let wxComponentName = null
        tree = tree || this.$_tree

        const constructorClass = CONSTRUCTOR_MAP[tagName]
        if (constructorClass) {
            return constructorClass.$$create(options, tree)
        // eslint-disable-next-line no-cond-assign
        } else if (wxComponentName = checkIsWxComponent(originTagName, this.$$notNeedPrefix)) {
            // 内置组件的特殊写法，转成 wx-component 节点
            options.tagName = 'wx-component'
            options.attrs = options.attrs || {}
            options.attrs.behavior = wxComponentName
            return WxComponent.$$create(options, tree)
        } else if (WX_CUSTOM_COMPONENT_MAP[originTagName]) {
            // 自定义组件的特殊写法，转成 wx-custom-component 节点
            options.tagName = 'wx-custom-component'
            options.attrs = options.attrs || {}
            options.componentName = originTagName
            return WxCustomComponent.$$create(options, tree)
        } else if (!tool.isTagNameSupport(tagName)) {
            return NotSupport.$$create(options, tree)
        } else {
            return Element.$$create(options, tree)
        }
    }

    /**
     * 内部所有文本节点创建都走此接口，统一把控
     */
    $$createTextNode(options, tree) {
        return TextNode.$$create(options, tree || this.$_tree)
    }

    /**
     * 内部所有注释节点创建都走此接口，统一把控
     */
    $$createComment(options, tree) {
        return Comment.$$create(options, tree || this.$_tree)
    }

    /**
     * 处理 Set-Cookie 头串
     */
    $$setCookie(str) {
        if (str && typeof str === 'string') {
            let start = 0
            let startSplit = 0
            let nextSplit = str.indexOf(',', startSplit)
            const cookies = []

            while (nextSplit >= 0) {
                const lastSplitStr = str.substring(start, nextSplit)
                const splitStr = str.substr(nextSplit)

                if (/^,\s*([^,=;\x00-\x1F]+)=([^;\n\r\0\x00-\x1F]*).*/.test(splitStr)) {
                // 分割成功，则上一片是完整 cookie
                    cookies.push(lastSplitStr)
                    start = nextSplit + 1
                }

                startSplit = nextSplit + 1
                nextSplit = str.indexOf(',', startSplit)
            }

            // 塞入最后一片 cookie
            cookies.push(str.substr(start))

            cookies.forEach(cookie => this.cookie = cookie)
        }
    }

    /**
     * 对外属性和方法
     */
    get nodeType() {
        return Node.DOCUMENT_NODE
    }

    get documentElement() {
        return this.$_node
    }

    get body() {
        return this.$_tree.root
    }

    get nodeName() {
        return '#document'
    }

    get head() {
        return this.$_head
    }

    get defaultView() {
        return cache.getWindow(this.$_pageId) || null
    }

    get URL() {
        if (this.defaultView) return this.defaultView.location.href

        return ''
    }

    get cookie() {
        return this.$_cookie.getCookie(this.URL)
    }

    set cookie(value) {
        if (!value || typeof value !== 'string') return

        this.$_cookie.setCookie(value, this.URL)
    }

    get visibilityState() {
        return this.$_visibilityState
    }

    get hidden() {
        return this.$_visibilityState === 'visible'
    }

    getElementById(id) {
        if (typeof id !== 'string') return

        return this.$_tree.getById(id) || null
    }

    getElementsByTagName(tagName) {
        if (typeof tagName !== 'string') return []

        return this.$_tree.getByTagName(tagName)
    }

    getElementsByClassName(className) {
        if (typeof className !== 'string') return []

        return this.$_tree.getByClassName(className)
    }

    getElementsByName(name) {
        if (typeof name !== 'string') return []

        return this.$_tree.query(`*[name=${name}]`)
    }

    querySelector(selector) {
        if (typeof selector !== 'string') return

        return this.$_tree.query(selector)[0] || null
    }

    querySelectorAll(selector) {
        if (typeof selector !== 'string') return []

        return this.$_tree.query(selector)
    }

    createElement(tagName) {
        if (typeof tagName !== 'string') return

        tagName = tagName.trim()
        if (!tagName) return

        return this.$$createElement({
            tagName,
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })
    }

    createElementNS(ns, tagName) {
        // 不支持真正意义上的 createElementNS，转成调用 createElement
        return this.createElement(tagName)
    }

    createTextNode(content) {
        content = '' + content

        return this.$$createTextNode({
            content,
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })
    }

    createComment() {
        // 忽略注释内容的传入
        return this.$$createComment({
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })
    }

    createDocumentFragment() {
        return Element.$$create({
            tagName: 'documentfragment',
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
            nodeType: Node.DOCUMENT_FRAGMENT_NODE,
        }, this.$_tree)
    }

    createEvent() {
        const window = cache.getWindow(this.$_pageId)

        return new window.CustomEvent()
    }

    addEventListener(eventName, handler, options) {
        this.documentElement.addEventListener(eventName, handler, options)
    }

    removeEventListener(eventName, handler, isCapture) {
        this.documentElement.removeEventListener(eventName, handler, isCapture)
    }

    dispatchEvent(evt) {
        this.documentElement.dispatchEvent(evt)
    }
}

module.exports = Document

}, function(modId) { var map = {"./event/event-target":1589353392149,"./tree/tree":1589353392152,"./node/node":1589353392154,"./node/element":1589353392155,"./node/text-node":1589353392162,"./node/comment":1589353392163,"./util/tool":1589353392145,"./util/cache":1589353392146,"./node/element/a":1589353392164,"./node/element/image":1589353392166,"./node/element/input":1589353392167,"./node/element/textarea":1589353392168,"./node/element/video":1589353392169,"./node/element/canvas":1589353392170,"./node/element/not-support":1589353392171,"./node/element/wx-component":1589353392172,"./node/element/wx-custom-component":1589353392173,"./bom/cookie":1589353392174}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392149, function(require, module, exports) {
const Event = require('./event')
const CustomEvent = require('./custom-event')

/**
 * 比较 touch 列表
 */
function compareTouchList(a, b) {
    if (a.length !== b.length) return false

    for (let i, len = a.length; i < len; i++) {
        const aItem = a[i]
        const bItem = b[i]

        if (aItem.identifier !== bItem.identifier) return false
        if (aItem.pageX !== bItem.pageX || aItem.pageY !== bItem.pageY || aItem.clientX !== bItem.clientX || aItem.clientY !== bItem.clientY) return false
    }

    return true
}

class EventTarget {
    constructor(...args) {
        this.$$init(...args)
    }

    /**
     * 初始化实例
     */
    $$init() {
        // 补充实例的属性，用于 'xxx' in XXX 判断
        this.ontouchstart = null
        this.ontouchmove = null
        this.ontouchend = null
        this.ontouchcancel = null
        this.oninput = null
        this.onfocus = null
        this.onblur = null
        this.onchange = null

        this.$_miniprogramEvent = null // 记录已触发的小程序事件
        this.$_eventHandlerMap = null
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        Object.keys(this).forEach(key => {
            // 处理 on 开头的属性
            if (key.indexOf('on') === 0) this[key] = null
            // 处理外部挂进来的私有的属性
            if (key[0] === '_') this[key] = null
            if (key[0] === '$' && (key[1] !== '_' && key[1] !== '$')) this[key] = null
        })

        this.$_miniprogramEvent = null
        this.$_eventHandlerMap = null
    }

    set $_eventHandlerMap(value) {
        this.$__eventHandlerMap = value
    }

    get $_eventHandlerMap() {
        if (!this.$__eventHandlerMap) this.$__eventHandlerMap = Object.create(null)
        return this.$__eventHandlerMap
    }

    /**
     * 触发事件捕获、冒泡流程
     */
    static $$process(target, eventName, miniprogramEvent, extra, callback) {
        let event

        if (eventName instanceof CustomEvent || eventName instanceof Event) {
            // 传入的是事件对象
            event = eventName
            eventName = event.type
        }

        eventName = eventName.toLowerCase()

        const path = [target]
        let parentNode = target.parentNode

        while (parentNode && parentNode.tagName !== 'HTML') {
            path.push(parentNode)
            parentNode = parentNode.parentNode
        }

        if (path[path.length - 1].tagName === 'BODY') {
            // 如果最后一个节点是 document.body，则追加 document.documentElement
            path.push(parentNode)
        }

        if (!event) {
            // 此处特殊处理，不直接返回小程序的 event 对象
            event = new Event({
                name: eventName,
                target,
                timeStamp: miniprogramEvent.timeStamp,
                touches: miniprogramEvent.touches,
                changedTouches: miniprogramEvent.changedTouches,
                bubbles: true, // 默认都可以冒泡 TODO
                $$extra: extra,
            })
        }

        // 捕获
        for (let i = path.length - 1; i >= 0; i--) {
            const currentTarget = path[i]

            if (!event.$$canBubble) break // 判定冒泡是否结束
            if (currentTarget === target) continue

            // wx-capture 节点事件单独触发
            if (currentTarget.tagName === 'WX-COMPONENT' && currentTarget.behavior === 'capture') continue

            event.$$setCurrentTarget(currentTarget)
            event.$$setEventPhase(Event.CAPTURING_PHASE)

            currentTarget.$$trigger(eventName, {
                event,
                isCapture: true,
            })
            if (callback) callback(currentTarget, event, true)
        }

        // 目标
        if (event.$$canBubble) {
            event.$$setCurrentTarget(target)
            event.$$setEventPhase(Event.AT_TARGET)

            // 捕获和冒泡阶段监听的事件都要触发
            target.$$trigger(eventName, {
                event,
                isCapture: true,
                isTarget: true,
            })
            if (callback) callback(target, event, true)

            target.$$trigger(eventName, {
                event,
                isCapture: false,
                isTarget: true,
            })
            if (callback) callback(target, event, false)
        }

        if (event.bubbles) {
            // 冒泡
            for (const currentTarget of path) {
                if (!event.$$canBubble) break // 判定冒泡是否结束
                if (currentTarget === target) continue

                // wx-capture 节点事件单独触发
                if (currentTarget.tagName === 'WX-COMPONENT' && currentTarget.behavior === 'capture') continue

                event.$$setCurrentTarget(currentTarget)
                event.$$setEventPhase(Event.BUBBLING_PHASE)

                currentTarget.$$trigger(eventName, {
                    event,
                    isCapture: false,
                })
                if (callback) callback(currentTarget, event, false)

                // wx-catch 节点事件要结束冒泡
                if (currentTarget.tagName === 'WX-COMPONENT' && currentTarget.behavior === 'catch') event.stopPropagation()
            }
        }

        // 重置事件
        event.$$setCurrentTarget(null)
        event.$$setEventPhase(Event.NONE)

        return event
    }

    /**
     * 获取 handlers
     */
    $_getHandlers(eventName, isCapture, isInit) {
        const handlerMap = this.$_eventHandlerMap

        if (isInit) {
            const handlerObj = handlerMap[eventName] = handlerMap[eventName] || {}

            handlerObj.capture = handlerObj.capture || []
            handlerObj.bubble = handlerObj.bubble || []

            return isCapture ? handlerObj.capture : handlerObj.bubble
        } else {
            const handlerObj = handlerMap[eventName]

            if (!handlerObj) return null

            return isCapture ? handlerObj.capture : handlerObj.bubble
        }
    }

    /**
     * 触发节点事件
     */
    $$trigger(eventName, {
        event, args = [], isCapture, isTarget
    } = {}) {
        eventName = eventName.toLowerCase()
        const handlers = this.$_getHandlers(eventName, isCapture)
        const onEventName = `on${eventName}`

        if ((!isCapture || !isTarget) && typeof this[onEventName] === 'function') {
            // 触发 onXXX 绑定的事件
            if (event && event.$$immediateStop) return
            try {
                this[onEventName].call(this || null, event, ...args)
            } catch (err) {
                console.error(err)
            }
        }

        if (handlers && handlers.length) {
            // 触发 addEventListener 绑定的事件
            handlers.forEach(handler => {
                if (event && event.$$immediateStop) return
                try {
                    handler.call(this || null, event, ...args)
                } catch (err) {
                    console.error(err)
                }
            })
        }
    }

    /**
     * 检查该事件是否可以触发
     */
    $$checkEvent(miniprogramEvent) {
        const last = this.$_miniprogramEvent
        const now = miniprogramEvent

        let flag = false

        if (!last || last.timeStamp !== now.timeStamp) {
            // 时间戳不同
            flag = true
        } else {
            if (last.touches && now.touches && !compareTouchList(last.touches, now.touches)) {
                // 存在不同的 touches
                flag = true
            } else if ((!last.touches && now.touches) || (last.touches && !now.touches)) {
                // 存在一方没有 touches
                flag = true
            }

            if (last.changedTouches && now.changedTouches && !compareTouchList(last.changedTouches, now.changedTouches)) {
                // 存在不同的 changedTouches
                flag = true
            } else if ((!last.changedTouches && now.changedTouches) || (last.changedTouches && !now.changedTouches)) {
                // 存在一方没有 changedTouches
                flag = true
            }
        }

        if (flag) this.$_miniprogramEvent = now
        return flag
    }

    /**
     * 清空某个事件的所有句柄
     */
    $$clearEvent(eventName, isCapture = false) {
        if (typeof eventName !== 'string') return

        eventName = eventName.toLowerCase()
        const handlers = this.$_getHandlers(eventName, isCapture)

        if (handlers && handlers.length) handlers.length = 0
    }

    /**
     * 是否存在事件句柄，只考虑通过 addEventListener 绑定的句柄
     */
    $$hasEventHandler(eventName) {
        eventName = eventName.toLowerCase()
        const bubbleHandlers = this.$_getHandlers(eventName, false)
        const captureHandlers = this.$_getHandlers(eventName, true)
        return (bubbleHandlers && bubbleHandlers.length) || (captureHandlers && captureHandlers.length)
    }

    /**
     * 对外属性和方法
     */
    addEventListener(eventName, handler, options) {
        if (typeof eventName !== 'string' || typeof handler !== 'function') return

        let isCapture = false

        if (typeof options === 'boolean') isCapture = options
        else if (typeof options === 'object') isCapture = options.capture

        eventName = eventName.toLowerCase()
        const handlers = this.$_getHandlers(eventName, isCapture, true)

        handlers.push(handler)
    }

    removeEventListener(eventName, handler, isCapture = false) {
        if (typeof eventName !== 'string' || typeof handler !== 'function') return

        eventName = eventName.toLowerCase()
        const handlers = this.$_getHandlers(eventName, isCapture)

        if (handlers && handlers.length) handlers.splice(handlers.indexOf(handler), 1)
    }

    dispatchEvent(evt) {
        if (evt instanceof CustomEvent) {
            EventTarget.$$process(this, evt)
        }

        // 因为不支持 preventDefault，所以永远返回 true
        return true
    }
}

module.exports = EventTarget

}, function(modId) { var map = {"./event":1589353392150,"./custom-event":1589353392151}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392150, function(require, module, exports) {
/**
 * 检查节点间的关系
 */
function checkRelation(node1, node2) {
    if (node1 === node2) return true

    while (node1) {
        if (node1 === node2) return true

        node1 = node1.parentNode
    }

    return false
}

class Event {
    constructor(options) {
        this.$_name = options.name.toLowerCase()
        this.$_target = options.target
        this.$_timeStamp = options.timeStamp || Date.now()
        this.$_currentTarget = options.currentTarget || options.target
        this.$_eventPhase = options.eventPhase || Event.NONE
        this.$_detail = options.detail || null
        this.$_immediateStop = false
        this.$_canBubble = true
        this.$_bubbles = options.bubbles || false
        this.$_touches = null
        this.$_targetTouches = null
        this.$_changedTouches = null
        this.$_cancelable = false

        // 补充字段
        const extra = options.$$extra
        if (extra) {
            Object.keys(extra).forEach(key => {
                this[key] = extra[key]
            })
        }

        // 处理 touches
        if (options.touches && options.touches.length) {
            this.$_touches = options.touches.map(touch => ({...touch, target: options.target}))

            this.$$checkTargetTouches()
        } else if (options.touches) {
            this.$_touches = []
            this.$_targetTouches = []
        }

        // 处理 changedTouches
        if (options.changedTouches && options.changedTouches.length) {
            this.$_changedTouches = options.changedTouches.map(touch => ({...touch, target: options.target}))
        } else if (options.changedTouches) {
            this.$_changedTouches = []
        }
    }

    /**
     * 返回事件是否立即停止
     */
    get $$immediateStop() {
        return this.$_immediateStop
    }

    /**
     * 返回事件时否还可以冒泡
     */
    get $$canBubble() {
        return this.$_canBubble
    }

    /**
     * 设置 target
     */
    $$setTarget(target) {
        this.$_target = target
    }

    /**
     * 设置 currentTarget
     */
    $$setCurrentTarget(currentTarget) {
        this.$_currentTarget = currentTarget
        this.$$checkTargetTouches()
    }

    /**
     * 设置事件所处阶段
     */
    $$setEventPhase(eventPhase) {
        this.$_eventPhase = eventPhase
    }

    /**
     * 检查 targetTouches
     */
    $$checkTargetTouches() {
        if (this.$_touches && this.$_touches.length) {
            this.$_targetTouches = this.$_touches.filter(touch => checkRelation(touch.target, this.$_currentTarget))
        }
    }

    /**
     * 对外属性和方法
     */
    get bubbles() {
        return this.$_bubbles
    }

    get cancelable() {
        return this.$_cancelable
    }

    get target() {
        return this.$_target
    }

    get currentTarget() {
        return this.$_currentTarget
    }

    get eventPhase() {
        return this.$_eventPhase
    }

    get type() {
        return this.$_name
    }

    get timeStamp() {
        return this.$_timeStamp
    }

    get touches() {
        return this.$_touches
    }

    get targetTouches() {
        return this.$_targetTouches
    }

    get changedTouches() {
        return this.$_changedTouches
    }

    set detail(value) {
        this.$_detail = value
    }

    get detail() {
        return this.$_detail
    }

    preventDefault() {
        // 目前仅支持 a 标签的点击阻止
        this.$_cancelable = true
    }

    stopPropagation() {
        if (this.eventPhase === Event.NONE) return

        this.$_canBubble = false
    }

    stopImmediatePropagation() {
        if (this.eventPhase === Event.NONE) return

        this.$_immediateStop = true
        this.$_canBubble = false
    }

    initEvent(name = '', bubbles) {
        if (typeof name !== 'string') return

        this.$_name = name.toLowerCase()
        this.$_bubbles = bubbles === undefined ? this.$_bubbles : !!bubbles
    }
}

// 静态属性
Event.NONE = 0
Event.CAPTURING_PHASE = 1
Event.AT_TARGET = 2
Event.BUBBLING_PHASE = 3

module.exports = Event

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392151, function(require, module, exports) {
const Event = require('./event')

class CustomEvent extends Event {
    constructor(name = '', options = {}) {
        super({
            name,
            ...options,
        })
    }
}

module.exports = CustomEvent

}, function(modId) { var map = {"./event":1589353392150}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392152, function(require, module, exports) {
const QuerySelector = require('./query-selector')

/**
 * 遍历 dom 树，收集类和标签对应的节点列表
 */
function walkDomTree(node, cache) {
    const tagMap = cache.tagMap = cache.tagMap || {}
    const classMap = cache.classMap = cache.classMap || {}
    const {tagName, classList} = node

    // 标签
    tagMap[tagName] = tagMap[tagName] || []
    tagMap[tagName].push(node)

    // 类
    for (const className of classList) {
        classMap[className] = classMap[className] || []
        classMap[className].push(node)
    }

    const children = node.children || []

    for (const child of children) {
        // 递归遍历
        walkDomTree(child, cache)
    }
}

class Tree {
    constructor(pageId, root, nodeIdMap, document) {
        this.pageId = pageId
        this.root = document.$$createElement(root, this)
        this.nodeIdMap = nodeIdMap
        this.idMap = {}
        this.document = document

        this.querySelector = new QuerySelector()
        if (nodeIdMap) nodeIdMap[root.nodeId] = this.root

        this.walk(root, this.root)
    }

    /**
     * 遍历 ast
     */
    walk(ast, parentNode) {
        const children = ast.children
        const idMap = this.idMap
        const nodeIdMap = this.nodeIdMap
        const document = this.document

        if (!children || !children.length) return

        // 遍历子节点
        for (const child of children) {
            let childNode

            if (child.type === 'element') {
                childNode = document.$$createElement(child, this)
            } else if (child.type === 'text') {
                childNode = document.$$createTextNode(child, this)
            }

            // 处理 id 缓存
            const id = childNode.id
            if (id && !idMap[id]) {
                idMap[id] = childNode
            }

            // 处理 nodeId 缓存
            if (nodeIdMap) nodeIdMap[child.nodeId] = childNode

            // 插入子节点
            parentNode.appendChild(childNode)

            // 遍历子节点的 ast
            this.walk(child, childNode)
        }
    }

    /**
     * 更新 idMap
     */
    updateIdMap(id, node) {
        this.idMap[id] = node
    }

    /**
     * 根据 id 获取节点
     */
    getById(id) {
        return this.idMap[id]
    }

    /**
     * 根据标签名获取节点列表
     */
    getByTagName(tagName, node) {
        const cache = {}
        walkDomTree(node || this.root, cache)

        return cache.tagMap[tagName.toUpperCase()] || []
    }

    /**
     * 根据类名获取节点列表
     */
    getByClassName(className, node) {
        const cache = {}
        walkDomTree(node || this.root, cache)

        return cache.classMap[className] || []
    }

    /**
     * 查询符合条件的节点
     */
    query(selector, node) {
        const cache = {}
        walkDomTree(node || this.root, cache)

        return this.querySelector.exec(selector, {
            idMap: this.idMap,
            tagMap: cache.tagMap,
            classMap: cache.classMap,
        })
    }
}

module.exports = Tree

}, function(modId) { var map = {"./query-selector":1589353392153}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392153, function(require, module, exports) {
/**
 * 感谢 sizzle：https://github.com/jquery/sizzle/tree/master
 */

const PSEUDO_CHECK = {
    checked: node => node.checked || node.selected,
    disabled: node => node.disabled,
    enabled: node => !node.disabled,
    'first-child': node => node.parentNode.children[0] === node,
    'last-child': node => node.parentNode.children[node.parentNode.children.length - 1] === node,
    'nth-child': (node, param) => {
        const children = node.parentNode.children
        const {a, b} = param
        const index = children.indexOf(node) + 1

        if (a) {
            return (index - b) % a === 0
        } else {
            return index === b
        }
    },
}

const ATTR_CHECK = {
    '=': (nodeVal, val) => nodeVal === val,
    '~=': (nodeVal, val) => nodeVal.split(/\s+/).indexOf(val) !== -1,
    '|=': (nodeVal, val) => nodeVal === val || nodeVal.indexOf(val + '-') === 0,
    '^=': (nodeVal, val) => nodeVal.indexOf(val) === 0,
    '$=': (nodeVal, val) => nodeVal.substr(nodeVal.length - val.length) === val,
    '*=': (nodeVal, val) => nodeVal.indexOf(val) !== -1,
}

const KINSHIP_CHECK = {
    ' ': (node, kinshipRule) => {
        let kinshipNode = node.parentNode

        while (kinshipNode) {
            if (checkHit(kinshipNode, kinshipRule)) return kinshipNode

            kinshipNode = kinshipNode.parentNode
        }

        return null
    },
    '>': (node, kinshipRule) => {
        const kinshipNode = node.parentNode

        return checkHit(kinshipNode, kinshipRule) ? kinshipNode : null
    },
    '+': (node, kinshipRule) => {
        const children = node.parentNode

        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i]

            if (child === node) {
                const kinshipNode = children[i - 1]

                return checkHit(kinshipNode, kinshipRule) ? kinshipNode : null
            }
        }

        return null
    },
    '~': (node, kinshipRule) => {
        const children = node.parentNode
        let foundCurrent = false

        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i]

            if (foundCurrent && checkHit(child, kinshipRule)) return child
            if (child === node) foundCurrent = true
        }

        return null
    },
}

/**
 * 检查节点是否符合规则
 */
function checkHit(node, rule) {
    if (!node) return false

    const {
        id, class: classList, tag, pseudo, attr
    } = rule

    // id 选择器
    if (id) {
        if (node.id !== id) return false
    }

    // 类选择器
    if (classList && classList.length) {
        for (const className of classList) {
            if (!node.classList || !node.classList.contains(className)) return false
        }
    }

    // 标签选择器
    if (tag && tag !== '*') {
        if (node.tagName !== tag.toUpperCase()) return false
    }

    // 伪类选择器
    if (pseudo) {
        for (const {name, param} of pseudo) {
            const checkPseudo = PSEUDO_CHECK[name]
            if (!checkPseudo || !checkPseudo(node, param)) return false
        }
    }

    // 属性选择器
    if (attr) {
        for (const {name, opr, val} of attr) {
            const nodeVal = node[name] || node.getAttribute(name)

            if (nodeVal === undefined) return false
            if (opr) {
                // 存在操作符
                const checkAttr = ATTR_CHECK[opr]
                if (!checkAttr || !checkAttr(nodeVal, val)) return false
            }
        }
    }

    return true
}

/**
 * 数组去重
 */
function unique(list) {
    for (let i = 0; i < list.length; i++) {
        const a = list[i]

        for (let j = i + 1; j < list.length; j++) {
            const b = list[j]
            if (a === b) list.splice(j, 1)
        }
    }

    return list
}

/**
 * 将节点按照文档顺序排列
 */
function sortNodes(list) {
    list.sort((a, b) => {
        const aList = [a]
        const bList = [b]
        let aParent = a.parentNode
        let bParent = b.parentNode

        if (aParent === bParent) {
            // 检查顺序
            const children = aParent.children
            return children.indexOf(a) - children.indexOf(b)
        }

        // a 到根的列表
        while (aParent) {
            aList.unshift(aParent)
            aParent = aParent.parentNode
        }

        // b 到根的列表
        while (bParent) {
            bList.unshift(bParent)
            bParent = bParent.parentNode
        }

        // 找到最近共同祖先
        let i = 0
        while (aList[i] === bList[i]) i++

        // 检查顺序
        const children = aList[i - 1].children
        return children.indexOf(aList[i]) - children.indexOf(bList[i])
    })

    return list
}

class QuerySelector {
    constructor() {
        this.parseCache = {} // 解析查询串缓存
        this.parseCacheKeys = []

        const idReg = '#([\\\\\\w-]+)' // id 选择器
        const tagReg = '\\*|wx-component|[a-zA-Z-]\\w*' // 标签选择器
        const classReg = '\\.([\\\\\\w-]+)' // 类选择器
        const pseudoReg = ':([\\\\\\w-]+)(?:\\(([^\\(\\)]*|(?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\))?' // 伪类选择器
        const attrReg = '\\[\\s*([\\\\\\w-]+)(?:([*^$|~!]?=)[\'"]?([^\'"\\[]+)[\'"]?)?\\s*\\]' // 属性选择器
        const kinshipReg = '\\s*([>\\s+~](?!=))\\s*' // 亲属选择器
        this.regexp = new RegExp(`^(?:(${idReg})|(${tagReg})|(${classReg})|(${pseudoReg})|(${attrReg})|(${kinshipReg}))`)
    }

    /**
     * 存入解析查询串缓存
     */
    setParseCache(key, value) {
        if (this.parseCacheKeys.length > 50) {
            delete this.parseCache[this.parseCacheKeys.shift()]
        }

        this.parseCacheKeys.push(key)
        this.parseCache[key] = value

        return value
    }

    /**
     * 获取解析查询串缓存
     */
    getParseCache(key) {
        return this.parseCache[key]
    }

    /**
     * 解析查询串
     */
    parse(selector) {
        const segment = [{tag: '*'}]
        const regexp = this.regexp

        const onProcess = (all, idAll, id, tagAll, classAll, className, pseudoAll, pseudoName, pseudoParam, attrAll, attrName, attrOpr, attrVal, kinshipAll, kinship) => {
            if (idAll) {
                // id 选择器
                segment[segment.length - 1].id = id
            } else if (tagAll) {
                // 标签选择器
                segment[segment.length - 1].tag = tagAll.toLowerCase()
            } else if (classAll) {
                // 类选择器
                const currentRule = segment[segment.length - 1]
                currentRule.class = currentRule.class || []

                currentRule.class.push(className)
            } else if (pseudoAll) {
                // 伪类选择器
                const currentRule = segment[segment.length - 1]
                currentRule.pseudo = currentRule.pseudo || []
                pseudoName = pseudoName.toLowerCase()

                const pseudo = {name: pseudoName}

                if (pseudoParam) pseudoParam = pseudoParam.trim()
                if (pseudoName === 'nth-child') {
                    // 处理 nth-child 伪类，参数统一处理成 an + b 的格式
                    pseudoParam = pseudoParam.replace(/\s+/g, '')

                    if (pseudoParam === 'even') {
                        // 偶数个
                        pseudoParam = {a: 2, b: 2}
                    } else if (pseudoParam === 'odd') {
                        // 奇数个
                        pseudoParam = {a: 2, b: 1}
                    } else if (pseudoParam) {
                        // 其他表达式
                        const nthParsed = pseudoParam.match(/^(?:(\d+)|(\d*)?n([+-]\d+)?)$/)

                        if (!nthParsed) {
                            // 解析失败
                            pseudoParam = {a: 0, b: 1}
                        } else if (nthParsed[1]) {
                            // 纯数字
                            pseudoParam = {a: 0, b: +nthParsed[1]}
                        } else {
                            // 表达式
                            pseudoParam = {
                                a: nthParsed[2] ? +nthParsed[2] : 1,
                                b: nthParsed[3] ? +nthParsed[3] : 0,
                            }
                        }
                    } else {
                        // 默认取第一个
                        pseudoParam = {a: 0, b: 1}
                    }
                }
                if (pseudoParam) pseudo.param = pseudoParam

                currentRule.pseudo.push(pseudo)
            } else if (attrAll) {
                // 属性选择器
                const currentRule = segment[segment.length - 1]

                currentRule.attr = currentRule.attr || []
                currentRule.attr.push({
                    name: attrName,
                    opr: attrOpr,
                    val: attrVal
                })
            } else if (kinshipAll) {
                // 亲属选择器
                segment[segment.length - 1].kinship = kinship
                segment.push({tag: '*'}) // 插入新规则
            }

            return ''
        }

        // 逐个选择器解析
        let lastParse
        selector = selector.replace(regexp, onProcess)

        while (lastParse !== selector) {
            lastParse = selector
            selector = selector.replace(regexp, onProcess)
        }

        return selector ? '' : segment
    }

    /**
     * 查询符合条件的节点
     */
    exec(selector, extra) {
        selector = selector.trim().replace(/\s+/g, ' ').replace(/\s*(,|[>\s+~](?!=)|[*^$|~!]?=)\s*/g, '$1')
        const {idMap, tagMap, classMap} = extra

        // 查询缓存
        let segment = this.getParseCache(selector)

        // 无缓存，进行解析
        if (!segment) {
            segment = this.parse(selector)

            // 无法正常解析
            if (!segment) return []

            this.setParseCache(selector, segment)
        }

        // 无解析结果
        if (!segment[0]) return []

        // 执行解析结果
        const lastRule = segment[segment.length - 1] // 从右往左
        const {id, class: classList, tag} = lastRule
        let hitNodes = []

        // 寻找可能符合要求的节点
        if (id) {
            // id 选择器
            const node = idMap[id]
            hitNodes = node ? [node] : []
        } else if (classList && classList.length) {
            // 类选择器
            for (const className of classList) {
                const classNodes = classMap[className]
                if (classNodes) {
                    for (const classNode of classNodes) {
                        if (hitNodes.indexOf(classNode) === -1) hitNodes.push(classNode)
                    }
                }
            }
        } else if (tag && tag !== '*') {
            // 标签选择器，查询指定标签
            const tagName = tag.toUpperCase()
            const tagNodes = tagMap[tagName]
            if (tagNodes) hitNodes = tagNodes
        } else {
            // 标签选择器，查询全部节点
            Object.keys(tagMap).forEach(key => {
                const tagNodes = tagMap[key]
                if (tagNodes) {
                    for (const tagNode of tagNodes) hitNodes.push(tagNode)
                }
            })
        }

        // 从下往上过滤节点列表
        if (hitNodes.length && segment.length) {
            for (let i = hitNodes.length - 1; i >= 0; i--) {
                let checkNode = hitNodes[i]
                let isMatched = false

                // 从右往左进行规则过滤
                for (let j = segment.length - 1; j >= 0; j--) {
                    const prevRule = segment[j - 1]

                    // 检查待选节点，后续的亲属节点不需要再检查
                    if (j === segment.length - 1) isMatched = checkHit(checkNode, lastRule)

                    if (isMatched && prevRule) {
                        // 检查亲属选择器
                        const kinship = prevRule.kinship
                        const checkKinship = KINSHIP_CHECK[kinship]

                        if (checkKinship) checkNode = checkKinship(checkNode, prevRule)

                        if (!checkNode) {
                            // 亲属检查失败
                            isMatched = false
                            break
                        }
                    } else {
                        break
                    }
                }

                if (!isMatched) hitNodes.splice(i, 1) // 不符合，从待选节点列表中删除
            }
        }

        if (hitNodes.length) {
            // 去重、排序
            hitNodes = unique(hitNodes)
            hitNodes = sortNodes(hitNodes)
        }

        return hitNodes
    }
}

module.exports = QuerySelector

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392154, function(require, module, exports) {
const EventTarget = require('../event/event-target')
const cache = require('../util/cache')

class Node extends EventTarget {
    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init()

        this.$_nodeId = options.nodeId // 唯一标识
        this.$_type = options.type
        this.$_parentNode = null
        this.$_tree = tree
        this.$_pageId = tree.pageId
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_nodeId = null
        this.$_type = null
        this.$_parentNode = null
        this.$_tree = null
        this.$_pageId = null
    }

    /**
     * 内部 nodeId
     */
    get $$nodeId() {
        return this.$_nodeId
    }

    /**
     * 内部 pageId
     */
    get $$pageId() {
        return this.$_pageId
    }

    /**
     * 更新 parentNode
     */
    $$updateParent(parentNode = null) {
        this.$_parentNode = parentNode
    }

    /**
     * 对外属性和方法
     */
    get parentNode() {
        return this.$_parentNode
    }

    get nodeValue() {
        return null
    }

    get previousSibling() {
        const childNodes = this.parentNode && this.parentNode.childNodes || []
        const index = childNodes.indexOf(this)

        if (index > 0) {
            return childNodes[index - 1]
        }

        return null
    }

    get previousElementSibling() {
        const childNodes = this.parentNode && this.parentNode.childNodes || []
        const index = childNodes.indexOf(this)

        if (index > 0) {
            for (let i = index - 1; i >= 0; i--) {
                if (childNodes[i].nodeType === Node.ELEMENT_NODE) {
                    return childNodes[i]
                }
            }
        }

        return null
    }

    get nextSibling() {
        const childNodes = this.parentNode && this.parentNode.childNodes || []
        const index = childNodes.indexOf(this)

        return childNodes[index + 1] || null
    }

    get nextElementSibling() {
        const childNodes = this.parentNode && this.parentNode.childNodes || []
        const index = childNodes.indexOf(this)

        if (index < childNodes.length - 1) {
            for (let i = index + 1, len = childNodes.length; i < len; i++) {
                if (childNodes[i].nodeType === Node.ELEMENT_NODE) {
                    return childNodes[i]
                }
            }
        }

        return null
    }

    get ownerDocument() {
        return cache.getDocument(this.$_pageId) || null
    }

    get childNodes() {
        return []
    }

    hasChildNodes() {
        return false
    }

    remove() {
        if (!this.parentNode || !this.parentNode.removeChild) return this

        return this.parentNode.removeChild(this)
    }
}

// 静态属性
Node.ELEMENT_NODE = 1
Node.TEXT_NODE = 3
Node.CDATA_SECTION_NODE = 4
Node.PROCESSING_INSTRUCTION_NODE = 7
Node.COMMENT_NODE = 8
Node.DOCUMENT_NODE = 9
Node.DOCUMENT_TYPE_NODE = 10
Node.DOCUMENT_FRAGMENT_NODE = 11

module.exports = Node

}, function(modId) { var map = {"../event/event-target":1589353392149,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392155, function(require, module, exports) {
const Node = require('./node')
const ClassList = require('./class-list')
const Style = require('./style')
const Attribute = require('./attribute')
const cache = require('../util/cache')
const parser = require('../tree/parser')
const tool = require('../util/tool')
const Pool = require('../util/pool')

const pool = new Pool()

class Element extends Node {
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

        return new Element(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        options.type = 'element'

        super.$$init(options, tree)

        this.$_tagName = options.tagName || ''
        this.$_children = []
        this.$_nodeType = options.nodeType || Node.ELEMENT_NODE
        this.$_unary = !!parser.voidMap[this.$_tagName.toLowerCase()]
        this.$_notTriggerUpdate = false
        this.$_dataset = null
        this.$_classList = null
        this.$_style = null
        this.$_attrs = null

        this.$_initAttrs(options.attrs)

        // 补充实例的属性，用于 'xxx' in XXX 判断
        this.onclick = null
        this.ontouchstart = null
        this.ontouchmove = null
        this.ontouchend = null
        this.ontouchcancel = null
        this.onload = null
        this.onerror = null
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_tagName = ''
        this.$_children.length = 0
        this.$_nodeType = Node.ELEMENT_NODE
        this.$_unary = null
        this.$_notTriggerUpdate = false
        this.$_dataset = null
        this.$_classList = null
        this.$_style = null
        this.$_attrs = null
    }

    /**
     * 回收实例
     */
    $$recycle() {
        this.$_children.forEach(child => child.$$recycle())
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.elementMultiplexing) {
            // 复用 element 节点
            pool.add(this)
        }
    }

    /**
     * 延迟创建内部属性对象
     */
    set $_dataset(value) {
        this.$__dataset = value
    }

    get $_dataset() {
        if (!this.$__dataset) this.$__dataset = Object.create(null)
        return this.$__dataset
    }

    set $_classList(value) {
        if (!value && this.$__classList) this.$__classList.$$recycle()
        this.$__classList = value
    }

    get $_classList() {
        if (!this.$__classList) this.$__classList = ClassList.$$create(this.$_onClassOrStyleUpdate.bind(this))
        return this.$__classList
    }

    set $_style(value) {
        if (!value && this.$__style) this.$__style.$$recycle()
        this.$__style = value
    }

    get $_style() {
        if (!this.$__style) this.$__style = Style.$$create(this.$_onClassOrStyleUpdate.bind(this))
        return this.$__style
    }

    set $_attrs(value) {
        if (!value && this.$__attrs) this.$__attrs.$$recycle()
        this.$__attrs = value
    }

    get $_attrs() {
        if (!this.$__attrs) this.$__attrs = Attribute.$$create(this, this.$_triggerParentUpdate.bind(this))
        return this.$__attrs
    }

    /**
     * 初始化属性
     */
    $_initAttrs(attrs = {}) {
        // 防止一开始就创建 $_attrs
        const attrKeys = Object.keys(attrs)
        if (!attrKeys.length) return

        this.$_notTriggerUpdate = true // 初始化不触发更新

        attrKeys.forEach(name => {
            if (name.indexOf('data-') === 0) {
                // dataset
                const datasetName = tool.toCamel(name.substr(5))
                this.$_dataset[datasetName] = attrs[name]
            } else {
                // 其他属性
                this.setAttribute(name, attrs[name])
            }
        })

        this.$_notTriggerUpdate = false // 重启触发更新
    }

    /**
     * 监听 class 或 style 属性值变化
     */
    $_onClassOrStyleUpdate() {
        if (this.$__attrs) this.$_attrs.triggerUpdate()
        this.$_triggerParentUpdate()
    }

    /**
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        if (this.parentNode && !this.$_notTriggerUpdate) this.parentNode.$$trigger('$$childNodesUpdate')
        if (!this.$_notTriggerUpdate) this.$$trigger('$$domNodeUpdate')
    }

    /**
     * 更新子组件树
     */
    $_triggerMeUpdate() {
        if (!this.$_notTriggerUpdate) this.$$trigger('$$childNodesUpdate')
    }

    /**
     * 更新子节点变动引起的映射表修改
     */
    $_updateChildrenExtra(node, isRemove) {
        const id = node.id

        // 更新 nodeId - dom 映射表
        if (isRemove) {
            cache.setNode(this.$_pageId, node.$$nodeId, null)
        } else {
            cache.setNode(this.$_pageId, node.$$nodeId, node)
        }

        // 更新 id - dom 映射表
        if (id) {
            if (isRemove) {
                this.$_tree.updateIdMap(id, null)
            } else {
                this.$_tree.updateIdMap(id, node)
            }
        }

        if (node.childNodes && node.childNodes.length) {
            for (const child of node.childNodes) {
                this.$_updateChildrenExtra(child, isRemove)
            }
        }
    }

    /**
     * 遍历 dom 树，生成 html
     */
    $_generateHtml(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 文本节点
            return node.textContent
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 元素
            const tagName = node.tagName.toLowerCase()
            let html = `<${tagName}`

            // 属性
            if (node.id) html += ` id="${node.id}"`
            if (node.className) html += ` class="${node.className}"`

            const styleText = node.style.cssText
            if (styleText) html += ` style="${styleText}"`

            const src = node.src
            if (src) html += ` src=${src}`

            const dataset = node.dataset
            Object.keys(dataset).forEach(name => {
                html += ` data-${tool.toDash(name)}="${dataset[name]}"`
            })

            html = this.$$dealWithAttrsForGenerateHtml(html, node)

            if (node.$$isUnary) {
                // 空标签
                return `${html} />`
            } else {
                const childrenHtml = node.childNodes.map(child => this.$_generateHtml(child)).join('')
                return `${html}>${childrenHtml}</${tagName}>`
            }
        }
    }

    /**
     * 遍历 ast，生成 dom 树
     */
    $_generateDomTree(node) {
        const {
            type,
            tagName = '',
            attrs = [],
            children = [],
            content = '',
        } = node

        const nodeId = `b-${tool.getId()}` // 运行时生成，使用 b- 前缀

        if (type === 'element') {
            // 元素
            const attrsMap = {}

            // 属性列表转化成 map
            for (const attr of attrs) {
                const name = attr.name
                let value = attr.value

                if (name === 'style') value = value && value.replace('"', '\'') || ''

                attrsMap[name] = value
            }

            const element = this.ownerDocument.$$createElement({
                tagName, attrs: attrsMap, nodeId
            })

            for (let child of children) {
                child = this.$_generateDomTree(child)

                if (child) element.appendChild(child)
            }

            return element
        } else if (type === 'text') {
            // 文本
            return this.ownerDocument.$$createTextNode({
                content: tool.decodeContent(content), nodeId
            })
        } else if (type === 'comment') {
            // 注释
            return this.ownerDocument.createComment()
        }
    }

    /**
     * 对应的 dom 信息
     */
    get $$domInfo() {
        return {
            nodeId: this.$$nodeId,
            pageId: this.$$pageId,
            type: this.$_type,
            tagName: this.$_tagName,
            id: this.id,
            className: this.className,
            style: this.$__style ? this.style.cssText : '',
        }
    }

    /**
     * 是否空标签
     */
    get $$isUnary() {
        return this.$_unary
    }

    /**
     * 调用 $_generateHtml 接口时用于处理额外的属性
     */
    $$dealWithAttrsForGenerateHtml(html) {
        // 具体实现逻辑由子类实现
        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML() {
        // ignore，具体实现逻辑由子类实现
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        // 具体实现逻辑由子类实现
        return {}
    }

    /**
     * 小程序端的 getBoundingClientRect 实现
     * https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.scrollOffset.html
     * https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.boundingClientRect.html
     */
    $$getBoundingClientRect() {
        tool.flushThrottleCache() // 先清空 setData
        const window = cache.getWindow(this.$_pageId)
        return new Promise((resolve, reject) => {
            if (!window) reject()

            if (this.tagName === 'BODY') {
                window.$$createSelectorQuery().selectViewport().scrollOffset(res => (res ? resolve(res) : reject())).exec()
            } else {
                window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`).boundingClientRect(res => (res ? resolve(res) : reject())).exec()
            }
        })
    }

    /**
     * 获取对应小程序组件的 context 对象
     */
    $$getContext() {
        tool.flushThrottleCache() // 先清空 setData
        const window = cache.getWindow(this.$_pageId)
        return new Promise((resolve, reject) => {
            if (!window) reject()

            if (this.tagName === 'CANVAS') {
                // TODO，为了兼容基础库的一个 bug，暂且如此实现
                wx.createSelectorQuery().in(this._wxComponent).select(`.node-${this.$_nodeId}`).context(res => (res && res.context ? resolve(res.context) : reject()))
                    .exec()
            } else {
                window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`).context(res => (res && res.context ? resolve(res.context) : reject())).exec()
            }
        })
    }

    /**
     * 获取对应节点的 NodesRef 对象
     * https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.html
     */
    $$getNodesRef() {
        tool.flushThrottleCache() // 先清空 setData
        const window = cache.getWindow(this.$_pageId)
        return new Promise((resolve, reject) => {
            if (!window) reject()

            if (this.tagName === 'CANVAS') {
                // TODO，为了兼容基础库的一个 bug，暂且如此实现
                resolve(wx.createSelectorQuery().in(this._wxComponent).select(`.node-${this.$_nodeId}`))
            } else {
                resolve(window.$$createSelectorQuery().select(`.miniprogram-root >>> .node-${this.$_nodeId}`))
            }
        })
    }

    /**
     * 设置属性，但不触发更新
     */
    $$setAttributeWithoutUpdate(name, value) {
        if (typeof name !== 'string') return

        this.$_notTriggerUpdate = true
        this.$_attrs.set(name, value)
        this.$_notTriggerUpdate = false
    }

    /**
     * 对外属性和方法
     */
    get id() {
        if (!this.$__attrs) return ''

        return this.$_attrs.get('id')
    }

    set id(id) {
        if (typeof id !== 'string') return

        id = id.trim()
        const oldId = this.$_attrs.get('id')
        this.$_attrs.set('id', id)

        if (id === oldId) return

        // 更新 tree
        if (this.$_tree.getById(oldId) === this) this.$_tree.updateIdMap(oldId, null)
        if (id) this.$_tree.updateIdMap(id, this)
        this.$_triggerParentUpdate()
    }

    get tagName() {
        return this.$_tagName.toUpperCase()
    }

    get className() {
        if (!this.$__classList) return ''

        return this.$_classList.toString()
    }

    set className(className) {
        if (typeof className !== 'string') return

        this.$_classList.$$parse(className)
    }

    get classList() {
        return this.$_classList
    }

    get nodeName() {
        return this.tagName
    }

    get nodeType() {
        return this.$_nodeType
    }

    get childNodes() {
        return this.$_children
    }

    get children() {
        return this.$_children.filter(child => child.nodeType === Node.ELEMENT_NODE)
    }

    get firstChild() {
        return this.$_children[0]
    }

    get lastChild() {
        return this.$_children[this.$_children.length - 1]
    }

    get innerHTML() {
        return this.$_children.map(child => this.$_generateHtml(child)).join('')
    }

    set innerHTML(html) {
        if (typeof html !== 'string') return

        const fragment = this.ownerDocument.$$createElement({
            tagName: 'documentfragment',
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
            nodeType: Node.DOCUMENT_FRAGMENT_NODE,
        })

        // 解析成 ast
        let ast = null
        try {
            ast = parser.parse(html)
        } catch (err) {
            console.error(err)
        }

        if (!ast) return

        // 生成 dom 树
        ast.forEach(item => {
            const node = this.$_generateDomTree(item)
            if (node) fragment.appendChild(node)
        })

        // 删除所有子节点
        this.$_children.forEach(node => {
            node.$$updateParent(null)

            // 更新映射表
            this.$_updateChildrenExtra(node, true)
        })
        this.$_children.length = 0

        // 追加新子节点
        if (this.$_tagName === 'table') {
            // table 节点需要判断是否存在 tbody
            let hasTbody = false

            for (const child of fragment.childNodes) {
                if (child.tagName === 'TBODY') {
                    hasTbody = true
                    break
                }
            }

            if (!hasTbody) {
                const tbody = this.ownerDocument.$$createElement({
                    tagName: 'tbody',
                    attrs: {},
                    nodeType: Node.ELEMENT_NODE,
                    nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
                })

                tbody.appendChild(fragment)
                this.appendChild(tbody)
            }
        } else {
            this.appendChild(fragment)
        }
    }

    get outerHTML() {
        return this.$_generateHtml(this)
    }

    set outerHTML(html) {
        if (typeof html !== 'string') return

        // 解析成 ast，只取第一个作为当前节点
        let ast = null
        try {
            ast = parser.parse(html)[0]
        } catch (err) {
            console.error(err)
        }

        if (ast) {
            // 生成 dom 树
            const node = this.$_generateDomTree(ast)

            // 删除所有子节点
            this.$_children.forEach(node => {
                node.$$updateParent(null)

                // 更新映射表
                this.$_updateChildrenExtra(node, true)
            })
            this.$_children.length = 0

            this.$_notTriggerUpdate = true // 先不触发更新

            // 追加新子节点
            const children = [].concat(node.childNodes)
            for (const child of children) {
                this.appendChild(child)
            }

            this.$_tagName = node.tagName.toLowerCase()
            this.id = node.id || ''
            this.className = node.className || ''
            this.style.cssText = node.style.cssText || ''
            this.src = node.src || ''
            this.$_dataset = Object.assign({}, node.dataset)

            this.$$dealWithAttrsForOuterHTML(node)

            this.$_notTriggerUpdate = false // 重启触发更新
            this.$_triggerParentUpdate()
        }
    }

    get innerText() {
        // WARN：此处处理成和 textContent 一致，不去判断是否会渲染出来的情况
        return this.textContent
    }

    set innerText(text) {
        this.textContent = text
    }

    get textContent() {
        return this.$_children.map(child => child.textContent).join('')
    }

    set textContent(text) {
        text = '' + text

        // 删除所有子节点
        this.$_children.forEach(node => {
            node.$$updateParent(null)

            // 更新映射表
            this.$_updateChildrenExtra(node, true)
        })
        this.$_children.length = 0

        // 空串不新增 textNode 节点
        if (!text) return

        const nodeId = `b-${tool.getId()}` // 运行时生成，使用 b- 前缀
        const child = this.ownerDocument.$$createTextNode({content: text, nodeId})

        this.appendChild(child)
    }

    get style() {
        return this.$_style
    }

    set style(value) {
        this.$_style.cssText = value
    }

    get dataset() {
        return this.$_dataset
    }

    get attributes() {
        return this.$_attrs.list
    }

    get src() {
        if (!this.$__attrs) return ''

        return this.$_attrs.get('src')
    }

    set src(value) {
        value = '' + value
        this.$_attrs.set('src', value)
    }

    cloneNode(deep) {
        const dataset = {}
        Object.keys(this.$_dataset).forEach(name => {
            dataset[`data-${tool.toDash(name)}`] = this.$_dataset[name]
        })

        const newNode = this.ownerDocument.$$createElement({
            tagName: this.$_tagName,
            attrs: {
                id: this.id,
                class: this.className,
                style: this.style.cssText,
                src: this.src,

                ...dataset,
                ...this.$$dealWithAttrsForCloneNode(),
            },
            nodeType: this.$_nodeType,
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })

        if (deep) {
            // 深克隆
            for (const child of this.$_children) {
                newNode.appendChild(child.cloneNode(deep))
            }
        }

        return newNode
    }

    appendChild(node) {
        if (!(node instanceof Node)) return

        let nodes
        let hasUpdate = false

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // documentFragment
            nodes = [].concat(node.childNodes)
        } else {
            nodes = [node]
        }

        for (const node of nodes) {
            if (node === this) continue
            if (node.parentNode) node.parentNode.removeChild(node)

            this.$_children.push(node)
            node.$$updateParent(this) // 设置 parentNode

            // 更新映射表
            this.$_updateChildrenExtra(node)

            hasUpdate = true
        }

        // 触发 webview 端更新
        if (hasUpdate) this.$_triggerMeUpdate()

        return this
    }

    removeChild(node) {
        if (!(node instanceof Node)) return

        const index = this.$_children.indexOf(node)

        if (index >= 0) {
            // 已经插入，需要删除
            this.$_children.splice(index, 1)

            node.$$updateParent(null)

            // 更新映射表
            this.$_updateChildrenExtra(node, true)

            // 触发 webview 端更新
            this.$_triggerMeUpdate()
        }

        return node
    }

    insertBefore(node, ref) {
        if (!(node instanceof Node)) return
        if (ref && !(ref instanceof Node)) return

        let nodes
        let hasUpdate = false

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // documentFragment
            nodes = []
            for (let i = 0; i < node.childNodes.length; i++) {
                // 因为是逐个插入，所以需要逆序
                nodes.push(node.childNodes[i])
            }
        } else {
            nodes = [node]
        }

        for (const node of nodes) {
            if (node === this) continue
            if (node.parentNode) node.parentNode.removeChild(node)

            const insertIndex = ref ? this.$_children.indexOf(ref) : -1

            if (insertIndex === -1) {
                // 插入到末尾
                this.$_children.push(node)
            } else {
                // 插入到 ref 之前
                this.$_children.splice(insertIndex, 0, node)
            }

            node.$$updateParent(this) // 设置 parentNode

            // 更新映射表
            this.$_updateChildrenExtra(node)

            hasUpdate = true
        }


        // 触发 webview 端更新
        if (hasUpdate) this.$_triggerMeUpdate()

        return node
    }

    replaceChild(node, old) {
        if (!(node instanceof Node) || !(old instanceof Node)) return

        let nodes
        let hasUpdate = false

        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // documentFragment
            nodes = []
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                // 因为是逐个插入，所以需要逆序
                nodes.push(node.childNodes[i])
            }
        } else {
            nodes = [node]
        }

        const replaceIndex = this.$_children.indexOf(old)
        if (replaceIndex !== -1) this.$_children.splice(replaceIndex, 1)

        for (const node of nodes) {
            if (node === this) continue
            if (node.parentNode) node.parentNode.removeChild(node)

            if (replaceIndex === -1) {
                // 插入到末尾
                this.$_children.push(node)
            } else {
                // 替换到 old
                this.$_children.splice(replaceIndex, 0, node)
            }

            node.$$updateParent(this) // 设置 parentNode

            // 更新映射表
            this.$_updateChildrenExtra(node)
            this.$_updateChildrenExtra(old, true)

            hasUpdate = true
        }

        // 触发 webview 端更新
        if (hasUpdate) this.$_triggerMeUpdate()

        return old
    }

    hasChildNodes() {
        return this.$_children.length > 0
    }

    getElementsByTagName(tagName) {
        if (typeof tagName !== 'string') return []

        return this.$_tree.getByTagName(tagName, this)
    }

    getElementsByClassName(className) {
        if (typeof className !== 'string') return []

        return this.$_tree.getByClassName(className, this)
    }

    querySelector(selector) {
        if (typeof selector !== 'string') return

        return this.$_tree.query(selector, this)[0] || null
    }

    querySelectorAll(selector) {
        if (typeof selector !== 'string') return []

        return this.$_tree.query(selector, this)
    }

    setAttribute(name, value) {
        if (typeof name !== 'string') return

        // 保留对象/数组/布尔值/undefined 原始内容，方便处理小程序内置组件的使用
        const valueType = typeof value
        if (valueType !== 'object' && valueType !== 'boolean' && value !== undefined && !Array.isArray(value)) value = '' + value

        if (name === 'id') {
            // id 要提前到此处特殊处理
            this.id = value
        } else {
            this.$_attrs.set(name, value)
        }
    }

    getAttribute(name) {
        if (typeof name !== 'string') return ''
        if (!this.$__attrs) return name === 'id' || name === 'style' || name === 'class' ? '' : undefined

        return this.$_attrs.get(name)
    }

    hasAttribute(name) {
        if (typeof name !== 'string') return false
        if (!this.$__attrs) return false

        return this.$_attrs.has(name)
    }

    removeAttribute(name) {
        if (typeof name !== 'string') return false

        return this.$_attrs.remove(name)
    }

    setAttributeNS(namespace, name, value) {
        // 不支持 namespace，使用 setAttribute 来兼容
        console.warn(`namespace ${namespace} is not supported`)
        this.setAttribute(name, value)
    }

    getAttributeNS(namespace, name) {
        // 不支持 namespace，使用 setAttribute 来兼容
        console.warn(`namespace ${namespace} is not supported`)
        return this.getAttribute(name)
    }

    hasAttributeNS(namespace, name) {
        // 不支持 namespace，使用 setAttribute 来兼容
        console.warn(`namespace ${namespace} is not supported`)
        return this.hasAttribute(name)
    }

    removeAttributeNS(namespace, name) {
        // 不支持 namespace，使用 setAttribute 来兼容
        console.warn(`namespace ${namespace} is not supported`)
        return this.removeAttribute(name)
    }

    contains(otherElement) {
        const stack = []
        let checkElement = this

        while (checkElement) {
            if (checkElement === otherElement) return true

            const childNodes = checkElement.childNodes
            if (childNodes && childNodes.length) childNodes.forEach(child => stack.push(child))

            checkElement = stack.pop()
        }

        return false
    }

    getBoundingClientRect() {
        // 不作任何实现，只作兼容使用
        console.warn('getBoundingClientRect is not supported, please use dom.$$getBoundingClientRect instead of it')
        return {
            left: 0,
            top: 0,
        }
    }
}

module.exports = Element

}, function(modId) { var map = {"./node":1589353392154,"./class-list":1589353392156,"./style":1589353392158,"./attribute":1589353392160,"../util/cache":1589353392146,"../tree/parser":1589353392161,"../util/tool":1589353392145,"../util/pool":1589353392157}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392156, function(require, module, exports) {
/**
 * babel extends 无法直接继承 Array，所以换种方法来继承：https://babeljs.io/docs/en/caveats/#classes
 */
const Pool = require('../util/pool')
const cache = require('../util/cache')

const pool = new Pool()

function ClassList(onUpdate) {
    this.$$init(onUpdate)
}

/**
 * 创建实例
 */
ClassList.$$create = function(onUpdate) {
    const config = cache.getConfig()

    if (config.optimization.domExtendMultiplexing) {
    // 复用 dom 扩展对象
        const instance = pool.get()

        if (instance) {
            instance.$$init(onUpdate)
            return instance
        }
    }

    return new ClassList(onUpdate)
}

ClassList.prototype = Object.assign([], {
    /**
     * 初始化实例
     */
    $$init(onUpdate) {
        this.$_doUpdate = onUpdate
    },

    /**
     * 销毁实例
     */
    $$destroy() {
        this.$_doUpdate = null
        this.length = 0
    },

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
    },

    /**
     * 解析 className
     */
    $$parse(className = '') {
        this.length = 0 // 置空当前内容

        className = className.trim()
        className = className ? className.split(/\s+/) : []

        for (const item of className) {
            this.push(item)
        }

        this.$_doUpdate()
    },

    /**
     * 对外属性和方法
     */
    item(index) {
        return this[index]
    },

    contains(className) {
        if (typeof className !== 'string') return false

        return this.indexOf(className) !== -1
    },

    add(...args) {
        let isUpdate = false

        for (let className of args) {
            if (typeof className !== 'string') continue

            className = className.trim()

            if (className && this.indexOf(className) === -1) {
                this.push(className)
                isUpdate = true
            }
        }

        if (isUpdate) this.$_doUpdate()
    },

    remove(...args) {
        let isUpdate = false

        for (let className of args) {
            if (typeof className !== 'string') continue

            className = className.trim()

            if (!className) continue

            const index = this.indexOf(className)
            if (index >= 0) {
                this.splice(index, 1)
                isUpdate = true
            }
        }

        if (isUpdate) this.$_doUpdate()
    },

    toggle(className, force) {
        if (typeof className !== 'string') return false

        className = className.trim()

        if (!className) return false

        const isNotContain = this.indexOf(className) === -1
        let action = isNotContain ? 'add' : 'remove'
        action = force === true ? 'add' : force === false ? 'remove' : action

        if (action === 'add') {
            this.add(className)
        } else {
            this.remove(className)
        }

        return force === true || force === false ? force : isNotContain
    },

    toString() {
        return this.join(' ')
    },
})

module.exports = ClassList

}, function(modId) { var map = {"../util/pool":1589353392157,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392157, function(require, module, exports) {
class Pool {
    constructor(size) {
        this.$_size = size || 3000
        this.$_cache = []
    }

    /**
     * 添加一个对象
     */
    add(object) {
        if (this.$_cache.length >= this.$_size) return

        this.$_cache.push(object)
    }

    /**
     * 取出一个对象
     */
    get() {
        return this.$_cache.pop()
    }
}

module.exports = Pool

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392158, function(require, module, exports) {
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
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        this.$_doUpdate = null
        this.$_disableCheckUpdate = false

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
        const joinText = styleList.filter(name => this[`$_${name}`]).map(name => `${tool.toDash(name)}:${this['$_' + name]}`).join(';').trim()
        return joinText ? `${joinText};` : ''
    }

    set cssText(styleText) {
        if (typeof styleText !== 'string') return

        styleText = styleText.replace(/"/g, '\'')

        // 解析样式
        const rules = parse(styleText)

        this.$_disableCheckUpdate = true // 将每条规则的设置合并为一次更新
        for (const name of styleList) {
            this[name] = rules[name]
        }
        this.$_disableCheckUpdate = false
        this.$_checkUpdate()
    }

    getPropertyValue(name) {
        if (typeof name !== 'string') return ''

        name = tool.toCamel(name)
        return this[name] || ''
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

}, function(modId) { var map = {"./style-list":1589353392159,"../util/tool":1589353392145,"../util/pool":1589353392157,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392159, function(require, module, exports) {
/**
 * 支持的样式属性列表，默认只包含常用的样式属性
 */

module.exports = [
    'position', 'top', 'bottom', 'right', 'left', 'float', 'clear',
    'display', 'width', 'height', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'flex', 'flexBasis', 'flexGrow', 'flexShrink', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'order',
    'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop',
    'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop',

    'background', 'backgroundClip', 'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition', 'backgroundRepeat', 'backgroundSize',
    'border', 'borderRadius', 'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth', 'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderTopColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth',
    'outline', 'borderWidth', 'borderStyle', 'borderColor',

    'animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction',
    'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction',
    'transform', 'transformOrigin', 'perspective', 'perspectiveOrigin', 'backfaceVisibility',

    'font', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight',
    'color', 'textAlign', 'textDecoration', 'textIndent', 'textRendering', 'textShadow', 'textOverflow', 'textTransform',
    'wordBreak', 'wordSpacing', 'wordWrap', 'lineHeight', 'letterSpacing', 'whiteSpace', 'userSelect',

    'visibility', 'opacity', 'zIndex', 'zoom', 'overflow', 'overflowX', 'overflowY',
    'boxShadow', 'boxSizing', 'content', 'cursor', 'direction', 'listStyle', 'objectFit', 'pointerEvents', 'resize', 'verticalAlign', 'willChange', 'clip', 'clipPath', 'fill',

    'touchAction', 'WebkitAppearance'
]

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392160, function(require, module, exports) {
const Pool = require('../util/pool')
const cache = require('../util/cache')
const tool = require('../util/tool')

const pool = new Pool()

class Attribute {
    constructor(element, onUpdate) {
        this.$$init(element, onUpdate)
    }

    /**
     * 创建实例
     */
    static $$create(element, onUpdate) {
        const config = cache.getConfig()

        if (config.optimization.domExtendMultiplexing) {
            // 复用 dom 扩展对象
            const instance = pool.get()

            if (instance) {
                instance.$$init(element, onUpdate)
                return instance
            }
        }

        return new Attribute(element, onUpdate)
    }

    /**
     * 初始化实例
     */
    $$init(element, onUpdate) {
        this.$_element = element
        this.$_doUpdate = onUpdate
        this.$_map = {}
        this.$_list = []

        this.triggerUpdate()
    }

    /**
     * 销毁实例
     */
    $$destroy() {
        this.$_element = null
        this.$_doUpdate = null
        this.$_map = null
        this.$_list = null
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
     * 属性列表，需要动态更新
     */
    get list() {
        return this.$_list
    }

    /**
     * 设置属性
     */
    set(name, value) {
        const element = this.$_element
        const map = this.$_map

        if (name === 'id') {
            map.id = value
        } else if (name === 'class' || (element.tagName === 'WX-COMPONENT' && name === 'className')) {
            element.className = value
        } else if (name === 'style') {
            element.style.cssText = value
        } else if (name.indexOf('data-') === 0) {
            const datasetName = tool.toCamel(name.substr(5))
            element.dataset[datasetName] = value
        } else {
            const config = cache.getConfig()

            // 判断 value 是否需要删减
            if (typeof value === 'string' && config.optimization.attrValueReduce && value.length > config.optimization.attrValueReduce) {
                console.warn(`property "${name}" will be deleted, because it's greater than ${config.optimization.attrValueReduce}`)
                value = ''
            }

            map[name] = value

            // 其他字段的设置需要触发父组件更新
            this.$_doUpdate()
        }

        this.triggerUpdate()
    }

    /**
     * 取属性
     */
    get(name) {
        const element = this.$_element
        const map = this.$_map

        if (name === 'id') {
            return map.id || ''
        } if (name === 'class') {
            return element.className
        } else if (name === 'style') {
            return element.style.cssText
        } else if (name.indexOf('data-') === 0) {
            const datasetName = tool.toCamel(name.substr(5))
            if (!element.$__dataset) return undefined
            return element.dataset[datasetName]
        } else {
            return map[name]
        }
    }

    /**
     * 判断属性是否存在
     */
    has(name) {
        const element = this.$_element
        const map = this.$_map

        if (name === 'id') {
            return !!element.id
        } else if (name === 'class') {
            return !!element.className
        } else if (name === 'style') {
            return !!element.style.cssText
        } else if (name.indexOf('data-') === 0) {
            const datasetName = tool.toCamel(name.substr(5))
            if (!element.$__dataset) return false
            return Object.prototype.hasOwnProperty.call(element.dataset, datasetName)
        } else {
            return Object.prototype.hasOwnProperty.call(map, name)
        }
    }

    /**
     * 删除属性
     */
    remove(name) {
        const element = this.$_element
        const map = this.$_map

        if (name === 'id') {
            element.id = ''
        } else if (name === 'class' || name === 'style') {
            this.set(name, '')
        } else if (name.indexOf('data-') === 0) {
            const datasetName = tool.toCamel(name.substr(5))
            if (element.$__dataset) delete element.dataset[datasetName]
        } else {
            // 其他字段的设置需要触发父组件更新
            delete map[name]
            this.$_doUpdate()
        }

        this.triggerUpdate()
    }

    /**
     * 更新属性列表
     */
    triggerUpdate() {
        const map = this.$_map
        const list = this.$_list

        // 清空旧的列表
        list.forEach(item => {
            delete list[item.name]
        })
        delete list.class
        delete list.style
        list.length = 0

        // 添加新列表
        Object.keys(map).forEach(name => {
            if (name !== 'id') {
                const item = {name, value: map[name]}

                list.push(item)
                list[name] = item
            }
        })

        const idValue = this.get('id')
        const classValue = this.get('class')
        const styleValue = this.get('style')
        if (idValue) {
            const item = {name: 'id', value: idValue}
            list.push(item)
            list.id = item
        }
        if (classValue) {
            const item = {name: 'class', value: classValue}
            list.push(item)
            list.class = item
        }
        if (styleValue) {
            const item = {name: 'style', value: styleValue}
            list.push(item)
            list.style = item
        }
    }
}

module.exports = Attribute

}, function(modId) { var map = {"../util/pool":1589353392157,"../util/cache":1589353392146,"../util/tool":1589353392145}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392161, function(require, module, exports) {
/**
 * 感谢 John Resig： https://johnresig.com/files/htmlparser.js
 */

// 正则声明
const doctypeReg = /^<!\s*doctype((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i
const startTagReg = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:@.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i
const endTagReg = /^<\/([-A-Za-z0-9_]+)[^>]*>/i
const attrReg = /([-A-Za-z0-9_:@.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

// 空元素 - https://www.w3.org/TR/html/syntax.html#void-elements
const voidMap = {};
['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].forEach(n => voidMap[n] = true)

// 块级元素 - https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements
const blockMap = {};
['address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'].forEach(n => blockMap[n] = true)

// 行内元素 - https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#Elements
const inlineMap = {};
['a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'var'].forEach(n => inlineMap[n] = true)

// 可能包含任意内容的元素 - https://www.w3.org/TR/html/syntax.html#raw-text
const rawTextMap = {};
['script', 'style'].forEach(n => rawTextMap[n] = true)

const longAttributeCache = {}
let seed = 0

/**
 * 分词
 */
function tokenize(content, handler) {
    const stack = []
    let last = content

    stack.last = function() {
        return this[this.length - 1]
    }

    while (content) {
        let isText = true

        if (!stack.last() || !rawTextMap[stack.last()]) {
            if (content.indexOf('<!--') === 0) {
                // comment
                const index = content.indexOf('-->')

                if (index >= 0) {
                    content = content.substring(index + 3)
                    if (handler.comment) handler.comment(content)
                    isText = false
                }
            } else if (content.indexOf('</') === 0) {
                // end tag
                const match = content.match(endTagReg)

                if (match) {
                    content = content.substring(match[0].length)
                    match[0].replace(endTagReg, parseEndTag)
                    isText = false
                }
            } else if (content.indexOf('<') === 0) {
                // start tag
                let match = content.match(startTagReg)

                if (match) {
                    content = content.substring(match[0].length)
                    match[0].replace(startTagReg, parseStartTag)
                    isText = false
                } else {
                    // 检测 doctype
                    match = content.match(doctypeReg)

                    if (match) {
                        content = content.substring(match[0].length)
                        isText = false
                    }
                }
            }

            if (isText) {
                const index = content.indexOf('<')

                const text = index < 0 ? content : content.substring(0, index)
                content = index < 0 ? '' : content.substring(index)

                if (handler.text) handler.text(text)
            }
        } else {
            const execRes = (new RegExp(`</${stack.last()}[^>]*>`)).exec(content)

            if (execRes) {
                const text = content.substring(0, execRes.index)
                content = content.substring(execRes.index + execRes[0].length)

                text.replace(/<!--(.*?)-->/g, '')
                if (text && handler.text) handler.text(text)
            }

            parseEndTag('', stack.last())
        }

        if (content === last) throw new Error(`parse error: ${content}`)
        last = content
    }

    // 关闭栈内的标签
    parseEndTag()

    function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase()
        unary = !!unary

        // 放宽规则，允许行内元素包含块级元素
        // if (blockMap[tagName]) {
        //     while (stack.last() && inlineMap[stack.last()]) {
        //         // 自动关闭栈内的行内元素
        //         parseEndTag('', stack.last())
        //     }
        // }

        unary = voidMap[tagName] || !!unary

        if (!unary) stack.push(tagName)

        if (handler.start) {
            const attrs = []

            try {
                rest.replace(attrReg, (all, $1, $2, $3, $4) => {
                    const value = $2 || $3 || $4

                    attrs.push({
                        name: $1,
                        value,
                    })
                })
            } catch (err) {
                // 某些安卓机遇到过长的字符串执行属性正则替换会跪（主要是 base 64），这里就先临时过滤掉这种特殊情况
                rest = rest.replace(/url\([^)]+\)/ig, all => {
                    const id = `url(:#|${++seed}|#:)`
                    longAttributeCache[id] = all
                    return id
                })
                rest.replace(attrReg, (all, $1, $2, $3, $4) => {
                    const value = $2 || $3 || $4

                    attrs.push({
                        name: $1,
                        value: value.replace(/url\(:#\|\d+\|#:\)/ig, all => longAttributeCache[all] || 'url()'),
                    })
                })
            }

            handler.start(tagName, attrs, unary)
        }
    }

    function parseEndTag(tag, tagName) {
        let pos

        if (!tagName) {
            pos = 0
        } else {
            // 找到同名的开始标签
            tagName = tagName.toLowerCase()

            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos] === tagName) break
            }
        }

        if (pos >= 0) {
            // 关闭开始标签和结束标签中的所有标签
            for (let i = stack.length - 1; i >= pos; i--) {
                if (handler.end) handler.end(stack[i])
            }

            stack.length = pos
        }
    }
}

/**
 * 解析
 */
function parse(html) {
    const r = {
        children: [],
    }
    const stack = [r]

    stack.last = function() {
        return this[this.length - 1]
    }

    tokenize(html, {
        start(tagName, attrs, unary) {
            const node = {
                type: 'element',
                tagName,
                attrs,
                unary,
                children: [],
            }

            stack.last().children.push(node)

            if (!unary) {
                stack.push(node)
            }
        },
        // eslint-disable-next-line no-unused-vars
        end(tagName) {
            const node = stack.pop()

            if (node.tagName === 'table') {
                // 补充插入 tbody
                let hasTbody = false

                for (const child of node.children) {
                    if (child.tagName === 'tbody') {
                        hasTbody = true
                        break
                    }
                }

                if (!hasTbody) {
                    node.children = [{
                        type: 'element',
                        tagName: 'tbody',
                        attrs: [],
                        unary: false,
                        children: node.children,
                    }]
                }
            }
        },
        text(content) {
            content = content.trim()
            if (!content) return

            stack.last().children.push({
                type: 'text',
                content,
            })
        },
        comment(content) {
            content = content.trim()

            stack.last().children.push({
                type: 'comment',
                content,
            })
        },
    })

    return r.children
}

module.exports = {
    tokenize,
    parse,
    voidMap,
    blockMap,
    inlineMap,
    rawTextMap,
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392162, function(require, module, exports) {
const Node = require('./node')
const tool = require('../util/tool')
const Pool = require('../util/pool')
const cache = require('../util/cache')

const pool = new Pool()

class TextNode extends Node {
    /**
     * 创建实例
     */
    static $$create(options, tree) {
        const config = cache.getConfig()

        if (config.optimization.textMultiplexing) {
            // 复用 text 节点
            const instance = pool.get()

            if (instance) {
                instance.$$init(options, tree)
                return instance
            }
        }

        return new TextNode(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        options.type = 'text'

        super.$$init(options, tree)

        this.$_content = options.content || ''
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_content = ''
    }

    /**
     * 回收实例
     */
    $$recycle() {
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.textMultiplexing) {
            // 复用 text 节点
            pool.add(this)
        }
    }

    /**
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        if (this.parentNode) this.parentNode.$$trigger('$$childNodesUpdate')
    }

    /**
     * 对应的 dom 信息
     */
    get $$domInfo() {
        return {
            nodeId: this.$_nodeId,
            pageId: this.$_pageId,
            type: this.$_type,
            content: this.$_content,
        }
    }

    /**
     * 对外属性和方法
     */
    get nodeName() {
        return '#text'
    }

    get nodeType() {
        return Node.TEXT_NODE
    }

    get nodeValue() {
        return this.textContent
    }

    set nodeValue(value) {
        this.textContent = value
    }

    get textContent() {
        return this.$_content
    }

    set textContent(value) {
        value += ''

        this.$_content = value
        this.$_triggerParentUpdate()
    }

    get data() {
        return this.textContent
    }

    set data(value) {
        this.textContent = value
    }

    cloneNode() {
        return this.ownerDocument.$$createTextNode({
            content: this.$_content,
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })
    }
}

module.exports = TextNode

}, function(modId) { var map = {"./node":1589353392154,"../util/tool":1589353392145,"../util/pool":1589353392157,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392163, function(require, module, exports) {
const Node = require('./node')
const tool = require('../util/tool')
const Pool = require('../util/pool')
const cache = require('../util/cache')

const pool = new Pool()

class Comment extends Node {
    /**
     * 创建实例
     */
    static $$create(options, tree) {
        const config = cache.getConfig()

        if (config.optimization.commentMultiplexing) {
            // 复用 comment 节点
            const instance = pool.get()

            if (instance) {
                instance.$$init(options, tree)
                return instance
            }
        }

        return new Comment(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        options.type = 'comment'

        super.$$init(options, tree)
    }

    /**
     * 回收实例
     */
    $$recycle() {
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.commentMultiplexing) {
            // 复用 comment 节点
            pool.add(this)
        }
    }

    /**
     * 对应的 dom 信息
     */
    get $$domInfo() {
        return {
            nodeId: this.$_nodeId,
            pageId: this.$_pageId,
            type: this.$_type,
        }
    }

    /**
     * 对外属性和方法
     */
    get nodeName() {
        return '#comment'
    }

    get nodeType() {
        return Node.COMMENT_NODE
    }

    cloneNode() {
        return this.ownerDocument.$$createComment({
            nodeId: `b-${tool.getId()}`, // 运行时生成，使用 b- 前缀
        })
    }
}

module.exports = Comment

}, function(modId) { var map = {"./node":1589353392154,"../util/tool":1589353392145,"../util/pool":1589353392157,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392164, function(require, module, exports) {
const Element = require('../element')
const Location = require('../../bom/location')
const cache = require('../../util/cache')
const Pool = require('../../util/pool')

const pool = new Pool()

class HTMLAnchorElement extends Element {
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

        return new HTMLAnchorElement(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init(options, tree)

        this.$_protocol = 'http:'
        this.$_hostname = ''
        this.$_port = ''
        this.$_pathname = '/'
        this.$_search = ''
        this.$_hash = ''
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_protocol = null
        this.$_hostname = null
        this.$_port = null
        this.$_pathname = null
        this.$_search = null
        this.$_hash = null
    }

    /**
     * 覆写父类的回收实例方法
     */
    $$recycle() {
        this.$_children.forEach(child => child.$$recycle())
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
        const href = node.href
        if (href) html += ` href="${href}"`

        const target = node.target
        if (target) html += ` target="${target}"`

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.href = node.href || ''
        this.target = node.target || ''
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        return {
            href: this.href,
            target: this.target,
        }
    }

    /**
     * 对外属性和方法
     */
    get href() {
        return this.$_attrs.get('href')
    }

    set href(value) {
        value = '' + value

        if (value.indexOf('//') === -1) {
            const {origin} = cache.getConfig()
            value = origin + (value[0] === '/' ? value : `/${value}`)
        }

        this.$_attrs.set('href', value)
        const {
            protocol, hostname, port, pathname, search, hash
        } = Location.$$parse(value)

        this.$_protocol = protocol || this.$_protocol
        this.$_hostname = hostname || this.$_hostname
        this.$_port = port || ''
        this.$_pathname = pathname || '/'
        this.$_search = search || ''
        this.$_hash = hash || ''
    }

    get protocol() {
        return this.$_protocol
    }

    get hostname() {
        return this.$_hostname
    }

    get port() {
        return this.$_port
    }

    get pathname() {
        return this.$_pathname
    }

    get search() {
        return this.$_search
    }

    get hash() {
        return this.$_hash
    }

    get target() {
        return this.$_attrs.get('target')
    }

    set target(value) {
        value = '' + value
        this.$_attrs.set('target', value)
    }
}

module.exports = HTMLAnchorElement

}, function(modId) { var map = {"../element":1589353392155,"../../bom/location":1589353392165,"../../util/cache":1589353392146,"../../util/pool":1589353392157}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392165, function(require, module, exports) {
/**
 * 暂不对 ipv6 地址做支持
 */
const EventTarget = require('../event/event-target')
const tool = require('../util/tool')
const cache = require('../util/cache')

class Location extends EventTarget {
    constructor(pageId) {
        super()

        this.$_pageId = pageId
        this.$_pageRoute = tool.getPageRoute(pageId) // 小程序页面路由

        this.$_protocol = 'https:'
        this.$_hostname = ''
        this.$_port = ''
        this.$_pathname = '/'
        this.$_search = ''
        this.$_hash = ''

        this.$_lastHash = ''
        this.$_lastPathname = ''
        this.$_lastSearch = ''
        this.$_lastHref = ''
        this.$_allowCheck = true // 是否检查 url 和 hash 变化
    }

    /**
     * 获取 url 中旧的需要进行检测的部分
     */
    $_getOldValues() {
        return {
            protocol: this.$_protocol,
            hostname: this.$_hostname,
            port: this.$_port,
            pathname: this.$_pathname,
            search: this.$_search,
            hash: this.$_hash,
        }
    }

    /**
     * 设置 href，不进入 history
     */
    $_setHrefWithoutEnterHistory(value) {
        if (!value || typeof value !== 'string') return

        this.$$startCheckHash()

        if (!/^(([a-zA-Z0-9]+:)|(\/\/))/i.test(value)) {
            // 没有带协议
            if (value.indexOf('/') === 0) {
                // 以 / 开头，直接替换整个 pathname、search、hash
                value = `${this.origin}${value}`
            } else if (value.indexOf('#') === 0) {
                // 以 # 开头，直接替换整个 hash
                value = `${this.origin}${this.$_pathname}${this.$_search}${value}`
            } else {
                // 非以 / 开头，则替换 pathname 的最后一段、search、hash
                let pathname = this.$_pathname.split('/')
                pathname.pop()
                pathname = pathname.join('/')

                value = `${this.origin}${pathname}/${value}`
            }
        }

        const {
            protocol, hostname, port, hash, search, pathname
        } = Location.$$parse(value)
        const oldValues = this.$_getOldValues()

        this.$_protocol = protocol || this.$_protocol
        this.$_hostname = hostname || this.$_hostname
        this.$_port = port || ''
        this.$_pathname = pathname || '/'
        this.$_search = search || ''
        this.$_hash = hash || ''

        this.$$endCheckHash()
        this.$_checkUrl(oldValues)
    }

    /**
     * 进入 history
     */
    $_enterHistory() {
        this.$$trigger('$_addToHistory', {
            event: {
                href: this.href,
            }
        })
    }

    /**
     * 检查 url 变化是否需要跳转
     */
    $_checkUrl(oldValues) {
        if (!this.$_allowCheck) return false

        const window = cache.getWindow(this.$_pageId)

        if (this.$_protocol !== oldValues.protocol || this.$_hostname !== oldValues.hostname || this.$_port !== oldValues.port) {
            // 只能跳转相同 protocol、hostname 和 port 的 url
            const jumpUrl = this.href

            // 和 web 端不同，这里恢复成原状
            this.$_protocol = oldValues.protocol
            this.$_hostname = oldValues.hostname
            this.$_port = oldValues.port
            this.$_pathname = oldValues.pathname
            this.$_search = oldValues.search
            this.$_hash = oldValues.hash

            window.$$trigger('pageaccessdenied', {
                event: {
                    url: jumpUrl,
                    type: 'jump',
                },
            })

            return false
        }

        if (this.$_pathname !== oldValues.pathname || this.$_search !== oldValues.search) {
            const matchRoute = window.$$miniprogram.getMatchRoute(this.$_pathname)

            if (matchRoute) {
                let param = ['type=jump', `targeturl=${encodeURIComponent(this.href)}`]
                if (this.$_search) param.push(`search=${encodeURIComponent(this.$_search)}`)
                if (this.$_hash) param.push(`hash=${encodeURIComponent(this.$_hash)}`)

                param = '?' + param.join('&')

                const callMethod = window.$$miniprogram.isTabBarPage(matchRoute) ? 'switchTab' : 'redirectTo'
                wx[callMethod]({
                    url: `${matchRoute}${param}`,
                })

                if (callMethod === 'switchTab') {
                    // switchTab 不会销毁页面实例，所以也需要恢复成原状
                    this.$_protocol = oldValues.protocol
                    this.$_hostname = oldValues.hostname
                    this.$_port = oldValues.port
                    this.$_pathname = oldValues.pathname
                    this.$_search = oldValues.search
                    this.$_hash = oldValues.hash
                }

                return true
            } else {
                const jumpUrl = this.href

                // 和 web 端不同，这里恢复成原状
                this.$_protocol = oldValues.protocol
                this.$_hostname = oldValues.hostname
                this.$_port = oldValues.port
                this.$_pathname = oldValues.pathname
                this.$_search = oldValues.search
                this.$_hash = oldValues.hash

                window.$$trigger('pagenotfound', {
                    event: {
                        url: jumpUrl,
                        type: 'jump',
                    },
                })

                return false
            }
        }

        return true
    }

    /**
     * 打开一个新页面
     */
    $$open(url) {
        url = tool.completeURL(url, this.origin, true)

        const window = cache.getWindow(this.$_pageId)
        const parseRes = Location.$$parse(url)

        if (parseRes.protocol !== this.$_protocol || parseRes.hostname !== this.$_hostname || parseRes.port !== this.$_port) {
            // 只能打开相同 protocol、hostname 和 port 的 url
            return window.$$trigger('pageaccessdenied', {
                event: {
                    url,
                    type: 'open',
                },
            })
        }

        const matchRoute = window.$$miniprogram.getMatchRoute(parseRes.pathname || '/')

        if (matchRoute) {
            let param = ['type=open', `targeturl=${encodeURIComponent(url)}`]
            if (this.$_search) param.push(`search=${encodeURIComponent(parseRes.search || '')}`)
            if (this.$_hash) param.push(`hash=${encodeURIComponent(parseRes.hash || '')}`)

            param = '?' + param.join('&')

            const callMethod = window.$$miniprogram.isTabBarPage(matchRoute) ? 'switchTab' : 'navigateTo'
            wx[callMethod]({
                url: `${matchRoute}${param}`,
            })
        } else {
            window.$$trigger('pagenotfound', {
                event: {
                    url,
                    type: 'open',
                },
            })
        }
    }

    /**
     * 重置实例
     */
    $$reset(url = '') {
        const {
            protocol, hostname, port, pathname, hash, search
        } = Location.$$parse(url)

        this.$_protocol = protocol || 'https:'
        this.$_hostname = hostname || ''
        this.$_port = port || ''
        this.$_pathname = pathname || '/'
        this.$_search = search || ''
        this.$_hash = hash || ''
    }

    /**
     * 解析 href
     */
    static $$parse(href = '') {
        href = href.trim()

        // protocol
        let protocol = /^[a-zA-Z0-9]+:/i.exec(href)
        if (protocol) {
            protocol = protocol[0].toLowerCase()
            href = href.slice(protocol.length)
        }

        // 跳过 //
        if (href.indexOf('//') === 0) {
            href = href.slice(2)
        }

        let hostStart = 0
        let hostEnd = -1
        let isEnd = false
        let host
        for (let i = 0, len = href.length; i < len; i++) {
            const char = href[i]
            if ('\t\n\r "%\';<>\\^`{|}'.indexOf(char) >= 0) {
                // RFC 2396：不允许在 hostname 中使用的字符
                if (hostEnd === -1) hostEnd = i
            } else if ('#/?'.indexOf(char) >= 0) {
                // host 结束符
                if (hostEnd === -1) hostEnd = i
                isEnd = true
            } else if (char === '@') {
                hostStart = i + 1
                hostEnd = -1
            }

            if (isEnd) break
        }

        if (hostEnd === -1) {
            host = href.slice(hostStart)
            href = ''
        } else {
            host = href.slice(hostStart, hostEnd)
            href = href.slice(hostEnd)
        }


        // port
        let port = /:[0-9]*$/.exec(host)
        if (port) {
            port = port[0]
            host = host.slice(0, host.length - port.length)

            if (port !== ':') port = port.slice(1)
        } else {
            port = ''
        }

        // hostname
        for (let i = 0, len = host.length; i < len; i++) {
            const char = host[i]
            const isValid = (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') || '.-+_'.indexOf(char) >= 0 || char.charCodeAt(0) > 127

            // 不合法的 host 字符
            if (!isValid) {
                host = host.slice(0, i)

                href = `/${host.slice(i)}${href}`
            }
        }
        const hostname = host.length > 255 ? '' : host.toLowerCase()

        // hash
        let hash
        let searchIndex = -1
        let hashIndex = -1
        for (let i = 0, len = href.length; i < len; i++) {
            if (href[i] === '#') {
                hash = href.slice(i)
                hashIndex = i
                break
            } else if (href[i] === '?' && searchIndex === -1) {
                searchIndex = i
            }
        }
        hash = hash === '#' ? '' : hash

        // search
        let search
        if (searchIndex !== -1) {
            if (hashIndex === -1) {
                search = href.slice(searchIndex)
            } else {
                search = href.slice(searchIndex, hashIndex)
            }
        }
        search = search === '?' ? '' : search

        // pathname
        let pathname
        const firstIndex = searchIndex !== -1 && (hashIndex === -1 || searchIndex < hashIndex) ? searchIndex : hashIndex
        if (firstIndex > 0) {
            pathname = href.slice(0, firstIndex)
        } else if (firstIndex === -1 && href.length > 0) {
            pathname = href
        }
        if (hostname && !pathname) {
            pathname = '/'
        }

        return {
            protocol,
            hostname,
            port,
            pathname,
            hash,
            search,
        }
    }

    /**
     * 不触发检查的方式替换 href
     */
    $$setHrefWithoutCheck(value) {
        this.$_allowCheck = false
        this.replace(value)
        this.$_allowCheck = true
    }

    /**
     * 开始检查 hash 变化
     */
    $$startCheckHash() {
        if (!this.$_allowCheck) return

        this.$_lastHash = this.$_hash
        this.$_lastPathname = this.$_pathname
        this.$_lastSearch = this.$_search
        this.$_lastHref = this.href
    }

    /**
     * 检查 hash 变化
     */
    $$endCheckHash(needCheckUrlChange) {
        if (!this.$_allowCheck) return

        if ((needCheckUrlChange || (this.$_lastPathname === this.$_pathname && this.$_lastSearch === this.$_search)) && this.$_lastHash !== this.$_hash) {
            this.$$trigger('hashchange', {
                event: {
                    oldURL: this.$_lastHref,
                    newURL: this.href,
                }
            })
        }

        this.$_lastHash = ''
        this.$_lastPathname = ''
        this.$_lastSearch = ''
        this.$_lastHref = ''
    }

    /**
     * 对外属性和方法
     */
    get protocol() {
        return this.$_protocol
    }

    set protocol(value) {
        if (!value || typeof value !== 'string') return

        const parseRes = /^([a-z0-9.+-]+)(:)?$/i.exec(value)
        const oldValues = this.$_getOldValues()

        if (parseRes) {
            if (parseRes[2] === ':') {
                this.$_protocol = value
            } else {
                this.$_protocol = `${parseRes[1]}:`
            }

            if (this.$_checkUrl(oldValues)) this.$_enterHistory()
        }
    }

    get host() {
        return (this.$_hostname || '') + (this.$_port ? ':' + this.$_port : '')
    }

    set host(value) {
        if (!value || typeof value !== 'string') return

        const {hostname, port} = Location.$$parse(`//${value}`)
        const oldValues = this.$_getOldValues()

        this.$_hostname = hostname || this.$_hostname
        this.$_port = port || ''

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get hostname() {
        return this.$_hostname
    }

    set hostname(value) {
        if (!value || typeof value !== 'string') return

        const {hostname} = Location.$$parse(`//${value}`)
        const oldValues = this.$_getOldValues()

        this.$_hostname = hostname || this.$_hostname

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get port() {
        return this.$_port
    }

    set port(value) {
        value = +value

        if (typeof value !== 'number' || !isFinite(value) || value <= 0) return

        const port = value === 80 ? '' : value + ''
        const oldValues = this.$_getOldValues()

        this.$_port = port

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get origin() {
        return `${this.$_protocol}//${this.host}`
    }

    set origin(value) {
        if (!value || typeof value !== 'string') return
        if (!/^(([a-zA-Z0-9]+:)|(\/\/))/i.test(value)) return // 没有带协议

        const {protocol, hostname, port} = Location.$$parse(value)
        const oldValues = this.$_getOldValues()

        this.$_protocol = protocol || this.$_protocol
        this.$_hostname = hostname || this.$_hostname
        this.$_port = port || ''

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get pathname() {
        return this.$_pathname
    }

    set pathname(value) {
        if (typeof value !== 'string') return

        const oldValues = this.$_getOldValues()

        if (!value || value === '/') {
            this.$_pathname = '/'
        } else {
            if (value[0] !== '/') value = `/${value}`

            const {pathname} = Location.$$parse(`//miniprogram${value}`)

            this.$_pathname = pathname || '/'
        }

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get search() {
        return this.$_search
    }

    set search(value) {
        if (typeof value !== 'string') return

        const oldValues = this.$_getOldValues()

        if (!value || value === '?') {
            this.$_search = ''
        } else {
            if (value[0] !== '?') value = `?${value}`

            const {search} = Location.$$parse(`//miniprogram${value}`)

            this.$_search = search || ''
        }

        if (this.$_checkUrl(oldValues)) this.$_enterHistory()
    }

    get hash() {
        return this.$_hash
    }

    set hash(value) {
        if (typeof value !== 'string') return

        this.$$startCheckHash()

        if (!value || value === '#') {
            this.$_hash = ''
        } else {
            if (value[0] !== '#') value = `#${value}`

            const {hash} = Location.$$parse(`//miniprogram${value}`)

            this.$_hash = hash || ''
        }

        this.$$endCheckHash()
        this.$_enterHistory()
    }

    get href() {
        return `${this.$_protocol}//${this.host}${this.$_pathname}${this.$_search}${this.$_hash}`
    }

    set href(value) {
        this.$_setHrefWithoutEnterHistory(value)
        this.$_enterHistory()
    }

    reload() {
        const window = cache.getWindow(this.$_pageId)
        let param = ['type=jump', `targeturl=${encodeURIComponent(this.href)}`]
        if (this.$_search) param.push(`search=${encodeURIComponent(this.$_search)}`)
        if (this.$_hash) param.push(`hash=${encodeURIComponent(this.$_hash)}`)

        param = '?' + param.join('&')

        const callMethod = window.$$miniprogram.isTabBarPage(this.$_pageRoute) ? 'switchTab' : 'redirectTo'
        wx[callMethod]({
            url: `${this.$_pageRoute}${param}`,
        })
    }

    replace(value) {
        // 和直接赋值 location.href 不同，不需要进入 history
        this.$_setHrefWithoutEnterHistory(value)
    }

    toString() {
        return this.href
    }
}

module.exports = Location

}, function(modId) { var map = {"../event/event-target":1589353392149,"../util/tool":1589353392145,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392166, function(require, module, exports) {
const Element = require('../element')
const Event = require('../../event/event')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class Image extends Element {
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

        return new Image(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        const width = options.width
        const height = options.height

        if (typeof width === 'number' && width >= 0) options.attrs.width = width
        if (typeof height === 'number' && height >= 0) options.attrs.height = height

        super.$$init(options, tree)

        this.$_naturalWidth = 0
        this.$_naturalHeight = 0

        this.$_initRect()
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_naturalWidth = null
        this.$_naturalHeight = null
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
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        this.$_initRect()
        super.$_triggerParentUpdate()
    }

    /**
     * 初始化长宽
     */
    $_initRect() {
        const width = parseInt(this.$_attrs.get('width'), 10)
        const height = parseInt(this.$_attrs.get('height'), 10)

        if (typeof width === 'number' && width >= 0) this.$_style.width = `${width}px`
        if (typeof height === 'number' && height >= 0) this.$_style.height = `${height}px`
    }

    /**
     * 重置长宽
     */
    $_resetRect(rect = {}) {
        this.$_naturalWidth = rect.width || 0
        this.$_naturalHeight = rect.height || 0

        this.$_initRect()
    }

    /**
     * 对外属性和方法
     */
    get src() {
        return this.$_attrs.get('src') || ''
    }

    set src(value) {
        if (!value || typeof value !== 'string') return

        this.$_attrs.set('src', value)

        setTimeout(() => {
            wx.getImageInfo({
                src: this.src,
                success: res => {
                    // 加载成功，调整图片的宽高
                    this.$_resetRect(res)

                    // 触发 load 事件
                    this.$$trigger('load', {
                        event: new Event({
                            name: 'load',
                            target: this,
                            eventPhase: Event.AT_TARGET
                        }),
                        currentTarget: this,
                    })
                },
                fail: () => {
                    // 加载失败，调整图片的宽高
                    this.$_resetRect({width: 0, height: 0})

                    // 触发 error 事件
                    this.$$trigger('error', {
                        event: new Event({
                            name: 'error',
                            target: this,
                            eventPhase: Event.AT_TARGET
                        }),
                        currentTarget: this,
                    })
                },
            })
        }, 0)
    }

    get width() {
        return +this.$_attrs.get('width') || 0
    }

    set width(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('width', value)
        this.$_initRect()
    }

    get height() {
        return +this.$_attrs.get('height') || 0
    }

    set height(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('height', value)
        this.$_initRect()
    }

    get naturalWidth() {
        return this.$_naturalWidth
    }

    get naturalHeight() {
        return this.$_naturalHeight
    }
}

module.exports = Image

}, function(modId) { var map = {"../element":1589353392155,"../../event/event":1589353392150,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392167, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class HTMLInputElement extends Element {
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

        return new HTMLInputElement(options, tree)
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
        const type = node.type
        if (type) html += ` type="${type}"`

        const value = node.value
        if (value) html += ` value="${value}"`

        const disabled = node.disabled
        if (disabled) html += ' disabled'

        const maxlength = node.maxlength
        if (maxlength) html += ` maxlength="${maxlength}"`

        const placeholder = node.placeholder
        if (placeholder) html += ` placeholder="${placeholder.replace(/"/g, '\\"')}"`

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.type = node.type || ''
        this.value = node.value || ''
        this.disabled = node.disabled || ''
        this.maxlength = node.maxlength
        this.placeholder = node.placeholder || ''

        // 特殊字段
        this.mpplaceholderclass = node.mpplaceholderclass || ''
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        return {
            type: this.type,
            value: this.value,
            disabled: this.disabled,
            maxlength: this.maxlength,
            placeholder: this.placeholder,

            // 特殊字段
            mpplaceholderclass: this.mpplaceholderclass,
        }
    }

    /**
     * 对外属性和方法
     */
    get name() {
        return this.$_attrs.get('name')
    }

    set name(value) {
        value = '' + value
        this.$_attrs.set('name', value)
    }

    get type() {
        return this.$_attrs.get('type') || 'text'
    }

    set type(value) {
        value = '' + value
        this.$_attrs.set('type', value)
    }

    get value() {
        const type = this.$_attrs.get('type')
        const value = this.$_attrs.get('value')

        if ((type === 'radio' || type === 'checkbox') && value === undefined) return 'on'
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

    get maxlength() {
        return this.$_attrs.get('maxlength')
    }

    set maxlength(value) {
        this.$_attrs.set('maxlength', value)
    }

    get placeholder() {
        return this.$_attrs.get('placeholder') || ''
    }

    set placeholder(value) {
        value = '' + value
        this.$_attrs.set('placeholder', value)
    }

    get autofocus() {
        return !!this.$_attrs.get('autofocus')
    }

    set autofocus(value) {
        value = !!value
        this.$_attrs.set('autofocus', value)
    }

    set checked(value) {
        this.$_attrs.set('checked', value)
    }

    get checked() {
        return this.$_attrs.get('checked') || ''
    }

    focus() {
        this.$_attrs.set('focus', true)
    }

    blur() {
        this.$_attrs.set('focus', false)
    }
}

module.exports = HTMLInputElement

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392168, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class HTMLTextAreaElement extends Element {
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

        return new HTMLTextAreaElement(options, tree)
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
        const type = node.type
        if (type) html += ` type="${type}"`

        const value = node.value
        if (value) html += ` value="${value}"`

        const disabled = node.disabled
        if (disabled) html += ' disabled'

        const maxlength = node.maxlength
        if (maxlength) html += ` maxlength="${maxlength}"`

        const placeholder = node.placeholder
        if (placeholder) html += ` placeholder="${placeholder.replace(/"/g, '\\"')}"`

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.type = node.type || ''
        this.value = node.value || ''
        this.disabled = node.disabled || ''
        this.maxlength = node.maxlength
        this.placeholder = node.placeholder || ''

        // 特殊字段
        this.mpplaceholderclass = node.mpplaceholderclass || ''
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        return {
            type: this.type,
            value: this.value,
            disabled: this.disabled,
            maxlength: this.maxlength,
            placeholder: this.placeholder,

            // 特殊字段
            mpplaceholderclass: this.mpplaceholderclass,
        }
    }

    /**
     * 对外属性和方法
     */
    get type() {
        return this.$_attrs.get('type') || 'textarea'
    }

    set type(value) {
        value = '' + value
        this.$_attrs.set('type', value)
    }

    get value() {
        return this.$_attrs.get('value')
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

    get maxlength() {
        return this.$_attrs.get('maxlength')
    }

    set maxlength(value) {
        this.$_attrs.set('maxlength', value)
    }

    get placeholder() {
        return this.$_attrs.get('placeholder') || ''
    }

    set placeholder(value) {
        value = '' + value
        this.$_attrs.set('placeholder', value)
    }

    get autofocus() {
        return !!this.$_attrs.get('autofocus')
    }

    set autofocus(value) {
        value = !!value
        this.$_attrs.set('autofocus', value)
    }

    get selectionStart() {
        const value = +this.$_attrs.get('selection-start')
        return value !== undefined ? value : -1
    }

    set selectionStart(value) {
        this.$_attrs.set('selection-start', value)
    }

    get selectionEnd() {
        const value = +this.$_attrs.get('selection-end')
        return value !== undefined ? value : -1
    }

    set selectionEnd(value) {
        this.$_attrs.set('selection-end', value)
    }

    focus() {
        this.$_attrs.set('focus', true)
    }

    blur() {
        this.$_attrs.set('focus', false)
    }
}

module.exports = HTMLTextAreaElement

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392169, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class HTMLVideoElement extends Element {
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

        return new HTMLVideoElement(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        const width = options.width
        const height = options.height

        if (typeof width === 'number' && width >= 0) options.attrs.width = width
        if (typeof height === 'number' && height >= 0) options.attrs.height = height

        super.$$init(options, tree)

        this.$_initRect()
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
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        this.$_initRect()
        super.$_triggerParentUpdate()
    }

    /**
     * 初始化长宽
     */
    $_initRect() {
        const width = parseInt(this.$_attrs.get('width'), 10)
        const height = parseInt(this.$_attrs.get('height'), 10)

        if (typeof width === 'number' && width >= 0) this.$_style.width = `${width}px`
        if (typeof height === 'number' && height >= 0) this.$_style.height = `${height}px`
    }

    /**
     * 对外属性和方法
     */
    get src() {
        return this.$_attrs.get('src') || ''
    }

    set src(value) {
        if (!value || typeof value !== 'string') return

        this.$_attrs.set('src', value)
    }

    get width() {
        return +this.$_attrs.get('width') || 0
    }

    set width(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('width', value)
        this.$_initRect()
    }

    get height() {
        return +this.$_attrs.get('height') || 0
    }

    set height(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('height', value)
        this.$_initRect()
    }

    get autoplay() {
        return !!this.$_attrs.get('autoplay')
    }

    set autoplay(value) {
        value = !!value
        this.$_attrs.set('autoplay', value)
    }

    get loop() {
        return !!this.$_attrs.get('loop')
    }

    set loop(value) {
        value = !!value
        this.$_attrs.set('loop', value)
    }

    get muted() {
        return !!this.$_attrs.get('muted')
    }

    set muted(value) {
        value = !!value
        this.$_attrs.set('muted', value)
    }

    get controls() {
        const value = this.$_attrs.get('controls')
        return value !== undefined ? !!value : true
    }

    set controls(value) {
        this.$_attrs.set('controls', value)
    }

    get poster() {
        return this.$_attrs.get('poster')
    }

    set poster(value) {
        if (!value || typeof value !== 'string') return

        this.$_attrs.set('poster', value)
    }

    get currentTime() {
        return +this.$_attrs.get('currentTime') || 0
    }

    get buffered() {
        return this.$_attrs.get('buffered')
    }
}

module.exports = HTMLVideoElement

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392170, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class HTMLCanvasElement extends Element {
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

        return new HTMLCanvasElement(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        const width = options.width
        const height = options.height

        if (typeof width === 'number' && width >= 0) options.attrs.width = width
        if (typeof height === 'number' && height >= 0) options.attrs.height = height

        super.$$init(options, tree)

        this.$_node = null

        this.$_initRect()
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
     * 准备 canvas 节点
     */
    $$prepare() {
        return new Promise((resolve, reject) => {
            this.$$getNodesRef().then(nodesRef => nodesRef.node(res => {
                this.$_node = res.node

                // 设置 canvas 宽高
                this.$_node.width = this.width
                this.$_node.height = this.height

                resolve(this)
            }).exec()).catch(reject)
        })
    }

    /**
     * 更新父组件树
     */
    $_triggerParentUpdate() {
        this.$_initRect()
        super.$_triggerParentUpdate()
    }

    /**
     * 初始化长宽
     */
    $_initRect() {
        const width = parseInt(this.$_attrs.get('width'), 10)
        const height = parseInt(this.$_attrs.get('height'), 10)

        if (typeof width === 'number' && width >= 0) {
            this.$_style.width = `${width}px`
            if (this.$_node) this.$_node.width = width
        }
        if (typeof height === 'number' && height >= 0) {
            this.$_style.height = `${height}px`
            if (this.$_node) this.$_node.height = height
        }
    }

    /**
     * 对外属性和方法
     */
    get width() {
        return +this.$_attrs.get('width') || 0
    }

    set width(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('width', value)
        this.$_initRect()
    }

    get height() {
        return +this.$_attrs.get('height') || 0
    }

    set height(value) {
        if (typeof value !== 'number' || !isFinite(value) || value < 0) return

        this.$_attrs.set('height', value)
        this.$_initRect()
    }

    getContext(type) {
        if (!this.$_node) {
            console.warn('canvas is not prepared, please call $$prepare method first')
            return
        }
        return this.$_node.getContext(type)
    }
}

module.exports = HTMLCanvasElement

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392171, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class NotSupport extends Element {
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

        return new NotSupport(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init(options, tree)

        // 处理特殊节点
        const window = cache.getWindow(this.$_pageId)
        if (window.onDealWithNotSupportDom) window.onDealWithNotSupportDom(this)
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
}

module.exports = NotSupport

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392172, function(require, module, exports) {
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
}

module.exports = WxComponent

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392173, function(require, module, exports) {
const Element = require('../element')
const Pool = require('../../util/pool')
const cache = require('../../util/cache')

const pool = new Pool()

class WxCustomComponent extends Element {
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

        return new WxCustomComponent(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        this.$_behavior = options.componentName

        super.$$init(options, tree)
    }

    /**
     * 覆写父类的 $$destroy 方法
     */
    $$destroy() {
        super.$$destroy()

        this.$_behavior = null
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
        return this.$_behavior
    }
}

module.exports = WxCustomComponent

}, function(modId) { var map = {"../element":1589353392155,"../../util/pool":1589353392157,"../../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392174, function(require, module, exports) {
const Location = require('./location')
const cache = require('../util/cache')

class Cookie {
    constructor(pageName) {
        const config = cache.getConfig()
        const runtime = config.runtime || {}
        this.cookieStore = runtime.cookieStore
        this.$_pageName = pageName

        if (this.cookieStore !== 'storage' && this.cookieStore !== 'memory') {
            // 需要全局共享
            this.$_map = cache.getCookie()
        } else {
            this.$_map = {} // 三维数组，domain - path - key
        }
    }

    static parse(cookieStr) {
        if (!cookieStr && typeof cookieStr !== 'string') return null

        cookieStr = cookieStr.trim().split(';')

        // key-value
        const parseKeyValue = /^([^=;\x00-\x1F]+)=([^;\n\r\0\x00-\x1F]*).*/.exec(cookieStr.shift())
        if (!parseKeyValue) return null

        const key = (parseKeyValue[1] || '').trim()
        const value = (parseKeyValue[2] || '').trim()

        // 其他字段
        let path = null
        let domain = null
        let expires = null
        let maxAge = null
        let secure = false
        let httpOnly = false

        for (let item of cookieStr) {
            item = item.trim()
            if (!item) continue

            let [key, value] = item.split('=')
            key = (key || '').trim().toLowerCase()
            value = (value || '').trim()

            if (!key) continue

            switch (key) {
            case 'path':
                if (value[0] === '/') path = value
                break
            case 'domain':
                value = value.replace(/^\./, '').toLowerCase()
                if (value) domain = value
                break
            case 'expires':
                if (value) {
                    const timeStamp = Date.parse(value)
                    if (timeStamp) expires = timeStamp
                }
                break
            case 'max-age':
                if (/^-?[0-9]+$/.test(value)) maxAge = +value * 1000
                break
            case 'secure':
                secure = true
                break
            case 'httponly':
                httpOnly = true
                break
            default:
                // ignore
                break
            }
        }

        return {
            key, value, path, domain, expires, maxAge, secure, httpOnly
        }
    }

    /**
     * 判断 domain
     */
    $_checkDomain(host, cookieDomain) {
        if (host === cookieDomain) return true

        const index = host.indexOf(`.${cookieDomain}`)

        return index > 0 && cookieDomain.length + index + 1 === host.length
    }

    /**
     * 判断 path
     */
    $_checkPath(path, cookiePath) {
        if (path === cookiePath) return true

        cookiePath = cookiePath === '/' ? '' : cookiePath
        return path.indexOf(`${cookiePath}/`) === 0
    }

    /**
     * 判断过期
     */
    $_checkExpires(cookie) {
        const now = Date.now()

        // maxAge 优先
        if (cookie.maxAge !== null) return cookie.createTime + cookie.maxAge > now

        // 判断 expires
        if (cookie.expires !== null) return cookie.expires > now

        return true
    }

    /**
     * 设置 cookie
     */
    setCookie(cookie, url) {
        cookie = Cookie.parse(cookie)

        if (!cookie) return

        const {hostname, port, pathname} = Location.$$parse(url)
        const host = ((hostname || '') + (port ? ':' + port : '')) || ''
        const path = (pathname || '')[0] === '/' ? pathname : '/'

        if (cookie.domain) {
            // 判断 domain
            if (!this.$_checkDomain(host, cookie.domain)) return
        } else {
            // 使用 host 作为默认的 domain
            cookie.domain = host
        }

        // 需要设置 path 字段的情况，取 url 中除去最后一节的 path
        if (!cookie.path || cookie.path[0] !== '/') {
            const lastIndex = path.lastIndexOf('/')

            cookie.path = lastIndex === 0 ? path : path.substr(0, lastIndex)
        }

        // 存入 cookie
        const map = this.$_map
        const cookieDomain = cookie.domain
        const cookiePath = cookie.path
        const cookieKey = cookie.key

        if (!map[cookieDomain]) map[cookieDomain] = {}
        if (!map[cookieDomain][cookiePath]) map[cookieDomain][cookiePath] = {}

        const oldCookie = map[cookieDomain][cookiePath][cookieKey]
        cookie.createTime = oldCookie && oldCookie.createTime || Date.now()

        if (this.$_checkExpires(cookie)) {
            // 未过期
            map[cookieDomain][cookiePath][cookieKey] = cookie
        } else if (oldCookie) {
            // 存在旧 cookie，且被设置为已过期
            delete map[cookieDomain][cookiePath][cookieKey]
        }

        // 持久化 cookie
        if (this.cookieStore !== 'memory' && this.cookieStore !== 'globalmemory') {
            const key = this.cookieStore === 'storage' ? `PAGE_COOKIE_${this.$_pageName}` : 'PAGE_COOKIE'
            wx.setStorage({
                key,
                data: this.serialize(),
            })
        }
    }

    /**
     * 拉取 cookie
     */
    getCookie(url, includeHttpOnly) {
        const {
            protocol, hostname, port, pathname
        } = Location.$$parse(url)
        const host = ((hostname || '') + (port ? ':' + port : '')) || ''
        const path = (pathname || '')[0] === '/' ? pathname : '/'
        const res = []

        const map = this.$_map
        const domainList = Object.keys(map)

        for (const domainItem of domainList) {
            // 判断 domain
            if (this.$_checkDomain(host, domainItem)) {
                const domainMap = map[domainItem] || {}
                const pathList = Object.keys(domainMap)

                for (const pathItem of pathList) {
                    // 判断 path
                    if (this.$_checkPath(path, pathItem)) {
                        const pathMap = map[domainItem][pathItem] || {}

                        Object.keys(pathMap).forEach(key => {
                            const cookie = pathMap[key]

                            if (!cookie) return

                            // 判断协议
                            if (cookie.secure && protocol !== 'https:' && protocol !== 'wss:') return
                            if (!includeHttpOnly && cookie.httpOnly && protocol && protocol !== 'http:') return

                            // 判断过期
                            if (this.$_checkExpires(cookie)) {
                                res.push(cookie)
                            } else {
                                // 过期，删掉
                                delete map[domainItem][pathItem][key]
                            }
                        })
                    }
                }
            }
        }

        return res
            .sort((a, b) => {
                const gap = a.createTime - b.createTime

                if (!gap) {
                    return a.key < b.key ? -1 : 1
                } else {
                    return gap
                }
            })
            .map(cookie => `${cookie.key}=${cookie.value}`)
            .join('; ')
    }

    /**
     * 序列化
     */
    serialize() {
        try {
            return JSON.stringify(this.$_map)
        } catch (err) {
            console.log('cannot serialize the cookie')
            return ''
        }
    }

    /**
     * 反序列化
     */
    deserialize(str) {
        let map = {}
        try {
            map = JSON.parse(str)
        } catch (err) {
            console.log('cannot deserialize the cookie')
            map = {}
        }

        // 合并 cookie
        const domainList = Object.keys(map)

        for (const domainItem of domainList) {
            const domainMap = map[domainItem] || {}
            const pathList = Object.keys(domainMap)

            for (const pathItem of pathList) {
                const pathMap = map[domainItem][pathItem] || {}

                Object.keys(pathMap).forEach(key => {
                    const cookie = pathMap[key]

                    if (!cookie) return

                    // 已存在则不覆盖
                    if (!this.$_map[domainItem]) this.$_map[domainItem] = {}
                    if (!this.$_map[domainItem][pathItem]) this.$_map[domainItem][pathItem] = {}
                    if (!this.$_map[domainItem][pathItem][key]) this.$_map[domainItem][pathItem][key] = cookie
                })
            }
        }
    }
}

module.exports = Cookie

}, function(modId) { var map = {"./location":1589353392165,"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392175, function(require, module, exports) {
class Navigator {
    constructor() {
        this.$_language = ''
        this.$_wxVersion = ''
        this.$_brand = '' // 手机品牌
        this.$_model = '' // 手机型号
        this.$_platform = ''
        this.$_system = '' // 操作系统版本

        this.$_userAgent = ''
    }

    /**
     * 重置实例
     */
    $$reset(info) {
        this.$_language = info.language
        this.$_wxVersion = info.version
        this.$_brand = info.brand
        this.$_model = info.model
        this.$_platform = info.platform
        this.$_system = info.system

        // 拼装 userAgent
        const appVersion = '5.0'
        const appleWebKitVersion = '602.3.12'
        let platformContext
        if (this.$_platform === 'ios') {
            // 拆分系统版本号
            let systemVersion = this.$_system.split(' ')
            if (systemVersion.length >= 2) {
                systemVersion = systemVersion[1].split('.').join('_')
            } else {
                systemVersion = ''
            }

            platformContext = `${this.$_brand}; CPU ${this.$_brand} OS ${systemVersion} like Mac OS X`
        } else if (this.$_platform === 'android') {
            platformContext = `Linux; ${this.$_system}; ${this.$_model}`
        } else {
            // 在开发者工具上，默认在 windows x64 上运行
            platformContext = 'Windows NT 6.1; win64; x64'
        }

        this.$_userAgent = `${this.appCodeName}/${appVersion} (${platformContext}) AppleWebKit/${appleWebKitVersion} (KHTML, like Gecko) Mobile MicroMessenger/${this.$_wxVersion} Language/${this.language}`
    }

    /**
     * 对外属性和方法
     */
    get userAgent() {
        return this.$_userAgent
    }

    get appCodeName() {
        return 'Mozilla'
    }

    get appName() {
        return 'Netscape'
    }

    get language() {
        return this.$_language
    }

    get languages() {
        return [this.$_language]
    }

    get platform() {
        return this.$_platform
    }

    get product() {
        return 'Gecko'
    }
}

module.exports = Navigator

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392176, function(require, module, exports) {
const EventTarget = require('../event/event-target')

class Screen extends EventTarget {
    constructor() {
        super()

        this.$_width = 0
        this.$_height = 0
    }

    /**
     * 重置实例
     */
    $$reset(info) {
        this.$_width = info.screenWidth
        this.$_height = info.screenHeight
    }

    /**
     * 对外属性和方法
     */
    get width() {
        return this.$_width
    }

    get height() {
        return this.$_height
    }
}

module.exports = Screen

}, function(modId) { var map = {"../event/event-target":1589353392149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392177, function(require, module, exports) {
/**
 * 暂不维护跳转后页面的历史，不做页面刷新的操作
 */
const Location = require('./location')
const EventTarget = require('../event/event-target')

class History extends EventTarget {
    constructor(location) {
        super()

        this.$_location = location
        this.$_stack = [{
            state: null,
            title: '',
            url: location.href,
        }]
        this.$_currentIndex = 0

        this.$_location.addEventListener('$_addToHistory', evt => {
            this.$_currentIndex++
            this.$_stack = this.$_stack.slice(0, this.$_currentIndex)
            this.$_stack.push({
                state: null,
                title: '',
                url: evt.href
            })
        })
    }

    /**
     * 检查是否同源
     */
    $_checkOrigin(url) {
        const {protocol, hostname, port} = Location.$$parse(url)

        return (!protocol || this.$_location.protocol === protocol) && (!hostname || this.$_location.hostname === hostname) && ((!hostname && !port) || this.$_location.port === port)
    }

    /**
     * 重置实例
     */
    $$reset() {
        this.$_stack = [{
            state: null,
            title: '',
            url: this.$_location.href,
        }]
        this.$_currentIndex = 0
    }

    /**
     * 对外属性和方法
     */
    get state() {
        const current = this.$_stack[this.$_currentIndex]
        return current && current.state || null
    }

    get length() {
        return this.$_stack.length
    }

    back() {
        this.go(-1)
    }

    forward() {
        this.go(1)
    }

    go(delta) {
        if (typeof delta === 'number') {
            const next = this.$_currentIndex + delta

            if (next >= 0 && next < this.$_stack.length && this.$_currentIndex !== next) {
                this.$_currentIndex = next
                // 替换 href，但不做跳转（理论上此处应该做跳转，但是在小程序环境里不适合）
                this.$_location.$$startCheckHash()
                this.$_location.$$setHrefWithoutCheck(this.$_stack[this.$_currentIndex].url)
                this.$_location.$$endCheckHash(true) // 因为不跳转，所以要强制触发 hashchange 检测

                this.$$trigger('popstate', {
                    event: {
                        state: this.state
                    }
                })
            }
        } else {
            // 刷新当前页面
            this.$_location.reload()
        }
    }

    pushState(state = null, title, url) {
        if (!url || typeof url !== 'string') return

        if (this.$_checkOrigin(url)) {
            // 同源才允许操作
            if (title && typeof title === 'string') {
                // 设置标题
                wx.setNavigationBarTitle({title})
            }


            this.$_currentIndex++
            this.$_stack = this.$_stack.slice(0, this.$_currentIndex)

            // 替换 href，但不做跳转
            this.$_location.$$setHrefWithoutCheck(url)

            this.$_stack.push({state, title, url: this.$_location.href})
        }
    }

    replaceState(state = null, title, url) {
        if (!url || typeof url !== 'string') return

        if (this.$_checkOrigin(url)) {
            // 同源才允许操作
            if (title && typeof title === 'string') {
                // 设置标题
                wx.setNavigationBarTitle({title})
            }

            // 替换 href，但不做跳转
            this.$_location.$$setHrefWithoutCheck(url)

            this.$_stack.splice(this.$_currentIndex, 1, {state, title, url: this.$_location.href})
        }
    }
}

module.exports = History

}, function(modId) { var map = {"./location":1589353392165,"../event/event-target":1589353392149}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392178, function(require, module, exports) {
const cache = require('../util/cache')

let pageUrlRouteMap = null

class Miniprogram {
    constructor(pageId) {
        this.$_pageId = pageId
        this.$_pageUrl = '' // 页面真实 url
        this.$_subpackagesMap = {} // 分包名映射表
    }

    get window() {
        return cache.getWindow(this.$_pageId) || null
    }

    get document() {
        return cache.getDocument(this.$_pageId) || null
    }

    get config() {
        return cache.getConfig()
    }

    get subpackagesMap() {
        return this.$_subpackagesMap
    }

    /**
     * 初始化
     */
    init(url) {
        if (typeof url === 'string') this.$_pageUrl = url // 设置真实 url
        const {
            origin, entry, router, runtime = {}
        } = cache.getConfig()
        const subpackagesMap = runtime.subpackagesMap || {}

        this.$_pageUrl = this.$_pageUrl || (origin + entry)
        this.$_subpackagesMap = subpackagesMap
        this.window.location.$$reset(this.$_pageUrl)
        this.window.history.$$reset()

        if (!pageUrlRouteMap) {
            // 需要初始化页面 url - 小程序页面路由映射表
            pageUrlRouteMap = {}

            Object.keys(router).forEach(pageName => {
                const regexpList = []

                router[pageName].forEach(pathObj => {
                    // 构造正则表达式
                    const regexp = new RegExp(pathObj.regexp, pathObj.options)
                    regexpList.push(regexp)
                })

                // 将每个页面的路由改造成函数，方便后续做匹配用
                pageUrlRouteMap[pageName] = pathname => {
                    for (const regexp of regexpList) {
                        const parseRes = regexp.exec(pathname)
                        regexp.lastIndex = 0

                        if (parseRes) {
                            // 匹配成功
                            const packageName = subpackagesMap[pageName]
                            return `/${packageName ? packageName + '/' : ''}pages/${pageName}/index`
                        }
                    }

                    return null
                }
            })
        }
    }

    /**
     * 需要匹配对应路由的 route
     */
    getMatchRoute(pathname) {
        const keys = Object.keys(pageUrlRouteMap)
        for (const key of keys) {
            const matchRes = pageUrlRouteMap[key](pathname)

            if (matchRes) return matchRes // 匹配成功
        }

        return null
    }

    /**
     * 判断是否 tabBar 页面
     */
    isTabBarPage(pageRoute) {
        const {
            runtime = {}
        } = cache.getConfig()
        const tabBarMap = runtime.tabBarMap || {}
        return !!tabBarMap[pageRoute]
    }
}

module.exports = Miniprogram

}, function(modId) { var map = {"../util/cache":1589353392146}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392179, function(require, module, exports) {
const Event = require('../event/event')

class LocalStorage {
    constructor(window) {
        this.$_keys = []
        this.$_window = window
    }

    /**
     * 更新 storage 信息
     */
    $_updateInfo() {
        try {
            const info = wx.getStorageInfoSync()
            const pages = getCurrentPages() || []
            pages.forEach(page => {
                if (page && page.window) {
                    page.window.localStorage.$$keys = info.keys
                }
            })
        } catch (err) {
            console.warn('getStorageInfoSync fail')
        }
    }

    /**
     * 触发 window 的 storage 事件
     */
    $_triggerStorage(key, newValue, oldValue, force) {
        if (!force && newValue === oldValue) return

        const pages = getCurrentPages() || []
        pages.forEach(page => {
            if (page && page.window && page.window !== this.$_window) {
                page.window.$$trigger('storage', {
                    event: new Event({
                        name: 'storage',
                        target: page.window,
                        $$extra: {
                            key,
                            newValue,
                            oldValue,
                            storageArea: this,
                            url: this.$_window.location.href,
                        }
                    })
                })
            }
        })
    }

    set $$keys(keys) {
        this.$_keys = keys
    }

    /**
     * 对外属性和方法
     */
    get length() {
        return this.$_keys && this.$_keys.length || 0
    }

    key(num) {
        if (typeof num !== 'number' || !isFinite(num) || num < 0) return null

        return this.$_keys[num] || null
    }

    getItem(key) {
        if (!key || typeof key !== 'string') return null

        return wx.getStorageSync(key) || null
    }

    setItem(key, data) {
        if (!key || typeof key !== 'string') return
        data = '' + data

        const oldValue = wx.getStorageSync(key) || null

        wx.setStorageSync(key, data)
        this.$_updateInfo()
        this.$_triggerStorage(key, data, oldValue)
    }

    removeItem(key) {
        if (!key || typeof key !== 'string') return

        const oldValue = wx.getStorageSync(key) || null

        wx.removeStorageSync(key)
        this.$_updateInfo()
        this.$_triggerStorage(key, null, oldValue)
    }

    clear() {
        wx.clearStorageSync()
        this.$_updateInfo()
        this.$_triggerStorage(null, null, null, true)
    }
}

module.exports = LocalStorage

}, function(modId) { var map = {"../event/event":1589353392150}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392180, function(require, module, exports) {
const Event = require('../event/event')

class SessionStorage {
    constructor(window) {
        this.$_keys = []
        this.$_map = {}
        this.$_window = window
    }

    /**
     * 触发 window 的 storage 事件
     */
    $_triggerStorage(key, newValue, oldValue, force) {
        if (!force && newValue === oldValue) return

        const pages = getCurrentPages() || []
        pages.forEach(page => {
            if (page && page.window && page.window !== this.$_window) {
                page.window.$$trigger('storage', {
                    event: new Event({
                        name: 'storage',
                        target: page.window,
                        $$extra: {
                            key,
                            newValue,
                            oldValue,
                            storageArea: this,
                            url: this.$_window.location.href,
                        }
                    })
                })
            }
        })
    }

    /**
     * 对外属性和方法
     */
    get length() {
        return this.$_keys.length
    }

    key(num) {
        if (typeof num !== 'number' || !isFinite(num) || num < 0) return null

        return this.$_keys[num] || null
    }

    getItem(key) {
        if (!key || typeof key !== 'string') return null

        return this.$_map[key] || null
    }

    setItem(key, data) {
        if (!key || typeof key !== 'string') return
        data = '' + data

        const oldValue = this.$_map[key] || null

        this.$_map[key] = data

        // 调整顺序
        const index = this.$_keys.indexOf(key)
        if (index >= 0) this.$_keys.splice(index, 1)
        this.$_keys.push(key)

        this.$_triggerStorage(key, data, oldValue)
    }

    removeItem(key) {
        if (!key || typeof key !== 'string') return

        const oldValue = this.$_map[key] || null

        delete this.$_map[key]

        // 删除 key
        const index = this.$_keys.indexOf(key)
        if (index >= 0) this.$_keys.splice(index, 1)

        this.$_triggerStorage(key, null, oldValue)
    }

    clear() {
        this.$_keys.forEach(key => {
            delete this.$_map[key]
        })

        this.$_keys.length = 0

        this.$_triggerStorage(null, null, null, true)
    }
}

module.exports = SessionStorage

}, function(modId) { var map = {"../event/event":1589353392150}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392181, function(require, module, exports) {
class Performance {
    constructor(timeOrigin) {
        this.$_timeOrigin = timeOrigin
    }

    /**
     * 对外属性和方法
     */
    get navigation() {
        console.warn('performance.navigation is not supported')
        return null
    }

    get timing() {
        console.warn('performance.timing is not supported')
        return null
    }

    get timeOrigin() {
        return this.$_timeOrigin
    }

    now() {
        return +new Date() - this.$_timeOrigin
    }
}

module.exports = Performance

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353392182, function(require, module, exports) {
const EventTarget = require('../event/event-target')

const SUPPORT_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']
const STATUS_TEXT_MAP = {
    100: 'Continue',
    101: 'Switching protocols',

    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',

    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',

    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Suitable',
    417: 'Expectation Failed',

    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
}

class XMLHttpRequest extends EventTarget {
    constructor(window) {
        super()

        this.$_window = window
        this.$_method = ''
        this.$_url = ''
        this.$_data = null
        this.$_status = 0
        this.$_statusText = ''
        this.$_readyState = XMLHttpRequest.UNSENT
        this.$_header = {
            Accept: '*/*'
        }
        this.$_responseType = ''
        this.$_resHeader = null
        this.$_response = null
        this.$_timeout = 0
        this.$_startTime = null

        this.$_requestTask = null
        this.$_requestSuccess = this.$_requestSuccess.bind(this)
        this.$_requestFail = this.$_requestFail.bind(this)
        this.$_requestComplete = this.$_requestComplete.bind(this)
    }

    /**
   * readyState 变化
   */
    $_callReadyStateChange(readyState) {
        const hasChange = readyState !== this.$_readyState
        this.$_readyState = readyState

        if (hasChange) this.$$trigger('readystatechange')
    }

    /**
   * 执行请求
   */
    $_callRequest() {
        if (this.$_timeout) {
            this.$_startTime = +new Date()

            setTimeout(() => {
                if (!this.$_status && this.$_readyState !== XMLHttpRequest.DONE) {
                    // 超时
                    if (this.$_requestTask) this.$_requestTask.abort()
                    this.$_callReadyStateChange(XMLHttpRequest.DONE)
                    this.$$trigger('timeout')
                }
            }, this.$_timeout)
        }

        // 重置各种状态
        this.$_status = 0
        this.$_statusText = ''
        this.$_readyState = XMLHttpRequest.OPENED
        this.$_resHeader = null
        this.$_response = null

        // 头信息
        const header = Object.assign({}, this.$_header)
        if (this.$_window) {
            header.cookie = this.$_window.document.$$cookie
        }

        // 补完 url
        let url = this.$_url
        url = url.indexOf('//') === -1 ? this.$_window.location.origin + url : url

        this.$_requestTask = wx.request({
            url,
            data: this.$_data || {},
            header,
            method: this.$_method,
            dataType: this.$_responseType === 'json' ? 'json' : 'text',
            responseType: this.$_responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
            success: this.$_requestSuccess,
            fail: this.$_requestFail,
            complete: this.$_requestComplete,
        })
    }

    /**
   * 请求成功
   */
    $_requestSuccess({data, statusCode, header}) {
        this.$_status = statusCode
        this.$_resHeader = header

        this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED)

        // 处理 set-cookie
        if (this.$_window) {
            const setCookie = header['Set-Cookie']

            if (setCookie && typeof setCookie === 'string') {
                this.$_window.document.$$setCookie(setCookie)
            }
        }

        // 处理返回数据
        if (data) {
            this.$_callReadyStateChange(XMLHttpRequest.LOADING)
            this.$$trigger('loadstart')
            this.$_response = data
            this.$$trigger('loadend')
        }
    }

    /**
   * 请求失败
   */
    $_requestFail({errMsg}) {
        this.$_status = 0
        this.$_statusText = errMsg

        this.$$trigger('error')
    }

    /**
   * 请求完成
   */
    $_requestComplete() {
        this.$_startTime = null
        this.$_requestTask = null
        this.$_callReadyStateChange(XMLHttpRequest.DONE)

        if (this.$_status) {
            this.$$trigger('load')
        }
    }

    /**
   * 对外属性和方法
   */
    get timeout() {
        return this.$_timeout
    }

    set timeout(timeout) {
        if (typeof timeout !== 'number' || !isFinite(timeout) || timeout <= 0) return

        this.$_timeout = timeout
    }

    get status() {
        return this.$_status
    }

    get statusText() {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED) return ''

        return STATUS_TEXT_MAP[this.$_status + ''] || this.$_statusText || ''
    }

    get readyState() {
        return this.$_readyState
    }

    get responseType() {
        return this.$_responseType
    }

    set responseType(value) {
        if (typeof value !== 'string') return

        this.$_responseType = value
    }

    get responseText() {
        if (!this.$_responseType || this.$_responseType === 'text') {
            return this.$_response
        }

        return null
    }

    get response() {
        return this.$_response
    }

    abort() {
        if (this.$_requestTask) {
            this.$_requestTask.abort()
            this.$$trigger('abort')
        }
    }

    getAllResponseHeaders() {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED || !this.$_resHeader) return ''

        return Object.keys(this.$_resHeader)
            .map(key => `${key}: ${this.$_resHeader[key]}`)
            .join('\r\n')
    }

    getResponseHeader(name) {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED || !this.$_resHeader) return null

        // 处理大小写不敏感
        const key = Object.keys(this.$_resHeader).find(item => item.toLowerCase() === name.toLowerCase())
        const value = key ? this.$_resHeader[key] : null

        return typeof value === 'string' ? value : null
    }

    open(method, url) {
        if (typeof method === 'string') method = method.toUpperCase()

        if (SUPPORT_METHOD.indexOf(method) < 0) return
        if (!url || typeof url !== 'string') return

        this.$_method = method
        this.$_url = url

        this.$_callReadyStateChange(XMLHttpRequest.OPENED)
    }

    setRequestHeader(header, value) {
        if (typeof header === 'string' && typeof value === 'string') {
            this.$_header[header] = value
        }
    }

    send(data) {
        if (this.$_readyState !== XMLHttpRequest.OPENED) return

        this.$_data = data
        this.$_callRequest()
    }
}

XMLHttpRequest.UNSENT = 0
XMLHttpRequest.OPENED = 1
XMLHttpRequest.HEADERS_RECEIVED = 2
XMLHttpRequest.LOADING = 3
XMLHttpRequest.DONE = 4

module.exports = XMLHttpRequest

}, function(modId) { var map = {"../event/event-target":1589353392149}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1589353392144);
})()
//# sourceMappingURL=index.js.map