var path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	webpack = require('webpack');


module.exports = {
	context: path.join(__dirname, 'app'),
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'app/build'),
		publicPath: '/build/',
		filename: 'bundle.js'
	},
	devServer: {
		hot: true
	},
	devtool: 'inline-source-map',
	module: {
		loaders: [
			{
				test: /\.js$/, 
				loader: 'babel-loader', 
				exclude: [/node_modules/], 
				query: { presets: ['es2015'] } 
			},{
				test: /\.html$/, 
				loader: 'raw-loader', 
				exclude: ['/node_modules']
			},{
				test: /\.css$/, 
				exclude: [/node_modules/],
				loader:  ExtractTextPlugin.extract('style', 'css-loader?sourceMap!postcss-loader')
			},{
				test: /\.less$/,
				exclude: [/node_modules/],
				loader:  ExtractTextPlugin.extract('style', 'css-loader?sourceMap!postcss-loader!less?sourceMap')
			},{ 
				test: /\.svg$/,
				exclude: ['node_modules'],
				loader: 'url-loader?minetype=image/svg+xml'
			},{
				test: /\.(png|jpg|jpeg|woff|woff2|gif|eot)$/,
				exclude: [/node_modules/],
				loader: 'file'
			}
		]	
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	]
}
