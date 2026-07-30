export enum Enums {
  /** 全內容 */
  ALL_CONTENT = 1,

  /** 圖片 */
  IMAGES = 2,

  /** 跑馬燈 */
  MARQUEE = 3
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.ALL_CONTENT]: "announcement_display_type.show_full_content",
  [Enums.IMAGES]: "announcement_display_type.image_display",
  [Enums.MARQUEE]: "announcement_display_type.marquee"
}
