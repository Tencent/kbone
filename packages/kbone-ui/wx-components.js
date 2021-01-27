if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/wx-components.js')
} else {
    module.exports = require('./dist/wx-components.dev.js')
}
