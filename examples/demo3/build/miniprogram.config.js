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
	global: {},	
	pages: {},	
	optimization: {
		domSubTreeLevel: 10,
		
		elementMultiplexing: true,
		textMultiplexing: true,
		commentMultiplexing: true,
		domExtendMultiplexing: true,

		styleValueReduce: 5000,
		attrValueReduce: 5000,
	},	
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo3',
	},	
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}