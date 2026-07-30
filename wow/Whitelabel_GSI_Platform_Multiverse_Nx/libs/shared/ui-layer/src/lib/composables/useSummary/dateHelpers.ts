import { DateTime } from "luxon"
import type { DatePresetType } from "./types"

export const DATE_PRESET_MAP: Record<Exclude<DatePresetType, "custom">, number> = {
  today: 0,
  days3: 2,
  days7: 6
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const createDateRange = (subtractDays: number): [string, string] => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - subtractDays)
  return [formatDate(start), formatDate(end)]
}

export const normalizeQueryDate = (value: unknown) => {
  if (typeof value !== "string") return ""

  const trimmed = value.trim()
  if (!trimmed) return ""

  const rfcCandidate = DateTime.fromISO(trimmed, { setZone: true })
  if (rfcCandidate.isValid) return rfcCandidate.toFormat("yyyy-MM-dd")

  const sqlCandidate = DateTime.fromSQL(trimmed)
  if (sqlCandidate.isValid) return sqlCandidate.toFormat("yyyy-MM-dd")

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  return ""
}

export const resolvePresetByRange = (range: string[]) => {
  if (!Array.isArray(range) || range.length < 2) return "custom" as DatePresetType

  const [startDate, endDate] = range
  const start = DateTime.fromISO(startDate)
  const end = DateTime.fromISO(endDate)
  if (!start.isValid || !end.isValid) return "custom"

  const today = DateTime.now().startOf("day")
  const isEndToday = end.startOf("day").equals(today)
  const diffDays = end.startOf("day").diff(start.startOf("day"), "days").days

  if (isEndToday && diffDays === 0) return "today"
  if (isEndToday && diffDays === 2) return "days3"
  if (isEndToday && diffDays === 6) return "days7"

  return "custom"
}

export const buildDateListByRange = (range: [string, string]) => {
  const start = DateTime.fromISO(range[0]).startOf("day")
  const end = DateTime.fromISO(range[1]).startOf("day")

  if (!start.isValid || !end.isValid) return []

  const [from, to] = start <= end ? [start, end] : [end, start]
  const results: string[] = []

  let cursor = from
  while (cursor <= to && results.length < 370) {
    results.push(cursor.toFormat("yyyy-MM-dd"))
    cursor = cursor.plus({ days: 1 })
  }

  return results
}
