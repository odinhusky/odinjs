module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://stage.course.mejor-test.com.tw',
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
