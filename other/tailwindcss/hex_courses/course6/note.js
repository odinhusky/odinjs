// Tailwind Base

// Tailwind 是使用 normalize 的 CSS Reset

// 今天我要自訂 base 的 layer，內容就如同{}所示。(CSS中)
// @layer base {
//   h1 {
//     @apply text-2xl;
//   }
//   h2 {
//     @apply text-xl;
//   }
// }

// 這樣就可以覆蓋掉原本的樣式

// 覆蓋文字樣式(CSS中)
// @layer base {
//   @font-face {
//     font-family: Proxima Nova;
//     font-weight: 400;
//     src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
//   }
//   @font-face {
//     font-family: Proxima Nova;
//     font-weight: 500;
//     src: url(/fonts/proxima-nova/500-medium.woff) format("woff");
//   }
// }

// 這樣的覆蓋設定，也可以寫在 tailwind.config.js 的設定檔中
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addBase, config }) {
      addBase({
        h1: { fontSize: config('theme.fontSize.2xl') },
        h2: { fontSize: config('theme.fontSize.xl') },
        h3: { fontSize: config('theme.fontSize.lg') },
      });
    }),
  ],
};
