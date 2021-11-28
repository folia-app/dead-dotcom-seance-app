module.exports = {
  lintOnSave: false,

  devServer: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' }
      }
    }
  },

  // force Safari not to cache (dev)
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config
        .output
        .filename('[name].[hash].js')
        .end()
    }
  },

  // webpack
  configureWebpack: {
    optimization: {
      // split into smaller files to speed up site load
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
}
