module.exports = {
  publicPath: './', // 构建好的文件输出到哪里
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/camelcase
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  pwa: {
    name: 'Bob123',
    themeColor: '#4c89fe',
    msTileColor: '#4c89fe',
    manifestOptions: {
      start_url: '.',
      background_color: '#4c89fe'
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  }
}
