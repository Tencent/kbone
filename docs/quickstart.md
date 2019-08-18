## 前言

此方案基于 webpack 构建实现，构建 web 端代码的流程无需做任何调整，此处只介绍如何将源码构建成小程序端代码。

## 编写 webpack 配置

新建一个 webpack.mp.config.js 文件，用于小程序端代码的构建，假设你要构建的小程序代码放到 `./miniprogram` 目录中：

```js
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin') // 用于构建小程序代码的 webpack 插件

const isOptimize = true // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
    mode: 'production',
    entry: {
        // js 入口
    },
    output: {
        path: path.resolve(__dirname, './miniprogram/common'), // 放到小程序代码目录中的 common 目录下
        filename: '[name].js', // 必需字段，不能修改
        library: 'createApp', // 必需字段，不能修改
        libraryExport: 'default', // 必需字段，不能修改
        libraryTarget: 'window', // 必需字段，不能修改
    },
    target: 'web', // 必需字段，不能修改
    optimization: {
        runtimeChunk: false, // 必需字段，不能修改
        splitChunks: { // 代码分割配置，不建议修改
            chunks: 'all',
            minSize: 1000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 100,
            maxInitialRequests: 100,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },

        minimizer: isOptimize ? [
            // 压缩CSS
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.(css|wxss)$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true,
                        },
                        minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                    }],
                },
                canPrint: false
            }),
            // 压缩 js
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
            })
        ] : [],
    },
    module: {
        rules: [
            // loaders 配置。这里需要注意的是，部分在 wxss 不支持的样式需要剔除，比如 ie hack 代码，可以使用 postcss 的 stylehacks 插件剔除；对于资源文件来说，需要转成 base64 或者线上资源链接，下面是一个简单的示例：
            // {
            //     test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
            //     use: [{
            //         loader: 'url-loader',
            //         options: {
            //             limit: 1024,
            //             name: '[name]_[hash:hex:6].[ext]',
            //             publicPath: 'https://test.miniprogram.com/res', // 对于资源文件直接使用线上的 cdn 地址
            //             emitFile: false,
            //         }
            //     }],
            // },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
        }),
        new MiniCssExtractPlugin({
            filename: '[name].wxss',
        }),
        new VueLoaderPlugin(),
        new MpPlugin({
            // 插件配置，下面会详细介绍
        }),
    ],
}
```

## 编写 webpack 插件配置

这里的 webpack 插件配置即上面提到的 `MpPlugin` 的配置，内容如下：

```js
const mpPluginConfig = {
    // 页面 origin，默认是 https://miniprogram.default
    origin: 'https://test.miniprogram.com',
    // 入口页面路由，默认是 /
    entry: '/',
    // 页面路由，用于页面间跳转
    router: {
        // 路由可以是多个值，支持动态路由
        home: [
            '/(home|index)?',
            '/test/(home|index)',
        ],
        list: [
            '/test/list/:id',
        ],
    },
    // 特殊路由跳转
    redirect: {
        // 跳转遇到同一个 origin 但是不在 router 里的页面时处理方式，支持的值：webview - 使用 web-view 组件打开；error - 抛出异常；none - 默认值；什么都不做，router 配置项中的 key
        notFound: 'home',
        // 跳转到 origin 之外的页面时处理方式，值同 notFound
        accessDenied: 'home',
    },
    // app 配置，同 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#window
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: 'miniprogram-project',
    },
    // 全局配置
    global: {
        loadingText: '拼命加载页面中...', // 页面加载时是否需要 loading 提示，默认是没有，即空串
        share: true, // 是否支持分享，若支持，会展示分享按钮并调用 app 的 onShareAppMessage 按钮
        windowScroll: false, // 是否需要 window scroll 事件，会影响性能
        backgroundColor: '#F7F7F7', // page 的背景色
        reachBottom: false, // 是否支持上拉触底，若支持可监听 window 的 reachbottom 事件
        reachBottomDistance: 0, // 页面上拉触底事件触发时距页面底部距离，单位为 px
        pullDownRefresh: false, // 是否支持下拉刷新，若支持可监听 window 的 pulldownrefresh 事件
    },
    // 页面配置，可以为单个页面做个性化处理，覆盖全局配置
    pages: {
        home: {
            pullDownRefresh: true,
        },
        list: {
            loadingText: '',
            share: false,
        },
    },
    // 优化
    optimization: {
        domSubTreeLevel: 10, // 将多少层级的 dom 子树作为一个自定义组件渲染，支持 1 - 10，默认值为 10

        // 对象复用，当页面被关闭时会回收对象，但是如果有地方保留有对象引用的话，注意要关闭此项，否则可能出问题
        elementMultiplexing: true, // element 节点复用
        textMultiplexing: true, // 文本节点复用
        commentMultiplexing: true, // 注释节点复用
        domExtendMultiplexing: true, // 节点相关对象复用，如 style、classList 对象等

        styleValueReduce: 5000, // 如果设置 style 属性时存在某个属性的值超过一定值，则进行删减
        attrValueReduce: 5000, // 如果设置 dom 属性时存在某个属性的值超过一定值，则进行删减
    },
    // app 补充配置，主要指 pages、window 等配置外的其他配置，同 https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html
    appExtraConfig: {
        debug: true,
    },
    // 项目配置，会被合并到 project.config.json
    projectConfig: {
        appid: 'wx1234567890',
    },
    // 包配置，会被合并到 package.json
    packageConfig: {
        author: 'wechat-miniprogram',
    },
}
```

