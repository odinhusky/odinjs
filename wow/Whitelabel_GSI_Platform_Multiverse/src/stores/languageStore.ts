import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

export const useLanguageStore = defineStore("languageStore", {
  state: () => {
    return {
      lang: "",
      defaultLang: "",
      languageList: [] as string[],
      languageChangeFuncList: [] as Array<() => void | Promise<void>>
    }
  },
  actions: {
    setStoreLang(lang: string) {
      this.lang = lang
    },
    setAgentLangSetting(data: Response.ISetting) {
      if (data.default_language) {
        this.defaultLang = data.default_language
      }

      // 使用 data.language 作為可用的語系列表（保持 API 返回的順序）
      const languageList = JSON.parse(data.language)
      if (languageList && languageList.length) {
        this.languageList = languageList
      }
    },
    registerLanguageChangeFunc(func: () => void | Promise<void>) {
      if (typeof func !== "function") {
        console.error("registerLanguageChangeFunc 收到非 func 參數:", func)
        return
      }
      this.languageChangeFuncList.push(func)
    },
    unregisterLanguageChangeFunc(func: () => void | Promise<void>) {
      const index = this.languageChangeFuncList.indexOf(func)
      if (index > -1) {
        this.languageChangeFuncList.splice(index, 1)
      } else {
        console.warn(`未找到要取消的函數: ${func}`)
      }
    },
    async executeLanguageChangeFunc() {
      // 過濾掉無效的函數
      const validFuncs = this.languageChangeFuncList.filter((func) => typeof func === "function")

      if (validFuncs.length === 0) {
        console.warn("沒有有效的 func 需要執行")
        return
      }

      // 將要執行的 function 一一執行
      for (const func of validFuncs) {
        try {
          await func()
        } catch (error) {
          console.error("執行 language callback func 時發生錯誤:", error)
        }
      }
    }
  },
  getters: {
    storedLang: (state) => state.lang,
    storedDefaultLang: (state) => state.defaultLang,
    storedLanguageList: (state) => state.languageList
  },
  persist: true
})
