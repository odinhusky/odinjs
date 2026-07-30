import type { AxiosRequestConfig } from "axios"
import { toRfc3339 } from "./useRfc3339"
import { findTimeFieldList } from "../utils/timeFieldRules"

function normalizeDateRangeBoundaryIfNeeded(key: string, value: unknown): unknown {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  if (!trimmed) return value

  // UI 多為日期選擇器，可能是 `YYYY-MM-DD` 或 `YYYY/MM/DD`
  const dateOnly = trimmed.replace(/\//g, "-")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return value

  if (key === "start_date" || key === "start_time" || key === "str_time") return `${dateOnly} 00:00:00`
  if (key === "end_date" || key === "end_time") return `${dateOnly} 23:59:59`
  return value
}

function applyTimeFieldConversion(target: any, fields: string[]) {
  if (!target || typeof target !== "object") return
  for (const key of fields) {
    if (!(key in target)) continue
    const normalized = normalizeDateRangeBoundaryIfNeeded(key, target[key])
    const converted = toRfc3339(normalized)
    if (converted !== undefined) target[key] = converted
  }
}

export function applyAxiosTimeFieldConversion(config: AxiosRequestConfig) {
  const timeFields = findTimeFieldList(config)
  if (timeFields.length === 0) return

  const method = (config.method || "get").toLowerCase()
  if (method === "get") {
    if (config.params instanceof URLSearchParams) {
      for (const key of timeFields) {
        const v = config.params.get(key)
        if (v === null) continue
        const normalized = normalizeDateRangeBoundaryIfNeeded(key, v)
        const converted = toRfc3339(normalized)
        if (converted !== undefined) config.params.set(key, converted)
      }
      return
    }

    if (config.params && typeof config.params === "object") {
      applyTimeFieldConversion(config.params, timeFields)
    }
    return
  }

  if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
    applyTimeFieldConversion(config.data, timeFields)
  }
}
