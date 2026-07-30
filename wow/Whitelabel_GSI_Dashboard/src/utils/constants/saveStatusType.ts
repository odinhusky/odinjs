export enum Enums {
  /** 審核中 */
  UnderReview = 1,
  /** 成功 */
  Success,
  /** 失敗 */
  Fail,
  /** 失敗-標籤阻擋 */
  FailedTagBlocking,
  /** 鎖單 */
  ORDERLOCKET,
  /** 會員取消 */
  MEMBERCANCELL,
  /** 風控中 */
  RISKCONTROLPROGRESS,
  /** 風控鎖定 */
  RISKLOCKED,
  /** 等待回調 */
  WAITINGFORBACK
}

export const I18nKeys: Record<Enums | 0, string> = {
  /** 未定義(全部) */
  0: "common.all",
  [Enums.UnderReview]: "save_status_type.under_review",
  [Enums.Success]: "save_status_type.success",
  [Enums.Fail]: "save_status_type.fail",
  [Enums.FailedTagBlocking]: "save_status_type.failed_tag_blocking",
  [Enums.ORDERLOCKET]: "save_status_type.order_locked",
  [Enums.MEMBERCANCELL]: "save_status_type.membership_cancelled",
  [Enums.RISKCONTROLPROGRESS]: "save_status_type.risk_control_progress",
  [Enums.RISKLOCKED]: "save_status_type.risk_control_locked",
  [Enums.WAITINGFORBACK]: "save_status_type.waiting_for_callback"
}
