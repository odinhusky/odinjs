import baseConfig from "../../tailwind.config.base.mjs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

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
      // 這裡覆蓋屬於 r001 的特殊樣式
      colors: {
        "brand-primary": "#ff0000"
      },

      fontFamily: {
        // 使用 Nuxt 定義的名稱，並加上系統備援
        sans: [
          '"Open Sans"',
          "Arial",
          '"Noto Sans TC"',
          '"PingFang SC"', // Mac 中文備援
          '"Microsoft YaHei"', // Windows 中文備援
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          ...emojiFonts // 確保表情符號能正常顯示
        ],
        notosans: ['"Noto Sans TC"', "sans-serif", ...emojiFonts],
        arial: ["Arial", "sans-serif", ...emojiFonts],
        din: ["DINPro", "sans-serif", ...emojiFonts],
        segoe: ['"Segoe UI"', "sans-serif", ...emojiFonts]
      }
    }
  },
  plugins: []
}
