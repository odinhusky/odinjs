import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import type { ApiResponse } from "@shared-lib/api/types"
import * as ERROR_CODE_TYPE from "@shared-lib/constants/enums/errorCodeTypes"
import { useCookie, useRuntimeConfig } from "#app"
import { useAuth } from "@shared-lib/composables/useAuth"
import { I18N_DEFAULT_LANG } from "@shared-lib/constants/i18n"

declare module "axios" {
  export interface AxiosRequestConfig {
    /** API名稱，用於對應mock api */
    name?: string

    /** 是否使用 form data 格式傳送 */
    useFormData?: boolean

    /** 是否需要自動戴上 token，預設為 true */
    needToken?: boolean

    /** 無 token 時是否仍強制送出 `Authorization: Bearer undefined` */
    forceBearerUndefinedWhenNoToken?: boolean

    /** 是否使用 platform 的 baseAPI 進行請求，預設為 false */
    usePlatform?: boolean

    /**
     * 用來判斷此請求是否直接呼叫 AWS 的服務
     * @預設 undefined
     *
     * @undefined 預設為 false
     * @true時 response 的 status 會直接使用 http status code 來判斷
     */
    directCallAWS?: boolean
  }
}

// axios 實例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api", // baseURL 將透過 interceptor 動態設定，這裡給個預設值
  timeout: 1000 * 10, // timeout時間，單位為毫秒
  headers: {
    "Content-Type": "application/json"
  }
})

// request 攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // 透過 useRuntimeConfig 取得在 nuxt.config.ts 定義的 public.apiBase
      const runtimeConfig = useRuntimeConfig()

      // 拿取當前語系
      const localeCookie = useCookie("i18n_redirected")
      const currentLocale = localeCookie.value || I18N_DEFAULT_LANG

      const { access_token } = useAuth()

      // 動態設定 baseURL，優先使用 nuxt 的 runtimeConfig
      if (runtimeConfig.public["apiBase"]) {
        config.baseURL = runtimeConfig.public["apiBase"] as string
      }

      if (config.usePlatform && import.meta.dev) {
        config.baseURL = "http://localhost:8898"
      }

      // 設定語系
      config.headers["Accept-Language"] = currentLocale || I18N_DEFAULT_LANG

      // 從 config解構出 needToken 與 useFormData，並給予預設值
      const { needToken = true, useFormData = false, forceBearerUndefinedWhenNoToken = false } = config

      // 設定 Content-Type 為 form-data
      if (useFormData) {
        config.headers["Content-Type"] = "multipart/form-data"
      }

      // 設定Token
      if (needToken) {
        const normalizedToken = (access_token || "").trim()
        if (normalizedToken) {
          config.headers.Authorization = /^Bearer\s+/i.test(normalizedToken)
            ? normalizedToken
            : `Bearer ${normalizedToken}`
        } else if (forceBearerUndefinedWhenNoToken) {
          config.headers.Authorization = "Bearer undefined"
        }
      }

      // 如果是開發環境 (dev)，且有設定 AgentCode，則注入 Header
      // 注意：import.meta.dev 是 Vite/Nuxt 提供的環境變數
      // if (import.meta.dev && runtimeConfig.public.agentCode) {
      if (runtimeConfig.public["agentCode"]) {
        config.headers["Agentcode"] = runtimeConfig.public["agentCode"] as string
      }
    } catch (error) {
      // 在非 Nuxt Context 下 (例如測試或純 JS 執行) 可能會失敗，這時維持原本的 config.baseURL
      // 或是嘗試 fallback 到 process.env
      if (typeof process !== "undefined" && process.env?.["NUXT_PUBLIC_API_BASE"]) {
        config.baseURL = process.env?.["NUXT_PUBLIC_API_BASE"]
      }
    }
    return config
  },
  (error) => {
    console.error("!! axios request interceptor error:", error)
    return Promise.reject(error)
  }
)

// response 攔截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>): any => {
    const { status: httpStatusCode, data: httpResponseData, config } = response

    // 若請求為直接 call AWS 服務，則直接透過 http status code 來判斷是否成功
    if (config.directCallAWS) {
      if (httpStatusCode >= 200 && httpStatusCode < 300) {
        return Promise.resolve({
          status: true,
          code: ERROR_CODE_TYPE.Enums.SUCCESS,
          msg: "success",
          data: httpResponseData
        })
      }
      return Promise.resolve({
        status: false,
        code: ERROR_CODE_TYPE.Enums.CALL_S3_FAILED,
        msg: "AWS request failed.",
        data: httpResponseData
      })
    }

    if (!httpResponseData) {
      return Promise.resolve({
        status: false,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
        excode: undefined,
        msg: "response is empty.",
        data: null
      })
    }

    if (httpStatusCode !== 200) {
      return {
        status: false,
        code: httpResponseData.error?.code ?? 0,
        excode: httpResponseData.excode,
        msg: httpResponseData.error?.message ?? "",
        data: httpResponseData.error
      }
    }

    const { code, msg, data, excode } = httpResponseData
    return Promise.resolve({
      status: code === ERROR_CODE_TYPE.Enums.SUCCESS,
      msg,
      code,
      excode: excode || undefined,
      data: data || null
    })
  },
  (error: any) => {
    return Promise.resolve({
      status: false,
      msg: error?.response?.data?.msg || error?.message,
      code: error?.response?.data?.code || error?.code || ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
      excode: error?.response?.data?.excode || undefined,
      data: error?.response?.data || error
    })
  }
)

export const requestFn = async <RequestData, ResponseData>(
  url: string,
  params: RequestData,
  config: AxiosRequestConfig
): Promise<ApiResponse<ResponseData>> => {
  const method = config.method?.toLowerCase() || "get"
  const isGet = method === "get"

  const requestConfig: AxiosRequestConfig = {
    ...config,
    url,
    // 💡 確保處理 params 或 data 的邏輯一致
    [isGet ? "params" : "data"]: params
  }

  // 💡 直接告訴 Axios，我們預期攔截器轉換後的回傳值是 ApiResponse<ResponseData>
  // 這能確保 response 的型別在這一層就被鎖定
  const response = await axiosInstance.request<any, ApiResponse<ResponseData>>(requestConfig)
  return response
}
