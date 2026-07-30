import { DateTime } from "luxon"

export const HISTORY_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss"

function toNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatHistoryDateTime(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return "-"

    const iso = DateTime.fromISO(trimmed, { setZone: true })
    if (iso.isValid) return iso.toFormat(HISTORY_DATETIME_FORMAT)

    const sql = DateTime.fromSQL(trimmed)
    if (sql.isValid) return sql.toFormat(HISTORY_DATETIME_FORMAT)

    const fromJsDate = DateTime.fromJSDate(new Date(trimmed))
    if (fromJsDate.isValid) return fromJsDate.toFormat(HISTORY_DATETIME_FORMAT)

    return trimmed
  }

  if (typeof value === "number") {
    const dt = DateTime.fromMillis(value > 1e12 ? value : value * 1000)
    return dt.isValid ? dt.toFormat(HISTORY_DATETIME_FORMAT) : "-"
  }

  return "-"
}

export function formatHistoryAmount(value: unknown): string {
  const amount = toNumber(value)
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function formatHistoryCurrencyCode(currencyCode?: string): string {
  if (!currencyCode) return "-"
  return currencyCode
}