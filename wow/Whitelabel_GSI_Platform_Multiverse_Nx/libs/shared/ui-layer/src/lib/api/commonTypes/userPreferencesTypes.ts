export interface GetBetLimitSettingItem {
  id: number
  begin_date: number
  end_date: number
  restrict_amount: string
  currency_id: number
}

export interface GetBetLimitResponseItem {
  id: number
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: string
  amount: string
  settings: GetBetLimitSettingItem[]
  expanded: boolean
}

export type GetBetLimitResponseList = GetBetLimitResponseItem[]
