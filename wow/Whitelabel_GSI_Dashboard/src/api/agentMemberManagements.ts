import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

import { ERROR_CODE } from "@/utils/constants"
import * as fakeData from "@/api/fakeData/agentMemberCommissionSetting"
import { get, post, put } from "@/utils/request"
import { useTimeZoneStore } from "src/stores/timezoneStore"

// 將毫秒時間戳轉為站台時區 ISO 字串 (e.g. 2026-04-20T00:00:00+07:00)
const toIsoSiteOffset = (ms?: number | string | null) => {
  if (ms === undefined || ms === null || ms === "") return undefined
  const tz = useTimeZoneStore()
  const offsetMinutes = tz.targetOffsetMinutes
  const d = new Date(Number(ms) + offsetMinutes * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  const sign = offsetMinutes < 0 ? "-" : "+"
  const absMin = Math.abs(offsetMinutes)
  const oh = pad(Math.floor(absMin / 60))
  const om = pad(absMin % 60)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}${sign}${oh}:${om}`
}

/*列表*/
export const getAgentMemberCommissionSettingList = (params: Request.GetAgentMemberCommissionSetting) => {
  console.log(params)
  const payload = {
    name: params.commissionName,
    //account: params.memberAccount,
    enabled: params.enable,
    calculation_type: params.calculation_type,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return get<Response.GetAgentMemberCommissionSetting>("commissions", payload, {
    name: "getAgentMemberCommissionSettingList"
  })
}
/**列表-0級會員詳細*/
export const getAgentMemberCommissionSettingListDetail = (id: number) => {
  return get<Response.GetAgentMemberCommissionSetting>(
    `/commissions/settings/detail/${id}`,
    {},
    {
      name: "getAgentMemberCommissionSettingList"
    }
  )
}
export const getAgentMemberCommissionSettingListDetailAccount = (id: string) => {
  //如果列表搜尋帳號有輸入
  return get<Response.GetAgentMemberCommissionSetting>(
    `/commissions/settings/account/${id}/detail`,
    {},
    {
      name: "getAgentMemberCommissionSettingListDetailAccount"
    }
  )
}
interface Member {
  member_id: number
  account: string
  next_level_count: number
  amounts: any[]
}

interface GetAgentMemberCommissionDetail {
  list: Member[]
}
export const getAgentMemberCommissionSettingListSubordinateDetail = (params: {
  commission_id: number
  account: string
}) => {
  return get<GetAgentMemberCommissionDetail>(
    `/commissions/settings/detail/${params.commission_id}/${params.account}`,
    {},
    {
      name: "getAgentMemberCommissionSettingListSubordinateDetail"
    }
  )
}

/*新增*/
export const addAgentMemberCommissionSetting = async (params: Request.UpdateAgentCommissionItem) => {
  const payload = {
    ...params,
    payout_method: Number(params.payout_method ?? 1),
    enabled: true
  }
  return post<Response.GetPromotionDetail>(`commissions`, payload, { name: "addAgentMemberCommissionSetting" })
}

/*編輯*/
export const getAgentMemberCommissionSettingDetail = async (id: number) => {
  return get<Response.GetPromotionDetail>(`commissions/settings/${id}`, null, {
    name: "getAgentMemberCommissionSettingDetail"
  })
}

/*更新*/
export const updateAgentMemberCommissionSetting = async (
  params: Request.UpdateAgentCommissionItem | { id: number; enabled: boolean }
) => {
  const payload =
    "payout_method" in params
      ? {
          ...params,
          payout_method: Number(params.payout_method ?? 1)
        }
      : params
  return put(`commissions/settings/${params.id}`, payload, { name: "updateAgentMemberCommissionSetting" })
}

/*未設定代理佣金成員列表*/
export const getMemberLevel0Search = () =>
  get<{ list: object[] }>("/commissions/no_event_members", null, {
    name: "getMemberLevel0Search"
  })

export const getAgentMemberCommissionReview = async (params: Request.GetAgentMemberCommissionReview) => {
  console.log("get member list payload:")
  console.log(params)

  const { name, offset, size } = params

  let fakeList = fakeData.AgentMemberCommissionReviewList

  const fakeRes: Response.BaseResponse<Response.GetAgentMemberCommissionReview> = {
    code: ERROR_CODE.Enums.SUCCESS,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  if (name) {
    fakeList = fakeList.filter((item) => item.name.includes(name))
  }

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getAgentMemberCommissionReviewDetail = async (params: Request.GetAgentMemberCommissionReviewDetail) => {
  console.log("get member list payload: 111")
  console.log(params)
  let fakeList = fakeData.AgentMemberCommissionReviewDetail

  const fakeRes: Response.BaseResponse<Response.GetAgentMemberCommissionReviewDetail> = {
    code: ERROR_CODE.Enums.SUCCESS,
    msg: "",
    data: []
  }

  fakeRes.data = fakeList
  return await fakeRes
}

export const getAgentRelationshipSetting = async (params: Request.GetAgentRelationshipSetting) => {
  const { member_account, offset, size } = params

  let fakeList = fakeData.AgentRelationshipSettingList
  const fakeRes: Response.BaseResponse<Response.GetAgentRelationshipChainSetting> = {
    code: ERROR_CODE.Enums.SUCCESS,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  if (member_account) {
    fakeList = fakeList.filter((item) => item.member_account.includes(member_account))
  }

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getAgentRelationshipSettingDetail = async (params: Request.GetAgentRelationshipSetting) => {
  const { id } = params

  const fakeList = fakeData.AgentRelationshipSettingListDetail
  const selectItem = fakeList.filter((item) => item.id === id)

  const fakeRes: Response.BaseResponse<Response.GetAgentRelationshipChainSettingDetail> = {
    code: selectItem.length ? ERROR_CODE.Enums.SUCCESS : ERROR_CODE.Enums.MEMBER_DETAIL_NOT_EXIST,
    msg: selectItem.length ? "" : "member not exist",
    data: selectItem.length ? selectItem : undefined
  }

  return await fakeRes
}

// 將毫秒時間戳轉為 +08:00 ISO 字串 (e.g. 2026-04-20T00:00:00+08:00)
const toIsoPlus8 = (ms?: number | string | null) => {
  if (ms === undefined || ms === null || ms === "") return undefined
  const d = new Date(Number(ms) + 8 * 3600 * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+08:00`
}

