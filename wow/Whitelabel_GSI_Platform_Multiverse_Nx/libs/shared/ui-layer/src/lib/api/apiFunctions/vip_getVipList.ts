import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { CmsLangTitle } from "@shared-lib/api/commonTypes/cmsTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"
import { LEVEL_UP_TYPE_ENUMS } from "@shared-lib/constants/enums/levelUpType"
import { PROMOTION_CONDITION_ENUMS } from "@shared-lib/constants/enums/promotionCondition"

export interface VipCondition {
  currency_id: number
  valid_bet_amount: string
  deposit_amount: string
}

export interface VipReward {
  currency_id: number
  promotion_bonus: string
  birthday_bonus: string
}

export interface VipBenefit {
  currency_id: number
  withdraw: {
    daily_limit: number
    max_amount: string
    fee: string
    monthly_free_limit: number
  }
}

export interface VipRewardBenefit {
  currency_id: number
  promotion_bonus: string
  birthday_bonus: string
  daily_limit: number
  max_amount: string
  fee: string
  monthly_free_limit: number
}

// api response
export interface MemberLevelItem {
  id: number
  level: number
  titles: CmsLangTitle
  img: string
  conditions: VipCondition[]
  rewards: VipReward[]
  benefits: VipBenefit[]
  remark: string
  updated_time: string
  promotion_condition: PROMOTION_CONDITION_ENUMS
  promotion_type: LEVEL_UP_TYPE_ENUMS
}

export type MemberLevelist = MemberLevelItem[]
export type GetVipListResponseType = MemberLevelist

export const getVipList = () => {
  return requestFn<EmptyType, GetVipListResponseType>(ENDPOINT_PATHS.VIP.LIST, null, {
    name: "getVipList",
    method: "get"
  })
}
