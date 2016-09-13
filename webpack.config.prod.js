var path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, 'app'),
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'app/build'),
		publicPath: '/build/',
		filename: 'bundle.js'
	},
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
				loader:  ExtractTextPlugin.extract('style', 'css-loader')
			},{
				test: /\.less$/, 
				exclude: [/node_modules/], 
				loader:  ExtractTextPlugin.extract('style', 'css-loader!less')
			},{ 
				test: /\.svg$/, 
				exclude: ['node_modules'], 
				loader: 'url-loader?minetype=image/svg+xml'
			},{ 
				test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/, 
				exclude: [/node_modules/], 
				loader: 'file'
			}
		]	
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	],
	postcss: [
	    autoprefixer({
	    	browsers: ['last 10 version', 'IE 8']
	    })
	]
}
