export type EmptyType = null

export type TimeStringType = string
// 定義基本的 ISO 8601 格式 (包含時區偏移)
// type ISODateString = `${number}-${number}-${number}T${number}:${number}:${number}${'+' | '-'}${number}:${number}`;

export interface Pagination {
  offset: number
  size: number
  total: number
}

export interface PaginationWithPage {
  page: number
  offset: number
  size: number
  total: number
}

export interface PaginatedList<T> {
  list: T[]
  offset: number
  size: number
  total: number
}

export interface BaseList<T> {
  list: T
  pagination: Pagination
}

export interface BaseListWithPage<T> {
  list: T
  pagination: PaginationWithPage
}

export interface BaseListType {
  label: string
  value: string | number
}

export interface BaseCurrencyIDDurationType {
  currency_id: number
  start_time: TimeStringType
  end_time: TimeStringType
}

export interface BaseCurrencyIDDurationWithOffsetAndSizeType extends BaseCurrencyIDDurationType {
  offset: number
  size: number
}
