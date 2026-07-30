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

export const useAgentCommissionStore = defineStore("agentCommissionStore", {
  state: () => {
    return {
      commissionItem: {} as Request.UpdateAgentCommissionItem & { calculation_type?: number }
    }
  },
  actions: {
    initCommissionItem() {
      this.commissionItem = {
        id: 0,
        /*info: [
          {
            lang: LANGUAGE_TYPE.Enums.EN,
            title: ""
          },
          {
            lang: LANGUAGE_TYPE.Enums.TH,
            title: ""
          },
          {
            lang: LANGUAGE_TYPE.Enums.ID,
            title: ""
          },
          {
            lang: LANGUAGE_TYPE.Enums.VI,
            title: ""
          },
          {
            lang: LANGUAGE_TYPE.Enums.CN,
            title: ""
          },
          {
            lang: LANGUAGE_TYPE.Enums.TW,
            title: ""
          }
        ],*/
        name: "",
        member_ids: [],
        block_label_ids: [],
        member_levels: [],
        currency_limit: [],
        currency_limit_data: [],
        commission_limit: [],
        commission_limit_data: [],
        rewardType: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
        settlement_type: SETTLEMENT_CYCLE.Enums.Daily,
        calculation_type: 1,
        settlement_week: 1,
        payout_method: 1,
        billing_type: "",
        wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY,
        eligibility: {
          deposit: {
            mode: "accumulated",
            currency_threshold: {}
          },
          valid_bet_amount: {
            currency_threshold: {}
          }
        }
      }
    }
  }
})
