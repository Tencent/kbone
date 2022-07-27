module.exports = {
	origin: "https://test.miniprogram.com",
	entry: "/",
	router: {
		index: ["/*"]
	},
	redirect: {
		notFound: "index",
		accessDenied: "index"
	},
	generate: {
		autoBuildNpm: "npm",
		globalVars: [["SVGElement", "function SVGElement() {}"]] // 兼容 vue3 3.0.8+ 版本
	},
	app: {
		navigationBarBackgroundColor: "#009b64",
		navigationBarTextStyle: "white",
		navigationBarTitleText: "App"
	},
	projectConfig: {
		appid: "wx14c7c4cd189644a1",
		projectname: "kbone-vue3"
	}
};
