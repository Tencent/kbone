/**
 * 受限于小程序环境，不支持 data url 和 options 参数
 */
const Event = require('../event/event')
const EventTarget = require('../event/event-target')
const cache = require('../util/cache')

let wxWorker = null
let wxWorkerPath = null
let callbackList = []
let sharedWorkerInstCount = 0
const workerMap = {}
const sharedWorkerMap = {}

/**
 * 获取 worker 所在目录
 */
function getWorkersDir() {
    const config = cache.getConfig()
    const generate = config.generate
    return generate && generate.worker
}

/**
 * 获取 worker 路径
 */
function getWorkerUrl(url) {
    const fileName = url.split('/').pop()
    return getWorkersDir() + '/' + fileName
}

/**
 * 监听 worker 消息回调
 */
function onWorkerMessage(worker, callback) {
    callbackList.push(callback)
    if (!worker._hasRegisterCb) {
        worker.onMessage(res => {
            callbackList.forEach(func => func(res))
        })
        worker._hasRegisterCb = true
    }
}

class Worker extends EventTarget {
    constructor(url, window, isSharedWorker) {
        super()

        const filePath = getWorkerUrl(url)

        if (wxWorker) {
            // 小程序只允许创建一个 worker 实例
            if (!isSharedWorker || (filePath !== wxWorkerPath)) throw new Error('exceed max concurrent workers limit')
        }

        this.$_pageId = window.$_pageId
        this.isSharedWorker = isSharedWorker
        wxWorkerPath = filePath
        wxWorker = wxWorker || this.$_tryCatch(() => wx.createWorker(wxWorkerPath))

        if (wxWorker) {
            this.$_onMessage = res => {
                if (res.type === 'message' && res.pageId === this.$_pageId) {
                    this.$$trigger('message', {
                        event: new Event({
                            name: 'message',
                            target: this,
                            $$extra: {
                                data: res.data,
                            },
                        })
                    })
                }
            }
            onWorkerMessage(wxWorker, this.$_onMessage)

            const navigator = {}
            const location = {}
            if (window && !isSharedWorker) {
                ['userAgent', 'appCodeName', 'appName', 'language', 'languages', 'platform', 'product'].forEach(key => navigator[key] = window.navigator[key]);
                ['protocol', 'host', 'hostname', 'port', 'origin', 'pathname', 'search', 'hash', 'href'].forEach(key => location[key] = window.location[key])
            }
            this.$_tryCatch(() => wxWorker.postMessage({
                type: 'connect', pageId: this.$_pageId, navigator, location
            }))
        }

        if (!this.isSharedWorker) workerMap[this.$_pageId] = this
    }

    /**
     * 处理方法的 try catch 调用
     */
    $_tryCatch(func) {
        try {
            return func.call(this)
        } catch (error) {
            console.error(error)
            this.$$trigger('error', {
                event: new Event({
                    name: 'error',
                    target: this,
                    $$extra: {
                        error,
                        message: error.message || '',
                        filename: wxWorkerPath,
                    }
                })
            })
        }
    }

    /**
     * 对外属性和方法
     */
    postMessage(data) {
        if (this.$_pageId && wxWorker) this.$_tryCatch(() => wxWorker.postMessage({type: 'message', pageId: this.$_pageId, data}))
    }

    terminate() {
        if (this.$_pageId && wxWorker) {
            this.$_pageId = null
            if (!this.isSharedWorker) delete workerMap[this.$_pageId]
            this.$_tryCatch(() => wxWorker.terminate())
            wxWorker = null
            wxWorkerPath = null
            callbackList = []
        }
    }
}

class SharedWorker extends EventTarget {
    constructor(url, window) {
        super()

        const pageId = window.$_pageId
        this.$_worker = new Worker(url, window, true)
        this.$_worker.close = () => {
            sharedWorkerInstCount--
            callbackList.splice(callbackList.indexOf(this.$_worker.$_onMessage), 1)
            if (!sharedWorkerInstCount) this.$_worker.terminate()
            if (sharedWorkerMap[pageId]) sharedWorkerMap[pageId].splice(sharedWorkerMap[pageId].indexOf(this), 1)
        }
        this.$_worker.start = () => {}
        sharedWorkerInstCount++
        sharedWorkerMap[pageId] = sharedWorkerMap[pageId] || []
        sharedWorkerMap[pageId].push(this)
    }

    /**
     * 对外属性和方法
     */
    get port() {
        return this.$_worker
    }
}

/**
 * 页面删除
 */
function destroy(pageId) {
    if (sharedWorkerMap[pageId]) sharedWorkerMap[pageId].forEach(sharedWorker => sharedWorker.port.close())
    sharedWorkerMap[pageId] = null
    if (workerMap[pageId]) workerMap[pageId].terminate()
    workerMap[pageId] = null
}


module.exports = {
    Worker,
    SharedWorker,
    destroy,
}
