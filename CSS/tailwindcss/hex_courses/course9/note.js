// 強大 Variant 讓你寫 CSS 偽元素不卡卡 Group-hover

// 使用 group-hover 的時候，要再父元素上加上 group 的 class
// 之後再子元素上加上 group-hover: 的前綴，一樣後面寫 hover 之後的樣式 class
<div class="group border-indigo-500 hover:bg-white hover:shadow-lg hover:border-transparent ...">
  <p class="text-indigo-600 group-hover:text-gray-900 ...">New Project</p>
  <p class="text-indigo-500 group-hover:text-gray-500 ...">
    Create a new project from a variety of starting templates.
  </p>
</div>;

// 但目前只有部分的style支援，如果需要的話可以在設定檔中另外開權限(設定哪些Variant可以適用於哪些樣式)

// By default, the group-hover variant is enabled for the following core plugins:

// backgroundColor
// backgroundOpacity
// borderColor
// borderOpacity
// boxShadow
// opacity
// textColor
// textDecoration
// textOpacity

// You can control whether group-hover variants are enabled for a plugin in the variants section of your tailwind.config.js file:

// tailwind.config.js
module.exports = {
  // ...
  variants: {
    extend: {
      divideColor: ['group-hover'],
    },
  },
};

// 另外還可以搭配斷點設計，顯示不同的樣式
// :sm:hover:text-white

// Variants 是指特定名稱對應到不同的 class

// responsive	=> Responsive variants like sm, md, lg, and xl.
// dark	=> Targets dark mode.
// motion-safe	=> Targets the prefers-reduced-motion: no-preference media query.
// motion-reduce	=> Targets the prefers-reduced-motion: reduce media query.
// first	=> Targets the first-child pseudo-class.
// last	=> Targets the last-child pseudo-class.
// odd	=> Targets the odd-child pseudo-class.
// even	=> Targets the even-child pseudo-class.
// visited	=> Targets the visited pseudo-class.
// checked	=> Targets the checked pseudo-class.
// group-hover	=> Targets an element when a marked parent matches the hover pseudo-class.
// group-focus	=> Targets an element when a marked parent matches the focus pseudo-class.
// focus-within	=> Targets the focus-within pseudo-class.
// hover	=> Targets the hover pseudo-class.
// focus	=> Targets the focus pseudo-class.
// focus-visible	=> Targets the focus-visible pseudo-class.
// active	=> Targets the active pseudo-class.
// disabled	=> Targets the disabled pseudo-class.

// 啟用額外的 Variant
// 也就是上方說到的，針對特定的style開啟權限

// tailwind.config.js
module.exports = {
  variants: {
    // The 'active' variant will be generated in addition to the defaults
    extend: {
      backgroundColor: ['active'],
    },
  },
};

// 同時，如果沒有把設定放在 extend 的物件中，則會覆蓋原本的設定喔！

// tailwind.config.js
module.exports = {
  variants: {
    // Only 'active' variants will be generated
    backgroundColor: ['active'],
  },
};

// 客製化Variant

// 可以在 CSS 中使用下列的語法進行 banana 的定義

/* Input */
@variants hover, focus {
  .banana {
    color: yellow;
  }
}

/* Output */
.banana {
  color: yellow;
}
.hover\:banana:hover {
  color: yellow;
}
.focus\:banana:focus {
  color: yellow;
}

// 也可以用設定檔加入特定的 Variants
const plugin = require('../course10/node_modules/tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant('disabled', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`;
        });
      });
    }),
  ],
};

// The callback receives an object that can be destructured into the following parts:

// modifySelectors, a helper function to simplify adding basic variants
// separator, the user's configured separator string
// container, a PostCSS Container containing all of the rules the variant is being applied to, for creating complex variants
