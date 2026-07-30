import { get, post, put, deleteData } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import {
  ERROR_CODE,
  CURRENCY_TYPE,
  PROMOTION_REWARD_TYPE,
  EVENT_TYPE,
  SETTLEMENT_CYCLE,
  PRIZE_TYPE,
  COUNT_BASIS
} from "@/utils/constants"
import { usePromotionStore } from "@/stores/promotionStore"
import { useLanguageStore } from "src/stores/languageStore"
import type { I18nTab } from "@/api/response.type"
import { resolveRewardRangeMode } from "@/pages/Promotion/PromotionSetting/Add/depositLifetime"
import { normalizeFreeRoundWalletType } from "@/utils/freeRoundWalletType"

type i18nKeys = keyof I18nTab<undefined>
const store = usePromotionStore()
const languageStore = useLanguageStore()
const currentLanguageKey = languageStore.currentLanguageOption.i18nKey as i18nKeys

const DATA_URL_IMAGE_PATTERN = /^data:image\/[a-zA-Z0-9.+-]+;base64,/

// 将货币ID转换为货币代码的函数
const getCurrencyCode = (currencyId: number): string => {
  const currencyEntries = Object.entries(CURRENCY_TYPE.Enums)
  const currencyEntry = currencyEntries.find(([key, value]) => value === currencyId)
  return currencyEntry ? currencyEntry[0] : "USD"
}

const isBase64PromotionImage = (value?: string) => Boolean(value && DATA_URL_IMAGE_PATTERN.test(value.trim()))

const stripResourceQuery = (value: string) => value.split("#")[0].split("?")[0]

const toPromotionStorageKey = (value?: string) => {
  if (!value) {
    return ""
  }

  const normalizedValue = value.trim()
  if (!normalizedValue || normalizedValue.startsWith("blob:") || isBase64PromotionImage(normalizedValue)) {
    return ""
  }

  const strippedValue = stripResourceQuery(normalizedValue)

  if (/^https?:\/\//.test(strippedValue)) {
    try {
      return decodeURIComponent(new URL(strippedValue).pathname.replace(/^\/+/, ""))
    } catch (error) {
      return strippedValue
    }
  }

  return strippedValue.replace(/^\/+/, "")
}

const normalizePromotionInfo = (info: Request.PromotionInfo[] = []) =>
  info.map((item) => {
    const normalizedImage = item.image?.trim() ?? ""

    if (isBase64PromotionImage(normalizedImage)) {
      return {
        lang: item.lang,
        title: item.title,
        content: item.content,
        image: normalizedImage
      }
    }

    const normalizedStorageKey = toPromotionStorageKey(item.storage_key || normalizedImage)

    return {
      lang: item.lang,
      title: item.title,
      content: item.content,
      image: normalizedStorageKey,
      ...(normalizedStorageKey ? { storage_key: normalizedStorageKey } : {})
    }
  })

const serializePromotionReward = (
  reward: Request.PromotionRewardItem[] = [],
  rewardType: PROMOTION_REWARD_TYPE.Enums
): Request.PromotionRewardItem[] =>
  reward.map((item) => {
    const rewardObj: Request.PromotionRewardItem = {
      currency: item.currency,
      amount: parseFloat(item.amount as any as string),
      condition: parseFloat(item.condition as any as string),
      type: rewardType
    }

    if (item.limit !== "" && item.limit !== undefined) {
      rewardObj.limit = parseFloat(item.limit as any as string)
    }

    if (item.level !== undefined) {
      rewardObj.level = Number(item.level)
    }

    if (item.max_level !== undefined) {
      rewardObj.max_level = Number(item.max_level)
    }

    if (item.repeatable !== undefined) {
      rewardObj.repeatable = item.repeatable
    }

    return rewardObj
  })

const normalizeFreeRoundRounds = (value: number | string | undefined) => {
  const normalizedValue = Number.parseInt(String(value ?? 0), 10)
  return Number.isNaN(normalizedValue) ? 0 : normalizedValue
}

const resolveAuditRateSource = (
  params: Pick<Request.AddPromotionItem, "audit_rate_source" | "prize_type" | "type">
): number => {
  if (params.type === EVENT_TYPE.Enums.DepositBonus && params.prize_type !== PRIZE_TYPE.Enums.FREE_GAME) {
    return params.audit_rate_source
  }

  return 0
}

const parseFreeRoundDateToUnixSeconds = (value: any): number => {
  if (typeof value === "number") return value
  if (value && typeof value === "object" && "dateTime" in value) {
    return Math.floor(new Date((value as any).dateTime).getTime() / 1000)
  }
  if (typeof value === "string") return Math.floor(new Date(value).getTime() / 1000)
  return 0
}

