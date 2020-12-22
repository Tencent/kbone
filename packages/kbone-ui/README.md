# kbone-ui

## 和小程序端的不同

* 布尔值属性，小程序端传入空串会认为是 false，而 Web 端传入空串会认为是 true，建议 true 直接传入 'true' 字符串，false 直接传入 'false' 字符串
* 对象/数组值属性，小程序端可以传入对象/数组，也可以传入字符串，而 Web 端只支持字符串，所以建议所有对象/数组值属性，都将值序列化成 json 串传入
* tagName 不同，小程序端的 tagName 统一为 WX-COMPONENT，Web 端则为正常的 tagName，建议使用 behavior 属性进行判断
