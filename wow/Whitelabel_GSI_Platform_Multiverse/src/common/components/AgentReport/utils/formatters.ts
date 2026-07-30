import type * as Response from "src/api/response.type"
import { WALLET_TYPE } from "src/common/utils/constants"

export type AgentReportDateRange = {
  from: string
  to: string
}

export type AgentReportMetricFields = {
  bet_count?: string | number | null
  deposit?: string | number | null
  withdraw?: string | number | null
  bet_amount?: string | number | null
  valid_bet?: string | number | null
  prize?: string | number | null
  profit?: string | number | null
  ngr?: string | number | null
  rate?: string | number | null
  bonus?: string | number | null
}

export type MoneyFormatter = (value?: string | number | null) => string | number | undefined

export const AGENT_REPORT_EMPTY_VALUE = "--"

export const emptyDateRange = (): AgentReportDateRange => ({ from: "", to: "" })

export const normalizeDateRange = (
  value: string | AgentReportDateRange | null | undefined
): AgentReportDateRange => {
  if (!value) return emptyDateRange()
  if (typeof value === "string") {
    return { from: value, to: value }
  }

  return {
    from: value.from ?? "",
    to: value.to ?? ""
  }
}

export const formatAgentReportMetricCells = (
  item: AgentReportMetricFields | null | undefined,
  moneyFormat: MoneyFormatter
): string[] => {
  return [
    moneyFormat(item?.bet_count) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.deposit) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.withdraw) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.bet_amount) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.valid_bet) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.prize) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.profit) ?? AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.ngr) ?? AGENT_REPORT_EMPTY_VALUE,
    item?.rate ? `${item.rate}%` : AGENT_REPORT_EMPTY_VALUE,
    moneyFormat(item?.bonus) ?? AGENT_REPORT_EMPTY_VALUE
  ]
}

export const formatAgentReportWalletTypeLabel = (
  walletType: number,
  t: (key: string) => string,
  nowLang: string
) => {
  const walletTypeKey = WALLET_TYPE.I18nKeys[walletType as WALLET_TYPE.Enums]
  if (!walletTypeKey) return AGENT_REPORT_EMPTY_VALUE

  const separator = nowLang.startsWith("zh") ? "" : " "
  return `${t(walletTypeKey)}${separator}${t("common.btn.wallet")}`
}

export const formatAgentReportTeamRowCell = (
  row: Response.GetMemberTeamAgentReportList,
  columnName: string,
  moneyFormat: MoneyFormatter,
  currencyName: (currencyId: number) => string
) => {
  if (columnName === "currency_id") {
    return currencyName(row.currency_id)
  }

  if (columnName === "rate") {
    return row.rate ? `${row.rate}%` : AGENT_REPORT_EMPTY_VALUE
  }

  const value = row[columnName as keyof Response.GetMemberTeamAgentReportList]
  return moneyFormat(value as string | number | null | undefined) ?? AGENT_REPORT_EMPTY_VALUE
}
