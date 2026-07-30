import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { BONUS_WALLET_TYPE, CALCULATE_TYPE } from "@/utils/constants"
export const useCommissionStore = defineStore("commissionStore", {
  state: () => {
    return {
      commissionItem: {} as Request.GetCommissionSettingList
    }
  },
  actions: {
    initCommissionItem() {
      this.commissionItem = {
        id: 0,
        titles: [],
        period_type: 1,
        audit_rate: 0,
        dispatch_type: 1,
        days_of_week: 0,
        dispatch_threshold: [],
        dispatch_amount_limit: [],
        level_ids: [],
        label_ids: [],
        rebate_rate_config: [],
        start_at: "",
        end_at: "",
        wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY,
        calculate_type: CALCULATE_TYPE.Enums.ValidBet,
        start: 0,
        end: 0
      }
    },
    async copyCommissionItem(item: Request.GetCommissionSettingList) {
      this.commissionItem.id = item.id
      this.commissionItem.titles = item.titles
      this.commissionItem.period_type = item.period_type
      this.commissionItem.dispatch_type = item.dispatch_type
      this.commissionItem.audit_rate = Number(item.audit_rate)
      this.commissionItem.start_at = item.start_at
      this.commissionItem.end_at = item.end_at
      this.commissionItem.wallet_type = item.wallet_type

      this.commissionItem.level_ids = item.level_ids.map((e: any) => e)
      this.commissionItem.label_ids = item.label_ids.map((e: any) => e)
      // 派發门槛（有效投注）
      this.commissionItem.dispatch_threshold = item.dispatch_threshold || []
      // 單次結算派發上限
      this.commissionItem.dispatch_amount_limit = item.dispatch_amount_limit

      // 佣金比例設定
      this.commissionItem.rebate_rate_config = item.rebate_rate_config

      // 結算週期
      this.commissionItem.days_of_week = item.days_of_week
      //cycleSettings.week = item.days_of_week ? item.days_of_week : dropdownData.weeks[0].value
    }
  },
  persist: true
})
