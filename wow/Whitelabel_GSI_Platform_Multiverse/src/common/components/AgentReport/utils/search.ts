import { emptyDateRange, normalizeDateRange, type AgentReportDateRange } from "./formatters"

export type AgentReportAppliedSearch = {
  dateRange: AgentReportDateRange
  currencyId: number
  memberId: number
}

export type AgentReportSearchTimeRange = {
  status: boolean
  startDate: string
  endDate: string
  rangeDays: number
}

type PreciseDivide = (value: number, divisor: number) => number

export const getAgentReportRangeDays = (range: AgentReportDateRange, preciseDivide: PreciseDivide) => {
  if (!range.from || !range.to) return 0

  const startTime = preciseDivide(new Date(range.from + "T00:00:00").getTime(), 1000)
  const endTime = preciseDivide(new Date(range.to + "T23:59:59").getTime(), 1000)

  return Math.ceil((endTime - startTime) / (60 * 60 * 24))
}

export const buildAgentReportSearchTimeRange = (
  appliedDateRange: AgentReportDateRange | undefined,
  preciseDivide: PreciseDivide
): AgentReportSearchTimeRange => {
  const { from: startDate, to: endDate } = appliedDateRange ?? emptyDateRange()

  if (!startDate || !endDate) {
    return {
      status: false,
      startDate,
      endDate,
      rangeDays: 0
    }
  }

  const startTime = preciseDivide(new Date(startDate + "T00:00:00").getTime(), 1000)
  const endTime = preciseDivide(new Date(endDate + "T23:59:59").getTime(), 1000)
  const rangeDays = Math.ceil((endTime - startTime) / (60 * 60 * 24))

  return {
    status: startTime <= endTime,
    startDate,
    endDate,
    rangeDays
  }
}

export const isAgentReportDraftSynced = (
  appliedSearch: AgentReportAppliedSearch | null,
  draftDateRange: AgentReportDateRange,
  draftCurrencyId: number
) => {
  if (!appliedSearch) return false

  const draft = normalizeDateRange(draftDateRange)

  return (
    draft.from === appliedSearch.dateRange.from &&
    draft.to === appliedSearch.dateRange.to &&
    draftCurrencyId === appliedSearch.currencyId
  )
}
