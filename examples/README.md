# 例子

目前提供了若干例子方便接入参考。

## 例子目录

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

## 构建小程序端代码

```
npm run mp
```
