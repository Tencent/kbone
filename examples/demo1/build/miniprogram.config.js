module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/test/aaa',
	router: {
		index: [
			'/test/aaa',
			'/test/bbb',
		],
	},
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
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
        projectname: 'kbone-demo1',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}