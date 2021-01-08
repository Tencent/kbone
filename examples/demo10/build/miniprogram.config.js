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
					props: ['prefix', 'suffix', 'testObj', 'testArr', 'testDefaultVal'],
					propsVal: ['', '', {}, [], 'hello kbone'],
					events: ['someevent'],
				},
				'comp-b': {
					path: 'comp-b/index',
					props: ['prefix', 'name'],
				},
				'comp-c': 'comp-c',
			},
		},
		// weui: true,
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo10',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}