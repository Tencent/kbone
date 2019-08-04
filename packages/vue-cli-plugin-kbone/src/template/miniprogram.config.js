// 配置说明：https://developers.weixin.qq.com/miniprogram/dev/extended/kbone/quickstart.html#%E7%BC%96%E5%86%99-webpack-%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
module.exports = {
    origin: '<%= options.origin.trim() %>',
    entry: '<%= options.entry.trim() %>',
    router: {
        app: [],
    },
    redirect: {
        notFound: 'app',
        accessDenied: 'app',
    },
    app: {
        navigationStyle: '<%= options.navigationStyle %>',
        <% if (options.navigationStyle === 'custom') { %>// <% } %>navigationBarTitleText: '<%= options.navigationBarTitleText %>',
        <% if (options.navigationStyle === 'custom') { %>// <% } %>navigationBarBackgroundColor: '<%= options.navigationBarBackgroundColor.trim() %>',
        <% if (options.navigationStyle === 'custom') { %>// <% } %>navigationBarTextStyle: '<%= options.navigationBarTextStyle.trim() %>',
        backgroundColor: '<%= options.backgroundColor.trim() %>',
        backgroundTextStyle: '<%= options.backgroundTextStyle %>',
        backgroundColorTop: '<%= options.backgroundColorTop.trim() %>',
        backgroundColorBottom: '<%= options.backgroundColorBottom.trim() %>',
        enablePullDownRefresh: <%= options.enablePullDownRefresh %>,
        onReachBottomDistance: <%= options.onReachBottomDistance %>,
        pageOrientation: '<%= options.pageOrientation %>',
    },
    global: {},
    pages: {},
    optimization: {
        domSubTreeLevel: <%= options.domSubTreeLevel %>,

        elementMultiplexing: <%= options.elementMultiplexing %>,
        textMultiplexing: <%= options.textMultiplexing %>,
        commentMultiplexing: <%= options.commentMultiplexing %>,
        domExtendMultiplexing: <%= options.domExtendMultiplexing %>,

        styleValueReduce: <%= options.styleValueReduce %>,
        attrValueReduce: <%= options.attrValueReduce %>,
    },
    appExtraConfig: {},
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
        cdnLimit: '<%= options.cdnLimit %>'
    },
}
