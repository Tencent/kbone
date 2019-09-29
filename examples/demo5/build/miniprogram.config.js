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
		app: 'miniprogram-app',
	},
	runtime: {
		cookieStore: 'storage',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},	
	global: {},	
	pages: {},	
	optimization: {
		domSubTreeLevel: 5,

		elementMultiplexing: true,
		textMultiplexing: true,
		commentMultiplexing: true,
		domExtendMultiplexing: true,

		styleValueReduce: 5000,
		attrValueReduce: 5000,
	},
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo5',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}