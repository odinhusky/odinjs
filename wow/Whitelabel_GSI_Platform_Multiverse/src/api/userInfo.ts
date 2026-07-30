import type * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import { requestApi, requestApiFullResponse } from "src/common/utils/request"

export const getMemberSummary = (params: Request.GetMemberSummary) => {
  return requestApi<Request.GetMemberSummary, Response.GetMemberSummary>("/platform/v1/player/member/summary", params, {
    name: "getMemberSummary",
    method: "get" })
}

export const getUserInfo = () => {
  return requestApi<null, Response.BasicInfoResponse>("/v1/player/center/basic/info", null, {
    name: "getUserInfo",
    method: "get" })
}

export const setUserInfo = (data: Request.UserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  if (formData.img === "") { delete formData.img }

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setUserInfo",
    method: "put" })
}

export const setUserInfo2 = (data: Request.SetUserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setUserInfo2",
    method: "put" })
}

export const setAccountInfo = (data: Request.AccountInfoForm) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setAccountInfo",
    method: "put" })
}

export const setSingleUserInfo2 = (data: Request.SetSingleUserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setSingleUserInfo2",
    method: "put" })
}

export const setSingleAccountInfo = (data: Request.SetSingleAccountInfoForm) => {
  const formData = JSON.parse(JSON.stringify(data))

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setSingleAccountInfo",
    method: "put" })
}

export const setUserAvatar = (data: Request.UserAvatar) => {
  return requestApi<Request.UserAvatar, null>("/v1/player/center/upload/head_shot", data, {
    name: "setUserAvatar",
    method: "post" })
}

export const setUserPassword = (data: Request.Password) => {
  return requestApi<Request.Password, null>("/v1/player/center/password", data, {
    name: "setUserPassword",
    method: "put" })
}

export const getUserBetHistoryTotal = () => {
  return requestApi<null, Response.GetUserBetHistoryTotal>("/v1/player/center/bet/history/total", null, {
    name: "getUserBetHistoryTotal",
    method: "get" })
}

export const setUserWithdrawalPassword = (data: Request.Password) => {
  return requestApi<Request.Password, null>("/v1/player/center/withdrawal_password", data, {
    name: "setUserWithdrawalPassword",
    method: "put" })
}

export const getUserWalletList = () => {
  return requestApi<null, Response.UserWalletList>("/v1/player/center/wallets", null, {
    name: "getUserWalletList",
    method: "get" })
}

export const setUserActiveWallet = (data: Request.SetUserActiveWallet) => {
  return requestApi<Request.SetUserActiveWallet, null>("/v1/player/center/wallets/use", data, {
    name: "setUserActiveWallet",
    method: "put" })
}

export const getBonusTransferStatus = (params: Request.GetBonusTransferStatus) => {
  return requestApi<Request.GetBonusTransferStatus, Response.BonusTransferStatus>("/platform/v1/player/wallet/bonus-transfer/status", params, {
    name: "getBonusTransferStatus",
    method: "get" })
}

export const postBonusTransfer = (params: Request.PostBonusTransfer) => {
  return requestApi<Request.PostBonusTransfer, null>("/platform/v1/player/wallet/bonus-transfer", params, {
    name: "postBonusTransfer",
    method: "post" })
}

export const postBonusTransferFullResponse = (params: Request.PostBonusTransfer): Promise<ApiResponse<null>> => {
  return requestApiFullResponse<Request.PostBonusTransfer, null>("/platform/v1/player/wallet/bonus-transfer", params, {
    name: "postBonusTransferFullResponse",
    method: "post" })
}

export const getLevelsInfo = () => {
  return requestApi<null, Response.UserLevelsInfo>("/v1/player/levels/list", null, {
    name: "getLevelsInfo",
    method: "get" })
}

export const getUserRemark = () => {
  return requestApi<null, Response.UserRemark>("/v1/player/center/remark", null, {
    name: "getUserRemark",
    method: "get" })
}

export const setUserKyc = (data: Request.KycData) => {
  return requestApi<Request.KycData, null>("/v1/player/center/kyc/upload", data, {
    name: "setUserKyc",
    method: "post" })
}

// 會員中心KYC (新版KYC)
export const setMemberCenterKyc = (data: Request.UserKycInfoForm) => {
  return requestApi<Request.UserKycInfoForm, null>("/platform/v1/player/auth/kyc/submit", data, {
    name: "setMemberCenterKyc",
    method: "post" })
}

export const getMemberColumn = () => {
  return requestApi<{ type: string }, Response.MemberColumnList>(
    "/v1/player/user/customize_column/list",
    { type: "center" },
    {
      name: "getMemberColumn",
      method: "get" }
  )
}

//#region kyc

