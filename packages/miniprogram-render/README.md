# miniprogram-render

## 介绍

这是一个 dom 环境模拟工具，它为小程序而设计，用于提供 dom 接口给开发者使用。

> 可以认为这是一个跑在小程序 appService 上的一个超轻量级 jsDom

## 安装

```
npm install --save miniprogram-render
```

## 使用

```js
const mp = require('miniprogram-render')

```js
Page({
    onLoad() {
        // 创建页面
        const { pageId, window, document } = mp.createPage(this.route, config)
        this.pageId = pageId

        // 设置页面的 url
        window.$$miniprogram.setRealUrl('http://test.miniprogram.com')
        // 初始化页面
        window.$$miniprogram.init()
    },
    onUnload() {
        // 销毁页面
        mp.destroyPage(this.pageId)
    },
})
```

## 接口

### createPage(route, config)

创建页面。

| 参数 | 类型 | 描述 |
|---|---|---|
| route | String | 页面路由，即小程序页面实例的 route 属性 |
| config | Object | 页面全局配置，这个配置是小程序维度的，所有页面都共用一个 config 对象，每次创建页面传入的 config 会覆盖当前已有的 config 对象 |

```js
const page1 = mp.createPage('/pages/home/index', config1) // 传入 config1
const page2 = mp.createPage('/pages/home/index', config2) // 传入 config2

// 后传入的 config2 会覆盖 config1，即所有页面都会使用 config2，config1 相当于被废弃的，不会再被使用到
```

> PS：config 的覆盖规则设计是为了保证多个页面能共用一份配置，以确保页面的表现一致

#### config

同 `mp-webpack-plugin` 的[配置参数](https://github.com/wechat-miniprogram/miniprogram-vue/blob/master/docs/quickstart.md#%E7%BC%96%E5%86%99-webpack-%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE)。

### destroyPage(pageId)

销毁页面。

## dom 扩展

为了更好地适配小程序端接口，此工具在原有的 dom 接口之上进行了扩展。

### window.$$miniprogram

挂在 window 对象下的一个特殊对象，用于对页面作一些初始化工作（主要针对小程序页面路由相关）

| 属性名 | 类型 | 描述 |
|---|---|---|
| window | Object | 对象所属页面的 window 对象 |
| document | Object | 对象所属页面的 document 对象 |
| config | Object | 创建页面时传入的 config |

#### init(url)

初始化页面，如果需要页面跳转逻辑，则此方法必须被执行。

| 参数 | 类型 | 描述 |
|---|---|---|
| url | String | 页面初始 url |

#### getMatchRoute(pathname)

根据传入的 url pathname 来获取匹配的小程序页面路由。

### window: pagenotfound 事件

当跳转到一个不存在的页面时触发。

* event.type：页面跳转类型，jump 表示当前页面跳转，open 表示新开页面
* event.url：目标页面的 url

### window: pageaccessdenied 事件

当跳转到一个被禁止访问的页面时触发，通常跳转非同源页面时会触发。

* event.type: 页面跳转类型，jump 表示当前页面跳转，open 表示新开页面
* event.url: 目标页面的 url

### window: reachbottom 事件

当页面上拉触底时触发，前提是必须开启对应的配置。

### window: pulldownrefresh 事件

当下拉刷新页面时触发，前提是必须开启对应的配置。

### dom: $$domNodeUpdate 事件

当前节点有更新时触发。

### dom: $$childNodesUpdate 事件

儿子节点有更新时触发。

> PS：注意此处孙子节点更新是不会触发的。
