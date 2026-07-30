import { useEnv } from "@/hook/useEnv"

export type NormalizeDynamicResourceUrlOptions = {
  /**
   * 預設：true
   * - true：保留 `http(s)://`、`//`、`data:`、`blob:` 這些可直接使用的 URL
   * - false：一律視為相對路徑，強制補上 base（較少用）
   */
  keepAbsolute?: boolean

  /**
   * 若 src 是「純 base64」（沒有 `data:*;base64,` 前綴），是否要自動包成 data URL。
   * 預設：true（但採用保守判斷，避免誤判一般字串）
   */
  wrapBareBase64AsDataUrl?: boolean

  /**
   * 搭配 wrapBareBase64AsDataUrl 使用的 MIME type
   * 預設：image/png
   */
  dataUrlMimeType?: string
}

/**
 * 將後端回傳的 objectKey / 相對路徑，轉為可直接顯示的資源 URL。
 * - 絕對 URL / base64 / blob 會直接回傳
 * - 其餘會以 `VITE_APP_DYNAMIC_RESOURCE_URL` 當 base 進行拼接
 */
export function useDynamicResourceUrl() {
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const normalizeDynamicResourceUrl = (src?: string, options?: NormalizeDynamicResourceUrlOptions) => {
    const value = String(src || "").trim()
    if (!value) return ""

    const keepAbsolute = options?.keepAbsolute ?? true
    // 1) 已是可直接使用的絕對 URL / dataURL / blobURL：直接回傳
    if (keepAbsolute && (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value))) {
      return value
    }

    // 2) 純 base64（無 data: 前綴）時的保守處理
    // - 避免把一般短字串誤判為 base64：要求長度 >= 120 且只含 base64 字元
    const wrapBareBase64AsDataUrl = options?.wrapBareBase64AsDataUrl ?? true
    if (wrapBareBase64AsDataUrl) {
      const maybeBareBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length >= 120
      if (maybeBareBase64) {
        const mime = String(options?.dataUrlMimeType || "image/png").trim() || "image/png"
        return `data:${mime};base64,${value}`
      }
    }

    // 3) 其餘視為 objectKey / 相對路徑：補上 dynamic resource base
    const base = String(VITE_APP_DYNAMIC_RESOURCE_URL || "").replace(/\/+$/, "")
    const path = value.replace(/^\/+/, "")
    return base ? `${base}/${path}` : value
  }

  return {
    normalizeDynamicResourceUrl
  }
}
