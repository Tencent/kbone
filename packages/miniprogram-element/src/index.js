const base = require('./base')

Component({
    behaviors: [base],
    options: {
        addGlobalClass: true, // 开启全局样式
    },
})

console.warn(`当前渲染模式版本：2.x 版本（要求最低基础库版本 2.11.2）。

2.x 版本对比 1.x 版本去除了渲染内置组件时额外引入的一层节点，如果升级版本过程中遇到样式错乱问题，可尝试去除使用 1.x 版本时额外追加的兼容样式，也可选择退回 1.x 版本（退回版本可以使用 generate.renderVersion 和 generate.elementVersion 配置：https://wechat-miniprogram.github.io/kbone/docs/config/#generate-renderversion ）`)
