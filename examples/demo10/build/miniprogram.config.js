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
				'comp-a': {
					path: 'comp-a',
					props: ['prefix', 'suffix'],
					events: ['someevent'],
				},
				'comp-b': {
					path: 'comp-b/index',
					props: ['prefix'],
				},
				'comp-c': 'comp-c',
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