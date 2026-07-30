/**
 * 根據外部傳入的語系，從路徑物件中取得對應的 Path
 * @param imagesPathObj - API 回傳的語系圖片路徑物件
 * @param currentLocale - 目前的語系字串 (例如來自 useI18n 的 locale.value)
 * @returns 回傳對應語系的圖片路徑，若找不到則回傳空字串
 */
export const getLocaleImgPath = (
  imagesPathObj: Record<string, string> | undefined | null,
  currentLocale: string
): string => {
  if (!imagesPathObj || !currentLocale) return ""

  // 統一轉為小寫以匹配 API 格式 (如 zh-tw)
  const targetLang = currentLocale.toLowerCase()

  // 找不到直接回傳空字串
  return imagesPathObj[targetLang] || ""
}
