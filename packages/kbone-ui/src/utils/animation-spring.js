/**
 * 带误差的相等判断
 */
const almostEqual = (a, b) => (a > (b - 0.4)) && (a < (b + 0.4))

/**
 * 参考：https://www.stewartcalculus.com/data/CALCULUS%20Concepts%20and%20Contexts/upfiles/3c3-AppsOf2ndOrders_Stu.pdf
 */
class Spring {
    constructor(mass, springConstant, damping) {
        this._m = mass
        this._k = springConstant
        this._c = damping
        this._solution = null
        this._endPosition = 0
        this._startTime = 0
    }

    solve(initial, velocity) {
        if (!initial) {
            return {x: () => 0, dx: () => 0}
        }

        // 牛顿第二定律：f = ma = m * (d^2(x) / d(t^2))
        // 胡克定律：f弹 = -kx
        // 阻尼力：f阻 = -cv = -c * (dx / dt)
        // 因为 f = f弹 + f阻，得 m * (d^2(x) / d(t^2)) + c * (dx / dt) + kx = 0
        // 简化得：mx“ + cx' + kx = 0
        const c = this._c
        const m = this._m
        const k = this._k
        // 解二阶常系数齐次线性微分方程：r = (-c +/- sqrt(c^2 - 4mk)) / 2m
        const cmk = c * c - 4 * m * k
        if (!cmk) {
            // c^2 - 4mk = 0，临界阻尼
            // x = (c1 + c2 * t) * e^(r * t)
            const r = -c / (2 * m)
            const c1 = initial
            const c2 = velocity / (r * initial)
            return {
                x: t => (c1 + c2 * t) * (Math.E ** (r * t)),
                dx: t => {
                    const pow = Math.E ** (r * t)
                    return r * (c1 + c2 * t) * pow + c2 * pow
                },
            }
        } else if (cmk > 0) {
            // c^2 - 4mk > 0，过阻尼
            // x = c1 * e^(r1 * t) + c2 * e^(r2 * t)
            const r1 = (-c - Math.sqrt(cmk)) / (2 * m)
            const r2 = (-c + Math.sqrt(cmk)) / (2 * m)
            const c2 = (velocity - r1 * initial) / (r2 - r1)
            const c1 = initial - c2

            return {
                x: t => {
                    let powER1T
                    let powER2T
                    if (t === this._t) {
                        powER1T = this._powER1T
                        powER2T = this._powER2T
                    }

                    this._t = t

                    if (!powER1T) powER1T = this._powER1T = Math.E ** (r1 * t)
                    if (!powER2T) powER2T = this._powER2T = Math.E ** (r2 * t)

                    return c1 * powER1T + c2 * powER2T
                },
                dx: t => {
                    let powER1T
                    let powER2T
                    if (t === this._t) {
                        powER1T = this._powER1T
                        powER2T = this._powER2T
                    }

                    this._t = t

                    if (!powER1T) powER1T = this._powER1T = Math.E ** (r1 * t)
                    if (!powER2T) powER2T = this._powER2T = Math.E ** (r2 * t)

                    return c1 * r1 * powER1T + c2 * r2 * powER2T
                }
            }
        } else {
            // c^2 - 4mk < 0，欠阻尼
            // w = sqrt(4 * m * k - c^2) / (2 * m)
            // r = -c / (2 * m)
            // x = e^(r * t) * (c1 * cos(w * t) + c2 * sin(w * t))
            const w = Math.sqrt(4 * m * k - c * c) / (2 * m)
            const r = -(c / 2 * m)
            const c1 = initial
            const c2 = (velocity - r * initial) / w

            return {
                x: t => (Math.E ** (r * t)) * (c1 * Math.cos(w * t) + c2 * Math.sin(w * t)),
                dx: t => {
                    const power = Math.E ** (r * t)
                    const cos = Math.cos(w * t)
                    const sin = Math.sin(w * t)
                    return power * (c2 * w * cos - c1 * w * sin) + r * power * (c2 * sin + c1 * cos)
                }
            }
        }
    }

    x(dt) {
        if (dt === undefined) dt = (Date.now() - this._startTime) / 1000
        return this._solution ? this._endPosition + this._solution.x(dt) : 0
    }

