/// <reference types="@nuxtjs/i18n" /> // 強制 TS 載入 i18n 的擴展定義
import { execSync } from "node:child_process"
import { defineNuxtConfig } from "nuxt/config"
import { addRouteMiddleware, createResolver, defineNuxtModule } from "@nuxt/kit" // 引入路徑解析工具
import { I18N_DEFAULT_LANG } from "./src/lib/constants/i18n"

const { resolve } = createResolver(import.meta.url)
const buildTime = new Date().getTime().toString() // 產生唯一的建構標記（cache busting）
// 人類可讀的 build 時間，固定以 UTC+8（台北）輸出，例如 2026-06-26T10:05:36+08:00
const buildTimeIso = (() => {
  const shifted = new Date(Date.now() + 8 * 3600 * 1000)
  return shifted.toISOString().replace(/\.\d+Z$/, "+08:00")
})()

// 取得 build commit：優先吃 CI 注入的 env，最後 fallback 到 git；都沒有就 unknown
const buildCommit = (() => {
  const fromEnv =
    process.env.NUXT_PUBLIC_BUILD_COMMIT ||
    process.env.GIT_COMMIT || // Jenkins
    process.env.CI_COMMIT_SHA // GitLab CI
  if (fromEnv) return fromEnv.slice(0, 8)
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
  } catch {
    return "unknown"
  }
})()

const sharedRouteMiddlewareModule = defineNuxtModule({
  setup() {
    addRouteMiddleware({
      name: "auth-middleware",
      path: resolve("./src/lib/middleware/auth-middleware.global"),
      global: true
    })
  }
})

export default defineNuxtConfig({
  // 關閉 SSR，啟用 SPA 模式
  ssr: false,

  // 這裡之後可以放所有品牌共用的模組設定，例如 @nuxt/i18n
  modules: [
    sharedRouteMiddlewareModule,
    "@vueuse/nuxt", // 在 Layer 層級註冊
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt", // 專為 Nuxt 優化的持久化模組
    "@primevue/nuxt-module",
    "@nuxt/fonts"
  ],

  alias: {
    // 使用 resolve() 生成絕對路徑，這樣 extends 時才能正確繼承
    "@shared-src": resolve("./src"),
    "@shared-lib": resolve("./src/lib")
  },

  i18n: {
    // vueI18n config：覆寫 messageResolver 來處理 CMS 的 flat dot-notation key
    vueI18n: resolve("./i18n.config.ts"),
    // 語系切換策略：'no_prefix' 會在非預設語系的路徑加上前綴
    strategy: "no_prefix",
    defaultLocale: I18N_DEFAULT_LANG,
    // langDir: "./src/i18n/locales", // 指定翻譯檔案目錄
    locales: [
      { code: "ar", name: "العربية", file: "ar.json" },
      { code: "bn", name: "বাংলা", file: "bn.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Español", file: "es.json" },
      { code: "hi", name: "हिन्दी", file: "hi.json" },
      { code: "id", name: "Indonesia", file: "id.json" },
      { code: "jp", name: "日本語", file: "ja.json" },
      { code: "ko", name: "한국어", file: "ko.json" },
      { code: "ms", name: "Melayu", file: "ms.json" },
      { code: "my", name: "မြန်မာ", file: "my.json" },
      { code: "pt", name: "Português", file: "pt.json" },
      { code: "th", name: "ไทย", file: "th.json" },
      { code: "tl", name: "Tagalog", file: "tl.json" },
      { code: "vi", name: "Tiếng Việt", file: "vi.json" },
      { code: "zh-CN", name: "简体中文", file: "zh-CN.json" },
      { code: "zh-TW", name: "繁體中文", file: "zh-TW.json" }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true
    },
    compilation: {
      strictMessage: false // 允許翻譯內容包含 HTML
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 在這裡寫，所有繼承此 Layer 的 App 都會生效，如果在其他模板也要透過 Vite 引入共用樣式，這裡的設定會被覆蓋掉，要重新在該模板的 nuxt.config.ts 裡面加入這段設定
          // additionalData: `
          //   @use "${resolve("../../libs/shared/ui-layer/src/assets/styles/_common.scss")}" as *;
          //   @use "~/assets/styles/test.scss" as *;
          // `
          additionalData: `@use "${resolve("./src/assets/styles/_common.scss")}" as *;`
        }
      }
    }
  },

  components: [
    {
      path: resolve("./src/lib/components"),
      pathPrefix: false // 讓組件名稱更簡潔
    }
  ],

  imports: {
    dirs: [
      // 告訴 Nuxt 自動掃描這個目錄下的所有 export
      resolve("./src/lib/utils"),
      resolve("./src/lib/constants"),
      resolve("./src/lib/constants/**"),
      resolve("./src/lib/composables"),
      resolve("./src/lib/composables/**"),
      resolve("./src/lib/api"),
      resolve("./src/lib/api/apiFunctions"),
      resolve("./src/lib/api/hooks")
    ]
  },

  // build 資訊：以 data-* 屬性掛在 <body>，QA / Ops 開 DevTools 即可確認部署版本
  app: {
    head: {
      bodyAttrs: {
        "data-build-time": buildTimeIso,
        "data-commit": buildCommit
      }
    }
  },

  // Nuxt 會自動將環境變數 NUXT_PUBLIC_IMAGE_BASE 映射到這裡
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
      agentCode: process.env.NUXT_PUBLIC_AGENT_CODE || "",
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE || "",
      staticResourceUrl: process.env.NUXT_PUBLIC_STATIC_RESOURCE_URL || "",
      localeRemoteBase: process.env.NUXT_PUBLIC_LOCALE_REMOTE_BASE || "",
      siteKey: process.env.NUXT_PUBLIC_SITE_KEY || "",
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || "1.0.0",
      buildTime: buildTime,
      buildTimeIso: buildTimeIso,
      buildCommit: buildCommit
    }
  }

  // Nuxt image 的配置，這裡先註解掉，等確定圖片來源和使用方式後再調整
  // image: {
  //   // 如果你的圖片來自外部 Domain (如 wowdata.gsiwl.com)，必須授權域名
  //   // 預設可以在這裡定義不同的 provider

  //   domains: [process.env.NUXT_PUBLIC_IMAGE_BASE ? new URL(process.env.NUXT_PUBLIC_IMAGE_BASE).hostname : ""].filter(
  //     Boolean
  //   ),

  //   alias: {
  //     // 關鍵：將整個帶有時間戳的字串設為別名，映射到空字串（根路徑）
  //     [buildTime]: ""
  //   }
  // }
})
