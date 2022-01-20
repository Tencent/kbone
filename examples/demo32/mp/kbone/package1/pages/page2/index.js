const mp = require('miniprogram-render')
const getBaseConfig = require('../base.js')
const config = require('../../config')

function init(window, document) {require('../../../common/vendors~page2~page3~page4.js')(window, document);require('../../../common/default~page2~page3~page4.js')(window, document);require('../../common/page2.js')(window, document)}

const baseConfig = getBaseConfig(mp, config, init)

Component({
    ...baseConfig.base,
    methods: {
        ...baseConfig.methods,
        onPageScroll({ scrollTop }) {if (this.window) {this.window.document.documentElement.$$scrollTop = scrollTop || 0;this.window.$$trigger('scroll');}},
        
        
    },
})
