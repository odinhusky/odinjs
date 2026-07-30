import * as Constants from "@/utils/constants"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import type { LANGUAGE_TYPE } from "@/utils/constants"
import { useTimeZoneStore } from "src/stores/timezoneStore"
const { setUtcOffset } = useTimeZoneStore()

export const useSiteStore = defineStore("siteStore", {
  state: () => {
    return {
      boDefaultLang: "",
      boLangList: [] as Array<{ label: LANGUAGE_TYPE.Enums; value: number }>,
      langList: [] as Array<{ label: LANGUAGE_TYPE.Enums; value: number }>,
      agentType: Constants.AGENT_TYPE.Enums.Cash,
      is_bulk_data: 0,
      agent_code: "",
      bo_ai_helper: 0,
      product_v2_agent: ["dobt"],
      wallet_type_list: [] as number[],
      walletTypeListReady: false,
      freeround_wallet_type: null as Constants.BONUS_WALLET_TYPE.Enums | null,
      freeround_turnover_rate: 0,
      sso_google_oauth_enabled: 0,
      sso_telegram_oauth_enabled: 0
    }
  },
  getters: {
    /** 豁免所有信用版限制的代理清單(小寫比對) */
    creditRestrictionBypassAgents: () => ["if91"],
    /** 該代理是否豁免信用版限制 */
    isCreditRestrictionBypassed(state): boolean {
      return (this as any).creditRestrictionBypassAgents.includes(state.agent_code.toLowerCase())
    },
    isCash(state): boolean {
      if ((this as any).isCreditRestrictionBypassed) return true
      return state.agentType === Constants.AGENT_TYPE.Enums.Cash
    },
    isCredit(state): boolean {
      if ((this as any).isCreditRestrictionBypassed) return false
      return state.agentType === Constants.AGENT_TYPE.Enums.Credit
    },
    boLangLabels: (state) => state.boLangList.map((e) => e.label)
  },
  actions: {
    async updateSiteSetting(data: Response.GetSettings) {
      if (!data) {
        this.boLangList.length = 0
        return
      }
      this.boDefaultLang = data.bo_default_language || ""
      // 處理語系清單資料
      this.boLangList = []
      let boLanguages: string[] = []
      try {
        boLanguages = data.bo_language ? JSON.parse(data.bo_language) : []
      } catch (e) {}

      this.boLangList = boLanguages.map((lang: string, index: number) => {
        return { label: lang as LANGUAGE_TYPE.Enums, value: index }
      })

      // 處理語系清單資料
      this.langList = []
      let languages: string[] = []
      try {
        languages = data.language ? JSON.parse(data.language) : []
      } catch (e) {}

      this.langList = languages.map((lang: string, index: number) => {
        return { label: lang as LANGUAGE_TYPE.Enums, value: index }
      })

      // 處理代理制度資料
      this.agentType = data.agent_type
      this.bo_ai_helper = data.bo_ai_helper ? data.bo_ai_helper : 0
      const offset = (data.utc_offset || 0) / 60
      setUtcOffset(Number.isInteger(offset) ? offset : parseFloat(offset.toFixed(2)))

      this.is_bulk_data = data.is_bulk_data ? data.is_bulk_data : 0
      this.agent_code = data.agent_code ? data.agent_code : ""
      this.wallet_type_list = data.wallet_type_list || []
      this.walletTypeListReady = Array.isArray(data.wallet_type_list)
      this.freeround_wallet_type = data.freeround_wallet_type

      // 因為API傳來可能是包了雙引號的string，也可能是 number 或 undefined，前端先進行防呆處理
      this.freeround_turnover_rate = (() => {
        const raw = data.freeround_turnover_rate as unknown
        if (raw === undefined || raw === null || raw === "") return 0
        if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0
        if (typeof raw === "string") {
          try {
            const parsed = Number(JSON.parse(raw))
            return Number.isFinite(parsed) ? parsed : 0
          } catch {
            const parsed = Number(raw)
            return Number.isFinite(parsed) ? parsed : 0
          }
        }
        return 0
      })()

      this.sso_google_oauth_enabled = data.sso_google_oauth_enabled ?? 0
      this.sso_telegram_oauth_enabled = data.sso_telegram_oauth_enabled ?? 0
    },
    /**
     * 更新代理端語系列表
     * @param languages 語系代碼數組（小寫，如：["en", "zh-tw", "th"]）
     * @param defaultLanguage 預設語系代碼（小寫，如："en"）
     */
    updateBoLanguages(languages: string[], defaultLanguage?: string) {
      this.boLangList = languages.map((lang: string, index: number) => {
        return { label: lang as LANGUAGE_TYPE.Enums, value: index }
      })
      if (defaultLanguage) {
        this.boDefaultLang = defaultLanguage
      }
    }
  },
  persist: false
})
