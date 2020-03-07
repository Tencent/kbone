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
	generate: {
		appEntry: 'miniprogram-app',
	},
	runtime: {
		cookieStore: 'memory',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	global: {
		share: true,
	},
	pages: {
		page1: {
			extra: {
				navigationBarTitleText: 'page1',
			},
		},
	},
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo5',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}