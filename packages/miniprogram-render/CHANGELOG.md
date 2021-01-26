# 更新日志

## 2.2.6

* $$trigger 事件补充默认 event 对象

## 2.2.5

* 支持 window 的 $$domTreeUpdate 事件给 kbone-tool 使用
* 修复部分事件没有携带原生小程序事件的 detail 对象问题
* 封装 setData
* 支持 DOMContentLoaded 事件

## 2.2.4

* 第三方自定义组件支持 kbone-func- 前缀

## 2.2.3

* 修复 querySelector/querySelectorAll 查找只拥有 dataset 属性的节点返回空的问题

## 2.2.2

* 支持关键帧动画/滚动驱动动画接口

## 2.2.1

* 支持 window.devicePixelRatio
* 支持 canvas 的 createPath2D、createImage、createImageData、requestAnimationFrame、cancelAnimationFrame、toDataURL 方法

## 2.2.0

* innerHTML 补充 behavior 输出
* getElementsByTagName/querySelector/querySelectorAll 支持内置组件标签
* select 标签在没有设置 value 的时候，取选中的 option 的 value 作为 select 的 value
* 修复设置 innerHTML 为空串无法删除子节点的问题
* 支持通过 wx-checkbox、wx-checkbox-group、wx-input、wx-label、wx-radio、wx-radio-group、wx-textarea、wx-canvas 标签来创建对应节点
* 支持 $$wxCustomComponent 属性

## 2.1.9

* 修复 dispatchEvent 触发的事件没有 target 的问题

## 2.1.8

* 补充 console 到 window 下

## 2.1.7

* 支持 ad-custom 内置组件

## 2.1.6

* 补充 innerHTML 简易自动纠错能力

## 2.1.5

* 修复开发插件页面时获取 pageName 不正确的问题

## 2.1.4

* 兼容 XMLHttpRequest 对象请求响应时页面已被销毁的问题

## 2.1.3

* 支持 map 组件的自定义 callout

## 2.1.2

* 支持 XMLHttpRequest 对象的 withCredentials 属性

## 2.1.1

* 修复 canvas 默认宽高问题

## 2.1.0

* 扩展方法支持 XMLHttpRequest 对象

## 2.0.11

* 支持 worker/sharedWorker
* 修复 dom 查找 api 不支持 html 标签的问题

## 2.0.10

* 修复 cloneNode 没有复制 attribute 对象的问题

## 2.0.9

* 支持特殊属性 kbone-attribute-map/kbone-event-map
* 修复 scroll-into-view 在初始化时设置不生效问题

## 2.0.8

* 支持 match-media/voip-room 内置组件

## 2.0.7

* 修复无法触发其他已打开 tabbar 页面 storage 事件的问题

## 2.0.6

* scroll-view 内置组件改为 v2.x 渲染模式

## 2.0.3

* 提供 sourcemap

## 2.0.2

* 元素节点提供 $$wxComponent 属性

## 2.0.0

* 更新内置组件渲染模式，使用自定义组件的 virtual host 特性进行渲染
* 更新第三方自定义组件渲染模式，使用自定义组件的 virtual host 特性进行渲染

## 1.5.0

* 压缩混淆代码
* 在页面 unload 之后不允许发起请求

## 1.4.6

* 修复特殊 dom 结构会造成死循环的问题

## 1.4.5

* 补充部分 border 相关属性到样式列表中

## 1.4.4

* 支持 select/option 标签

## 1.4.3

* 支持 document.documentElement.scrollTop
* 对生成 innerHTML/outerHTML 时节点属性值里 `"` 进行实体字符替换

## 1.4.2

* 修复部分内置组件第一级子节点更新不正确的问题

## 1.4.1

* 对已经执行过 $$prepare 的 canvas 节点读取 width/height，直接从小程序节点中读取
* 修复 canvas style 被改变时，会强制将 width/height 设置在 node 对象上的问题

## 1.4.0

* 因工具调试面板 sourcemap 处理相关问题，撤销文件合并打包操作
* 对已经执行过 $$prepare 的 canvas 节点设置 width/height 不再将其写入到 style 中

