import { AI_API_BASE_URL, AI_API_SECRET } from "@/utils/constants/aiKolAPIConst"

// 根據環境選擇 Base URL
export const getBaseUrl = (): string => {
  // 開發環境使用 proxy，生產環境直接連接
  return import.meta.env.DEV ? "/ai-kol-api" : AI_API_BASE_URL
}

// --- 內部工具：加密與簽名 ---
export const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * 產生 HMAC-SHA256 簽名
 * @param contentBody 對於 POST 是 JSON 字串，對於無參數 GET 是空字串
 */
export const generateSignature = async (contentBody: string) => {
  const timestamp = Math.floor(Date.now() / 1000).toString()

  // 簽名規則：Body內容 + 時間戳
  // 注意：Python 的 separators=(",", ":") 代表 JSON 無空格
  const message = contentBody + timestamp

  const encoder = new TextEncoder()
  const keyData = encoder.encode(AI_API_SECRET)
  const msgData = encoder.encode(message)

  const cryptoKey = await window.crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ])

  const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData)

  return {
    signature: bufferToHex(signatureBuffer),
    timestamp
  }
}
