const defaultOptions = require('../defaultOptions')

module.exports = (api, options) => {
  // add mp-webpack-plugin and scripts
  api.extendPackage({
    scripts: {
      'mp-serve': 'vue-cli-service build --mode mp --dest ./dist/mp-serve/common --watch',
      'mp-build': 'vue-cli-service build --mode mp --dest ./dist/mp-build/common'
    }
  })

  // add main.mp.js
  api.postProcessFiles(files => {
    files['./src/main.mp.js'] = createMpEntryFile(files[api.entryFile])
  })

  // set defaultOptions
  const otherOptions = {
    navigationBarTitleText: options['projectname']
  }
  if (options['configType'] === 'default') {
    Object.assign(options, otherOptions, defaultOptions)
  } else if (options['navigationStyle'] === 'custom') {
    Object.assign(options, otherOptions, {
      navigationBarBackgroundColor: defaultOptions['navigationBarBackgroundColor'],
      navigationBarTextStyle: defaultOptions['navigationBarTextStyle'],
      package: defaultOptions['package']
    })
  } else {
    options['package'] = defaultOptions['package']
  }

  // add template
  api.render('./template')
}

/**
 * 创建小程序入口文件
 */
createMpEntryFile = (entryFile) => {
  const codes = entryFile.split('new Vue({')

  return `${codes[0].trim()}

// 需要将创建根组件实例的逻辑封装成方法
export default function createApp () {
  // 在小程序中如果要注入到 id 为 app 的 dom 节点上，需要主动创建
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  return new Vue({
    ${codes[1].split('\n').join('\n  ').trim()}
}
`
}
