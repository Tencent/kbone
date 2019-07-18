## 前言

场景限制的原因主要出于以下两种：

* 开发资源不足，比如小程序内置组件的支持目前只支持了 `picker` 等组件。
* 小程序本身的运行机制限制。

## Q&A

Q：对于像 getBoundingClientRect 等接口，有没有什么兼容方案？
A：部分无法直接适配的接口会以 [dom/bom 扩展 api](./domextend.md) 的方式提供。

Q：是不是小程序里的所有页面必须同源？
A：目前的设计是这样的，遇到不同源的页面会提供事件提示和异常页面跳转配置。

Q：为什么无法支持 scoped style？
A：因为小程序不支持属性选择器。

Q：为什么使用 reduce-loader 不生效？
A：请检查一下是否给 script 标签设了 `type="ts"`，如果是的话可以去掉这个属性再试试，目前 ts-loader 对行内 loader 的支持不够完善。

Q：为什么 iframe 标签无法支持？
A：小程序里的 web-view 组件提供了类似 iframe 标签的实现，但是 web-view 组件不支持自定义大小，故放弃了对 iframe 的支持。

Q：为什么 vue 的 transition 组件的使用效果不如预期？
A：transition 组件内部使用了同步接口 window.getComputedStyle，故无法完美支持。

Q：对于异步请求要如何兼容？
A：可以使用第三方请求库来实现，比如 axios 和 axios-miniprogram-adapter 就是一个不错的选择。当然，你也可以自己编写 adapter。

Q：能否使用小程序原生组件？
A：目前代码里预埋进了能力，但是仅支持了 `picker` 等组件，用法可阅读[开发文档](./quickstart.md#使用小程序内置组件)，后续会慢慢补齐。

Q：能否使用 rem？
A：目前不可以，需要等小程序支持设置页面 root 节点的 font-size 属性才行。

Q：是否支持 sitemap？
A：暂未支持，不过已经计划之中。
