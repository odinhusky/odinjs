import type { AxiosRequestConfig } from "axios"

type HttpMethod = "get" | "post" | "put" | "patch" | "delete"

interface TimeFieldRule {
  method: HttpMethod
  pathPattern: RegExp
  fields: string[]
}

const FIELDS_DATE_RANGE = ["start_date", "end_date"] as const
const FIELDS_TIME_RANGE = ["start_time", "end_time"] as const
const FIELDS_STR_TIME_RANGE = ["str_time", "end_time"] as const
const FIELDS_KYC_RANGE = [
  "application_start_time",
  "application_end_time",
  "update_start_time",
  "update_end_time"
] as const

function makeRule(method: HttpMethod, pathPattern: RegExp, fields: readonly string[]): TimeFieldRule {
  return {
    method,
    pathPattern,
    fields: [...fields]
  }
}

function makeGetRule(pathPattern: RegExp, fields: readonly string[] = FIELDS_DATE_RANGE): TimeFieldRule {
  return makeRule("get", pathPattern, fields)
}

function makePutRule(pathPattern: RegExp, fields: readonly string[]): TimeFieldRule {
  return makeRule("put", pathPattern, fields)
}

function makePostRule(pathPattern: RegExp, fields: readonly string[]): TimeFieldRule {
  return makeRule("post", pathPattern, fields)
}

// 時間欄位轉換規則，僅保留 API_TIMEFIELD_INTERCEPTOR_CHANGELOG.md 主表項目
export const TIME_FIELD_RULES: TimeFieldRule[] = [
  makeGetRule(/\/center\/money\/history$/),
  makeGetRule(/\/center\/money\/history\/total$/),
  makeGetRule(/\/center\/money\/pending$/),
  makeGetRule(/\/v1\/player\/center\/credit_member_agent\/report\/money_history$/, FIELDS_STR_TIME_RANGE),
  makeGetRule(/\/v1\/player\/center\/credit_member_agent\/report\/member_bet_report$/, FIELDS_STR_TIME_RANGE),
  makeGetRule(/\/v1\/player\/center\/credit_member_agent\/report\/member_wager_list$/, FIELDS_STR_TIME_RANGE),
  makeGetRule(/\/platform\/v1\/player\/member\/credit-quota-history$/),
  makeGetRule(/\/platform\/v1\/player\/member\/summary$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/platform\/v1\/player\/member\/overview$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/platform\/v1\/player\/member\/overview\/list$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/agent_collab\/rebates$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/referral_rebate\/events$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/referral_rebate\/events\/current\/summary$/, FIELDS_TIME_RANGE),
  makeGetRule(/\/referral_rebate\/events\/current\/statement$/, FIELDS_TIME_RANGE)
]

/** 依 request 的 method + path 回傳需轉 RFC3339 的欄位名稱；無匹配則回傳空陣列 */
export function findTimeFieldList(config: AxiosRequestConfig): string[] {
  const method = (config.method || "get").toLowerCase() as HttpMethod
  const url = config.url || ""
  const path = url.split("?")[0]

  const rule = TIME_FIELD_RULES.find((r) => r.method === method && r.pathPattern.test(path))
  return rule ? [...rule.fields] : []
}
