const { join } = require('path');

// Note: If you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json).
//
// See: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16, //1rem = 16px
      propList: ['*'],
      selectorBlackList: ['-nopx'], // 过滤掉-nopx结尾的class，不进行rem转换
    },
  },
};
