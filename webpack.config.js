const path = require('path');
const webpack = require('webpack');
const miniCss = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: 'development',
	experiments: {
		topLevelAwait: true,
	},
	entry: {
		main: path.resolve(__dirname, './src/index.js')
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].bundle.js'
	},
	devServer: {
        historyApiFallback: true,
        compress: true,
        port: 8080,
		static: {
			directory: path.join(__dirname, './index.html')
		},
    },
	module: {
		rules: [
			{
				test:/\.sass$/,
				use: [
					miniCss.loader,
					'css-loader',
					'sass-loader',
				]
			},
			{
				test:/\.svg$/,
				use: CopyPlugin
			}
		]
	 },
	plugins: [
		new miniCss({
			filename: 'style.css',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "./assets/icons"),
					to: path.resolve(__dirname, "./dist")
				},
			],
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}