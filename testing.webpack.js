var path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	webpack = require('webpack');

module.exports = {
    cache: false,
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['', '.js'],
      modulesDirectories: ['node_modules']
    },
	module: {
		// preLoaders: [{
		// 	test: /\.js?$/,
		// 	include: /app/,
		// 	exclude: /(node_modules|__tests__)/,
		// 	loader: 'babel-istanbul',
		// 	query: {
		// 		cacheDirectory: true,
		// 	},
		// }],
		loaders: [
			{
				test: /\.less$/,
				exclude: [/node_modules/],
				loader:  'style!css!less'
			}, {
				test: /\.css$/, 
				exclude: [/node_modules/],
				loader:  ExtractTextPlugin.extract('style', 'css-loader?sourceMap!postcss-loader')
			}, { 
				test: /\.svg$/,
				exclude: ['node_modules'],
				loader: 'url-loader?minetype=image/svg+xml'
			}, {
				test: /\.(png|jpg|jpeg|woff|woff2|gif|eot)$/,
				exclude: [/node_modules/],
				loader: 'file'
			}, {
		        test: /\.js$/,
		        loader: 'babel-loader',
		        exclude: /node_modules/,
		        query: {
		          presets: ['es2015']
		        }
		    }
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	]
}
