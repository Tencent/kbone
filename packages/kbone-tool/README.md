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

将全局状态（如 vuex 的 state）放到 window.$$global 中存储时调用。

跨页面共享全局状态时，会存在状态的 observer 对象被覆盖的情况，导致某些场景更新不会触发到其他页面中，userGlobal 方法即用于解决此问题。下述以 vuex 的使用作为例子：

```js
import * as kbone from 'kbone-tool'

kbone.vue.useGlobal()

// state 存放到 window.$$global 中
const state = window.$$global.state || {
    // ...
}
window.$$global.state = state
const store = new Vuex.Store({
    state,
    actions: {
        // ...
    },
    mutations: {
        // ...
    },
})
```

### weui

#### useForm

因为原生小程序自定义组件的 relations 不支持跨自定义组件，而 form 表单相关组件用到了此特性，所以在此方法中直接在逻辑层实现 form 表单组件的 relations 逻辑。

```js
import * as kbone from 'kbone-tool'

kbone.weui.useForm()
```
