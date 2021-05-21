const webpack = require('webpack')

module.exports = {
    pages: {
        page1: 'src/page1/main.js',
        page2: {
            entry: 'src/page2/main.js',
        },
        page3: 'src/page3/main.js',
    },
    pluginOptions: {
        kbone: {
            configureWebpack: config => {
                config.plugins.push(new webpack.DefinePlugin({
                    'INJECT_NAME': '\"juneandgreen\"'
                }))
            }
        }
    }
}
