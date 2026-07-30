import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import {
  containsAccountInfo,
  has4ConsecutiveLetters,
  has4ConsecutiveDigits,
  containsSocialKeyword,
  containsPhoneNumber,
  containsNotOnlyLettersNumbersSpace
} from "./checkUtils"

/**
 * 暱稱驗證 Composable
 * @description 根據後端 Go 邏輯實作前端驗證規則
 */
export function useNicknameValidation() {
  const { accountInfo } = useUserInfo()
  const { t: $t } = useI18n()

  /**
   * 計算字串的字元數（Unicode aware）
   */
  function getCharCount(s: string): number {
    return Array.from(s).length
  }

  /**
   * 驗證暱稱
   * @returns [是否有效, 錯誤訊息]
   */
  function validateNickname(nickname: string): [boolean, string] {
    const trimmed = nickname.trim()
    const lower = trimmed.toLowerCase()

    // 長度檢查（12 個字元）
    const charCount = getCharCount(trimmed)
    if (charCount === 0) {
      return [false, $t("common.validate.requiredField") || "Nickname is required."] // 暱稱為必填
    }

    if (charCount > 12) {
      return [false, $t("chat_room.nickname_error_hint_with_maxLength") || "Nicknames can be up to 12 characters long."] // 暱稱最多 12 個字元
    }

    // 禁止社群平台字眼
    if (containsSocialKeyword(lower)) {
      return [false, $t("chat_room.content_error_hint_with_social_media_or_address")] // 您輸入的內容包含個資資訊，請重新輸入。
    }

    // 禁止域名格式（如 xxx.com）
    const domainRegex = /[a-z0-9-]+\.[a-z]{2,}/i
    if (domainRegex.test(lower)) {
      return [false, $t("chat_room.content_error_hint_with_domain_info")] // 不可包含域名資訊，請重新輸入
    }

    // 禁止電話格式
    // 台灣手機格式
    if (containsPhoneNumber(trimmed)) {
      return [false, $t("chat_room.nickname_error_hint_with_account_or_contact_info")] // 暱稱不可包含帳號或聯絡方式，請重新輸入
    }

    // 禁止連續 4 個字母或數字
    if (has4ConsecutiveLetters(trimmed)) {
      return [
        false,
        $t("chat_room.nickname_error_hint_with_series_char") || "nickname containing consecutive characters"
      ] // 暱稱包含連續字元
    }

    if (has4ConsecutiveDigits(trimmed)) {
      return [
        false,
        $t("chat_room.nickname_error_hint_with_series_char") || "nickname containing consecutive characters"
      ] // 暱稱包含連續字元
    }

    // 只允許文字、數字、空格（禁止特殊符號）
    // 使用 Unicode 屬性來匹配各種語言的字母
    if (containsNotOnlyLettersNumbersSpace(trimmed)) {
      return [
        false,
        $t("chat_room.nickname_error_hint_with_punctionMark") ||
          "Nicknames can only contain letters and numbers. Please re-enter."
      ] // 暱稱僅能使用文字與數字，請重新輸入
    }

    // 檢查帳號、推薦碼、UID、手機號碼
    if (containsAccountInfo(trimmed, accountInfo.value)) {
      return [
        false,
        $t("chat_room.nickname_error_hint_with_account_or_contact_info") || "暱稱不可包含帳號或聯絡方式，請重新輸入"
      ]
    }

    return [true, ""]
  }

  /**
   * Quasar Input 驗證規則
   */
  function getNicknameRules() {
    return [
      (val: string) => {
        const [isValid, errorMsg] = validateNickname(val)
        return isValid || errorMsg
      }
    ]
  }

  return {
    validateNickname,
    getNicknameRules,
    has4ConsecutiveLetters,
    has4ConsecutiveDigits,
    getCharCount
  }
}
