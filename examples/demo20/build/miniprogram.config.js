const path = require('path')
const getPageList = require('./utils/getPageList')
const list = getPageList(path.resolve(__dirname, '../src/pages'))
const isDevelop = process.env.NODE_ENV === 'development'

const router = list.reduce((r,page) => {
	r[page.name] = ['/' + page.name]
	return r
}, {})

module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/',
	router: router,
	redirect: {
		notFound: 'page1',
		accessDenied: 'page1',
	},
	generate: {
		appEntry: 'miniprogram-app',
		autoBuildNpm: !isDevelop,	// 自动构建npm，影响打包速度
		subpackages: {
			package1: ['page2'],
			package2: ['page3'],
		}
	},
	runtime: {
		cookieStore: 'default',
	},
	app: {
		navigationBarTitleText: '子页面',
	},
	pages: {
		page1: {
			extra: {
				navigationBarTitleText: '父页面',
			},
		},
	},
	projectConfig: {
		appid: '',
		projectname: 'kbone',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
	global: {
		reachBottom: true,
		rem: true
	}
}
