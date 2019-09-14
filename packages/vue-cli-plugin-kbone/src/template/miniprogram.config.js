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
