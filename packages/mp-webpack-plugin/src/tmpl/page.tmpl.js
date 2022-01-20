const mp = require('miniprogram-render')
const getBaseConfig = require('../base.js')
const config = require('/* CONFIG_PATH */')

/* INIT_FUNCTION */

const baseConfig = getBaseConfig(mp, config, init)

Component({
    ...baseConfig.base,
    methods: {
        ...baseConfig.methods,
        /* PAGE_SCROLL_FUNCTION */
        /* REACH_BOTTOM_FUNCTION */
        /* PULL_DOWN_REFRESH_FUNCTION */
    },
})
