import baseConfig from "../../tailwind.config.base.mjs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import plugin from "tailwindcss/plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const emojiFonts = ['"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"']

/** @type {import('tailwindcss').Config} */
export default {
  // 1. 繼承全域基礎設定 (如品牌色、間距)
  presets: [baseConfig],

  // 2. 自動偵測依賴項的掃描路徑
  content: [
    join(__dirname, "src/**/*.{vue,js,ts,jsx,tsx}"),
    join(__dirname, "../../libs/shared/ui-layer/src/**/*.{vue,js,ts,jsx,tsx}")
  ],

  theme: {
    extend: {
      spacing: {
        50: "200px",
        56.25: "225px"
      },

      fontFamily: {
        // 使用 Nuxt 定義的名稱，並加上系統備援
        sans: [
          '"Open Sans"',
          "Arial",
          '"PingFang SC"', // Mac / iOS 中文,系統字型
          '"Microsoft YaHei"', // Windows 中文,系統字型
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          ...emojiFonts // 確保表情符號能正常顯示
        ],
        arial: ["Arial", "sans-serif", ...emojiFonts],
        din: ["DINPro", "sans-serif", ...emojiFonts],
        segoe: ['"Segoe UI"', "sans-serif", ...emojiFonts]
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".form-item-class": {
          "@apply w-full h-10": {}
        }
      })
    })
  ]
}
