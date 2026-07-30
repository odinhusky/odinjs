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

export const useCollaborationStore = defineStore("collaborationStore", {
  state: () => {
    return {
      collaborationItem: {} as Request.UpdateCollaborationItem
    }
  },
  actions: {
    initCollaborationItem() {
      this.collaborationItem = {
        mode: "",
        content_settings: [],
        basic_setting: {
          show: 0,
          settlement_type: SETTLEMENT_CYCLE.Enums.Daily,
          settlement_week: 1,
          rebate: 0,
          calculation_type: 1
          // started_at: "",
          // ended_at: "",
          // auto_payout: 0,
          // reward_type: 1,
          // audit_rate: 0,
          // dispatched_time: "",
          // dispatched_week: 1
        },
        active_member_settings: [],
        levelData: [],
        rebate_settings: []
        // game_type: [],
        // product_code: [],
        // choice_game_type: 1,
        // label_settings: []
      }
    }
  },
  persist: true
})
