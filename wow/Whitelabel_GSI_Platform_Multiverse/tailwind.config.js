/* eslint-env node */
/** @type {import('tailwindcss').Config} */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { breakpoints } from "./src/common/utils/constants/breakpoints"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/**
 * 僅允許安全的路徑片段（避免 environment.json 被竄改時越權讀檔）。
 * @param {unknown} key
 * @returns {string | null}
 */
function safeSiteKey(key) {
  if (typeof key !== "string" || !key) return null
  return /^[a-zA-Z0-9_-]+$/.test(key) ? key : null
}

/**
 * Tailwind 掃描範圍：預設只掃「目前版型」目錄，避免每次 build 掃描 template 下全部版型（數千個 .vue）拖慢 vite:css。
 * 優先序：環境變數 SITE_KEY → src/env/environment.json 的 siteKey → 退回掃描整個 template。
 */
function templateContentGlobs() {
  const fromEnv = safeSiteKey(process.env.SITE_KEY)
  if (fromEnv) {
    return [`./template/${fromEnv}/**/*.{vue,js,ts,jsx,tsx}`]
  }

  const envPath = path.join(projectRoot, "src/env/environment.json")
  try {
    if (fs.existsSync(envPath)) {
      const parsed = JSON.parse(fs.readFileSync(envPath, "utf8"))
      const key = safeSiteKey(parsed?.siteKey)
      if (key) {
        return [`./template/${key}/**/*.{vue,js,ts,jsx,tsx}`]
      }
    }
  } catch {
    // ignore
  }

  return ["./template/**/*.{vue,js,ts,jsx,tsx}"]
}

// 將 breakpoints 物件轉換為 Tailwind 的 screens 格式
function generateMaxWidthScreens(breakpoints) {
  const screens = {}

  for (const [key, value] of Object.entries(breakpoints)) {
    screens[key] = { max: `${value}px` }
  }

  return screens
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    ...templateContentGlobs(),
    "!./node_modules/**"
  ],
  theme: {
    extend: {
      screens: {
        ...generateMaxWidthScreens(breakpoints)
      }
    }
  },
  plugins: []
}
