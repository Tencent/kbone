module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page2: ['/'],
		page3: ['/'],
		page4: [
			'/spa',
			'/spa/a',
			'/spa/b',
		],
	},	
	redirect: {		
		notFound: 'page2',		
		accessDenied: 'page2',
	},
	generate: {
		app: 'noemit',
		subpackages: {
			package1: ['page2'],
			package2: ['page3', 'page4'],
		},
	},
	pages: {
		page2: {
			windowScroll: true,
		},
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}