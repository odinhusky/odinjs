export interface IDialogConfig {
  /** 彈窗標頭 */
  dialogLabelI18nKey?: string

  /** 是否使用「送出、取消按鈕」 */
  useActions?: boolean

  /** 彈窗類型 */
  type?: DialogType

  /** 彈窗關閉按鈕 */
  showDialogCloseBtn?: boolean

  /** 標題列關閉按鈕 */
  showLabelCloseBtn?: boolean

  /** 送出的 Function */
  submitFunction?: () => void
}

export enum DialogType {
  /** 新增型彈窗 */
  ADD = 1,

  /** 編輯型彈窗 */
  EDIT = 2,

  /** yes/no型彈窗 */
  CONFIRM = 3,

  /** 查看型彈窗 */
  VIEW = 4
}
