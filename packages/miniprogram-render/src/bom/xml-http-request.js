const Location = require('./location')
const EventTarget = require('../event/event-target')

const SUPPORT_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT']
const STATUS_TEXT_MAP = {
    100: 'Continue',
    101: 'Switching protocols',

    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',

    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',

    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Suitable',
    417: 'Expectation Failed',

    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
}

class XMLHttpRequest extends EventTarget {
    constructor(window) {
        super()

        this.$_window = window
        this.$_method = ''
        this.$_url = ''
        this.$_data = null
        this.$_status = 0
        this.$_statusText = ''
        this.$_readyState = XMLHttpRequest.UNSENT
        this.$_header = {
            Accept: '*/*'
        }
        this.$_responseType = ''
        this.$_resHeader = null
        this.$_response = null
        this.$_timeout = 0
        this.$_startTime = null
        this.$_withCredentials = true // 向前兼容，默认为 true

        this.$_requestTask = null
        this.$_requestSuccess = this.$_requestSuccess.bind(this)
        this.$_requestFail = this.$_requestFail.bind(this)
        this.$_requestComplete = this.$_requestComplete.bind(this)
    }

    /**
     * readyState 变化
     */
    $_callReadyStateChange(readyState) {
        const hasChange = readyState !== this.$_readyState
        this.$_readyState = readyState

        if (hasChange) this.$$trigger('readystatechange')
    }

    /**
     * 执行请求
     */
    $_callRequest() {
        if (!this.$_window || !this.$_window.document) {
            console.warn('this page has been unloaded, so this request will be canceled.')
            return
        }

        if (this.$_timeout) {
            this.$_startTime = +new Date()

            setTimeout(() => {
                if (!this.$_status && this.$_readyState !== XMLHttpRequest.DONE) {
                    // 超时
                    if (this.$_requestTask) this.$_requestTask.abort()
                    this.$_callReadyStateChange(XMLHttpRequest.DONE)
                    this.$$trigger('timeout')
                }
            }, this.$_timeout)
        }

        // 重置各种状态
        this.$_status = 0
        this.$_statusText = ''
        this.$_readyState = XMLHttpRequest.OPENED
        this.$_resHeader = null
        this.$_response = null

        // 补完 url
        let url = this.$_url
        url = url.indexOf('//') === -1 ? this.$_window.location.origin + url : url

        // 头信息
        const header = Object.assign({}, this.$_header)
        header.cookie = this.$_window.document.$$cookie
        if (!this.withCredentials) {
            // 不同源，要求 withCredentials 为 true 才携带 cookie
            const {origin} = Location.$$parse(url)
            if (origin !== this.$_window.location.origin) delete header.cookie
        }

        this.$_requestTask = wx.request({
            url,
            data: this.$_data || {},
            header,
            method: this.$_method,
            dataType: this.$_responseType === 'json' ? 'json' : 'text',
            responseType: this.$_responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
            success: this.$_requestSuccess,
            fail: this.$_requestFail,
            complete: this.$_requestComplete,
        })
    }

    /**
     * 请求成功
     */
    $_requestSuccess({data, statusCode, header}) {
        if (!this.$_window || !this.$_window.document) {
            console.warn('this page has been unloaded, so this request will be canceled.')
            return
        }

        this.$_status = statusCode
        this.$_resHeader = header

        this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED)

        // 处理 set-cookie
        if (this.$_window) {
            const setCookie = header['Set-Cookie']

            if (setCookie && typeof setCookie === 'string') {
                this.$_window.document.$$setCookie(setCookie)
            }
        }

        // 处理返回数据
        if (data) {
            this.$_callReadyStateChange(XMLHttpRequest.LOADING)
            this.$$trigger('loadstart')
            this.$_response = data
            this.$$trigger('loadend')
        }
    }

    /**
     * 请求失败
     */
    $_requestFail({errMsg}) {
        this.$_status = 0
        this.$_statusText = errMsg

        this.$$trigger('error')
    }

    /**
     * 请求完成
     */
    $_requestComplete() {
        this.$_startTime = null
        this.$_requestTask = null
        this.$_callReadyStateChange(XMLHttpRequest.DONE)

        if (this.$_status) {
            this.$$trigger('load')
        }
    }

    /**
     * 对外属性和方法
     */
    get timeout() {
        return this.$_timeout
    }

    set timeout(timeout) {
        if (typeof timeout !== 'number' || !isFinite(timeout) || timeout <= 0) return

        this.$_timeout = timeout
    }

    get status() {
        return this.$_status
    }

    get statusText() {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED) return ''

        return STATUS_TEXT_MAP[this.$_status + ''] || this.$_statusText || ''
    }

    get readyState() {
        return this.$_readyState
    }

    get responseType() {
        return this.$_responseType
    }

    set responseType(value) {
        if (typeof value !== 'string') return

        this.$_responseType = value
    }

    get responseText() {
        if (!this.$_responseType || this.$_responseType === 'text') {
            return this.$_response
        }

        return null
    }

    get response() {
        return this.$_response
    }

    get withCredentials() {
        return this.$_withCredentials
    }

    set withCredentials(value) {
        this.$_withCredentials = !!value
    }

    abort() {
        if (this.$_requestTask) {
            this.$_requestTask.abort()
            this.$$trigger('abort')
        }
    }

    getAllResponseHeaders() {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED || !this.$_resHeader) return ''

        return Object.keys(this.$_resHeader)
            .map(key => `${key}: ${this.$_resHeader[key]}`)
            .join('\r\n')
    }

    getResponseHeader(name) {
        if (this.$_readyState === XMLHttpRequest.UNSENT || this.$_readyState === XMLHttpRequest.OPENED || !this.$_resHeader) return null

        // 处理大小写不敏感
        const key = Object.keys(this.$_resHeader).find(item => item.toLowerCase() === name.toLowerCase())
        const value = key ? this.$_resHeader[key] : null

        return typeof value === 'string' ? value : null
    }

    open(method, url) {
        if (typeof method === 'string') method = method.toUpperCase()

        if (SUPPORT_METHOD.indexOf(method) < 0) return
        if (!url || typeof url !== 'string') return

        this.$_method = method
        this.$_url = url

        this.$_callReadyStateChange(XMLHttpRequest.OPENED)
    }

    setRequestHeader(header, value) {
        if (typeof header === 'string' && typeof value === 'string') {
            this.$_header[header] = value
        }
    }

    send(data) {
        if (this.$_readyState !== XMLHttpRequest.OPENED) return

        this.$_data = data
        this.$_callRequest()
    }
}

XMLHttpRequest.UNSENT = 0
XMLHttpRequest.OPENED = 1
XMLHttpRequest.HEADERS_RECEIVED = 2
XMLHttpRequest.LOADING = 3
XMLHttpRequest.DONE = 4

module.exports = XMLHttpRequest
