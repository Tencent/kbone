/* ROUTE_PATH */

const Generate = (options) => {
    if (options.subPackAsync) {
        Component({
            data: options.data,
            lifetimes: {
                attached() {
                    this.__route__ = route;
                    this.route = route;
                    options.onLoad.bind(this)({});
                },
                ready: options.onReady,
                detached: options.onUnload,
            },
            pageLifetimes: {
                // 组件所在页面的生命周期函数
                show: options.onShow,
                hide: options.onHide,
                resize: options.onResize,
            },
            methods: { ...options },
            options: {
                styleIsolation: 'shared',
            },
        }) 
    } else {
        Page(options)
    }
}

const mp = require('miniprogram-render')
const getBaseConfig = require('../base.js')
const config = require('/* CONFIG_PATH */')

/* INIT_FUNCTION */

Generate({
    subPackAsync: config.pages[route].subPackAsync,
    ...getBaseConfig(mp, config, init),
    /* PAGE_SCROLL_FUNCTION */
    /* REACH_BOTTOM_FUNCTION */
    /* PULL_DOWN_REFRESH_FUNCTION */
})
