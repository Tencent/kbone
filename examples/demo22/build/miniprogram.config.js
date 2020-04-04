module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/',	
	router: {		
		page1: ['/'],
		page2: ['/page2'],
		page3: ['/page3'],
		page4: ['/page4'],
	},	
	redirect: {		
		notFound: 'page1',		
		accessDenied: 'page1',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: '',
        projectname: 'kbone-demo22',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}