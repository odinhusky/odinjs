import { get, post, put, deleteData } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { ERROR_CODE, CURRENCY_TYPE, PROMOTION_REWARD_TYPE, EVENT_TYPE } from "@/utils/constants"
import { useCommon } from "@/hook/useCommon"
import { usePromotionStore } from "@/stores/promotionStore"
import { useLanguageStore } from "src/stores/languageStore"
import type { I18nTab } from "@/api/response.type"

type i18nKeys = keyof I18nTab<undefined>
const store = usePromotionStore()
const languageStore = useLanguageStore()
const currentLanguageKey = languageStore.currentLanguageOption.i18nKey as i18nKeys

export const getCollaborationSetting = async (id: number) => {
  return get<Response.GetPromotionDetail>(`collaboration/settings`, null, { name: "getCollaborationSetting" })
}

export const updateCollaborationSetting = async (params: Request.UpdateCollaborationItem) => {
  /* const startDate = format(new Date(params.start_date), "yyyy-MM-dd")
  const endDate = format(new Date(params.end_date), "yyyy-MM-dd")*/
  const payload: Request.AddCollaborationItem = {
    content_settings: params.content_settings,
    basic_setting: {
      // started_at: format(new Date(params.basic_setting.started_at), "yyyy-MM-dd HH:mm:ss").replace(" ", "T") + "Z",
      // ended_at: format(new Date(params.basic_setting.ended_at), "yyyy-MM-dd HH:mm:ss").replace(" ", "T") + "Z",
      // auto_payout: params.basic_setting.auto_payout,
      // reward_type: params.basic_setting.reward_type,
      show: params.basic_setting.show,
      settlement_type: params.basic_setting.settlement_type,
      settlement_week: params.basic_setting.settlement_week,
      // audit_rate: params.basic_setting.audit_rate === "" ? 0 : params.basic_setting.audit_rate,
      rebate: params.basic_setting.rebate,
      calculation_type: params.basic_setting.calculation_type
      // dispatched_time: params.basic_setting.dispatched_time,
      // dispatched_week: params.basic_setting.dispatched_week
    },
    active_member_settings: params.active_member_settings,
    rebate_settings: params.levelData
    // product_settings: {
    //   game_type: params.game_type.filter((item) => item !== 0),
    //   product_ids: params.product_code.filter((item) => item !== 0)
    // },
    // label_settings: params.label_settings
  }
  // if (params.basic_setting.auto_payout === 0) {
  //   payload.basic_setting.dispatched_time = ""
  // }

  return post(`collaboration/settings`, payload, { name: "updatePromotionItem" })
}

export const getCollaborationReviewList = async (params: Request.CollaborationReviewItem) => {
  //因候端API格式跟其他API不統一 特別處理
  let status = 0
  let auto_payout = 0
  console.log(params.status)
  //0-未派發, 1-已派發, 2-拒絕
  if (params.status === 1) {
    status = 0
  } else if (params.status === 2) {
    status = 2
  } else if (params.status === 3) {
    status = 1
  } else {
    status = params.status
  }
  //0-手動, 1-自動
  if (params.rewardType === 2) {
    auto_payout = 0
  } else if (params.rewardType === 1) {
    auto_payout = 1
  } else {
    auto_payout = params.rewardType
  }

  const payload = {
    currency_id: params.currency,
    started_at: params.start as any,
    ended_at: params.end as any,
    // status: status,
    // auto_payout: auto_payout,
    member_account: params.memberAccount,
    offset: params.offset,
    size: params.size
  }
  return get<Response.BaseList<Request.CollaborationReviewItem>>("/collaboration/settlements", payload, {
    name: "getCollaborationReviewList"
  })
}

export const rejectCollaborationReview = async (id: number) => {
  return put(`/collaboration/settlements/${id}/reject`, undefined, { name: "rejectCollaborationReview" })
}

export const passCollaborationReview = async (params: { id: number; amount: number; currency_id: number }) => {
  const payload = {
    params: [params]
  }
  return put(`/collaboration/settlements/${params.id}/confirm`, payload, { name: "passCollaborationReview" })
}

export const passCollaborationBatch = async (params: { id: number; amount: number; currency_id: number }[]) => {
  const payload = {
    params: params
  }
  return put(`/collaboration/settlements/confirm/batch`, payload, { name: "passCollaborationBatch" })
}
export const rejectCollaborationBatch = async (ids: number[]) => {
  const payload = {
    ids: ids
  }
  return put(`/collaboration/settlements/reject/batch`, payload, { name: "rejectCollaborationBatch" })
}
//全部派發
export const passCollaborationAll = async () => {
  return put(`/collaboration/settlements/confirm/all`, {}, { name: "passCollaborationAll" })
}
export const CollaborationReviewDetail = async (params: { id: number }) => {
  return get(`/collaboration/settlements/${params.id}/details`, undefined, { name: "CollaborationReviewDetail" })
}

export const getGatewayList = async (params: Request.GetPromotionGatewayList) => {
  const payload = {
    display: params.display
  }

  return get<Response.BaseList<Response.GetGatewayList>>("payment/gateway/list", payload, { name: "getGatewayList" })
}
