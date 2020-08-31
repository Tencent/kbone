# Kbone + 云开发直播课程

## 修改小程序配置信息

进入 `src/list.vue`

将 appid、env 替换成你的

```
await this.wxcloud.init({
  appid: 'your appid',
  env: 'your env'
})
```

进入 `build/miniprogram.config.js`

将 appid 替换成你的

```
projectConfig: {
  appid: 'your appid',
}
```

## 安装依赖

```
npm i
```

## 运行项目

### web 端 

```
npm run web
```

### 小程序

```
npm run mp
```

进入 dist/mp，安装依赖

```
npm i
```

用微信开发者工具将 dist/mp 目录作为小程序项目导入之后，点击工具栏下的`构建 npm`，即可预览效果。

## 部署云函数

在微信开发者工具，右键点击 `cloudfunctions` 选择云环境

进入云函数 `cloudfunctions/add`，安装依赖

```
npm i
```

右键点击 `cloudfunctions/add` 部署云函数

## 云开发配置未登录模式

设置 -> 权限设置，选择环境，开启未登录用户访问权限

云函数 -> 云函数权限，自定义安全规则，设置为 允许所有用户访问

数据库 -> 数据权限，选择集合，demo中是test，自定义安全规则，所有用户可读写

```
{
  "read": true,
  "write": true
}
```

