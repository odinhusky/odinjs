import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { containsAccountInfo, containsPersonalInfo, containsDomain } from "./checkUtils"

/**
 * 內容審查驗證 Composable
 * @description 禁言層級的內容檢查
 */
export function useContentValidation() {
  const { t: $t } = useI18n()
  const { accountInfo } = useUserInfo()
  console.log("!! accountInfo in useContentValidation:", accountInfo)

  /**
   * 驗證聊天內容
   * @returns [是否有效, 錯誤訊息]
   */
  function validateContent(content: string): [boolean, string] {
    const trimmed = content.trim()

    if (!trimmed) {
      return [false, $t("common.validate.requiredField") || "Please enter message content"] // 請輸入訊息內容
    }

    // 檢查帳號相關資訊
    if (containsAccountInfo(trimmed, accountInfo.value)) {
      return [
        false,
        $t("chat_room.content_error_hint_with_account_or_contact_info") ||
          "The information you entered contains account or personal information. Please re-enter it." // 您輸入的內容包含帳號或個資資訊，請重新輸入。
      ]
    }

    // 檢查個人資訊
    if (containsPersonalInfo(trimmed)) {
      return [
        false,
        $t("chat_room.content_error_hint_with_social_media_or_address") ||
          "The content you entered contains personal information. Please re-enter it." // 您輸入的內容包含個資資訊，請重新輸入。
      ]
    }

    // 檢查域名格式
    if (containsDomain(trimmed)) {
      return [
        false,
        $t("chat_room.content_error_hint_with_invalid_content") ||
          "The content you entered contains inappropriate promotional information. Please re-enter it." // 您輸入的內容包含不合格的宣傳資訊，請重新輸入。
      ]
    }

    return [true, ""]
  }

  /**
   * Quasar Input/Textarea 驗證規則
   */
  function getContentRules() {
    return [
      (val: string) => {
        const [isValid, errorMsg] = validateContent(val)
        return isValid || errorMsg
      }
    ]
  }

  return {
    validateContent,
    getContentRules,
    containsAccountInfo,
    containsPersonalInfo,
    containsDomain
  }
}
