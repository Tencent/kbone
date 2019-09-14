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
        projectname: 'kbone-demo2',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}