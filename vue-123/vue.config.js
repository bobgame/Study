
module.exports = {
  publicPath: "./", // 构建好的文件输出到哪里
  configureWebpack: (config) => {
    if(process.env.NODE_ENV === 'production'){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  css: {
    sourceMap: false
  }
}