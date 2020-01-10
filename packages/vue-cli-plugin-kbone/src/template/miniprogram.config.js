module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '<%= options.entry.trim() %>',
    router: <%- options.router.trim() %>,
    redirect: {
        notFound: 'app',
        accessDenied: 'app',
    },
    generate: {
        app: '<%= options.app.trim() %>',
        appWxss: '<%= options.appWxss.trim() %>',
        autoBuildNpm: <%- options.autoBuildNpm %>,
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
        rem: <%= options.rem %>,
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
        appid: '<%= options.appid.trim() %>',
        projectname: '<%= options.projectName.trim() %>',
    },
    packageConfig: {
        name: '<%= options.projectName.trim() %>',
    },
    // vue-cli 相关配置
    vue: {
        entryFileName: '<%= options.entryFileName %>',
        cdnPath: '<%= options.cdnPath %>',
        cdnLimit: <%= options.cdnLimit %>,
    },
}
