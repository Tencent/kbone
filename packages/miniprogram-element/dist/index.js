module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1589353393367, function(require, module, exports) {
const mp = require('miniprogram-render')
const _ = require('./util/tool')
const initHandle = require('./util/init-handle')
const component = require('./util/component')

const {
    cache,
    Event,
    EventTarget,
    tool,
} = mp.$$adapter
const {
    NOT_SUPPORT,
    IN_COVER,
} = _
const {
    wxCompNameMap,
} = component

// dom 子树作为自定义组件渲染的层级数
const MAX_DOM_SUB_TREE_LEVEL = 10
let DOM_SUB_TREE_LEVEL = 10

const version = wx.getSystemInfoSync().SDKVersion
const behaviors = []
if (_.compareVersion(version, '2.10.3') >= 0) {
    behaviors.push('wx://form-field-button')
}

Component({
    behaviors,
    properties: {
        inCover: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        wxCompName: '', // 需要渲染的内置组件名
        wxCustomCompName: '', // 需要渲染的自定义组件名
        childNodes: [], // 孩子节点
    },
    options: {
        addGlobalClass: true, // 开启全局样式
    },
    created() {
        const config = cache.getConfig()

        // 根据配置重置全局变量
        const domSubTreeLevel = +config.optimization.domSubTreeLevel
        if (domSubTreeLevel >= 1 && domSubTreeLevel <= MAX_DOM_SUB_TREE_LEVEL) DOM_SUB_TREE_LEVEL = domSubTreeLevel
    },
    attached() {
        const nodeId = this.dataset.privateNodeId
        const pageId = this.dataset.privatePageId
        const data = {}

        this.nodeId = nodeId
        this.pageId = pageId

        // 记录 dom
        this.domNode = cache.getNode(pageId, nodeId)
        if (!this.domNode) return
        this.domNode._wxComponent = this

        // 存储 document
        this.document = cache.getDocument(pageId)

        // 监听全局事件
        this.onChildNodesUpdate = tool.throttle(this.onChildNodesUpdate.bind(this))
        this.domNode.$$clearEvent('$$childNodesUpdate')
        this.domNode.addEventListener('$$childNodesUpdate', this.onChildNodesUpdate)
        this.onSelfNodeUpdate = tool.throttle(this.onSelfNodeUpdate.bind(this))
        this.domNode.$$clearEvent('$$domNodeUpdate')
        this.domNode.addEventListener('$$domNodeUpdate', this.onSelfNodeUpdate)

        // 初始化
        this.init(data)
        if (IN_COVER.indexOf(data.wxCompName) !== -1) this.data.inCover = true

        // 初始化孩子节点
        const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this)
        data.childNodes = _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate)

        // 执行一次 setData
        if (Object.keys(data).length) this.setData(data)
    },
    detached() {
        this.nodeId = null
        this.pageId = null
        this.domNode = null
        this.document = null
    },
    methods: {
        /**
         * 监听子节点变化
         */
        onChildNodesUpdate() {
            // 判断是否已被销毁
            if (!this.pageId || !this.nodeId) return

            // 儿子节点有变化
            const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this)
            if (_.checkDiffChildNodes(childNodes, this.data.childNodes)) {
                this.setData({
                    childNodes: _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate),
                })
            }

            // 触发子节点变化
            const childNodeStack = [].concat(childNodes)
            let childNode = childNodeStack.pop()
            while (childNode) {
                if (childNode.type === 'element' && !childNode.isImage && !childNode.isLeaf && !childNode.isSimple && !childNode.useTemplate) {
                    childNode.domNode.$$trigger('$$childNodesUpdate')
                }

                if (childNode.childNodes && childNode.childNodes.length) childNode.childNodes.forEach(subChildNode => childNodeStack.push(subChildNode))
                childNode = childNodeStack.pop()
            }
        },

        /**
         * 监听当前节点变化
         */
        onSelfNodeUpdate() {
            // 判断是否已被销毁
            if (!this.pageId || !this.nodeId) return

            const newData = {}
            const domNode = this.domNode
            const data = this.data
            const tagName = domNode.tagName

            if (tagName === 'WX-COMPONENT') {
                // 内置组件
                if (data.wxCompName !== domNode.behavior) newData.wxCompName = domNode.behavior
                const wxCompName = wxCompNameMap[domNode.behavior]
                if (wxCompName) _.checkComponentAttr(wxCompName, domNode, newData, data)
            } else if (tagName === 'WX-CUSTOM-COMPONENT') {
                // 自定义组件
                if (data.wxCustomCompName !== domNode.behavior) newData.wxCustomCompName = domNode.behavior
                if (data.nodeId !== this.nodeId) data.nodeId = this.nodeId
                if (data.pageId !== this.pageId) data.pageId = this.pageId
            } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
                // 不支持标签
                newData.wxCompName = 'not-support'
                if (data.content !== domNode.content) newData.content = domNode.textContent
            } else {
                // 可替换 html 标签
                const wxCompName = wxCompNameMap[tagName]
                if (wxCompName) newData.wxCompName = wxCompName
            }

            this.setData(newData)
        },

        /**
         * 触发简单节点事件，不做捕获冒泡处理
         */
        callSingleEvent(eventName, evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$trigger(eventName, {
                event: new Event({
                    timeStamp: evt && evt.timeStamp,
                    touches: evt && evt.touches,
                    changedTouches: evt && evt.changedTouches,
                    name: eventName,
                    target: domNode,
                    eventPhase: Event.AT_TARGET,
                    detail: evt && evt.detail,
                    $$extra: evt && evt.extra,
                }),
                currentTarget: domNode,
            })
        },

        /**
         * 触发简单节点事件，不做冒泡处理，但会走捕获阶段
         */
        callSimpleEvent(eventName, evt, domNode) {
            domNode = domNode || this.getDomNodeFromEvt(evt)
            if (!domNode) return

            EventTarget.$$process(domNode, new Event({
                touches: evt.touches,
                changedTouches: evt.changedTouches,
                name: eventName,
                target: domNode,
                eventPhase: Event.AT_TARGET,
                detail: evt && evt.detail,
                $$extra: evt && evt.extra,
                bubbles: false, // 不冒泡
            }))
        },

        /**
         * 触发事件
         */
        callEvent(eventName, evt, extra) {
            const domNode = this.getDomNodeFromEvt(evt)

            if (!domNode) return

            EventTarget.$$process(domNode, eventName, evt, extra, (domNode, evt, isCapture) => {
                // 延迟触发跳转，先等所有同步回调处理完成
                setTimeout(() => {
                    if (evt.cancelable) return
                    const window = cache.getWindow(this.pageId)

                    // 处理特殊节点事件
                    if (domNode.tagName === 'A' && evt.type === 'click' && !isCapture) {
                        // 处理 a 标签的跳转
                        const href = domNode.href
                        const target = domNode.target

                        if (!href || href.indexOf('javascript') !== -1) return

                        if (target === '_blank') window.open(href)
                        else window.location.href = href
                    } else if (domNode.tagName === 'LABEL' && evt.type === 'click' && !isCapture) {
                        // 处理 label 的点击
                        const forValue = domNode.getAttribute('for')
                        let targetDomNode
                        if (forValue) {
                            targetDomNode = window.document.getElementById(forValue)
                        } else {
                            targetDomNode = domNode.querySelector('input')

                            // 寻找 switch 节点
                            if (!targetDomNode) targetDomNode = domNode.querySelector('wx-component[behavior=switch]')
                        }

                        if (!targetDomNode || !!targetDomNode.getAttribute('disabled')) return

                        // 找到了目标节点
                        if (targetDomNode.tagName === 'INPUT') {
                            if (_.checkEventAccessDomNode(evt, targetDomNode, domNode)) return

                            const type = targetDomNode.type
                            if (type === 'radio') {
                                targetDomNode.setAttribute('checked', true)
                                const name = targetDomNode.name
                                const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || []
                                for (const otherDomNode of otherDomNodes) {
                                    if (otherDomNode.type === 'radio' && otherDomNode !== targetDomNode) {
                                        otherDomNode.setAttribute('checked', false)
                                    }
                                }
                                this.callSimpleEvent('change', {detail: {value: targetDomNode.value}}, targetDomNode)
                            } else if (type === 'checkbox') {
                                targetDomNode.setAttribute('checked', !targetDomNode.checked)
                                this.callSimpleEvent('change', {detail: {value: targetDomNode.checked ? [targetDomNode.value] : []}}, targetDomNode)
                            } else {
                                targetDomNode.focus()
                            }
                        } else if (targetDomNode.tagName === 'WX-COMPONENT') {
                            if (_.checkEventAccessDomNode(evt, targetDomNode, domNode)) return

                            const behavior = targetDomNode.behavior
                            if (behavior === 'switch') {
                                const checked = !targetDomNode.getAttribute('checked')
                                targetDomNode.setAttribute('checked', checked)
                                this.callSimpleEvent('change', {detail: {value: checked}}, targetDomNode)
                            }
                        }
                    } else if ((domNode.tagName === 'BUTTON' || (domNode.tagName === 'WX-COMPONENT' && domNode.behavior === 'button')) && evt.type === 'click' && !isCapture) {
                        // 处理 button 点击
                        const type = domNode.tagName === 'BUTTON' ? domNode.getAttribute('type') : domNode.getAttribute('form-type')
                        const formAttr = domNode.getAttribute('form')
                        const form = formAttr ? window.document.getElementById(formAttr) : _.findParentNode(domNode, 'FORM')

                        if (!form) return
                        if (type !== 'submit' && type !== 'reset') return

                        const inputList = form.querySelectorAll('input[name]')
                        const textareaList = form.querySelectorAll('textarea[name]')
                        const switchList = form.querySelectorAll('wx-component[behavior=switch]').filter(item => !!item.getAttribute('name'))
                        const sliderList = form.querySelectorAll('wx-component[behavior=slider]').filter(item => !!item.getAttribute('name'))
                        const pickerList = form.querySelectorAll('wx-component[behavior=picker]').filter(item => !!item.getAttribute('name'))

                        if (type === 'submit') {
                            const formData = {}
                            if (inputList.length) {
                                inputList.forEach(item => {
                                    if (item.type === 'radio') {
                                        if (item.checked) formData[item.name] = item.value
                                    } else if (item.type === 'checkbox') {
                                        formData[item.name] = formData[item.name] || []
                                        if (item.checked) formData[item.name].push(item.value)
                                    } else {
                                        formData[item.name] = item.value
                                    }
                                })
                            }
                            if (textareaList.length) textareaList.forEach(item => formData[item.getAttribute('name')] = item.value)
                            if (switchList.length) switchList.forEach(item => formData[item.getAttribute('name')] = !!item.getAttribute('checked'))
                            if (sliderList.length) sliderList.forEach(item => formData[item.getAttribute('name')] = +item.getAttribute('value') || 0)
                            if (pickerList.length) pickerList.forEach(item => formData[item.getAttribute('name')] = item.getAttribute('value'))

                            const detail = {value: formData}
                            if (form._formId) {
                                detail.formId = form._formId
                                form._formId = null
                            }
                            this.callSimpleEvent('submit', {detail, extra: {$$from: 'button'}}, form)
                        } else if (type === 'reset') {
                            if (inputList.length) {
                                inputList.forEach(item => {
                                    if (item.type === 'radio') {
                                        item.setAttribute('checked', false)
                                    } else if (item.type === 'checkbox') {
                                        item.setAttribute('checked', false)
                                    } else {
                                        item.setAttribute('value', '')
                                    }
                                })
                            }
                            if (textareaList.length) textareaList.forEach(item => item.setAttribute('value', ''))
                            if (switchList.length) switchList.forEach(item => item.setAttribute('checked', undefined))
                            if (sliderList.length) sliderList.forEach(item => item.setAttribute('value', undefined))
                            if (pickerList.length) pickerList.forEach(item => item.setAttribute('value', undefined))

                            this.callSimpleEvent('reset', {extra: {$$from: 'button'}}, form)
                        }
                    }
                }, 0)
            })
        },

        /**
         * 监听节点事件
         */
        onTouchStart(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                this.callEvent('touchstart', evt)
            }
        },

        onTouchMove(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                this.callEvent('touchmove', evt)
            }
        },

        onTouchEnd(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                this.callEvent('touchend', evt)
            }
        },

        onTouchCancel(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                this.callEvent('touchcancel', evt)
            }
        },

        onTap(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                this.callEvent('click', evt, {button: 0}) // 默认左键
            }
        },

        /**
         * 图片相关事件
         */
        onImgLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onImgError(evt) {
            this.callSingleEvent('error', evt)
        },

        /**
         * capture 相关事件，wx-capture 的事件不走仿造事件捕获冒泡系统，单独触发
         */
        onCaptureTouchStart(evt) {
            this.callSingleEvent('touchstart', evt)
        },

        onCaptureTouchMove(evt) {
            this.callSingleEvent('touchmove', evt)
        },

        onCaptureTouchEnd(evt) {
            this.callSingleEvent('touchend', evt)
        },

        onCaptureTouchCancel(evt) {
            this.callSingleEvent('touchcancel', evt)
        },

        onCaptureTap(evt) {
            this.callSingleEvent('click', evt)
        },

        /**
         * 动画相关事件
         */
        onTransitionEnd(evt) {
            this.callEvent('transitionend', evt)
        },

        onAnimationStart(evt) {
            this.callEvent('animationstart', evt)
        },

        onAnimationIteration(evt) {
            this.callEvent('animationiteration', evt)
        },

        onAnimationEnd(evt) {
            this.callEvent('animationend', evt)
        },

        /**
         * 从小程序事件对象中获取 domNode
         */
        getDomNodeFromEvt(evt) {
            if (!evt) return
            const pageId = this.pageId
            const originNodeId = evt.currentTarget && evt.currentTarget.dataset.privateNodeId || this.nodeId
            return cache.getNode(pageId, originNodeId)
        },

        ...initHandle,
    }
})

}, function(modId) {var map = {"./util/tool":1589353393368,"./util/init-handle":1589353393405,"./util/component":1589353393370}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393368, function(require, module, exports) {
const mp = require('miniprogram-render')
const initData = require('./init-data')
const component = require('./component')

const {
    cache,
    tool,
} = mp.$$adapter

const {
    wxCompNameMap,
    wxSubComponentMap,
} = component

const ELEMENT_DIFF_KEYS = ['nodeId', 'pageId', 'tagName', 'compName', 'id', 'className', 'style', 'src', 'mode', 'lazyLoad', 'showMenuByLongpress', 'useTemplate', 'isImage', 'isLeaf', 'isSimple', 'content', 'extra']
const TEXT_NODE_DIFF_KEYS = ['nodeId', 'pageId', 'content']
const NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT = ['WX-COMPONENT', 'WX-CUSTOM-COMPONENT'] // 需要分离 class 和 style 的节点
const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT = ['swiper', 'movable-area']
const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT = ['swiper-item', 'movable-view', 'picker-view-column']
const NEET_RENDER_TO_CUSTOM_ELEMENT = ['IFRAME', ...NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT] // 必须渲染成自定义组件的节点
const NOT_SUPPORT = ['IFRAME']
const USE_TEMPLATE = ['cover-image', 'movable-area', 'movable-view', 'swiper', 'swiper-item', 'icon', 'progress', 'rich-text', 'button', 'editor', 'form', 'INPUT', 'picker', 'slider', 'switch', 'TEXTAREA', 'navigator', 'camera', 'image', 'live-player', 'live-pusher', 'VIDEO', 'map', 'CANVAS', 'ad', 'official-account', 'open-data', 'web-view', 'capture', 'catch', 'animation'] // 使用 template 渲染
const IN_COVER = ['cover-view'] // 子节点必须使用 cover-view/cover-image

/**
 * 过滤子节点，只获取儿子节点
 */
function filterNodes(domNode, level, component) {
    const window = cache.getWindow(domNode.$$pageId)
    const childNodes = domNode.childNodes || []

    if (!childNodes.map) return []
    if (NOT_SUPPORT.indexOf(domNode.tagName) >= 0) return [] // 不支持标签，不渲染子节点

    return childNodes.map(child => {
        const domInfo = child.$$domInfo

        if (domInfo.type !== 'element' && domInfo.type !== 'text') return

        domInfo.className = domInfo.type === 'element' ? `h5-${domInfo.tagName} node-${domInfo.nodeId} ${domInfo.className || ''}` : '' // 增加默认 class
        domInfo.domNode = child

        // 特殊节点
        if (NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT.indexOf(child.tagName) >= 0) {
            if (domInfo.tagName === 'wx-component' && NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT.indexOf(child.behavior) !== -1) {
                // 特殊内置组件，强制作为某内置组件的子组件，需要直接在当前模板渲染
                domInfo.compName = child.behavior
                domInfo.extra = {
                    hidden: child.getAttribute('hidden') || false,
                }

                // 补充该内置组件的属性
                const {properties} = wxSubComponentMap[child.behavior] || {}
                if (properties && properties.length) {
                    properties.forEach(({name, get}) => {
                        domInfo.extra[name] = get(child)
                    })
                }

                if (child.childNodes.length && level > 0) {
                    domInfo.childNodes = filterNodes(child, level - 1, component)
                }
                return domInfo
            }

            // 不需要处理 id 和样式
            domInfo.className = `h5-${domInfo.tagName} ${domInfo.tagName === 'wx-component' ? 'wx-' + child.behavior : ''}`
            domInfo.id = ''
            domInfo.style = ''
        }

        // 判断图片节点
        domInfo.isImage = domInfo.type === 'element' && domInfo.tagName === 'img'
        if (domInfo.isImage) {
            domInfo.src = child.src ? tool.completeURL(child.src, window.location.origin, true) : ''
            domInfo.mode = child.getAttribute('mode') || ''
            domInfo.lazyLoad = !!child.getAttribute('lazy-load')
            domInfo.showMenuByLongpress = !!child.getAttribute('show-menu-by-longpress')
        }

        // 判断是否使用 template 渲染
        const templateName = domInfo.tagName === 'wx-component' ? child.behavior : child.tagName
        domInfo.useTemplate = !domInfo.isImage && USE_TEMPLATE.indexOf(templateName) !== -1
        if (domInfo.useTemplate) {
            const wxCompName = wxCompNameMap[templateName]
            const extra = {}
            if (wxCompName) checkComponentAttr(wxCompName, child, extra, null, `h5-${domInfo.tagName} ${domInfo.tagName === 'wx-component' ? 'wx-' + child.behavior : ''}`)
            extra.pageId = domInfo.pageId
            extra.nodeId = domInfo.nodeId
            extra.inCover = component.data.inCover
            extra.hasChildren = !!child.childNodes.length
            domInfo.extra = extra

            // 给 template 中的特殊节点用
            if (NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT.indexOf(templateName) !== -1) {
                const childNodes = filterNodes(child, 0) || []
                extra.childNodes = childNodes.map(childNode => {
                    const copyChildNode = Object.assign({}, childNode)
                    delete copyChildNode.domNode
                    return copyChildNode
                })
            }

            // wx-catch 的 touch 事件会导致 tap 事件的触发，需要真正被绑定后再补充句柄
            if (wxCompName === 'catch') {
                extra.touchStart = child.$$hasEventHandler('touchstart') ? 'onTouchStart' : ''
                extra.touchMove = child.$$hasEventHandler('touchmove') ? 'onTouchMove' : ''
                extra.touchEnd = child.$$hasEventHandler('touchend') ? 'onTouchEnd' : ''
                extra.touchCancel = child.$$hasEventHandler('touchcancel') ? 'onTouchCancel' : ''
            }
        }

        // 判断叶子节点
        domInfo.isLeaf = !domInfo.isImage && !domInfo.useTemplate && domInfo.type === 'element' && !child.children.length && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName) === -1
        if (domInfo.isLeaf) {
            domInfo.content = child.childNodes.map(childNode => (childNode.$$domInfo.type === 'text' ? childNode.textContent : '')).join('')
        }

        // 判断可直接用 view 渲染的简单子节点
        domInfo.isSimple = !domInfo.isImage && !domInfo.useTemplate && !domInfo.isLeaf && domInfo.type === 'element' && NEET_RENDER_TO_CUSTOM_ELEMENT.indexOf(child.tagName) === -1 && level > 0
        if (domInfo.isSimple) {
            domInfo.content = ''
            domInfo.childNodes = filterNodes(child, level - 1, component)
        }

        // 挂载该节点所处的自定义组件实例
        child._wxComponent = component

        return domInfo
    }).filter(child => !!child)
}

/**
 * 判断两值是否相等
 */
function isEqual(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        // 值为数值，需要考虑精度
        return parseInt(a * 1000, 10) === parseInt(b * 1000, 10)
    }

    return a === b
}

