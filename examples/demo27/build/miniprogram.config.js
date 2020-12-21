module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/test',
	router: {
		index: ['/test'],
	},
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
	},
	generate: {
		appWxss: 'display',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo27',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}