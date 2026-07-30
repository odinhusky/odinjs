import { get, post } from "@/utils/request"
import type * as Response from "@/api/response.type"
import type * as Request from "@/api/request.type"

/**
 * DNS API 統一管理
 * 所有 DNS 相關的 API 都在這裡定義
 */

/**
 * 取得 DNS Domain 列表
 * GET /platform/v1/agent/dns/domain
 */
export const getDnsDomainList = () =>
  get<Response.GetDnsDomainList>("/dns/domain", undefined, {
    name: "getDnsDomainList",
    usePlatform: true
  })

/**
 * 儲存 DNS 設定變更
 * POST /platform/v1/agent/dns/save
 */
export const saveDnsSettings = (data: Request.SaveDnsSettings) =>
  post<Response.SaveDnsSettingsResponse>("/dns/save", data, {
    name: "saveDnsSettings",
    usePlatform: true
  })

/**
 * 取得代理是否使用外部CDN
 * GET /platform/v1/agent/cdn/status
 */
export const getCdnStatus = () =>
  get<Response.GetCdnStatusResponse>("/cdn/status", undefined, {
    name: "getCdnStatus",
    usePlatform: true
  })

/**
 * 檢查證書的狀態
 * GET /platform/v1/agent/dns/cert/status
 */
export const getCertStatus = () =>
  get<Response.GetCertStatusResponse>("/dns/cert/status", undefined, {
    name: "getCertStatus",
    usePlatform: true
  })

/**
 * 取得Domain的CNAME/VALUE的驗證資訊
 * GET /platform/v1/agent/dns/cert/validation
 */
export const getCertValidation = () =>
  get<Response.GetCertValidationResponse>("/dns/cert/validation", undefined, {
    name: "getCertValidation",
    usePlatform: true
  })

/**
 * 申請證書
 * POST /platform/v1/agent/dns/cert/apply
 */
export const applyDnsCert = (data: Request.ApplyDnsCert) =>
  post<Response.ApplyDnsCertResponse>("/dns/cert/apply", data, {
    name: "applyDnsCert",
    usePlatform: true
  })
