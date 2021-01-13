module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/',
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	global: {
		rem: true, // 是否支持 rem
        pageStyle: true, // 是否支持修改页面样式
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
        projectname: 'kbone-demo29',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}