import { keepPreviousData, useMutation, useQuery } from "@tanstack/vue-query"
import {
  memberMessengerCompose,
  memberMessengerInbox,
  memberMessengerInboxDetail,
  memberMessengerOutbox,
  memberMessengerOutboxCloseThread,
  memberMessengerOutboxDetail,
  memberMessengerOutboxReply,
} from "src/api/memberMessenger"
import type {
  BaseList,
  MemberMessengerComposeRequest,
  MemberMessengerInboxDetail,
  MemberMessengerInboxDetailView,
  MemberMessengerInboxList,
  MemberMessengerInboxRequest,
  MemberMessengerOutboxList,
  MemberMessengerOutboxReplyPayload,
  MemberMessengerOutboxRequest,
  MemberMessengerTranslation,
} from "src/api/memberMessenger.type"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { unwrapUseApiData, useApi } from "src/common/hooks/useApi"
import { MemberMessengerStatus, OUTBOX_ROW_STATUS_LABEL_KEY } from "src/common/utils/constants/memberMessenger"
import type { MaybeRef } from "vue"
import { computed, toValue } from "vue"
import type { ComposerTranslation } from "vue-i18n"

/** 會員站內信列表每頁筆數 */
export const MEMBER_MESSENGER_ROWS_PER_PAGE = 10

export const memberMessengerQueryKeys = {
  all: ["memberMessenger"] as const,
  inbox: () => [...memberMessengerQueryKeys.all, "inbox"] as const,
  inboxList: (params: MemberMessengerInboxRequest) => [...memberMessengerQueryKeys.inbox(), "list", params] as const,
  inboxDetail: (id: number) => [...memberMessengerQueryKeys.inbox(), "detail", id] as const,
  outbox: () => [...memberMessengerQueryKeys.all, "outbox"] as const,
  outboxList: (params: MemberMessengerOutboxRequest) => [...memberMessengerQueryKeys.outbox(), "list", params] as const,
  outboxDetail: (id: number) => [...memberMessengerQueryKeys.outbox(), "detail", id] as const,
}

/** 與 MemberMessenger 列表 Panel（表格／手機卡）列資料一致 */
export type MemberMessengerPanelRow = {
  id: number
  title: string
  status: string
  statusType: string
  time: string
}

/** 列表 API `BaseList` 映射後給畫面使用的視圖 */
export type MemberMessengerListView = {
  rows: MemberMessengerPanelRow[]
  pagination: { offset: number; size: number; total: number }
}

type MessengerListData = BaseList<MemberMessengerInboxList | MemberMessengerOutboxList>

type MessengerListApiItem = {
  id?: number
  message_id?: number
  subject?: string
  subject_key?: string
  subjects?: { lang: string; subject: string }[]
  last_msg_at?: string
  published_at?: string
  view_status?: number
  status?: number
  is_read?: boolean
}

function normalizeMessengerLang(lang: string): string {
  return lang.trim().toLowerCase()
}

function resolveMessengerTranslation<T extends MemberMessengerTranslation>(
  translations: T[] | undefined,
  locale: string
): T | undefined {
  if (!Array.isArray(translations) || translations.length === 0) return undefined

  const byLang = new Map(translations.map((item) => [normalizeMessengerLang(item.lang), item]))
  return (
    byLang.get(normalizeMessengerLang(locale)) ||
    byLang.get("en") ||
    translations[0]
  )
}

function resolveListItemSubject(row: MessengerListApiItem, locale: string, t: ComposerTranslation): string {
  const subjectKey = row.subject_key?.trim()
  if (subjectKey) return t(subjectKey)

  const legacy = row.subject?.trim()
  if (legacy) return legacy

  const subjects = row.subjects
  if (!Array.isArray(subjects) || subjects.length === 0) return ""

  const localeKey = normalizeMessengerLang(locale)
  const byLang = new Map(
    subjects.map((item) => [normalizeMessengerLang(item.lang), item.subject?.trim() ?? ""])
  )

  return (
    byLang.get(localeKey) ||
    byLang.get("en") ||
    subjects.map((item) => item.subject?.trim()).find(Boolean) ||
    ""
  )
}

const STATUS_TYPE_BY_ENUM: Partial<Record<MemberMessengerStatus, string>> = {
  [MemberMessengerStatus.Unread]: "unread",
  [MemberMessengerStatus.Read]: "read",
  [MemberMessengerStatus.Closed]: "closed",
}

function resolveViewStatus(row: MessengerListApiItem): MemberMessengerStatus {
  const fromView = row.view_status
  if (fromView !== undefined && fromView !== null && !Number.isNaN(Number(fromView))) {
    const n = Number(fromView) as MemberMessengerStatus
    if (n === MemberMessengerStatus.Unread || n === MemberMessengerStatus.Read || n === MemberMessengerStatus.Closed) {
      return n
    }
  }
  const legacyStatus = row.status
  if (legacyStatus !== undefined && legacyStatus !== null && !Number.isNaN(Number(legacyStatus))) {
    const n = Number(legacyStatus) as MemberMessengerStatus
    if (n === MemberMessengerStatus.Unread || n === MemberMessengerStatus.Read || n === MemberMessengerStatus.Closed) {
      return n
    }
  }
  if (row.is_read === true) return MemberMessengerStatus.Read
  return MemberMessengerStatus.Unread
}

function listItemTimestamp(row: MessengerListApiItem): string {
  return String(row.last_msg_at ?? row.published_at ?? "")
}

