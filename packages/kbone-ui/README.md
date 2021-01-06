# kbone-ui

## 介绍

提供给 Web 端的内置组件/kbone ui 扩展库。

## 安装

```
npm install --save kbone-ui
```

## 使用

```js
// 只需在 Web 端引入，小程序端无需引入
import KBoneUI from 'kbone-ui'

KBoneUI.register()
```

## 和小程序端的不同

* 布尔值属性，小程序端传入空串会认为是 false，而 Web 端传入空串会认为是 true，建议 true 直接传入 'true' 字符串，false 直接传入 'false' 字符串
* 对象/数组值属性，小程序端可以传入对象/数组，也可以传入字符串，而 Web 端只支持字符串，所以建议所有对象/数组值属性，都将值序列化成 json 串传入
* tagName 不同，小程序端的 tagName 统一为 WX-COMPONENT，Web 端则为正常的 tagName，建议使用 behavior 属性进行判断
* wx-button opentype 不支持
* wx-scroll-view 增强属性/依赖客户端接口的属性不支持
