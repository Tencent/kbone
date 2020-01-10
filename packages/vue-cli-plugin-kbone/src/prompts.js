const defaultOptions = require('./defaultOptions')

module.exports = [
    // 小程序信息
    {
        name: 'appid',
        type: 'input',
        message: 'AppId：',
    }, {
        name: 'projectName',
        type: 'input',
        default: defaultOptions.projectName,
        message: '项目名：',
    },

    // 入口文件
    {
        name: 'entryFileName',
        type: 'input',
        default: defaultOptions.entryFileName,
        message: 'kbone 入口文件名称：',
    },

    // generate
    {
        name: 'app',
        type: 'list',
        message: '是否需要输出 app.js、project.config.json 等非页面相关文件：',
        choices: [{
            name: '输出完整小程序项目',
            value: 'default',
        }, {
            name: '只输出页面相关文件，不输出 app.js、project.config.json 等非页面相关文件',
            value: 'noemit',
        }, {
            name: '不输出 project.config.json',
            value: 'noconfig',
        }],
    }, {
        when: answers => answers.app !== 'noemit',
        name: 'appWxss',
        type: 'list',
        message: '选择 app.wxss 输出配置：',
        choices: [{
            name: '输出默认标签样式',
            value: 'default',
        }, {
            name: '输出为空',
            value: 'none',
        }, {
            name: '只输出 display 相关的内容',
            value: 'display',
        }],
    }, {
        name: 'autoBuildNpm',
        type: 'list',
        message: '选择是否自动构建依赖包：',
        choices: [{
            name: '使用 npm 自动构建',
            value: '\'npm\'',
        }, {
            name: '使用 yarn 自动构建',
            value: '\'yarn\'',
        }, {
            name: '不自动构建依赖包',
            value: false,
        }],
    },

    // global
    {
        name: 'rem',
        type: 'confirm',
        message: '是否需要使用 rem：',
        default: false,
    },

    // cdn 配置
    {
        name: 'cdnLimit',
        type: 'input',
        default: defaultOptions.cdnLimit,
        message: '内联静态资源大小限制：',
    }, {
        name: 'cdnPath',
        type: 'input',
        default: defaultOptions.cdnPath,
        message: '静态资源文件 cdn 路径：',
    },
]
