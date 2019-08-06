// 配置说明：https://developers.weixin.qq.com/miniprogram/dev/extended/kbone/quickstart.html#%E7%BC%96%E5%86%99-webpack-%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
module.exports = {
    origin: 'https://miniprogram.default',
    entry: '/',
    router: {
        app: [],
    },
    redirect: {
        notFound: 'app',
        accessDenied: 'app',
    },
    app: {
        navigationStyle: 'custom',
        // navigationBarTitleText: '',
        // navigationBarBackgroundColor: '#000000',
        // navigationBarTextStyle: 'white',
        backgroundColor: '#FFFFFF',
        backgroundTextStyle: 'dark',
        backgroundColorTop: '#FFFFFF',
        backgroundColorBottom: '#FFFFFF',
        enablePullDownRefresh: false,
        onReachBottomDistance: 50,
        pageOrientation: 'portrait',
    },
    global: {},
    pages: {},
    optimization: {
        domSubTreeLevel: 10,

        elementMultiplexing: true,
        textMultiplexing: true,
        commentMultiplexing: true,
        domExtendMultiplexing: true,

        styleValueReduce: 100000,
        attrValueReduce: 100000,
    },
    appExtraConfig: {},
    projectConfig: {
        appid: '',
        projectname: 'kbone-demo4',
    },
    packageConfig: {
        name: 'kbone-demo4',
    },
    // vue-cli 相关配置
    vue: {
        entryFileName: 'main.mp.js',
        cdnPath: '',
        cdnLimit: '100000'
    },
}
