## 使用 kbone-cli 快速开发

对于新项目，可以使用 `kbone-cli` 来创建项目，首先安装 `kbone-cli`:

```
npm install -g kbone-cli
```

创建项目：

```
kbone init my-app
```

进入项目，按照 README.md 的指引进行开发：

```
// 开发小程序端
npm run mp

// 开发 Web 端
npm run web

// 构建 Web 端
npm run build
```

> PS：项目基于 webpack 构建，关于 webpack 方面的配置可以[点此查看](https://webpack.js.org/configuration/)，而关于小程序构建相关的详细配置细节（即 mp-webpack-plugin 的配置）可以[参考此文档](./tutorial.md)。

## 使用模板快速开发

除了使用 kbone-cli 外，也可以直接将现有模板 clone 下来，然后在模板基础上进行开发改造：

* Vue 项目模板：[https://github.com/wechat-miniprogram/kbone-template-vue](https://github.com/wechat-miniprogram/kbone-template-vue)
* React 项目模板：[https://github.com/wechat-miniprogram/kbone-template-react](https://github.com/wechat-miniprogram/kbone-template-react)
* Preact 项目模板：[https://github.com/wechat-miniprogram/kbone-template-preact](https://github.com/wechat-miniprogram/kbone-template-preact)
* Omi 项目模板：[https://github.com/omijs/template-kbone](https://github.com/omijs/template-kbone)

项目 clone 下来后，按照项目中 README.md 的指引进行开发。

> PS：项目基于 webpack 构建，关于 webpack 方面的配置可以[点此查看](https://webpack.js.org/configuration/)，而关于小程序构建相关的详细配置细节（即 mp-webpack-plugin 的配置）可以[参考此文档](./tutorial.md)。

## 手动配置开发

此方案基于 webpack 构建实现，如果你不想要使用官方提供的模板，想要更灵活地搭建自己的项目，又或者是想对已有的项目进行改造，则需要自己补充对应配置来实现 kbone 项目的构建。

一般需要补充两个配置：

* 构建到小程序代码的[ webpack 配置](https://webpack.js.org/configuration/)
* 使用 webpack 构建中使用到的特殊插件[ mp-webpack-plugin 配置](./miniprogram.config.js)

[点此可以查看](./tutorial.md)具体配置方式和操作流程。
