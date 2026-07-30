export const REFERRAL_REBATE_ALL_GAME_TYPE = 0

export const REFERRAL_REBATE_TARGET = {
  ALL: 1,
  MEMBER: 2,
  AGENT: 3
} as const

export type ReferralRebateTarget = (typeof REFERRAL_REBATE_TARGET)[keyof typeof REFERRAL_REBATE_TARGET]

export interface ReferralRebateDateRange {
  from: string
  to: string
}

export interface BuildReferralRebateStatementParamsInput {
  currencyId: number
  account?: string
  gameType?: number
  dateRange: ReferralRebateDateRange
  page: number
  size: number
}

export interface BuildReferralRebateEventDetailParamsInput {
  eventId: number
  currencyId: number
  account?: string
  gameType?: number
  page: number
  size: number
}

export interface BuildReferralRebateEventsParamsInput {
  currencyId: number
  dateRange: ReferralRebateDateRange
  page: number
  size: number
}

const toDatePart = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

const normalizeAccount = (account?: string) => {
  const value = account?.trim() ?? ""
  return value || undefined
}

const normalizeAccountForCurrentStatement = (account?: string) => account?.trim() ?? ""

const shouldSendGameType = (gameType?: number) => {
  return gameType !== undefined && gameType !== REFERRAL_REBATE_ALL_GAME_TYPE
}

export const canAccessReferralRebate = (target: ReferralRebateTarget | undefined, isMemberAgent: boolean) => {
  if (target === REFERRAL_REBATE_TARGET.ALL) return true
  if (target === REFERRAL_REBATE_TARGET.MEMBER) return !isMemberAgent
  if (target === REFERRAL_REBATE_TARGET.AGENT) return isMemberAgent
  return false
}

export const getInitialReferralRebateDateRange = (baseDate = new Date()): ReferralRebateDateRange => ({
  from: toDatePart(addDays(baseDate, -7)),
  to: toDatePart(baseDate)
})

export const getReferralRebateOffset = (page: number, size: number) => {
  return Math.max(page - 1, 0) * size
}

export const buildReferralRebateStatementParams = ({
  currencyId,
  account,
  gameType,
  dateRange,
  page,
  size
}: BuildReferralRebateStatementParamsInput) => {
  const params: {
    currency_id: number
    account?: string
    game_type?: number
    start_time?: string
    end_time?: string
    offset: number
    size: number
  } = {
    currency_id: currencyId,
    start_time: dateRange.from,
    end_time: dateRange.to,
    offset: getReferralRebateOffset(page, size),
    size
  }

  params.account = normalizeAccountForCurrentStatement(account)
  if (shouldSendGameType(gameType)) params.game_type = gameType

  return params
}

export const buildReferralRebateEventsParams = ({
  currencyId,
  dateRange,
  page,
  size
}: BuildReferralRebateEventsParamsInput) => ({
  currency_id: currencyId,
  start_time: dateRange.from,
  end_time: dateRange.to,
  offset: getReferralRebateOffset(page, size),
  size
})

export const buildReferralRebateEventDetailParams = ({
  eventId,
  currencyId,
  account,
  gameType,
  page,
  size
}: BuildReferralRebateEventDetailParamsInput) => {
  const query: {
    currency_id: number
    account?: string
    game_type?: number
    offset: number
    size: number
  } = {
    currency_id: currencyId,
    offset: getReferralRebateOffset(page, size),
    size
  }

  const normalizedAccount = normalizeAccount(account)
  if (normalizedAccount) query.account = normalizedAccount
  if (shouldSendGameType(gameType)) query.game_type = gameType

  return {
    path: { event_id: eventId },
    query
  }
}
