# kbone 开发规范

## 开发流程

首先需要将代码仓库 clone 下来：https://github.com/wechat-miniprogram/kbone，然后切到 develop 分支。

初次将代码 clone 下来后，需要先运行 `npm run prepare` 来完成 lerna 的初始化0，之后才能进入开发的流程：

1. 完成代码开发
2. 补充单元测试
3. 在包内执行 `npm run test` 确保单元测试没有问题
4. 在 kbone 根目录执行 `npm run check` 确保代码检查和所有包单元测试正常
5. 在包内的 CHANGELOG.md 中补充版本更新日志，具体格式可参考 packages/miniprogram-element/CHANGELOG.md
6. 如有必要，需要修改 docs 目录下的文档
7. 提交到 git
8. 在 kbone 根目录执行 `npm run publish` 打标签并发布到 npm

具体规范下面进行说明：

## 目录规范

kbone 是一套同构方案，包含多个包，各个包之间可能会有依赖关系，故采用 lerna 来进行管理。

### 包外结构

```
|-- docs 文档
|-- examples 案例
|     |-- demo1
|     |-- demo2
|     |-- ...
|     |-- README.md 案例说明
|
|-- packages
|-- .eslintignore
|-- .eslintrc.js
|-- .gitignore
|-- lerna.json
|-- LICENSE
|-- package.json
|-- README.md
```

eslint 相关配置所有包统一，所以放到包外。

### 包内结构

```
|-- src 源码
|-- test 单元测试
|-- tool 构建相关代码
|-- .npmignore
|-- CHANGELOG.md 更新日志
|-- package.json
|-- README.md
```

对于部分包需要构建，则构建相关的配置、脚本需要放到 tool 目录下；如果包还有特殊需求，亦可以在不修改现有目录结构的前提下在根目录补充其他文件和目录（如补充 eslint 配置等）。

### 案例结构

```
|-- build
|     |-- miniprogram.config.js kbone 插件配置
|     |-- webpack.config.js Web 端构建配置
|     |-- webpack.mp.config.js 小程序端构建配置
|
|-- src 源码
|-- index.html Web 端入口 html 文件
|-- package.json
```

如果此 demo 不需要 Web 端的展示，可以去掉 Web 端代码；一般情况下尽量遵从此结构来编写案例，但是也允许针对特殊情况调整结构（如 vue-cli3 插件案例）。

## 其他规范

### 代码检查

统一走 eslint 来约束，在 kbone 根目录下执行：`npm run lint` 会对各个包内的 src、test、tool 目录下的 js 文件进行检查，确保无任何规则失败提示。

### 单元测试

各个包内部实现单元测试和覆盖率检查，统一使用 jest 工具链；如果涉及到自定义组件则使用 miniprogram-simulate；如果有 CI 需求，则使用 codecov 来管理覆盖率检查。

包内命令统一为：

```
# 执行单元测试
npm run test

# 调试单元测试
npm run test-debug

# 执行覆盖率检查
npm run coverage

# 接入 CI 覆盖率检查
npm run codecov
```

> PS：可参考 packages/miniprogram-element 的实现。

在包内实现完单元测试后，需要在 kbone 根目录下的 package.json 中补充相应的执行命令，确保在 kbone 根目录下执行 `npm run test` 可以执行所有包内的单元测试。

### 版本规范

参考：https://semver.org/lang/zh-CN/

### commit 信息

格式为 `[变化]: 具体操作`，一条完整的示例：`feature: support camera inner component`。

变化支持如下枚举值：

* feature：新增特性
* fixed：修复 bug
* docs：文档更新
* update：demo、更新日志、构建代码等源码之外的一些更新调整
* refactor：重构
* lint：调整代码以通过代码检查

### 分支

默认开发分支为 develop 分支，如果需要提 pr，则以此分支为基准。当 develop 分支稳定后会合入 master 分支。

创建其他分支的命名规范：

* feature-xxx：新特性分支
* fixed-xxx：bugfix 分支
* refactor-xxx：重构分支

合入流程：

其他分支 ---> develop 分支 ---> master 分支

### CI

目前未接入，待补充。
