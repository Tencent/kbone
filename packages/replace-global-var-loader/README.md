# replace-global-var-loader

## 介绍

一个用于替换全局变量的 webpack loader，用于给某些全局加上 window 调用前缀。

## 安装

```
npm install --save-dev replace-global-var-loader
```

## 使用

```js
// a.js
abc = function () {
    console.log('abc')
}
```

```js
import 'replace-global-var-loader!./a.js'
```

那么 a.js 的代码会被转成：

```js
// a.js
window['abc'] = function () {
    console.log('abc')
}
```
