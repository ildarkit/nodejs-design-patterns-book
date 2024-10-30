const { resolve, join } = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin-fixxed')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')

module.exports = function (env, argv) {
  const isProd = argv.mode === 'production'
  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/frontend/index.js',
    output: {
      filename: 'main.js',
      path: resolve(__dirname, 'public'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        }
      ]
    },
    devtool: isProd ? 'source-map' : 'eval',
    devServer: {
      historyApiFallback: true,
      open: true,
      static: {
        publicPath: '/public',
      },
    },
    optimization: isProd ? {
      minimize: true,
      minimizer: [new TerserPlugin()]
    } : {},
    plugins: isProd ? [] : [
      new HtmlWebpackPlugin({
        title: 'My library',
        meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
      }), 
      new HtmlWebpackTagsPlugin({ tags: ['public/wing.css', 'public/style.css'], append: true }),
      new HtmlWebpackRootPlugin()
    ]
  }
}
