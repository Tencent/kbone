const mp = require('miniprogram-render')
const _ = require('./util/tool')
const component = require('./util/component')

const {
    cache,
    Event,
    EventTarget,
    tool,
} = mp.$$adapter
const {
    USE_TEMPLATE,
} = _
const {
    wxCompHandles,
    wxCompNameMap,
} = component

// dom 子树作为自定义组件渲染的层级数
const MAX_DOM_SUB_TREE_LEVEL = 10
let DOM_SUB_TREE_LEVEL = 10

// setData 的模式，默认使用 data path 模式
let isOriginalSetData = false

const version = wx.getSystemInfoSync().SDKVersion
const behaviors = []
if (_.compareVersion(version, '2.10.3') >= 0) behaviors.push('wx://form-field-button')
if (_.compareVersion(version, '2.16.1') < 0) console.warn('当前基础库版本过低，建议调整最低支持基础库版本。')

module.exports = Behavior({
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
    created() {
        const config = cache.getConfig()

        // 根据配置重置全局变量
        const domSubTreeLevel = +config.optimization.domSubTreeLevel
        if (domSubTreeLevel >= 1 && domSubTreeLevel <= MAX_DOM_SUB_TREE_LEVEL) DOM_SUB_TREE_LEVEL = domSubTreeLevel

        isOriginalSetData = config.optimization.setDataMode === 'original'
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

        // 存储 document
        this.document = cache.getDocument(pageId)

        // 监听全局事件
        this.onChildNodesUpdate = tool.throttle(this.onChildNodesUpdate.bind(this))
        this.domNode.$$clearEvent('$$childNodesUpdate', {$$namespace: 'root'})
        this.domNode.addEventListener('$$childNodesUpdate', this.onChildNodesUpdate, {$$namespace: 'root'})
        this.onSelfNodeUpdate = tool.throttle(this.onSelfNodeUpdate.bind(this))
        this.domNode.$$clearEvent('$$domNodeUpdate', {$$namespace: 'root'})
        this.domNode.addEventListener('$$domNodeUpdate', this.onSelfNodeUpdate, {$$namespace: 'root'})

        // 初始化
        this.init(data)

        // 初始化孩子节点
        const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this)
        data.childNodes = _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate)

        // 挂载该节点所处的自定义组件实例
        if (data.wxCompName) this.domNode._wxComponent = this

        // 执行一次 setData
        if (Object.keys(data).length) _.setData(this, data)
    },
    detached() {
        this.nodeId = null
        this.pageId = null
        this.domNode = null
        this.document = null
    },
    methods: {
        /**
         * 初始化
         */
        init(data) {
            const domNode = this.domNode
            const tagName = domNode.tagName

            // 使用 template 渲染
            if (USE_TEMPLATE.indexOf(tagName) !== -1 || USE_TEMPLATE.indexOf(domNode.behavior) !== -1) return

            if (tagName === 'WX-COMPONENT') {
                // 内置组件，目前只有 view 组件需要进入
                data.wxCompName = domNode.behavior
                const wxCompName = wxCompNameMap[data.wxCompName]
                if (wxCompName) _.checkComponentAttr(wxCompName, domNode, data)
                else console.warn(`value "${data.wxCompName}" is not supported for wx-component's behavior`)
            }
        },

        /**
         * 监听子节点变化
         */
        onChildNodesUpdate() {
            if (!this.pageId || !this.nodeId) return

            // 儿子节点有变化
            const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1, this)
            if (isOriginalSetData) {
                // 全量 setData
                if (_.checkDiffChildNodes(childNodes, this.data.childNodes)) {
                    _.setData(this, {
                        childNodes: _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate),
                    })
                }
            } else {
                // 使用 data path 的模式
                const destData = {count: 0}
                const newChildNodes = _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate)

                if (!this.data.childNodes.length) {
                    _.setData(this, {childNodes: newChildNodes})
                } else {
                    const isInterrupt = _.getDiffChildNodes(newChildNodes, this.data.childNodes, destData, 'childNodes')

                    if (isInterrupt) {
                        // key 数量超出阈值，转为 setData 完整数据
                        _.setData(this, {childNodes: newChildNodes})
                    } else if (destData.count) {
                        delete destData.count
                        _.setData(this, destData)
                    }
                }
            }
        },

        /**
         * 监听当前节点变化
         */
        onSelfNodeUpdate() {
            if (!this.pageId || !this.nodeId) return

            const domNode = this.domNode
            const data = this.data
            const tagName = domNode.tagName

            // 使用 template 渲染
            if (USE_TEMPLATE.indexOf(tagName) !== -1 || USE_TEMPLATE.indexOf(domNode.behavior) !== -1) return

            if (tagName === 'WX-COMPONENT') {
                // 内置组件，目前只有 view 组件需要进入
                const newData = {}
                const wxCompName = wxCompNameMap[domNode.behavior]

                if (data.wxCompName !== domNode.behavior) newData.wxCompName = domNode.behavior
                if (wxCompName) _.checkComponentAttr(wxCompName, domNode, newData, data)
                if (Object.keys(newData)) _.setData(this, newData)
            }
        },

        /**
         * 触发简单节点事件，不做捕获冒泡处理
         */
        callSingleEvent(eventName, evt) {
            const domNode = this.getDomNodeFromEvt(evt)
            if (!domNode) return

            const window = cache.getWindow(this.pageId)
            if (!window) return
            domNode.$$trigger(eventName, {
                event: new Event({
                    timeStamp: window.performance.now(),
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
            const miniprogramEvent = evt

            if (!domNode) return

            EventTarget.$$process(domNode, eventName, evt, extra, (domNode, evt, isCapture) => {
                // 延迟触发跳转，先等所有同步回调处理完成
                setTimeout(() => {
                    if (evt.$$preventDefault) return
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

                            // 寻找 button 节点
                            if (!targetDomNode) targetDomNode = domNode.querySelector('wx-component[behavior=button]')
                        }

                        if (!targetDomNode || !!targetDomNode.getAttribute('disabled')) return

                        // 找到了目标节点
                        if (targetDomNode.tagName === 'INPUT') {
                            if (_.checkEventAccessDomNode(evt, targetDomNode, domNode)) return

                            const type = targetDomNode.type
                            if (type === 'radio') {
                                targetDomNode.setAttribute('checked', true)
                                const name = targetDomNode.name
                                if (name) {
                                    const otherDomNodes = window.document.querySelectorAll(`input[name=${name}]`) || []
                                    for (const otherDomNode of otherDomNodes) {
                                        if (otherDomNode.type === 'radio' && otherDomNode !== targetDomNode) {
                                            otherDomNode.setAttribute('checked', false)
                                        }
                                    }
                                    this.callSimpleEvent('change', {detail: {value: targetDomNode.value}}, targetDomNode)
                                } else {
                                    const target = {dataset: {pageId: this.pageId, privateNodeId: targetDomNode.$$nodeId}}
                                    this.callEvent('$$radioChange', {
                                        target,
                                        currentTarget: target,
                                        timeStamp: window.performance.now(),
                                        touches: evt.touches,
                                        changedTouches: evt.changedTouches,
                                        detail: {},
                                    })
                                }
                            } else if (type === 'checkbox') {
                                const name = targetDomNode.name
                                targetDomNode.setAttribute('checked', !targetDomNode.checked)
                                if (name) {
                                    this.callSimpleEvent('change', {detail: {value: targetDomNode.checked ? [targetDomNode.value] : []}}, targetDomNode)
                                } else {
                                    const target = {dataset: {pageId: this.pageId, privateNodeId: targetDomNode.$$nodeId}}
                                    this.callEvent('$$checkboxChange', {
                                        target,
                                        currentTarget: target,
                                        timeStamp: window.performance.now(),
                                        touches: evt.touches,
                                        changedTouches: evt.changedTouches,
                                        detail: {},
                                    })
                                }
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
                            } else if (behavior === 'button') {
                                const target = {dataset: {pageId: this.pageId, privateNodeId: targetDomNode.$$nodeId}}
                                const clickEvt = {
                                    target,
                                    currentTarget: target,
                                    timeStamp: window.performance.now(),
                                    touches: evt.touches,
                                    changedTouches: evt.changedTouches,
                                    detail: {},
                                }
                                this.callEvent('click', clickEvt, {button: 0}) // 默认左键

                                const config = cache.getConfig()
                                if (!config.runtime.disableMpEvent) this.callEvent('tap', clickEvt)
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
                        const pickerViewList = form.querySelectorAll('wx-component[behavior=picker-view]').filter(item => !!item.getAttribute('name'))

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
                            if (pickerList.length || pickerViewList.length) {
                                [].concat(pickerList, pickerViewList).forEach(item => {
                                    let value = item.getAttribute('value')
                                    if (typeof value === 'string') {
                                        try {
                                            value = JSON.parse(value)
                                        } catch (err) {
                                            // ignore
                                        }
                                    }
                                    formData[item.getAttribute('name')] = value
                                })
                            }

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
                            if (pickerViewList.length) pickerViewList.forEach(item => item.setAttribute('value', undefined))

                            this.callSimpleEvent('reset', {extra: {$$from: 'button'}}, form)
                        }
                    }
                }, 0)

                // 补充 tap 事件
                if (eventName === 'touchend' && domNode._needCallTap) {
                    // 需要手动触发 tap
                    domNode._needCallTap = false
                    const evt = {
                        target: miniprogramEvent.target,
                        currentTarget: miniprogramEvent.currentTarget,
                    }
                    this.callEvent('click', evt, {button: 0}) // 默认左键

                    const config = cache.getConfig()
                    if (!config.runtime.disableMpEvent) this.callEvent('tap', evt)
                }
            })

            // 对齐小程序实现，如果 longpress 没有触发，需要在 touchend 时触发 tap 事件
            if (eventName === 'longpress') {
                let needCallTap = true
                let parentNode = domNode.parentNode

                while (parentNode) {
                    if (parentNode.$$hasEventHandler(eventName) || typeof parentNode[`on${eventName}`] === 'function') {
                        needCallTap = false
                    }
                    parentNode = parentNode.parentNode
                }

                domNode._needCallTap = needCallTap
            }
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

                const config = cache.getConfig()
                if (!config.runtime.disableMpEvent) this.callEvent('tap', evt)
            }
        },

        onLongPress(evt) {
            if (this.document && this.document.$$checkEvent(evt)) {
                const config = cache.getConfig()
                if (!config.runtime.disableMpEvent) this.callEvent('longpress', evt)
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

            const config = cache.getConfig()
            if (!config.runtime.disableMpEvent) this.callSingleEvent('tap', evt)
        },

        onCaptureLongPress(evt) {
            const config = cache.getConfig()
            if (!config.runtime.disableMpEvent) this.callSingleEvent('longpress', evt)
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

        ...wxCompHandles,
    }
})
