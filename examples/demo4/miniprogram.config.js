module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '/page1',
    router: {"page1":["/page1"],"page2":["/page2"],"page3":["/page3"]},
    redirect: {
        notFound: 'app',
        accessDenied: 'app',
    },
    generate: {
        app: 'default',
        appWxss: 'default',
        autoBuildNpm: 'npm',
    },
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: 'kbone',
    },
    appExtraConfig: {
        sitemapLocation: 'sitemap.json',
    },
    global: {
        share: true,
        windowScroll: false,
        backgroundColor: '#F7F7F7',
        rem: false,
    },
    pages: {},
    optimization: {
		domSubTreeLevel: 10,

		elementMultiplexing: true,
		textMultiplexing: true,
		commentMultiplexing: true,
		domExtendMultiplexing: true,

		styleValueReduce: 5000,
		attrValueReduce: 5000,
	},
    projectConfig: {
        appid: 'wx14c7c4cd189644a1',
        projectname: 'demo4',
    },
    packageConfig: {
        name: 'demo4',
    },
    // vue-cli 相关配置
    vue: {
        entryFileName: 'main.mp.js',
        cdnPath: '/',
        cdnLimit: 10240,
    },
}
