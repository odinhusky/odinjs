import type { HistoryTabKey } from "./useHistoryTypes"
import { HISTORY_TAB_CONFIG } from "./useHistoryTypes"

const toDateString = (input: Date) => {
  const year = input.getFullYear()
  const month = String(input.getMonth() + 1).padStart(2, "0")
  const day = String(input.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const createDefaultDateRange = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 6)
  return [toDateString(startDate), toDateString(endDate)]
}

export const resolveTabFromSearchType = (searchType: number): HistoryTabKey => {
  const found = Object.entries(HISTORY_TAB_CONFIG).find(([, value]) => value.searchType === searchType)
  return (found?.[0] as HistoryTabKey) || "deposit"
}

export const parseQueryNumber = (value: unknown): number | undefined => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const parseWalletTypesQuery = (value: unknown): number[] => {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== "string" || !raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is number => Number.isFinite(Number(item))).map((item) => Number(item))
  } catch {
    return []
  }
}
