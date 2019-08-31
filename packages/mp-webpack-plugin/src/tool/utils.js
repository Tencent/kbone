/**
 * 深合并对象
 */
function merge(to, from) {
    if (typeof to !== 'object' || typeof from !== 'object') return to

    const fromKeys = Object.keys(from)
    for (const key of fromKeys) {
        const fromValue = from[key]
        const fromType = typeof fromValue
        const isFromArray = +Array.isArray(fromValue)
        const toValue = to[key]
        const toType = typeof toValue
        const isToArray = +Array.isArray(toValue)

        // eslint-disable-next-line no-bitwise
        if (fromType !== toType || (isFromArray ^ isToArray)) {
            // 不同类型
            to[key] = fromValue
        } else {
            // 相同类型
            // eslint-disable-next-line no-lonely-if
            if (isFromArray) {
                fromValue.forEach(item => toValue.push(item))
            } else if (fromType === 'object') {
                to[key] = merge(toValue, fromValue)
            } else {
                to[key] = fromValue
            }
        }
    }

    return to
}

/**
 * 判断数组包含关系
 */
function includes(parentArr, childArr) {
    for (const child of childArr) {
        if (parentArr.indexOf(child) === -1) return false
    }

    return true
}

module.exports = {
    merge,
    includes,
}