const resolveCountBasis = (params: Pick<Request.AddPromotionItem, "count_basis">): COUNT_BASIS.Enums | undefined => {
  if (params.count_basis === COUNT_BASIS.Enums.LIFETIME || params.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD) {
    return params.count_basis
  }

  return undefined
}

const serializeFreeGameReward = (reward: Request.PromotionRewardItem[] = []): Request.PromotionRewardItem[] =>
  reward.flatMap((item) => {
    const freeRoundSetting = item.free_round_setting?.[0]
    if (!freeRoundSetting) {
      return []
    }

    return [
      {
        currency: getCurrencyCode(freeRoundSetting.currency_id),
        type: PROMOTION_REWARD_TYPE.Enums.FreeGame,
        condition: item.condition || 0,
        amount: 0,
        level: item.level,
        max_level: item.max_level,
        repeatable: item.repeatable,
        free_round_setting: [
          {
            currency_id: freeRoundSetting.currency_id,
            product_code: freeRoundSetting.product_code,
            game_code: freeRoundSetting.game_code,
            bet_per_line: freeRoundSetting.bet_per_line || "0",
            total_bet_amount: freeRoundSetting.total_bet_amount || "0",
            begin_date: parseFreeRoundDateToUnixSeconds(freeRoundSetting.begin_date),
            end_date: parseFreeRoundDateToUnixSeconds(freeRoundSetting.end_date),
            rounds: normalizeFreeRoundRounds(freeRoundSetting.rounds),
            remark: freeRoundSetting.remark || "",
            wallet_type: normalizeFreeRoundWalletType(freeRoundSetting.wallet_type)
          }
        ]
      }
    ]
  })

export const getPromotionList = async (params?: Request.GetPromotionList) => {
  const payload: Request.GetPromotionList = {
    title: params?.title ? params.title : undefined,
    type: params?.type ? params.type : undefined,
    currency_id: params?.currency ? params.currency : undefined,
    enable: params?.enable ? params.enable : undefined,
    wallet_type: params?.wallet_type,
    prize_type: params?.prizeType,
    start_date: params?.start,
    end_date: params?.end,
    offset: params?.offset,
    size: params?.size
  }
  if (!params?.enable && params?.enable !== undefined) {
    payload.enable = false
  }
  return get<Response.BaseList<Response.GetPromotionList>>("promotions/list", payload, { name: "getPromotionList" })
}

export const getPromotionDetail = async (id: number) => {
  return get<Response.GetPromotionDetail>(`promotions/${id}`, null, { name: "getPromotionDetail" })
}

export const updatePromotionItemStatus = async (params: Request.UpdatePromotionItemStatus) => {
  return put(`promotions/${params.id}/enabled`, params, { name: "updatePromotionItemStatus" })
}

export const updatePromotionItem = async (params: Request.UpdatePromotionItem) => {
  const startDateOut = typeof params.start_date === "string" ? `${params.start_date}T00:00:00Z` : params.start_date
  const endDateOut = typeof params.end_date === "string" ? `${params.end_date}T23:59:59Z` : params.end_date
  const countBasis = resolveCountBasis(params)
  const payload: Request.UpdatePromotionItem = {
    type: params.type,
    category: params.category,
    show: params.show,
    ...(countBasis ? { count_basis: countBasis } : {}),
    start_date: startDateOut,
    end_date: endDateOut,
    allow_same_ip: params.allow_same_ip,
    auto_payout: params.auto_payout,
    audit_rate: parseFloat(params.audit_rate as any as string),
    audit_rate_source: resolveAuditRateSource(params),
    info: normalizePromotionInfo(params.info),
    block_label_ids: params.block_label_ids,
    member_levels: params.member_levels,
    reward: params.reward,
    payment_gateway: params.payment_gateway,
    prize_type: params.prize_type,
    wallet_type: params.wallet_type,
    reward_range_mode: resolveRewardRangeMode(params)
  }
  if (params.type !== EVENT_TYPE.Enums.BetBonus) {
    payload.reward = serializePromotionReward(params.reward, params.rewardType as PROMOTION_REWARD_TYPE.Enums)
  } else {
    if (params.choice_game_type === 1) {
      payload.game_type = params.game_type
      payload.product_code = []
    } else {
      payload.product_code = params.product_code
      payload.game_type = []
    }
    payload.settlement_type = params.settlement_type
    if (params.settlement_week === SETTLEMENT_CYCLE.Enums.Daily) {
      payload.settlement_week = 0
    } else {
      payload.settlement_week = params.settlement_week
    }
    payload.reward = []
    const levelData = params.levelData || []
    levelData.forEach((item) => {
      item.currency.forEach((currency: any) => {
        //if (currency.condition !== "" || currency.amount !== "") {
        const rewardItem = {
          currency: currency.currency,
          condition: currency.condition !== "" ? parseFloat(currency.condition) : 0,
          amount: currency.amount !== "" ? parseFloat(currency.amount) : 0,
          level: item.level,
          type: params.rewardType as PROMOTION_REWARD_TYPE.Enums,
          max_level: currency.max_level,
          repeatable: currency.repeatable
        }
        payload.reward.push(
          rewardItem as {
            currency: string
            condition: number | string
            type: PROMOTION_REWARD_TYPE.Enums
            amount: number | string
            limit?: string | number | undefined
            level: number
            max_level?: number
            repeatable?: boolean
          }
        )
        //}
      })
    })
  }
  if (params.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
    payload.reward = serializeFreeGameReward(params.reward)
  }

  return put(`promotions/${params.id}`, payload, { name: "updatePromotionItem" })
}

