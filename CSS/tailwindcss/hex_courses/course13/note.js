// Functions & Directives

const { theme } = require("./practice/tailwind.config");

@tailwind:

  // 載入本身的layer 像是 base, components, utilities 等。

@apply:

  // 除了原本的 

  /* Input */
  .btn {
    @apply py-2 p-4;
  }

  // 這種寫法之外，也可以分開撰寫，讓可讀性更高

  /* Input */
  .btn {
    @apply py-2;
    @apply p-4;
  }

  // 也可以跟原生的css 混用

  .btn {
    @apply py-2 p-4;
    width: 100px;
  }

  // 同時如果你原本有加入 !important 的屬性，但又用 @apply 引用這個 class 的設定的話，tailwindcss 會將 !important的屬性拿掉喔！
  // 為的是避免 !important 互相覆蓋，造成優先度上的問題

  /* Input */
  .foo {
    color: blue !important;
  }

  .bar {
    @apply foo;
  }

  /* Output */
  .foo {
    color: blue !important;
  }

  .bar {
    color: blue;
  }

  // 但如果你就是需要 !important 屬性的話，可以在 @apply 的最後面加上 !important

  /* Input */
  .btn {
    @apply font-bold py-2 px-4 rounded !important;
  }

  /* Output */
  .btn {
    font-weight: 700 !important;
    padding-top: .5rem !important;
    padding-bottom: .5rem !important;
    padding-right: 1rem !important;
    padding-left: 1rem !important;
    border-radius: .25rem !important;
  }

@layer:

  // 使用 @layer base 的方式去定義 css 的時候，被定義的 css 在輸出的時候就會送到該 layer 的下方。

  // 輸入
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    h1 {
      @apply text-2xl;
    }
    h2 {
      @apply text-xl;
    }
  }

  // 輸出

  @tailwind base;

  @layer base {
    h1 {
      @apply text-2xl;
    }
    h2 {
      @apply text-xl;
    }
  }

  @tailwind components;
  @tailwind utilities;

  // 使用 @layer 來管理你程式碼的順序

@variants:

  // 使用 @variants 所定義的 css 會套用上你所需要的 variants

  // Input

  @variants focus, hover {
    .rotate-0 {
      transform: rotate(0deg);
    }
    .rotate-90 {
      transform: rotate(90deg);
    }
  }

  // Output

  .rotate-0 {
    transform: rotate(0deg);
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
  
  .focus\:rotate-0:focus {
    transform: rotate(0deg);
  }
  .focus\:rotate-90:focus {
    transform: rotate(90deg);
  }
  
  .hover\:rotate-0:hover {
    transform: rotate(0deg);
  }
  .hover\:rotate-90:hover {
    transform: rotate(90deg);
  }

@responsive:

  // 也可以直接使用 @responsive 來取代 @variant responsive，套用不同斷點的設定

@screen:

  // 當自己寫的 css 需要斷點的時後，可以利用 @screen [screen define key] { }  來定義
  // [screen define key] 的預設在 tailwind.config.js 的 screen 屬性中有定義基本的斷點

  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }

  // 有需要的話也可以自己新增或修改


theme():

  // 利用 theme() 去抓取 tailwind.config.js 的 theme 裡面的物件資料

  color: theme('color.white'); => 編譯出來就是 color: #ffffff;

  // theme() 在使用的時候，可能要跟團隊溝通，千萬不能刪除 tailwind.config.js 的值，如果不小心刪除了的話，css 編譯的過程中會抓不到設定而出錯！
