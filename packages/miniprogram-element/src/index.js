const mp = require('miniprogram-render')
const _ = require('./utils')
const initData = require('./init-data')

const {
  cache, EventTarget, Event, tool
} = mp.$$adapter

let DOM_SUB_TREE_LEVEL = 5 // dom 子树作为自定义组件渲染的层级数

Component({
  data: initData,
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

    // 特殊处理各种标签
    const tagName = this.domNode.tagName
    if (tagName === 'WX-COMPONENT') this.initWxComponent(data)
    if (tagName === 'IMG') this.initImg(data)
    if (tagName === 'INPUT') this.initInput(data)
    if (tagName === 'VIDEO') this.initVideo(data)

    // 因为无法支持 iframe，所以需要显示提示文字
    if (tagName === 'IFRAME') this.initNotSupport(data)

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
      const window = cache.getWindow(this.pageId)
      const tagName = domNode.tagName

      if (tagName === 'WX-COMPONENT') {
        newData.class = domNode.$$domInfo.class

        if (data.wxCompName !== domNode.$$behavior) newData.wxCompName = domNode.$$behavior
        if (data.content !== domNode.content) newData.content = domNode.$$content
        if (data.style !== domNode.style.cssText) newData.style = domNode.style.cssText

        if (domNode.$$behavior === 'button') {
          _.checkAttrUpdate(data, domNode, newData, ['disabled', 'openType'])
        } else if (domNode.$$behavior === 'picker') {
          _.checkAttrUpdate(data, domNode, newData, ['disabled', 'mode', 'range', 'rangeKey', 'value', 'start', 'end', 'fields', 'customItem'])
        }
      } if (tagName === 'IMG') {
        const oldSrc = data.src
        const newSrc = tool.completeURL(domNode.src, window.location.origin)
        if (newSrc !== oldSrc) newData.src = newSrc
      } else if (tagName === 'INPUT') {
        if (typeof domNode.$$focus === 'boolean') newData.focus = domNode.$$focus
        if (domNode.type === 'number') newData.mpType = 'digit' // 调整为带小数点

        _.checkAttrUpdate(data, domNode, newData, ['disabled', 'type', 'value', 'maxlength', 'placeholder', 'placeholderClass', 'cursorSpacing'])
      } else if (tagName === 'VIDEO') {
        const oldSrc = data.src
        const newSrc = tool.completeURL(domNode.src, window.location.origin)
        if (newSrc !== oldSrc) newData.src = newSrc

        const oldPoster = data.poster
        const newPoster = tool.completeURL(domNode.poster, window.location.origin)
        if (newPoster !== oldPoster) newData.poster = newPoster

        _.checkAttrUpdate(data, domNode, newData, ['autoplay', 'loop', 'muted', 'controls'])
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
     * 触发简单节点事件
     */
    callSimpleEvent(eventName, evt) {
      if (!this.domNode) return

      this.domNode.$$trigger(eventName, {
        event: new Event({
          name: eventName,
          target: this.domNode,
          eventPhase: Event.AT_TARGET,
          detail: evt && evt.detail,
        }),
        currentTarget: this.domNode,
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

    /**
     * 内置组件
     */
    initWxComponent(data) {
      data.wxCompName = this.domNode.$$behavior
      data.content = this.domNode.$$content
      data.class = this.domNode.$$domInfo.class || ''
      data.style = this.domNode.style.cssText

      if (data.wxCompName === 'button') {
        _.checkAttrUpdate(this.data, this.domNode, data, ['disabled', 'openType'])
      } else if (data.wxCompName === 'picker') {
        _.checkAttrUpdate(this.data, this.domNode, data, ['disabled', 'mode', 'range', 'rangeKey', 'value', 'start', 'end', 'fields', 'customItem'])
      }
    },

    /**
     * 不支持组件
     */
    initNotSupport(data) {
      data.wxCompName = 'view'
      data.content = this.domNode.$$content
    },

    /**
     * img
     */
    initImg(data) {
      const window = cache.getWindow(this.pageId)

      data.wxCompName = 'image'
      data.src = tool.completeURL(this.domNode.src, window.location.origin, true)
    },

    onImgLoad(evt) {
      if (!this.domNode) return

      // 设置宽高
      this.domNode.$$width = evt.detail.width
      this.domNode.$$height = evt.detail.height

      this.callSimpleEvent('load', evt)
    },

    onImgError() {
      this.callSimpleEvent('error')
    },

    /**
     * input
     */
    initInput(data) {
      data.wxCompName = 'input'

      _.checkAttrUpdate(this.data, this.domNode, data, ['disabled', 'type', 'value', 'maxlength', 'placeholder', 'placeholderClass', 'cursorSpacing'])

      if (typeof this.domNode.$$focus === 'boolean') data.focus = this.domNode.$$focus
      if (this.domNode.type === 'number') data.mpType = 'digit' // 调整为带小数点
    },

    onInputInput(evt) {
      if (!this.domNode) return

      this.domNode.value = evt.detail.value
      this.callSimpleEvent('input', evt)
    },

    onInputBlur() {
      this.callSimpleEvent('blur')
    },

    onInputFocus() {
      this.callSimpleEvent('focus')
    },

    onInputConfirm() {
      this.callSimpleEvent('confirm')
    },

    /**
     * video
     */
    initVideo(data) {
      const window = cache.getWindow(this.pageId)

      data.wxCompName = 'video'
      data.src = tool.completeURL(this.domNode.src, window.location.origin, true)
      data.poster = tool.completeURL(this.domNode.poster, window.location.origin, true)

      _.checkAttrUpdate(this.data, this.domNode, data, ['autoplay', 'loop', 'muted', 'controls'])
    },

    onVideoPlay() {
      this.callSimpleEvent('play')
    },

    onVideoPause() {
      this.callSimpleEvent('pause')
    },

    onVideoEnded() {
      this.callSimpleEvent('ended')
    },

    onVideoTimeUpdate(evt) {
      if (!this.domNode) return

      this.domNode.setAttribute('currentTime', evt.detail.currentTime)
      this.callSimpleEvent('timeupdate', evt)
    },

    onVideoWaiting() {
      this.callSimpleEvent('waiting')
    },

    onVideoError() {
      this.callSimpleEvent('error')
    },

    onVideoProgress(evt) {
      if (!this.domNode) return

      this.domNode.setAttribute('buffered', evt.detail.buffered)
      this.callSimpleEvent('progress', evt)
    },

    /**
     * picker
     */
    onPickerChange(evt) {
      if (!this.domNode) return

      this.domNode.setAttribute('value', evt.detail.value)
      this.callSimpleEvent('change', evt)
    },

    onPickerColumnChange() {
      this.callSimpleEvent('columnchange')
    },

    onPickerCancel() {
      this.callSimpleEvent('cancel')
    },
  }
})
