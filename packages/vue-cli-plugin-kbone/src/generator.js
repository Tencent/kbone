const fs = require('fs')
const path = require('path')
const defaultOptions = require('./defaultOptions')

const entryFileTemplate = `import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 需要将创建根组件实例的逻辑封装成方法
export default function createApp() {
    // 在小程序中如果要注入到 id 为 app 的 dom 节点上，需要主动创建
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    return new Vue({
        render: h => h(App),
    }).$mount('#app')
}
`

module.exports = (api, options) => {
    // 读取配置
    const configPath = api.resolve('./vue.config.js')
    let config = {}
    try {
        fs.accessSync(configPath)
        // eslint-disable-next-line import/no-dynamic-require
        config = require(configPath)
    } catch (err) {
        // ignore
    }

    // 添加 scripts
    api.extendPackage({
        scripts: {
            mp: 'cross-env MP_ENV=miniprogram vue-cli-service build --mode development --dest ./dist/mp/common --watch',
            'dev:mp': 'npm run mp',
            'build:mp': 'cross-env MP_ENV=miniprogram vue-cli-service build --mode production --dest ./dist/mp/common',
        },
    })

    // 调整 options
    if (config && config.pages) {
        let entry = ''
        const router = {}
        Object.keys(config.pages).forEach(pageName => {
            if (!entry) entry = `/${pageName}`
            router[pageName] = [`/${pageName}`]
        })
        options.entry = entry
        options.router = JSON.stringify(router)
    } else {
        options.entry = defaultOptions.entry
        options.router = defaultOptions.router
    }
    options.appWxss = options.appWxss || defaultOptions.appWxss

    // 添加入口文件
    api.postProcessFiles(files => {
        if (config && config.pages) {
            Object.keys(config.pages).forEach(pageName => {
                const entryFile = typeof config.pages[pageName] === 'object' ? config.pages[pageName].entry : config.pages[pageName]
                if (entryFile) files[path.join(entryFile, `../${options.entryFileName}`)] = entryFileTemplate
            })
        } else {
            files[path.join(api.entryFile, `../${options.entryFileName}`)] = entryFileTemplate
        }
    })

    // 添加模板
    api.render('./template')
}
