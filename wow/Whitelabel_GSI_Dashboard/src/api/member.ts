import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import type { MEMBER_COLUMN_TYPE } from "@/utils/constants"
import {
  COMMISSION_GROUP,
  CURRENCY_TYPE,
  GIFT_TYPE,
  MEMBER_LEVEL,
  MEMBER_LEVEL_MODIFY_TYPE,
  REWARD_STATUS,
  REWARD_TYPE,
  FUND_METHOD_TYPE,
  TABLE_SORT_TYPE
} from "@/utils/constants"

import * as fakeData from "@/api/fakeData/member"
import { ERROR_CODE } from "@/utils/constants"
import { get, post, put, deleteData } from "@/utils/request"
import { useCommon } from "@/hook/useCommon"

export const getMemberList = (params: Request.GetMemberList) => {
  const payload = {
    account: params.memberAccount,
    enabled: params.enable,
    block: params.frozenStatus,
    ref_account: params.recommender,
    exclude_parent_ids: params.exclude_parent_ids,
    label: params.memberTag,
    not_label: params.not_label,
    level: params.memberLevel,
    not_level: params.not_level,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size,
    self_exclusion_status: params.selfExclusionStatus,
    active_status: params.activeStatus,
    gaming_site: params.gaming_site,
    order_type: params.order_type,
    sort_type: params.sort_type ? parseInt(params.sort_type as any as string) : TABLE_SORT_TYPE.Enums.ASC,
    currency_id: params.currency_id ? parseInt(params.currency_id as any as string) : undefined,
    phone: params.phone,
    uid: params.uid,
    identity: params.identity,
    register_method: params.register_method,
    email: params.email,
    payout_identity: params.payout_identity
  }
  return get<Response.GetMemberList>("/member/list", payload, {
    name: "getMemberList",
    needToken: true
  })
}
//會員列表-啟/停用
export const updateMemberState = (params: { ids: number[]; enabled: boolean }) =>
  put<Response.GetMemberList>(`/member/enabled`, params, {
    name: "updateMemberState"
  })

//會員列表-批次啟/停用
export const batchMemberState = (params: { enabled: boolean }) =>
  put<Response.GetMemberList>(`/member/enabled/all`, params, {
    name: "batchMemberState"
  })

//會員列表匯出
export const getMemberListExport = async (params: Request.GetMemberList) => {
  const payload = {
    account: params.memberAccount,
    enabled: params.enable,
    block: params.frozenStatus,
    ref_account: params.recommender,
    exclude_parent_ids: params.exclude_parent_ids,
    label: params.memberTag,
    not_label: params.not_label,
    level: params.memberLevel,
    not_level: params.not_level,
    start_date: params.start,
    end_date: params.end,
    self_exclusion_status: params.selfExclusionStatus,
    active_status: params.activeStatus,
    gaming_site: params.gaming_site,
    order_type: params.order_type,
    sort_type: params.sort_type ? parseInt(params.sort_type as any as string) : TABLE_SORT_TYPE.Enums.ASC,
    currency_id: params.currency_id ? parseInt(params.currency_id as any as string) : undefined,
    register_method: params.register_method,
    email: params.email,
    payout_identity: params.payout_identity
  }
  return get<Response.exportItem>("/member/list/export", payload, {
    name: "getMemberListExport",
    needToken: true
  })
}

export const getMemberDetail = (params: Request.GetMemberDetail) =>
  get<
    Response.GetMemberDetail & {
      member_level: number
      fullname?: string
      country?: string
      phone?: string
      email?: string
    }
  >(
    "/member/" + params.id + "/info",
    {},
    {
      name: "getMemberDetail"
    }
  )

export const updateMemberInfo = (params: Request.GetMemberDetail) =>
  put<Response.GetMemberList>("/member", params, {
    name: "updateMemberInfo",

    needToken: true
  })

