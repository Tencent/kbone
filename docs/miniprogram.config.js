const path = require('path')

module.exports = {
    // 页面 origin，默认是 https://miniprogram.default
    origin: 'https://test.miniprogram.com',
    // 入口页面路由，默认是 /
    entry: '/',
    // 页面路由，用于页面间跳转
    router: {
        // 路由可以是多个值，支持动态路由
        home: [
            '/(home|index)?',
            '/test/(home|index)',
        ],
        list: [
            '/test/list/:id',
        ],
        detail: [
            '/test/detail/:id',
        ],
        profile: [
            '/test/profile',
        ],
    },
    // 特殊路由跳转
    redirect: {
        // 跳转遇到同一个 origin 但是不在 router 里的页面时处理方式，支持的值：webview - 使用 web-view 组件打开；error - 抛出异常；none - 默认值，什么都不做；router 配置项中的 key - 跳转到对应页面，这个页面必须在主包中
        notFound: 'home',
        // 跳转到 origin 之外的页面时处理方式，值同 notFound
        accessDenied: 'home',
    },
    // 构建输出配置
    generate: {
        // app.wxss 输出配置，默认值为 default，即输出默认标签样式，其他可选值：none - 输出为空，display - 只输出 display 相关的内容
        appWxss: 'default',
        // 小程序分包，暂不支持独立分包，详细注意事项可参考：https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html
        subpackages: {
            package1: ['list'], // 包名为 package1，包中包含页面 list，下同
            package2: ['detail'],
        },
        // 小程序分包预下载，详细注意事项可参考：https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html
        preloadRule: {
            // 进入 list 页面时，会预下载名为 package2 的分包
            list: {
                network: 'all',
                packages: ['package2'],
            },
        },
        // 小程序 tabBar，暂不支持自定义 tabBar，详细注意事项可参考：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar
        tabBar: {
            color: '#000000',
            selectedColor: '#07c160',
            backgroundColor: '#ffffff',
            list: [{
                // 使用 pageName 替代官方文档中的 pagePath 字段
                pageName: 'home',
                text: '主页',
                // iconPath 和 selectedIconPath 因为不支持网络图片，需要指定对应图片的绝对路径
                iconPath: path.resolve(__dirname, '../src/img/home.png'),
                selectedIconPath: path.resolve(__dirname, '../src/img/home-sel.png'),
            }, {
                pageName: 'profile',
                text: '个人页',
                iconPath: path.resolve(__dirname, '../src/img/profile.png'),
                selectedIconPath: path.resolve(__dirname, '../src/img/profile-sel.png'),
            }],
        },
    },
    // 运行时配置
    runtime: {
        wxComponent: 'default', // 内置组件使用配置，默认值为 default，即可使用 wx-component 标签或类似 wx-view 这样使用前缀的用法，其他可选值：noprefix - 支持 default 用法的前提下，也支持无前缀的用法，比如直接使用 view 标签表示 view 内置组件
        cookieStore: 'default', // cookie 存储方式，默认值为 default，即存储在内存中，其他可选值：storage - 存储在小程序的 storage 中
    },
    // app 配置，同 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#window
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: 'miniprogram-project',
    },
    // 全局配置
    global: {
        loadingText: '拼命加载页面中...', // 页面加载时是否需要 loading 提示，默认是没有，即空串
        share: true, // 是否支持分享，若支持，会展示分享按钮并调用 app 的 onShareAppMessage 按钮
        windowScroll: false, // 是否需要 window scroll 事件，会影响性能
        pageBackgroundColor: '#F7F7F7', // page 的背景色
        reachBottom: false, // 是否支持上拉触底，若支持可监听 window 的 reachbottom 事件
        reachBottomDistance: 0, // 页面上拉触底事件触发时距页面底部距离，单位为 px
        pullDownRefresh: false, // 是否支持下拉刷新，若支持可监听 window 的 pulldownrefresh 事件

        // 除了上述字段外，其他官方页面配置也支持：https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html
        extra: {
            pageOrientation: 'portrait', // 比如 pageOrientation 配置
            disableSwipeBack: true, // 比如 disableSwipeBack 配置
        },
    },
    // 页面配置，可以为单个页面做个性化处理，覆盖全局配置
    pages: {
        home: {
            pullDownRefresh: true,
        },
        list: {
            loadingText: '加载中...',
            share: false,
        },
    },
    // 优化
    optimization: {
        domSubTreeLevel: 10, // 将多少层级的 dom 子树作为一个自定义组件渲染，支持 1 - 10，默认值为 10

        // 对象复用，当页面被关闭时会回收对象，但是如果有地方保留有对象引用的话，注意要关闭此项，否则可能出问题
        elementMultiplexing: true, // element 节点复用
        textMultiplexing: true, // 文本节点复用
        commentMultiplexing: true, // 注释节点复用
        domExtendMultiplexing: true, // 节点相关对象复用，如 style、classList 对象等

        styleValueReduce: 5000, // 如果设置 style 属性时存在某个属性的值超过一定值，则进行删减
        attrValueReduce: 5000, // 如果设置 dom 属性时存在某个属性的值超过一定值，则进行删减
    },
    // app 补充配置，主要指 pages、window 等配置外的其他配置，同 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html
    appExtraConfig: {
        debug: true,
    },
    // 项目配置，会被合并到 project.config.json
    projectConfig: {
        appid: 'wx1234567890',
    },
    // 包配置，会被合并到 package.json
    packageConfig: {
        author: 'wechat-miniprogram',
    },
}
