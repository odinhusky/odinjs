import type { AxiosInstance, AxiosRequestConfig } from "axios"
import axios from "axios"
import { useRouterStore } from "src/stores/routerStore"
// import { ComponentInternalInstance, getCurrentInstance } from 'vue';
// import { Modal } from 'view-ui-plus';
import type { BaseResponse } from "@/api/response.type"
import needMockApi from "src/api/mock.api.list"
import { useEnv } from "src/hook/useEnv"

import Vrouter from "../router" // 直接從路由引入路由對象
import { ERROR_CODE } from "@/utils/constants"
import { applyAxiosTimeFieldConversion } from "@/composables/useAxiosTimeField"

// 目前後端資料格式尚未修正為BaseResponse格式, 所以先開後門允許string
interface Error<T> {
  message: string
  status: number
  data: BaseResponse<T> | string
}

let responseErrorData: Error<object>

// const modalOut = () => {
//   (Modal as any).confirm({
//     title: '系统忙碌，請重新登入',
//     onOk: () => {
//       sessionStorage.removeItem('publicToken');
//       sessionStorage.removeItem('userData');
//       location.reload();
//     },
//   });
// };

let { envData } = useEnv()

const { VITE_APP_BASE_API, VITE_APP_BASE_API_PATH, VITE_IS_MOCK, VITE_APP_MOCK_BASE_API_PATH } = envData()
const instance: AxiosInstance = axios.create({
  baseURL: `${VITE_APP_BASE_API}`,
  timeout: 600000,
  headers: {
    "Content-type": "application/json"
  }
})

// 使用Vue.config.globalProperties實例上的方法在proxy裡面可以找到
// 因此可以解決this.$Message 諸如此類問題
// const { proxy } = getCurrentInstance() as ComponentInternalInstance

