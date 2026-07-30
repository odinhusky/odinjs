import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"
import { flattenDiagnosticMessageText } from "typescript"

// CommissionDetail
export const getCommissionDetailList = async (params: Request.GetCommissionDetailList) => {
  const payload = {
    group_name: params.groupName,
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    dispatch_type: params.rewardType,
    wallet_type: params.wallet_type,
    calculate_type: params.calculate_type,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>("/rebate/event/list", payload, {
    name: "getCommissionDetailList"
  })
}

export const getCommssionDetailDetail = async (params: Request.GetCommissionDetailDetail) => {
  const payload = {
    group_name: params.group_name,
    currency_id: params.currency,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>(`/rebate/event/${params.id}/entry/list`, payload, {
    name: "getCommssionDetailDetail"
  })
}

// 全部派發
export const postCommssionDetailDistributeAll = async (params: Request.postCommssionDistributeAll) => {
  /*const payload = {
    currency_id: params.currency_id,
    dispatch_type: Number(params.dispatch_type)
  }*/
  return post(
    `/rebate/event/${params.id}/dispatch/batch`,
    {},
    {
      name: "postCommssionDetailDistributeAll"
    }
  )
}

// 強制派發
export const postCommssionDetailMandatoryDistribution = async (params: Request.postCommssionMandatoryDistribution) => {
  return post(
    `/rebate/event/${params.event_id}/entry/${params.entry_id}/dispatch`,
    {},
    {
      name: "postCommssionDetailMandatoryDistribution",
      params: {
        force: params.force ?? true
      }
    }
  )
}

//匯出
export const commssionDetailExport = async (id: number) => {
  const response = await get<any>(
    `/rebate/event/${id}/entry/list/export`,
    {},
    {
      name: "commssionDetailExport",
      responseType: "blob"
    }
  )
  return response
}
// CommissionSetting
export const getCommssionSettingList = async (params: Request.GetCommissionSettingList) => {
  const payload = {
    group_name: params.groupName,
    start_date: params.start,
    end_date: params.end,
    dispatch_type: params.rewardType,
    enable: params.enable,
    lang: params.lang,
    wallet_type: params.wallet_type,
    calculate_type: params.calculate_type,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionSettingList>("/rebate/group/list", payload, {
    name: "GetCommissionSettingList"
  })
}

export const getCommssionSettingSingleList = async (params: Request.GetCommissionSettingList) => {
  return await get<Response.GetCommissionSettingList>(
    `/rebate/group/${params.id}`,
    {},
    {
      name: "getCommssionSettingSingleList"
    }
  )
}

export const updateCommssionSetting = async (params: Request.GetCommissionSettingList) => {
  return await put<Response.GetCommissionSettingList>(`/rebate/group/${params.id}`, params, {
    name: "updateCommssionSetting"
  })
}

export const updateCommssionSettingStatue = async (params: { id: number; enable: boolean }) => {
  return await put<Response.GetCommissionSettingList>(`/rebate/group/${params.id}`, params, {
    name: "updateCommssionSetting"
  })
}

export const deleteCommssionSetting = async (params: Request.GetCommissionSetting) => {
  return await deleteData<Response.GetCommissionSettingList>(
    `/rebate/group/${params.id}`,
    {},
    {
      name: "deleteCommssionSetting"
    }
  )
}

export const postCommssionSetting = async (params: Request.GetCommissionSettingList) => {
  return await post<Response.GetCommissionSettingList>(`/rebate/group`, params, {
    name: "postCommssionSetting"
  })
}

//上級返佣設定

export const getReferralCommssionSetting = async () => {
  return await get<Response.ReferralRebateGroups>(
    `/referral_rebate/groups`,
    {},
    {
      name: "getReferralCommssionSetting"
    }
  )
}

export const updateReferralCommssionSetting = async (params: Request.GetReferralCommissionSettingList) => {
  return await put<Response.ReferralRebateGroups>(`/referral_rebate/groups`, params, {
    name: "updateReferralCommssionSetting"
  })
}

// 上級返佣明細
export const getReferralCommissionDetailList = async (params: Request.GetCommissionDetailList) => {
  const payload = {
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    dispatch_type: params.rewardType,
    calculate_type: params.calculate_type,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return await get<Response.GetCommissionDetailList>("/referral_rebate/events", payload, {
    name: "getReferralCommissionDetailList"
  })
}

export const getReferralCommssionDetail = async (params: Request.GetCommissionDetailDetail) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>(`/referral_rebate/events/${params.id}/entries`, payload, {
    name: "getReferralCommssionDetail"
  })
}

//下級明細
export const getReferralCommssionNestedDetail = async (params: Request.GetCommissionDetailDetail) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>(
    `/referral_rebate/events/${params.event_id}/entries/${params.entry_id}/statements`,
    payload,
    {
      name: "getReferralCommssionNestedDetail"
    }
  )
}

// 全部派發
export const postReferralCommssionDetailDistAll = async (params: Request.postCommssionDistributeAll) => {
  /*const payload = {
    currency_id: params.currency_id,
    dispatch_type: Number(params.dispatch_type)
  }*/
  return post(
    `/referral_rebate/events/${params.id}/dispatch/batch`,
    {},
    {
      name: "postReferralCommssionDetailDistAll"
    }
  )
}

// 強制派發+派發
export const postReferralCommssionDetailMandatoryDist = async (params: Request.postCommssionMandatoryDistribution) => {
  const payload = {
    force: params.force
  }
  return post(`/referral_rebate/events/${params.event_id}/entries/${params.entry_id}/dispatch`, payload, {
    name: "postReferralCommssionDetailMandatoryDist"
  })
}

// 取消
export const referralCommssionDetailCancel = async (params: Request.postCommssionMandatoryDistribution) => {
  return post(
    `/referral_rebate/events/${params.event_id}/entries/${params.entry_id}/cancel`,
    {},
    {
      name: "referralCommssionDetailCancel"
    }
  )
}
