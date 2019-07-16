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

#### window.onShareAppMessage

开启 share 配置后，当进行页面分享时会执行的回调。

| 属性名 | 类型 | 描述 |
|---|---|---|
| data | Object | 小程序被分享页面 onShareAppMessage 回调传入的参数，可参考[官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object) |
| currentPagePath | String | 小程序被分享页面的路由 |

示例：

```js
window.onShareAppMessage = function(data, currentPagePath) {
    // 当页面被分享时会进入这个回调
    // 此处可以返回一个对象，作为小程序处理分享的参数，对象内容和小程序页面 onShareAppMessage 回调可返回对象内容一致，具体可参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
    return {
        title: 'test title',
        path: currentPagePath,
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

### dom 对象

#### dom: $$domNodeUpdate 事件

当前节点有更新时触发。

#### dom: $$childNodesUpdate 事件

儿子节点有更新时触发。

> PS：注意此处孙子节点更新是不会触发的。


