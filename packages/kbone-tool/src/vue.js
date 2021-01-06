window.$$global.__KBONE_TOOL_CACHE__ = window.$$global.__KBONE_TOOL_CACHE__ || {
    hasWrapDefineProperty: false,
    OBSERVER_CACHE: {},
}

const globalCache = window.$$global.__KBONE_TOOL_CACHE__
const OBSERVER_CACHE = globalCache.OBSERVER_CACHE
const defineProperty = Object.defineProperty

/**
 * 当在 vue 中使用全局状态（如 vuex）的时候使用，对 Object.defineProperty 进行封装
 */
function useGlobal() {
    // 页面删除时清除缓存
    window.addEventListener('wxunload', () => {
        // 删除页面上的 observer
        OBSERVER_CACHE[document.$$pageId] = null
    })

    if (globalCache.hasWrapDefineProperty) return

    Object.defineProperty = function(obj, key, descriptor) {
        if (obj === undefined || obj === null) return defineProperty(obj, key, descriptor)
        if (key === '__ob__' && descriptor.value) {
            // 处理 __ob__
            const property = Object.getOwnPropertyDescriptor(obj, key)
            const getter = property && property.get
            const setter = property && property.set
            const ob = descriptor.value

            if (!setter) {
                descriptor.set = function(val) {
                    // 默认作为栈顶页面的 observer 存入
                    const pages = getCurrentPages()
                    const page = pages[pages.length - 1]
                    const pageId = page && page.document && page.document.$$pageId

                    OBSERVER_CACHE[pageId] = OBSERVER_CACHE[pageId] || new WeakMap()
                    OBSERVER_CACHE[pageId].set(obj, val)

                    // 修改通知方法，让其通知到所有页面
                    if (!val.dep._notify) {
                        val.dep._notify = val.dep.notify
                        val.dep.notify = function() {
                            Object.keys(OBSERVER_CACHE).forEach(pageId => {
                                if (!OBSERVER_CACHE[pageId]) return

                                const ob = OBSERVER_CACHE[pageId].get(obj)
                                if (ob) ob.dep._notify()
                            })
                        }
                    }
                }
            }
            if (!getter) {
                descriptor.get = function() {
                    // 默认获取栈顶页面的 observer
                    const pages = getCurrentPages()
                    const page = pages[pages.length - 1]
                    const pageId = page && page.document && page.document.$$pageId
                    if (pageId && OBSERVER_CACHE[pageId]) return OBSERVER_CACHE[pageId].get(obj)
                    return null
                }
            }

            delete descriptor.value
            delete descriptor.writable
            const res = defineProperty(obj, key, descriptor)
            obj[key] = ob
            return res
        } else {
            return defineProperty(obj, key, descriptor)
        }
    }

    globalCache.hasWrapDefineProperty = true
}

module.exports = {
    useGlobal,
}
