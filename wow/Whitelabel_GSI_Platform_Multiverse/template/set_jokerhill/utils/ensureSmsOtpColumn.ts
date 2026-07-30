import type * as Response from "src/api/response.type"

const SMS_OTP_COLUMN_NAME = "sms_otp"

function createSmsOtpColumn(): Response.RegistInputCustom {
  return {
    column_name: SMS_OTP_COLUMN_NAME,
    customize: true,
    edit: true,
    lang: {
      en: ""
    },
    required: true,
    type: 1,
    values: []
  }
}

export function ensureSmsOtpColumn(
  columns: Response.RegistInputCustomList | null | undefined,
  shouldInject: boolean
): Response.RegistInputCustomList {
  const list = [...(columns || [])]

  if (!shouldInject || list.some((column) => column.column_name === SMS_OTP_COLUMN_NAME)) {
    return list
  }

  const smsOtpColumn = createSmsOtpColumn()
  const phoneIndex = list.findIndex((column) => column.column_name === "phone")
  if (phoneIndex >= 0) {
    list.splice(phoneIndex + 1, 0, smsOtpColumn)
    return list
  }

  const countryIndex = list.findIndex((column) => column.column_name === "country")
  if (countryIndex >= 0) {
    list.splice(countryIndex + 1, 0, smsOtpColumn)
    return list
  }

  list.push(smsOtpColumn)
  return list
}