export const userKycRecord = () => {
  return requestApi<null, Response.KycRecordList>("/platform/v1/player/auth/kyc/history", null, {
    name: "userKycRecord",
    method: "get" })
}

export const setUserKycV2 = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/center/kyc", data, {
    name: "setUserKycV2",
    method: "post" })
}
export const setUserKycV2Onboarding = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/auth/onboarding/kyc", data, {
    name: "setUserKycV2Onboarding",
    method: "post" })
}

export const updateUserKycV2 = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/center/kyc", data, {
    name: "updateUserKycV2",
    method: "put" })
}
export const updateUserKycV2Onboarding = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/auth/onboarding/kyc", data, {
    name: "updateUserKycV2Onboarding",
    method: "put" })
}

export const getUserKycV2 = () => {
  return requestApi<null, Response.UserKycList>("/v1/player/center/kyc", null, {
    name: "getUserKycV2",
    method: "get" })
}

export const getUserKycV2Onboarding = () => {
  return requestApi<null, Response.UserKycList>("/v1/player/auth/onboarding/kyc", null, {
    name: "getUserKycV2Onboarding",
    method: "get" })
}

export const getKycStatus = () => {
  return requestApi<null, Response.GetKYCStatus>("/platform/v1/player/auth/kyc/status", null, {
    name: "getKycStatus",
    method: "get" })
}

export const getKycStatusOnboarding = () => {
  return requestApi<null, Response.GetKYCStatus>("/platform/v1/player/auth/onboarding/kyc/status", null, {
    name: "getKycStatusOnboarding",
    method: "get" })
}

//#endregion

// 取得下級會員列表
export const getMemberAgentQuotaList = (data: Request.GetMemberAgentQuotaList) => {
  return requestApi<Request.GetMemberAgentQuotaList, Response.GetMemberAgentQuotaListData>(
    "/v1/player/center/credit_member_agent/quota/list",
    data,
    {
      name: "getMemberAgentQuotaList",
      method: "get" }
  )
}

// 查看下級會員的 下級會員列表
export const getLowerLevelMemberAgentQuotaList = (data: Request.GetLowerLevelMemberAgentQuotaList) => {
  const params = {
    currency_id: data.currency_id,
    downline_member_account: data.downline_member_account }
  return requestApi<Request.GetLowerLevelMemberAgentQuotaList, Response.GetLowerLevelMemberAgentQuotaListData>(
    `/v1/player/center/credit_member_agent/quota/${ data.account }`,
    params,
    {
      name: "getLowerLevelMemberAgentQuotaList",
      method: "get" }
  )
}

// 取得會員額度
export const getMemberAgentQuotaAmount = (data: Request.GetMemberAgentQuotaAmount) => {
  return requestApi<Request.GetMemberAgentQuotaAmount, Response.GetMemberAgentQuotaAmount>(
    "/v1/player/center/credit_member_agent/quota",
    data,
    {
      name: "getMemberAgentQuotaAmount",
      method: "get" }
  )
}

// 更新下級會員額度
export const updateMemberAgentQuotaBalance = (data: Request.UpdateMemberAgentQuotaBalance) => {
  return requestApi<Request.UpdateMemberAgentQuotaBalance, null>("/v1/player/center/credit_member_agent/quota", data, {
    name: "updateMemberAgentQuotaBalance",
    method: "post" })
}

// 取得後台會員資料自訂欄位
export const getMemberAgentCustomizeColumn = (type: Request.GetMemberAgentCustomizeColumn) => {
  return requestApi<Request.GetMemberAgentCustomizeColumn, Response.MemberCustomizeColumnListData[]>(
    "/v1/player/center/credit_member_agent/customize_column/list",
    type,
    {
      name: "getMemberAgentCustomizeColumn",
      method: "get" }
  )
}

// 取得推薦人列表
export const getMemberAgentReferralList = () => {
  return requestApi<null, Response.MemberAgentReferralListData[]>(
    "/v1/player/center/credit_member_agent/dropdown/recommender",
    null,
    {
      name: "getMemberAgentReferralList",
      method: "get" }
  )
}

// 取得標籤列表
export const getMemberAgentTagList = () => {
  return requestApi<null, Response.MemberAgentTagListData[]>(
    "/v1/player/center/credit_member_agent/dropdown/label",
    null,
    {
      name: "getMemberAgentTagList",
      method: "get" }
  )
}

// 取得下級會員資料
export const getMemberAgentInfo = (memberId: number) => {
  return requestApi<null, Response.MemberAgentInfo>(`/v1/player/center/credit_member_agent/member/${ memberId }`, null, {
    name: "getMemberAgentInfo",
    method: "get" })
}

