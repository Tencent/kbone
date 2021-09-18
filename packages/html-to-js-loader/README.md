# html-to-js-loader

## 介绍

一个用于将 html 转成 js dom 接口调用代码的 webpack loader。

## 安装

```
npm install --save-dev html-to-js-loader
```

## 使用

```html
<!-- a.html -->
<div id="app">
    <div class="cnt"></div>
    <button onclick="console.log('123')"></button>
    <ul>
        <!-- 这是一段注释 -->
        <li>item1</li>
        <li>item2</li>
        <li>item3</li>
    </ul>
</div>
```

```js
const getDom = require('html-to-js-loader!./a.html')

document.body.appendChild(getDom())
```
