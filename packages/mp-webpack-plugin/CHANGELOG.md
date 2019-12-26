# 更新日志

## 0.5.8

* 支持输出除 project.config.json 之外文件的配置

## 0.5.7

* 修复自动安装小程序依赖在 windows 下会报错的问题

## 0.5.6

* 自动安装小程序依赖时补充错误捕获

## 0.5.5

* 修复 generate.app 配置冲突问题

## 0.5.4

* 支持在构建完成后自动安装小程序依赖

## 0.5.3

* 将用户代码初始化调用后移到 window.location 初始化之后

## 0.5.1

* 支持 window.onload
* 支持 rem，需要基础库 2.9.0 以上
* 支持修改页面样式，需要基础库 2.9.0 以上

## 0.5.0

* 支持只输出页面相关代码（可用于独立分包）

## 0.4.4

* 支持自定义全局变量

## 0.4.3

* 将 miniprogram-element/index.wxss 中的 button 默认样式重制代码迁移到 app.wxss 中

## 0.4.2

* 支持自定义 tabBar

## 0.4.1

* 删除生成的 wxss 中不支持的 @-moz-keyframes 规则

## 0.4.0

* 支持自定义 app.js 和 app.wxss
* 支持小程序自定义组件

## 0.2.2

* 支持 window 的 error 事件

## 0.1.3

* 修复不配置 tabBar 构建报错的问题

## 0.1.2

* 支持 tabBar

## 0.0.21

* 支持全局配置和页面配置中的 extra 字段，用于使用小程序的页面配置
* 全局配置和页面配置中的 backgroundColor 字段重命名为 pageBackgroundColor

## 0.0.20

* 支持分包

## 0.0.19

* 支持 runtime.wxComponent 配置

## 0.0.18

* 修复深拷贝生成 project.config.json 报错问题

## 0.0.17

* 修复通过浅拷贝生成 project.config.json 导致重复 push 内容的问题

## 0.0.16

* 支持监听小程序页面生命周期

## 0.0.15

* 支持 app.wxss 的输出配置
