# file-wrapper-loader

## 介绍

一个用于补充代码包裹的 webpack loader，用于在依赖代码前后注入包裹代码。

## 安装

```
npm install --save-dev file-wrapper-loader
```

## 使用

举个例子，在小程序端 import tim-wx-sdk 或 cos-wx-sdk-v5 包进来，在存在 window 对象的时候会运行报错，因此我们需要在运行依赖包前将 window 对象置空。我们可以对符合条件的代码前后追加内容，以达到在特殊场景的兼容效果：

```js
module.exports = {
    // ... 其他配置
    module: {
        rules: [
            {
                test: /tim-wx-sdk|cos-wx-sdk-v5/,
                use: [{
                    loader: 'file-wrapper-loader',
                    options: {
                        before: 'var window=undefined;', // 代码前面追加内容
                        after: ';console.log("test");', // 代码后面追加内容
                    }
                }],
                include: /node_modules/,
            },
            // ... 其他 rule
        ],
    },
}

```