/**
 * 比较新旧子节点是否不同
 */
function checkDiffChildNodes(newChildNodes, oldChildNodes) {
    if (newChildNodes.length !== oldChildNodes.length) return true

    for (let i = 0, len = newChildNodes.length; i < len; i++) {
        const newChild = newChildNodes[i]
        const oldChild = oldChildNodes[i]

        if (newChild.type !== oldChild.type) return true

        const keys = newChild.type === 'element' ? ELEMENT_DIFF_KEYS : TEXT_NODE_DIFF_KEYS

        for (const key of keys) {
            const newValue = newChild[key]
            const oldValue = oldChild[key]
            if (typeof newValue === 'object' && !Array.isArray(newValue)) {
                // 值为对象，则判断对象顶层值是否有变化
                if (typeof oldValue !== 'object') return true

                // 需要强制更新
                if (key === 'extra' && newValue.forceUpdate) {
                    newValue.forceUpdate = false
                    return true
                }

                const objectKeys = Object.keys(newValue)
                for (const objectKey of objectKeys) {
                    if (!isEqual(newValue[objectKey], oldValue[objectKey])) return true
                }
            } else if (!isEqual(newValue, oldValue)) {
                return true
            }
        }

        // 比较孙子后辈节点
        const newGrandChildNodes = newChild.childNodes || []
        const oldGrandChildNodes = oldChild.childNodes || []
        if (newGrandChildNodes.length || oldGrandChildNodes.length) {
            const checkRes = checkDiffChildNodes(newGrandChildNodes, oldGrandChildNodes)
            if (checkRes) return true
        }
    }

    return false
}

