import './app.css'

App({
    onLaunch(options) {
        console.log('App.onLaunch --> ', options)
    },
    onShow(options) {
        console.log('App.onShow --> ', options)
        const pages = getCurrentPages() || []
        const currentPage = pages[pages.length - 1]
        if (currentPage) console.log('currentPage --> ', currentPage.pageId)
    },
    onHide() {
        console.log('App.onHide --> ')
        const pages = getCurrentPages() || []
        const currentPage = pages[pages.length - 1]
        if (currentPage) console.log('currentPage --> ', currentPage.pageId)
    },
    onError(err) {
        console.log('App.onError --> ', err)
    },
    onPageNotFound(options) {
        console.log('App.onPageNotFound --> ', options)
    },
    onUnhandledRejection(options) {
        console.log('App.onUnhandledRejection --> ', options)
    },
    onThemeChange(options) {
        console.log('App.onThemeChange --> ', options)
    },
})
