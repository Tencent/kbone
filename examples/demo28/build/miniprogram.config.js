module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		index: ['/'],
	},
	redirect: {		
		notFound: 'index',		
		accessDenied: 'index',
	},
	generate: {
		weui: true,
		appWxss: 'display',
	},
	app: {
		navigationStyle: "custom",
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo28',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}