/**
 * 检查组件属性
 */
function checkComponentAttr(name, domNode, destData, oldData, extraClass = '') {
    const attrs = initData[name]

    destData.wxCompName = name

    if (attrs && attrs.length) {
        for (const {name, get, canBeUserChanged = false} of attrs) {
            const newValue = get(domNode)
            if (canBeUserChanged) {
                // 可被用户行为改变的属性，除了 data 外，还需要对比监听到上次用户行为修改的值
                const oldValues = domNode._oldValues
                if (!oldData || !isEqual(newValue, oldData[name]) || (oldValues && !isEqual(newValue, oldValues[name]))) {
                    destData[name] = newValue
                    destData.forceUpdate = true // 避免被 diff 掉，需要强制更新
                }
            } else if (!oldData || !isEqual(newValue, oldData[name])) {
                // 对比 data
                destData[name] = newValue
            }
        }
    }

    // 补充 id、class、style 和 hidden
    const newId = domNode.id
    if (!oldData || oldData.id !== newId) destData.id = newId
    const newClass = `${extraClass} wx-comp-${name} node-${domNode.$$nodeId} ${domNode.className || ''}`
    if (!oldData || oldData.className !== newClass) destData.className = newClass
    const newStyle = domNode.style.cssText
    if (!oldData || oldData.style !== newStyle) destData.style = newStyle
    const newHidden = domNode.getAttribute('hidden') || false
    if (!oldData || oldData.hidden !== newHidden) destData.hidden = newHidden
}

/**
 * 处理不需要渲染成自定义组件的节点
 */
function dealWithLeafAndSimple(childNodes, onChildNodesUpdate) {
    if (childNodes && childNodes.length) {
        childNodes = childNodes.map(originChildNode => {
            const childNode = Object.assign({}, originChildNode)

            if (childNode.isImage || childNode.isLeaf || childNode.isSimple || childNode.useTemplate) {
                childNode.domNode.$$clearEvent('$$childNodesUpdate')
                childNode.domNode.addEventListener('$$childNodesUpdate', onChildNodesUpdate)
            }

            delete childNode.domNode
            childNode.childNodes = dealWithLeafAndSimple(childNode.childNodes, onChildNodesUpdate)

            return childNode
        })
    }

    return childNodes
}

/**
 * 检查事件是否经过某个节点
 */
function checkEventAccessDomNode(evt, domNode, dest) {
    dest = dest || domNode.ownerDocument.body
    let target = evt.target

    // 该节点就是目标节点
    if (domNode === dest) return true

    while (target && target !== dest) {
        if (target === domNode) return true
        target = target.parentNode
    }

    return false
}

/**
 * 查找最近的符合条件的祖先节点
 */
function findParentNode(domNode, tagName) {
    const checkParentNode = (parentNode, tagName) => {
        if (!parentNode) return false
        if (parentNode.tagName === tagName) return true
        if (parentNode.tagName === 'WX-COMPONENT' && parentNode.behavior === tagName.toLowerCase()) return true

        return false
    }
    let parentNode = domNode.parentNode

    if (checkParentNode(parentNode, tagName)) return parentNode
    while (parentNode && parentNode.tagName !== tagName) {
        parentNode = parentNode.parentNode
        if (checkParentNode(parentNode, tagName)) return parentNode
    }

    return null
}

/**
 * 判断基础库版本
 */
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i], 10)
        const num2 = parseInt(v2[i], 10)

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

