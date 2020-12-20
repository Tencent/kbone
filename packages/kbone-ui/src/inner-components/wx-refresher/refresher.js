/**
 * 监听拖动手势
 */
function onTouchPan({
    element,
    onPanMove,
    onPanEnd,
}) {
    let touchId
    let lastY
    let startX
    let startY
    let locked = false

    function cancelTouch() {
        startX = undefined
        startY = undefined
        lastY = undefined
        touchId = undefined
    }

    function calcMovement(evt) {
        const touch = Array.prototype.slice.call(evt.changedTouches).filter(touch => touch.identifier === touchId)[0]
        if (!touch) return false

        evt.distX = Math.abs(touch.screenX - startX)
        evt.distY = Math.abs(touch.screenY - startY)

        evt.deltaY = touch.screenY - lastY
        lastY = touch.screenY

        return true
    }

    function touchstart(evt) {
        if (locked) return
        const touch = evt.changedTouches[0]
        touchId = touch.identifier
        startX = touch.screenX
        startY = touch.screenY
        lastY = touch.screenY
    }

    function touchmove(evt) {
        if (locked) return
        if (calcMovement(evt)) onPanMove(evt, cancelTouch)
    }

    function touchend(evt) {
        if (locked) return
        if (calcMovement(evt)) onPanEnd(evt, cancelTouch)
    }

    function touchcancel(evt) {
        if (calcMovement(evt)) onPanEnd(evt, cancelTouch)
    }

    element.addEventListener('touchstart', touchstart)
    if (onPanMove) element.addEventListener('touchmove', touchmove, {passive: false})
    if (onPanEnd) {
        element.addEventListener('touchend', touchend, {passive: false})
        element.addEventListener('touchcancel', touchcancel, {passive: false})
    }

    return {
        /**
         * 锁定元素，禁止触发拖动事件监听
         */
        updateLock(value) {
            locked = value
        },

        /**
         * 解放元素
         */
        dispose: () => {
            element.removeEventListener('touchstart', touchstart)
            if (onPanMove) element.removeEventListener('touchmove', touchmove, {passive: false})
            if (onPanEnd) {
                element.removeEventListener('touchend', touchend, {passive: false})
                element.removeEventListener('touchcancel', touchcancel, {passive: false})
            }
        }
    }
}

/**
 * easeOut 类型圆形曲线缓动 sqrt(1 - t^2)
 */
function easeOutCirc(pos) {
    const p = 1 - ((pos - 1) ** 2)
    return Math.sqrt(p < 0 ? 0 : p)
}

function frictionFactor(overscrollFraction) {
    return 0.52 * ((1 - overscrollFraction) ** 2)
}

