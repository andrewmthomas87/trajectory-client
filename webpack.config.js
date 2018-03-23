const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractLess = new ExtractTextPlugin({ filename: '[name].css' })	// [name] resolves to name of bundle (e.g., app)

const commonConfig = {
	context: path.resolve('./src'),
	devtool: 'eval',
	entry: { app: '.' },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.(less|css)$/,
				use: extractLess.extract({
					use: [
						{
							loader: 'css-loader',
							options: { importLoaders: 1 }
						},
						{ loader: 'postcss-loader' },
						{ loader: 'less-loader' }
					],
					fallback: 'style-loader'
				})
			}
		]
	},
	output: {
		filename: '[name].js',	// [name] resolves to name of bundle (e.g., app)
		path: path.resolve('./build')
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		extractLess
	],
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		modules: [
			path.resolve('./src'),
			'node_modules'
		]
	},
	target: 'web'
}

module.exports = commonConfig
