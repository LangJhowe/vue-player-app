'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//部分qq音乐的api接口不能直接通过jsonp访问,需要通过官方的代理
//类似与后端node写法
const express = require('express')  
const axios = require('axios')  
const app = express()  
var apiRoutes = express.Router()  
app.use('/api', apiRoutes)  

//从真实的qq服务器地址,通过axios发送请求，同时修改referer，host成qq相关的host，在发送请求
//得到响应
// 旧版本如下，新版在devServer设置
// apiRoutes.get('/getDiscList', function (reg,res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   // var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
//   console.log('apiRoutes.get')
//   axios.get(url, {
//     headers: {
//       referer: 'https://y.qq.com/',
//       host: 'c.y.qq.com'  //欺骗
//     },
//     params: req.query
//   }).then((response) => {
//     res.json(response.data)
//   }).catch((e) => {
//     console.log(e)
//   })
// })
//这句话的意思是 当请求的路径为/api下的时候 就扔给apiRoutes路由处理
// app.use('/api', apiRoutes)
//部分qq音乐的api接口不能直接通过jsonp访问,需要通过官方的代理

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app){
    // 由于请求的referer和host不同，所以前端不能拿到数据，需要后端做一个代理
    // 后端向有数据的服务端发送请求，拿到数据，然后前端在向自己的服务器请求那数据
    // 这里使用axios实现ajax请求：axios是一个基于promise的HTTP库，可以用于浏览器和node.js
    // 在浏览器创建XMLHttpRequest对象，从node.js创建http请求
      //获取歌单
      app.get('/api/getDiscList', function (req, res) {//这里的路径是给前端发送请求的url  
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg' 
        // axios发送get请求，可以自己配置config 
        axios.get(url, {  
          headers: {  
            // referer: 'https://y.qq.com/portal/playlist.html'  
            referer: 'https://y.qq.com/',  
            host: 'c.y.qq.com'  
          },  
          //  params是即将与请求一起发送的url参数，无格式对象/URLSearchParams对象
          params: req.query  
        }).then((response) => {  
          res.json(response.data)  //返回数据
        }).catch((e) => {  
          console.log(e)  
        })  
      })
      // 获取歌词
      app.get('/api/lyric', function (req, res) {  
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'  
        axios.get(url, {  
          headers: {  
            referer: 'https://y.qq.com/',  
            host: 'c.y.qq.com'  
          },  
          params: req.query  
        }).then((response) => {
        // 是jsonp要编译json
        var ret = response.data
        if (typeof ret === 'string') {
          var reg = /^\w+\(({[^()]+})\)$/
          // \w 以单词a-z，A-Z开头，一个或多个
          // 转义括号以（）开头结尾
          // （）是用来分组
          // 【^()】不以左括号/右括号的字符+多个
          // {}大括号也要匹配到
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
            // 对匹配到的分组的内容进行转换
          }
        }
          res.json(ret)
        }).catch((e) => {  
          console.log(e)  
        })  
      }),
      // 获取推荐歌单的歌曲
      app.get('/api/recommendlist', function (req, res) {  
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'  
        axios.get(url, {  
          headers: {  
            referer: 'https://y.qq.com/',  
            host: 'c.y.qq.com'  
          },  
          params: req.query  
        }).then((response) => {
          console.log(response)  
          var ret = response.data
        if (typeof ret === 'string') {
          var reg = /^\w+\(({[^()]+})\)$/
          // \w 以单词a-z，A-Z开头，一个或多个
          // 转义括号以（）开头结尾
          // （）是用来分组
          // 【^()】不以左括号/右括号的字符+多个
          // {}大括号也要匹配到
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
            // 对匹配到的分组的内容进行转换
          }
        }
          res.json(ret)
        }).catch((e) => {  
          console.log(e)  
        })  
      }) 
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
