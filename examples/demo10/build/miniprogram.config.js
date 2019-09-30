const path = require('path')

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
		wxCustomComponent: {
			root: path.join(__dirname, '../src/custom-components'),
			usingComponents: {
				'comp-a': 'comp-a',
				'comp-b': 'comp-b/index',
			},
		},
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
        projectname: 'kbone-demo10',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}