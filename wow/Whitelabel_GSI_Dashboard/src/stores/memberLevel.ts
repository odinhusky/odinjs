import { defineStore } from "pinia"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { useQueryStore } from "@/stores/queryStore"
import { CURRENCY_TYPE } from "@/utils/constants"
import { useSiteStore } from "@/stores/siteStore"

export const useMemberLevelStore = defineStore("memberLevelStore", {
  state: () => {
    return {
      memberLevelItem: {} as Request.AddMemberLevel
    }
  },
  actions: {
    initMemberLevelItem() {
      this.memberLevelItem = {
        remark: "",
        img: "",
        titles: {},
        valid_bet_amount: {},
        deposit_amount: {},
        promotion_bonus: {},
        birthday_bonus: {},
        single_withdraw_limit: {},
        total_withdraw_limit: {},
        // 每日取款次數
        withdraw_count: 0,
        deposit_method: {},
        withdraw_method: {},
        // 預寫 等後端api
        // 派發等級
        distribution_level: 0,
        // 晉級計算方式
        level_up_tags: 1,
        mode: "",
        promotion_type: 0
      }
    },
    async initCurrencyValue() {
      const queryStore = useQueryStore()
      await queryStore.getCurrencyList()

      if (this.memberLevelItem.mode === "copy") {
        return
      }
      queryStore.currencyList.forEach((e) => {
        const key = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]

        if (!this.memberLevelItem.valid_bet_amount[key]) {
          this.memberLevelItem.valid_bet_amount[key] = "0"
        }
        if (!this.memberLevelItem.promotion_bonus[key]) {
          this.memberLevelItem.promotion_bonus[key] = "0"
        }
        if (!this.memberLevelItem.birthday_bonus[key]) {
          this.memberLevelItem.birthday_bonus[key] = "0"
        }
        if (!this.memberLevelItem.deposit_amount[key]) {
          this.memberLevelItem.deposit_amount[key] = "0"
        }
        if (!this.memberLevelItem.total_withdraw_limit[key]) {
          this.memberLevelItem.total_withdraw_limit[key] = "0"
        }
        /* if (!this.memberLevelItem.withdraw_count[key]) {
          this.memberLevelItem.withdraw_count[key] = "0"
        }*/
        if (!this.memberLevelItem.deposit_method[key]) {
          this.memberLevelItem.deposit_method[key] = "0"
        }
        if (!this.memberLevelItem.withdraw_method[key]) {
          this.memberLevelItem.withdraw_method[key] = "0"
        }
        if (!this.memberLevelItem.single_withdraw_limit[key]) {
          this.memberLevelItem.single_withdraw_limit[key] = {
            min: "0",
            max: "0"
          }
        }
      })
    },
    async copyMemberLevelItem(item: Response.MemberLevelItem) {
      const queryStore = useQueryStore()
      await queryStore.getCurrencyList()

      this.memberLevelItem.img = item.img_base64
      this.memberLevelItem.titles = item.titles
      const siteStore = useSiteStore()
      //現金版
      if (!siteStore.isCredit) {
        queryStore.currencyList.forEach((e) => {
          const key = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]

          let condition
          if (Array.isArray(item.condition)) {
            condition = item.condition.find((c) => c.currency_id === e.value)
          }
          if (condition) {
            this.memberLevelItem.valid_bet_amount[key] = condition.valid_bet_amount
            this.memberLevelItem.deposit_amount[key] = condition.deposit_amount
          }
          let reward
          if (Array.isArray(item.reward)) {
            reward = item.reward.find((c) => c.currency_id === e.value)
          }
          if (reward) {
            this.memberLevelItem.promotion_bonus[key] = reward.promotion_bonus === "-1" ? "" : reward.promotion_bonus
            this.memberLevelItem.birthday_bonus[key] = reward.birthday_bonus === "-1" ? "" : reward.promotion_bonus
          }
        })

        // 晉級計算方式
        this.memberLevelItem.promotion_type = item.promotion_type
      } else {
        queryStore.currencyList.forEach((e) => {
          const key = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]

          let condition
          if (Array.isArray(item.condition)) {
            condition = item.condition.find((c) => c.currency_id === e.value)
          }
          if (condition) {
            this.memberLevelItem.valid_bet_amount[key] = condition.valid_bet_amount
            this.memberLevelItem.deposit_amount[key] = condition.valid_bet_amount
          }
        })
      }

      this.memberLevelItem.remark = item.remark
      this.memberLevelItem.withdraw_count = item.withdraw_count
      this.memberLevelItem.mode = "copy"
      /*this.memberLevelItem.valid_bet_amount = item.valid_bet_amount
      this.memberLevelItem.promotion_bonus = item.promotion_bonus
      this.memberLevelItem.birthday_bonus = item.birthday_bonus
      this.memberLevelItem.deposit_amount = item.deposit_amount
      this.memberLevelItem.single_withdraw_limit = item.single_withdraw_limit
      this.memberLevelItem.total_withdraw_limit = item.total_withdraw_limit
      this.memberLevelItem.deposit_method = item.deposit_method
      this.memberLevelItem.withdraw_method = item.withdraw_method*/
    }
  },
  persist: true
})
