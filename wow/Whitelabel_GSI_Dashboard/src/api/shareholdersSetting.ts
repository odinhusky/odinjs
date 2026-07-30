import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"

export const getShareholdersSetting = async () => {
  return get<Response.AddShareholderProxyItem>(`shareholders/settings`, null, { name: "getShareholdersSetting" })
}
export const getShareholdersLvSetting = async () => {
  return get<Response.GetPromotionDetail>(`shareholders/settings/levels`, null, { name: "getShareholdersLvSetting" })
}

export const updateShareholdersSetting = async (params: Request.AddShareholderProxyItem) => {
  return put(`shareholders/settings`, params, { name: "updateShareholdersSetting" })
}

export const getShareholdersAccountSetting = async (params?: Request.getShareholdersAccountSettings) => {
  const { formatDate } = useCommon()
  const payload: Request.getShareholdersAccountSettings = {
    account: params?.account,
    tier: params?.tier,
    start_time: formatDate(params?.start as any, false),
    end_time: formatDate(params?.end as any, true),
    offset: params?.offset,
    size: params?.size
  }

  return get<Response.BaseList<Response.AddShareholderProxyItem>>("shareholders/members", payload, {
    name: "getShareholdersAccountSetting"
  })
}
export const updateShareholdersAccountSetting = async (params: Request.getShareholdersAccountSettings) => {
  return put(`shareholders/members/${params.member_id}`, params, { name: "updatePromotionItemStatus" })
}

//匯出股東代理列表
export const shareholdersAccountExport = async (params: Request.getShareholdersAccountSettings) => {
  const { formatDate } = useCommon()

  const payload = {
    account: params.account,
    tier: params.tier,
    start_time: formatDate(params?.start as any, false),
    end_time: formatDate(params?.end as any, true)
  }
  const response = await get<any>(`/shareholders/members/export`, payload, {
    name: "shareholdersAccountExport",
    responseType: "blob"
  })
  return response
}

// 股東盤明細列表
export const getShareholdersDetailList = async (params: Request.GetShareholdersDetailList) => {
  const { formatDate } = useCommon()
  const payload = {
    account: params.memberAccount,
    currency_id: params.currency,
    start_time: formatDate(params?.start as any, false),
    end_time: formatDate(params?.end as any, true),
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>("/shareholders/events", payload, {
    name: "getShareholdersDetailList"
  })
}

// 發佈
export const ShareholdersDetailPost = async (event_id: number) => {
  return post(
    `/shareholders/events/${event_id}/statistics/release`,
    {},
    {
      name: "ShareholdersDetailPost"
    }
  )
}
//取消發佈
export const ShareholdersDetailCancelPost = async (event_id: number) => {
  return post(
    `/shareholders/events/${event_id}/statistics/revoke`,
    {},
    {
      name: "ShareholdersDetailCancelPost"
    }
  )
}
// 股東盤明細
export const getShareholdersDetail = async (params: Request.GetShareholdersDetails) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>(`/shareholders/events/${params.id}/entries`, payload, {
    name: "getShareholdersDetail"
  })
}

//匯出
export const shareholdersDetailExport = async (event_id: string) => {
  const response = await get<any>(
    `/shareholders/events/${event_id}/entries/export`,
    {},
    {
      name: "shareholdersNestedDetailExport",
      responseType: "blob"
    }
  )
  return response
}

//單一傭金事件
export const getShareholderSingleEvent = async (event_id: string) => {
  return await get<{ status: number; rate_base: number; version: string }>(
    `/shareholders/events/${event_id}`,
    {},
    {
      name: "getShareholderSingleEvent"
    }
  )
}

// 全部派發
export const postShareholdersDetailDistAll = async (event_id: string) => {
  return post(
    `/shareholders/events/${event_id}/payout`,
    {},
    {
      name: "postShareholdersDetailDistAll"
    }
  )
}
// 全部取消
export const postShareholdersDetailCancelAll = async (event_id: string) => {
  return post(
    `/shareholders/events/${event_id}/cancel`,
    {},
    {
      name: "postShareholdersDetailCancelAll"
    }
  )
}
// 派發
export const postShareholdersDetailMandatoryDist = async (params: Request.ShareholdersDistribution) => {
  return post(
    `/shareholders/events/${params.event_id}/entries/${params.entry_id}/payout`,
    {},
    {
      name: "postShareholdersDetailMandatoryDist"
    }
  )
}

// 取消
export const shareholdersDetailCancel = async (params: Request.ShareholdersDistribution) => {
  return post(
    `/shareholders/events/${params.event_id}/entries/${params.entry_id}/cancel`,
    {},
    {
      name: "shareholdersDetailCancel"
    }
  )
}

//下級明細
export const getShareholdersNestedDetail = async (params: Request.GetShareholderNested) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetCommissionDetailList>(
    `/shareholders/events/${params.event_id}/entries/${params.entry_id}/statement`,
    payload,
    {
      name: "getShareholdersNestedDetail"
    }
  )
}
//匯出
export const shareholdersNestedDetailExport = async (params: Request.GetShareholderNested) => {
  const response = await get<any>(
    `/shareholders/events/${params.event_id}/entries/${params.entry_id}/statement/export`,
    {},
    {
      name: "shareholdersNestedDetailExport",
      responseType: "blob"
    }
  )
  return response
}

//取得數據
export const shareholderStatistics = async (event_id: string) => {
  return await get<Response.GetCommissionDetailList>(
    `/shareholders/events/${event_id}/statistics/game`,
    {},
    {
      name: "getShareholdersDetail"
    }
  )
}
//更新數據

export const updateShareholderStatistics = async (event_id: string, statistics: Request.GetShareholderStatistics[]) => {
  const payload = {
    list: statistics
  }
  return put(`/shareholders/events/${event_id}/statistics/game`, payload, { name: "updateShareholderStatistics" })
}
