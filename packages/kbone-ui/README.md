# kbone-ui

## 介绍

提供给 Web 端的内置组件/weui 扩展库，底层采用 Web components 实现。

## 安装

```
npm install --save kbone-ui
```

## 使用

```js
// 只需在 Web 端引入，小程序端无需引入
import KBoneUI from 'kbone-ui'

KBoneUI.register({
    components: 'all', // 默认为全组件均可使用
    // components: ['wx-input', 'mp-dialog'], // 可声明要使用哪些组件
    mode: 'open', // Web components 的模式，默认为 open，不建议改动
    style: { // 需要注入到 Web components 组件里的样式，默认为空
        'wx-input': `.green {color: green;}`, // 注入给 placeholder-class 使用
        'wx-textarea': `.green {color: green;}`, // 注入给 placeholder-class 使用
        'mp-badge': `.blue {background: blue;}`, // 注入给 ext-class 使用
    }
})
```

## 和小程序端的不同

* 布尔值属性，小程序端传入空串和 Web 端传入空串可能会有不同表现，建议统一 true 直接传入 'true' 字符串，false 直接传入 'false' 字符串
* tagName 不同，小程序端的 tagName 统一为 WX-COMPONENT，Web 端则为正常的 tagName，建议使用 behavior 属性进行判断