module.exports = {
    NOT_SUPPORT,
    USE_TEMPLATE,
    IN_COVER,
    filterNodes,
    checkDiffChildNodes,
    checkComponentAttr,
    dealWithLeafAndSimple,
    checkEventAccessDomNode,
    findParentNode,
    compareVersion,
}

}, function(modId) { var map = {"./init-data":1589353393369,"./component":1589353393370}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393369, function(require, module, exports) {
const component = require('./component')

module.exports = component.properties

}, function(modId) { var map = {"./component":1589353393370}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393370, function(require, module, exports) {
const wxComponentMap = {
    // 视图容器
    'cover-image': {
        wxCompName: 'cover-image',
        config: require('../component/cover-image'),
    },
    'cover-view': {
        wxCompName: 'cover-view',
        config: require('../component/cover-view'),
    },
    'movable-area': {
        wxCompName: 'movable-area',
        config: require('../component/movable-area'),
    },
    'scroll-view': {
        wxCompName: 'scroll-view',
        config: require('../component/scroll-view'),
    },
    swiper: {
        wxCompName: 'swiper',
        config: require('../component/swiper'),
    },
    view: {
        wxCompName: 'view',
        config: require('../component/view'),
    },
    // 基础内容
    icon: {
        wxCompName: 'icon',
        config: require('../component/icon'),
    },
    progress: {
        wxCompName: 'progress',
        config: require('../component/progress'),
    },
    'rich-text': {
        wxCompName: 'rich-text',
        config: require('../component/rich-text'),
    },
    text: {
        wxCompName: 'text',
        config: require('../component/text'),
    },
    // 表单组件
    button: {
        wxCompName: 'button',
        config: require('../component/button'),
    },
    editor: {
        wxCompName: 'editor',
        config: require('../component/editor'),
    },
    form: {
        wxCompName: 'form',
        config: require('../component/form'),
    },
    INPUT: {
        wxCompName: 'input',
        config: require('../component/input'),
    },
    picker: {
        wxCompName: 'picker',
        config: require('../component/picker'),
    },
    'picker-view': {
        wxCompName: 'picker-view',
        config: require('../component/picker-view'),
    },
    slider: {
        wxCompName: 'slider',
        config: require('../component/slider'),
    },
    switch: {
        wxCompName: 'switch',
        config: require('../component/switch'),
    },
    TEXTAREA: {
        wxCompName: 'textarea',
        config: require('../component/textarea'),
    },
    // 导航
    navigator: {
        wxCompName: 'navigator',
        config: require('../component/navigator'),
    },
    // 媒体组件
    camera: {
        wxCompName: 'camera',
        config: require('../component/camera'),
    },
    image: {
        wxCompName: 'image',
        config: require('../component/image'),
    },
    'live-player': {
        wxCompName: 'live-player',
        config: require('../component/live-player'),
    },
    'live-pusher': {
        wxCompName: 'live-pusher',
        config: require('../component/live-pusher'),
    },
    VIDEO: {
        wxCompName: 'video',
        config: require('../component/video'),
    },
    // 地图
    map: {
        wxCompName: 'map',
        config: require('../component/map'),
    },
    // 画布
    CANVAS: {
        wxCompName: 'canvas',
        config: require('../component/canvas'),
    },
    // 开放能力
    ad: {
        wxCompName: 'ad',
        config: require('../component/ad'),
    },
    'official-account': {
        wxCompName: 'official-account',
        config: require('../component/official-account'),
    },
    'open-data': {
        wxCompName: 'open-data',
        config: require('../component/open-data'),
    },
    'web-view': {
        wxCompName: 'web-view',
        config: require('../component/web-view'),
    },
    // 特殊补充
    capture: {
        wxCompName: 'capture',
        config: {},
    },
    catch: {
        wxCompName: 'catch',
        config: {},
    },
    animation: {
        wxCompName: 'animation',
        config: {},
    },
}

const wxSubComponentMap = {
    'movable-view': require('../component/movable-view'),
    'swiper-item': require('../component/swiper-item'),
    'picker-view-column': require('../component/picker-view-column'),
}

const wxComponentKeys = Object.keys(wxComponentMap)
const wxCompNameMap = {}
const properties = {}
const handles = {}
wxComponentKeys.forEach(key => {
    const {wxCompName, config} = wxComponentMap[key]

    wxCompNameMap[key] = wxCompName
    properties[wxCompName] = config.properties || []
    Object.assign(handles, config.handles || {})
})
Object.keys(wxSubComponentMap).forEach(key => {
    const config = wxSubComponentMap[key]
    Object.assign(handles, config.handles || {})
})

module.exports = {
    wxCompNameMap,
    properties,
    handles,
    wxSubComponentMap,
}

}, function(modId) { var map = {"../component/cover-image":1589353393371,"../component/cover-view":1589353393372,"../component/movable-area":1589353393373,"../component/scroll-view":1589353393374,"../component/swiper":1589353393375,"../component/view":1589353393376,"../component/icon":1589353393377,"../component/progress":1589353393378,"../component/rich-text":1589353393379,"../component/text":1589353393380,"../component/button":1589353393381,"../component/editor":1589353393382,"../component/form":1589353393383,"../component/input":1589353393384,"../component/picker":1589353393385,"../component/picker-view":1589353393386,"../component/slider":1589353393387,"../component/switch":1589353393388,"../component/textarea":1589353393389,"../component/navigator":1589353393390,"../component/camera":1589353393391,"../component/image":1589353393392,"../component/live-player":1589353393393,"../component/live-pusher":1589353393394,"../component/video":1589353393395,"../component/map":1589353393396,"../component/canvas":1589353393397,"../component/ad":1589353393398,"../component/official-account":1589353393399,"../component/open-data":1589353393400,"../component/web-view":1589353393401,"../component/movable-view":1589353393402,"../component/swiper-item":1589353393403,"../component/picker-view-column":1589353393404}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393371, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html
 */
module.exports = {
    properties: [{
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }],
    handles: {
        onCoverImageLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onCoverImageError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393372, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html
 */
module.exports = {
    properties: [{
        name: 'scrollTop',
        get(domNode) {
            const value = domNode.getAttribute('scroll-top')
            return value !== undefined && !isNaN(+value) ? +value : ''
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393373, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html
 */
module.exports = {
    properties: [{
        name: 'scaleArea',
        get(domNode) {
            return !!domNode.getAttribute('scale-area')
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393374, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
 */
module.exports = {
    properties: [{
        name: 'scrollX',
        get(domNode) {
            return !!domNode.getAttribute('scroll-x')
        },
    }, {
        name: 'scrollY',
        get(domNode) {
            return !!domNode.getAttribute('scroll-y')
        },
    }, {
        name: 'upperThreshold',
        get(domNode) {
            return domNode.getAttribute('upper-threshold') || '50'
        },
    }, {
        name: 'lowerThreshold',
        get(domNode) {
            return domNode.getAttribute('lower-threshold') || '50'
        },
    }, {
        name: 'scrollTop',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-top') || ''
        },
    }, {
        name: 'scrollLeft',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-left') || ''
        },
    }, {
        name: 'scrollIntoView',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.getAttribute('scroll-into-view') || ''
        },
    }, {
        name: 'scrollWithAnimation',
        get(domNode) {
            return !!domNode.getAttribute('scroll-with-animation')
        },
    }, {
        name: 'enableBackToTop',
        get(domNode) {
            return !!domNode.getAttribute('enable-back-to-top')
        },
    }, {
        name: 'enableFlex',
        get(domNode) {
            return !!domNode.getAttribute('enable-flex')
        },
    }, {
        name: 'scrollAnchoring',
        get(domNode) {
            return !!domNode.getAttribute('scroll-anchoring')
        },
    }, {
        name: 'refresherEnabled',
        get(domNode) {
            return !!domNode.getAttribute('refresher-enabled')
        },
    }, {
        name: 'refresherThreshold',
        get(domNode) {
            return domNode.getAttribute('refresher-threshold') || '45'
        },
    }, {
        name: 'refresherDefaultStyle',
        get(domNode) {
            return domNode.getAttribute('refresher-default-style') || 'black'
        },
    }, {
        name: 'refresherBackground',
        get(domNode) {
            return domNode.getAttribute('refresher-background') || '#FFF'
        },
    }, {
        name: 'refresherTriggered',
        get(domNode) {
            return !!domNode.getAttribute('refresher-triggered')
        },
    }],
    handles: {
        onScrollViewScrolltoupper(evt) {
            this.callSingleEvent('scrolltoupper', evt)
        },

        onScrollViewScrolltolower(evt) {
            this.callSingleEvent('scrolltolower', evt)
        },

        onScrollViewScroll(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('scroll-into-view', '')
            domNode.$$setAttributeWithoutUpdate('scroll-top', evt.detail.scrollTop)
            domNode.$$setAttributeWithoutUpdate('scroll-left', evt.detail.scrollLeft)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.scrollIntoView = ''
            domNode._oldValues.scrollTop = evt.detail.scrollTop
            domNode._oldValues.scrollLeft = evt.detail.scrollLeft

            this.callSimpleEvent('scroll', evt)
        },

        onScrollViewRefresherPulling(evt) {
            this.callSingleEvent('refresherpulling', evt)
        },

        onScrollViewRefresherRefresh(evt) {
            this.callSingleEvent('refresherrefresh', evt)
        },

        onScrollViewRefresherRestore(evt) {
            this.callSingleEvent('refresherrestore', evt)
        },

        onScrollViewRefresherAbort(evt) {
            this.callSingleEvent('refresherabort', evt)
        },

    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393375, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html
 */
module.exports = {
    properties: [{
        name: 'indicatorDots',
        get(domNode) {
            return !!domNode.getAttribute('indicator-dots')
        },
    }, {
        name: 'indicatorColor',
        get(domNode) {
            return domNode.getAttribute('indicator-color') || 'rgba(0, 0, 0, .3)'
        },
    }, {
        name: 'indicatorActiveColor',
        get(domNode) {
            return domNode.getAttribute('indicator-active-color') || '#000000'
        },
    }, {
        name: 'autoplay',
        get(domNode) {
            return !!domNode.getAttribute('autoplay')
        },
    }, {
        name: 'current',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('current') || 0
        },
    }, {
        name: 'interval',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('interval'))
            return !isNaN(value) ? value : 5000
        },
    }, {
        name: 'duration',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('duration'))
            return !isNaN(value) ? value : 500
        },
    }, {
        name: 'circular',
        get(domNode) {
            return !!domNode.getAttribute('circular')
        },
    }, {
        name: 'vertical',
        get(domNode) {
            return !!domNode.getAttribute('vertical')
        },
    }, {
        name: 'previousMargin',
        get(domNode) {
            return domNode.getAttribute('previous-margin') || '0px'
        },
    }, {
        name: 'nextMargin',
        get(domNode) {
            return domNode.getAttribute('next-margin') || '0px'
        },
    }, {
        name: 'displayMultipleItems',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('display-multiple-items'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'skipHiddenItemLayout',
        get(domNode) {
            return !!domNode.getAttribute('skip-hidden-item-layout')
        },
    }, {
        name: 'easingFunction',
        get(domNode) {
            return domNode.getAttribute('easing-function') || 'default'
        },
    }],
    handles: {
        onSwiperChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('current', evt.detail.current)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.current = evt.detail.current

            this.callSingleEvent('change', evt)
        },

        onSwiperTransition(evt) {
            this.callSingleEvent('transition', evt)
        },

        onSwiperAnimationfinish(evt) {
            this.callSingleEvent('animationfinish', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393376, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/view.html
 */
module.exports = {
    properties: [{
        name: 'hoverClass',
        get(domNode) {
            return domNode.getAttribute('hover-class') || 'none'
        },
    }, {
        name: 'hoverStopPropagation',
        get(domNode) {
            return !!domNode.getAttribute('hover-stop-propagation')
        },
    }, {
        name: 'hoverStartTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-start-time'))
            return !isNaN(value) ? value : 50
        },
    }, {
        name: 'hoverStayTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-stay-time'))
            return !isNaN(value) ? value : 400
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393377, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/icon.html
 */
module.exports = {
    properties: [{
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || ''
        },
    }, {
        name: 'size',
        get(domNode) {
            return domNode.getAttribute('size') || '23'
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || ''
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393378, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/progress.html
 */
module.exports = {
    properties: [{
        name: 'percent',
        get(domNode) {
            return +domNode.getAttribute('percent') || 0
        },
    }, {
        name: 'showInfo',
        get(domNode) {
            return !!domNode.getAttribute('show-info')
        },
    }, {
        name: 'borderRadius',
        get(domNode) {
            return domNode.getAttribute('border-radius') || '0'
        },
    }, {
        name: 'fontSize',
        get(domNode) {
            return domNode.getAttribute('font-size') || '16'
        },
    }, {
        name: 'strokeWidth',
        get(domNode) {
            return domNode.getAttribute('stroke-width') || '6'
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || '#09BB07'
        },
    }, {
        name: 'activeColor',
        get(domNode) {
            return domNode.getAttribute('active-color') || '#09BB07'
        },
    }, {
        name: 'backgroundColor',
        get(domNode) {
            return domNode.getAttribute('background-color') || '#EBEBEB'
        },
    }, {
        name: 'active',
        get(domNode) {
            return !!domNode.getAttribute('active')
        },
    }, {
        name: 'activeMode',
        get(domNode) {
            return domNode.getAttribute('active-mode') || 'backwards'
        },
    }],
    handles: {
        onProgressActiveEnd(evt) {
            this.callSingleEvent('activeend', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393379, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
 */
module.exports = {
    properties: [{
        name: 'nodes',
        get(domNode) {
            return domNode.getAttribute('nodes') || []
        },
    }, {
        name: 'space',
        get(domNode) {
            return domNode.getAttribute('space') || ''
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393380, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/text.html
 */
module.exports = {
    properties: [{
        name: 'selectable',
        get(domNode) {
            return !!domNode.getAttribute('selectable')
        },
    }, {
        name: 'space',
        get(domNode) {
            return domNode.getAttribute('space') || ''
        },
    }, {
        name: 'decode',
        get(domNode) {
            return !!domNode.getAttribute('decode')
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393381, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/button.html
 */
module.exports = {
    properties: [{
        name: 'size',
        get(domNode) {
            return domNode.getAttribute('size') || 'default'
        },
    }, {
        name: 'type',
        get(domNode) {
            // 如果使用默认值 default，基础库中会补充 wx-button[type=default]，导致部分样式优先级处理有问题
            return domNode.getAttribute('type') || undefined
        },
    }, {
        name: 'plain',
        get(domNode) {
            return !!domNode.getAttribute('plain')
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'loading',
        get(domNode) {
            return !!domNode.getAttribute('loading')
        },
    }, {
        name: 'formType',
        get(domNode) {
            return domNode.getAttribute('form-type') || ''
        },
    }, {
        name: 'openType',
        get(domNode) {
            return domNode.getAttribute('open-type') || ''
        },
    }, {
        name: 'hoverClass',
        get(domNode) {
            return domNode.getAttribute('hover-class') || 'button-hover'
        },
    }, {
        name: 'hoverStopPropagation',
        get(domNode) {
            return !!domNode.getAttribute('hover-stop-propagation')
        },
    }, {
        name: 'hoverStartTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-start-time'))
            return !isNaN(value) ? value : 20
        },
    }, {
        name: 'hoverStayTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-stay-time'))
            return !isNaN(value) ? value : 70
        },
    }, {
        name: 'lang',
        get(domNode) {
            return domNode.getAttribute('lang') || 'en'
        },
    }, {
        name: 'sessionFrom',
        get(domNode) {
            return domNode.getAttribute('session-from') || ''
        },
    }, {
        name: 'sendMessageTitle',
        get(domNode) {
            return domNode.getAttribute('send-message-title') || ''
        },
    }, {
        name: 'sendMessagePath',
        get(domNode) {
            return domNode.getAttribute('send-message-path') || ''
        },
    }, {
        name: 'sendMessageImg',
        get(domNode) {
            return domNode.getAttribute('send-message-img') || ''
        },
    }, {
        name: 'appParameter',
        get(domNode) {
            return domNode.getAttribute('app-parameter') || ''
        },
    }, {
        name: 'showMessageCard',
        get(domNode) {
            return !!domNode.getAttribute('show-message-card')
        },
    }, {
        name: 'businessId',
        get(domNode) {
            return domNode.getAttribute('business-id') || ''
        },
    }],
    handles: {
        onButtonGetUserInfo(evt) {
            this.callSingleEvent('getuserinfo', evt)
        },

        onButtonContact(evt) {
            this.callSingleEvent('contact', evt)
        },

        onButtonGetPhoneNumber(evt) {
            this.callSingleEvent('getphonenumber', evt)
        },

        onButtonError(evt) {
            this.callSingleEvent('error', evt)
        },

        onButtonOpenSetting(evt) {
            this.callSingleEvent('opensetting', evt)
        },

        onButtonLaunchApp(evt) {
            this.callSingleEvent('launchapp', evt)
        },

    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393382, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/editor.html
 */
module.exports = {
    properties: [{
        name: 'readOnly',
        get(domNode) {
            return !!domNode.getAttribute('read-only')
        },
    }, {
        name: 'placeholder',
        get(domNode) {
            return domNode.getAttribute('placeholder') || ''
        },
    }, {
        name: 'showImgSize',
        get(domNode) {
            return !!domNode.getAttribute('show-img-size')
        },
    }, {
        name: 'showImgToolbar',
        get(domNode) {
            return !!domNode.getAttribute('show-img-toolbar')
        },
    }, {
        name: 'showImgResize',
        get(domNode) {
            return !!domNode.getAttribute('show-img-resize')
        },
    }],
    handles: {
        onEditorReady(evt) {
            this.callSingleEvent('ready', evt)
        },

        onEditorFocus(evt) {
            this.callSingleEvent('focus', evt)
        },

        onEditorBlur(evt) {
            this.callSingleEvent('blur', evt)
        },

        onEditorInput(evt) {
            this.callSingleEvent('input', evt)
        },

        onEditorStatusChange(evt) {
            this.callSingleEvent('statuschange', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393383, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/form.html
 *
 * 可以认为下述 form 组件的属性和事件是没有用的，因为 button 组件会被封装到自定义组件内
 */
module.exports = {
    properties: [{
        name: 'reportSubmit',
        get(domNode) {
            return !!domNode.getAttribute('report-submit')
        },
    }, {
        name: 'reportSubmitTimeout',
        get(domNode) {
            return +domNode.getAttribute('report-submit-timeout') || 0
        },
    }],
    handles: {
        onFormSubmit(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode._formId = evt.detail.formId
            // submit 事件由 kbone 模拟，不需要原生 submit 事件
        },

        onFormReset() {
            // reset 事件由 kbone 模拟，不需要原生 reset 事件
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393384, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/input.html
 */
module.exports = {
    properties: [{
        name: 'value',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.value || ''
        },
    }, {
        name: 'type',
        get(domNode) {
            const value = domNode.type || 'text'
            return value !== 'password' ? value : 'text'
        },
    }, {
        name: 'password',
        get(domNode) {
            return domNode.type !== 'password' ? !!domNode.getAttribute('password') : true
        },
    }, {
        name: 'placeholder',
        get(domNode) {
            return domNode.placeholder
        },
    }, {
        name: 'placeholderStyle',
        get(domNode) {
            return domNode.getAttribute('placeholder-style') || ''
        },
    }, {
        name: 'placeholderClass',
        get(domNode) {
            return domNode.getAttribute('placeholder-class') || 'input-placeholder'
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return domNode.disabled
        },
    }, {
        name: 'maxlength',
        get(domNode) {
            const value = parseFloat(domNode.maxlength)
            return !isNaN(value) ? value : 140
        },
    }, {
        name: 'cursorSpacing',
        get(domNode) {
            return +domNode.getAttribute('cursor-spacing') || 0
        },
    }, {
        name: 'autoFocus',
        get(domNode) {
            return !!domNode.getAttribute('autofocus')
        },
    }, {
        name: 'focus',
        canBeUserChanged: true,
        get(domNode) {
            return !!domNode.getAttribute('focus')
        },
    }, {
        name: 'confirmType',
        get(domNode) {
            return domNode.getAttribute('confirm-type') || 'done'
        },
    }, {
        name: 'confirmHold',
        get(domNode) {
            return !!domNode.getAttribute('confirm-hold')
        },
    }, {
        name: 'cursor',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('cursor'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionStart',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-start'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionEnd',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-end'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'adjustPosition',
        get(domNode) {
            const value = domNode.getAttribute('adjust-position')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'checked',
        canBeUserChanged: true,
        get(domNode) {
            return !!domNode.getAttribute('checked')
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || '#09BB07'
        },
    }],
    handles: {
        onInputInput(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            const value = '' + evt.detail.value
            domNode.$$setAttributeWithoutUpdate('value', value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.value = value

            this.callEvent('input', evt)
        },

        onInputFocus(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode._inputOldValue = domNode.value
            domNode.$$setAttributeWithoutUpdate('focus', true)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.focus = true

            this.callSimpleEvent('focus', evt)
        },

        onInputBlur(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('focus', false)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.focus = false

            if (domNode._inputOldValue !== undefined && domNode.value !== domNode._inputOldValue) {
                domNode._inputOldValue = undefined
                this.callEvent('change', evt)
            }
            this.callSimpleEvent('blur', evt)
        },

        onInputConfirm(evt) {
            this.callSimpleEvent('confirm', evt)
        },

        onInputKeyBoardHeightChange(evt) {
            this.callSingleEvent('keyboardheightchange', evt)
        },

        onRadioChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            const window = cache.getWindow(this.pageId)
            const value = evt.detail.value
            const name = domNode.name

            if (value === domNode.value) {
                domNode.$$setAttributeWithoutUpdate('checked', true)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.checked = true

                const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || []
                for (const otherDomNode of otherDomNodes) {
                    if (otherDomNode.type === 'radio' && otherDomNode !== domNode) {
                        otherDomNode.$$setAttributeWithoutUpdate('checked', false)

                        // 可被用户行为改变的值，需要记录
                        otherDomNode._oldValues = otherDomNode._oldValues || {}
                        otherDomNode._oldValues.checked = false
                    }
                }
            }
            this.callEvent('input', evt)
            this.callEvent('change', evt)
        },

        onCheckboxChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            const value = evt.detail.value || []
            if (value.indexOf(domNode.value) >= 0) {
                domNode.$$setAttributeWithoutUpdate('checked', true)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.checked = true
            } else {
                domNode.$$setAttributeWithoutUpdate('checked', false)

                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                domNode._oldValues.checked = false
            }
            this.callEvent('input', evt)
            this.callEvent('change', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393385, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
 */
module.exports = {
    properties: [{
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'selector'
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'range',
        get(domNode) {
            let value = domNode.getAttribute('range')
            if (typeof value === 'string') {
                // react 会直接将属性值转成字符串
                try {
                    value = JSON.parse(value)
                } catch (err) {
                    value = value.split(',')
                }
            }
            return value !== undefined ? value : []
        },
    }, {
        name: 'rangeKey',
        get(domNode) {
            return domNode.getAttribute('range-key') || ''
        },
    }, {
        name: 'value',
        canBeUserChanged: true,
        get(domNode) {
            const mode = domNode.getAttribute('mode') || 'selector'
            let value = domNode.getAttribute('value')
            if (mode === 'selector') {
                return +value || 0
            } else if (mode === 'multiSelector') {
                if (typeof value === 'string') value = value.split(',').map(item => parseInt(item, 10)) // react 会直接将属性值转成字符串
                return value || []
            } else if (mode === 'time') {
                return value || ''
            } else if (mode === 'date') {
                return value || '0'
            } else if (mode === 'region') {
                if (typeof value === 'string') value = value.split(',') // react 会直接将属性值转成字符串
                return value || []
            }

            return value
        },
    }, {
        name: 'start',
        get(domNode) {
            return domNode.getAttribute('start') || ''
        },
    }, {
        name: 'end',
        get(domNode) {
            return domNode.getAttribute('end') || ''
        },
    }, {
        name: 'fields',
        get(domNode) {
            return domNode.getAttribute('fields') || 'day'
        },
    }, {
        name: 'customItem',
        get(domNode) {
            return domNode.getAttribute('custom-item') || ''
        }
    }],
    handles: {
        onPickerChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.value = evt.detail.value

            this.callSingleEvent('change', evt)
        },

        onPickerColumnChange(evt) {
            this.callSingleEvent('columnchange', evt)
        },

        onPickerCancel(evt) {
            this.callSingleEvent('cancel', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393386, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html
 */
module.exports = {
    properties: [{
        name: 'value',
        canBeUserChanged: true,
        get(domNode) {
            let value = domNode.getAttribute('value')
            if (typeof value === 'string') value = value.split(',').map(item => parseInt(item, 10)) // react 会直接将属性值转成字符串
            return value !== undefined ? value : []
        },
    }, {
        name: 'indicatorStyle',
        get(domNode) {
            return domNode.getAttribute('indicator-style') || ''
        },
    }, {
        name: 'indicatorClass',
        get(domNode) {
            return domNode.getAttribute('indicator-class') || ''
        },
    }, {
        name: 'maskStyle',
        get(domNode) {
            return domNode.getAttribute('mask-style') || ''
        },
    }, {
        name: 'maskClass',
        get(domNode) {
            return domNode.getAttribute('mask-class') || ''
        },
    }],
    handles: {
        onPickerViewChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.value = evt.detail.value

            this.callSingleEvent('change', evt)
        },

        onPickerViewPickstart(evt) {
            this.callSingleEvent('pickstart', evt)
        },

        onPickerViewPickend(evt) {
            this.callSingleEvent('pickend', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393387, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/slider.html
 */
module.exports = {
    properties: [{
        name: 'min',
        get(domNode) {
            return +domNode.getAttribute('min') || 0
        },
    }, {
        name: 'max',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('max'))
            return !isNaN(value) ? value : 100
        },
    }, {
        name: 'step',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('step'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'value',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('value') || 0
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || '#e9e9e9'
        },
    }, {
        name: 'selectedColor',
        get(domNode) {
            return domNode.getAttribute('selected-color') || '#1aad19'
        },
    }, {
        name: 'activeColor',
        get(domNode) {
            return domNode.getAttribute('active-color') || '#1aad19'
        },
    }, {
        name: 'backgroundColor',
        get(domNode) {
            return domNode.getAttribute('background-color') || '#e9e9e9'
        },
    }, {
        name: 'blockSize',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('block-size'))
            return !isNaN(value) ? value : 28
        },
    }, {
        name: 'blockColor',
        get(domNode) {
            return domNode.getAttribute('block-color') || '#ffffff'
        },
    }, {
        name: 'showValue',
        get(domNode) {
            return !!domNode.getAttribute('show-value')
        },
    }],
    handles: {
        onSliderChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('value', evt.detail.value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.value = evt.detail.value

            this.callSingleEvent('change', evt)
        },

        onSliderChanging(evt) {
            this.callSingleEvent('changing', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393388, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/switch.html
 */
module.exports = {
    properties: [{
        name: 'checked',
        canBeUserChanged: true,
        get(domNode) {
            return !!domNode.getAttribute('checked')
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || 'switch'
        },
    }, {
        name: 'color',
        get(domNode) {
            return domNode.getAttribute('color') || '#04BE02'
        },
    }],
    handles: {
        onSwitchChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('checked', evt.detail.value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.checked = evt.detail.value

            this.callSingleEvent('change', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393389, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html
 */
module.exports = {
    properties: [{
        name: 'value',
        canBeUserChanged: true,
        get(domNode) {
            return domNode.value || ''
        },
    }, {
        name: 'placeholder',
        get(domNode) {
            return domNode.placeholder
        },
    }, {
        name: 'placeholderStyle',
        get(domNode) {
            return domNode.getAttribute('placeholder-style') || ''
        },
    }, {
        name: 'placeholderClass',
        get(domNode) {
            return domNode.getAttribute('placeholder-class') || 'input-placeholder'
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return domNode.disabled
        },
    }, {
        name: 'maxlength',
        get(domNode) {
            const value = parseFloat(domNode.maxlength)
            return !isNaN(value) ? value : 140
        }
    }, {
        name: 'autoFocus',
        get(domNode) {
            return !!domNode.getAttribute('autofocus')
        },
    }, {
        name: 'focus',
        get(domNode) {
            return !!domNode.getAttribute('focus')
        },
    }, {
        name: 'autoHeight',
        get(domNode) {
            return !!domNode.getAttribute('auto-height')
        },
    }, {
        name: 'fixed',
        get(domNode) {
            return !!domNode.getAttribute('fixed')
        },
    }, {
        name: 'cursorSpacing',
        get(domNode) {
            return +domNode.getAttribute('cursor-spacing') || 0
        },
    }, {
        name: 'cursor',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('cursor'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'showConfirmBar',
        get(domNode) {
            const value = domNode.getAttribute('show-confirm-bar')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'selectionStart',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-start'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'selectionEnd',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('selection-end'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'adjustPosition',
        get(domNode) {
            const value = domNode.getAttribute('adjust-position')
            return value !== undefined ? !!value : true
        },
    }],
    handles: {
        onTextareaFocus(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode._textareaOldValue = domNode.value
            domNode.$$setAttributeWithoutUpdate('focus', true)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.focus = true

            this.callSimpleEvent('focus', evt)
        },

        onTextareaBlur(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('focus', false)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.focus = false

            if (domNode._textareaOldValue !== undefined && domNode.value !== domNode._textareaOldValue) {
                domNode._textareaOldValue = undefined
                this.callEvent('change', evt)
            }
            this.callSimpleEvent('blur', evt)
        },

        onTextareaLineChange(evt) {
            this.callSingleEvent('linechange', evt)
        },

        onTextareaInput(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            const value = '' + evt.detail.value
            domNode.$$setAttributeWithoutUpdate('value', value)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.value = value

            this.callEvent('input', evt)
        },

        onTextareaConfirm(evt) {
            this.callSimpleEvent('confirm', evt)
        },

        onTextareaKeyBoardHeightChange(evt) {
            this.callSingleEvent('keyboardheightchange', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393390, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html
 */
module.exports = {
    properties: [{
        name: 'target',
        get(domNode) {
            return domNode.getAttribute('target') || 'self'
        },
    }, {
        name: 'url',
        get(domNode) {
            return domNode.getAttribute('url') || ''
        },
    }, {
        name: 'openType',
        get(domNode) {
            return domNode.getAttribute('open-type') || 'navigate'
        },
    }, {
        name: 'delta',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('delta'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'appId',
        get(domNode) {
            return domNode.getAttribute('app-id') || ''
        },
    }, {
        name: 'path',
        get(domNode) {
            return domNode.getAttribute('path') || ''
        },
    }, {
        name: 'extraData',
        get(domNode) {
            return domNode.getAttribute('extra-data') || {}
        },
    }, {
        name: 'version',
        get(domNode) {
            return domNode.getAttribute('version') || 'release'
        },
    }, {
        name: 'hoverClass',
        get(domNode) {
            return domNode.getAttribute('hover-class') || 'navigator-hover'
        },
    }, {
        name: 'hoverStopPropagation',
        get(domNode) {
            return !!domNode.getAttribute('hover-stop-propagation')
        },
    }, {
        name: 'hoverStartTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-start-time'))
            return !isNaN(value) ? value : 50
        },
    }, {
        name: 'hoverStayTime',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('hover-stay-time'))
            return !isNaN(value) ? value : 600
        },
    }],
    handles: {
        onNavigatorSuccess(evt) {
            this.callSingleEvent('success', evt)
        },

        onNavigatorFail(evt) {
            this.callSingleEvent('fail', evt)
        },

        onNavigatorComplete(evt) {
            this.callSingleEvent('complete', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393391, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/camera.html
 */
module.exports = {
    properties: [{
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'normal'
        },
    }, {
        name: 'devicePosition',
        get(domNode) {
            return domNode.getAttribute('device-position') || 'back'
        },
    }, {
        name: 'flash',
        get(domNode) {
            return domNode.getAttribute('flash') || 'auto'
        },
    }, {
        name: 'frameSize',
        get(domNode) {
            return domNode.getAttribute('frame-size') || 'medium'
        },
    }],
    handles: {
        onCameraStop(evt) {
            this.callSingleEvent('stop', evt)
        },

        onCameraError(evt) {
            this.callSingleEvent('error', evt)
        },

        onCameraInitDone(evt) {
            this.callSingleEvent('initdone', evt)
        },

        onCameraScanCode(evt) {
            this.callSingleEvent('scancode', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393392, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/image.html
 */
module.exports = {
    properties: [{
        name: 'renderingMode',
        get(domNode) {
            return domNode.getAttribute('rendering-mode') || ''
        },
    }, {
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }, {
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'scaleToFill'
        },
    }, {
        name: 'lazyLoad',
        get(domNode) {
            return !!domNode.getAttribute('lazy-load')
        },
    }, {
        name: 'showMenuByLongpress',
        get(domNode) {
            return !!domNode.getAttribute('show-menu-by-longpress')
        },
    }],
    handles: {
        onImageLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onImageError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393393, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html
 */
module.exports = {
    properties: [{
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }, {
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'live'
        },
    }, {
        name: 'autoplay',
        get(domNode) {
            return !!domNode.getAttribute('autoplay')
        },
    }, {
        name: 'muted',
        get(domNode) {
            return !!domNode.getAttribute('muted')
        },
    }, {
        name: 'orientation',
        get(domNode) {
            return domNode.getAttribute('orientation') || 'vertical'
        },
    }, {
        name: 'objectFit',
        get(domNode) {
            return domNode.getAttribute('object-fit') || 'contain'
        },
    }, {
        name: 'backgroundMute',
        get(domNode) {
            return !!domNode.getAttribute('background-mute')
        },
    }, {
        name: 'minCache',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('min-cache'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'maxCache',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('max-cache'))
            return !isNaN(value) ? value : 3
        },
    }, {
        name: 'soundMode',
        get(domNode) {
            return domNode.getAttribute('sound-mode') || 'speaker'
        },
    }, {
        name: 'autoPauseIfNavigate',
        get(domNode) {
            const value = domNode.getAttribute('auto-pause-if-navigate')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'autoPauseIfOpenNative',
        get(domNode) {
            const value = domNode.getAttribute('auto-pause-if-open-native')
            return value !== undefined ? !!value : true
        },
    }],
    handles: {
        onLivePlayerStateChange(evt) {
            this.callSingleEvent('statechange', evt)
        },

        onLivePlayerFullScreenChange(evt) {
            this.callSingleEvent('fullscreenchange', evt)
        },

        onLivePlayerNetStatus(evt) {
            this.callSingleEvent('netstatus', evt)
        },

    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393394, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html
 */
module.exports = {
    properties: [{
        name: 'url',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            const url = domNode.getAttribute('url')
            return url ? tool.completeURL(url, window.location.origin, true) : ''
        },
    }, {
        name: 'mode',
        get(domNode) {
            return domNode.getAttribute('mode') || 'RTC'
        },
    }, {
        name: 'autopush',
        get(domNode) {
            return !!domNode.getAttribute('autopush')
        },
    }, {
        name: 'muted',
        get(domNode) {
            return !!domNode.getAttribute('muted')
        },
    }, {
        name: 'enableCamera',
        get(domNode) {
            const value = domNode.getAttribute('enable-camera')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'autoFocus',
        get(domNode) {
            const value = domNode.getAttribute('auto-focus')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'orientation',
        get(domNode) {
            return domNode.getAttribute('orientation') || 'vertical'
        },
    }, {
        name: 'beauty',
        get(domNode) {
            return +domNode.getAttribute('beauty') || 0
        },
    }, {
        name: 'whiteness',
        get(domNode) {
            return +domNode.getAttribute('whiteness') || 0
        },
    }, {
        name: 'aspect',
        get(domNode) {
            return domNode.getAttribute('aspect') || '9:16'
        },
    }, {
        name: 'minBitrate',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('min-bitrate'))
            return !isNaN(value) ? value : 200
        },
    }, {
        name: 'maxBitrate',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('max-bitrate'))
            return !isNaN(value) ? value : 1000
        },
    }, {
        name: 'waitingImage',
        get(domNode) {
            return domNode.getAttribute('waiting-image') || ''
        },
    }, {
        name: 'waitingImageHash',
        get(domNode) {
            return domNode.getAttribute('waiting-image-hash') || ''
        },
    }, {
        name: 'zoom',
        get(domNode) {
            return !!domNode.getAttribute('zoom')
        },
    }, {
        name: 'devicePosition',
        get(domNode) {
            return domNode.getAttribute('device-position') || 'front'
        },
    }, {
        name: 'backgroundMute',
        get(domNode) {
            return !!domNode.getAttribute('background-mute')
        },
    }, {
        name: 'mirror',
        get(domNode) {
            return !!domNode.getAttribute('mirror')
        },
    }],
    handles: {
        onLivePusherStateChange(evt) {
            this.callSingleEvent('statechange', evt)
        },

        onLivePusherNetStatus(evt) {
            this.callSingleEvent('netstatus', evt)
        },

        onLivePusherError(evt) {
            this.callSingleEvent('error', evt)
        },

        onLivePusherBgmStart(evt) {
            this.callSingleEvent('bgmstart', evt)
        },

        onLivePusherBgmProgress(evt) {
            this.callSingleEvent('bgmprogress', evt)
        },

        onLivePusherBgmComplete(evt) {
            this.callSingleEvent('bgmcomplete', evt)
        },

    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393395, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/video.html
 */
module.exports = {
    properties: [{
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }, {
        name: 'duration',
        get(domNode) {
            return +domNode.getAttribute('duration') || 0
        },
    }, {
        name: 'controls',
        get(domNode) {
            return domNode.controls
        },
    }, {
        name: 'danmuList',
        get(domNode) {
            const value = domNode.getAttribute('danmu-list')
            return value !== undefined ? value : []
        },
    }, {
        name: 'danmuBtn',
        get(domNode) {
            return !!domNode.getAttribute('danmu-btn')
        },
    }, {
        name: 'enableDanmu',
        get(domNode) {
            return !!domNode.getAttribute('enable-danmu')
        },
    }, {
        name: 'autoplay',
        get(domNode) {
            return domNode.autoplay
        },
    }, {
        name: 'loop',
        get(domNode) {
            return domNode.loop
        },
    }, {
        name: 'muted',
        get(domNode) {
            return domNode.muted
        },
    }, {
        name: 'initialTime',
        get(domNode) {
            return +domNode.getAttribute('initial-time') || 0
        },
    }, {
        name: 'direction',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('direction'))
            return !isNaN(value) ? value : -1
        },
    }, {
        name: 'showProgress',
        get(domNode) {
            const value = domNode.getAttribute('show-progress')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'showFullscreenBtn',
        get(domNode) {
            const value = domNode.getAttribute('show-fullscreen-btn')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'showPlayBtn',
        get(domNode) {
            const value = domNode.getAttribute('show-play-btn')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'showCenterPlayBtn',
        get(domNode) {
            const value = domNode.getAttribute('show-center-play-btn')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableProgressGesture',
        get(domNode) {
            const value = domNode.getAttribute('enable-progress-gesture')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'objectFit',
        get(domNode) {
            return domNode.getAttribute('object-fit') || 'contain'
        },
    }, {
        name: 'poster',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.poster ? tool.completeURL(domNode.poster, window.location.origin, true) : ''
        },
    }, {
        name: 'showMuteBtn',
        get(domNode) {
            return !!domNode.getAttribute('show-mute-btn')
        },
    }, {
        name: 'title',
        get(domNode) {
            return domNode.getAttribute('title') || ''
        },
    }, {
        name: 'playBtnPosition',
        get(domNode) {
            return domNode.getAttribute('play-btn-position') || 'bottom'
        },
    }, {
        name: 'enablePlayGesture',
        get(domNode) {
            return !!domNode.getAttribute('enable-play-gesture')
        },
    }, {
        name: 'autoPauseIfNavigate',
        get(domNode) {
            const value = domNode.getAttribute('auto-pause-if-navigate')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'autoPauseIfOpenNative',
        get(domNode) {
            const value = domNode.getAttribute('auto-pause-if-open-native')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'vslideGesture',
        get(domNode) {
            return !!domNode.getAttribute('vslide-gesture')
        },
    }, {
        name: 'vslideGestureInFullscreen',
        get(domNode) {
            const value = domNode.getAttribute('vslide-gesture-in-fullscreen')
            return value !== undefined ? !!value : true
        },
    }],
    handles: {
        onVideoPlay(evt) {
            this.callSingleEvent('play', evt)
        },

        onVideoPause(evt) {
            this.callSingleEvent('pause', evt)
        },

        onVideoEnded(evt) {
            this.callSingleEvent('ended', evt)
        },

        onVideoTimeUpdate(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('currentTime', evt.detail.currentTime)
            this.callSingleEvent('timeupdate', evt)
        },

        onVideoFullScreenChange(evt) {
            this.callSingleEvent('fullscreenchange', evt)
        },

        onVideoWaiting(evt) {
            this.callSingleEvent('waiting', evt)
        },

        onVideoError(evt) {
            this.callSingleEvent('error', evt)
        },

        onVideoProgress(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('buffered', evt.detail.buffered)
            this.callSingleEvent('progress', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393396, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/map.html
 */

/**
 * 兼容开发者工具 bug
 */
function dealWithDevToolsEvt(evt) {
    if (!evt.detail) evt.detail = {}
    if (evt.markerId !== undefined) evt.detail.markerId = evt.markerId
    if (evt.controlId !== undefined) evt.detail.controlId = evt.controlId
    if (evt.name !== undefined) evt.detail.name = evt.name
    if (evt.longitude !== undefined) evt.detail.longitude = evt.longitude
    if (evt.latitude !== undefined) evt.detail.latitude = evt.latitude
}

/**
 * 兼容 react
 */
function dealWithReactAttr(value) {
    if (typeof value === 'string') {
        // react 会直接将属性值转成字符串
        try {
            value = JSON.parse(value)
        } catch (err) {
            value = undefined
        }
    }

    return value
}

module.exports = {
    properties: [{
        name: 'longitude',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('longitude'))
            return !isNaN(value) ? value : 39.92
        },
    }, {
        name: 'latitude',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('latitude'))
            return !isNaN(value) ? value : 116.46
        },
    }, {
        name: 'scale',
        // canBeUserChanged: true,
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale'))
            return !isNaN(value) ? value : 16
        },
    }, {
        name: 'markers',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('markers'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'polyline',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('polyline'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'circles',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('circles'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'controls',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('controls'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'includePoints',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('include-points'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'showLocation',
        get(domNode) {
            return !!domNode.getAttribute('show-location')
        },
    }, {
        name: 'polygons',
        get(domNode) {
            const value = dealWithReactAttr(domNode.getAttribute('polygons'))
            return value !== undefined ? value : []
        },
    }, {
        name: 'subkey',
        get(domNode) {
            return domNode.getAttribute('subkey') || ''
        },
    }, {
        name: 'layerStyle',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('layer-style'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'rotate',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('rotate') || 0
        },
    }, {
        name: 'skew',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('skew') || 0
        },
    }, {
        name: 'enable3D',
        get(domNode) {
            return !!domNode.getAttribute('enable-3D')
        },
    }, {
        name: 'showCompass',
        get(domNode) {
            return !!domNode.getAttribute('show-compass')
        },
    }, {
        name: 'enableOverlooking',
        get(domNode) {
            return !!domNode.getAttribute('enable-overlooking')
        },
    }, {
        name: 'enableZoom',
        get(domNode) {
            const value = domNode.getAttribute('enable-zoom')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableScroll',
        get(domNode) {
            const value = domNode.getAttribute('enable-scroll')
            return value !== undefined ? !!value : true
        },
    }, {
        name: 'enableRotate',
        get(domNode) {
            return !!domNode.getAttribute('enable-rotate')
        },
    }, {
        name: 'enableSatellite',
        get(domNode) {
            return !!domNode.getAttribute('enable-satellite')
        },
    }, {
        name: 'enableTraffic',
        get(domNode) {
            return !!domNode.getAttribute('enable-traffic')
        },
    }],
    handles: {
        onMapTap(evt) {
            this.callSingleEvent('tap', evt)
        },

        onMapMarkerTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('markertap', evt)
        },

        onMapLabelTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('labeltap', evt)
        },

        onMapControlTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('controltap', evt)
        },

        onMapCalloutTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('callouttap', evt)
        },

        onMapUpdated(evt) {
            this.callSingleEvent('updated', evt)
        },

        onMapRegionChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            if (!evt.detail.causedBy) evt.detail.causedBy = evt.causedBy
            if (evt.type === 'end' || evt.detail.type === 'end') {
                // 可被用户行为改变的值，需要记录
                domNode._oldValues = domNode._oldValues || {}
                // 以下三项官方未支持
                // domNode._oldValues.longitude = evt.detail.longitude
                // domNode._oldValues.latitude = evt.detail.latitude
                // domNode._oldValues.scale = evt.detail.scale
                domNode._oldValues.rotate = evt.detail.rotate
                domNode._oldValues.skew = evt.detail.skew
            }

            this.callSingleEvent('regionchange', evt)
        },

        onMapPoiTap(evt) {
            dealWithDevToolsEvt(evt)
            this.callSingleEvent('poitap', evt)
        },

    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393397, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html
 */

/**
 * 兼容 canvas 相关 touch 事件，基础库没有提供 currentTarget 的问题
 */
function dealWithEvt(evt) {
    if (!evt.currentTarget || !evt.currentTarget.dataset.privateNodeId) {
        // 取 target
        evt.currentTarget = evt.currentTarget || {dataset: {}}
        evt.currentTarget.dataset.privateNodeId = evt.target.dataset.privateNodeId
    }
}

module.exports = {
    properties: [{
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || ''
        },
    }, {
        name: 'canvasId',
        get(domNode) {
            return domNode.getAttribute('canvas-id') || ''
        },
    }, {
        name: 'disableScroll',
        get(domNode) {
            return !!domNode.getAttribute('disable-scroll')
        },
    }, {
        // kbone 自定义的特殊属性，用于兼容 iOS 端绑定了 canvas touch 事件后，触发不了页面滚动的 bug
        name: 'disableEvent',
        get(domNode) {
            return !!domNode.getAttribute('disable-event')
        },
    }],
    handles: {
        onCanvasTouchStart(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchstart', evt)
            this.onTouchStart(evt)
        },

        onCanvasTouchMove(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchmove', evt)
            this.onTouchMove(evt)
        },

        onCanvasTouchEnd(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchend', evt)
            this.onTouchEnd(evt)
        },

        onCanvasTouchCancel(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('canvastouchcancel', evt)
            this.onTouchCancel(evt)
        },

        onCanvasLongTap(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('longtap', evt)
        },

        onCanvasError(evt) {
            dealWithEvt(evt)
            this.callSingleEvent('error', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393398, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
module.exports = {
    properties: [{
        name: 'unitId',
        get(domNode) {
            return domNode.getAttribute('unit-id') || ''
        },
    }, {
        name: 'adIntervals',
        get(domNode) {
            return +domNode.getAttribute('ad-intervals') || 0
        },
    }],
    handles: {
        onAdLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onAdError(evt) {
            this.callSingleEvent('error', evt)
        },

        onAdClose(evt) {
            this.callSingleEvent('close', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393399, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
 */
module.exports = {
    properties: [],
    handles: {
        onOfficialAccountLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onOfficialAccountError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393400, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html
 */
module.exports = {
    properties: [{
        name: 'type',
        get(domNode) {
            return domNode.getAttribute('type') || ''
        },
    }, {
        name: 'openGid',
        get(domNode) {
            return domNode.getAttribute('open-gid') || ''
        },
    }, {
        name: 'lang',
        get(domNode) {
            return domNode.getAttribute('lang') || 'en'
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393401, function(require, module, exports) {
const mp = require('miniprogram-render')

const {
    cache,
    tool,
} = mp.$$adapter

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html
 */
module.exports = {
    properties: [{
        name: 'src',
        get(domNode) {
            const window = cache.getWindow(domNode.$$pageId)
            return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : ''
        },
    }],
    handles: {
        onWebviewMessage(evt) {
            this.callSingleEvent('message', evt)
        },

        onWebviewLoad(evt) {
            this.callSingleEvent('load', evt)
        },

        onWebviewError(evt) {
            this.callSingleEvent('error', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393402, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html
 */
module.exports = {
    properties: [{
        name: 'direction',
        get(domNode) {
            return domNode.getAttribute('direction') || 'none'
        },
    }, {
        name: 'inertia',
        get(domNode) {
            return !!domNode.getAttribute('inertia')
        },
    }, {
        name: 'outOfBounds',
        get(domNode) {
            return !!domNode.getAttribute('out-of-bounds')
        },
    }, {
        name: 'x',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('x') || 0
        },
    }, {
        name: 'y',
        canBeUserChanged: true,
        get(domNode) {
            return +domNode.getAttribute('y') || 0
        },
    }, {
        name: 'damping',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('damping'))
            return !isNaN(value) ? value : 20
        },
    }, {
        name: 'friction',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('friction'))
            return !isNaN(value) ? value : 2
        },
    }, {
        name: 'disabled',
        get(domNode) {
            return !!domNode.getAttribute('disabled')
        },
    }, {
        name: 'scale',
        canBeUserChanged: true,
        get(domNode) {
            return !!domNode.getAttribute('scale')
        },
    }, {
        name: 'scaleMin',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-min'))
            return !isNaN(value) ? value : 0.5
        },
    }, {
        name: 'scaleMax',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-max'))
            return !isNaN(value) ? value : 10
        },
    }, {
        name: 'scaleValue',
        get(domNode) {
            const value = parseFloat(domNode.getAttribute('scale-value'))
            return !isNaN(value) ? value : 1
        },
    }, {
        name: 'animation',
        get(domNode) {
            const value = domNode.getAttribute('animation')
            return value !== undefined ? !!value : true
        },
    }],
    handles: {
        onMovableViewChange(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('x', evt.detail.x)
            domNode.$$setAttributeWithoutUpdate('y', evt.detail.y)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.x = evt.detail.x
            domNode._oldValues.y = evt.detail.y

            this.callSingleEvent('change', evt)
        },

        onMovableViewScale(evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            domNode.$$setAttributeWithoutUpdate('x', evt.detail.x)
            domNode.$$setAttributeWithoutUpdate('y', evt.detail.y)
            domNode.$$setAttributeWithoutUpdate('scale-value', evt.detail.scale)

            // 可被用户行为改变的值，需要记录
            domNode._oldValues = domNode._oldValues || {}
            domNode._oldValues.x = evt.detail.x
            domNode._oldValues.y = evt.detail.y
            domNode._oldValues.scaleValue = evt.detail.scale

            this.callSingleEvent('scale', evt)
        },

        onMovableViewHtouchmove(evt) {
            this.callSingleEvent('htouchmove', evt)
        },

        onMovableViewVtouchmove(evt) {
            this.callSingleEvent('vtouchmove', evt)
        },
    },
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393403, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html
 */
module.exports = {
    properties: [{
        name: 'itemId',
        get(domNode) {
            return domNode.getAttribute('item-id') || ''
        },
    }],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393404, function(require, module, exports) {
/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/picker-view-column.html
 */
module.exports = {
    properties: [],
    handles: {},
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589353393405, function(require, module, exports) {
const _ = require('./tool')
const component = require('./component')

const {
    NOT_SUPPORT,
    USE_TEMPLATE,
} = _
const {
    wxCompNameMap,
    handles,
} = component

module.exports = {
    /**
     * 初始化
     */
    init(data) {
        const domNode = this.domNode
        const tagName = domNode.tagName

        // 使用 template 渲染
        if (USE_TEMPLATE.indexOf(tagName) !== -1 || USE_TEMPLATE.indexOf(domNode.behavior) !== -1) return

        if (tagName === 'WX-COMPONENT') {
            // 内置组件
            data.wxCompName = domNode.behavior
            const wxCompName = wxCompNameMap[data.wxCompName]
            if (wxCompName) _.checkComponentAttr(wxCompName, domNode, data)
            else console.warn(`value "${data.wxCompName}" is not supported for wx-component's behavior`)
        } else if (tagName === 'WX-CUSTOM-COMPONENT') {
            // 自定义组件
            data.wxCustomCompName = domNode.behavior
            data.nodeId = this.nodeId
            data.pageId = this.pageId
        } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
            // 不支持标签
            data.wxCompName = 'not-support'
            data.content = domNode.textContent
        } else {
            // 可替换 html 标签
            const wxCompName = wxCompNameMap[tagName]
            if (wxCompName) data.wxCompName = wxCompName
        }
    },

    ...handles,
}

}, function(modId) { var map = {"./tool":1589353393368,"./component":1589353393370}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1589353393367);
})()
//# sourceMappingURL=index.js.map