export const deletePromotionItem = async (id: number) => {
  return deleteData(`promotions/${id}`, null, { name: "deletePromotionItem" })
}

export const promotionSort = async (params: { sort_number: number; id: number }) => {
  return put(`/promotions/${params.id}/sort`, params)
}

export const AddPromotionItem = async (params: Request.AddPromotionItem) => {
  const startDateOut = typeof params.start_date === "string" ? `${params.start_date}T00:00:00Z` : params.start_date
  const endDateOut = typeof params.end_date === "string" ? `${params.end_date}T23:59:59Z` : params.end_date
  const countBasis = resolveCountBasis(params)
  const payload: Request.AddPromotionItem = {
    type: params.type,
    category: params.category,
    show: params.show,
    ...(countBasis ? { count_basis: countBasis } : {}),
    prize_type: params.prize_type,
    start_date: startDateOut,
    end_date: endDateOut,
    allow_same_ip: params.allow_same_ip,
    auto_payout: params.auto_payout,
    audit_rate: parseFloat(params.audit_rate as any as string),
    audit_rate_source: resolveAuditRateSource(params),
    info: normalizePromotionInfo(params.info),
    block_label_ids: params.block_label_ids,
    member_levels: params.member_levels,
    reward: params.reward,
    payment_gateway: params.payment_gateway,
    wallet_type: params.wallet_type,
    reward_range_mode: resolveRewardRangeMode(params)
  }
  if (params.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
    payload.reward = serializeFreeGameReward(params.reward)
  }
  if (params.type !== EVENT_TYPE.Enums.BetBonus) {
    console.log("params", params)
    if (params.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
      payload.reward = serializeFreeGameReward(params.reward)
    } else {
      payload.reward = serializePromotionReward(params.reward, params.rewardType as PROMOTION_REWARD_TYPE.Enums)
    }
  } else {
    console.log("params", params)
    if (params.choice_game_type === 1) {
      payload.game_type = params.game_type
      payload.product_code = []
    } else {
      payload.product_code = params.product_code
      payload.game_type = []
    }
    payload.settlement_type = params.settlement_type
    if (params.settlement_type === SETTLEMENT_CYCLE.Enums.Daily) {
      payload.settlement_week = 0
    } else {
      payload.settlement_week = params.settlement_week
    }
  }
  return post(`promotions`, payload, { name: "AddPromotionItem" })
}

export const getPromotionReviewList = async (params: Request.GetPromotionReviewList) => {
  const payload = {
    title: params.title,
    type: params.type,
    currency_id: params.currency,
    status: params.status,
    start_date: params.start as any,
    end_date: params.end as any,
    wallet_type: params.wallet_type,
    prize_type: params.prizeType,
    account: params.memberAccount,
    offset: params.offset,
    size: params.size
  }
  return get<Response.BaseList<Response.GetPromotionReviewList>>("promotions/review/list", payload, {
    name: "getPromotionReviewList"
  })
}

export const rejectPromotionReviewItem = async (id: number) => {
  return put(`promotions/review/${id}/reject`, undefined, { name: "rejectPromotionReviewItem" })
}

export const passPromotionReviewItem = async (id: number) => {
  return put(`promotions/review/${id}/pass`, undefined, { name: "passPromotionReviewItem" })
}

export const passPromotionReviewItemAll = async (id: number) => {
  //return put(`promotions/review/${id}/pass`, undefined, { name: "passPromotionReviewItem" })
}

// /v1/agent/promotions/review/1/reject
// /v1/agent/promotions/review/1/pass

export const getGatewayList = async (params: Request.GetPromotionGatewayList) => {
  const payload = {
    display: params.display
  }

  return get<Response.BaseList<Response.GetGatewayList>>("payment/gateway/list", payload, { name: "getGatewayList" })
}
