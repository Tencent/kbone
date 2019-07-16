# miniprogram-element

## 介绍

这是一个提供小程序渲染能力给 `miniprogram-render` 使用的自定义组件。

> PS：此自定义组件无法脱离 `miniprogram-render` 使用。

## 安装

```
npm install --save miniprogram-element
```

## 使用

```json
{
    "usingComponents": {
		"element": "miniprogram-element"
	},
}
```

```html
<element data-private-node-id="{{nodeId}}" data-private-page-id="{{pageId}}"></element>
```

pageId 和 nodeId 两个参数缺一不可，组件内部会根据传入的 pageId 找到对应的 window/document，然后根据 nodeId 找到对应的 dom 节点进行渲染。
