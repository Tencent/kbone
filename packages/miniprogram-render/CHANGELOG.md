# 更新日志

## 0.1.3

* 支持 tabBar

## 0.1.2

* 补充 miniprogram.js 中 runtime 对象的空判断

## 0.1.1

* 提供 dom 节点的 $$getNodesRef 方法以获取 NodesRef 对象

## 0.0.29

* 补充 miniprogram.js 中 subpackagesMap 对象的空判断，兼容旧版本 mp-webpack-plugin 插件

## 0.0.28

* 修复分包引起的路径处理问题

## 0.0.27

* 支持分包

## 0.0.26

* 支持内置组件 wx- 前缀写法和直接写法（后者需配置 runtime.wxComponent 的值）

## 0.0.25

* 修复节点 destroy 后获取 tagName 报错问题

## 0.0.23

* 修复修改事件对象后，导致小程序基础库测速上报报错问题

## 0.0.20

* 修复 querySelector/querySelectorAll 选择不到 wx-component 节点的问题

## 0.0.19

* 兼容补充 window 对象的 HTMLIFrameElement 属性，用于支持 react 环境

## 0.0.18

* 修复节点的 dataset 无法通过 setAttribute/getAttribute/hasAttribute/removeAttribute 操作的问题

## 0.0.17

* 废弃 label 节点
* 支持 label 标签

## 0.0.16

* 支持 label 节点

## 0.0.15

* 提供 window.$$forceRender 方法，用于强制清空 setData 缓存
* 提供 dom.$$getContext 方法，用于获取小程序组件的 context 对象

## 0.0.14

* 修复事件对象的 timeStamp 属性，对齐 web 标准

## 0.0.13

* 补充 event 对象 detail 属性的 setter

## 0.0.12

* 放宽 parser 的规则，允许行内元素包含块级元素

## 0.0.10

* 补充 window 对象下的 RegExp/Math/Number/Boolean/String/Date 属性

## 0.0.8

* 废弃不支持节点和 wx-component 节点的 $$content 属性
* 废弃图片拉取到真实宽高调用 setAttribute 设置 width/height 的逻辑

## 0.0.7

* 修复通过 setAttribute 设置 width/height 没有重新渲染 img 的问题
* 废弃调用 setAttribute 设置布尔值时将值转化为字符串的逻辑，以便 vue 可以直接设置布尔值
* 获取不存在的 attribute（除了 id/class/style 之外）调整为不返回空字符串，直接返回 undefined
* setAttribute 支持设置 undefined

## 0.0.6

* 修复 localStorage/sessionStorage 中 key 接口和 length 属性返回不准确的问题
