## 前言

场景限制的原因主要出于以下两种：

* 开发资源不足，比如小程序部分内置组件暂不支持。
* 小程序本身的运行机制限制。

## Q&A

Q：对于像 getBoundingClientRect 等接口，有没有什么兼容方案？

A：部分无法直接适配的接口会以 [dom/bom 扩展 api](./domextend.md) 的方式提供。

<br>

Q：是不是小程序里的所有页面必须同源？

A：目前的设计是这样的，遇到不同源的页面会提供事件提示和异常页面跳转配置。

<br>

Q：能否支持异步组件？

A：受限于小程序环境，目前无法支持。

<br>

Q：为什么无法支持 scoped style？

A：因为小程序不支持属性选择器。

<br>

Q：为什么使用 reduce-loader 不生效？

A：请检查一下是否给 script 标签设了 `type="ts"`，如果是的话可以去掉这个属性再试试，目前 ts-loader 对行内 loader 的支持不够完善。

<br>

Q：为什么 iframe 标签无法支持？

A：小程序里的 web-view 组件提供了类似 iframe 标签的实现，但是 web-view 组件不支持自定义大小，故放弃了对 iframe 的支持。

<br>

Q：为什么 vue 的 transition 组件的使用效果不如预期？

A：transition 组件内部使用了同步接口 window.getComputedStyle，故无法完美支持。

<br>

Q：对于异步请求要如何兼容？

A：可以使用第三方请求库来实现，比如 axios 和 axios-miniprogram-adapter 就是一个不错的选择。当然，你也可以自己编写 adapter。

<br>

Q：能否使用小程序内置组件？

A：目前代码里预埋进了能力，但是仅支持部分组件，用法可阅读[开发文档](./quickstart.md#使用小程序内置组件)，后续会慢慢补齐。

<br>

Q：能否使用 rem？

A：目前不可以，需要等小程序支持设置页面 root 节点的 font-size 属性才行。

<br>

Q：是否支持 sitemap？

A：暂未支持，不过已经计划之中。

<br>

Q：为什么 img 标签有 mode 属性和没有 mode 属性表现会不太一样？

A：因为 img 标签有 mode 属性在底层会被渲染成 background-image 模式（即小程序 image 组件默认的形态），没有 mode 属性会被渲染成和 web 端相同的 img 模式。

<br>

Q：为什么不支持 radio-group/checkbox-group 内置组件？

A：因为 radio-group/checkbox-group 内置组件下的 radio/checkbox 不支持跨自定义组件，可以使用 input 的 change 事件来替代 radio-group/checkbox-group 的 change 事件，通过获取 input 的 checked/value 也可以获取到其状态（类似 web 端的表现）。

<br>

Q：项目中用到的图片等静态资源要如何处理？

A：目前暂不支持相对路径，故静态资源可以考虑转成 base64 或者使用网络地址。

<br>

Q：能否支持分包？

A：独立分包暂时不考虑，分包已经在计划之中了。
