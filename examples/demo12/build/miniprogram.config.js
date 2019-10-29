module.exports = {
  origin: 'https://test.miniprogram.com',
  entry: '/test/aaa',
  router: {
    index: [],
  },
  redirect: {	
    notFound: 'index',	
    accessDenied: 'index',
  },
  generate: {
    globalVars: [
            ['TEST_VAR_STRING', '\'miniprogram\''],
            ['TEST_VAR_NUMBER', '123'],
            ['TEST_VAR_BOOL', 'true'],
            ['TEST_VAR_FUNCTION', 'function() {return \'I am function\'}'],
      ['TEST_VAR_OTHERS', 'window.document'],
      ['CustomEvent'],
        ],
  },
  app: {
    navigationBarTitleText: 'miniprogram-project',
  },
  global: {},
  pages: {},
  optimization: {
    domSubTreeLevel: 5,
    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,
    styleValueReduce: 5000,
    attrValueReduce: 5000,
  },
  projectConfig: {
    appid: '',
    projectname: 'kbone-demo1',
  },
  packageConfig: {
    author: 'wechat-miniprogram',
  },
}