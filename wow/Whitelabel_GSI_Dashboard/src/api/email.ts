import { get, put } from "@/utils/request"
import type * as Request from "@/api/request.type"
import type * as Response from "@/api/response.type"

/**
 * Get SMTP config.
 * GET /platform/v1/agent/email/smtp-config
 */
export const getEmailSmtpConfig = () =>
  get<Response.EmailSmtpConfig>("/email/smtp-config", undefined, {
    name: "getEmailSmtpConfig",
    usePlatform: true
  })

/**
 * Get email template.
 * GET /platform/v1/agent/email/template
 */
export const getEmailTemplate = (params: Request.GetEmailTemplate) =>
  get<Response.EmailTemplateData>("/email/template", params, {
    name: "getEmailTemplate",
    usePlatform: true
  })

/**
 * Update SMTP config.
 * PUT /platform/v1/agent/email/smtp-config
 */
export const putEmailSmtpConfig = (payload: Request.PutEmailSmtpConfig) =>
  put<Response.EmailMutationData | undefined>("/email/smtp-config", payload, {
    name: "putEmailSmtpConfig",
    usePlatform: true
  })

/**
 * Update email template.
 * PUT /platform/v1/agent/email/template
 */
export const putEmailTemplate = (payload: Request.PutEmailTemplate) =>
  put<Response.EmailMutationData | undefined>("/email/template", payload, {
    name: "putEmailTemplate",
    usePlatform: true
  })
