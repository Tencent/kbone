const Location = require('./location')
const cache = require('../util/cache')

const pairSplitRegExp = /(;|\n) */
function tryDecode(str, dec = decodeURIComponent) {
    try {
        return dec(str)
    } catch (e) {
        return str
    }
}

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

class Cookie {
    constructor(pageName) {
        const config = cache.getConfig()
        const runtime = config.runtime || {}
        this.cookieStore = runtime.cookieStore
        this.$_pageName = pageName

        if (this.cookieStore !== 'storage' && this.cookieStore !== 'memory') {
            // 需要全局共享
            this.$_map = cache.getCookie()
        } else {
            this.$_map = {} // 三维数组，domain - path - key
        }
    }

    static parse(cookieStr) {
        if (!cookieStr && typeof cookieStr !== 'string') return null

        // key-value
        let key = null
        let value = null

        // 其他字段
        let path = null
        let domain = null
        let expires = null
        let maxAge = null
        let secure = false
        let httpOnly = false

        const pairs = cookieStr.split(pairSplitRegExp)
        pairs.forEach((pair) => {
            let [k, v] = pair.split('=')
            if (!fieldContentRegExp.test(k)) return
            k = (k || '').trim().toLowerCase()
            v = tryDecode((v || '').trim())


            if (k === '') { return }

            switch (k) {
            case 'path':
                if (v[0] === '/') { path = v }
                break
            case 'domain':
                v = v.replace(/^\./, '').toLowerCase()
                if (v) { domain = v }
                break
            case 'expires':
                if (v) {
                    const timeStamp = Date.parse(v)
                    if (timeStamp) { expires = timeStamp }
                }
                break
            case 'max-age':
                if (/^-?[0-9]+$/.test(v)) { maxAge = +v * 1000 }
                break
            case 'secure':
                secure = true
                break
            case 'httponly':
                httpOnly = true
                break
            default:
                if (pair.indexOf('=') > 0) {
                    key = k
                    value = v
                }
                // ignore
                break
            }
        })

        if (!key || key === '') { return null }

        return {
            key, value, path, domain, expires, maxAge, secure, httpOnly
        }
    }

    /**
     * 判断 domain
     */
    $_checkDomain(host, cookieDomain) {
        if (host === cookieDomain) return true

        const index = host.indexOf(`.${cookieDomain}`)

        return index > 0 && cookieDomain.length + index + 1 === host.length
    }

    /**
     * 判断 path
     */
    $_checkPath(path, cookiePath) {
        if (path === cookiePath) return true

        cookiePath = cookiePath === '/' ? '' : cookiePath
        return path.indexOf(`${cookiePath}/`) === 0
    }

    /**
     * 判断过期
     */
    $_checkExpires(cookie) {
        const now = Date.now()

        // maxAge 优先
        if (cookie.maxAge !== null) return cookie.createTime + cookie.maxAge > now

        // 判断 expires
        if (cookie.expires !== null) return cookie.expires > now

        return true
    }

