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
    // 添加 scripts
    api.extendPackage({
        scripts: {
            'mp-dev': 'cross-env MP_ENV=miniprogram vue-cli-service build --mode development --dest ./dist/mp/common --watch',
            'mp-build': 'cross-env MP_ENV=miniprogram vue-cli-service build --mode production --dest ./dist/mp/common',
        },
    })

    // 设置默认配置
    const otherOptions = {
        navigationBarTitleText: options.projectname
    }
    if (options.configType === 'default') {
        Object.assign(options, otherOptions, defaultOptions)
    } else if (options.navigationStyle === 'custom') {
        Object.assign(options, otherOptions, {
            navigationBarBackgroundColor: defaultOptions.navigationBarBackgroundColor,
            navigationBarTextStyle: defaultOptions.navigationBarTextStyle,
        })
    }

    // 添加入口文件
    if (options.entryFiles) {
        api.postProcessFiles(files => {
            files[path.join(api.entryFile, `../${options.entryFileName}`)] = entryFileTemplate
        })
    }

    // 添加模板
    api.render('./template')
}
