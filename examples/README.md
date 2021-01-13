# 例子

目前提供了若干例子方便接入参考。

## 目录结构

```
|---build
|    |---miniprogram.config.js // mp-webpack-plugin 插件配置
|    |---webpack.config.js // web 端 webpack 配置
|    |---webpack.mp.config.js // 小程序端 webpack 配置
|
|---dist 目标代码目录
|    |---web // web 端
|    |---mp // 小程序端
|
|---src // 源码目录
|    |---index // 主入口
|         |---main.js // web 端用主入口
|         |---main.mp.js // 小程序端用主入口
|
|---index.html // web 端输出页面
```

## 构建 web 端代码

```
npm run build
```

在 dist/web 目录下会输出 web 端目标代码。

## 构建小程序端代码

```
npm run mp
```

然后进入 dist/mp 目录下执行：

```
npm install
```

用开发者工具将 dist/mp 目录作为小程序项目导入之后，点击工具栏下的`构建 npm`，即可预览效果。

## demo 列表

* demo1：vue + vue-router
* demo2：vue + reduce-loader + vue-improve-loader
* demo3：vue + 内置组件
* demo4：vue + vue-cli-plugin-kbone
* demo5：vue + 多页
* demo6：[omi](https://github.com/Tencent/omi)
* demo7：vue + 多页 + 分包
* demo8：[omi](https://github.com/Tencent/omi) + 贪吃蛇小游戏
* demo9：vue + tabBar
* demo10：vue + 自定义组件
* demo11：vue + 自定义 tabBar
* demo12：vue + 只输出页面相关的代码（可用于独立分包）
* demo13：vue + todo app
* demo14：vue + vue-i18n
* demo15：vue + alloyFinger
* demo16：react + react-router
* demo17：preact
* demo18：vue + 多页
* demo19：vue + 云开发
* demo20：vue + echarts
* demo21：vue + 分包 + kbone 混合原生小程序开发
* demo22：vue + 跨页面通信 + 跨页面数据共享
* demo23：vue + vue-router（hash mode）
* demo24：react + 多页
* demo25：vue + worker + sharedWorker
* demo26：vue3（beta）
* demo27：vue + kbone-ui
* demo28：vue + weui + kbone-ui
* demo29：vue + 小程序动画
