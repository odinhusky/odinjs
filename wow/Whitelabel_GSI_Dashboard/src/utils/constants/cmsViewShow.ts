export enum Enums {
  /** 不顯示 */
  HIDE = 0,

  /** 顯示 */
  SHOW
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.HIDE]: "edit_form.do_not_show",
  [Enums.SHOW]: "edit_form.show"
}
