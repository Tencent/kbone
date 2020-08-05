const loaderUtils = require('loader-utils')

module.exports = function(source) {
    const options = loaderUtils.getOptions(this)

    if (options) {
        if (typeof options.before === 'string') source = options.before + source
        if (typeof options.after === 'string') source = options.after + source
    }

    return source
}
