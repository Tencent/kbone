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
	generate: {
        appWxss: 'none',
	},
	runtime: {
		// wxComponent: 'noprefix',
		wxComponent: 'default',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},	
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo3',
	},	
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}