module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page1: ['/a'],
		page2: ['/b'],
		page3: ['/c'],
	},	
	redirect: {		
		notFound: 'page1',		
		accessDenied: 'page1',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	appExtraConfig: {
		useExtendedLib: {
			kbone: true,
		},
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
		projectname: 'kbone-demo35',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}