// 建立下級會員
export const createMemberAgent = (data: Request.CreateMemberAgent) => {
  return requestApi<Request.CreateMemberAgent, null>("/v1/player/center/credit_member_agent/member", data, {
    name: "createMemberAgent",
    method: "post" })
}

// 編輯下級會員
export const updateMemberAgent = (data: Request.CreateMemberAgent) => {
  return requestApi<Request.CreateMemberAgent, null>("/v1/player/center/credit_member_agent/member", data, {
    name: "updateMemberAgent",
    method: "put" })
}

// 取得下級會員帳變明細列表
export const getMemberAgentQuotaMoneyHistory = (data: Request.GetMemberAgentQuotaMoneyHistory) => {
  return requestApi<Request.GetMemberAgentQuotaMoneyHistory, Response.GetMemberAgentQuotaMoneyHistoryList>(
    "/v1/player/center/credit_member_agent/report/money_history",
    data,
    {
      name: "getMemberAgentQuotaMoneyHistory",
      method: "get" }
  )
}

// 取得額度帳變明細列表
export const getCreditQuotaHistory = (data: Request.GetCreditQuotaHistory) => {
  return requestApi<Request.GetCreditQuotaHistory, Response.GetCreditQuotaHistoryList>(
    "/platform/v1/player/member/credit-quota-history",
    data,
    {
      name: "getCreditQuotaHistory",
      method: "get" }
  )
}

// 取得投注報表紀錄
export const getMemberAgentBetReport = (data: Request.GetMemberAgentBetReport) => {
  return requestApi<Request.GetMemberAgentBetReport, Response.GetMemberAgentBetReportList>(
    "/v1/player/center/credit_member_agent/report/member_bet_report",
    data,
    {
      name: "getMemberAgentBetReport",
      method: "get" }
  )
}

// 取得投注紀錄查詢
export const getMemberAgentWagerList = (data: Request.GetMemberAgentWagerList) => {
  return requestApi<Request.GetMemberAgentWagerList, Response.GetMemberAgentWagerList>(
    "/v1/player/center/credit_member_agent/report/member_wager_list",
    data,
    {
      name: "getMemberAgentWagerList",
      method: "get" }
  )
}

// 取得派彩詳細頁面（第三方頁面）
export const getMemberAgentWagerDetail = (data: Request.GetMemberAgentWagerDetail) => {
  return requestApi<Request.GetMemberAgentWagerDetail, Response.GetMemberAgentWagerDetail>(
    "/v1/player/center/credit_member_agent/report/member_wager_history",
    data,
    {
      name: "getMemberAgentWagerDetail",
      method: "get" }
  )
}

// 取得代理報表
export const getMemberAgentReport = (data: Request.GetMemberAgentReport) => {
  return requestApi<Request.GetMemberAgentReport, Response.GetMemberAgentReport>(
    "/platform/v1/player/member/overview",
    data,
    {
      name: "getMemberAgentReport",
      method: "get" }
  )
}

// 取得團隊代理報表
export const getMemberTeamAgentReport = (data: Request.GetMemberTeamAgentReport) => {
  return requestApi<Request.GetMemberTeamAgentReport, Response.GetMemberTeamAgentReport>(
    "/platform/v1/player/member/overview/list",
    data,
    {
      name: "getMemberTeamAgentReport",
      method: "get" }
  )
}

// 取得代理報表自身數據細項
export const getMemberAgentReportDetail = (data: Request.GetMemberAgentReportDetail) => {
  return requestApi<Request.GetMemberAgentReportDetail, Response.GetMemberAgentReportDetail>(
    "/platform/v1/player/member/overview/detail",
    data,
    {
      name: "getMemberAgentReportDetail",
      method: "get" }
  )
}

// 取得團隊代理報表下級會員細項
export const getMemberAgentTeamDetail = (data: Request.GetMemberAgentTeamDetail) => {
  return requestApi<Request.GetMemberAgentTeamDetail, Response.GetMemberAgentTeamDetail>(
    "/platform/v1/player/member/overview/team/detail",
    data,
    {
      name: "getMemberAgentTeamDetail",
      method: "get" }
  )
}

// 紀錄推薦連結分享點擊
export const postMemberReferralClick = (params: Request.PostMemberReferralClick) => {
  return requestApi<Request.PostMemberReferralClick, null>("/platform/v1/player/member/referral/click", params, {
    name: "postMemberReferralClick",
    method: "post",
  })
}

export const postTransferBonusWallet = (params: Request.PostTransferBonusWallet) => {
  return requestApi<Request.PostTransferBonusWallet, null>("/v1/player/wallet/transfer/bonus", params, {
    name: "postTransferBonusWallet",
    method: "post" })
}