export default function refresher(opts) {
    opts = Object.assign({threshold: 60}, opts)

    const {
        container,
        parentNode,
        contentNode,
        scrollerNode,
        onPulling,
        onRefresh,
        onRestore,
        onAbort,
    } = opts
    let {
        threshold,
    } = opts

    const dimension = parentNode.getBoundingClientRect().height || window.screen.height
    if (container) {
        container.style.position = 'absolute'
        container.style.height = window.screen.height + 'px'
        container.style.top = -1 * window.screen.height + 'px'
    }

    let state
    let animating = false
    let y = 0

    /**
     * 执行滑动动画
     */
    let animationId = null
    const animateToY = (from, to, time, animationFunc, cb) => {
        if (animationId) animationId = window.cancelAnimationFrame(animationId)

        let start = null
        const dir = to < from ? -1 : 1
        const distance = Math.abs(to - from)
        if (time === 0) return
        const loop = (t) => {
            if (!start) start = t

            const dt = (t - start) / time
            const progress = easeOutCirc(dt > 1 ? 1 : dt)
            const y = Math.floor(from + dir * progress * distance)

            animationFunc(y)

            if (Math.abs(y - from) >= distance) {
                if (typeof cb === 'function') cb(y)
                animationId = null
                return
            }
            animationId = window.requestAnimationFrame(loop)
        }
        animationId = window.requestAnimationFrame(loop)
    }

    /**
     * 执行刷新动画
     */
    const runRefreshingAnimation = () => {
        animateToY(y, threshold, 300, endY => {
            container.style.transform = `translateY(${y}px)`
            contentNode.style.transform = y ? `translateY(${y}px)` : ''
            y = endY
        })
    }

    /**
     * 执行恢复动画
     */
    const runRestoringAnimation = () => new Promise((resolve) => {
        animateToY(y, 0, 200, y => {
            container.style.transform = `translateY(${y}px)`
            contentNode.style.transform = y ? `translateY(${y}px)` : ''
        }, endY => {
            y = endY
            resolve()
        })
    })

    /**
     * 处理刷新
     */
    const doRefresh = () => {
        state = 'refreshing'
        onRefresh(y)
        runRefreshingAnimation()
    }

    /**
     * 开始下拉
     */
    function triggerOpen() {
        if (state) return

        state = 'pulling'
        animateToY(0, threshold, 400, y => {
            container.style.transform = `translateY(${y}px)`
            contentNode.style.transform = y ? `translateY(${y}px)` : ''
            onPulling(y)
        }, endY => {
            y = endY
            animating = false
            doRefresh()
        })
    }

    /**
     * 结束下拉
     */
    function triggerClose() {
        if (state === 'restoring' || !state) return

        state = 'restoring'
        onRestore(y)

        animating = true
        runRestoringAnimation().then(() => {
            state = null
            animating = false
        }).catch(console.error)
    }

    const panHandlers = onTouchPan({
        element: scrollerNode,
        onPanMove: (evt, cancelTouch) => {
            const dy = evt.deltaY

            if (scrollerNode.scrollTop > 0 || animating || (dy < 0 && !state) || (state === 'aborting' || state === 'restoring')) return // 判断拖动状态
            if (evt.distY < evt.distX || evt.distY < 5) return // 判断拖动距离    

            if (!state) state = 'pulling'

            // 处理和 wx-scroll-view 的冲突
            if (evt.cancelable && (state === 'pulling' || state === 'refreshing' || state === 'reached')) evt.preventDefault()

            // 判断恢复
            if (state === 'refreshing' && dy < -10) {
                state = 'restoring'
                onRestore(y)

                runRestoringAnimation().then(() => {
                    state = null
                    animating = false
                    cancelTouch()
                }).catch(console.error)
                return
            }

            // 处理摩擦力
            const f = frictionFactor(Math.min(y / dimension, 1))
            y += Math.ceil(dy * f)

            // 判断阈值
            if (state !== 'refreshing' && (y >= threshold && state !== 'reached' || y < threshold && state !== 'pulling')) {
                state = state === 'reached' ? 'pulling' : 'reached'
            }

            if (animationId) animationId = window.cancelAnimationFrame(animationId)

            if (state !== 'refreshing') onPulling(y)
            container.style.transform = y ? `translateY(${y}px)` : ''
            contentNode.style.transform = y ? `translateY(${y}px)` : ''
        },
        onPanEnd: (_, cancelTouch) => {
            if (state === null || animating) return

            if (state === 'refreshing') {
                runRefreshingAnimation()
                return
            }

            if (state === 'pulling') {
                // 判断中断
                state = 'aborting'
                onAbort(y)

                animating = true
                animateToY(y, 0, 300, y => {
                    container.style.transform = `translateY(${y}px)`
                    contentNode.style.transform = y ? `translateY(${y}px)` : ''
                }, endY => {
                    y = endY
                    state = null
                    animating = false
                    cancelTouch()
                })
            } else if (state === 'reached') {
                // 到达阈值，处理刷新
                doRefresh(cancelTouch)
            }
        },
    })

    return {
        ...panHandlers,

        /**
         * 更新阈值
         */
        updateThreshold(_threshold) {
            threshold = _threshold
        },

        triggerOpen,
        triggerClose,
    }
}