## 新增入口文件

此处小程序 webpack 配置所使用的入口文件和 web 端有一定区别，假设 web 端是这样的：

```js
import Vue from 'vue'
import App from './App.vue'

// 注入到页面上的 id 为 app 的 dom 节点上
new Vue({
    el: '#app',
    render: h => h(App)
})
```

那么小程序端所用到的入口则需要调整成如下：

```js
import Vue from 'vue'
import App from './App.vue'

// 需要将创建根组件实例的逻辑封装成方法
export default function createApp() {
    // 在小程序中如果要注入到 id 为 app 的 dom 节点上，需要主动创建
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    return new Vue({
        el: '#app',
        render: h => h(App)
    })
}
```

这是因为小程序中各个页面的逻辑端是统一跑在 appService 上的，需要对各个页面做隔离。为了方便做后续操作，需要将创建根组件实例的逻辑封装成方法暴露给适配层，调用此方法时会返回根组件实例。

## 执行构建

1. 构建小程序代码：

```
webpack --config webpack.mp.config.js
```

2. 进入小程序代码目录，安装小程序依赖包：

```
cd miniprogram
npm install
```

3. 使用小程序开发者工具直接打开此目录，并点击工具菜单下的构建 npm 按钮，之后便可预览构建好的小程序了。

> PS：建议使用工具的 RC 版本或者 Nightly 版本，以支持 babelSetting 的 ignore 配置。

## 例子

