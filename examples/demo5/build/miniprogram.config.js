module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page1: ['/a'],
		page2: ['/b'],
		page3: ['/c'],
		page4: [
			'/spa',
			'/spa/a',
			'/spa/c',
		],
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
		pageOrientation: 'auto',
	},
	global: {
		share: true,
		shareTimeline: true,
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