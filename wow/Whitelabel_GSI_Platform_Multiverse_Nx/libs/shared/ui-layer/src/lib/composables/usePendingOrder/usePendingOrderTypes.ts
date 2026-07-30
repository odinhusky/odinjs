import { FUND_METHOD_TYPE_ENUMS, FUND_METHOD_TYPE_I18N_KEYS } from "@shared-lib/constants/enums/fundMethodType"
import { PENDING_SEARCH_TYPE_ENUMS } from "@shared-lib/constants/enums/pendingSearchType"
import { PENDING_STATUS_ENUMS, PENDING_STATUS_I18N_KEYS } from "@shared-lib/constants/enums/pendingStatus"

export type PendingTabKey = "deposit" | "withdraw"

export const PENDING_TAB_CONFIG: Record<PendingTabKey, { label: string; searchType: PENDING_SEARCH_TYPE_ENUMS }> = {
  deposit: { label: "存款", searchType: PENDING_SEARCH_TYPE_ENUMS.DEPOSIT },
  withdraw: { label: "出金", searchType: PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL }
}

export const PENDING_STATUS_ALL = -1

export const PENDING_STATUS_OPTIONS = [
  { label: "全部", value: PENDING_STATUS_ALL },
  { label: "成功", value: PENDING_STATUS_ENUMS.CONFIRMED },
  { label: "失敗", value: PENDING_STATUS_ENUMS.REJECTED },
  { label: "處理中", value: PENDING_STATUS_ENUMS.PENDING },
  { label: "已取消", value: PENDING_STATUS_ENUMS.CANCEL }
] as const

export const PENDING_STATUS_THEME_MAP: Record<PENDING_STATUS_ENUMS, "fail" | "success" | "warning" | "info"> = {
  [PENDING_STATUS_ENUMS.PENDING]: "warning",
  [PENDING_STATUS_ENUMS.CONFIRMED]: "success",
  [PENDING_STATUS_ENUMS.REJECTED]: "fail",
  [PENDING_STATUS_ENUMS.CANCEL]: "info"
}

export const PENDING_STATUS_LABEL_MAP: Record<PENDING_STATUS_ENUMS, string> = {
  [PENDING_STATUS_ENUMS.PENDING]: "處理中",
  [PENDING_STATUS_ENUMS.CONFIRMED]: "成功",
  [PENDING_STATUS_ENUMS.REJECTED]: "失敗",
  [PENDING_STATUS_ENUMS.CANCEL]: "已取消"
}

export const IGNORE_UPLOAD_DETAIL_FUND_TYPES = [FUND_METHOD_TYPE_ENUMS.E_WALLET, FUND_METHOD_TYPE_ENUMS.CRYPTO_PAYMENT]

export const getPendingStatusLabel = (status?: number) => {
  if (!status) return "-"
  return PENDING_STATUS_LABEL_MAP[status as PENDING_STATUS_ENUMS] || "-"
}

export const getPendingStatusTheme = (status?: number): "base" | "fail" | "success" | "warning" | "info" => {
  if (!status) return "base"
  return PENDING_STATUS_THEME_MAP[status as PENDING_STATUS_ENUMS] || "base"
}

export const getPendingPaymentMethodKey = (paymentType?: number) => {
  if (!paymentType) return "fund_method_type.other_pay_methods"
  return FUND_METHOD_TYPE_I18N_KEYS[paymentType as FUND_METHOD_TYPE_ENUMS] || "fund_method_type.other_pay_methods"
}

export const isPendingStatusValue = (value: number) => {
  return value === PENDING_STATUS_ALL || Object.values(PENDING_STATUS_ENUMS).includes(value as PENDING_STATUS_ENUMS)
}

export const isPendingSearchTypeValue = (value: number) => {
  return value === PENDING_SEARCH_TYPE_ENUMS.DEPOSIT || value === PENDING_SEARCH_TYPE_ENUMS.WITHDRAWAL
}

export const resolvePendingTabFromSearchType = (searchType: number): PendingTabKey => {
  const found = Object.entries(PENDING_TAB_CONFIG).find(([, item]) => item.searchType === searchType)
  return (found?.[0] as PendingTabKey) || "deposit"
}

export const resolveSearchTypeFromTab = (tab: PendingTabKey) => {
  return PENDING_TAB_CONFIG[tab].searchType
}

export const PENDING_STATUS_I18N_KEY_MAP = PENDING_STATUS_I18N_KEYS
