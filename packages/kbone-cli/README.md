## kbone-cli

``` bash
npx kbone-cli init my-app
cd my-app
npm start      //开发小程序
npm run web    //开发 Web
npm run build  //发布 Web
```

## 目录说明

### React 或 Preact



### Vue


### Omi

```
├─ build
│  ├─ mp     //微信开发者工具指向的目录，用于生产环境
│  ├─ web    //web 编译出的文件，用于生产环境
├─ config
├─ public
├─ scripts
├─ src
│  ├─ assets
│  ├─ components    //存放所有页面的组件
│  ├─ models        //存放所有模型
│  ├─ stores        //存放页面的 store
│  ├─ log.js        //入口文件，会 build 成  log.html
│  └─ index.js      //入口文件，会 build 成  index.html


# License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
