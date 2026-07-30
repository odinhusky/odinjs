import * as Response from "src/api/response.type"

export type Events = {
  /** 顯示/隱藏篩選器 */
  toggleVisibles: () => void

  /**
   * 控制Stepper元件的步驟
   * @param arrow (true: 下一步; false: 上一步)
   * @returns
   */
  nextPrevSteps: (arrow: boolean) => void

  /** 禮金明細新增彈窗 */
  handleAddGiftDetailShow: (show: boolean) => void

  /** 禮金明細新增完成 */
  handleAddGiftDetailFinish: () => void

  /** AI銷售助手事件 */
  handleAIHelperEvent: (data: Response.AIHelperEvent) => void

  /** AI事件 - 完成禮金明細 */
  handleAIAddGiftDetail: (data: Response.AICompleteGiftDetail) => void

  /** 邀請輪盤次數編輯彈窗 */
  handleEditInvitationRouletteTimesShow: (data: { show: boolean; type: "add" | "remove" }) => void

  /** 邀請輪盤次數編輯彈窗關閉 */
  handleEditInvitationRouletteTimesClose: (data: { closed: boolean }) => void

  /** 免費旋轉次數新增彈窗 */
  handleAddFreeRoundTimesShow: (show: boolean) => void

  /** 免費旋轉次數新增完成 */
  handleAddFreeRoundTimesFinish: () => void

  /** AI事件 - 完成優惠設定 */
  handleAIAddPromotionDetail: (data: Response.AICompletePromotionDetail) => void

  /** 增加代理額度 */
  handleIncreaseAgentQuota: (data: Partial<Response.MemberItem> & { currencyId: number }) => void
}
