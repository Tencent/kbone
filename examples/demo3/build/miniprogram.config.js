const path = require('path')

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
	generate: {
		appWxss: 'none',
		renderVersion: 'latest',
		elementVersion: 'latest',
	},
	runtime: {
		// wxComponent: 'noprefix',
		wxComponent: 'default',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	global: {
		windowScroll: true,
		loadingView: path.join(__dirname, '../src/loading-view'),
		loadingViewName: 'loading',
	},
	optimization: {
		// setDataMode: 'original',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo3',
	},	
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}