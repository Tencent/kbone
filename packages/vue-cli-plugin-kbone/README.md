# vue-cli-plugin-kbone

## 介绍

用于 [vue-cli](https://cli.vuejs.org/zh/guide/) 3.x 以上的 kbone 插件。

## 安装

```
vue add kbone
```

## 生成文件

* kbone 配置文件：[miniprogram.config.js](https://wechat-miniprogram.github.io/kbone/docs/config/)
* 页面入口文件：默认是 src/main.mp.js，如果是多入口，则会读取项目根目录下的 vue.config.js，将入口文件生成到原入口文件同级目录下

> 为什么需要生成页面入口文件？因为 kbone 要求页面入口文件必须暴露出 `createApp` 方法，以便在特定的时机进行 vue 实例的创建。

## 开发

```
npm run dev:mp
```

## 构建

```
npm run build:mp
```
