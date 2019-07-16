const EventTarget = require('./event/event-target')
const Event = require('./event/event')
const Location = require('./bom/location')
const Navigator = require('./bom/navigator')
const cache = require('./util/cache')
const Screen = require('./bom/screen')
const History = require('./bom/history')
const Miniprogram = require('./bom/miniprogram')
const LocalStorage = require('./bom/local-storage')
const SessionStorage = require('./bom/session-storage')
const CustomEvent = require('./event/custom-event')
const Element = require('./node/element')

let lastRafTime = 0

class Window extends EventTarget {
  constructor(pageId) {
    super()

    this.$_pageId = pageId

    this.$_outerHeight = 0
    this.$_outerWidth = 0
    this.$_innerHeight = 0
    this.$_innerWidth = 0

    this.$$config = {} // 对外配置对象，在业务代码中进行配置

    this.$_location = new Location(pageId)
    this.$_navigator = new Navigator()
    this.$_screen = new Screen()
    this.$_history = new History(this.$_location)
    this.$_miniprogram = new Miniprogram(pageId)

    this.$_localStorage = new LocalStorage(this)
    this.$_sessionStorage = new SessionStorage(this)

    this.$_nowFetchingWebviewInfoPromise = null // 正在拉取 webview 端信息的 promise 实例

    this.$_fetchDeviceInfo()
    this.$_initInnerEvent()

    // 补充实例的属性，用于 'xxx' in XXX 判断
    this.onhashchange = null

    this.$_elementConstructor = function HTMLElement(...args) {
      return Element.$$create(...args)
    }
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
   * 暴露给小程序用的对象
   */
  get $$miniprogram() {
    return this.$_miniprogram
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
    return CustomEvent
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

  open(url) {
    // 不支持 windowName 和 windowFeatures
    this.location.$$open(url)
  }

  getComputedStyle() {
    // 不作任何实现，只作兼容使用
    console.warn('window.getComputedStyle not support')
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
