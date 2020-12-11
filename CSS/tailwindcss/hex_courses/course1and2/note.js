// 如果使用CDN的話

// You can't customize Tailwind's default theme
// You can't use any directives like @apply, @variants, etc.
// You can't enable features like group-hover
// You can't install third-party plugins
// You can't tree-shake unused styles

// padding 跟 margin 以 0.25rem 為單位 最多可以正負48個單位
// 斷點的部分，則直接在樣式前面 => md:text-blue-500
// hover也是同樣的用法 => hover => hover:bg-orange-800

// 正規使用 npm 進行安裝
// 1. Install Tailwind via npm //////////////////////////////////
// 利用 npm 或是 yarn 下載
// # Using npm
// npm install tailwindcss

// # Using Yarn
// yarn add tailwindcss

// 2. Add Tailwind to your CSS //////////////////////////////////
// 直接在 css 中貼入下面三行就可以了，但還需要經過編譯
// @tailwind base;

// @tailwind components;

// @tailwind utilities;

// or

// @import "tailwindcss/base";

// @import "tailwindcss/components";

// @import "tailwindcss/utilities";

// 3. Create your Tailwind config file //////////////////////////////////

// npx tailwindcss init => This will create a minimal tailwind.config.js file at the root of your project:

// tailwind.config.js
// module.exports = {
//   future: {},
//   purge: [],
//   theme: {
//     extend: {},
//   },
//   variants: {},
//   plugins: [],
// }

// 4. 使用 CLI 快速編譯 => npx tailwindcss build styles.css -o output.css
