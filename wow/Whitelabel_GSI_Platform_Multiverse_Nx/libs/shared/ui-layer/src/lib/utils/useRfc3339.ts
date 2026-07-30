import { DateTime, FixedOffsetZone } from "luxon"

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete"

export const FIELDS_DATE_RANGE = ["start_date", "end_date"] as const
export const FIELDS_TIME_RANGE = ["start_time", "end_time"] as const
export const FIELDS_STR_TIME_RANGE = ["str_time", "end_time"] as const
export const FIELDS_KYC_RANGE = [
  "application_start_time",
  "application_end_time",
  "update_start_time",
  "update_end_time"
] as const

const FORMAT_DATE = "yyyy-MM-dd"
const FORMAT_TIME = "HH:mm:ss"
const FORMAT_DATETIME = `${FORMAT_DATE} ${FORMAT_TIME}`

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATETIME_WITH_SPACE_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

const RANGE_START_FIELDS = new Set([
  "start_date",
  "start_time",
  "str_time",
  "application_start_time",
  "update_start_time"
])

const RANGE_END_FIELDS = new Set(["end_date", "end_time", "application_end_time", "update_end_time"])

const ALL_TIME_FIELDS = new Set<string>([
  ...FIELDS_DATE_RANGE,
  ...FIELDS_TIME_RANGE,
  ...FIELDS_STR_TIME_RANGE,
  ...FIELDS_KYC_RANGE
])

function millisFromTimestampValue(n: number): number | undefined {
  if (!Number.isFinite(n) || n <= 0) return undefined
  return n > 1e12 ? n : n * 1000
}

function parseUnknownToDateTime(source: unknown, utcOffsetMinutes: number) {
  if (source === null || source === undefined) return null

  const targetZone = FixedOffsetZone.instance(utcOffsetMinutes)

  if (typeof source === "number") {
    const ms = millisFromTimestampValue(source)
    if (ms === undefined) return null
    const dt = DateTime.fromMillis(ms)
    return dt.isValid ? dt : null
  }

  if (typeof source !== "string") return null

  const trimmed = source.trim()
  if (!trimmed) return null

  if (DATETIME_WITH_SPACE_PATTERN.test(trimmed)) {
    const dt = DateTime.fromFormat(trimmed, FORMAT_DATETIME, { zone: targetZone })
    return dt.isValid ? dt : null
  }

  const iso = DateTime.fromISO(trimmed, { setZone: true })
  return iso.isValid ? iso : null
}

export function normalizeDateRangeBoundaryIfNeeded(key: string, value: unknown): unknown {
  if (typeof value !== "string") return value

  const trimmed = value.trim()
  if (!trimmed) return value

  const dateOnly = trimmed.replace(/\//g, "-")
  if (!DATE_ONLY_PATTERN.test(dateOnly)) return value

  if (RANGE_START_FIELDS.has(key)) return `${dateOnly} 00:00:00`
  if (RANGE_END_FIELDS.has(key)) return `${dateOnly} 23:59:59`
  return value
}

export function toRfc3339(value: unknown, utcOffsetMinutes = 0): string | undefined {
  if (value === undefined || value === null || value === "") return undefined

  const targetZone = FixedOffsetZone.instance(utcOffsetMinutes)
  let normalized

  if (typeof value === "string") {
    const trimmed = value.trim()

    if (DATE_ONLY_PATTERN.test(trimmed)) {
      const dateOnly = DateTime.fromISO(trimmed, { zone: targetZone })
      if (dateOnly.isValid) {
        normalized = dateOnly.startOf("day").set({ millisecond: 0 })
      }
    } else if (DATETIME_WITH_SPACE_PATTERN.test(trimmed)) {
      const isoLike = trimmed.replace(" ", "T")
      const dateTime = DateTime.fromISO(isoLike, { zone: targetZone })
      if (dateTime.isValid) {
        normalized = dateTime.set({ millisecond: 0 })
      }
    } else if (/[TzZ+-]/.test(trimmed)) {
      const isoDateTime = DateTime.fromISO(trimmed, { zone: targetZone })
      if (isoDateTime.isValid) {
        normalized = isoDateTime.set({ millisecond: 0 })
      }
    }
  }

  if (!normalized) {
    const millis = typeof value === "number" ? value : Number(value)
    const localDt = DateTime.fromMillis(millis)
    if (!localDt.isValid) return undefined
    normalized = localDt.setZone(targetZone, { keepLocalTime: true }).set({ millisecond: 0 })
  }

  if (utcOffsetMinutes === 0) {
    return normalized.toUTC().toISO({ suppressMilliseconds: true }) ?? undefined
  }

  return normalized.toISO({ suppressMilliseconds: true, includeOffset: true }) ?? undefined
}

export function convertRequestTimeFields(
  payload: Record<string, unknown>,
  utcOffsetMinutes: number,
  fields?: readonly string[]
) {
  if (!payload || typeof payload !== "object") return payload

  const targetFields = fields && fields.length > 0 ? fields : Array.from(ALL_TIME_FIELDS)
  const sourcePayload = payload as Record<string, unknown>
  const updates: Record<string, string> = {}

  for (const key of targetFields) {
    if (!(key in sourcePayload)) continue

    const normalized = normalizeDateRangeBoundaryIfNeeded(key, sourcePayload[key])
    const converted = toRfc3339(normalized, utcOffsetMinutes)
    if (converted !== undefined) {
      updates[key] = converted
    }
  }

  return { ...sourcePayload, ...updates }
}

export function format(input: unknown, formatStr = FORMAT_DATETIME, utcOffsetMinutes = 0): string {
  const targetZone = FixedOffsetZone.instance(utcOffsetMinutes)
  const dt = parseUnknownToDateTime(input, utcOffsetMinutes)
  if (!dt || !dt.isValid) return ""

  return dt.setZone(targetZone).toFormat(formatStr)
}

function formatDate(input: unknown, utcOffsetMinutes = 0): string {
  return format(input, FORMAT_DATE, utcOffsetMinutes)
}

function formatDateTime(input: unknown, utcOffsetMinutes = 0): string {
  return format(input, FORMAT_DATETIME, utcOffsetMinutes)
}

function formatTime(input: unknown, utcOffsetMinutes = 0): string {
  return format(input, FORMAT_TIME, utcOffsetMinutes)
}

export function useRfc3339() {
  return {
    format,
    formatDate,
    formatDateTime,
    formatTime,
    toRfc3339,
    convertRequestTimeFields
  }
}
