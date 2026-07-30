/**
 * 會員站內信相關常數：列表篩選狀態、頁籤值等。
 */

// --- Tab（`q-tab` / `q-tab-panel` `name` 與 {@link PanelBase} `tab` prop）---

export enum MemberMessengerTab {
  Inbox = "inbox",
  Outbox = "outbox",
}

/**
 * 由宿主頁（會員站內信頁）`provide`，讓 MemberMessenger 以不同 route name
 *（如 `member/inbox`、`member/outbox`）切換分頁。
 */
export type MemberMessengerRouteNames = {
  inbox: string
  outbox: string
}

// --- 列表篩選 status（inbox / outbox 查詢參數共用數值語意）---

/**
 * 「全部」一律為 0；outbox 額外支援「對話關閉」。
 */
export enum MemberMessengerStatus {
  /** 全部 */
  All = 0,
  /** 未讀 */
  Unread = 1,
  /** 已讀 */
  Read = 2,
  /** 對話關閉（僅 outbox） */
  Closed = 3,
}

export type MemberMessengerStatusFilterOptionDef = {
  value: MemberMessengerStatus
  labelKey: string
}

/** 收件匣篩選選項（不含對話關閉） */
export const INBOX_STATUS_FILTER_OPTIONS: MemberMessengerStatusFilterOptionDef[] = [
  { value: MemberMessengerStatus.All, labelKey: "member.messenger.all" },
  { value: MemberMessengerStatus.Unread, labelKey: "member.messenger.unread" },
  { value: MemberMessengerStatus.Read, labelKey: "member.messenger.read" },
]

/** 寄件匣篩選選項 */
export const OUTBOX_STATUS_FILTER_OPTIONS: MemberMessengerStatusFilterOptionDef[] = [
  { value: MemberMessengerStatus.All, labelKey: "member.messenger.all" },
  { value: MemberMessengerStatus.Unread, labelKey: "member.messenger.unread" },
  { value: MemberMessengerStatus.Read, labelKey: "member.messenger.read" },
  { value: MemberMessengerStatus.Closed, labelKey: "member.messenger.closed" },
]

/** 列表單筆 {@link MemberMessengerOutboxItem.view_status}／inbox 同源欄位 對應狀態文案 i18n key */
export const OUTBOX_ROW_STATUS_LABEL_KEY: Partial<Record<MemberMessengerStatus, string>> = {
  [MemberMessengerStatus.Unread]: "member.messenger.unread",
  [MemberMessengerStatus.Read]: "member.messenger.read",
  [MemberMessengerStatus.Closed]: "member.messenger.closed",
}

/**
 * 寄件匣詳情 {@link MemberMessengerOutboxReply} `sender_type`（API 數值）。
 * `1` 為玩家自身、`2` 為管理員（站長）。
 */
export enum MemberMessengerReplySenderType {
  Player = 1,
  Admin = 2,
}

/**
 * MemberMessenger 色彩：使用與 okbet _variable 相同的 CSS 變數名（--neutral-*、--primary-*、--emotional-* 等）。
 * 亮暗版型在 $light-base / $dark-base 定義同名變數，由 body--light / body--dark 切換即可。
 */
/** inbox / outbox 列表狀態 chip 樣式（與列資料 statusType 對齊；色票由各 template member-messenger scss 定義） */
export function getMessengerListStatusTagClasses(statusType: string) {
  const base = "status-tag member-messenger-status-tag"
  switch (statusType) {
    case "unread":
      return `${base} member-messenger-status-tag--unread`
    case "read":
      return `${base} member-messenger-status-tag--read`
    case "closed":
      return `${base} member-messenger-status-tag--closed`
    default:
      return base
  }
}
