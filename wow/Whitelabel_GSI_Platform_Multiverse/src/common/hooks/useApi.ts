import { Notify } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useLanguageStore } from "src/stores/languageStore"
import { ERROR_CODE_TYPE, MAYA_ERROR_CODE_TYPE } from "src/common/utils/constants"
import { handleSessionIdleTimeout } from "src/common/composables/useSessionIdleTimeout"
import { ref } from "vue"
import { router } from "src/router/index"
import genMayaErrorMsg from "src/common/utils/genMayaErrorMsg"
import { useI18n } from "vue-i18n"

export interface UseApiReturnType<T> {
  /** apiFunction 回傳的資料 */
  data: T

  /** 錯誤代碼 {Number} */
  code: number

  /** 錯誤訊息 {String} */
  msg?: string

  /** 是否呼叫成功 {Boolean} */
  status: boolean

  /** 第三方或額外包含的 error code */
  excode?: string
}

/**
 * `useApi` 在 `status === false` 時仍會 resolve（並已由 `useApi` 內處理 Notify 等），
 * 若要在 TanStack Query `queryFn` 等情境標示失敗，請用此函式：成功回傳 `data`，失敗則 `throw`。
 *
 * @param res `await useApi(...)` 的回傳值
 * @param contextLabel 選填，用於預設錯誤訊息前綴（例如 `inbox list` → `inbox list failed (123)`）
 */
export function unwrapUseApiData<T>(res: UseApiReturnType<T>, contextLabel?: string): T {
  if (!res.status) {
    const codePart = res.code != null ? ` (${res.code})` : ""
    const fallback =
      contextLabel != null && contextLabel !== ""
        ? `${contextLabel} failed${codePart}`
        : `request failed${codePart}`
    throw new Error(res.msg || fallback)
  }
  return res.data
}

type Unpacked<T> = T extends Promise<infer U> ? U : T

/**
 * 立即執行的hook(IIFE)，用於呼叫api
 *
 * @param apiFunction 欲呼叫的API
 * @param payload 請求參數
 * @param options 選填設定；`silent` 為 true 時不顯示全域錯誤 toast（仍會保留 auth reset 等副作用），
 *                由呼叫端自行處理錯誤提示
 *
 */
export async function useApi<T extends (...args: any) => Promise<any>>(
  apiFunction: T,
  payload?: Parameters<T>[0],
  options?: { silent?: boolean }
): Promise<UseApiReturnType<Unpacked<ReturnType<T>>>> {
  const data = ref<Unpacked<ReturnType<T>>>()
  const code = ref(0)
  const excode = ref<string | undefined>()
  const msg = ref<string | undefined>()
  const status = ref<boolean>(false)

  // silent 模式：抑制全域錯誤 toast，交由呼叫端自行處理
  const notify = (opts: Parameters<typeof Notify.create>[0]) => {
    if (options?.silent) {
      return
    }
    Notify.create(opts)
  }

  // call API
  await (async () => {
    try {
      const response = await apiFunction(payload)
      data.value = response.data
      code.value = response.code
      msg.value = response.msg
      status.value = response.status === true

      if (status.value) {
        return
      }

      switch (response.code) {
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_EXPIRED:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_PARSE_FAILED:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_USER_NOT_FOUND:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND:
        case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_INVALID_TOKEN:
          notify({
            type: "negative",
            position: "top",
            message:
              $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string) ||
              `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
            icon: "warning",
            timeout: 1000
          })
          const { reset } = useAuth()
          reset()
          // 因需要重新觸發beforeEach，判斷各版型沒有token去哪
          router.go(0)
          break

        case ERROR_CODE_TYPE.Enums.CORE_SESSION_IDLE_TIMEOUT:
          handleSessionIdleTimeout({
            message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string),
            fallbackMessage: `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
            resetAuth: () => useAuth().reset()
          })
          break

        // 特殊代碼判斷，不要顯示錯誤訊息
        case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
        case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NICKNAME_REACH_MAX:
        case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NOT_FOUND:
        case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
        case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_SUB_TIME_SETTING:
        case ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED:
          break

        case ERROR_CODE_TYPE.Enums.A_INSUFFICIENT_BALANCE:
          notify({
            type: "negative",
            position: "top",
            message:
              $t('error_message.A_INSUFFICIENT_BALANCE') ||
              `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
            icon: "warning",
            timeout: 1000
          })
          break
        // Maya的error code時，判斷錯誤訊息
        case ERROR_CODE_TYPE.Enums.P_EXTERNAL_ERROR_MAYA:
          excode.value = response.excode
          notify({
            type: "negative",
            position: "top",
            message: genMayaErrorMsg({
              excode: response.excode
            }),
            icon: "warning",
            timeout: 1000
          })
          break

        case ERROR_CODE_TYPE.Enums.CORE_SEARCH_RANGE_EXCEED:
          const regex = /(\d+)/
          const match = response.msg?.match(regex)
          const limitDays = match ? parseInt(match[1], 10) : null
          notify({
            type: "negative",
            position: "top",
            message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string, {
              limitDays
            }),
            icon: "warning",
            timeout: 1000
          })
          break

        case ERROR_CODE_TYPE.Enums.BAD_REQUEST:
          if (response.msg === "缺少必要的欄位 nickname") {
            notify({
              type: "negative",
              position: "top",
              message: $t("websocket.without_nickname"),
              icon: "warning",
              timeout: 1000
            })
            break
          }

          if (response.msg === "缺少必要的欄位 email") {
            notify({
              type: "negative",
              position: "top",
              message: $t("common.validate.emailFormatError"),
              icon: "warning",
              timeout: 1000
            })
            break
          }

          if (globalThis.$te(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string)) {
            notify({
              type: "negative",
              position: "top",
              message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string),
              icon: "warning",
              timeout: 1000
            })
          } else {
            notify({
              type: "negative",
              position: "top",
              message: `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
              icon: "warning",
              timeout: 1000
            })
          }
          break

        // 統一顯示錯誤訊息
        default:
          if (globalThis.$te(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string)) {
            notify({
              type: "negative",
              position: "top",
              message: $t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string),
              icon: "warning",
              timeout: 1000
            })
          } else {
            // 遠端 i18n 尚未佈署對應翻譯時，改用本地後備文案（依當前語系），仍無則退回原始訊息
            const fallbackByLocale = ERROR_CODE_TYPE.LocalFallbackMessages[response.code as ERROR_CODE_TYPE.Enums]
            const currentLocale = useLanguageStore().lang
            const localFallback = fallbackByLocale
              ? fallbackByLocale[currentLocale] ?? fallbackByLocale.en
              : undefined

            notify({
              type: "negative",
              position: "top",
              message: localFallback ?? `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
              icon: "warning",
              timeout: 1000
            })
          }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
    }
  })()

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data: data.value!,
    code: code.value,
    excode: excode.value,
    msg: msg.value,
    status: status.value
  }
}
