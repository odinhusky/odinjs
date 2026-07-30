/// <reference types="@nuxt/fonts" /> // 強制 TS 載入 fonts 的擴展定義

import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { defineNuxtConfig } from "nuxt/config"
import { createResolver } from "@nuxt/kit" // 引入解析工具

// 強制以 apps/r017/.env(.local) 為準，覆蓋 shell 既有的 NUXT_PUBLIC_* 變數。
// 載入順序：.env → .env.local（local 蓋 default）。
// 僅 local dev 才執行：production build (CI) 不能讓 repo 內的 .env 蓋掉部署環境注入的值。
if (process.env.NODE_ENV !== "production") {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  for (const file of [".env", ".env.local"]) {
    const p = join(__dirname, file)
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
  }
}

// 建立解析器，它會以當前這個 nuxt.config.ts 檔案位置為起點
const { resolve } = createResolver(import.meta.url)

// 靜態資源 proxy 目標（僅 dev 環境需要）
const staticResourceProxyTarget = process.env.NUXT_PUBLIC_STATIC_RESOURCE_PROXY_TARGET || "https://gsai-dev.gsiwl.com"
// 預設主題檔：build 時一律使用基礎主題，agentCode 的主題差異由 public/env.js 在 runtime 覆寫
const variablesFile = resolve("src/assets/styles/_variables.scss")
const isDev = process.env.NODE_ENV !== "production"
const bannerPreloadScript = String.raw`
;(function () {
  var env = window.__ENV__ || {}
  if (!env.apiBase) return

  var apiBase = String(env.apiBase).replace(/\/$/, "")
  var langMatch = document.cookie.match(/(?:^|;\s*)i18n_redirected=([^;]+)/)
  var lang = langMatch ? decodeURIComponent(langMatch[1]) : "en"
  var preloadTimeoutMs = 8000
  var homeBannerPosition = 1 // BANNER_POSITION_ENUMS.HOME

  var bannerRequest = fetch(apiBase + "/v1/player/banners/list?position=" + homeBannerPosition, {
    headers: {
      "Accept-Language": lang,
      "Agentcode": env.agentCode || ""
    }
  })
    .then(function (response) {
      return response.json()
    })

  var timeout = new Promise(function (resolve) {
    setTimeout(function () {
      resolve(null)
    }, preloadTimeoutMs)
  })

  window.__BANNER_PRELOAD__ = Promise.race([bannerRequest, timeout])
    .catch(function () {
      return null
    })
})()
`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // 關閉 SSR，改為 SPA 模式（Capacitor 需要）

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
      agentCode: process.env.NUXT_PUBLIC_AGENT_CODE || "",
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE || "",
      staticResourceUrl: process.env.NUXT_PUBLIC_STATIC_RESOURCE_URL || "",
      staticResourceProxyTarget: process.env.NUXT_PUBLIC_STATIC_RESOURCE_PROXY_TARGET || "",
      siteKey: process.env.NUXT_PUBLIC_SITE_KEY || "",
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || "1.0.0",
      showMockData: process.env.NUXT_PUBLIC_SHOW_MOCK_DATA || "false",
      SHOW_MOCK_DATA: process.env.NUXT_PUBLIC_SHOW_MOCK_DATA || "false"
    }
  },

  extends: [resolve("../../libs/shared/ui-layer")],

  // alias: {
  //   "@shared-src": resolve("../../libs/shared/ui-layer/src")
  // },

  app: {
    head: {
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      title: "R017",
      meta: [{ name: "description", content: "Your App Description" }],
      // env.js 必須在所有其他 script 之前同步執行，確保 window.__ENV__ 在 Vue 初始化前已就緒
      // 維持外部 /env.js，部署時仍可只替換 public/env.js 切換 api 路徑、agentCode、主題色
      script: [
        { src: "/env.js", tagPosition: "head" },
        { innerHTML: bannerPreloadScript, tagPosition: "head" }
      ],
      link: [
        // 字體預加載，確保字體優先載入，提升首屏渲染品質
        {
          rel: "preload",
          href: "/fonts/OpenSans-VariableFont_wdth,wght.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous"
        }
      ]
    }
  },

  compatibilityDate: "2026-01-27",

  workspaceDir: "../../",
  srcDir: "src",
  // Keep dev artifacts in app-local .nuxt to avoid dist cleanup races during HMR.
  buildDir: isDev ? ".nuxt" : "../../dist/apps/r017/.nuxt",
  devtools: {
    enabled: false,

    timeline: {
      enabled: false
    }
  },

  devServer: {
    host: "localhost",
    port: 9000
  },

  typescript: {
    typeCheck: false,
    tsConfig: {
      extends: "./tsconfig.app.json"
    }
  },

  // 自動導入相關設定
  imports: {
    autoImport: true,
    dirs: [
      "composables/**", // 自動導入 composables（含 useHistory/index.ts）
      "utils/**", // 自動導入本地 utils
      "stores/**", // 自動導入 stores 目錄下的所有檔案
      "constants/**", // 自動導入 constants 目錄下的所有檔案
      resolve("../../libs/shared/ui-layer/src/lib/stores/**"), // 自動導入共享層的 stores 目錄下的所有檔案
      resolve("../../libs/shared/ui-layer/src/lib/constants/**"), // 自動導入共享層的 constants 目錄下的所有檔案
      resolve("../../libs/shared/ui-layer/src/lib/composables/**") // 自動導入共享層的 composables（含子目錄）
    ]
  },

  components: [
    {
      path: "~/components", // 掃描 r017 原生的組件
      pathPrefix: false
    }
  ],

  experimental: {
    // #app-manifest 虛擬模組在 monorepo + workspaceDir 配置下會在 Vite pre-transform
    // 階段被靜態掃描，此時 Nuxt plugin 尚未注冊虛擬模組，導致 vite:import-analysis 噴錯。
    // 此專案為純 SPA，app manifest 功能不需要，關掉可完全消除這個錯誤。
    appManifest: false
  },

  css: ["~/assets/styles/all.scss"],

  tailwindcss: {
    configPath: "tailwind.config.mjs",
    cssPath: "~/assets/styles/all.scss",
    exposeConfig: true,
    viewer: false
  },

  primevue: {
    importTheme: { from: "@/themes/aura-present.ts" },
    components: {
      include: ["Button", "ConfirmDialog", "Toast"]
    },
    directives: {
      include: ["Ripple"]
    },
    composables: {
      include: ["useConfirm", "useToast"]
    }
  },

  fonts: {
    // 1. 強制關閉遠端提供商，確保不連到 Google 伺服器 (支援中國市場)
    providers: {
      google: false,
      adobe: false
    },

    // 2. 定義本地字體
    families: [
      {
        name: "Open Sans",
        src: ["/fonts/OpenSans-VariableFont_wdth,wght.woff2", "/fonts/OpenSans-VariableFont_wdth,wght.ttf"],
        weight: "100 900"
      },
      {
        name: "Noto Sans TC",
        src: ["/fonts/NotoSansTC-VariableFont_wght.woff2", "/fonts/NotoSansTC-VariableFont_wght.ttf"],
        weight: "100 900",
        preload: false
      },
      {
        name: "Arial",
        src: ["/fonts/Arial-VariableFont_wdth,wght.woff2", "/fonts/Arial-VariableFont_wdth,wght.ttf"],
        weight: "500"
      },
      {
        name: "DINPro",
        src: ["/fonts/DINPro-Bold.woff2", "/fonts/DINPro-Bold.ttf"],
        weight: "700"
      },
      {
        name: "DINPro",
        src: ["/fonts/DINPro-Medium.woff2", "/fonts/DINPro-Medium.ttf"],
        weight: "500"
      },
      {
        name: "Segoe UI",
        src: ["/fonts/SegoeUI.woff2", "/fonts/SegoeUI.ttf"],
        weight: "400"
      }
    ],
    priority: ["local"]
  },

  vite: {
    plugins: [nxViteTsPaths()],
    server: {
      proxy: {
        "/statics": {
          target: staticResourceProxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "${resolve("../../libs/shared/ui-layer/src/assets/styles/_common.scss")}" as *;
            @use "${variablesFile}" as *;
          `
        }
      }
    }
  },

  pinia: {
    storesDirs: [
      "~/stores", // 本地專案的 stores
      resolve("../../libs/shared/ui-layer/src/lib/stores") // 共享層的 stores
    ]
  },

  nitro: {
    devProxy: {
      "/statics": {
        target: staticResourceProxyTarget,
        changeOrigin: true,
        prependPath: true
      }
    },
    output: {
      dir: "../../dist/apps/r017/.output"
    }
  }
})