export const updateMemberBlock = (params: Request.UpdateMemberBlock) =>
  put<Response.GetMemberList>("/member/block", params, {
    name: "updateMemberBlock",
    needToken: true
  })

export const updateMemberRestWithdrawalPw = (id: number) =>
  put<Response.GetMemberList>(
    `/member/${id}/reset_withdrawal_password`,
    {},
    {
      name: "updateMemberRestWithdrawalPw",

      needToken: true
    }
  )

export const addMemberAccount = (params: Request.AddMemberAccount) => {
  return post<Response.GetMemberList>("/member", params, {
    name: "addMemberAccount"
  })
}

export const getPaymentTypeList = (params: Request.GetMemberDetail) =>
  get<Response.GetMemberList>(
    "/member/" + params.id + "/info",
    {},
    {
      name: "getPaymentTypeList"
    }
  )

export const getGatewayList = (params: Request.GetMemberDetail) =>
  get<Response.GetMemberList>(
    "/member/" + params.id + "/info",
    {},
    {
      name: "getGatewayList"
    }
  )

export const getMemberLevelSettings = async (params: Request.GetMemberLevelSettings) => {
  const { offset, size } = params

  const fakeList: Response.GetMemberLevelSetings = [
    {
      id: 1,
      type: MEMBER_LEVEL.Enums.Initial,
      level_name: "一般會員",
      validate_bet: 0,
      deposit_amount: 0,
      level_up_reward: 0,
      birthday_reward: 0,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "預設層級"
    },
    {
      id: 2,
      type: MEMBER_LEVEL.Enums.Black,
      level_name: "黑名單會員",
      validate_bet: 0,
      deposit_amount: 0,
      level_up_reward: 0,
      birthday_reward: 0,
      withdraw_limit_min: 0,
      withdraw_limit_max: 0,
      withdraw_count: 0,
      remark: "blacklist"
    },
    {
      id: 3,
      type: MEMBER_LEVEL.Enums.Normal,
      level_name: "青銅VIP",
      validate_bet: 100000,
      deposit_amount: 50000,
      level_up_reward: 100,
      birthday_reward: 100,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "vip_0"
    },
    {
      id: 4,
      type: MEMBER_LEVEL.Enums.Normal,
      level_name: "白銀VIP",
      validate_bet: 200000,
      deposit_amount: 100000,
      level_up_reward: 1000,
      birthday_reward: 100,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "vip_1"
    },
    {
      id: 5,
      type: MEMBER_LEVEL.Enums.Normal,
      level_name: "黃金VIP",
      validate_bet: 400000,
      deposit_amount: 200000,
      level_up_reward: 10000,
      birthday_reward: 100,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "vip_2"
    },
    {
      id: 6,
      type: MEMBER_LEVEL.Enums.Normal,
      level_name: "白金VIP",
      validate_bet: 800000,
      deposit_amount: 400000,
      level_up_reward: 25000,
      birthday_reward: 1000,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "vip_3"
    },
    {
      id: 7,
      type: MEMBER_LEVEL.Enums.Normal,
      level_name: "鑽石VIP",
      validate_bet: 1600000,
      deposit_amount: 800000,
      level_up_reward: 50000,
      birthday_reward: 1000,
      withdraw_limit_min: 1000,
      withdraw_limit_max: 100000,
      withdraw_count: 5,
      remark: "vip_4"
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetMemberLevelSetings> = {
    code: ERROR_CODE.Enums.SUCCESS,
    msg: "",
    data: fakeList,
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: fakeList.length
    }
  }

  return await fakeRes
}

export const getMemberLevelModify = (params: Request.GetMemberLevelModify) => {
  const payload = {
    account: params.memberAccount,
    ref_account: params.recommender,
    member_level: params.memberLevel,
    label: params.memberTag,
    enabled: params.enable,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMemberLevelModify>("/levels/member", payload, {
    name: "getMemberLevelModify"
  })
}
type updateMemberLevelModify = {
  id: number
  level_id: number
  reason?: string
}
// export const updateMemberLevelModify = (params: updateMemberLevelModify) => {
//   return put<Response.GetMemberLevelModify>(`/member/${params.id}/level`, params, {
//     name: "updateMemberLevelModify"
//   })
// }
type updateMemberLevelModifyBatch = {
  member_ids: number[]
  level_id: string | number
  reason?: string
}
export const updateMemberLevelModify = (params: updateMemberLevelModifyBatch) => {
  return put<Response.GetMemberLevelModify>(`/levels/member`, params, {
    name: "updateMemberLevelModify"
  })
}

// export const updateMemberLevelModifyBatch = (params: updateMemberLevelModifyBatch) => {
//   return put<Response.GetMemberLevelModify>("/member/levels", params, {
//     name: "updateMemberLevelModifyBatch"
//   })
// }

export const getMemberLevelHistory = async (params: Request.GetMemberLevelHistory) => {
  const payload = {
    account: params.memberAccount,
    level_id: params.memberLevel,
    start_date: params.start,
    end_date: params.end,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMemberLevelHistory>("/levels/logs", payload, {
    name: "getMemberLevelHistory"
  })
}

export const getMemberLevelHistoryDetails = async (id: number) => {
  return get<Response.GetMemberLevelHistoryDetails>(
    `/levels/logs/${id}`,
    {},
    {
      name: "getMemberLevelHistoryDetails"
    }
  )
}
// 會員層級 - 派發清單
export const getMemberLevelRewardList = async (params: Request.GetMemberLevelRewardList) => {
  const payload = {
    account: params.memberAccount,
    currency_id: params.currency,
    start_time: params.start,
    end_time: params.end,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetMemberLevelRewardList>("/levels/review", payload, {
    name: "getMemberLevelRewardList",
    needToken: true
  })
}

export const getMemberLevelRewardDetails = async (params: Request.GetMemberLevelRewardDetails) => {
  return get<Response.GetMemberLevelRewardDetails>(
    `/levels/review/${params.id}`,
    {},
    {
      name: "getMemberLevelRewardDetails",
      needToken: true
    }
  )
}
// 會員層級 - 派發清單 全部強制派發

export const updateMemberRewardListDistributionAll = (id: number) => {
  return put<Response.GetMemberQuota>(
    `/levels/review/${id}/pass`,
    {},
    {
      name: "updateMemberRewardListDistributionAll",
      needToken: true
    }
  )
}

// 會員層級 - 派發清單 強制派發

export const updateMemberRewardListDistribution = (id: number) => {
  return put<Response.GetMemberQuota>(
    `/levels/review/detail/${id}/pass`,
    {},
    {
      name: "updateMemberRewardListDistribution",
      needToken: true
    }
  )
}
//會員額度調整

export const getMemberQuotaList = (params: Request.MemberQuotaList) => {
  const payload = {
    account: params.memberAccount,
    type: params.quotaType,
    reason_id: params.quotaModifyReason,
    currency_id: params.currency,
    trans_code: params.orderNumber,
    wallet_type: params.wallet_type,
    start: params.start,
    end: params.end,
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetMemberQuota>("/member_adjustment/list", payload, {
    name: "getMemberQuotaList",
    needToken: true
  })
}

export const getQuotaExport = async (params: Request.MemberQuotaList) => {
  const payload = {
    account: params.memberAccount,
    type: params.quotaType,
    reason_id: params.quotaModifyReason,
    currency_id: params.currency,
    trans_code: params.orderNumber,
    start: params.start,
    end: params.end,
    offset: params.offset,
    size: params.size
  }
  const response = await get<any>("/member_adjustment/export", payload, {
    name: "getQuotaExport",
    responseType: "blob"
  })
  return response
}

export type GetMemberSearch = {
  account?: string
  offset: number
  size: number
}
export type MemberSearch = {
  id: number
  account: string
}
export const getMemberQuotaMemberSearch = (params: GetMemberSearch) =>
  get<Response.BaseList<MemberSearch[]>>("/member_adjustment/member/account/search", params, {
    name: "getMemberQuotaMemberSearch",
    needToken: true
  })
export type GetMemberBalance = {
  member_id?: number
  currency_id: number
}
export const getMemberQuotaBalance = (params: GetMemberBalance) =>
  get<Response.GetMemberQuota & { balance: number }>("/member_adjustment/balance", params, {
    name: "getMemberQuotaBalance",
    needToken: true
  })

export const getMemberQuotaReason = () =>
  get<Response.GetMemberQuota>(
    "/member_adjustment/reasons",
    {},
    {
      name: "getMemberQuotaReason",
      needToken: true
    }
  )
export type quotaDeposit = {
  member_id: number
  currency_id: number
  reason_id: number
  amount: number
  audit_rate: number | string
  promotion_id: number
  remark: string
  wallet_type: number
}
export const MemberQuotaDeposit = (params: quotaDeposit) =>
  post<Response.EditQuota>("/member_adjustment/deposit", params, {
    name: "memberQuotaDeposit",
    needToken: true
  })
export const MemberQuotaWithdraw = (params: quotaDeposit) =>
  post<Response.EditQuota>("/member_adjustment/withdraw", params, {
    name: "memberQuotaWithdraw",
    needToken: true
  })

export const MemberQuotaDepositBatch = (params: quotaDeposit) =>
  post<Response.EditQuota>("/member_adjustment/batch_deposit", params, {
    name: "memberQuotaBatchDeposit"
  })
export const MemberQuotaWithdrawBatch = (params: quotaDeposit) =>
  post<Response.EditQuota>("/member_adjustment/batch_withdraw", params, {
    name: "memberQuotaBatchWithdraw"
  })

export const MemberQuotaCheckAccount = (params: { member_account_list: [] }) =>
  post<Response.EditQuota>("/member_adjustment/check_member_account", params, {
    name: "memberQuotaCheckAccount"
  })

export type GetPromotionList = {
  currency: number
  enable: boolean
}

export const getPromotionList = async (params: GetPromotionList) => {
  const payload = {
    currency_id: params.currency,
    enable: params.enable,
    activity: true,
    size: 50
    /*start_date: params.start,
    end_date: params.end*/
  }
  return get<Response.BaseList<Response.GetPromotionList>>("promotions/list", payload, { name: "getPromotionList" })
}
export type GetPromotionDetail = {
  id: number
}
export const getPromotionDetail = async (params: GetPromotionDetail) => {
  return get<Response.GetPromotionList & { audit_rate: number; currency_id: number; reward: []; details: [] }>(
    `/promotions/${params.id}`,
    {},
    {
      name: "getPromotionDetail"
    }
  )
}

//會員額度調整 end

//會員標籤管理

export const getMemberTags = (params: Request.GetMemberTagList) => {
  const payload = {
    type: params.memberTagType,
    enabled: params.enable,
    title: params.name,
    offset: params.offset,
    size: params.size
  }
  return get<Response.BaseList<Response.MemberTags[]>>("/label/list", payload, {
    name: "getMemberTags"
  })
}
export const getMemberTagList = (params: Request.GetMemberTagList) => {
  console.log(params)
  const payload = {
    type: params.memberTagType,
    enabled: params.enable,
    title: params.name,
    offset: params.offset,
    size: params.size
  }
  return get<Response.MemberTagItem>("/label/list", payload, {
    name: "getAdminAccount"
  })
}
export const updateMemberTagStatue = (params: Request.GetMemberTagList) =>
  put<Response.GetMemberTagList>(`/label/${params.id}/enabled`, params, {
    name: "updateMemberTagStatue"
  })

export const deleteMemberTag = (params: Request.GetMemberTagList) =>
  deleteData<Response.GetMemberTagList>(
    `/label/${params.id}`,
    {},
    {
      name: "deleteMemberTag"
    }
  )

export const addMemberTag = (params: Request.GetMemberTagDetail) => {
  const payload = {
    type: params.memberTagType,
    enabled: params.enableStatus,
    name: params.name,
    remark: params.remark
  }
  return post<Response.GetMemberTagList>("/label", payload, {
    name: "addMemberTag"
  })
}
export const updateMemberTag = (params: Request.GetMemberTagDetail) => {
  const payload = {
    type: params.memberTagType,
    enabled: params.enableStatus,
    name: params.name,
    remark: params.remark
  }
  return put<Response.GetMemberTagList>(`/label/${params.id}`, payload, {
    name: "updateMemberTag"
  })
}
export const getMemberTagDetail = (params: Request.GetMemberTagList) => {
  return get<Response.GetMemberTagList>(
    `/label/${params.id}`,
    {},
    {
      name: "getMemberTagDetail"
    }
  )
}
//下拉用
export const getMemberTagOptionList = () => {
  return get<Response.MemberTags[]>(
    "/label/dropdown",
    {},
    {
      name: "getMemberTagOptionList"
    }
  )
}

//會員標籤 end
export const getMemberLevel = async (params: { id: number }) => {
  return await get<Response.MemberInfoLevelItem>(`/levels/${params.id}`, {
    name: "getMemberLevel"
  })
}

// 會員資訊-取款設定
export const getWithdrawSettingList = async (params: Request.GetBankSettingItem) => {
  return await get<Response.WithdrawSettingItem>(`/withdraw/member/${params.id}/bank_card`, {
    name: "getWithdrawSettingList"
  })
}

export const getWithdrawSetting = async (params: Request.GetBankSettingItem) => {
  return await get<Response.WithdrawSettingItem>(
    `/withdraw/member/${params.id}/bank_card/${params.bank_card_id}`,
    params,
    {
      name: "getWithdrawSetting"
    }
  )
}

export const updateWithdrawSetting = async (params: Request.GetBankSettingItemList) => {
  let payload = {}
  if (params.type === FUND_METHOD_TYPE.Enums.MoneyTransfer) {
    payload = {
      payment_type_id: params.type,
      name: params.bank,
      bank_name: params.branch,
      account_number: params.card_no,
      currency_id: params.currency,
      account_name: params.account_name
    }
  } else if (params.type === FUND_METHOD_TYPE.Enums.CryptoWallet) {
    payload = {
      name: params.bank,
      payment_type_id: params.type,
      wallet_address: params.wallet_address,
      currency_brand: params.currency_brand,
      chain: params.chain,
      currency_id: params.currency
    }
  } else if (params.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment) {
    payload = {
      payment_type_id: params.type,
      name: params.bank,
      currency_id: params.currency,
      payment_gateway_id: params.payment_gateway_id,
      bank_id: params.bank_id,
      account_number: params.card_no,
      account_name: params.account_name
    }
  }
  return await put<Response.WithdrawSettingItem>(
    `withdraw/member/${params.id}/bank_card/${params.bank_card_id}`,
    payload,
    {
      name: "updateWithdrawSetting"
    }
  )
}

export const addWithdrawSetting = async (params: Request.GetBankSettingItemList) => {
  let payload = {}
  if (params.type === FUND_METHOD_TYPE.Enums.MoneyTransfer) {
    payload = {
      payment_type_id: params.type,
      name: params.bank,
      bank_name: params.branch,
      account_number: params.card_no,
      currency_id: params.currency,
      account_name: params.account_name
    }
  } else if (params.type === FUND_METHOD_TYPE.Enums.CryptoWallet) {
    payload = {
      name: params.bank,
      payment_type_id: params.type,
      wallet_address: params.wallet_address,
      currency_brand: params.currency_brand,
      chain: params.chain,
      currency_id: params.currency
    }
  } else if (params.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment) {
    payload = {
      payment_type_id: params.type,
      name: params.bank,
      currency_id: params.currency,
      payment_gateway_id: params.payment_gateway_id,
      bank_id: params.bank_id,
      account_number: params.card_no,
      account_name: params.account_name
    }
  }
  return await post<Response.WithdrawSettingItem>(`withdraw/member/${params.id}/bank_card`, payload, {
    name: "addWithdrawSettingList"
  })
}

export const deleteWithdrawSetting = async (params: Request.GetBankSettingItem) => {
  return await deleteData<Response.WithdrawSettingItem>(
    `/withdraw/member/${params.id}/bank_card/${params.bank_card_id}`,
    {},
    {
      name: "deleteWithdrawSettingLis"
    }
  )
}
// 會員資訊-取款設定 end

export const getMemberTransactionReport = async (params: Request.GetMemberTransactionReport) => {
  interface TransactionPayload {
    currency_id: number
    payment_type: number
    action_type: number
    code: number
    offset: number
    size: number
    date_type: number
    wallet_type: number
    start_date?: string
    end_date?: string
  }

  const payload: TransactionPayload = {
    currency_id: params.currency,
    payment_type: params.paymentType,
    action_type: params.tradingActionType,
    code: params.transactionNumber,
    wallet_type: params.wallet_type,
    offset: params.offset,
    size: params.size,
    date_type: typeof params.dateType === "string" ? 0 : params.dateType,
    start_date: params.start,
    end_date: params.end
  }

  // if (params.dateType === 1 || params.dateType === 2) {
  //   payload.start_date = format(Number(params.start), "yyyy-MM-dd HH:mm:ss")
  //   payload.end_date = format(Number(params.end), "yyyy-MM-dd HH:mm:ss")
  // }

  return get<Response.GetMemberTransactionReport>("/member/" + params.id + "/transaction/list", payload, {
    name: "EditTransactionReport"
  })
}

export const getMemberLevelDetail = async (params: Request.GetMemberLevelDetail) => {
  const { id } = params

  const fakeRes: Response.BaseResponse<Response.GetMemberLevelDetail> = {
    code: ERROR_CODE.Enums.SUCCESS,
    msg: "",
    data: fakeData.memberLevelDetail
  }

  return await fakeRes
}

export const getMemberBettingReport = async (params: Request.GetMemberBettingReport) => {
  const { id, offset, size, total_deposit, total_withdrawal_amount, total_entry_exit } = params

  let fakeList: Response.GetMemberBettingReport = [
    {
      id: 10,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 2,
      currency: "USD",
      product: "WOW",
      game: "狂暴野牛",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0.0
    },
    {
      id: 11,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 2,
      currency: "USD",
      product: "WOW",
      game: "狂暴野牛",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0
    },
    {
      id: 12,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 2,
      currency: "USD",
      product: "WOW",
      game: "狂暴野牛",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0
    },
    {
      id: 13,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 2,
      currency: "USD",
      product: "WOW",
      game: "奧林匹斯之鍊",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0
    },
    {
      id: 12,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 1,
      currency: "USD",
      product: "WOW",
      game: "急速賽車",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0
    },
    {
      id: 13,
      bet_number: "202308125213501011",
      bet_date: 1693295184381,
      settlement_date: 1693295184381,
      status: 1,
      currency: "USD",
      product: "電子錢包",
      game: "三國志15",
      bet_amount: 27126985.64,
      validate_bet: 24774521.54,
      winlose: 2352464.1,
      winrate_count: "9.49%",
      event_amount: 0
    }
  ]

  const fakeRes: Response.BaseResponse<Response.GetMemberTransactionReport> = {
    code: 0,
    msg: "",
    data: [],
    pagination: {
      size: size,
      offset: offset === 0 ? 1 : offset,
      total: 0
    },
    total: {
      total_deposit_amount: 162761913.84,
      total_bet_amount: 162761913.84,
      total_validate_bet: 148647129.24,
      total_winlose: 14114784.6,
      total_winrate_count: 9.49,
      total_bonus: 0.0
    }
  }

  const startCount = ((fakeRes.pagination?.offset ?? 1) - 1) * size
  const endCount = (fakeRes.pagination?.offset ?? 1) * size

  if (id) {
    fakeList = fakeList.filter((item) => item.id === parseInt(id.toString()))
  }

  fakeRes.pagination!.total = fakeList.length

  fakeRes.data = fakeList.slice(startCount, endCount)
  return await fakeRes
}

export const getMemberRemarkList = async (params: Request.GetMemberRemarkList) => {
  return get<Response.GetUserActionLog>(
    `/member/${params}/remarks/list`,
    {},
    {
      name: "getMemberRemarkList"
    }
  )
}

export const addMemberRemark = async (params: Request.GetMemberRemarkList) => {
  const payload = {
    member_id: params.member_id,
    remark: params.content
  }
  return await post<Response.GetMemberRemarkList>(`/member/remarks`, payload, {
    name: "addMemberRemark"
  })
}

export const getMemberSessionLogtList = (params: Request.GetMemberOperationReportList) => {
  const payload = {
    offset: params.offset,
    size: params.size
  }

  return get<Response.GetUserActionLog>(`/member/${params.member_id}/session/list`, payload, {
    name: "getUserActionLog"
  })
}

export const getMemberCommissionReportList = async (params: Request.GetMemberCommisionReport) => {
  const payload = {
    group_name: params.commissionGroup,
    currency_id: params.currency,
    start_date: params.start,
    end_date: params.end,
    status: params.status,
    game_type: params.game_type,
    dispatch_type: params.rewardType,
    offset: params.offset,
    size: params.size,
    lang: params.lang
  }
  return await get<Response.GetCommissionDetailList>(`/member/${params.id}/rebate/list`, payload, {
    name: "getMemberCommissionReportList"
  })
}

export const getMemberCommisionReportDetail = async (params: Request.GetMemberCommisionReportDetail) => {
  return await get<Response.GetCommissionDetailList>(`/member/${params.id}/rebate/list`, payload, {
    name: "getMemberCommisionReportDetail"
  })
}

export const getCollaborationDomainList = (params: Request.GetCollaborationDomain) => {
  const payload = {
    member_id: params.member_id,
    title: params.title,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMemberList>("/collaboration/domains", payload, {
    name: "getCollaborationDomainList",
    needToken: true
  })
}
export const addCollaborationDomain = async (params: { title: string; name: string }) => {
  return await post<Response.GetMemberList>(`/collaboration/domains`, params, {
    name: "addCollaborationDomain"
  })
}

export const updateCollaborationDomain = async (params: { id: number }) => {
  return await put<Response.GetMemberList>(`/collaboration/${params.id}/domains`, params, {
    name: "updateCollaborationDomain"
  })
}

export const getMemberColumn = async (type: MEMBER_COLUMN_TYPE.Enums) => {
  return await get<Response.MemberColumnList>(
    "/member/customize_column/list",
    { type },
    {
      name: "getMemberColumn"
    }
  )
}

export const getGameSiteList = (displayAllOption = false) => {
  const payload = displayAllOption ? { displayAllOption: true } : null

  return get<Response.GetGameSiteList[]>("/member/gaming_site/dropdown", payload, {
    name: "getGameSiteList",
    needToken: true
  })
}

export const getMemberStatistics = (params: { id: number; wallet_type?: number }) => {
  return get<Response.GetMemberStatistics>(
    `/member/${params.id}/statistics`,
    {
      wallet_type: params.wallet_type
    },
    {
      name: "getMemberStatistics",
      needToken: true
    }
  )
}

// 代理額度調整

export const getMemberAgentQuotaList = (params: Request.GetMemberAgentQuotaList) => {
  const payload = {
    code: params.code,
    member_account: params.account,
    currency_id: params.currency_id,
    type: params.type,
    str_time: params.start,
    end_time: params.end,
    offset: params.offset,
    size: params.size
  }
  return get<Response.GetMemberAgentQuotaList>("/member_agent_quota/list", payload, {
    name: "getMemberAgentQuotaList",
    needToken: true
  })
}

export const getMemberAgentQuotaListExport = (params: Request.GetMemberAgentQuotaList) => {
  const payload = {
    code: params.code,
    member_account: params.account,
    currency_id: params.currency_id,
    type: params.type,
    str_time: params.start,
    end_time: params.end,
    offset: params.offset,
    size: params.size
  }
  return get("/member_agent_quota/list/export", payload, {
    name: "getMemberAgentQuotaList",
    needToken: true
  })
}

export const getMemberAgentQuota = (params: Request.GetMemberAgentQuota) => {
  const payload = {
    member_account: params.member_account,
    currency_id: params.currency_id
  }
  return get("/member_agent_quota", payload, {
    name: "getMemberAgentQuota",
    needToken: true
  })
}

export const editMemberAgentQuota = (params: Request.EditMemberAgentQuota) => {
  const payload = {
    member_account: params.member_account,
    currency_id: params.currency_id,
    type: params.type,
    amount: params.amount
  }
  return post("/member_agent_quota", payload, {
    name: "editMemberAgentQuota",
    needToken: true
  })
}

export const getMemberKycList = (params: Request.GetMemberKycList) => {
  const payload = {
    member_account: params.memberAccount,
    number: params.orderNumber,
    document_type: params.type,
    status: params.status,
    application_start_time: params.start,
    application_end_time: params.end,
    update_start_time: params.start2,
    update_end_time: params.end2,
    offset: params.offset,
    size: params.size
  } as Record<string, any>
  // 如果 params.start 是空的，移除 application_start_time 和 application_end_time
  if (!params?.start) {
    delete payload.application_start_time
    delete payload.application_end_time
  }

  // 如果 params.start2 是空的，移除 update_start_time 和 update_end_time
  if (!params?.start2) {
    delete payload.update_start_time
    delete payload.update_end_time
  }
  return get<Response.GetMemberKyc>("/auth/kyc/applications", payload, {
    usePlatform: true
  })
}

export const getMemberKycDetail = (id: string) => {
  return get<Response.GetMemberKycDetail>(
    `/auth/kyc/applications/${id}/detail`,
    {},
    {
      usePlatform: true
    }
  )
}

export const kycUnLock = (id: string) => {
  return post<Response.GetMemberKyc>(
    `/auth/kyc/applications/${id}/revoke`,
    {},
    {
      usePlatform: true
    }
  )
}

export const kycLock = (id: number) => {
  return post<Response.GetMemberKyc>(
    `/auth/kyc/applications/${id}/take`,
    {},
    {
      usePlatform: true
    }
  )
}

export const updateMemberKyc = (params: {
  internal_note: string
  reviewer_comment: string
  status: number
  id: string
  document_expiry: string
}) => {
  return put<Response.GetMemberKyc>(`/auth/kyc/applications/${params.id}/review`, params, {
    usePlatform: true
  })
}

export const getMemberKycExport = async (params: Request.GetMemberKycList) => {
  const payload = {
    member_account: params.memberAccount,
    number: params.orderNumber,
    document_type: params.type,
    status: params.status,
    application_start_time: params.start,
    application_end_time: params.end,
    update_start_time: params.start2,
    update_end_time: params.end2,
    offset: params.offset,
    size: params.size
  } as Record<string, any>
  // 如果 params.start 是空的，移除 application_start_time 和 application_end_time
  if (!params?.start) {
    delete payload.application_start_time
    delete payload.application_end_time
  }

  // 如果 params.start2 是空的，移除 update_start_time 和 update_end_time
  if (!params?.start2) {
    delete payload.update_start_time
    delete payload.update_end_time
  }
  return get<Response.GetMemberKyc>("/auth/kyc/applications/export", payload, {
    usePlatform: true
  })
}
