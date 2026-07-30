/// <reference types="@nuxt/fonts" /> // 強制 TS 載入 fonts 的擴展定義

import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin"
import { defineNuxtConfig } from "nuxt/config"
import { createResolver } from "@nuxt/kit" // 引入解析工具

// 建立解析器，它會以當前這個 nuxt.config.ts 檔案位置為起點
const { resolve } = createResolver(import.meta.url)

// 根據環境變數決定要載入哪個 variables SCSS 檔案
const agentCode = process.env.NUXT_PUBLIC_AGENT_CODE
const variablesFile = agentCode
  ? resolve(`src/assets/styles/_variables_${agentCode.toLowerCase()}.scss`)
  : resolve("src/assets/styles/_variables.scss")

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // 關閉 SSR，改為 SPA 模式（Capacitor 需要）

  extends: [resolve("../../libs/shared/ui-layer")],

  // alias: {
  //   "@shared-src": resolve("../../libs/shared/ui-layer/src")
  // },

  app: {
    head: {
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      title: "R001",
      meta: [{ name: "description", content: "Your App Description" }],
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
  buildDir: "../../dist/apps/r001/.nuxt",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
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
      "stores/**", // 自動導入 stores 目錄下的所有檔案
      resolve("../../libs/shared/ui-layer/src/lib/stores/**") // 自動導入共享層的 stores 目錄下的所有檔案
    ]
  },

  components: [
    {
      path: "~/components", // 掃描 r001 原生的組件
      pathPrefix: false
    }
  ],

  css: ["~/assets/styles/all.scss"],

  tailwindcss: {
    configPath: "tailwind.config.mjs",
    cssPath: "~/assets/styles/all.scss",
    exposeConfig: true
  },

  primevue: {
    importTheme: { from: "@/themes/aura.ts" }
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
        weight: "100 900"
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
    output: {
      dir: "../../dist/apps/r001/.output"
    }
  }
})
