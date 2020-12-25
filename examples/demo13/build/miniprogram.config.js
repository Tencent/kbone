module.exports = {
  origin: 'https://test.miniprogram.com',
  entry: '/test/aaa',
  router: {
    index: ['/test/aaa'],
  },
  redirect: {	
    notFound: 'index',	
    accessDenied: 'index',
  },
  app: {
    navigationBarTitleText: 'miniprogram-project',
  },
  projectConfig: {
    appid: 'wx14c7c4cd189644a1',
    projectname: 'kbone-demo13',
  },
  packageConfig: {
    author: 'wechat-miniprogram',
  },
}