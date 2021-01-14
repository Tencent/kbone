const fs = require('fs')
const path = require('path')
const render = require('../src')

const config = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        home: [
            {regexp: '^(?:\\/home)?(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/(aaa|bbb)(?:\\/)?$', options: 'i'}
        ],
        list: [
            {regexp: '^\\/index\\/aaa\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/bbb\\/list\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
        ],
        detail: [
            {regexp: '^\\/index\\/aaa\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'},
            {regexp: '^\\/index\\/bbb\\/detail\\/([^\\/]+?)(?:\\/)?$', options: 'i'}
        ],
    },
    generate: {
        worker: true,
    },
    runtime: {
        subpackagesMap: {},
    },
    pages: {
        home: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7',
            reachBottom: true,
            reachBottomDistance: 200,
            pullDownRefresh: true
        },
        list: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7'
        },
        detail: {
            loadingText: '拼命加载页面中...',
            share: true,
            windowScroll: false,
            backgroundColor: '#F7F7F7'
        },
    },
    redirect: {
        notFound: 'home',
        accessDenied: 'home'
    },
    optimization: {
        elementMultiplexing: true,
        textMultiplexing: true,
        commentMultiplexing: true,
        domExtendMultiplexing: true,
        styleValueReduce: 1000,
        attrValueReduce: 1000,
    },
}

const html = `<div class="aa">
    <div id="bb" class="bb">
        <header>
            <div class="bb1" name="n1">123</div>
            <div class="bb2" data-a="123">321</div>
        </header>
        <div class="bb3">middle</div>
        <footer>
            <span id="bb4" class="bb4" name="n1" data-index=1>1</span>
            <span class="bb4" name="n2" data-index=2>2</span>
            <span class="bb4" data-index=3>3</span>
        </footer>
        <div>tail</div>
        <wx-component behavior="view">test wx-view</wx-component>
        <wx-component behavior="text">test wx-text</wx-component>
        <div data-key="value"></div>
    </div>
</div>`

let mockWorker
const workerTmplJs = fs.readFileSync(path.join(__dirname, '../../mp-webpack-plugin/src/tmpl/worker.tmpl.js'))
class MockWorker {
    constructor() {
        // eslint-disable-next-line no-new-func
        const func = new Function('worker', workerTmplJs + (global.workerScript || ''))
        func({
            postMessage: data => {
                if (this.cb) this.cb(data)
            },

            onMessage: cb => {
                this.workerCb = cb
            },
        })
    }

    onMessage(cb) {
        this.cb = cb
    }

    postMessage(data) {
        if (this.workerCb) this.workerCb(data)
    }

    terminate() {
        mockWorker = null
    }
}

const storageMap = {}
global.wx = {
    getSystemInfoSync() {
        return {
            language: 'zh',
            version: '7.0.0',
            brand: 'devtools',
            model: 'iPhone 6',
            platform: 'devtools',
            system: 'iOS 10.0.1',
            screenHeight: 300,
            screenWidth: 200,
            windowHeight: 280,
            windowWidth: 190,
            pixelRatio: 3,
        }
    },
    getStorageInfoSync() {
        const keys = Object.keys(storageMap)
        const currentSize = 12345

        return {keys, currentSize}
    },
    getStorageSync(key) {
        return storageMap[key]
    },
    setStorageSync(key, data) {
        storageMap[key] = data
    },
    setStorage(key, data) {
        setTimeout(() => {
            storageMap[key] = data
        }, 0)
    },
    removeStorageSync(key) {
        delete storageMap[key]
    },
    clearStorageSync() {
        Object.keys(storageMap).forEach(key => delete storageMap[key])
    },
    setNavigationBarTitle(options) {
        if (typeof global.expectTitle === 'string') expect(options.title).toBe(global.expectTitle)
    },
    redirectTo(options) {
        if (typeof global.expectWxCallMethod === 'string') expect(global.expectWxCallMethod).toBe('redirectTo')
        if (typeof global.expectPagePath === 'string') expect(options.url).toBe(global.expectPagePath)
    },
    navigateTo(options) {
        if (typeof global.expectWxCallMethod === 'string') expect(global.expectWxCallMethod).toBe('navigateTo')
        if (typeof global.expectPagePath === 'string') expect(options.url).toBe(global.expectPagePath)
    },
    getImageInfo(options) {
        setTimeout(() => {
            if (global.expectSuccess) {
                options.success({
                    width: 100,
                    height: 88,
                })
            } else {
                options.fail()
            }
        }, 10)
    },
    request(options) {
        expect(options.url).toBe(global.testXHRData.url)
        expect(options.header).toEqual(global.testXHRData.header)
        expect(options.method).toBe(global.testXHRData.method)
        expect(options.dataType).toBe(global.testXHRData.dataType)
        expect(options.responseType).toBe(global.testXHRData.responseType)

        const success = options.success
        const fail = options.fail
        const complete = options.complete

        if (global.testXHRData.res === 'fail') {
            fail({
                errMsg: 'some error',
            })
            complete()
        } else if (global.testXHRData.res === 'timeout') {
            // ignore
        } else {
            success({
                data: global.testXHRData.data,
                statusCode: 200,
                header: {
                    'Content-Type': 'application/javascript',
                },
            })
            complete()
        }
    },
    pageScrollTo(options) {
        expect(options.duration).toBe(0)
        expect(options.scrollTop).toBe(global.testScrollTop)

        global.testNextScrollTop = global.testScrollTop
    },
    createWorker() {
        if (mockWorker) throw new Error('error')
        mockWorker = new MockWorker()
        return mockWorker
    },
}

module.exports = {
    html,
    createPage(type = 'home', realUrl) {
        const route = `pages/${type}/index`
        const res = render.createPage(route, config)
        realUrl = realUrl || (type === 'home' ? '/' : type === 'list' ? '/index/aaa/list/123' : 'index/aaa/detail/123')
        res.window.$$miniprogram.init(realUrl)
        res.document.body.innerHTML = html

        return res
    },
    async sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
}
