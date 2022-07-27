const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MpPlugin = require("mp-webpack-plugin"); // 用于构建小程序代码的 webpack 插件
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isOptimize = process.env.NODE_ENV === "production"; // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
	mode: "production",
	stats: "minimal",
	entry: {
		index: path.resolve(__dirname, "../src/main.mp.js")
	},
	output: {
		path: path.resolve(__dirname, "../dist/mp/common"), // 放到小程序代码目录中的 common 目录下
		filename: "[name].js", // 必需字段，不能修改
		library: "createApp", // 必需字段，不能修改
		libraryExport: "default", // 必需字段，不能修改
		libraryTarget: "window" // 必需字段，不能修改
	},
	target: "web", // 必需字段，不能修改
	optimization: {
		runtimeChunk: false, // 必需字段，不能修改
		splitChunks: {
			// 代码分隔配置，不建议修改
			chunks: "all",
			automaticNameDelimiter: "~",
			minSize: 1000,
			minRemainingSize: 0,
			minChunks: 1,
			maxAsyncRequests: 100,
			maxInitialRequests: 100,
			cacheGroups: {
				vue_core: {
					test: /[\\/]node_modules[\\/](@vue[\\/]runtime-core)[\\/]/,
					name: "vue-runtime-core",
					priority: 10
				},
				vue: {
					test: /[\\/]node_modules[\\/](@vue|vue-router|pinia)[\\/]/,
					name: "vue"
				},
				kbone: {
					test: /[\\/]node_modules[\\/](kbone-api)[\\/]/,
					name: "kbone-api"
				},
				vant: {
					test: /[\\/]node_modules[\\/](vant)[\\/]/,
					name: "vant"
				},
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					priority: -10,
					reuseExistingChunk: true
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},

		minimizer: isOptimize
			? [
					// 压缩CSS
					new CssMinimizerPlugin({
						test: /\.(css|wxss)$/g,
						minimizerOptions: {
							preset: [
								"default",
								{
									discardComments: {
										removeAll: true
									},
									minifySelectors: false // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
								}
							]
						}
						// canPrint: false
					}),
					// 压缩 js
					new TerserPlugin({
						test: /\.js(\?.*)?$/i,
						parallel: true
					})
			  ]
			: []
	},
	performance: {
		hints: false
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.vue$/,
				use: ["vue-loader"]
			},
			{
				test: /\.js$/,
				use: ["babel-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: "file-loader",
				options: {
					name: "[name].[ext]?[hash]"
				}
			}
		]
	},
	resolve: {
		extensions: ["*", ".js", ".vue", ".json"],
		alias: {
			"@utils": path.resolve(__dirname, "../src/utils"),
			"@pages": path.resolve(__dirname, "../src/pages"),
			"@components": path.resolve(__dirname, "../src/uiux/components"),
			"@widgets": path.resolve(__dirname, "../src/uiux/widgets"),
			"@uiux": path.resolve(__dirname, "../src/uiux"),
			"@request": path.resolve(__dirname, "../src/request"),
			"@style": path.resolve(__dirname, "../src/style"),
			"@images": path.resolve(__dirname, "../src/assets/images"),
			"@store": path.resolve(__dirname, "../src/store"),
			"@router": path.resolve(__dirname, "../src/router")
		}
	},
	plugins: [
		// new BundleAnalyzerPlugin(),
		new webpack.DefinePlugin({
			"process.env.isMiniprogram": process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
			__VUE_PROD_DEVTOOLS__: false,
			__VUE_OPTIONS_API__: false
		}),
		new MiniCssExtractPlugin({
			filename: "[name].wxss"
		}),
		new VueLoaderPlugin(),
		new MpPlugin(require("./miniprogram.config.js"))
	]
};
