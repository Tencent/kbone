module.exports = {
	"origin": "https://test.miniprogram.com",
	"entry": "/",
	"router": {
		"page1": [
			{
				"regexp": "^\\/(?:\\/)?$",
				"options": "i"
			}
		],
		"page2": [
			{
				"regexp": "^\\/detail(?:\\/)?$",
				"options": "i"
			}
		]
	},
	"runtime": {
		"subpackagesMap": {
			"page1": "package1",
			"page2": "package1"
		},
		"tabBarMap": {},
		"usingComponents": {}
	},
	"pages": {
		"page1": {},
		"page2": {}
	},
	"redirect": {
		"notFound": "page1",
		"accessDenied": "page1"
	},
	"optimization": {}
}