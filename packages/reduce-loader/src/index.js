const path = require('path')

module.exports = function(source) {
    const extname = path.extname(this.resourcePath)

    // 处理在小程序端无用的代码
    if (/\.(tsx?|js)/ig.test(extname)) {
        return process.env.isMiniprogram ? '' : source
    }

    if (/\.vue/ig.test(extname)) {
        return process.env.isMiniprogram ? 'exports.__esModule=true;;exports.default={};' : source
    }

    return source
}
