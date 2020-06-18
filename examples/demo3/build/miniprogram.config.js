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
		renderVersion: 'latest',
		elementVersion: 'latest',
	},
	runtime: {
		// wxComponent: 'noprefix',
		wxComponent: 'default',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	global: {
		windowScroll: true,
	},
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo3',
	},	
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}