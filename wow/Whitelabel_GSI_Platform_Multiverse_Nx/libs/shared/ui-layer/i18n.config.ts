import { defineI18nConfig } from "#i18n"

/**
 * Remote CMS 的 JSON 用 flat dot-notation key（例如 `"cash.remainingTurnover": "剩餘流水"`）
 * 而不是 nested 物件（`{ cash: { remainingTurnover: "..." } }`）。
 *
 * vue-i18n 預設把 `.` 當路徑分隔字元，會去找 nested 結構，導致找不到 key。
 * 同時 CMS 內存在 parent/child 衝突（例如同時有 `wallet.oneClickTransferBack` 和
 * `wallet.oneClickTransferBack.confirmMessage`），所以不能用 unflatten 的方式處理。
 *
 * 解法：覆寫 messageResolver，讓它把 path 當字面 key 查詢。
 */
export default defineI18nConfig(() => ({
  legacy: false,
  messageResolver: (obj: Record<string, unknown>, path: string) => {
    if (!obj) return undefined
    // 1. 先字面查詢（CMS flat key 走這條）
    if (path in obj) return obj[path]
    // 2. fallback 走 vue-i18n 預設的 dot-path 解析，照顧少數可能存在的 nested key
    const parts = path.split(".")
    let cursor: unknown = obj
    for (const part of parts) {
      if (cursor && typeof cursor === "object" && part in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    return cursor
  }
}))
