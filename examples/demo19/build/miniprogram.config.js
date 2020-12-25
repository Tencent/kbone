const path = require('path')

module.exports = {	
	origin: 'https://test.miniprogram.com',	
	entry: '/index',	
	router: {		
		inde: ['/index'],
		userconsole: ['/userconsole'],
		storageconsole: ['/storageconsole'],
		databaseguide: ['/databaseguide'],
		deployfunctions: ['/deployfunctions'],
		chooselib: ['/chooselib'],
	},	
	redirect: {		
		notFound: 'index',		
		accessDenied: 'index',
	},
	generate: {
		appEntry: 'miniprogram-app',
		appWxss: 'display',
		projectConfig: path.join(__dirname, '../dist/mp'),
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	pages: {
		userconsole: {
			extra: {
				navigationBarTitleText: '用户管理指引',
			},
		},
		storageconsole: {
			extra: {
				navigationBarTitleText: '文件存储指引',
			},
		},
		databaseguide: {
			extra: {
				navigationBarTitleText: '数据库指引',
			},
		},
		deployfunctions: {
			extra: {
				navigationBarTitleText: '部署云函数',
			},
		},
		chooselib: {
			extra: {
				navigationBarTitleText: '选择基础库',
			},
		},
	},
	app: {
		backgroundColor: '#F6F6F6',
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#F6F6F6',
		navigationBarTitleText: '云开发 QuickStart',
		navigationBarTextStyle: 'black',
	},
	appExtraConfig: {
		style: 'v2',
	},
	projectConfig: {
		appid: 'wx14c7c4cd189644a1',
		projectname: 'kbone-demo19',
		miniprogramRoot: 'miniprogram/',
		cloudfunctionRoot: 'cloudfunctions/',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}