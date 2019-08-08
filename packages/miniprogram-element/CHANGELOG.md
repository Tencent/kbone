# 更新日志

## 0.0.9

* 支持 textarea 内置组件
* 支持 video 内置组件

## 0.0.10

* 内置组件的 class 和 style 调整为直接挂在内置组件上
* 不支持标签的内置内容调整为直接显示，不再包装一层 view
* 支持 view 内置组件
* 支持完整的 button 内置组件
* 支持内置组件嵌入子节点

## 0.0.11

* 支持 live-player 内置组件
* 支持 live-pusher 内置组件
* 支持 map 内置组件

## 0.0.14

* 修复 a 标签 href 属性为空时跳转报错的问题
* 支持直接渲染 cover-view 内置组件

## 0.0.15

* 支持直接渲染 cover-image 内置组件
* 支持通过 wx-component 渲染 image 内置组件

## 0.0.18

* video 内置组件子组件调整为默认使用非原生组件渲染
* 支持 web-view 内置组件

## 0.0.19

* 调整 domSubTreeLevel 参数默认值为 10，支持范围为 1-10
* 修复基本事件（如图片 load 事件）在组件 detached 之后才触发的报错提示

## 0.0.21

* 支持 canvas 内置组件

## 0.0.22

* 补充内置组件 id 字段
* 支持 text 内置组件
* 支持 label 内置组件
* img 标签调整为携带 mode 则使用初始的小程序 image 组件渲染方式渲染

## next version
