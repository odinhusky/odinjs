import {
  AGENT_REPORT_EMPTY_VALUE,
  type AgentReportMetricFields
} from "src/common/components/AgentReport/utils/formatters"

export type AgentReportMobileMatrixRow = {
  label: string
  basic: string | number
  wallets: (string | number)[] | null
}

type AgentReportMobileMatrixDetailItem = AgentReportMetricFields & {
  wallet_type: number
}

type BuildAgentReportMobileMatrixOptions = {
  prefixRows: Array<{ label: string; basic: string | number }>
  metricLabels: string[]
  metricValues: string[]
  suffixRows: Array<{ label: string; basic: string | number }>
  detailItems: AgentReportMobileMatrixDetailItem[]
  expanded: boolean
  formatMetricCells: (item: AgentReportMetricFields) => string[]
  formatWalletTypeLabel: (walletType: number) => string
}

export const buildAgentReportMobileMatrixWalletHeaders = ({
  detailItems,
  expanded,
  formatWalletTypeLabel
}: Pick<BuildAgentReportMobileMatrixOptions, "detailItems" | "expanded" | "formatWalletTypeLabel">) => {
  if (!expanded) return []

  return detailItems.map((item) => formatWalletTypeLabel(item.wallet_type))
}

export const buildAgentReportMobileMatrixRows = ({
  prefixRows,
  metricLabels,
  metricValues,
  suffixRows,
  detailItems,
  expanded,
  formatMetricCells
}: Omit<BuildAgentReportMobileMatrixOptions, "formatWalletTypeLabel">): AgentReportMobileMatrixRow[] => {
  const activeDetails = expanded ? detailItems : []
  const walletValueRows = activeDetails.map((detail) => formatMetricCells(detail))

  return [
    ...prefixRows.map((row) => ({
      label: row.label,
      basic: row.basic,
      wallets: null
    })),
    ...metricLabels.map((label, index) => ({
      label,
      basic: metricValues[index] ?? AGENT_REPORT_EMPTY_VALUE,
      wallets: walletValueRows.map((values) => values[index] ?? AGENT_REPORT_EMPTY_VALUE)
    })),
    ...suffixRows.map((row) => ({
      label: row.label,
      basic: row.basic,
      wallets: null
    }))
  ]
}

export const getAgentReportTeamRowDetailColspans = (columnNames: string[]) => {
  const metricStartIndex = columnNames.findIndex((name) => name === "bet_count")
  const metricEndIndex = columnNames.findIndex((name) => name === "bonus")

  return {
    leadingColspan: metricStartIndex > -1 ? metricStartIndex : 1,
    trailingColspan: metricEndIndex > -1 ? columnNames.length - metricEndIndex - 1 : 0
  }
}
