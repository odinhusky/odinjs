// Extracting Components

// 我們可以利用 @layer layername {} 的語法，將大括號的內容，置放到原生的後面，例如我的寫法是下面這樣

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-blue {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}

// 但是我的 output.css 的順序會是這樣

@tailwind base;

@tailwind components;

.btn-blue {
  @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
}

@tailwind utilities;

// 這就是 @layer 的功用，插入特定的位置

// 同時，如果你想使用 js 來製作你的 component 樣式，也是可以的喔！

// tailwind.config.js
const plugin = require('../course11/node_modules/tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addComponents, theme }) {
      const buttons = {
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.600'),
        },
        '.btn-indigo': {
          backgroundColor: theme('colors.indigo.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.indigo.600')
          },
        },
      }

      addComponents(buttons)
    })
  ]
}

// 透過這樣的js設定，你也可以達到一樣的效果～