    dx(dt) {
        if (dt === undefined) dt = (Date.now() - this._startTime) / 1000
        return this._solution ? this._solution.dx(dt) : 0
    }

    setEnd(x, velocity, t) {
        if (!t) t = Date.now()
        if (x === this._endPosition && almostEqual(velocity, 0)) return
        velocity = velocity || 0
        let position = this._endPosition
        if (this._solution) {
            if (almostEqual(velocity, 0)) velocity = this._solution.dx((t - this._startTime) / 1000)
            position = this._solution.x((t - this._startTime) / 1000)
            if (almostEqual(velocity, 0)) velocity = 0
            if (almostEqual(position, 0)) position = 0
            position += this._endPosition
        }
        if (this._solution && almostEqual(position - x, 0) && almostEqual(velocity, 0)) {
            return
        }
        this._endPosition = x
        this._solution = this.solve(position - this._endPosition, velocity)
        this._startTime = t
    }

    snap(x) {
        this._startTime = Date.now()
        this._endPosition = x
        this._solution = {
            x: () => 0,
            dx: () => 0,
        }
    }

    done(t) {
        if (!t) t = Date.now()
        return almostEqual(this.x(), this._endPosition) && almostEqual(this.dx(), 0)
    }

    reconfigure(mass, springConstant, damping) {
        this._m = mass
        this._k = springConstant
        this._c = damping

        if (this.done()) return
        this._solution = this.solve(this.x() - this._endPosition, this.dx())
        this._startTime = Date.now()
    }

    springConstant() {
        return this._k
    }

    damping() {
        return this._c
    }

    configuration() {
        function setSpringConstant(s, c) { s.reconfigure(1, c, s.damping()) }
        function setSpringDamping(s, d) { s.reconfigure(1, s.springConstant(), d) }
        return [{
            label: 'Spring Constant',
            read: this.springConstant.bind(this),
            write: setSpringConstant.bind(this, this),
            min: 100,
            max: 1000,
        }, {
            label: 'Damping',
            read: this.damping.bind(this),
            write: setSpringDamping.bind(this, this),
            min: 1,
            max: 500,
        }]
    }
}

/**
 * 二维方向的弹性类
 */
class SpringTD {
    constructor(mass, springConstant, damping) {
        this._springX = new Spring(mass, springConstant, damping)
        this._springY = new Spring(mass, springConstant, damping)
        this._springScale = new Spring(mass, springConstant, damping)
        this._startTime = 0
    }

    setEnd(x, y, scale, velocity) {
        const t = Date.now()
        this._springX.setEnd(x, velocity, t)
        this._springY.setEnd(y, velocity, t)
        this._springScale.setEnd(scale, velocity, t)
        this._startTime = t
    }

    x() {
        const dt = (Date.now() - this._startTime) / 1000
        return {
            x: this._springX.x(dt),
            y: this._springY.x(dt),
            scale: this._springScale.x(dt)
        }
    }

    done() {
        const t = Date.now()
        return this._springX.done(t) && this._springY.done(t) && this._springScale.done(t)
    }

    reconfigure(mass, springConstant, damping) {
        this._springX.reconfigure(mass, springConstant, damping)
        this._springY.reconfigure(mass, springConstant, damping)
        this._springScale.reconfigure(mass, springConstant, damping)
    }
}

class Velocity {
    constructor() {
        this.positionQueue = []
        this.timeQueue = []
    }

    reset() {
        this.positionQueue.splice(0)
        this.timeQueue.splice(0)
    }

    pruneQueue(ms) {
        while (this.timeQueue.length && this.timeQueue[0] < (Date.now() - ms)) {
            this.timeQueue.shift()
            this.positionQueue.shift()
        }
    }

    updatePosition(position) {
        this.positionQueue.push(position)
        this.timeQueue.push(Date.now())
    }

    getVelocity() {
        this.pruneQueue(1000)
        const length = this.timeQueue.length
        if (length < 2) return 0

        const distance = this.positionQueue[length - 1] - this.positionQueue[0]
        const time = (this.timeQueue[length - 1] - this.timeQueue[0]) / 1000

        return distance / time
    }
}

export {Spring, SpringTD, Velocity}
