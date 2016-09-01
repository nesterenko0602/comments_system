var path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	webpack = require('webpack');


var plugins = [
	new ExtractTextPlugin('./styles.css')
];

if (process.env.NODE_ENV == 'production'){
	plugins = plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	]);
}


module.exports = {
	context: path.join(__dirname, 'app'),
	entry: './app.js',
	output: {
		path: path.join(__dirname, 'app/build'),
		filename: './bundle.js'
	},
	devtool: 'source-map',
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
				test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/, 
				exclude: [/node_modules/], 
				loader: 'file'
			}
		]	
	},
	plugins: plugins,
	postcss: [
	    autoprefixer({
	    	browsers: ['last 10 version', 'IE 8']
	    })
	]
}
