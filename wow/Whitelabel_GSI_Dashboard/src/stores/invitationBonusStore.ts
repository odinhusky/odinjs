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

export const useInvitationBonusStore = defineStore("invitationBonusStore", {
  state: () => {
    return {
      invitationBonusItem: {} as Request.UpdateInvitationBonusItem
    }
  },
  actions: {
    initItem() {
      this.invitationBonusItem = {
        settlement_enabled: false,
        start_date: "",
        end_date: "",
        payout_method: 1,
        turnover_rate: 0,
        i18n: [],
        labels: [],
        levelData: [],
        metrics: []
      }
    }
  },
  persist: true
})