## 1.3.1

* 修复生成的代码无法通过代码保护的问题

## 1.3.0

* 对源文件进行合并打包操作

## 1.2.10

* 设置 location.herf 和调用 location.replace 不触发页面刷新时，需要检测 hashchange
* 调用 history.back/history.forward/history.go 时，需要检测 hashchange

## 1.2.7

* 支持 document.visibilityState
* 支持 document.hidden

## 1.2.6

* storage 事件对齐 Web 端表现

## 1.2.0

* 支持跨页面通信
* 支持跨页面数据共享

## 1.1.4

* 支持对内置组件中可被用户行为改变的值进行强制更新

## 1.1.3

* 修复 preact 无法通过 wx- 前缀使用内置组件问题
* 修复 picker-view 等表单组件无法设置 value 问题

## 1.1.2

* style-list 补充 order 样式

## 1.1.1

* 修复 XMLHttpRequest 对象的 getResponseHeader 对大小写敏感问题

## 1.1.0

* 支持 wx-capture、wx-catch 和 wx-animation 三种特殊节点

## 1.0.10

* 修复只有 search 变化时未进行页面跳转的问题

## 1.0.9

* 支持 window.close 方法

## 1.0.8

* 支持 XMLHttpRequest 对象

## 1.0.7

* 修复 canvas 的 getContext 中在 prepare 完成之后仍然会输出未进行 prepare 的日志问题

## 1.0.6

* 支持 style 中直接设置 flex

## 1.0.5

* 修复异常跳转进入分包页面时拼接路由错误的问题

## 1.0.4

* 调整 $$domInfo 对象的 class 为 className

## 1.0.1

* innerHTML 支持生成注释节点
* 补充 textNode、comment 节点的 childNodes 属性

## 1.0.0

* 除 view、cover-view、text 和 scroll-view 外的内置组件转为使用 template 渲染，去除包裹容器，修复包裹容器带来的样式影响，同时子组件使用内包裹渲染

## 0.8.2

* 支持 canvas 的 $$prepare 方法

## 0.8.1

* 补充 parseInt/parseFloat 到 window 对象上

## 0.8.0

* 支持全局跨页共享 cookie

## 0.7.5

* 修复使用 onXXX 的方式监听事件时再目标阶段会触发两次句柄的问题

## 0.7.1

* 补充 WebkitAppearance 到样式列表中

## 0.7.0

* 支持 document.querySelector('body')
* 修复 react/preact 下输入框 onChange/onFocus/onBlur 事件不触发的问题
* 修复非冒泡事件不触发捕获阶段的问题

## 0.6.1

* 支持 node 的 remove 方法

## 0.6.0

* 支持 window.Event 属性
* 使用 setAttribute 方法来兼容 setAttributeNS 方法
* 支持 document.getElementsByName 方法

## 0.5.13

* 修复 touches 相关字段为空时没有返回空数组的问题

## 0.5.12

* 补充 window.Symbol

## 0.5.11

* 给 wx-component 节点提供 behavior setter

## 0.5.10

* style-list 里补充 touchAction 属性

## 0.5.9

* 调整 EventTarget.$$process 方法在其执行完成后返回被处理的事件对象

## 0.5.8

* 修复设置 textContent 为空串没有清空子节点的问题
* 触发事件句柄时补充异常捕获
* 支持 event.stopImmediatePropagation 接口

## 0.5.7

* 兼容 react 内置组件节点无法通过 className 设置 class 的问题

## 0.5.3

* cookie 存储默认持久化，可配置成存储在内存中
* 持久化 cookie 时，每次执行 setCookie 都会刷新 storage 里的 cookie 内容

## 0.5.0

* 支持 form 表单

## 0.4.1

* 支持文本节点的 data 属性

## 0.4.0

* 支持小程序自定义组件
* 支持 dom/bom 对象和 API 扩展

## 0.2.2

* 支持 window 的 error 事件

## 0.2.1

* 支持持久化 cookie 存储
* 支持处理 Set-Cookie 头扩展接口

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
