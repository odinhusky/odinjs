import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"
import { get, post } from "@/utils/request"

const getAuditAdjustmentBalancePath = (params: Request.GetAuditAdjustmentBalance): string => {
  const account = encodeURIComponent(params.account)
  return `/audit_adjustment/${account}/${params.wallet_type}/${params.currency_id}/balance`
}

const getAuditAdjustmentRecordsPayload = (
  params: Request.GetAuditAdjustmentRecords
): Request.AuditAdjustmentRecordsPayload => ({
  account: params.memberAccount,
  currency_id: params.currency,
  end_date: params.end,
  offset: params.offset,
  size: params.size,
  start_date: params.start,
  wallet_type: params.wallet_type
})

const getAuditAdjustmentRecordsExportPayload = (
  params: Request.GetAuditAdjustmentRecordsExport
): Request.AuditAdjustmentRecordsExportPayload => ({
  account: params.memberAccount,
  currency_id: params.currency,
  end_date: params.end,
  start_date: params.start,
  wallet_type: params.wallet_type
})

const getValidateAuditAdjustmentPayload = (params: Request.ValidateAuditAdjustment): FormData => {
  const formData = new FormData()
  formData.append("file", params.file)
  return formData
}

export const getAuditAdjustmentBalance = (
  params: Request.GetAuditAdjustmentBalance
): Promise<Response.BaseResponse<Response.AuditAdjustmentBalance>> =>
  get<Response.AuditAdjustmentBalance>(getAuditAdjustmentBalancePath(params), undefined, {
    name: "getAuditAdjustmentBalance",
    needToken: true
  })

export const createAuditAdjustment = (
  params: Request.CreateAuditAdjustment
): Promise<Response.BaseResponse<Response.AuditAdjustmentMutation>> =>
  post<Response.AuditAdjustmentMutation>("/audit_adjustment", params, {
    name: "createAuditAdjustment",
    needToken: true
  })

export const getAuditAdjustmentRecords = (
  params: Request.GetAuditAdjustmentRecords
): Promise<Response.BaseResponse<Response.AuditAdjustmentRecords>> =>
  get<Response.AuditAdjustmentRecords>("/audit_adjustment/records", getAuditAdjustmentRecordsPayload(params), {
    name: "getAuditAdjustmentRecords",
    needToken: true
  })

export const getAuditAdjustmentRecordsExport = (
  params: Request.GetAuditAdjustmentRecordsExport
): Promise<Response.BaseResponse<Response.AuditAdjustmentRecordsExport>> =>
  get<Response.AuditAdjustmentRecordsExport>(
    "/audit_adjustment/records/export",
    getAuditAdjustmentRecordsExportPayload(params),
    {
      name: "getAuditAdjustmentRecordsExport",
      needToken: true
    }
  )

export const validateAuditAdjustment = (
  params: Request.ValidateAuditAdjustment
): Promise<Response.BaseResponse<Response.AuditAdjustmentValidateResult[]>> =>
  post<Response.AuditAdjustmentValidateResult[]>(
    "/audit_adjustment/validate",
    getValidateAuditAdjustmentPayload(params),
    {
      name: "validateAuditAdjustment",
      needToken: true,
      useFormData: true
    }
  )
