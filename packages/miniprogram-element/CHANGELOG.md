# 更新日志

## 2.2.3

* 支持禁止抛出小程序的 tap、longpress 事件

## 2.2.2

* 封装 setData

## 2.2.1

* wx-animation 节点支持 animation 属性

## 2.2.0

* rich-text 的 nodes 支持 json 串
* picker、picker-view 的 value 支持 json 串
* 支持 swiper 的 snap-to-edge 属性
* 修复 scroll-view 下拉刷新相关 bug
* 支持 tap 事件
* scroll-view 支持自定义下拉刷新 slot

## 2.1.16

* 支持 ad-custom 内置组件

## 2.1.15

* 修复 radio 互斥问题
* 去除不必要的 $$childNodesUpdate 事件触发

## 2.1.14

* 第三方自定义组件部分兼容旧版本的 mp-webpack-plugin

## 2.1.13

* 修复使用第三方自定义组件不支持 name 属性问题（依赖升级：mp-webpack-plugin@1.1.12 以上）

## 2.1.12

* 支持 map 组件的自定义 callout

## 2.1.11

* 修复 textarea 的 placeholder-class 的默认值为 textarea-placeholder

## 2.1.10

* 修复 picker-view-column 下的第一层子节点无法更新的问题

## 2.1.9

* 修复 setDataMode 为 original 时进行 diff 没有对比当前最新值的问题
* 补充 diff 时值相等判断函数中关于对象/数组判断的逻辑

## 2.1.8

* 修复 diff 可被手动改变的属性时没有对比当前最新值的问题

## 2.1.5

* 修复小范围更新可能出现 “type of null” 问题

## 2.1.4

* 修复小范围更新可能设置值为 undefined 的问题

## 2.1.1

* 强制更新值判断使用非严格相等判断，以修复部分情况下组件在初始状态被强制更新的问题

## 2.1.0

* 优化 setData

## 2.0.13

* 支持 qq 小程序 button 内置组件的 share-type/share-mode 属性

## 2.0.11

* 支持 match-media/voip-room 内置组件
* 内置组件布尔值属性支持设置 'false' 字符串来表示 false 值

## 2.0.9

* scroll-view 内置组件改为 v2.x 渲染模式

## 2.0.6

* 修复 cover-view 内置组件渲染不正确问题

## 2.0.5

* 提供 sourcemap

## 2.0.2

* 元素节点提供 $$wxComponent 属性

## 2.0.1

* 修复 picker-view-column 的高度计算错误问题
* 使用 view/image 代替 cover-view/cover-image 渲染 live-player、live-pusher、camera 的子节点

## 2.0.0

* 更新内置组件渲染模式，使用自定义组件的 virtual host 特性进行渲染
* 更新第三方自定义组件渲染模式，使用自定义组件的 virtual host 特性进行渲染

## 1.5.0

* 第三方自定义组件改为 v1.x 渲染模式
* text/picker-view 内置组件改为 v1.x 渲染模式
* 压缩混淆代码

## 1.4.5

* 修复特殊 dom 结构会造成死循环的问题

## 1.4.4

* 修复内置组件 view 的 

## 1.4.3

* 支持 button 的 getrealnameauthinfo 事件 hover-start-time 参数不生效问题
* 支持 longpress 事件

## 1.4.2

* 支持 select/option 标签

## 1.4.1

* 升级内置组件，对齐到基础库 2.11.0 版本文档
* 修复部分内置组件第一级子节点更新不正确的问题

## 1.4.0

* 因工具调试面板 sourcemap 处理相关问题，撤销文件合并打包操作

## 1.3.1

* 修复生成的代码无法通过代码保护的问题

## 1.3.0

* 对源文件进行合并打包操作

## 1.2.17

* 支持 canvas 的 disable-event 属性

## 1.2.16

* 修复 canvas touchxxx 事件和 canvastouchxxx 事件冲突问题

## 1.2.12

* 修复 picker 子节点更新失败问题

## 1.2.10

* 补充 map 的 regionchange 事件中的 causedBy 字段

## 1.2.9

* map 的部分字段支持传入 json 串，以兼容 react

## 1.2.8

* 兼容基础库中 button 组件设置 type 默认值引入的样式优先级问题

## 1.2.6

* 兼容 canvas touch 相关事件小程序基础库没有提供 currentTarget 的问题

## 1.2.4

* 支持 scroll-view 下拉刷新相关属性

## 1.2.3

* 兼容旧版本基础库使用不存在的 behavior 会报 _unprepared 的问题

## 1.2.2

* scroll-view 的 scroll 事件补充捕获阶段

## 1.2.1

* 支持获取 formId
* 修复 form 表单多次 reset 不生效问题

## 1.2.0

* 支持跨页面通信
* 支持跨页面数据共享

## 1.1.9

* 支持对内置组件中可被用户行为改变的值进行强制更新

## 1.1.7

* 修复简单事件丢失 touches 等字段的问题

## 1.1.6

* picker 的 range 字段支持传入 json 串，以兼容 react

## 1.1.5

* 兼容开发者工具 map 组件相关事件的 detail 对象为空的问题

## 1.1.2

* 修复内置组件监听事件进行状态同步时调用 setAttribute 会触发 setData 的问题

## 1.1.1

* 所有节点均支持通过 _wxComponent 属性获取对应的自定义组件实例

## 1.1.0

* 支持 wx-capture、wx-catch 和 wx-animation 三种特殊节点
* 内置组件中不可冒泡事件均取消捕获阶段

## 1.0.9

* 修复内置组件 hasChildren 判断条件

## 1.0.5

* 调整 $$domInfo 对象的 class 为 className

## 1.0.4

* 兼容 react 中 picker-view 设置数组到 value 中会被序列化字符串的问题

## 1.0.1

* 调整 picker-view 为 0.x 版本的渲染模式

## 1.0.0

* 除 view、cover-view、text 和 scroll-view 外的内置组件转为使用 template 渲染，去除包裹容器，修复包裹容器带来的样式影响，同时子组件使用内包裹渲染
* checkbox/radio 对齐 Web 端表现，不再支持子节点

## 0.8.4

* 对 canvas 内置组件的 touch 事件进行特殊处理

## 0.8.3

* 支持 rich-text 内置组件

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
