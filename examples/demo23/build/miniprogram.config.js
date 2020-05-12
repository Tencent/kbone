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
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo23',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}