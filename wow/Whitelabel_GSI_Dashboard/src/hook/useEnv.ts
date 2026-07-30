import { ENV_MODE_ENUM, useEnvInfoStore } from "src/stores/envStore"

export { ENV_MODE_ENUM }

/** dev `baseApi` */
export const ENV_DEV_BASE_API = "https://api-devm-dev.gsiwl.com"
/** stg `baseApi` */
export const ENV_STG_BASE_API = "https://api-stagingagent.gsiwl.com"

export function useEnv() {
  /*
    isMode 有以下三種狀態, 由於有三種狀態, 不可再用true/false去判斷
    總控: .env.tesing => admin
    總代: .env.agent => agent
    代理: .env.generalAgent => generalAgent
  */
  const getModeEnv = () => {
    const { envInfo } = useEnvInfoStore()
    //console.log(import.meta.env)
    const { VITE_IS_MOCK, VITE_APP_MOCK_BASE_API_PATH } = envInfo
    const baseApi = envInfo.baseApi
    const VITE_IS_DEV = baseApi === ENV_DEV_BASE_API
    const VITE_IS_STG = baseApi === ENV_STG_BASE_API
    return {
      VITE_APP_TITLE: "Quasar Core",
      VITE_APP_SITE_VERSION: envInfo.version,
      VITE_APP_BASE_API: baseApi,
      VITE_APP_BASE_API_PATH: envInfo.apiPath,
      VITE_APP_DYNAMIC_RESOURCE_URL: removeTrailingSlash(envInfo.dynamicResourceUrl) || removeTrailingSlash(baseApi),
      VITE_APP_MODE: envInfo.mode,
      VITE_IS_MOCK: VITE_IS_MOCK,
      VITE_APP_MOCK_BASE_API_PATH,
      VITE_APP_STATIC_RESOURCE_URL: envInfo.staticResourceUrl || "",
      VITE_IS_DEV,
      VITE_IS_STG
    }
  }
  const envData = () => getModeEnv()
  // const version = () => process.env.VUE_APP_SITE_VERSION
  const appMode = getModeEnv().VITE_APP_MODE
  const isAdminMode = appMode === ENV_MODE_ENUM.ADMIN
  const isGeneralAgentMode = appMode === ENV_MODE_ENUM.GENERAL_AGENT
  const isAgentMode = appMode === ENV_MODE_ENUM.AGENT || appMode === ENV_MODE_ENUM.ANIBET_AGENT

  function removeTrailingSlash(url: string) {
    return url.endsWith("/") ? url.slice(0, -1) : url
  }

  function removePrefixDeep(obj: any, prefix: string): any {
    if (typeof obj === "string") {
      let val = obj.startsWith(prefix) ? obj.slice(prefix.length) : obj
      const qIdx = val.indexOf("?")
      if (qIdx !== -1) {
        val = val.slice(0, qIdx)
      }
      return val
    } else if (Array.isArray(obj)) {
      return obj.map((item) => removePrefixDeep(item, prefix))
    } else if (typeof obj === "object" && obj !== null) {
      const newObj: any = {}
      for (const key in obj) {
        newObj[key] = removePrefixDeep(obj[key], prefix)
      }
      return newObj
    }
    return obj
  }
  return {
    envData,
    appMode,
    isAdminMode,
    isGeneralAgentMode,
    isAgentMode,
    removePrefixDeep
    // isMode,
    // version
  }
}
