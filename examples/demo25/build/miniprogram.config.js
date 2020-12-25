module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page1: ['/page1.html'],
		page2: ['/page2.html'],
		page3: ['/page3.html'],
	},	
	redirect: {		
		notFound: 'page1',		
		accessDenied: 'page1',
	},
	generate: {
		worker: true,
		subpackages: {
			package1: ['page3'],
		},
	},
	runtime: {
		cookieStore: 'globalstorage',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo25',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}