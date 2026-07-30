import { get, post, put, deleteData } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { useCommon } from "@/hook/useCommon"

const { genTimeFormat } = useCommon()
export const getInvitationBounsList = async (params?: Request.GetInvitationBonusList) => {
  const payload: Request.GetInvitationBonusList = {
    status: params?.status,
    offset: params?.offset,
    size: params?.size
  }
  if (params?.start && params?.end) {
    payload.start_time = params?.start as any
    payload.end_time = params?.end as any
  }
  return get<Response.BaseList<Response.GetInvitationBonus>>("/referral_signup/campaigns", payload, {
    name: "getInvitationBounsList"
  })
}

export const getInvitationBounsDetail = async (id: number) => {
  return get<Response.GetInvitationBonus>(`/referral_signup/campaigns/${id}`, null, {
    name: "getInvitationBounsDetail"
  })
}

export const updateInvitationBounsItem = async (params: Request.AddInvitationBonusItem, id: number) => {
  const payload: Request.AddInvitationBonusItem = {
    settlement_enabled: params.settlement_enabled,
    period_start_at: params.start_date as any,
    period_end_at: params.end_date as any,
    payout_method: params.payout_method,
    turnover_rate: parseFloat(params.turnover_rate as any as string),
    i18n: params.i18n,
    labels: params.labels,
    levels: params.levelData,
    metrics: JSON.parse(JSON.stringify(params.metrics))
  }

  //空字串API會報錯 所以強制給-1
  payload.metrics.forEach((item) => {
    if (item.valid_bet === "") {
      item.valid_bet = -1
    }
    if (item.deposit === "") {
      item.deposit = -1
    }
  })

  return put(`/referral_signup/campaigns/${id}`, payload, { name: "updatePromotionItem" })
}

export const deletePromotionItem = async (id: number) => {
  return deleteData(`promotions/${id}`, null, { name: "deletePromotionItem" })
}

export const AddInvitationBouns = async (params: Request.AddInvitationBonusItem) => {
  const payload: Request.AddInvitationBonusItem = {
    settlement_enabled: params.settlement_enabled,
    period_start_at: params.start_date,
    period_end_at: params.end_date,
    payout_method: params.payout_method,
    turnover_rate: parseFloat(params.turnover_rate as any as string),
    i18n: params.i18n,
    labels: params.labels,
    levels: params.levelData,
    metrics: params.metrics
  }
  return post(`/referral_signup/campaigns`, payload, { name: "AddInvitationBouns" })
}

//取得獎勵事件
export const getInvitationBounsEventList = async (params: Request.GetInvitationBonusEventList) => {
  const payload: Request.GetInvitationBonusEventList = {
    payout_method: params.rewardType,
    offset: params.offset,
    size: params.size
  }
  payload.start_time = params?.start as any
  payload.end_time = params?.end as any
  return get<Response.BaseList<Response.GetInvitationBonusDetail>>("referral_signup/events", payload, {
    name: "getInvitationBounsEventList"
  })
}
//取得獎勵明細
export const getInvitationBounsDetailList = async (params: Request.GetInvitationBonusDetail) => {
  const payload: Request.GetInvitationBonusDetail = {
    campaign_id: params.campaign_id,
    event_id: params.event_id
  }

  return get<Response.BaseList<Response.GetInvitationBonusDetail>>("referral_signup/entries", payload, {
    name: "getInvitationBounsDetailList"
  })
}

// 派發
export const postInvitationBounsDist = async (params: { event_id: string; entry_id?: number }) => {
  return post(
    `/referral_signup/events/${params.event_id}/entries/${params.entry_id}/payout`,
    {},
    {
      name: "postInvitationBounsDist"
    }
  )
}

// 取消
export const InvitationBounsDetailCancel = async (params: { event_id: string; entry_id?: number }) => {
  return post(
    `/referral_signup/events/${params.event_id}/entries/${params.entry_id}/cancel`,
    {},
    {
      name: "InvitationBounsDetailCancel"
    }
  )
}

//下級明細
export const getInvitationBounsNestedDetail = async (params: {
  campaign_id: string
  parent_id?: number
  active_member_count?: number
}) => {
  const payload = {
    campaign_id: params.campaign_id,
    parent_id: params.parent_id,
    active_member_count: params.active_member_count
  }
  console.log(payload)
  return await get<Response.GetInvitationBonusDetail>(`/referral_signup/members`, payload, {
    name: "getInvitationBounsNestedDetail"
  })
}
