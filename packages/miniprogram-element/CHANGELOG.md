# 更新日志

## 0.7.8

* 修复在触发部分内置组件简单事件时，缺少 touches 和 changedTouches 的问题

## 0.7.7

* 修复浮点数等值判断问题

## 0.7.6

* 修复 swiper 的 indicatorDots 属性
* 修复内置组件文本子节点不显示的问题

## 0.7.3

* 修改小程序内置组件的 number 属性为 float 类型

## 0.7.1

* 修复 react 下 checkbox/radio onChange 事件不触发的问题

## 0.7.0

* 修复 react/preact 下输入框 onChange/onFocus/onBlur 事件不触发的问题

## 0.5.8

* 支持 button 内置组件的 business-id 属性

## 0.5.6

* 支持 swiper 内置组件
* 支持 picker-view 内置组件
* 支持 movable-view 内置组件

## 0.5.5

* input 的 change 事件支持冒泡到 document

## 0.5.3

* 修复内置组件/自定义组件子节点 diff 判断条件错误问题

## 0.5.2

* 支持 input 输入框的 change 事件

## 0.5.0

* 修复 type 为 hidden 的 input 节点也会被渲染的问题
* 支持 form 表单
* 对于使用 wx-component 或 wx- 前缀渲染的内置组件，其容器追加 wx-xxx 的 class

## 0.4.2

* 将 index.wxss 中的 button 默认样式重制代码迁移到 app.wxss 中

## 0.4.1

* 修复文本节点前后可能自动追加空格的问题

## 0.4.0

* 支持小程序自定义组件

## 0.3.1

* 支持内置组件的 hidden 属性

## 0.0.41

* 支持 scroll-view 内置组件

## 0.0.39

* 支持 ad 内置组件
* 支持 official-account 内置组件

## 0.0.37

* 修复 textarea 组件二次调用 focus 方法不生效问题

## 0.0.36

* 支持 navigator 内置组件

## 0.0.28

* 支持 icon 内置组件
* 支持 progress 内置组件

## 0.0.26

* 支持 camera 内置组件
* 支持 switch 内置组件
* 支持 slider 内置组件

## 0.0.24

* 支持 radio 内置组件
* 修复组件 wxml 条件语句语法问题

## 0.0.23

* 支持 checkbox 内置组件
* 废弃 label 内置组件，使用 label 标签替代支持

## 0.0.22

* 补充内置组件 id 字段
* 支持 text 内置组件
* 支持 label 内置组件
* img 标签调整为携带 mode 则使用初始的小程序 image 组件渲染方式渲染

## 0.0.29

* 支持 open-data 内置组件

## 0.0.21

* 支持 canvas 内置组件

## 0.0.19

* 调整 domSubTreeLevel 参数默认值为 10，支持范围为 1-10
* 修复基本事件（如图片 load 事件）在组件 detached 之后才触发的报错提示

## 0.0.18

* video 内置组件子组件调整为默认使用非原生组件渲染
* 支持 web-view 内置组件

## 0.0.15

* 支持直接渲染 cover-image 内置组件
* 支持通过 wx-component 渲染 image 内置组件

## 0.0.14

* 修复 a 标签 href 属性为空时跳转报错的问题
* 支持直接渲染 cover-view 内置组件

## 0.0.11

* 支持 live-player 内置组件
* 支持 live-pusher 内置组件
* 支持 map 内置组件

## 0.0.10

* 内置组件的 class 和 style 调整为直接挂在内置组件上
* 不支持标签的内置内容调整为直接显示，不再包装一层 view
* 支持 view 内置组件
* 支持完整的 button 内置组件
* 支持内置组件嵌入子节点

## 0.0.9

* 支持 textarea 内置组件
* 支持 video 内置组件
