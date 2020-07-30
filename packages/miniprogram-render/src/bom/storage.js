const Event = require('../event/event')
const cache = require('../util/cache')

class Storage {
    constructor(window) {
        this.$_window = window
        this.$_keys = []
    }

    /**
     * 触发 window 的 storage 事件
     */
    $_triggerStorage(key, newValue, oldValue, force) {
        if (!force && newValue === oldValue) return

        const windowList = cache.getWindowList() || []
        windowList.forEach(window => {
            if (window && window !== this.$_window) {
                window.$$trigger('storage', {
                    event: new Event({
                        name: 'storage',
                        target: window,
                        $$extra: {
                            key,
                            newValue,
                            oldValue,
                            storageArea: this,
                            url: this.$_window.location.href,
                        }
                    })
                })
            }
        })
    }

    /**
     * 对外属性和方法
     */
    get length() {
        return this.$_keys && this.$_keys.length || 0
    }

    key(num) {
        if (typeof num !== 'number' || !isFinite(num) || num < 0) return null
        return this.$_keys[num] || null
    }
}

class SessionStorage extends Storage {
    constructor(window) {
        super(window)
        this.$_map = {}
    }

    /**
     * 对外属性和方法
     */
    getItem(key) {
        if (!key || typeof key !== 'string') return null
        return this.$_map[key] || null
    }

    setItem(key, data) {
        if (!key || typeof key !== 'string') return
        data = '' + data

        const oldValue = this.$_map[key] || null
        this.$_map[key] = data

        // 调整顺序
        const index = this.$_keys.indexOf(key)
        if (index >= 0) this.$_keys.splice(index, 1)
        this.$_keys.push(key)

        this.$_triggerStorage(key, data, oldValue)
    }

    removeItem(key) {
        if (!key || typeof key !== 'string') return

        const oldValue = this.$_map[key] || null
        delete this.$_map[key]

        // 删除 key
        const index = this.$_keys.indexOf(key)
        if (index >= 0) this.$_keys.splice(index, 1)

        this.$_triggerStorage(key, null, oldValue)
    }

    clear() {
        this.$_map = {}
        this.$_keys.length = 0
        this.$_triggerStorage(null, null, null, true)
    }
}

class LocalStorage extends Storage {
    /**
     * 更新 storage 信息
     */
    $_updateInfo() {
        try {
            const info = wx.getStorageInfoSync()
            const windowList = cache.getWindowList() || []
            windowList.forEach(window => {
                if (window) {
                    window.localStorage.$$keys = info.keys
                }
            })
        } catch (err) {
            console.warn('getStorageInfoSync fail')
        }
    }

    set $$keys(keys) {
        this.$_keys = keys
    }

    /**
     * 对外属性和方法
     */

    getItem(key) {
        if (!key || typeof key !== 'string') return null

        return wx.getStorageSync(key) || null
    }

    setItem(key, data) {
        if (!key || typeof key !== 'string') return
        data = '' + data

        const oldValue = wx.getStorageSync(key) || null

        wx.setStorageSync(key, data)
        this.$_updateInfo()
        this.$_triggerStorage(key, data, oldValue)
    }

    removeItem(key) {
        if (!key || typeof key !== 'string') return

        const oldValue = wx.getStorageSync(key) || null

        wx.removeStorageSync(key)
        this.$_updateInfo()
        this.$_triggerStorage(key, null, oldValue)
    }

    clear() {
        wx.clearStorageSync()
        this.$_updateInfo()
        this.$_triggerStorage(null, null, null, true)
    }
}

module.exports = {
    SessionStorage,
    LocalStorage,
}
