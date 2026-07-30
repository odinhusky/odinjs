import * as fakeData from "@/api/fakeData/dayReportDetail"
import { get, put } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { ERROR_CODE, CURRENCY_TYPE, DATE_TYPE, BET_REPORT_DATE_TYPE, TABLE_SORT_TYPE } from "@/utils/constants"
import { useCommon } from "@/hook/useCommon"
import { format, startOfDay, endOfDay } from "date-fns"
import { useQueryStore } from "@/stores/queryStore"

// CashReport Level One
export const getCashReportList = async (params: Request.GetCashReportList) => {
  const payload = {
    master_id: params.adminAgentAccount,
    currency_id: params.currency,
    agent_id: params.agentAccount,
    wallet_type: params.wallet_type,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetCashReportItem>("/cash/report/list", payload, {
    name: "getCashReportList"
  })
}

// CashReport Level One Report Export
export const getCashReportExport = async (params: Request.GetCashReportList) => {
  const payload = {
    agent_id: params.agentAccount,
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }
  const response = await get<Blob>("/cash/report/list/export", payload, {
    name: "getCashReportExport",
    responseType: "blob"
  })
  return response
}

// 代理報表自身資料
export const getMemberOverviewPersonal = async (params: Request.GetMemberOverviewPersonal) => {
  const payload = {
    currency_id: params.currency,
    start_time: params.start,
    end_time: params.end,
    member_account: params.agentAccount
  }

  return await get<Response.GetMemberOverviewPersonalItem>("/member/overview", payload, {
    name: "getMemberOverviewPersonal",
    usePlatform: true
  })
}

// 代理報表直屬清單
export const getMemberOverviewList = async (params: Request.GetMemberOverviewList) => {
  const payload = {
    currency_id: params.currency,
    start_time: params.start,
    end_time: params.end,
    offset: params.offset,
    size: params.size,
    member_account: params.agentAccount
  }

  return await get<Response.GetMemberOverviewItem>("/member/overview/list", payload, {
    name: "getMemberOverviewList",
    usePlatform: true
  })
}

// 代理報表自身數據詳情（錢包類型明細）
export const getMemberOverviewDetail = async (params: Request.GetMemberOverviewDetail) => {
  const payload = {
    currency_id: params.currency,
    start_time: params.start,
    end_time: params.end,
    member_account: params.agentAccount,
    member_id: params.member_id
  }

  return await get<Response.GetMemberOverviewDetail>("/member/overview/detail", payload, {
    name: "getMemberOverviewDetail",
    usePlatform: true
  })
}

// 代理報表團隊數據詳情（錢包類型明細）
export const getMemberOverviewTeamDetail = async (params: Request.GetMemberOverviewDetail) => {
  const payload = {
    currency_id: params.currency,
    start_time: params.start,
    end_time: params.end,
    member_account: params.agentAccount,
    member_id: params.member_id
  }

  return await get<Response.GetMemberOverviewTeamDetail>("/member/overview/team/detail", payload, {
    name: "getMemberOverviewTeamDetail",
    usePlatform: true
  })
}

// CashReport Level Two
// generalAgent
export const getGeneralAgentCashReportDetail = async (params: Request.GetCashReportDetail) => {
  const payload = {
    date: params.date,
    currency_id: params.currencyId,
    agent_id: params.agentAccount,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return await get<Response.GetCashReportItem>("/cash/report/agent/list", payload, {
    name: "getGeneralAgentCashReportDetail"
  })
}
// agent
export const getAgentCashReportDetail = async (params: Request.GetCashReportDetail) => {
  const payload = {
    date: params.date,
    currency_id: params.currencyId,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return await get<Response.GetCashReportItem>("/cash/report/member/list", payload, {
    name: "getAgentCashReportDetail"
  })
}

// admin
export const getAdminCashReportDetail = async (params: Request.GetCashReportDetail) => {
  const payload = {
    date: params.date,
    currency_id: params.currencyId,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  return await get<Response.GetCashReportItem>("/cash/report/master/list", payload, {
    name: "getAdminCashReportDetail"
  })
}

// CashReport Level Two Report Export
// generalAgent
export const getGeneralAgentCashReportAgentExport = async (params: Request.GetCashReportDetail) => {
  const payload = {
    date: params.date,
    currency_id: params.currencyId,
    offset: params.offset,
    size: params.size,
    wallet_type: params.wallet_type
  }
  const response = await get<any>("/cash/report/list/export", payload, {
    name: "getGeneralAgentCashReportAgentExport",
    responseType: "blob"
  })
  return response
}
// agent
export const getAgentCashReportAgentExport = async (params: Request.GetCashReportDetail) => {
  const payload = {
    date: params.date,
    currency_id: params.currencyId,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/cash/report/member/list/export", payload, {
    name: "getAgentCashReportAgentExport",
    responseType: "blob"
  })
  return response
}

// CashReport Level Three
// agent
export const getAgentCashReportAgentMemberDetail = async (params: Request.GetCashReportDetail) => {
  const { genTimeFormat } = useCommon()
  const payload = {
    currency_id: params.currencyId,
    start_date: genTimeFormat(startOfDay(params.date), "yyyy-MM-dd HH:mm:ss", false),
    end_date: genTimeFormat(endOfDay(params.date), "yyyy-MM-dd HH:mm:ss", false),
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetAgentCashReportAgentMemberItem>(`/member/${params.memberId}/transaction/list`, payload)
}

export const getDepositReportList = async (params: Request.GetDepositReportList) => {
  const payload = {
    id: params.depositNumber,
    currency_id: params.currency,
    member_account: params.memberAccount,
    payment_type: params.type,
    status: params.saveStatus,
    date_type: DATE_TYPE.Enums.Apply,
    start_date: params.start,
    end_date: params.end
  }

  if (params.multiDateType?.length === 2) {
    payload.date_type = 0
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(DATE_TYPE.Enums.Review)) {
    payload.date_type = DATE_TYPE.Enums.Review
  }

  return await get<Response.GetDepositReportList>("/deposit_entry/history/list", payload, {
    name: "getDepositReportList"
  })
}

export const getWithdrawalReportList = async (params: Request.GetWithdrawalReportList) => {
  const payload = {
    id: params.withdrawalNumber,
    currency_id: params.currency,
    member_account: params.memberAccount,
    payment_type: params.type,
    status: params.saveStatus,
    date_type: DATE_TYPE.Enums.Apply,
    start_date: params.start,
    end_date: params.end
  }

  if (params.multiDateType?.length === 2) {
    payload.date_type = 0
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(DATE_TYPE.Enums.Review)) {
    payload.date_type = DATE_TYPE.Enums.Review
  }

  return await get<Response.GetWithdrawalReportList>("/withdraw_entry/history/list", payload, {
    name: "getWithdrawalReportList"
  })
}

// ProductBetReport Level One
export const getProductBetReportList = async (params: Request.GetProductBetReportList) => {
  const payload: any = {
    master_id: params.adminAgentAccount,
    currency_id: params.currency,
    game_type: params.game_type,
    product_code: params.code !== undefined ? params.code : undefined,
    wallet_type: params.wallet_type,
    agent_id: params.agentAccount,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }
  const searchParams = new URLSearchParams()
  Object.keys(payload).forEach((e) => {
    const value = payload[e]
    if (value !== undefined) {
      searchParams.append(e, value)
    }
  })

  if (params?.gameName?.length) {
    params.gameName.forEach((e) => {
      searchParams.append("product_code", e)
    })
  }

  if (params?.gameProductCode) {
    const queryStore = useQueryStore()
    const gameTypeId = queryStore.gameTypeList.find((e) => e.label === params?.gameProductCode)
    if (gameTypeId) {
      searchParams.append("game_type", `${gameTypeId.value}`)
    }
  }

  return await get<Response.GetProductBetReportList>("/product/report/list", searchParams, {
    name: "getProductBetReportList"
  })
}

// ProductBetReport Wallet Detail
export const getProductBetReportWalletDetail = async (params: Request.GetProductBetReportList) => {
  const payload: any = {
    master_id: params.adminAgentAccount,
    currency_id: params.currency,
    game_type: params.game_type,
    product_code: params.code !== undefined ? params.code : undefined,
    wallet_type: params.wallet_type,
    agent_id: params.agentAccount,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }
  const searchParams = new URLSearchParams()
  Object.keys(payload).forEach((e) => {
    const value = payload[e]
    if (value !== undefined) {
      searchParams.append(e, value)
    }
  })

  if (params?.gameName?.length) {
    params.gameName.forEach((e) => {
      searchParams.append("product_code", e)
    })
  }

  if (params?.gameProductCode) {
    const queryStore = useQueryStore()
    const gameTypeId = queryStore.gameTypeList.find((e) => e.label === params?.gameProductCode)
    if (gameTypeId) {
      searchParams.append("game_type", `${gameTypeId.value}`)
    }
  }

  return await get<Response.GetProductBetReportList>("/report/product-bet/detail", searchParams, {
    name: "getProductBetReportWalletDetail",
    usePlatform: true
  })
}

// ProductBetReport Level One Report Export
export const getProductBetReportExport = async (params: Request.GetProductBetReportList) => {
  const payload = {
    agent_id: params.agentAccount,
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    game_type: params.game_type,
    product_code: params.code,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/product/report/list/export", payload, {
    name: "getProductBetReportExport",
    responseType: "blob"
  })
  return response
}

export const getProductBetReportAgentDetail = async (params: Request.GetProductBetReportList) => {
  const payload = {
    product_code: params.id,
    currency_id: params.currency_id,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetProductBetReportList>("/product/report/member/list", payload, {
    name: "getProductBetReportAgentDetail"
  })
}

export const getProductBetReportGeneralAgentDetail = async (params: Request.GetProductBetReportList) => {
  const payload = {
    product_id: params.product_id,
    currency_id: params.currency_id,
    game_type: params.game_type,
    product_code: params.code
  }
  return await get<Response.GetProductBetReportList>("/agent/report/list", payload, {
    name: "getProductBetReportGeneralAgentDetail"
  })
}
export const getBetReportList = async (params: Request.GetBetReportList) => {
  const payload = {
    currency_id: params.currency,
    game_type: params.game_type,
    product_code: params.code,
    date_type: params.dateType,
    wallet_type: params.wallet_type,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }
  // TODO: 確認後端值
  if (params.multiDateType?.length === 2) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.All
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(BET_REPORT_DATE_TYPE.Enums.Settle)) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.Settle
  }
  return await get<Response.GetBetReportList>("/bet/report/list", payload, {
    name: "getBetReportList"
  })
}

export const getBetReportWalletDetail = async (params: Request.GetBetReportList) => {
  const payload = {
    currency_id: params.currency,
    game_type: params.game_type,
    product_code: params.code,
    date_type: params.dateType,
    wallet_type: params.wallet_type,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetBetReportList>("/report/bet/detail", payload, {
    name: "getBetReportWalletDetail",
    usePlatform: true
  })
}

export const getBetReportDetail = async (params: Request.GetBetReportList) => {
  const payload = {
    currency_id: params.currency,
    product_code: params.product_code,
    game_type: params.game_type,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetProductBetReportDetail>("/product/report/member/list", payload, {
    name: "getBetReportDetail"
  })
}

export const getBetReportProductDetail = async (params: Request.GetBetReportList) => {
  const payload = {
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    product_code: params.code,
    game_type: params.game_type,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetBetReportProductDetail>("/product/report/list", payload, {
    name: "getBetReportProductDetail"
  })
}

export const getMemberBetReportDetail = async (params: Request.GetMemberBetReportDetail) => {
  const payload = {
    currency_id: params.currency,
    product_code: params.product_code || params.code,
    member_id: params.member_id,
    start_date: params.start,
    end_date: params.end,
    settled_start: params.end,
    settled_end: params.end,
    code: params.betNumber,
    game_type: params.game_type,
    wallet_type: params.wallet_type,
    offset: params.offset,
    size: params.size
  }
  if (params.dateType === 1) {
    payload.start_date = params.start
    payload.end_date = params.end
    delete payload.settled_start
    delete payload.settled_end
  } else {
    payload.settled_start = params.start
    payload.settled_end = params.end
    delete payload.start_date
    delete payload.end_date
  }

  return await get<Response.GetMemberBetReportDetail>(`/member/${params.member_id}/wager/list`, payload, {
    name: "getMemberBetReportDetail"
  })
}
// masterAgentBetReportList
export const getMasterAgentBetReportList = async (params: Request.MasterAgentBetReportList) => {
  let payload = {
    master_id: params.adminAgentAccount,
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    game_type: params.game_type,
    product_code: params.code,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMasterAgentBetReportList>("/master/report/list", payload, {
    name: "getMasterAgentBetReportList"
  })
}

// agentBetReport
export const getAgentBetReportList = async (params: Request.GetAgentBetReportList) => {
  let payload = {
    agent_id: params.agentAccount,
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    game_type: params.game_type,
    product_code: params.code,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetAgentBetReportList>("/agent/report/list", payload, {
    name: "getAgentBetReportList"
  })
}
//總代-佣金報表
export const getAgentCommissionReportList = async (params: Request.GetAgentBetReportList) => {
  let payload = {
    agent_id: params.agentAccount,
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    game_type: params.game_type,
    product_code: params.product_code,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetAgentBetReportList>("/report/agent-commission", payload, {
    usePlatform: true
  })
}

export const AgentCommissionReportExport = async (params: Request.GetAgentBetReportList) => {
  const payload = {
    agent_id: params.agentAccount,
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    game_type: params.game_type,
    product_code: params.product_code,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/report/agent-commission/export", payload, {
    name: "getUserReportExport",
    responseType: "blob",
    usePlatform: true
  })
  return response
}

/** 取得總代產品 */
export const getAgentProductList = async () => {
  return get<Response.CustomerServiceLinkList>(
    "/report/options/available-products",
    {},
    {
      usePlatform: true
    }
  )
}

export const getBetRecordList = async (params: Request.GetBetRecordList) => {
  let payload = {
    currency_id: params.currency,
    code: params.betNumber,
    member_account: params.memberAccount,
    game_type: params.game_type,
    product_code: params.code,
    gaming_site: params.gaming_site,
    wallet_type: params.wallet_type,
    date_type: BET_REPORT_DATE_TYPE.Enums.Bet,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }

  if (params.multiDateType?.length === 2) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.All
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(BET_REPORT_DATE_TYPE.Enums.Settle)) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.Settle
  }

  return get<Response.GetBetRecordList>("/wager/list", payload, {
    name: "getBetRecordList"
  })
}

export const getBetRecordListExport = async (params: Request.GetBetRecordList) => {
  let payload = {
    currency_id: params.currency,
    code: (params as any).orderNumber,
    member_account: params.memberAccount,
    game_type: params.game_type,
    product_code: params.code,
    date_type: BET_REPORT_DATE_TYPE.Enums.Bet,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }

  if (params.multiDateType?.length === 2) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.All
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(BET_REPORT_DATE_TYPE.Enums.Settle)) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.Settle
  }

  const response = await get<any>("/wager/list/export", payload, {
    name: "getBetRecordListExport"
  })
  return response
}

// UserReport Level One
export const getUserReportList = async (params: Request.GetUserReportList) => {
  const payload = {
    master_id: params.adminAgentAccount,
    agent_id: params.agentAccount,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetUserReportItem>("/traffic/report/list", payload, {
    name: "getUserReportList"
  })
}

// UserReport Level One Report Export
export const getUserReportExport = async (params: Request.GetUserReportList) => {
  const payload = {
    agent_id: params.agentAccount,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/traffic/report/list/export", payload, {
    name: "getUserReportExport",
    responseType: "blob"
  })
  return response
}

// UserReport Level Two
// GeneralAgentDetail
export const getUserReportGeneralAgentList = async (params: Request.GetUserReportList) => {
  const { genTimeFormat } = useCommon()

  const payload = {
    date: genTimeFormat(params.date as any, "yyyy-MM-dd"),
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetUserReportItem>("/traffic/report/agent/list", payload, {
    name: "getUserReportGeneralAgentList"
  })
}

// UserReport Level Two Report Export
export const getUserReportGeneralAgentExport = async (params: Request.GetUserReportGeneralAgentExport) => {
  const { genTimeFormat } = useCommon()

  const payload = {
    date: genTimeFormat(params.date as any, "yyyy-MM-dd")
  }

  const response = await get<Response.GetUserReportItem>("/traffic/report/agent/list/export", payload, {
    name: "getUserReportGeneralAgentExport",
    responseType: "blob"
  })
  return response
}

// UserReport Level Two
// admin
export const getUserReportAdminList = async (params: Request.GetUserReportList) => {
  const { genTimeFormat } = useCommon()

  const payload = {
    date: genTimeFormat(params.date as any, "yyyy-MM-dd"),
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetUserReportItem>("/traffic/report/master/list", payload, {
    name: "getUserReportAdminList"
  })
}

// agent
export const getUserReportAgentList = async (params: Request.GetUserReportList) => {
  const { genTimeFormat } = useCommon()

  const payload = {
    date: genTimeFormat(params.date as any, "yyyy-MM-dd"),
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetUserReportItem>("/cash/report", payload, {
    name: "getUserReportAgentList"
  })
}

export const getDayReportList = async (params: Request.GetDayReportList) => {
  const { id, date, offset, size, total_deposit, total_withdrawal_amount, total_entry_exit } = params

  let fakeList: Response.GetDayReportList = [
    {
      id: 10,
      date: 1693495184381,
      active_player: "252,123",
      new_rigister: "685"
    },
    {
      id: 11,
      date: 1693495184381,
      active_player: "244",
      new_rigister: "456"
    },
    {
      id: 12,
      date: 1642495184381,
      active_player: "252,123",
      new_rigister: "685.00"
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetDayReportList> = {
    code: 0,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    },
    total: {
      total_deposit: total_deposit,
      total_withdrawal_amount: total_withdrawal_amount,
      total_entry_exit: total_entry_exit
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getAccountFlowList = async (params: Request.GetAccountFlowList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    transaction_type_ids: params.accountFlowType,
    wallet_type: params.wallet_type,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }
  return await get<Response.GetAccountFlowList>("/wallet_trans/list", payload, {
    name: "getAccountFlowList"
  })
}

export const getDayReportDateDetail = async (params: Request.GetDayReportDetail) => {
  const { offset, size } = params

  const fakeList = fakeData.dayReportDateDetail

  const fakeRes: Response.BaseResponse<Response.GetDayReportDateDetailList> = {
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

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getDayReportRegistDetail = async (params: Request.GetDayReportDetail) => {
  const { offset, size } = params

  const fakeList = fakeData.dayReportRegistDetail

  const fakeRes: Response.BaseResponse<Response.GetDayReportRegistDetailList> = {
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

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getAccountFlowType = async () => {
  return await get<Response.GetAccountFlowTypeList>(
    "/wallet_trans/wallet_trans_type/dropdown",
    {},
    {
      name: "getAccountFlowType"
    }
  )
}

export const getMemberBetReportList = async (params: Request.GetMemberBetReportList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    label: params.memberTag,
    not_label: params.not_label,
    wallet_type: params.wallet_type,
    recommender: params.recommender,
    offset: params.offset,
    size: params.size,
    order_type: params.order_type,
    sort_type: params.sort_type ? parseInt(params.sort_type as any as string) : TABLE_SORT_TYPE.Enums.ASC
  }

  return await get<Response.GetMemberBetReportList>("/bet/report/member/list", payload, {
    name: "getMemberBetReportList"
  })
}

// MemberBetReport Wallet Detail
export const getMemberBetReportWalletDetail = async (params: Request.GetMemberBetReportList) => {
  const payload = {
    member_id: params.member_id,
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    label: params.memberTag,
    not_label: params.not_label,
    wallet_type: params.wallet_type,
    recommender: params.recommender,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetMemberBetReportList>("/report/member-bet/detail", payload, {
    name: "getMemberBetReportWalletDetail",
    usePlatform: true
  })
}

export const getMemberBetReportExport = async (params: Request.GetMemberBetReportList) => {
  const payload = {
    member_account: params.memberAccount,
    currency_id: params.currency,
    label: params.memberTag,
    not_label: params.not_label,
    start_date: params.start as any,
    end_date: params.end as any
  }
  const response = await get<any>("/bet/report/member/list/export", payload, {
    name: "getMemberBetReportExport",
    responseType: "blob"
  })
  return response
}

export const getPromotionExport = async (params: Request.GetPromotionList) => {
  const payload = {
    title: params.title,
    type: params.type,
    currency_id: params.currency_id,
    status: params.status,
    offset: params.offset,
    size: params.size,
    start_date: params.start as any,
    end_date: params.end as any
  }
  const response = await get<any>("/promotions/review/list/export", payload, {
    name: "getPromotionExport"
  })

  return response
}

export const getDailyOverviewtFieldsAvailable = async () => {
  const response = await get<string[]>("/report/daily-overview/fields/available", null, {
    name: "getDailyOverviewtFieldsAvailable"
  })

  return response
}

export const getDailyOverviewtSetting = async () => {
  const response = await get<Response.DailyOverviewtSetting>("/report/daily-overview/settings", null, {
    name: "getDailyOverviewtSetting"
  })
  return response
}

export const updateDailyOverviewtSetting = async (params: Response.DailyOverviewtSetting) => {
  return put("/report/daily-overview/settings", params, { name: "updateDailyOverviewtSetting" })
}

export const getDailyOverviewtReportList = async (params: Request.GetDailyOverviewtReportList) => {
  const payload = {
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    gaming_site: params.gaming_site,
    offset: params.offset,
    size: params.size
  }

  const response = await get<Response.BaseList<Response.GetDailyOverviewtReportList>>(
    "/report/daily-overview",
    payload,
    {
      name: "getDailyOverviewtReportList"
    }
  )

  return response
}

export const getDailyOverviewtReportExport = async (params: Request.GetDailyOverviewtReportExport) => {
  const payload = {
    currency_id: params.currency,
    start_date: params.start as any,
    end_date: params.end as any,
    offset: params.offset,
    size: params.size
  }

  const response = await get<Blob>("/report/daily-overview/export", payload, {
    name: "getDailyOverviewtReportExport",
    responseType: "blob"
  })
  return response
}

// UserReport Level One
export const getAuroraOverviewReportList = async (params: Request.GetAuroraOverviewReportList) => {
  const payload = {
    agent_code: params.auroraAdminAgentAccount,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }

  return await get<Response.GetAuroraOverviewReportList>("/report/aurora_overview", payload, {
    name: "getAuroraOverviewReportList"
  })
}

// UserReport Level One Report Export
export const getAuroraOverviewReportExport = async (params: Request.GetAuroraOverviewReportList) => {
  const payload = {
    agent_code: params.auroraAdminAgentAccount,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/report/aurora_overview/export", payload, {
    name: "getAuroraOverviewReportExport",
    responseType: "blob"
  })
  return response
}

// v1/agent/wager/game_history
export const getAgentWagerGameHistory = async (params: Request.GetAgentWagerGameHistory) => {
  const { genTimeFormat } = useCommon()
  const payload = {
    code: params.code,
    product_code: params.productCode
  }
  return await get("/wager/game_history", payload, {
    name: "getAgentWagerGameHistory"
  })
}

export const getFreeGameList = async (params: Request.GetBetRecordList) => {
  const payload = {
    member_account: params.memberAccount,
    code: params.betNumber,
    currency_id: params.currency,
    wallet_type: params.wallet_type,
    product_code: params.code,
    start_date: params.start as any,
    end_date: params.end as any,
    date_type: BET_REPORT_DATE_TYPE.Enums.Bet,
    is_free_round: true,
    offset: params.offset,
    size: params.size
  }
  if (params.multiDateType?.length === 2) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.All
  }

  if (params.multiDateType?.length === 1 && params.multiDateType?.includes(BET_REPORT_DATE_TYPE.Enums.Settle)) {
    payload.date_type = BET_REPORT_DATE_TYPE.Enums.Settle
  }
  return await get<Response.GetBetRecordList>("/wager/list", payload, {
    name: "getFreeGameList"
  })
}
