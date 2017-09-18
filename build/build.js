require('./check-versions')()

process.env.NODE_ENV = 'production' // 生产模式

var ora = require('ora')
var rm = require('rimraf')
var path = require('path') // webpack 内置模块
var chalk = require('chalk')
var webpack = require('webpack') // 打包插件
var config = require('../config') // ../config/index.js 只能省略index.js
var webpackConfig = require('./webpack.prod.conf') // 加载webpack生产包的配置

var spinner = ora('building for production...') // 日志输出插件
spinner.start()

// rm删除上次打包生成的文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
