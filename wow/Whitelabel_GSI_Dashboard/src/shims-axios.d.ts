import { AxiosRequestConfig } from "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    /** api 名稱 */
    name?: string

    /**
     * 是否使用 form 表單
     *
     * 預設為 false
     */
    useFormData?: boolean

    /**
     * 是否需要帶 token
     *
     * 預設為 true
     */
    needToken?: boolean

    /**
     * 固定的 Api path
     * @預設 undefined
     *
     * @undefined Api path會吃 VITE_APP_BASE_API_PATH 環境變數
     * @有值時 Api path會改成該值
     */
    fixedApiPath?: string

    /**
     * 固定的 Api path
     * @預設 undefined
     *
     * @有值時 強制路由到該 URL
     */
    customizationURL?: string

    /**
     * 是否為ai api
     * @預設 undefined
     *
     * @有值時 設定簽章邏輯
     */
    isAIMate?: boolean

    /**
     * api是否是新架構platform
     *
     * 預設為 false
     */
    usePlatform?: boolean

    /**
     * api是否是platform/job架構
     *
     * 預設為 false
     */
    usePlatformJob?: boolean

    /**
     * api語系
     *
     * 預設為 en
     */
    useLanguage?: string

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
