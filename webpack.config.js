const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebPackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const PurifycssWebpack =require('purifycss-webpack')
const glob = require('glob')

const LessExtract = new ExtractTextWebpackPlugin({
  filename: 'css/less.css',
  disable: false // 开发时禁用(无热更新)
})

const CssExtract = new ExtractTextWebpackPlugin({
  filename: 'css/css.css',
  disable: false
})

module.exports = {
  entry: './src/index.js',
  // entry: ['./src/index.js', './src/other.js']
  // entry: { // 多入口
  //   index: './src/index.js',
  //   other: './src/other.js'
  // },
  output: {
    // filename: '[name].[hash:8].js',
    filename: 'build.[hash:8].js',
    path: path.resolve('./build') // 绝对路径
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: CssExtract.extract({
          fallback: 'style-loader',
          use: [
            // {
            //   loader: 'style-loader'
            // },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      {
        test: /\.less$/,
        use: LessExtract.extract({
          fallback: 'style-loader',
          use: [
            // {
            //   loader: 'style-loader'
            // },
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader'
            }
            // {
            //   loader: 'postcss-loader'
            // }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      // chunks: ['index']
      // title: 'My App',
      // hash: true, // 清除缓存
      // minify: { // 压缩
      //   removeAttributeQuotes: true,
      //   collapseWhitespace: true
      // }
    }),
    // new HtmlWebPackPlugin({
    //   template: './src/index.html',
    //   filename: 'other.html'
    // }),
    // 消除没用到的css 放在htmlwebpackplugin后面
    new PurifycssWebpack({
      paths: glob.sync(path.resolve('src/*.html'))
    }),
    new CleanWebPackPlugin(['./build']),
    // new ExtractTextWebpackPlugin({
    //   filename: 'css/index.css'
    // })
    CssExtract,
    LessExtract
  ],
  mode: 'development',
  resolve: {},
  devServer: {
    contentBase: './build',
    port: 8080,
    compress: true,
    open: true, // 自动打开浏览器
    hot: true
  }
}