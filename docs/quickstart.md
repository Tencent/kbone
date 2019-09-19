## 使用 kbone-cli 快速创建项目

对于新项目，可以使用 `kbone-cli` 来创建项目，首先安装 `kbone-cli`:

```
npm install -g kbone-cli
```

创建项目：

```
kbone init my-app
```

进入项目，按照 README.md 的指引进行开发：

```
// 开发小程序端
npm run mp

// 开发 Web 端
npm run web

// 构建 Web 端
npm run build
```

## 手动配置项目

此方案基于 webpack 构建实现，如果你想要更灵活的搭建自己的项目，又或者是已有项目，则需要自己补充对应配置来实现 kbone 项目的构建，[点此查看](./tutorial.md)具体配置方式。
