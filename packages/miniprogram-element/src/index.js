// eslint-disable-next-line import/no-extraneous-dependencies
const mp = require('miniprogram-render')
const _ = require('./util/tool')
const initHandle = require('./util/init-handle')

const {
    cache,
    EventTarget,
    tool,
} = mp.$$adapter

let DOM_SUB_TREE_LEVEL = 5 // dom 子树作为自定义组件渲染的层级数

Component({
    data: {
        childNodes: [], // 孩子节点
        wxCompName: '', // 替代的内置组件标签名
    },
    options: {
        addGlobalClass: true, // 开启全局样式
    },
    created() {
        const config = cache.getConfig()

        // 根据配置重置全局变量
        const domSubTreeLevel = +config.optimization.domSubTreeLevel
        if (domSubTreeLevel >= 1 && domSubTreeLevel <= 5) DOM_SUB_TREE_LEVEL = domSubTreeLevel
    },
    attached() {
        const nodeId = this.dataset.privateNodeId
        const pageId = this.dataset.privatePageId
        const data = {}

        this.nodeId = nodeId
        this.pageId = pageId

        // 记录 dom
        this.domNode = cache.getNode(pageId, nodeId)

        // 存储 document
        this.document = cache.getDocument(pageId)

        // 监听全局事件
        this.onChildNodesUpdate = tool.throttle(this.onChildNodesUpdate.bind(this))
        this.domNode.$$clearEvent('$$childNodesUpdate')
        this.domNode.addEventListener('$$childNodesUpdate', this.onChildNodesUpdate)
        this.onSelfNodeUpdate = tool.throttle(this.onSelfNodeUpdate.bind(this))
        this.domNode.$$clearEvent('$$domNodeUpdate')
        this.domNode.addEventListener('$$domNodeUpdate', this.onSelfNodeUpdate)

        // 初始化孩子节点
        const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1)
        data.childNodes = _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate)

        // 初始化
        this.init(data)

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
            const childNodes = _.filterNodes(this.domNode, DOM_SUB_TREE_LEVEL - 1)
            if (_.checkDiffChildNodes(childNodes, this.data.childNodes)) {
                this.setData({
                    childNodes: _.dealWithLeafAndSimple(childNodes, this.onChildNodesUpdate),
                })
            }

            // 触发子节点变化
            const childNodeStack = [].concat(childNodes)
            let childNode = childNodeStack.pop()
            while (childNode) {
                if (childNode.type === 'element' && !childNode.isLeaf && !childNode.isSimple) {
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
                newData.class = domNode.$$domInfo.class

                if (data.wxCompName !== domNode.$$behavior) newData.wxCompName = domNode.$$behavior
                if (data.content !== domNode.content) newData.content = domNode.$$content
                if (data.style !== domNode.style.cssText) newData.style = domNode.style.cssText

                if (domNode.$$behavior === 'button') {
                    _.checkAttrUpdate(data, domNode, newData, ['disabled', 'openType'])
                } else if (domNode.$$behavior === 'picker') {
                    _.checkComponentAttr('picker', domNode, newData, data)
                }
            } if (tagName === 'IMG') {
                _.checkComponentAttr('image', domNode, newData, data)
            } else if (tagName === 'INPUT') {
                _.checkComponentAttr('input', domNode, newData, data)
            } else if (tagName === 'TEXTAREA') {
                _.checkComponentAttr('textarea', domNode, newData, data)
            } else if (tagName === 'VIDEO') {
                _.checkComponentAttr('video', domNode, newData, data)
            } else if (tagName === 'IFRAME') {
                if (data.content !== domNode.content) newData.content = domNode.$$content
            }

            this.setData(newData)
        },

        /**
         * 触发事件
         */
        callEvent(evt, eventName, extra) {
            const pageId = this.pageId
            const originNodeId = evt.currentTarget.dataset.privateNodeId || this.nodeId
            const originNode = cache.getNode(pageId, originNodeId)

            if (!originNode) return

            EventTarget.$$process(originNode, eventName, evt, extra, (domNode, evt, isCapture) => {
                // 处理特殊节点事件
                if (domNode.tagName === 'A' && evt.type === 'click' && !isCapture) {
                    const window = cache.getWindow(this.pageId)

                    // 延迟触发跳转，先等所有同步回调处理完成
                    setTimeout(() => {
                        if (evt.cancelable) return

                        // 处理 a 标签的跳转
                        const href = domNode.href
                        const target = domNode.target

                        if (href.indexOf('javascript') !== -1) return

                        if (target === '_blank') window.open(href)
                        else window.location.href = href
                    }, 0)
                }
            })
        },

        /**
         * 监听节点事件
         */
        onTouchStart(evt) {
            if (this.document.$$checkEvent(evt)) {
                this.callEvent(evt, 'touchstart')
            }
        },

        onTouchMove(evt) {
            if (this.document.$$checkEvent(evt)) {
                this.callEvent(evt, 'touchmove')
            }
        },

        onTouchEnd(evt) {
            if (this.document.$$checkEvent(evt)) {
                this.callEvent(evt, 'touchend')
            }
        },

        onTouchCancel(evt) {
            if (this.document.$$checkEvent(evt)) {
                this.callEvent(evt, 'touchcancel')
            }
        },

        onTap(evt) {
            if (this.document.$$checkEvent(evt)) {
                this.callEvent(evt, 'click', {button: 0}) // 默认左键
            }
        },

        ...initHandle,
    }
})
