// composables/useAIKol.ts
import { ref } from "vue"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { AI_API_KEY, AI_API_SECRET } from "@/utils/constants/aiKolAPIConst"
import { getBaseUrl, bufferToHex } from "src/utils/aiKolUtils"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"

export function useAIKol() {
  const isLoading = ref(false)
  const kolsExamples = ref<Response.GetKolsExamples>([])
  const kols = ref<Response.Kol[]>([])
  const posts = ref<Response.AiKolPostItem[]>([])
  const { t } = useI18n()
  const $q = useQuasar()
  const myKols = ref<Response.GetKolsExamples>([])

  // $q.notify({
  //   type: "positive",
  //   message: t("ai_kol.add_success"),
  //   position: "top",
  //   timeout: 300
  // })

  // --- API 方法 ---

  /**
   * 產生 HMAC-SHA256 簽名
   * @param contentBody 對於 POST 是 JSON 字串，對於無參數 GET 是空字串
   */
  const generateSignature = async (contentBody: string) => {
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

  // --- 功能 1: 建立 KOL (POST) ---

  const createKol = async (payload: Response.Kol) => {
    isLoading.value = true
    try {
      const url = `${getBaseUrl()}/api/v1/ai-kol/kols`

      // 1. 準備 Payload (POST 需要 Body)
      const bodyStr = JSON.stringify(payload)

      // 2. 產生簽名 (POST 簽署: JSON字串 + 時間戳)
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        },
        body: bodyStr
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Create KOL Failed: ${response.status}`)
      }

      return resData as Response.Kol
    } catch (err) {
      const error = err as Error
      console.error("Create KOL Error:", error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- Method 2: 列出所有 KOL (GET) ---
  const getKolsList = async (): Promise<Response.Kol[] | undefined> => {
    isLoading.value = true
    try {
      const url = `${getBaseUrl()}/api/v1/ai-kol/kols`

      // 1. 準備 Payload (GET 無參數，Body 為空)
      const bodyStr = ""

      // 2. 產生簽名
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        }
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `List KOLs Failed: ${response.status}`)
      }

      kols.value = resData
      return resData as Response.Kol[]
    } catch (err) {
      const error = err as Error
      console.error("List KOLs Error:", error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- Method 3: 取得範例 (GET) ---
  const getExamples = async (): Promise<Response.GetKolsExamples | undefined> => {
    isLoading.value = true

    try {
      const url = `${getBaseUrl()}/api/v1/ai-kol/kols/examples`

      // 1. 準備 Payload (GET 無參數，Body 為空)
      const bodyStr = ""

      // 2. 產生簽名 (GET 簽署: 空字串 + 時間戳 = 純時間戳)
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求 (GET 不能帶 body)
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        }
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Get Examples Failed: ${response.status}`)
      }

      kolsExamples.value = resData
      return resData as Response.GetKolsExamples
    } catch (err) {
      const error = err as Error
      console.error("Get Examples Error:", error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- Method 4: 建立貼文 (POST) ---
  const createPost = async (payload: Request.CreatePostRequest): Promise<Response.CreatePostResponse | undefined> => {
    isLoading.value = true
    try {
      const url = `${getBaseUrl()}/api/v1/ai-kol/posts`

      // 1. 準備 Payload
      const bodyStr = JSON.stringify(payload)

      // 2. 產生簽名
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        },
        body: bodyStr
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Create Post Failed: ${response.status}`)
      }

      return resData as Response.CreatePostResponse
    } catch (err) {
      const error = err as Error
      console.error("Create Post Error:", error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- Method 5: 列出貼文 (GET) ---
  const getlistPosts = async (kolId?: number): Promise<Response.AiKolPostItem[] | undefined> => {
    isLoading.value = true
    try {
      const url = kolId ? `${getBaseUrl()}/api/v1/ai-kol/posts?kol_id=${kolId}` : `${getBaseUrl()}/api/v1/ai-kol/posts`

      // 1. 準備 Payload (GET 無參數，Body 為空)
      const bodyStr = ""

      // 2. 產生簽名
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        }
      })

      const resData = await response.json()

      $q.notify({
        type: response.ok ? "positive" : "negative",
        message: t(`${response.ok ? "ai_kol.loaded_KOL_data_successfully" : "ai_kol.loaded_KOL_data_fail"}`),
        position: "top",
        timeout: 300
      })

      if (!response.ok) {
        throw new Error(resData.message || `List Posts Failed: ${response.status}`)
      }

      posts.value = resData
      return resData as Response.AiKolPostItem[]
    } catch (err) {
      const error = err as Error
      console.error("List Posts Error:", error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // --- 功能 3: 取得我的kols (GET) ---

  const getMyKols = async () => {
    isLoading.value = true

    try {
      const url = `https://api.aimate.am/api/v1/ai-kol/kols`

      // 1. 準備 Payload (GET 無參數，Body 為空)
      const bodyStr = ""

      // 2. 產生簽名 (GET 簽署: 空字串 + 時間戳 = 純時間戳)
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求 (GET 不能帶 body)
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        }
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Get My Kols Failed: ${response.status}`)
      }

      myKols.value = resData
      return resData
    } catch (err: any) {
      console.error("Get My Kols Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  // --- 功能 4: 新增貼文 (POST) ---
  const createKolPost = async (payload: Record<string, any>) => {
    isLoading.value = true
    try {
      const url = `https://api.aimate.am/api/v1/ai-kol/posts`

      // 1. 準備 Payload (POST 需要 Body)
      const bodyStr = JSON.stringify(payload)

      // 2. 產生簽名 (POST 簽署: JSON字串 + 時間戳)
      const { signature, timestamp } = await generateSignature(bodyStr)

      // 3. 發送請求
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": AI_API_KEY,
          "X-Signature": signature,
          "X-Timestamp": timestamp
        },
        body: bodyStr
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Create KOL Post Failed: ${response.status}`)
      }

      return resData
    } catch (err: any) {
      console.error("Create KOL Post Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  // --- 功能 5: 上傳圖片轉取得圖片url (POST) ---
  const uploadImageToGetUrl = async (payload: File) => {
    isLoading.value = true
    try {
      const url = `https://api.aimate.am/api/v1/ai-kol/upload/temp`

      // 1. 準備 Payload (POST 需要 Body)
      const formData = new FormData()
      formData.append("file", payload)

      // 2. 發送請求(此api不需要簽名)
      const response = await fetch(url, {
        method: "POST",
        body: formData
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || `Create KOL Post Failed: ${response.status}`)
      }

      return resData
    } catch (err: any) {
      console.error("Create KOL Post Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Reactive State
    isLoading, // 載入狀態
    kolsExamples, // 範例 KOL 列表
    kols, // 所有 KOL 列表
    posts, // 貼文列表
    myKols,

    // Methods
    getExamples, // 取得範例
    getKolsList, // 列出所有 KOL
    createKol, // 建立 KOL
    createPost, // 建立貼文
    getlistPosts, // 列出貼文

    getMyKols,
    createKolPost,
    uploadImageToGetUrl
  }
}
