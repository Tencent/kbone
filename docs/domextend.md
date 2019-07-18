## dom/bom 扩展 api

为了更好地适配小程序端接口，此方案在原有的 dom 接口之上进行了扩展。

### window 对象

#### window.$$miniprogram

挂在 window 对象下的一个特殊对象，用于对页面作一些初始化工作（主要针对小程序页面路由相关）

| 属性名 | 类型 | 描述 |
|---|---|---|
| window | Object | 对象所属页面的 window 对象 |
| document | Object | 对象所属页面的 document 对象 |
| config | Object | 创建页面时传入的 config |

* init(url)

初始化页面，如果需要页面跳转逻辑，则此方法必须被执行。

| 参数 | 类型 | 描述 |
|---|---|---|
| url | String | 页面初始 url |

* getMatchRoute(pathname)

根据传入的 url pathname 来获取匹配的小程序页面路由。

#### window.$$trigger

触发当前节点事件。与 dispatchEvent 不同的是，$$trigger 不会触发事件的捕获、冒泡阶段，只对绑定在节点上的事件句柄按顺序执行一遍。

| 参数 | 类型 | 描述 |
|---|---|---|
| eventName | String | 事件名称 |
| options | Object | 配置 |
| options.event | Object | 事件句柄接收到的事件对象 |
| options.isCapture | Boolean | 是否触发捕获事件句柄，默认是 false |

```js
window.$$trigger('ready')
window.$$trigger('beforeunload', {
    event: new window.CustomEvent('beforeunload'),
    isCapture: false,
})
```

#### window.$$clearEvent

清空某个事件的所有句柄。

| 参数 | 类型 | 描述 |
|---|---|---|
| eventName | String | 事件名称 |
| isCapture | Boolean | 是否清空捕获事件句柄，默认是 false |

#### window.$$getComputedStyle

小程序中 window.getComputedStyle 的替代实现，返回一个 promise。

| 参数 | 类型 | 描述 |
|---|---|---|
| dom | String | dom 节点 |
| computedStyle | Array<String> | 指定样式名列表 |

```js
window.$$getComputedStyle(document.body, ['backgroundColor']).then(res => {
    console.log(res.backgroundColor)
})

window.$$getComputedStyle(document.querySelector('div'), ['backgroundColor']).then(res => {
    console.log(res.backgroundColor)
})
```

#### window.$$createSelectorQuery

相当于 wx.createSelectorQuery，用法可参考[官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html)。

#### window.$$createIntersectionObserver

相当于 wx.createIntersectionObserver，用法可参考[官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html)。

#### window.onShareAppMessage

开启 share 配置后，当进行页面分享时会执行的回调。此回调可以返回一个对象，作为小程序处理分享的参数。

| 属性名 | 类型 | 描述 |
|---|---|---|
| data | Object | 小程序被分享页面 onShareAppMessage 回调传入的参数，可参考[官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object) |

```js
window.onShareAppMessage = function(data) {
    // 当页面被分享时会进入这个回调
    // 返回一个对象，作为小程序处理分享的参数，对象内容和小程序页面 onShareAppMessage 回调可返回对象内容基本一致，具体可参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
    return {
        title: 'test title',
        path: '/home/index', // 这里的 path 是页面 url，而不是小程序路由
    }
}
```

> PS：返回的对象中，path 是要分享页面的 url，而不是页面路由。如果不返回默认取 window.locaiton.href。

#### window.onDealWithNotSupportDom

渲染时遇到不支持的 dom 节点会执行的回调。

| 属性名 | 类型 | 描述 |
|---|---|---|
| dom | Object | 不支持的 dom 节点 |

```js
window.onDealWithNotSupportDom = function(dom) {
    // 渲染时遇到不支持的 dom 节点时会进入这个回调
    if (dom.tagName === 'IFRAME') {
        dom.textContent = '当前小程序版本暂不支持 iframe'
    }
}
```

#### window: pagenotfound 事件

当跳转到一个不存在的页面时触发。

* event.type：页面跳转类型，jump 表示当前页面跳转，open 表示新开页面
* event.url：目标页面的 url

#### window: pageaccessdenied 事件

当跳转到一个被禁止访问的页面时触发，通常跳转非同源页面时会触发。

* event.type: 页面跳转类型，jump 表示当前页面跳转，open 表示新开页面
* event.url: 目标页面的 url

#### window: reachbottom 事件

开启 reachBottom 配置后，当页面上拉触底时会触发此事件。

#### window: pulldownrefresh 事件

开启 pullDownRefresh 配置后，当下拉刷新页面时会触发此事件。

### document 对象

#### document.$$cookie

获取完整的 cookie，相当于请求头附带的 cookie。

```js
// 给请求头设置 cookie
wx.request({
    method: 'GET',
    url: '/cgi/xxx',
    header: {
        cookie: window.document.$$cookie,
    },
    success() {},
})
```

#### document.$$trigger

同 [window.$$trigger](#windowtrigger)。

#### document.$$clearEvent

同 [window.$$clearEvent](#windowclearevent)。

### dom 对象

#### dom.$$trigger

同 [window.$$trigger](#windowtrigger)。

#### dom.$$clearEvent

同 [window.$$clearEvent](#windowclearevent)。

#### dom.$$getBoundingClientRect

小程序中 dom.getBoundingClientRect 的替代实现，返回一个 promise。

> PS：此接口本质上是小程序的 SelectorQuery 的二次封装，如果是 dom 是 document.body，会默认走 scrollOffset 接口，如果是其他 dom 则走 boundingClientRect 接口。

```js
document.body.$$getBoundingClientRect().then(res => {
    // res 的内容可以参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.scrollOffset.html
})

document.querySelector('div').$$getBoundingClientRect().then(res => {
    // res 的内容可以参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.boundingClientRect.html
})
```

#### dom: $$domNodeUpdate 事件

当前节点有更新时触发。

#### dom: $$childNodesUpdate 事件

儿子节点有更新时触发。

> PS：注意此处孙子节点更新是不会触发的。


