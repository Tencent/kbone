App({
    onError(err) {
        const pages = getCurrentPages() || []
        const currentPage = pages[pages.length - 1]
        if (currentPage && currentPage.window) {
            currentPage.window.$$trigger('error', {
                event: err,
            })
        }
    }
})
