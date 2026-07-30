import primeui from "tailwindcss-primeui"
import { createJiti } from "jiti"
const jiti = createJiti(import.meta.url)

// 透過 jiti 載入 TypeScript 文件
// 注意：jiti() 的直接呼叫方式雖被標記為 deprecated，但在配置文件中
// 因為無法使用 await，所以這是目前唯一的同步載入方式
const { BREAKPOINTS } = jiti("./libs/shared/ui-layer/src/lib/constants/breakpoints.ts")
const { generateMaxWidthScreens } = jiti("./libs/shared/ui-layer/src/lib/utils/generateBreakpoints.ts")

const maxScreens = generateMaxWidthScreens(BREAKPOINTS)

// console.log("Breakpoints:", BREAKPOINTS)
// console.log("maxScreens:", maxScreens)

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    screens: {
      ...maxScreens
    },
    extend: {
      // 在這裡定義所有品牌共用的顏色、間距等
      colors: {
        "husky-primary": "#3b82f6",
        "brand-primary": "green"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards"
      }
    }
  },
  plugins: [primeui]
}
