/**
 * API 交換時間時的 **RFC3339** 與 **顯示格式** 集中處理。
 *
 * ## 與 `envStore` 的關係
 * 所有轉換都讀取 `useEnvInfoStore().envInfo.utc_offset`（**分鐘偏移**）：
 * - 值由後端 `/v1/player/settings` 回傳（`utc_offset`），前端寫入 `envStore`。
 * - `0` 代表 UTC。
 *
 * ## 兩個方向
 * 1. **`toRfc3339`**：表單／DatePicker 的 **牆上時間**（以本地日曆顯示的時分秒）對應的 **毫秒 timestamp**
 *    或 `yyyy-MM-dd` 純日期字串 →
 *    帶上「報表目標 offset」的 RFC3339 字串（**不含毫秒**），給 query／body 使用。
 * 2. **`format` / `formatDate` / `formatDateTime` / `formatTime`**：將各種 **時間來源**（RFC3339／ISO、`yyyy-MM-dd HH:mm:ss`、Unix 秒或毫秒等）→
 *    在同一個 `targetOffsetMinutes` 下 **`toFormat`** 成顯示字串；解析邏輯集中在 {@link format}，輸出規則不變。
 *
 * ## 與 axios 的銜接
 * 多數情境可由 `timeFieldRules` 列出欄位名，再經 `useAxiosTimeField` 在送出前自動呼叫 `toRfc3339`；
 * 少數手動組 payload 時可直接 `import { toRfc3339 }`。
 *
 * 實作使用 **Luxon**（`FixedOffsetZone` + `keepLocalTime` / `fromISO`），與 IANA 時區名無關，只認固定 offset。
 */
import { DateTime, FixedOffsetZone } from "luxon"
import { useEnvInfoStore } from "../../stores/envStore"

/**
 * 僅日期時的 Luxon `DateTime#toFormat` 樣式（`formatDate` 使用）。
 * 符號表見：https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 */
const FORMAT_DATE = "yyyy-MM-dd"
/**
 * 僅時間時的 Luxon `toFormat` 樣式（`formatTime` 使用）。
 */
const FORMAT_TIME = "HH:mm:ss"
/**
 * 日期＋時間：由 {@link FORMAT_DATE} 與 {@link FORMAT_TIME} 組成（`formatDateTime` 與 `format` 預設值）。
 */
const FORMAT_DATETIME = `${FORMAT_DATE} ${FORMAT_TIME}`
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATETIME_WITH_SPACE_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

/**
 * 將 **牆上時間** 對應的輸入轉成 API 用的 RFC3339 字串。
 *
 * **輸入語意**：
 * - `number` / 可轉數字字串：視為 DatePicker／`new Date(...).getTime()` 這類 **毫秒 timestamp**
 * - `yyyy-MM-dd`：直接用 `fromISO` 解析
 * - `yyyy-MM-dd HH:mm:ss`：先補成 ISO 的 `T` 再解析
 *
 * timestamp 會以 `setZone(FixedOffsetZone.instance(targetOffsetMinutes), { keepLocalTime: true })`
 * **保留同一組牆上數字**，但把「這組數字所屬的 offset」改成報表 store 設定的 offset，再輸出 RFC3339。
 *
 * **輸出**：不含毫秒；offset 為 0 時改走 `toUTC()` 再 `toISO`，其餘則 `includeOffset: true`。
 *
 * @param value - `number`、可轉數字字串、`yyyy-MM-dd`、或 `yyyy-MM-dd HH:mm:ss`；`undefined`／`null`／`""` 會回傳 `undefined`。
 * @returns 合法時回傳 RFC3339；無效數字或無法解析的時間回傳 `undefined`。
 */
export function toRfc3339(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined

  const envStore = useEnvInfoStore()
  const offsetMinutes = envStore.envInfo.utc_offset ?? 0
  const targetZone = FixedOffsetZone.instance(offsetMinutes)
  let normalized: DateTime | undefined

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
    } else if (/[TzZ+\-]/.test(trimmed)) {
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

  if (offsetMinutes === 0) {
    return normalized.toUTC().toISO({ suppressMilliseconds: true }) ?? undefined
  }
  return normalized.toISO({ suppressMilliseconds: true, includeOffset: true }) ?? undefined
}

function millisFromTimestampValue(n: number): number | undefined {
  if (!Number.isFinite(n) || n <= 0) return undefined
  return n > 1e12 ? n : n * 1000
}

/**
 * 將各種時間來源解析成 {@link DateTime}（語意正確的瞬間或牆上時間），供 {@link format} 只做 `setZone` + `toFormat`。
 *
 * - **`DateTime.fromMillis`**：僅當 `source` 為 **`number`**（Unix 秒若 `≤ 1e12` 則 `× 1000` 轉毫秒）
 * - **`DateTime.fromFormat`**：`yyyy-MM-dd HH:mm:ss`（{@link DATETIME_WITH_SPACE_PATTERN}，於 `utc_offset` 時區）
 * - **`DateTime.fromISO`**：其餘字串（`setZone: true`）
 */
function parseUnknownToDateTime(source: unknown): DateTime | null {
  if (source === null || source === undefined) return null

  const envStore = useEnvInfoStore()
  const offsetMinutes = envStore.envInfo.utc_offset ?? 0
  const targetZone = FixedOffsetZone.instance(offsetMinutes)

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

/**
 * 將時間來源於 **報表 target offset** 下格式化成顯示字串（核心為 `setZone` → `toFormat`）。
 *
 * @param input - RFC3339／ISO 字串、`yyyy-MM-dd HH:mm:ss`、或 Unix 秒／毫秒（**僅** `number` 型別）等
 * @param formatStr - Luxon 格式字串；預設為 {@link FORMAT_DATETIME}
 * @returns 解析失敗或 `null`／`undefined` 回傳空字串 `""`（呼叫端可自行改為 `"-"` 等）
 */
export function format(input: unknown, formatStr = FORMAT_DATETIME): string {
  const envStore = useEnvInfoStore()
  const offsetMinutes = envStore.envInfo.utc_offset ?? 0
  const targetZone = FixedOffsetZone.instance(offsetMinutes)

  const dt = parseUnknownToDateTime(input)
  if (!dt || !dt.isValid) return ""

  return dt.setZone(targetZone).toFormat(formatStr)
}

/**
 * 等同 `format(input, FORMAT_DATE)`，僅輸出日期（`yyyy-MM-dd`）。
 */
function formatDate(input: unknown): string {
  return format(input, FORMAT_DATE)
}

/**
 * 等同 `format(input, FORMAT_DATETIME)`，輸出日期＋時間（`yyyy-MM-dd HH:mm:ss`）。
 */
function formatDateTime(input: unknown): string {
  return format(input, FORMAT_DATETIME)
}

/**
 * 等同 `format(input, FORMAT_TIME)`，僅輸出時間（`HH:mm:ss`）。
 */
function formatTime(input: unknown): string {
  return format(input, FORMAT_TIME)
}

/**
 * 在 `<script setup>` 中可一次解構：
 * `const { format, formatDate, formatDateTime, formatTime, toRfc3339 } = useRfc3339()`。
 * 行為與直接 import 同名函式相同；僅為寫法便利。
 */
export function useRfc3339() {
  return {
    format,
    formatDate,
    formatDateTime,
    formatTime,
    toRfc3339
  }
}