// 1. 務必將這裡改成 async (config)
instance.interceptors.request.use(
  async (config) => {
    // ... (原本的 mock 判斷代碼) ...
    if (VITE_IS_MOCK && config.name && ~needMockApi.indexOf(config.name)) {
      config.baseURL = `http://${VITE_APP_MOCK_BASE_API_PATH}${config.fixedApiPath || VITE_APP_BASE_API_PATH}`
    } else {
      config.baseURL += `${config.fixedApiPath || VITE_APP_BASE_API_PATH}`
    }

    const { usePlatform = false, usePlatformJob = false, useLanguage = "" } = config

    if (usePlatform) {
      config.baseURL = config.baseURL?.replace(/(https:\/\/[^\/]+)(\/v1\/.*)/, "$1/platform$2")
    } else if (usePlatformJob) {
      console.log("usePlatformJob", config.baseURL?.replace(/(https:\/\/[^\/]+)(\/v1\/.*)/, "$1/platform/job$2"))
      config.baseURL = config.baseURL?.replace(/(https:\/\/[^\/]+)(\/v1\/.*)/, "$1/platform/job$2")
    }

    const { useFormData = false } = config
    if (useFormData) {
      config.headers["Content-Type"] = "multipart/form-data"
    }

    // 加入 Accept-Language header
    if (typeof useLanguage === "string" && useLanguage.trim() !== "") {
      const lang = useLanguage.trim()
      config.headers["Accept-Language"] = lang
      console.log("Set Accept-Language:", lang)
    }

    // ... (原本的 Token 代碼) ...
    const { needToken = true } = config
    if (needToken) {
      const auth = `Bearer ${sessionStorage.getItem("publicToken")}`
      config.headers.Authorization = auth
    }

    if (config.customizationURL) {
      config.baseURL = config.customizationURL
    }

    if (config.isAIMate) {
      await addAiMateSignature(config)
    }

    if (config.directCallAWS) {
      return config
    }

    applyAxiosTimeFieldConversion(config)

    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  async (response) => {
    const { status: httpStatusCode, data: httpResponseData, config, headers } = response

    // 若請求為直接 call AWS 服務，則直接透過 http status code 來判斷是否成功
    if (config.directCallAWS) {
      if (httpStatusCode >= 200 && httpStatusCode < 300) {
        return Promise.resolve({
          status: true,
          code: ERROR_CODE.Enums.SUCCESS,
          msg: "success",
          data: httpResponseData
        })
      }
      return Promise.resolve({
        status: false,
        code: ERROR_CODE.Enums.CALL_S3_FAILED,
        msg: "AWS request failed.",
        data: httpResponseData
      })
    }

    // 如果是 translate API，需要特殊處理（直接返回原始數據格式）
    if (config.customizationURL?.includes("translate.aimate.am") || config.name === "translateAiText") {
      // 根據 HTTP 狀態碼判斷成功或失敗
      if (httpStatusCode >= 200 && httpStatusCode < 300) {
        return Promise.resolve({
          status: true,
          code: ERROR_CODE.Enums.SUCCESS,
          msg: "success",
          data: httpResponseData
        })
      } else {
        // HTTP 狀態碼表示錯誤
        const error = httpResponseData?.error || httpResponseData
        const errorCode = error?.code ?? httpStatusCode
        const errorMessage = error?.message || error?.msg || `HTTP ${httpStatusCode} error`
        return Promise.resolve({
          status: false,
          code: errorCode,
          msg: errorMessage,
          data: error
        })
      }
    }

    if (!httpResponseData) {
      return Promise.resolve({
        status: false,
        code: ERROR_CODE.Enums.SERVER_EXCEPTION,
        msg: "response is empty.",
        data: null
      })
    }

    if (httpStatusCode !== 200) {
      const { error } = httpResponseData
      const errorCode = error?.code ?? 0
      const errorMessage = error?.message ?? ""

      return Promise.resolve({
        status: false,
        code: errorCode,
        msg: errorMessage,
        data: error
      })
    }

    const isJson = headers["content-type"].includes("application/json")
    const isXlsx =
      headers["content-type"].includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      headers["content-type"].includes("application/octet-stream")

    if (isJson) {
      if (config.responseType === "blob") {
        const jsonResponseData = await blobToJson(response.data)
        const { code, msg, data } = jsonResponseData
        return Promise.resolve({
          status: code === ERROR_CODE.Enums.SUCCESS,
          msg,
          code,
          data
        })
      }
      const { code, msg, data } = httpResponseData
      return Promise.resolve({
        status: code === ERROR_CODE.Enums.SUCCESS,
        msg,
        code,
        data
      })
    }

    if (isXlsx) {
      const file = new Blob([httpResponseData], { type: headers["content-type"] })
      const blobUrl = URL.createObjectURL(file)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `export_report_${config.name}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return Promise.resolve({
        status: httpResponseData !== null,
        msg: "xlsx file is empty.",
        code: ERROR_CODE.Enums.EXCEL_IS_EMPTY,
        data: httpResponseData
      })
    }
  },
  (error: any) => {
    if (!error.response) {
      return Promise.resolve({
        status: false,
        msg: error.message || "Network Error",
        code: typeof error.code === "number" ? error.code : ERROR_CODE.Enums.SERVER_EXCEPTION,
        data: null
      })
    }

    const { status, data } = error.response

    if (data) {
      const { code, msg } = data

      return Promise.resolve({
        status: false,
        msg,
        code,
        data: data || null
      })
    }

    return Promise.resolve({
      status: false,
      msg: error?.response?.data?.msg || error?.message,
      code: error?.response?.data?.code || error?.code || ERROR_CODE.Enums.SERVER_EXCEPTION,
      data: error?.response?.data || error
    })
  }
)
export const get = async function <T>(url: string, params: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
  return instance.get(url, { ...config, params })
}

export const post = async function <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
  return instance.post(url, data, config)
}
export const put = async function <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
  return instance.put(url, data, config)
}
export const patch = async function <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
  return instance.patch(url, data, config)
}

export const deleteData = async function <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<BaseResponse<T>> {
  return instance.delete(url, {
    ...config,
    data
  })
}

export default instance

async function blobToJson(blob: Blob): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        // 读取完成后解析为 JSON
        const text = reader.result as string
        const json = JSON.parse(text)
        resolve(json)
      } catch (error: any) {
        reject(new Error("Failed to parse JSON: " + error.message))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read Blob: " + reader.error?.message))
    }

    // 读取 Blob 为文本
    reader.readAsText(blob)
  })
}

async function addAiMateSignature(config: AxiosRequestConfig): Promise<void> {
  // ===== 新增 AiMate 簽名邏輯 =====
  // 檢查 config 中是否有帶 aiMate: true

  // 建議：這兩個 Key 最好從環境變數 import.meta.env 讀取，不要寫死
  const API_KEY = "ak_am_Bn7hby4UzNABiRrDw1FqNT8xYSZPhqnH"
  const API_SECRET = "vcTNhNuCbi6bPuRMkCZlpZE5lms65I9m"

  const timestamp = Math.floor(Date.now() / 1000).toString()
  let messageBody = ""

  // 判斷請求類型以決定簽署內容
  // POST/PUT 且有 data => 簽署 JSON String
  if (["post", "put", "patch"].includes(config.method?.toLowerCase() || "") && config.data) {
    // 注意：Axios 的 interceptor 在這裡拿到的 config.data 還是物件，需要轉字串
    messageBody = JSON.stringify(config.data)
  }
  // GET => 根據先前的邏輯，這裡是空字串 (如果需要簽署 Query Params，需另外處理)
  else {
    messageBody = ""
  }

  const message = messageBody + timestamp

  // --- 執行加密 (Web Crypto API) ---
  const encoder = new TextEncoder()
  const keyData = encoder.encode(API_SECRET)
  const msgData = encoder.encode(message)

  // 1. Import Key
  const cryptoKey = await window.crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ])

  // 2. Sign
  const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData)

  // 3. Convert to Hex
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  // --- 設定 Headers ---
  // 確保 headers 物件存在
  config.headers = config.headers || {}

  config.headers["Content-Type"] = "application/json"
  config.headers["X-API-Key"] = API_KEY
  config.headers["X-Signature"] = signature
  config.headers["X-Timestamp"] = timestamp

  // 如果是 AiMate API，通常不需要 Bearer Token，視情況可移除
  // delete config.headers.Authorization

  // ==============================
}
