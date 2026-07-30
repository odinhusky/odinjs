export enum Enums {
  /** 網站標題 */
  TITLE = "title",

  /**  網站描述 */
  DESCRIPTION = "description",

  /**  網站縮圖 */
  IMAGE = "image",

  /** 其他 */
  OTHER = "other"
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.TITLE]: "seo.website_title",
  [Enums.DESCRIPTION]: "seo.website_description",
  [Enums.IMAGE]: "seo.website_thumbnail",
  [Enums.OTHER]: "seo.other"
}

export const I18nPlaceholder: Record<Enums, string> = {
  [Enums.TITLE]: "common.please_enter_content",
  [Enums.DESCRIPTION]: "common.please_enter_content",
  [Enums.IMAGE]: "common.please_enter_the_image_url",
  [Enums.OTHER]: "common.please_enter_content"
}
