import type { AxiosRequestConfig } from "axios"
import { toRfc3339 } from "@/composables/useRfc3339"
import { findTimeFieldList } from "@/utils/timeFieldRules"

function applyTimeFieldConversion(target: any, fields: string[]) {
  if (!target || typeof target !== "object") return
  for (const key of fields) {
    if (!(key in target)) continue
    const converted = toRfc3339(target[key])
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
        const converted = toRfc3339(v)
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
