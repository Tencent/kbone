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
		page5: ['/waterfall'],
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
		page5: {
			reachBottom: true,
		},
	},
	optimization: {
		// setDataMode: 'original',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
		projectname: 'kbone-demo5',
		condition: {
			miniprogram: {
				list: [{
					id: -2,
					name: 'waterfall',
					pathName: 'pages/page5/index',
					query: `type=open&targeturl=${encodeURIComponent('/waterfall')}`,
				}],
			},
		},
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}