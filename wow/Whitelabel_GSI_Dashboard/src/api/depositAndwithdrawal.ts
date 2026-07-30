import AdminRequest from "../utils/adminRequest"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"
import { ERROR_CODE } from "@/utils/constants"

export const getDepositList = (params: Request.GetDepositAndWithdrawalList) => {
  const payload = {
    trans_code: params.depositNumber,
    member_account: params.memberAccount,
    payment_type: params.paymentType,
    payment_gateway_id: params.payer,
    level_id: params.tierWhenDepositing,
    currency_id: params.currency,
    is_first: params.firstDeposit,
    status: params.saveStatus,
    operator: params.operator,
    ref_trans_code: params.ref_trans_code,
    recommender: params.recommender,
    start_date: params.start,
    end_date: params.end,
    date_type: params.dateType ? params.dateType : 1,
    offset: params.offset,
    size: params.size
  }

  if (params.firstDeposit !== undefined && params.firstDeposit !== null) {
    payload.is_first = (params.firstDeposit as any) === 1
  }
  /*
  if (params.dateType !== undefined && params.dateType !== null) {
    payload.date_type = params.dateType
  }*/

  return get<Response.GetDepositAndWithdrawalList>("/deposit_entry/list", payload, {
    name: "getDepositList"
  })
}

export const exportDepositList = async (params: Request.GetDepositAndWithdrawalList) => {
  const payload = {
    trans_code: params.depositNumber,
    member_account: params.memberAccount,
    payment_type: params.paymentType,
    payment_gateway_id: params.payer,
    level_id: params.tierWhenDepositing,
    currency_id: params.currency,
    is_first: params.firstDeposit,
    status: params.saveStatus,
    operator: params.operator,
    ref_trans_code: params.ref_trans_code,
    recommender: params.recommender,
    start_date: params.start,
    end_date: params.end,
    date_type: params.dateType ? params.dateType : 1,
    offset: params.offset,
    size: params.size
  }

  if (params.firstDeposit !== undefined && params.firstDeposit !== null) {
    payload.is_first = (params.firstDeposit as any) === 1
  }

  const response = await get<any>("/deposit_entry/list/export", payload, {
    name: "exportDepositList",
    responseType: "blob"
  })
  return response
}

export const getDepositDetail = (params: Request.GetDepositAndWithdrawalDetail) =>
  get<Response.GetDepositAndWithdrawalList>(
    `/deposit_entry/${params.id}`,
    {},
    {
      name: "getDepositDetail"
    }
  )

export const getWithdrawDetail = (params: Request.GetDepositAndWithdrawalDetail) =>
  get<Response.DepositAndWithdrawalDetailItem>(
    `/withdraw_entry/${params.id}`,
    {},
    {
      name: "getWithdrawDetail"
    }
  )
/*鎖單*/
export const WithdrawLlocked = (params: Request.GetDepositAndWithdrawalDetail) =>
  put<Response.DepositAndWithdrawalDetailItem>(
    `/withdraw_entry/${params.id}/seize`,
    {},
    {
      name: "WithdrawLlocked"
    }
  )

export const getWithdrawsList = (params: Request.GetDepositAndWithdrawalList) => {
  const payload = {
    trans_code: params.withdrawalNumber,
    member_account: params.memberAccount,
    payment_type: params.paymentType,
    payment_gateway_id: params.payer,
    level_id: params.tierWhenDepositing,
    currency_id: params.currency,
    is_first: params.firstDeposit,
    status: params.saveStatus,
    operator: params.operator,
    ref_trans_code: params.ref_trans_code,
    start_date: params.start,
    end_date: params.end,
    date_type: params.dateType ? params.dateType : 1,
    offset: params.offset,
    size: params.size
  }
  if (params.firstDeposit !== undefined && params.firstDeposit !== null) {
    payload.is_first = (params.firstDeposit as any) === 1
  }

  // if (params.dateType !== undefined && params.dateType !== null) {
  //   payload.date_type = params.dateType === 0 ? 1 : 2
  // }

  return get<Response.GetDepositAndWithdrawalList>("/withdraw_entry/list", payload, {
    name: "getWithdrawsList"
  })
}

export const exportWithdrawalList = async (params: Request.GetDepositAndWithdrawalList) => {
  const payload = {
    trans_code: params.withdrawalNumber,
    member_account: params.memberAccount,
    payment_type: params.paymentType,
    payment_gateway_id: params.payer,
    level_id: params.tierWhenDepositing,
    currency_id: params.currency,
    is_first: params.firstDeposit,
    status: params.saveStatus,
    failure_message: params.remark,
    operator: params.operator,
    ref_trans_code: params.ref_trans_code,
    start_date: params.start,
    end_date: params.end,
    date_type: params.dateType ? params.dateType : 1,
    offset: params.offset,
    size: params.size
  }
  if (params.firstDeposit !== undefined && params.firstDeposit !== null) {
    payload.is_first = (params.firstDeposit as any) === 1
  }

  const response = await get<any>("/withdraw_entry/list/export", payload, {
    name: "exportWithdrawalList",
    responseType: "blob"
  })
  return response
}

export const depositConfirm = (params: Request.GetDepositAndWithdrawalDetail) =>
  put<Response.GetMemberTagList>(`/deposit_entry/${params.id}/confirm`, params, {
    name: "depositConfirm"
  })
export const depositReject = (params: Request.GetDepositAndWithdrawalDetail) =>
  put<Response.GetMemberTagList>(`/deposit_entry/${params.id}/reject`, params, {
    name: "depositReject"
  })

export const withdrawConfirm = (params: Request.GetDepositAndWithdrawalDetail) =>
  put<Response.GetMemberTagList>(`/withdraw_entry/${params.id}/confirm`, params, {
    name: "withdrawConfirm"
  })
export const withdrawReject = (params: Request.GetDepositAndWithdrawalDetail) =>
  put<Response.GetMemberTagList>(`/withdraw_entry/${params.id}/reject`, params, {
    name: "withdrawReject"
  })

type Remark = { id: number; title: string; context: string }
type RemarkListResponse = { list: Remark[] }
export const getRemarkList = () => {
  return get<RemarkListResponse>(
    "/remark/list",
    {},
    {
      name: "getRemarkList"
    }
  )
}

//取得目前勾選的標籤
interface Tag {
  id: number
}
export const getCheckTag = (params: Request.GetDepositAndWithdrawalDetail) =>
  get<Response.GetMemberTagList & { labels: Tag[] }>(
    `/withdraw_entry/labels/${params.id}`,
    {},
    {
      name: "getCheckTag"
    }
  )
//更新勾選標籤
export const updateCheckTag = (params: { labels: Tag[] }) =>
  put<Response.GetMemberTagList>(`/deposit_entry/labels`, params, {
    name: "updateCheckTag"
  })

//風控鎖單
export const riskLocked = (id: number) =>
  put<Response.GetMemberTagList>(
    `/withdraw_entry/risk/${id}/seize`,
    {},
    {
      name: "riskLocked"
    }
  )

//風控通過
export const riskConfirm = (id: number) =>
  put<Response.GetMemberTagList>(
    `/withdraw_entry/risk/${id}/confirm`,
    {},
    {
      name: "riskConfirm"
    }
  )
