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
