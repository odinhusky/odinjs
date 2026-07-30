import type { AxiosRequestConfig } from "axios"

type HttpMethod = "get" | "post" | "put" | "patch" | "delete"

interface TimeFieldRule {
  method: HttpMethod
  pathPattern: RegExp
  fields: string[]
}

const FIELDS_DATE_RANGE = ["start_date", "end_date"] as const
const FIELDS_TIME_RANGE = ["start_time", "end_time"] as const
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

// GET/POST/PUT 請求中，依 path 將時間欄位由 timestamp 轉為 RFC3339
export const TIME_FIELD_RULES: TimeFieldRule[] = [
  makeGetRule(/^\/?operation_log\/list$/),
  makeGetRule(/^\/?announcement\/member\/list$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?announcement\/list$/),
  makeGetRule(/^\/?agent\/report\/list$/),
  makeGetRule(/^\/?auth\/kyc\/applications$/, FIELDS_KYC_RANGE),
  makeGetRule(/^\/?auth\/kyc\/applications\/export$/, FIELDS_KYC_RANGE),
  makePutRule(/^\/?banners\/[^/]+$/, FIELDS_DATE_RANGE),
  makeGetRule(/^\/?bet\/report\/list$/),
  makeGetRule(/^\/?bet\/report\/member\/list$/),
  makeGetRule(/^\/?bet\/report\/member\/list\/export$/),
  makeGetRule(/^\/?cash\/report\/list$/),
  makeGetRule(/^\/?cash\/report\/list\/export$/),
  makeGetRule(/^\/?cash\/report\/member\/list$/, ["date"]),
  makeGetRule(/^\/?cash\/report\/member\/list\/export$/, ["date"]),
  makeGetRule(/^\/?collaboration\/settlements$/, ["started_at", "ended_at"]),
  makeGetRule(/^\/?commission\/statements$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?commissions\/statements$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?commissions\/statements\/[^/]+$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?commissions\/report(?:\/[^/]+)?\/?$/),
  makeGetRule(/^\/?deposit_entry\/history\/list$/),
  makeGetRule(/^\/?deposit_entry\/list$/),
  makeGetRule(/^\/?deposit_entry\/list\/export$/),
  makeGetRule(/^\/?dashboard$/, FIELDS_TIME_RANGE),
  makePostRule(/^\/?free_round$/, ["begin_date", "end_date"]),
  makeGetRule(/^\/?free_round\/list$/, ["begin_date", "end_date"]),
  makeGetRule(/^\/?gifts\/events\/list$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?gifts\/events\/[^/]+\/details\/list$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?gifts\/events\/[^/]+\/details\/list\/export$/, FIELDS_TIME_RANGE),
  makePostRule(/^\/?gifts\/events\/dispatch$/, ["dispatched_at", "expired_at"]),
  makePostRule(/^\/?gifts\/events\/dispatch\/batch$/, ["dispatched_at", "expired_at"]),
  makeGetRule(/^\/?interest\/activity$/, FIELDS_TIME_RANGE),
  makePostRule(/^\/?interest\/activity$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?interest\/application\/auditing$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?interest\/application\/refunded$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?levels\/logs$/),
  makeGetRule(/^\/?levels\/review$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?member\/list$/),
  makeGetRule(/^\/?member\/list\/export$/),
  makeGetRule(/^\/?member\/[^/]+\/rebate\/list$/),
  makeGetRule(/^\/?member\/[^/]+\/transaction\/list$/),
  makeGetRule(/^\/?member\/[^/]+\/wager\/list$/),
  makeGetRule(/^\/?audit_adjustment\/records$/),
  makeGetRule(/^\/?audit_adjustment\/records\/export$/),
  makeGetRule(/^\/?member\/overview$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?member\/overview\/detail$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?member\/overview\/list$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?member\/overview\/team\/detail$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?master\/report\/list$/),
  makeGetRule(/^\/?member_adjustment\/export$/, ["start", "end"]),
  makeGetRule(/^\/?member_adjustment\/list$/, ["start", "end"]),
  makeGetRule(/^\/?messages\/notifications$/, ["start", "end"]),
  makeGetRule(/^\/?member_agent_quota\/list$/, ["str_time", "end_time"]),
  makeGetRule(/^\/?member_agent_quota\/list\/export$/, ["str_time", "end_time"]),
  makeGetRule(/^\/?notification\/export$/),
  makeGetRule(/^\/?notification\/list$/),
  makeGetRule(/^\/?product\/report\/list$/),
  makeGetRule(/^\/?product\/report\/member\/list$/),
  makeGetRule(/^\/?product\/report\/list\/export$/),
  makeGetRule(/^\/?promotions\/list$/),
  makeGetRule(/^\/?promotions\/review\/list$/),
  makeGetRule(/^\/?promotions\/review\/list\/export$/),
  makeGetRule(/^\/?rebate\/event\/list$/),
  makeGetRule(/^\/?rebate\/group\/list$/),
  makePostRule(/^\/?rebate\/group$/, ["start_at", "end_at"]),
  makePutRule(/^\/?rebate\/group\/[^/]+$/, ["start_at", "end_at"]),
  makeGetRule(/^\/?referral_rebate\/events$/),
  makeGetRule(/^\/?referral_signup\/campaigns$/, FIELDS_TIME_RANGE),
  makePostRule(/^\/?referral_signup\/campaigns$/, ["period_start_at", "period_end_at"]),
  makePutRule(/^\/?referral_signup\/campaigns\/[^/]+$/, ["period_start_at", "period_end_at"]),
  makeGetRule(/^\/?referral_signup\/events$/, FIELDS_TIME_RANGE),
  makeGetRule(/^\/?report\/aurora_overview$/),
  makeGetRule(/^\/?report\/aurora_overview\/export$/),
  makeGetRule(/^\/?report\/agent-commission$/),
  makeGetRule(/^\/?report\/bet\/detail$/),
  makeGetRule(/^\/?report\/daily-overview$/),
  makeGetRule(/^\/?report\/daily-overview\/export$/),
  makeGetRule(/^\/?report\/member-bet\/detail$/),
  makeGetRule(/^\/?report\/product-bet\/detail$/),
  makeGetRule(/^\/?traffic\/report\/list$/),
  makeGetRule(/^\/?traffic\/report\/list\/export$/),
  makeGetRule(/^\/?wager\/list$/),
  makeGetRule(/^\/?wager\/list\/export$/),
  makeGetRule(/^\/?wallet_trans\/list$/),
  makeGetRule(/^\/?warning\/setting\/log\/list$/, ["created_at"]),
  makeGetRule(/^\/?withdraw_entry\/history\/list$/),
  makeGetRule(/^\/?withdraw_entry\/list$/),
  makeGetRule(/^\/?withdraw_entry\/list\/export$/)
]

/** 依 request 的 method + path 回傳需轉 RFC3339 的欄位名稱；無匹配則回傳空陣列 */
export function findTimeFieldList(config: AxiosRequestConfig): string[] {
  const method = (config.method || "get").toLowerCase() as HttpMethod
  const url = config.url || ""
  const path = url.split("?")[0]

  const rule = TIME_FIELD_RULES.find((r) => r.method === method && r.pathPattern.test(path))
  return rule ? [...rule.fields] : []
}
