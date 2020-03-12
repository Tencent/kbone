module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/view1',
	router: {
		index: ['/view1', '/view2'],
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
        projectname: 'kbone-demo16',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}