// 會員代理明細列表
export const GetAgentMemberCommissionDetailList = async (params: Request.GetAgentMemberCommissionDetailDetail) => {
  const payload = {
    name: params.commissionName,
    account: params.memberAccount,
    calculation_type: params.calculation_type,
    payout_method: params.dispatch_type,
    start_time: toIsoPlus8(params.start),
    end_time: toIsoPlus8(params.end),
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return get<Response.AgentMemberCommissionDetail>("/commission/statements", payload, {
    name: "GetAgentMemberCommissionDetailList",
    usePlatform: true
  })
}

// 會員代理明細 0級
export const GetAgentMemberCommissionDetailDetail = async (params: Request.GetAgentMemberCommissionDetailDetail) => {
  return get<Response.AgentMemberCommissionDetail>(
    `/commissions/${params.commission_id}/statements/detail/${params.statement_id}`,
    {},
    {
      name: "GetAgentMemberCommissionDetailDetail"
    }
  )
}
// 會員代理明細-帳號搜尋
export const GetAgentMemberCommissionDetailDetailAccount = (params: {
  member_account: string
  start: number
  end: number
  name: string
}) => {
  const payload = {
    account: params.member_account,
    start_time: params.start,
    end_time: params.end,
    name: params.name
  }
  //如果列表搜尋帳號有輸入
  return get<Response.GetAgentMemberCommissionSetting>(`/commissions/statements/${params.member_account}`, payload, {
    name: "GetAgentMemberCommissionDetailDetailAccount"
  })
}

// 會員代理明細 N級
export const GetAgentMemberCommissionDetailNestedDetail = async (
  params: Request.GetAgentMemberCommissionDetailDetail
) => {
  return get<Response.AgentMemberCommissionDetail>(
    `/commissions/statements/detail/${params.statement_id}/${params.account}`,
    {},
    {
      name: "GetAgentMemberCommissionDetailNestedDetail"
    }
  )
}

export const GetAgentMemberCommissionStatementDetails = async (
  params: Request.GetAgentMemberCommissionStatementDetails
) => {
  const payload = {
    currency_id: params.currency_id
  }

  return get<Response.AgentMemberCommissionStatementDetail>(
    `/commission/statements/${params.statement_id}/details`,
    payload,
    {
      name: "GetAgentMemberCommissionStatementDetails",
      usePlatform: true
    }
  )
}

export const PostAgentMemberCommissionStatementPayout = async (
  params: Request.PostAgentMemberCommissionStatementAction
) => {
  return post<null>(
    `/commission/statements/${params.statement_id}/payout`,
    {},
    {
      name: "PostAgentMemberCommissionStatementPayout",
      usePlatform: true
    }
  )
}

export const PostAgentMemberCommissionStatementCancel = async (
  params: Request.PostAgentMemberCommissionStatementAction
) => {
  return post<null>(
    `/commission/statements/${params.statement_id}/cancel`,
    {},
    {
      name: "PostAgentMemberCommissionStatementCancel",
      usePlatform: true
    }
  )
}

export const PostAgentMemberCommissionStatementDetailPayout = async (
  params: Request.PostAgentMemberCommissionStatementDetailAction
) => {
  return post<null>(
    `/commission/statements/${params.statement_id}/details/${params.detail_id}/payout`,
    {},
    {
      name: "PostAgentMemberCommissionStatementDetailPayout",
      usePlatform: true
    }
  )
}

export const PostAgentMemberCommissionStatementDetailCancel = async (
  params: Request.PostAgentMemberCommissionStatementDetailAction
) => {
  return post<null>(
    `/commission/statements/${params.statement_id}/details/${params.detail_id}/cancel`,
    {},
    {
      name: "PostAgentMemberCommissionStatementDetailCancel",
      usePlatform: true
    }
  )
}

// 會員代理-傭金報表列表
export const GetAgentMemberCommissionReport = async (params: Request.GetAgentMemberCommissionReport) => {
  const rawCurrency = params.currency_id ?? params.currency
  const currency = Array.isArray(rawCurrency) ? rawCurrency[0] : rawCurrency
  const payload = {
    commission_name: params.commissionName,
    calculation_type: params.calculation_type,
    currency_id: Number(currency),
    start_date: toIsoSiteOffset(params.start),
    end_date: toIsoSiteOffset(params.end)
  }
  return get<Response.GetAgentMemberCommissionReport>(`/commission/reports`, payload, {
    name: "GetAgentMemberCommissionReport",
    usePlatform: true
  })
}

// 會員代理-傭金報表列 第一層
export const GetAgentMemberCommissioReportDetail = async (params: Request.GetAgentMemberCommissionReport) => {
  const rawCurrency = params.currency_id ?? params.currency
  const currency = Array.isArray(rawCurrency) ? rawCurrency[0] : rawCurrency
  const payload = {
    commission_id: Number(params.commission_id),
    currency_id: Number(currency),
    start_date: toIsoSiteOffset(params.start),
    end_date: toIsoSiteOffset(params.end)
  }
  return get<Response.GetAgentMemberCommissionReport>(`/commission/reports/members`, payload, {
    name: "GetAgentMemberCommissioReportDetail",
    usePlatform: true
  })
}
// 會員代理-傭金報表列 N級
export const GetAgentMemberCommissioReportNestedDetail = async (
  params: Request.GetAgentMemberCommissionReportNested
) => {
  const rawCurrency = (params as any).currency_id ?? (params as any).currency
  const currency = Array.isArray(rawCurrency) ? rawCurrency[0] : rawCurrency
  const payload = {
    commission_id: Number(params.commission_id),
    currency_id: Number(currency),
    member_id: Number(params.member_id),
    start_date: toIsoSiteOffset(params.start),
    end_date: toIsoSiteOffset(params.end)
  }
  return get<Response.GetAgentMemberCommissionReport>(`/commission/reports/members`, payload, {
    name: "GetAgentMemberCommissioReportNestedDetail",
    usePlatform: true
  })
}

// 會員代理-傭金報表 帳號搜尋
export const GetAgentMemberCommissioReportDetailAccount = (params: {
  account: string
  start: string | number
  end: string | number
  currency: number
}) => {
  const payload = {
    account: params.account,
    currency_id: Number(params.currency),
    start_date: toIsoSiteOffset(params.start),
    end_date: toIsoSiteOffset(params.end)
  }
  return get<Response.GetAgentMemberCommissionReport>(`/commission/reports/members`, payload, {
    name: "GetAgentMemberCommissioReportDetailAccount",
    usePlatform: true
  })
}

// 會員代理-傭金報表 直屬下級 (/platform/v1/agent/commission/reports/members)
export const GetAgentCommissionReportsMembers = async (params: {
  commission_id?: number | string
  currency_id: number | string
  start_date: number | string
  end_date: number | string
  member_id?: number | string
  account?: string
}) => {
  const payload = {
    account: params.account,
    commission_id: params.commission_id !== undefined ? Number(params.commission_id) : undefined,
    currency_id: Number(params.currency_id),
    member_id: params.member_id !== undefined ? Number(params.member_id) : undefined,
    start_date: toIsoSiteOffset(params.start_date),
    end_date: toIsoSiteOffset(params.end_date)
  }
  return get<Response.GetAgentCommissionReportsMembers>(`/commission/reports/members`, payload, {
    name: "GetAgentCommissionReportsMembers",
    usePlatform: true
  })
}

// 會員代理報表 N級
export const GetAgentMemberCommissionReportNestedDetail = async (params: Request.GetAgentMemberCommissionReport) => {
  return get<Response.GetAgentMemberCommissionReport>(
    `/commissions/report/list/${params.commission_id}/${params.grand_parent_account}/${params.currency_id}/${params.date}`,
    {},
    {
      name: "GetAgentMemberCommissionReportNestedDetail"
    }
  )
}
