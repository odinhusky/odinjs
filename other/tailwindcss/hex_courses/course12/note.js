// 新增三方套件
// 試著新增 Filter 的 utility
// https://github.com/benface/tailwindcss-filters¥

// npm install tailwindcss-filters

// tailwind.config.js
module.exports = {
  theme: {
    filter: { // defaults to {}
      'none': 'none',
      'grayscale': 'grayscale(1)',
      'invert': 'invert(1)',
      'sepia': 'sepia(1)',
    },
    backdropFilter: { // defaults to {}
      'none': 'none',
      'blur': 'blur(20px)',
    },
  },
  variants: {
    filter: ['responsive'], // defaults to ['responsive']
    backdropFilter: ['responsive'], // defaults to ['responsive']
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
};

// 之後就可以利用相關的class嚕，也可以自己新增

/* configurable with the "filter" theme object */
.filter-[key] {
  filter: [value];
}

.filter-none {
  filter: none;
}

/* configurable with the "backdropFilter" theme object */
.backdrop-[key] {
  backdrop-filter: [value];
}

// 課程中老師還有在講解一個 form 的