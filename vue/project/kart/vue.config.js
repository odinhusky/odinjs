module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_ORIGIN,
      },
    },
  },
  publicPath: '/frontend-test/',
  outputDir: '../public/frontend-test',
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import '@/assets/scss/helpers/_variables.scss';`,
      },
    },
  },
};
