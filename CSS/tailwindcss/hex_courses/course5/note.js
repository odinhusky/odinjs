// Tailwind Responsive Design

// 客製化解析度 sm/md/lg/xl
// https://tailwindcss.com/docs/responsive-design#app

// Customizing breakpoints
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      tablet: '640px',
      // => @media (min-width: 640px) { ... }

      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }

      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
};

// 但 tailwind 基本上還是 mobile first，所以都是使用min-width作為斷點設計
