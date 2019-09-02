## kbone-cli

```bash
$ npm i kbone-cli -g     # install cli
$ kbone init my-app      # init project, you can also exec 'kbone init' in an empty folder
$ cd my-app            # please ignore this command if you executed 'kbone init' in an empty folder
$ npm start            # develop
$ npm run build        # release
```

> `npx kbone-cli init my-app` is also supported(npm v5.2.0+).

Directory description:

```
├─ config
├─ public
├─ scripts
├─ src
│  ├─ assets
│  ├─ elements    //Store all custom elements
│  ├─ store       //Store all this store of pages
│  ├─ admin.js    //Entry js of compiler，will build to admin.html
│  └─ index.js    //Entry js of compiler，will build to index.html
```


# License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
