import {
  EVENT_TYPE,
  CATEGORY_TYPE,
  PROMO_TIME,
  LANGUAGE_TYPE,
  PROMOTION_REWARD_TYPE,
  SETTLEMENT_CYCLE,
  BONUS_WALLET_TYPE
} from "@/utils/constants"
import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"

export const useShareholderProxyStore = defineStore("shareholderProxyStore", {
  state: () => {
    return {
      proxyItem: {} as Request.UpdateShareholderProxyItem
    }
  },
  actions: {
    initProxyItem() {
      this.proxyItem = {
        settlement_enabled: false,
        show_agent_details: false,
        payout_method: 1,
        turnover_rate: 0,
        i18n: [],
        settlement_cycle: SETTLEMENT_CYCLE.Enums.Daily,
        settlement_day: 1,
        levelData: [],
        metrics: [],
        base_rate: 0,
        rate_decay: 0,
        active_levels: [],
        rate_base: 0
      }
    }
  },
  persist: true
})
