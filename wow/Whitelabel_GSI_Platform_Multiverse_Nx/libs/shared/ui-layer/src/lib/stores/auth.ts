/// <reference types="pinia-plugin-persistedstate" />  <-- 避免 persist 找不到的錯誤

import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { LoginResponseType } from "@shared-lib/api/commonTypes/authTypes"

export const useAuthStore = defineStore(
  "auth",
  () => {
    // 1. State (狀態)
    // 儲存登入憑證
    const token = ref<string | null>(null)
    const loginData = ref<LoginResponseType | null>(null)

    // 2. Getters (計算屬性)
    // 根據 token 是否存在來判斷登入狀態
    const isLoggedIn = computed(() => !!token.value)

    // 3. Actions (方法)
    /**
     * 設定 Token
     * @param newToken API 回傳的 JWT 或 Session Token
     */
    function setToken(newToken: string) {
      token.value = newToken
    }

    /**
     * 設定登入回傳資料
     */
    function setLoginData(data: LoginResponseType) {
      loginData.value = data
    }

    /**
     * 一次設定登入資料與 token
     */
    function setAuth(data: LoginResponseType) {
      loginData.value = data
      token.value = data.access_token
    }

    /**
     * 清除驗證資訊 (登出時使用)
     */
    function clearAuth() {
      token.value = null
      loginData.value = null
    }

    return {
      token,
      loginData,
      isLoggedIn,
      setToken,
      setLoginData,
      setAuth,
      clearAuth
    }
  },
  {
    // 4. 開啟持久化設定
    // 透過 pinia-plugin-persistedstate，這會自動同步到 Cookie 中
    // 確保在 Nuxt 的 SSR 環境與頁面重新整理後 token 依然存在
    persist: true
  }
)
