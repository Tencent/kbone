/**
 * 查找符合条件的父节点
 */
export function findParent(node, filter) {
    let parentNode = node.parentNode
    while (parentNode && parentNode !== document.documentElement) {
        const test = filter(parentNode)
        if (test) return parentNode
        parentNode = parentNode.parentNode
    }

    return null
}

/**
 * requestAnimationFrame 节流
 */
let isDrawing = false
export function throttleRAF(func) {
    if (!isDrawing) {
        isDrawing = true
        requestAnimationFrame(() => {
            func()
            isDrawing = false
        })
    }
}

/**
 * 指定物理模型的渲染动画方法
 */
export function animation(physicsModel, callback, done) {
    const onFrame = (handle, model, callback, done) => {
        if (handle && handle.cancelled) return
        callback(model)
        const isDone = physicsModel.done()
        if (!isDone && !handle.cancelled) handle.id = requestAnimationFrame(onFrame.bind(null, handle, model, callback, done))
        if (isDone && done) done(model)
    }
    const cancel = handle => {
        if (handle && handle.id) cancelAnimationFrame(handle.id)
        if (handle) handle.cancelled = true
    }
    const handle = {
        id: 0,
        cancelled: false,
    }
    onFrame(handle, physicsModel, callback, done)
    return {
        cancel: cancel.bind(null, handle),
        model: physicsModel,
    }
}

/**
 * 格式化时间
 */
export function formatTime(time, reg) {
    time = time instanceof Date ? time : new Date(time)
    const map = {}
    map.yyyy = time.getFullYear()
    map.yy = map.yyyy.toString().substr(2)
    map.M = time.getMonth() + 1
    map.MM = `${map.M < 10 ? '0' : ''}${map.M}`
    map.d = time.getDate()
    map.dd = `${map.d < 10 ? '0' : ''}${map.d}`
    map.H = time.getHours()
    map.HH = `${map.H < 10 ? '0' : ''}${map.H}`
    map.m = time.getMinutes()
    map.mm = `${map.m < 10 ? '0' : ''}${map.m}`
    map.s = time.getSeconds()
    map.ss = `${map.s < 10 ? '0' : ''}${map.s}`

    return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}

/**
 * 判断两值是否相等
 */
export function isEqual(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        // 值为数值，需要考虑精度
        return parseInt(a * 1000, 10) === parseInt(b * 1000, 10)
    }

    if (typeof a === 'object' && typeof b === 'object') {
        if (a === null || b === null) return a === b

        const isAArray = Array.isArray(a)
        const isBArray = Array.isArray(b)
        if (isAArray && isBArray) {
            if (a.length !== b.length) return false
            for (let i = 0, len = a.length; i < len; i++) {
                if (!isEqual(a[i], b[i])) return false
            }
            return true
        } else if (!isBArray && !isBArray) {
            const aKeys = Object.keys(a)
            const bKeys = Object.keys(b)
            if (aKeys.length !== bKeys.length) return false
            for (const key of aKeys) {
                if (!isEqual(a[key], b[key])) return false
            }
            return true
        }
    }

    return a === b
}