    /**
     * 设置 cookie
     */
    setCookie(cookie, url) {
        cookie = Cookie.parse(cookie)

        if (!cookie) return

        const {hostname, port, pathname} = Location.$$parse(url)
        const host = ((hostname || '') + (port ? ':' + port : '')) || ''
        const path = (pathname || '')[0] === '/' ? pathname : '/'

        if (cookie.domain) {
            // 判断 domain
            if (!this.$_checkDomain(host, cookie.domain)) return
        } else {
            // 使用 host 作为默认的 domain
            cookie.domain = host
        }

        // 需要设置 path 字段的情况，取 url 中除去最后一节的 path
        if (!cookie.path || cookie.path[0] !== '/') {
            const lastIndex = path.lastIndexOf('/')

            cookie.path = lastIndex === 0 ? path : path.substr(0, lastIndex)
        }

        // 存入 cookie
        const map = this.$_map
        const cookieDomain = cookie.domain
        const cookiePath = cookie.path
        const cookieKey = cookie.key

        if (!map[cookieDomain]) map[cookieDomain] = {}
        if (!map[cookieDomain][cookiePath]) map[cookieDomain][cookiePath] = {}

        const oldCookie = map[cookieDomain][cookiePath][cookieKey]
        cookie.createTime = oldCookie && oldCookie.createTime || Date.now()

        if (this.$_checkExpires(cookie)) {
            // 未过期
            map[cookieDomain][cookiePath][cookieKey] = cookie
        } else if (oldCookie) {
            // 存在旧 cookie，且被设置为已过期
            delete map[cookieDomain][cookiePath][cookieKey]
        }

        // 持久化 cookie
        if (this.cookieStore !== 'memory' && this.cookieStore !== 'globalmemory') {
            const key = this.cookieStore === 'storage' ? `PAGE_COOKIE_${this.$_pageName}` : 'PAGE_COOKIE'
            wx.setStorage({
                key,
                data: this.serialize(),
            })
        }
    }

    /**
     * 拉取 cookie
     */
    getCookie(url, includeHttpOnly) {
        const {
            protocol, hostname, port, pathname
        } = Location.$$parse(url)
        const host = ((hostname || '') + (port ? ':' + port : '')) || ''
        const path = (pathname || '')[0] === '/' ? pathname : '/'
        const res = []

        const map = this.$_map
        const domainList = Object.keys(map)

        for (const domainItem of domainList) {
            // 判断 domain
            if (this.$_checkDomain(host, domainItem)) {
                const domainMap = map[domainItem] || {}
                const pathList = Object.keys(domainMap)

                for (const pathItem of pathList) {
                    // 判断 path
                    if (this.$_checkPath(path, pathItem)) {
                        const pathMap = map[domainItem][pathItem] || {}

                        Object.keys(pathMap).forEach(key => {
                            const cookie = pathMap[key]

                            if (!cookie) return

                            // 判断协议
                            if (cookie.secure && protocol !== 'https:' && protocol !== 'wss:') return
                            if (!includeHttpOnly && cookie.httpOnly && protocol && protocol !== 'http:') return

                            // 判断过期
                            if (this.$_checkExpires(cookie)) {
                                res.push(cookie)
                            } else {
                                // 过期，删掉
                                delete map[domainItem][pathItem][key]
                            }
                        })
                    }
                }
            }
        }

        return res
            .sort((a, b) => {
                const gap = a.createTime - b.createTime

                if (!gap) {
                    return a.key < b.key ? -1 : 1
                } else {
                    return gap
                }
            })
            .map(cookie => `${cookie.key}=${cookie.value}`)
            .join('; ')
    }

    /**
     * 序列化
     */
    serialize() {
        try {
            return JSON.stringify(this.$_map)
        } catch (err) {
            console.log('cannot serialize the cookie')
            return ''
        }
    }

    /**
     * 反序列化
     */
    deserialize(str) {
        let map = {}
        try {
            map = JSON.parse(str)
        } catch (err) {
            console.log('cannot deserialize the cookie')
            map = {}
        }

        // 合并 cookie
        const domainList = Object.keys(map)

        for (const domainItem of domainList) {
            const domainMap = map[domainItem] || {}
            const pathList = Object.keys(domainMap)

            for (const pathItem of pathList) {
                const pathMap = map[domainItem][pathItem] || {}

                Object.keys(pathMap).forEach(key => {
                    const cookie = pathMap[key]

                    if (!cookie) return

                    // 已存在则不覆盖
                    if (!this.$_map[domainItem]) this.$_map[domainItem] = {}
                    if (!this.$_map[domainItem][pathItem]) this.$_map[domainItem][pathItem] = {}
                    if (!this.$_map[domainItem][pathItem][key]) this.$_map[domainItem][pathItem][key] = cookie
                })
            }
        }
    }
}

module.exports = Cookie
