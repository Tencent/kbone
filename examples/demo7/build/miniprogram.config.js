module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page1: ['/a'],
		page2: ['/b'],
		page3: ['/c'],
		page4: ['/d/:id'],
	},	
	redirect: {		
		notFound: 'page1',		
		accessDenied: 'page1',
	},
	generate: {
		subpackages: {
			package1: ['page2'],
			package2: ['page3', 'page4'],
		},
		preloadRule: {
			page2: {
				network: 'all',
				packages: ['package2'],
			},
		},
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo7',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}