我们准备了若干 demo，可以[点此查看](https://github.com/wechat-miniprogram/kbone/tree/master/examples)。

## 其他

### 代码优化

代码优化主要在于代码体积的精简和 dom 树的精简：

1. 代码体积精简

在编译到小程序代码的时候，会将整个 vue runtime 和一些 vue 特性插件（如 vue-router、vuex 等）给打包进来，这样会导致代码包比较庞大，而这些代码是无法去除的，因此得从业务代码上着手进行一些缩减。业务上存在一些代码可以用小程序接口替代，这部分是完全不需要打包进来的，因此可以使用一个行内 loader 和环境变量来进行代码的去除，简单做法如下：

```
npm install --save-dev reduce-loader
```

```js
import Vue from 'vue'
import ActionSheet from 'reduce-loader!./action-sheet' // 使用行内 loader，剔除 action-sheet 文件的引入

// 通过注入的环境变量判断代码运行环境，进而执行不同的逻辑
if (!process.env.isMiniprogram) {
    // web 端
    ActionSheet.show([1, 2, 3], success)
} else {
    // 小程序端
    wx.showActionSheet({
        itemList: [1, 2, 3],
        success,
    })
}
```

2. dom 树的精简

对于一些站点会使用响应式设计，即 pc 端和 h5 端会共用一套代码，通常 pc 端很多节点在 h5 端是不需要展示出来的，这就需要在样式上对节点设置 `display: none`，而这些节点仍旧存在于 dom 树上，只是不渲染在视图上。如果这套代码直接转成小程序代码，也必定会创建一些无需展示的 dom 节点，这些节点本身是可以直接剔除。

因此可以使用另外一个 loader 对这些节点进行删减，在 webpack 配置中 vue loader 执行之前再添加一个 `vue-improve-loader`：

```
npm install --save-dev vue-improve-loader
```

```js
{
    test: /\.vue$/,
    use: [
        {
            loader: 'vue-loader',
            options: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        },
        'vue-improve-loader',
    ]
},
```

然后在 vue 文件中给要剔除的节点加上 check-reduce 属性：

```html
<!-- 删减前代码 -->
<template>
    <div>
        <span>some text</span>
        <a check-reduce>
            <span>some text other</span>
        </a>
    </div>
</template>
```

因为 web 端代码构建和小程序端代码构建走不同的配置，所以 web 端代码会忽略这个属性，而小程序端代码则会删减掉带这个属性的节点。以下便是会输出给 vue-loader 的代码，从构建层面上剔除掉不需要的节点。

```html
<!-- 删减后代码 -->
<template>
    <div>
        <span>some text</span>
    </div>
</template>
```

> PS：vue-improve-loader 必须在 vue-loader 之前执行，这样 vue-loader 才会接收到被删减后的代码。

### 使用小程序内置组件

部分内置组件可以直接使用 html 标签替代，比如 input 组件可以使用 input 标签替代。目前已支持的可替代组件列表：

* `<input />` --> input 组件
* `<input type="radio" />` --> radio 组件
* `<input type="checkbox" />` --> checkbox 组件
* `<label><label>` --> label 组件
* `<textarea></textarea>` --> textarea 组件
* `<img />` --> image 组件
* `<video></video>`  --> video 组件
* `<canvas></canvas>` --> canvas 组件

还有一部分内置组件在 html 中没有标签可替代，那就需要使用 `wx-component` 标签，基本用法如下：

```html
<wx-component behavior="picker" mode="region" @change="onChange">选择城市</wx-component>
<wx-component behavior="button" open-type="share" @click="onClickShare">分享</wx-component>
```

使用 `wx-component` 标签表示要渲染小程序内置组件，然后 behavior 字段表示要渲染的组件名，其他组件属性传入和官方文档一致，事件则采用 vue 的绑定方式。

`wx-component` 已支持内置组件列表：

* cover-image 组件
* cover-view 组件
* view 组件
* icon 组件
* progress 组件
* text 组件
* button 组件
* picker 组件
* slider 组件
* switch 组件
* camera 组件
* image 组件
* live-player 组件
* live-pusher 组件
* map 组件
* web-view 组件

> PS：button 标签不会被渲染成 button 内置组件，如若需要请使用 wx-component。
> PS：原生组件的表现在小程序中表现会和 web 端标签有些不一样，具体可[参考原生组件说明文档](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)。
> PS：原生组件下的子节点，div、span 等标签会被渲染成 cover-view，img 会被渲染成 cover-image，如若需要使用 button 内置组件请使用 wx-component。

### 开发建议

1. 虽然此方案将完整的 vue runtime 包含进来了，但必然存在一些无法直接适配的接口，比如 getBoundingClientRect，一部分会通过 dom/bom 扩展 api 间接实现，一部分则完全无法支持。**[查看 dom/bom 扩展 api 文档](./domextend.md)**。
2. 可能存在部分逻辑在 web 端和小程序端需要使用不同的实现，该部分代码可以抽离成一个单独的模块或者插件，暴露接口给业务端代码使用。在模块内可以使用上述提到的 `process.env.isMiniprogram` 环境变量进行判断区分当前运行环境。比如上述提到的 actionSheet 实现就可以抽离成一个 vue 插件实现。

> PS：注意这里使用 process.env.isMiniprogram 环境变量时尽量不要加其他动态条件，以方便 webpack 编译时剪除死代码，比如 `if (false) { console.log('xxxx') }` 就属于死代码

```js
// 正确使用方式
if (!process.env.isMiniprogram) {
    // web 端
    if (isIPhone) {
        // do something
    }
}

// 错误使用方式
if (!process.env.isMiniprogram && isIPhone) {
    // web 端
    // do something
}
```

3. 如果需要使用第三方库，尽量选择使用轻量的库，以缩减构建出来的代码体积。
4. vue 组件命名尽量不要和小程序内置组件同名。
5. 避免使用 id 选择器、属性选择器，尽量少用标签选择器和 * 选择器，尽可能使用 class 选择器代替。
6. 为了确保模板解析不出问题，标签上布尔值属性建议使用 = 号赋值的写法，如下例子所示：

```html
<input type="checkbox" checked="checked" />
<input type="checkbox" :checked="{{true}}" />
```
