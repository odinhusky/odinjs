import { requestFn } from "@shared-lib/api/axiosInterceptors"
import { EmptyType } from "@shared-lib/api/commonTypes"
import { ENDPOINT_PATHS } from "@shared-lib/api/endpointPaths"

// 各個代理代理詳情顯示設定
export interface ProxyDisplayResponseType {
  shareholder_detail: boolean // 股東盤
}

// 取得代理入口開關設定
export const proxyDisplay = () => {
  return requestFn<EmptyType, ProxyDisplayResponseType>(ENDPOINT_PATHS.SITE.PROXY_DISPLAY, null, {
    name: "proxyDisplay",
    method: "get"
  })
}
