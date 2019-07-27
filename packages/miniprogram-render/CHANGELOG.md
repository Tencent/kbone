# 更新日志

## 0.0.6

* 修复 localStorage/sessionStorage 中 key 接口和 length 属性返回不准确的问题

## 0.0.7

* 修复通过 setAttribute 设置 width/height 没有重新渲染 img 的问题
* 调用 setAttribute 设置布尔值去掉转化为字符串的逻辑，以便 vue 可以直接设置布尔值
* 获取不存在的 attribute（除了 id/class/style 之外）调整为不返回空字符串，直接返回 undefined
* setAttribute 支持设置 undefined

## next version

* 废弃不支持节点和 wx-component 节点的 $$content 属性