function mapListItemToPanelRow(
  row: MessengerListApiItem,
  idx: number,
  t: ComposerTranslation,
  formatDateTime: (input: unknown) => string,
  locale: string
): MemberMessengerPanelRow {
  const id = Number(row.id ?? row.message_id ?? idx)
  const statusValue = resolveViewStatus(row)
  const labelKey = OUTBOX_ROW_STATUS_LABEL_KEY[statusValue] ?? "member.messenger.unread"

  return {
    id,
    title: resolveListItemSubject(row, locale, t),
    status: t(labelKey),
    statusType: STATUS_TYPE_BY_ENUM[statusValue] || "unread",
    time: formatDateTime(listItemTimestamp(row)),
  }
}

function mapListToPanelRows(
  list: MessengerListApiItem[] | undefined | null,
  t: ComposerTranslation,
  formatDateTime: (input: unknown) => string,
  locale: string
): MemberMessengerPanelRow[] {
  if (!Array.isArray(list)) return []
  return list.map((row, idx) => mapListItemToPanelRow(row, idx, t, formatDateTime, locale))
}

/** 收件匣詳情依 `locale` 解析 `translations`（`queryFn` 回傳原始資料後在元件 `computed` 使用） */
export function mapInboxDetailToView(
  detail: MemberMessengerInboxDetail | null | undefined,
  locale: string,
  t: ComposerTranslation
): MemberMessengerInboxDetailView | undefined {
  if (!detail) return undefined

  const translation = resolveMessengerTranslation(detail.translations, locale)
  const subjectKey = detail.subject_key?.trim()
  const contentKey = detail.content_key?.trim()
  const content = contentKey ? t(contentKey, detail.template_params ?? {}) : translation?.content ?? ""

  return {
    id: detail.id,
    subject: subjectKey ? t(subjectKey) : translation?.subject?.trim() ?? "",
    content: content.replace(/<br\s*\/?\s*>/gi, "\n"),
    images: translation?.images ?? [],
    published_at: detail.published_at,
    sender_name: detail.sender_name,
  }
}

/** 將列表 API 原始 `BaseList` 轉成表格列 + 分頁（依 `locale` 解析 inbox `subjects`） */
export function mapMemberMessengerListToView(
  data: MessengerListData | null | undefined,
  locale: string,
  t: ComposerTranslation,
  formatDateTime: (input: unknown) => string
): MemberMessengerListView | undefined {
  if (!data) return undefined
  return {
    rows: mapListToPanelRows(data.list as MessengerListApiItem[], t, formatDateTime, locale),
    pagination: data.pagination,
  }
}

type ListQueryOptions = {
  enabled?: MaybeRef<boolean>
}

/**
 * 收件匣訊息詳情（`GET .../inbox/{id}`）。
 */
export function useInboxMessage(id: MaybeRef<number>) {
  return useQuery({
    queryKey: computed(() => memberMessengerQueryKeys.inboxDetail(toValue(id))),
    queryFn: async () => unwrapUseApiData(await useApi(memberMessengerInboxDetail, toValue(id)), "inbox detail"),
    enabled: () => Number.isFinite(toValue(id)) && toValue(id) > 0,
  })
}

/**
 * 寄件匣訊息詳情（`GET .../outbox/{id}`）。
 */
export function useOutboxMessage(id: MaybeRef<number>) {
  return useQuery({
    queryKey: computed(() => memberMessengerQueryKeys.outboxDetail(toValue(id))),
    queryFn: async () => unwrapUseApiData(await useApi(memberMessengerOutboxDetail, toValue(id)), "outbox detail"),
    enabled: () => Number.isFinite(toValue(id)) && toValue(id) > 0,
  })
}

/**
 * 寄件匣新訊息（`POST .../messages/outbox`）。
 */
export function useOutboxMessageCompose() {
  return useMutation({
    mutationFn: async (params: MemberMessengerComposeRequest) =>
      unwrapUseApiData(await useApi(memberMessengerCompose, params), "outbox compose"),
  })
}

/**
 * 關閉寄件匣對話串（`POST .../outbox/{id}/close`）。
 */
export function useOutboxMessageClose() {
  return useMutation({
    mutationFn: async (id: number) =>
      unwrapUseApiData(await useApi(memberMessengerOutboxCloseThread, id), "outbox close"),
  })
}

/**
 * 寄件匣對話回覆（`POST .../outbox/{id}/reply`）。
 */
export function useOutboxMessageReply() {
  return useMutation({
    mutationFn: async (payload: MemberMessengerOutboxReplyPayload) =>
      unwrapUseApiData(await useApi(memberMessengerOutboxReply, payload), "outbox reply"),
  })
}

/**
 * 收件匣列表：`queryFn` 回傳原始 `BaseList`；畫面以 `mapMemberMessengerListToView` + `computed` 做映射。
 */
export function useInboxMessages(params: MaybeRef<MemberMessengerInboxRequest>, options: ListQueryOptions = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: computed(() => memberMessengerQueryKeys.inboxList({ ...toValue(params) })),
    queryFn: async () =>
      unwrapUseApiData(await useApi(memberMessengerInbox, toValue(params)), "inbox list") as BaseList<MemberMessengerInboxList>,
    placeholderData: keepPreviousData,
    enabled: () => Boolean(toValue(enabled)),
  })
}

/**
 * 寄件匣列表：`queryFn` 回傳原始 `BaseList`；畫面以 `mapMemberMessengerListToView` + `computed` 做映射。
 */
export function useOutboxMessages(params: MaybeRef<MemberMessengerOutboxRequest>, options: ListQueryOptions = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: computed(() => memberMessengerQueryKeys.outboxList({ ...toValue(params) })),
    queryFn: async () =>
      unwrapUseApiData(await useApi(memberMessengerOutbox, toValue(params)), "outbox list") as BaseList<MemberMessengerOutboxList>,
    placeholderData: keepPreviousData,
    enabled: () => Boolean(toValue(enabled)),
  })
}
