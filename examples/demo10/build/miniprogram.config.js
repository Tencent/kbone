const path = require('path')

module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/',
	router: {
		index: ['/'],
		other: ['/other'],
	},
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
	},
	generate: {
		subpackages: {
			package: ['other'],
		},
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
				// external-class 使用，建议使用 addGlobalClass 代替
				'comp-e': {
					path: 'comp-e/index',
					props: ['my-class'], // my-class 是 external-class
					externalWxss: ['other'], // external-class 样式所在的页面，注意如果是在分包里面，该页面样式会被构建到主包
					// externalWxss: `.external-red {color: red;}` // 也支持直接传内容
				},
			},
		},
		// weui: true, // 是否使用 weui
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