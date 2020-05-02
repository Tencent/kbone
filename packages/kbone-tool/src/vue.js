window.$$global.__KBONE_TOOL_CACHE__ = window.$$global.__KBONE_TOOL_CACHE__ || {
    OBSERVER_CACHE: {},
}

const globalCache = window.$$global.__KBONE_TOOL_CACHE__
const OBSERVER_CACHE = globalCache.OBSERVER_CACHE
const defineProperty = Object.defineProperty

/**
 * 设置标志位
 */
function setFlag(obj, key, val) {
    defineProperty(obj, key, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: val,
    })
}

/**
 * 当在 vue 中使用全局状态（如 vuex）的时候使用，对 Object.defineProperty 进行封装
 */
function useGlobal() {
    const pageId = document.$$pageId

    Object.defineProperty = function(obj, key, descriptor) {
        if (obj === undefined || obj === null) return defineProperty(obj, key, descriptor)
        if (key === '__ob__') {
            // 处理 __ob__
            descriptor.set = function(val) {
                OBSERVER_CACHE[pageId] = OBSERVER_CACHE[pageId] || new WeakMap()
                OBSERVER_CACHE[pageId].set(obj, val)

                // 修改通知方法，让其通知到所有页面
                if (!val.dep._notify) val.dep._notify = val.dep.notify
                val.dep.notify = function() {
                    Object.keys(OBSERVER_CACHE).forEach(pageId => {
                        if (!OBSERVER_CACHE[pageId]) return

                        const ob = OBSERVER_CACHE[pageId].get(obj)
                        if (ob) ob.dep._notify()
                    })
                }
            }
            descriptor.get = function() {
                // 不同页面获取 __ob__ 属性，可以获取到原本该页面定义的 observer
                if (OBSERVER_CACHE[pageId]) return OBSERVER_CACHE[pageId].get(obj)
                return null
            }
            if (descriptor.value) {
                descriptor.set(descriptor.value)
                delete descriptor.value
                delete descriptor.writable
            }
            setFlag(obj, '__kbone_ob__', true)
            return defineProperty(obj, key, descriptor)
        } else {
            return defineProperty(obj, key, descriptor)
        }
    }
}

// 页面删除时清除缓存
window.addEventListener('wxunload', () => {
    const pageId = document.$$pageId

    // 删除页面上的 observer
    OBSERVER_CACHE[pageId] = null
})

module.exports = {
    useGlobal,
}
