import { defineStore } from "pinia"
import { reactive } from "vue"

// 往後所有state型別定義都固定以此方式命名(stateType)
interface stateType {
  [key: string]: any
  version: string
  mode: ENV_MODE_ENUM
  VITE_IS_MOCK: boolean
  dynamicResourceUrl: string
}

export enum ENV_MODE_ENUM {
  /** 管理員 */
  ADMIN = "admin",

  /** 總代理 */
  GENERAL_AGENT = "generalAgent",

  /** 代理 */
  AGENT = "agent",

  /** anibet代理 */
  ANIBET_AGENT = "anibetAgent",

  /** AMUSEVIP */
  AMUSEVIP = "amusevip"
}

export const useEnvInfoStore = defineStore("envInfo", () => {
  // 預設資料
  const envInfo: stateType = reactive({
    version: "1.0.0",
    baseApi: "",
    apiPath: "/v1/agent",
    mode: ENV_MODE_ENUM.AGENT,
    VITE_IS_MOCK: !!process.env.VITE_IS_MOCK,
    VITE_APP_MOCK_BASE_API_PATH: process.env.VITE_APP_MOCK_BASE_API_PATH || "",
    staticResourceUrl: "",
    dynamicResourceUrl: "",
    agentCode: ENV_MODE_ENUM.AMUSEVIP
  })

  const updatedEnvInfo = (data: stateType, attr: any = "") => {
    if (attr === "") {
      for (const key in data) {
        envInfo[key] = data[key]
      }
      return
    }

    envInfo[attr] = data[attr]
  }

  return { envInfo, updatedEnvInfo }
})
