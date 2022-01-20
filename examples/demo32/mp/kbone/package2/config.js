module.exports = {
	"origin": "https://test.miniprogram.com",
	"entry": "/",
	"router": {
		"page2": [
			{
				"regexp": "^\\/(?:\\/)?$",
				"options": "i"
			}
		],
		"page3": [
			{
				"regexp": "^\\/(?:\\/)?$",
				"options": "i"
			}
		],
		"page4": [
			{
				"regexp": "^\\/spa(?:\\/)?$",
				"options": "i"
			},
			{
				"regexp": "^\\/spa\\/a(?:\\/)?$",
				"options": "i"
			},
			{
				"regexp": "^\\/spa\\/b(?:\\/)?$",
				"options": "i"
			}
		]
	},
	"generate": {
		"worker": "common/workers"
	},
	"runtime": {
		"subpackagesMap": {
			"page2": "package1",
			"page3": "package2",
			"page4": "package2"
		},
		"tabBarMap": {},
		"usingComponents": {}
	},
	"pages": {
		"page2": {
			"windowScroll": true
		},
		"page3": {},
		"page4": {}
	},
	"redirect": {
		"notFound": "page2",
		"accessDenied": "page2"
	},
	"optimization": {}
}