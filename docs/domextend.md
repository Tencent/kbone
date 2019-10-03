## dom/bom 扩展 API

为了更好地适配小程序端接口，此方案在原有的 dom 接口之上进行了扩展。

* [window 对象](#window-对象)
* [document 对象](#document-对象)
* [dom 对象](#dom-对象)

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

> PS：慎用此方法，因为会清理掉所有地方绑定的事件句柄。

#### window.$$getComputedStyle

小程序中 window.getComputedStyle 的替代实现，返回一个 promise。

| 参数 | 类型 | 描述 |
|---|---|---|
| dom | String | dom 节点 |
| computedStyle | Array\<String\> | 指定样式名列表 |

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

#### window.$$forceRender

强制清空 setData 队列进行渲染。

#### window.$$getPrototype

获取 dom/bom 对象的原型，用于对其做一些扩展改造。

| 参数 | 类型 | 描述 |
|---|---|---|
| descriptor | String | 描述字符串 |

描述字符串支持的列表如下：

* window.location
* window.navigator
* window.performance
* window.screen
* window.history
* window.localStorage
* window.sessionStorage
* window.event
* window
* document
* element.attribute
* element.classList
* element.style
* element
* textNode
* comment

```js
const locationPrototype = window.$$getPrototype('window.location') // location 对象的 prototype

const elementPrototype = window.$$getPrototype('element') // 普通节点的 prototype
const textNodePrototype = window.$$getPrototype('textNode') // 文本节点的 prototype
```

#### window.$$extend

对 dom/bom 对象进行扩展。

| 参数 | 类型 | 描述 |
|---|---|---|
| descriptor | String | 描述字符串，值同 [window.$$getPrototype](#windowgetprototype) 接口 |
| options | Object | 扩展对象 |

```js
// 对 location 对象进行扩展
window.$$extend('window.location', {
    testStr: 'I am location',
    testFunc() {
        return `Hello, ${this.testStr}`
    },
})

console.log(window.location.testFunc()) // 输出 Hello, I am location
```

#### window.$$addAspect

对 dom/bom 对象方法追加前置/后置处理。

| 参数 | 类型 | 描述 |
|---|---|---|
| descriptor | String | 描述字符串 |
| func | Function | 处理方法 |

描述字符串的值类似 [window.$$getPrototype](#windowgetprototype) 接口的描述字符串，只是后续追加了方法和类型，比如 `element.hasChildNodes.before` 即表示在 element.hasChildNodes 方法追加前置处理。

前置处理即表示此方法会在执行原始方法之前执行，后置处理则是在之后执行。前置处理方法接收到的参数和原始方法接收到的参数一致，后置处理方法接收到的参数则是原始方法执行后返回的结果。

```js
const div = document.createElement('div')
div.count = 0

const beforeAspect = function(arg) {
    // 在执行 div.hasChildNodes 前被调用
    console.log(arg) // 输出调用 div.hasChildNodes 时传入的参数
    if (this.count === 50) return true // 如果返回 true，则中断方法执行，不会再执行原始方法
    this.count++
}
const afterAspect = function(res) {
    // 在执行 div.hasChildNodes 后被调用
    console.log(res) // 输出调用 div.hasChildNodes 的返回值

    this.count++
}
window.$$addAspect('element.hasChildNodes.before', beforeAspect)
window.$$addAspect('element.hasChildNodes.after', afterAspect)
div.hasChildNodes('abc') // 返回 false
div.count // 输出 2
```

#### window.$$removeAspect

移除对 dom/bom 对象方法追加前置/后置处理。

| 参数 | 类型 | 描述 |
|---|---|---|
| descriptor | String | 描述字符串，值同 [window.$$addAspect](#windowaddaspect) 接口 |
| func | Function | 处理方法 |

```js
window.$$removeAspect('element.hasChildNodes.before', beforeAspect)
window.$$removeAspect('element.hasChildNodes.after', afterAspect)
```

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

#### window: wxload 事件

即小程序页面的 onLoad 生命周期回调。

#### window: wxshow 事件

即小程序页面的 onShow 生命周期回调。

#### window: wxready 事件

即小程序页面的 onReady 生命周期回调。

#### window: wxhide 事件

即小程序页面的 onHide 生命周期回调。

#### window: wxunload 事件

即小程序页面的 onUnload 生命周期回调。

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

> PS：慎用此方法，因为会清理掉所有地方绑定的事件句柄。

#### document.$$setCookie

处理 wx.request 返回的 Set-Cookie 头，并存入 document.cookie 中。

```js
wx.request({
    method: 'GET',
    url: '/cgi/xxx',
    success(res) {
        const setCookie = res.header['Set-Cookie']
        document.$$setCookie(setCookie)

        console.log(document.cookie)
    },
})
```

### dom 对象

#### dom.$$trigger

同 [window.$$trigger](#windowtrigger)。

#### dom.$$clearEvent

同 [window.$$clearEvent](#windowclearevent)。

> PS：慎用此方法，因为会清理掉所有地方绑定的事件句柄。

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

#### dom.$$getContext

获取小程序组件的 context 对象，返回一个 promise。

> PS：此接口是小程序的 SelectorQuery 的二次封装

```js
document.querySelector('video').$$getContext().then(context => {
    // 这里的 context 仅限于文档中支持的那些：https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.context.html
})
```

#### dom.$$getNodesRef

获取小程序组件的 NodesRef 对象，返回一个 promise。

> PS：此接口是小程序的 SelectorQuery 的二次封装

```js
document.querySelector('video').$$getNodesRef().then(nodesRef => {
    // NodesRef 对象文档：https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.html
    nodesRef.node(res => {
        console.log(res.node)
    }).exec()
})
```

#### dom: $$domNodeUpdate 事件

当前节点有更新时触发。

#### dom: $$childNodesUpdate 事件

儿子节点有更新时触发。

> PS：注意此处孙子节点更新是不会触发的。


