/**
 * kbone 配置
 */
const path = require('path')

module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: 'index',
	redirect: {	
		notFound: 'index',	
		accessDenied: 'index',
	},
	generate: {
		// project.config.json 输出位置
		projectConfig: path.join(__dirname, '../dist/mp'),
	},
	app: {
		navigationBarTitleText: 'kbone+云开发课程',
	},
	global: {
		rem: true, // 是否支持 rem
        pageStyle: true, // 是否支持修改页面样式
	},
	projectConfig: {
		appid: 'your appid',
		projectname: 'kbone-cloud',
		// 配置云函数的目录
		miniprogramRoot: 'miniprogram/',
		cloudfunctionRoot: 'cloudfunctions/',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}