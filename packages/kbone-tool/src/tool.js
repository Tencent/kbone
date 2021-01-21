/**
 * 节流，一个同步流中只调用一次该函数
 */
const waitFuncSet = new Set()
function throttle(func) {
    return () => {
        if (waitFuncSet.has(func)) return

        waitFuncSet.add(func)

        Promise.resolve().then(() => {
            if (waitFuncSet.has(func)) {
                waitFuncSet.delete(func)
                func()
            }
        }).catch(console.error)
    }
}

module.exports = {
    throttle,
}
