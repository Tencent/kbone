const mp = require('miniprogram-render')

const {
    tool,
} = mp.$$adapter

/**
 * setData 封装
 */
function setData(instance, data) {
    if (tool.setData) tool.setData(instance, data)
    else instance.setData(data)
}

module.exports = function(mp, config, init) {
    /**
     * 处理一些特殊的页面
     */
    function dealWithPage(evt, window, value) {
        const type = evt.type
        let url = evt.url

        if (value === 'webview') {
            // 补全 url
            url = mp.$$adapter.tool.completeURL(url, window.location.origin)

            const options = {url: `/pages/webview/index?url=${encodeURIComponent(url)}`}
            if (type === 'jump') wx.redirectTo(options)
            else if (type === 'open') wx.navigateTo(options)
        } else if (value === 'error') {
            console.error(`page not found: ${evt.url}`)
        } else if (value !== 'none') {
            const targeturl = `${window.location.origin}/redirect?url=${encodeURIComponent(url)}`
            const subpackagesMap = window.$$miniprogram.subpackagesMap
            const packageName = subpackagesMap[value]
            const pageRoute = `/${packageName ? packageName + '/' : ''}pages/${value}/index`
            const options = {url: `${pageRoute}?type=${type}&targeturl=${encodeURIComponent(targeturl)}`}
            if (window.$$miniprogram.isTabBarPage(pageRoute)) wx.switchTab(options)
            else if (type === 'jump') wx.redirectTo(options)
            else if (type === 'open') wx.navigateTo(options)
        }
    }

    /**
     * 处理 query 参数
     */
    function dealWithShareQuery(window, name, data) {
        if (window && window[name]) {
            const shareOptions = Object.assign({}, window[name](data))

            if (shareOptions.miniprogramQuery) {
                shareOptions.query = shareOptions.miniprogramQuery
            } else {
                const query = {
                    type: 'share',
                    targeturl: encodeURIComponent(window.location.href),
                    search: encodeURIComponent(shareOptions.query || ''),
                }
                const currentQuery = Object.keys(query).map(key => `${key}=${query[key] || ''}`).join('&')
                shareOptions.query = currentQuery
            }

            return shareOptions
        }
    }

    const initOptions = {
        base: {
            options: {
                styleIsolation: 'shared',
            },
            properties: {
                route: {
                    type: String,
                    value: '',
                },
                params: {
                    type: Object,
                    value: null,
                },
            },
            data: {
                pageId: '',
                bodyClass: 'h5-body miniprogram-root',
                bodyStyle: '',
                rootFontSize: '12px',
                pageStyle: '',
                loading: true,
            },
            lifetimes: {
                attached() {
                    const owner = this.selectOwnerComponent()
                    if (this.route && !owner) {
                        this.isPage = true
                    } else {
                        // 被当作组件使用
                        this.isPage = false
                        this.route = this.data.route

                        let query = this.data.params
                        if (!query || typeof query !== 'object') query = {}
                        this.onLoad(query)
                    }
                },
                ready() {
                    if (!this.isPage) this.onReady()
                },
                detached() {
                    if (!this.isPage) this.onUnload()
                },
            },
            pageLifetimes: {
                show() {
                    // 方便调试
                    global.$$runtime = {
                        window: this.window,
                        document: this.document,
                    }
                    this.document.$$visibilityState = 'visible'
                    this.window.$$trigger('wxshow')
                    this.document.$$trigger('visibilitychange')
                },
                hide() {
                    global.$$runtime = null
                    this.document.$$visibilityState = 'hidden'
                    this.window.$$trigger('wxhide')
                    this.document.$$trigger('visibilitychange')
                },
                resize() {
                    if (this.window) this.window.$$trigger('resize')
                },
            },
        },
        methods: {
            onLoad(query) {
                const pageName = mp.$$adapter.tool.getPageName(this.route)
                const pageConfig = this.pageConfig = config.pages[pageName] || {}

                if (pageConfig.loadingText) {
                    wx.showLoading({
                        title: pageConfig.loadingText,
                        mask: true,
                    })
                }

                const mpRes = mp.createPage(this.route, config)
                this.pageId = mpRes.pageId
                this.window = mpRes.window
                this.document = mpRes.document
                this.query = query

                // 写入 page 的方法
                if (typeof this.getTabBar === 'function') this.window.getTabBar = this.getTabBar.bind(this)

                // 处理跳转页面不存在的情况
                if (config.redirect && config.redirect.notFound) {
                    this.window.addEventListener('pagenotfound', evt => {
                        dealWithPage(evt, mpRes.window, config.redirect.notFound)
                    })
                }

                // 处理跳转受限制页面的情况
                if (config.redirect && config.redirect.accessDenied) {
                    this.window.addEventListener('pageaccessdenied', evt => {
                        dealWithPage(evt, mpRes.window, config.redirect.accessDenied)
                    })
                }

                if (query.type === 'open' || query.type === 'jump' || query.type === 'share') {
                    // 处理页面参数，只有当页面是其他页面打开或跳转时才处理
                    let targetUrl = decodeURIComponent(query.targeturl)
                    targetUrl = targetUrl.indexOf('://') >= 0 ? targetUrl : (config.origin + targetUrl)
                    this.window.$$miniprogram.init(targetUrl || null)

                    if (query.search) this.window.location.search = decodeURIComponent(query.search)
                    if (query.hash) this.window.location.hash = decodeURIComponent(query.hash)
                } else {
                    this.window.$$miniprogram.init()
                }

                // 处理分享显示
                if (!pageConfig.share || !pageConfig.shareTimeline) {
                    const menus = []
                    if (!pageConfig.share) menus.push('shareAppMessage')
                    if (!pageConfig.shareTimeline) menus.push('shareTimeline')
                    wx.hideShareMenu({menus})
                }

                // 处理 document 更新
                this.document.documentElement.addEventListener('$$domNodeUpdate', () => {
                    if (pageConfig.rem) {
                        let rootFontSize = this.document.documentElement.style.fontSize
                        if (!rootFontSize) rootFontSize = wx.getSystemInfoSync().screenWidth / 16 + 'px'
                        if (rootFontSize !== this.data.rootFontSize) setData(this, {rootFontSize})
                    }
                    if (pageConfig.pageStyle) {
                        const pageStyle = this.document.documentElement.style.cssText
                        if (pageStyle && pageStyle !== this.data.pageStyle) setData(this, {pageStyle})
                    }
                })

                // 处理 body 更新
                this.document.documentElement.addEventListener('$$childNodesUpdate', () => {
                    const domNode = this.document.body
                    const data = {
                        bodyClass: `${domNode.className || ''} h5-body miniprogram-root`, // 增加默认 class
                        bodyStyle: domNode.style.cssText || ''
                    }

                    if (data.bodyClass !== this.data.bodyClass || data.bodyStyle !== this.data.bodyStyle) {
                        setData(this, data)
                    }
                })

                // 处理 selectorQuery 获取
                this.window.$$createSelectorQuery = () => wx.createSelectorQuery().in(this)

                // 处理 intersectionObserver 获取
                this.window.$$createIntersectionObserver = options => wx.createIntersectionObserver(this, options)

                // 处理 openerEventChannel 获取
                this.window.$$getOpenerEventChannel = () => this.getOpenerEventChannel()

                // 初始化页面显示状态
                this.document.$$visibilityState = 'prerender'

                // 统计初始化耗时
                this.window._startInit = true
                this.window._iniCount = 0
                this.window.addEventListener('load', () => {
                    Promise.resolve().then(() => this.window._startInit = false).catch(console.error)
                })

                init(this.window, this.document)
                setData(this, {pageId: this.pageId})
                this.app = this.window.createApp()
                if (this.app && typeof this.app.then === 'function') {
                    // createApp 是一个 promise
                    this.app.then(app => {
                        this.app = app
                        this.window.$$trigger('load')
                        this.window.$$trigger('wxload', {event: query})
                    }).catch(console.error)
                } else {
                    this.window.$$trigger('load')
                    this.window.$$trigger('wxload', {event: query})
                }
            },
            onReady() {
                if (this.pageConfig.loadingText) wx.hideLoading()
                if (this.pageConfig.loadingView) setTimeout(() => setData(this, {loading: false}), 1000) // 1s 后再删除，确保页面初始渲染逻辑完成
                this.window.$$trigger('wxready')
            },
            onUnload() {
                this.document.$$visibilityState = 'unloaded'
                this.window.$$trigger('beforeunload')
                this.window.$$trigger('wxunload')
                if (this.app) {
                    if (this.app.$destroy) this.app.$destroy()
                    if (this.app.unmount) this.app.unmount()
                }
                this.document.body.$$recycle() // 回收 dom 节点
                this.window.$$destroy()

                mp.destroyPage(this.pageId)
                global.$$runtime = null

                this.pageConfig = null
                this.pageId = null
                this.window.getTabBar = null
                this.window.$$createSelectorQuery = null
                this.window.$$createIntersectionObserver = null
                this.window.$$getOpenerEventChannel = null
                this.window = null
                this.document = null
                this.app = null
                this.query = null
            },
            onShareAppMessage(data) {
                const window = this.window
                if (window && window.onShareAppMessage) {
                    const shareOptions = Object.assign({}, window.onShareAppMessage(data))

                    if (shareOptions.miniprogramPath) {
                        shareOptions.path = shareOptions.miniprogramPath
                    } else {
                        let query = {}
                        let route = this.route

                        if (shareOptions.path) {
                            const {pathname} = window.location.constructor.$$parse(shareOptions.path)
                            const matchRoute = window.$$miniprogram.getMatchRoute(pathname || '/')
                            if (matchRoute) route = matchRoute
                            query.targeturl = encodeURIComponent(shareOptions.path)
                        } else {
                            // 组装当前页面路径
                            const location = window.location

                            query = Object.assign(query, this.query || {})
                            query.targeturl = encodeURIComponent(location.href)
                            query.search = encodeURIComponent(location.search)
                            query.hash = encodeURIComponent(location.hash)
                        }

                        query.type = 'share'
                        const queryString = Object.keys(query).map(key => `${key}=${query[key] || ''}`).join('&')
                        const currentPagePath = `${route}?${queryString}`
                        shareOptions.path = currentPagePath
                    }

                    return shareOptions
                }
            },
            onShareTimeline(data) {
                return dealWithShareQuery(this.window, 'onShareTimeline', data)
            },
            onAddToFavorites(data) {
                return dealWithShareQuery(this.window, 'onAddToFavorites', data)
            },
            onTabItemTap(data) {
                if (this.window && this.window.onTabItemTap) this.window.onTabItemTap(data)
            },
        },
    }

    return initOptions
}
