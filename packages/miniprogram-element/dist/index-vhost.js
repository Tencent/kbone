const base = require('./base')

Component({
    behaviors: [base],
    options: {
        addGlobalClass: true, // 开启全局样式
        virtualHost: true, // 开启虚拟化 host
    },
})
