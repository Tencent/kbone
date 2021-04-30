# kbone-tool

## 介绍

针对一些特殊场景提供的工具库。

## 安装

```
npm install --save kbone-tool
```

## 使用

### vue

#### useGlobal

废弃，如果需要全局共享 vuex 状态，建议如下操作：

```js
const state = window.$$global.state || {}
window.$$global.state = state

// 退出页面时来一次 state 的深拷贝
const onShow = () => {
    store.replaceState(window.$$global.state)
}
const onHide = () => {
    window.$$global.state = JSON.parse(JSON.stringify(store.state))
}
window.addEventListener('wxshow', onShow)
window.addEventListener('wxhide', onHide)
window.addEventListener('wxunload', onHide)
```

### weui

#### useForm

因为原生小程序自定义组件的 relations 不支持跨自定义组件，而 form 表单相关组件用到了此特性，所以在此方法中直接在逻辑层实现 form 表单组件的 relations 逻辑。

```js
import * as kbone from 'kbone-tool'

kbone.weui.useForm()
```
