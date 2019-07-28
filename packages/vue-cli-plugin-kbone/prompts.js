const chalk = require('chalk')
const defaultOptions = require('./defaultOptions')

module.exports = [
  // 小程序信息
  {
    name: 'appid',
    type: 'input',
    // prefix: `${chalk.yellow('>')} 请设置小程序基本信息\n${chalk.green('?')}`,
    message: `AppId:`
  },
  {
    name: 'projectname',
    type: 'input',
    default: defaultOptions['package']['name'],
    message: `项目名:`
  },
  // 选择配置模板信息
  {
    name: 'configType',
    type: 'list',
    message: `配置方式:`,
    choices: [
      {
        name: '默认配置',
        value: 'default',
        short: '默认配置'
      },
      {
        name: '自定义配置',
        value: 'custom',
        short: '自定义配置'
      }
    ]
  },
  // 基本配置
  {
    when: answers => answers.configType === 'custom',
    name: 'origin',
    type: 'input',
    // prefix: `${chalk.yellow('>')} 请设置基本配置\n${chalk.green('?')}`,
    default: defaultOptions['origin'],
    message: `静态资源域名:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'entry',
    type: 'input',
    default: defaultOptions['entry'],
    message: `入口页面路由:`
  },
  // 优化配置
  {
    when: answers => answers.configType === 'custom',
    name: 'domSubTreeLevel',
    type: 'number',
    // prefix: `${chalk.yellow('>')} 请设置打包时的优化配置\n${chalk.green('?')}`,
    default: defaultOptions['domSubTreeLevel'],
    message: `将多少层级的 dom 子树作为一个自定义组件渲染，支持 1 - 5:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'elementMultiplexing',
    type: 'confirm',
    default: defaultOptions['elementMultiplexing'],
    message: `element 节点复用:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'textMultiplexing',
    type: 'confirm',
    default: defaultOptions['textMultiplexing'],
    message: `文本节点复用:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'commentMultiplexing',
    type: 'confirm',
    default: defaultOptions['commentMultiplexing'],
    message: `注释节点复用:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'domExtendMultiplexing',
    type: 'confirm',
    default: defaultOptions['domExtendMultiplexing'],
    message: `节点相关对象复用，如 style、classList 对象等:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'styleValueReduce',
    type: 'number',
    default: defaultOptions['styleValueReduce'],
    message: `如果设置 style 属性时存在某个属性的值超过一定值，则进行删减:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'attrValueReduce',
    type: 'number',
    default: defaultOptions['attrValueReduce'],
    message: `如果设置 dom 属性时存在某个属性的值超过一定值，则进行删减:`
  },
  // app 配置
  {
    when: answers => answers.configType === 'custom',
    name: 'navigationStyle',
    type: 'list',
    // prefix: `${chalk.yellow('>')} 请设置小程序的配置\n${chalk.green('?')}`,
    message: `导航栏样式:`,
    choices: [
      {
        name: '自定义导航栏',
        value: 'custom',
        short: '自定义导航栏'
      },
      {
        name: '默认样式',
        value: 'default',
        short: '默认样式'
      }
    ]
  },
  {
    when: answers => answers.configType === 'custom' && answers.navigationStyle === 'default',
    name: 'navigationBarTitleText',
    type: 'input',
    default: answers => answers.projectname.trim(),
    message: `导航栏标题文字内容:`
  },
  {
    when: answers => answers.configType === 'custom' && answers.navigationStyle === 'default',
    name: 'navigationBarBackgroundColor',
    type: 'input',
    default: defaultOptions['navigationBarBackgroundColor'],
    message: `导航栏背景颜色:`
  },
  {
    when: answers => answers.configType === 'custom' && answers.navigationStyle === 'default',
    name: 'navigationBarTextStyle',
    type: 'list',
    message: `导航栏标题颜色:`,
    choices: [
      {
        name: '白色',
        value: 'white',
        short: '白色'
      },
      {
        name: '黑色',
        value: 'black',
        short: '黑色'
      }
    ]
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'backgroundColor',
    type: 'input',
    default: defaultOptions['backgroundColor'],
    message: `窗口的背景色:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'backgroundTextStyle',
    type: 'list',
    message: `下拉 loading 的样式:`,
    choices: [
      {
        name: '暗',
        value: 'dark',
        short: '暗'
      },
      {
        name: '亮',
        value: 'light',
        short: '亮'
      }
    ]
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'backgroundColorTop',
    type: 'input',
    default: defaultOptions['backgroundColorTop'],
    message: `顶部窗口的背景色，仅 iOS 支持:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'backgroundColorBottom',
    type: 'input',
    default: defaultOptions['backgroundColorBottom'],
    message: `底部窗口的背景色，仅 iOS 支持:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'enablePullDownRefresh',
    type: 'confirm',
    default: defaultOptions['enablePullDownRefresh'],
    message: `是否开启全局的下拉刷新:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'onReachBottomDistance',
    type: 'number',
    default: defaultOptions['onReachBottomDistance'],
    message: `页面上拉触底事件触发时距页面底部距离，单位为 px:`
  },
  {
    when: answers => answers.configType === 'custom',
    name: 'pageOrientation',
    type: 'list',
    message: `屏幕旋转设置:`,
    choices: [
      {
        name: '竖屏',
        value: 'portrait',
        short: '竖屏'
      },
      {
        name: '横屏',
        value: 'landscape',
        short: '横屏'
      },
      {
        name: '自动',
        value: 'auto',
        short: '自动'
      }
    ]
  }
]
