module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/index2',
	router: {
		index: [
			'/index',
		],
		index2: [
			'/index2'
		],
	},
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	appExtraConfig: {
		useExtendedLib: {
			kbone: true,
		},
	},
	pages: {
		index: {
			extra: {
				disableScroll: true,
			},
		},
		index2: {
			extra: {
				disableScroll: true,
			},
		},
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
		projectname: 'kbone-demo33',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}