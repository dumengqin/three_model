var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	//插件项
	//plugins: [commonsPlugin],
//	devtool: "source-map",
	//页面入口文件配置
	entry: {
		index: './index.js'
	},
	//入口文件输出配置
	output: {
		path: __dirname + '/dist',
		filename: '[name].[hash].js'
	},
	devServer: {
		historyApiFallback: true,
		inline: true,
	},
	module: {
		//加载器配置
		loaders: [{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			},
			{
				test: /\.less/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader!less-loader'
				})
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: [
						['es2015', {
							"modules": false
						}]
					]
				}
			}, {
				test: /\.vue$/,
				loader: 'vue-loader'
			}, {
				test: /\.(ttf|svg|eot|woff|woff2|jpg|png|gif)/,
				loader: "url-loader"
			}, {
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].[hash].css"),
		new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: "jquery",
			"window.jQuery": "jquery",
			THREE: 'three'
		}),
		new HtmlWebpackPlugin({
			template: __dirname + "/index.tmpl.html"
		}),
	]
};