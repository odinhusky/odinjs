import {
  EVENT_TYPE,
  CATEGORY_TYPE,
  LANGUAGE_TYPE,
  PROMOTION_REWARD_TYPE,
  SETTLEMENT_CYCLE,
  BONUS_WALLET_TYPE
} from "@/utils/constants"
import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"
import { useLanguageStore } from "./languageStore"
import { useSiteStore } from "src/stores/siteStore"

const siteStore = useSiteStore()

export const usePromotionStore = defineStore("promotionStore", {
  state: () => {
    return {
      promotionItem: {} as Request.UpdatePromotionItem
    }
  },
  actions: {
    initPromotionItem() {
      const languageStore = useLanguageStore()
      const currentLang = languageStore.currentLanguageOption.backendKey || LANGUAGE_TYPE.Enums.CN
      // 從 siteStore 取得可用的語系列表
      const availableLanguages = siteStore.langList || [currentLang]
      this.promotionItem = {
        type: EVENT_TYPE.Enums.DepositBonus,
        category: CATEGORY_TYPE.Enums.NewMember,
        count_basis: 1,
        show: false,
        start_date: "",
        end_date: "",
        allow_same_ip: true,
        auto_payout: false,
        audit_rate: 0,
        audit_rate_source: 0,
        info: availableLanguages.map((lang) => ({
          lang: lang.label as LANGUAGE_TYPE.Enums,
          title: "",
          content: "",
          image: ""
        })),
        block_label_ids: [],
        member_levels: [],
        reward: [
          // {
          //   currency: "",
          //   condition: null,
          //   type: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
          //   amount: 0,
          //   level: 0,
          //   limit: 0,
          //   free_round_setting: [
          //     {
          //       begin_date: null,
          //       end_date: null,
          //       bet_per_line: "",
          //       channel_code: null,
          //       currency_id: null,
          //       game_code: "",
          //       integration_id: null,
          //       product_code: null,
          //       rounds: 0,
          //       remark: ""
          //     }
          //   ]
          // }
        ],
        settlement_type: SETTLEMENT_CYCLE.Enums.Daily,
        settlement_week: 1,
        game_type: [],
        product_code: [],
        payment_gateway: [],
        wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY,
        prize_type: 1,
        levelData: [],
        rewardType: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
        reward_range_mode: false,
        depositLifetimeMode: "specifiedCount",
        depositLifetimeSpecifiedCount: [],
        depositLifetimeSpecifiedRange: []
      }
    }
  },
  persist: true
})
