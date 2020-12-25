module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		index: [
			'/',
		],
	},	
	redirect: {		
		notFound: 'index',		
		accessDenied: 'index',
	},	
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},	
	global: {
		extra: {
			navigationBarTextStyle: 'black',
		},
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo2',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}