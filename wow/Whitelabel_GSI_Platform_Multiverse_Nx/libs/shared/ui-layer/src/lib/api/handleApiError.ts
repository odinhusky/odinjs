import type { ApiResponse, ErrorHandlerDependencies } from "@shared-lib/api/types"
import { genMayaErrorMsg } from "@shared-lib/utils/genMayaErrorMsg"
import * as ERROR_CODE_TYPE from "@shared-lib/constants/enums/errorCodeTypes"
import { ROUTE_PATH } from "@shared-lib/constants/routePath"

/** JWT 失效 reload 節流：同一次 session 內 10 秒內已 reload 過就不再 reload，改用 push login 避免無窮迴圈 */
const JWT_RELOAD_THROTTLE_KEY = "jwt_reload_at"
const JWT_RELOAD_THROTTLE_MS = 10_000

const JWT_AUTH_ERROR_CODES: Set<number> = new Set([
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_EXPIRED,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_PARSE_FAILED,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_USER_NOT_FOUND,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND,
  ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_INVALID_TOKEN
])

export const isJwtAuthErrorCode = (code: number | string | undefined): boolean => {
  if (code === undefined || code === null) return false
  return JWT_AUTH_ERROR_CODES.has(Number(code))
}

const isWithinReloadThrottle = () => {
  if (typeof window === "undefined") return false
  try {
    const last = window.sessionStorage.getItem(JWT_RELOAD_THROTTLE_KEY)
    if (!last) return false
    const diff = Date.now() - Number(last)
    return Number.isFinite(diff) && diff >= 0 && diff < JWT_RELOAD_THROTTLE_MS
  } catch {
    return false
  }
}

const markReloadAttempt = () => {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(JWT_RELOAD_THROTTLE_KEY, String(Date.now()))
  } catch {
    // 忽略 storage 寫入失敗
  }
}

/**
 * 給「直接呼叫 API 沒走 useApiQuery / useApiMutation」的地方用的 JWT 處理。
 * 若 response 是 JWT 失效錯誤碼：清 auth + 10 秒節流內 push login，否則整頁 reload。
 * 回傳 true 表示有觸發 JWT 處理（呼叫端可提早 return）。
 */
export const handleJwtAuthError = (
  response: { code?: number | string | null },
  deps: Pick<ErrorHandlerDependencies, "resetAuth" | "router">
): boolean => {
  if (!isJwtAuthErrorCode(response?.code as number | undefined)) return false

  const { resetAuth, router } = deps
  resetAuth()

  if (isWithinReloadThrottle()) {
    if (router.currentRoute.value.path !== ROUTE_PATH.LOGIN.PASSWORD) {
      router.replace(ROUTE_PATH.LOGIN.PASSWORD)
    }
  } else {
    markReloadAttempt()
    router.go(0)
  }
  return true
}

// 全域通知函示工具目前還沒有決定，先用 alert 代替
/**
 * 處理 API 錯誤訊息 (純函數版本)
 * @param response API 的原始回應
 * @param deps 從 Vue composable 傳入的依賴
 */
// TODO: type response 應該要明確定義 ApiResponse 而非
export function handleApiError(response: any, deps: ErrorHandlerDependencies) {
  const { t, te, resetAuth, router, notify } = deps

  const emitErrorMessage = (message: string, id: number) => {
    notify?.(message)
    console.warn({
      id,
      type: "negative",
      position: "top",
      message,
      icon: "warning",
      timeout: 1000
    })
  }

  const translatedMessage =
    t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string) ||
    `${response.msg}${response.code ? " (" + response.code + ")" : ""}`

  switch (response.code) {
    // --- Token 相關錯誤 (登出、重整) ---
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_EXPIRED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_PARSE_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_USER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_COMPARISON_ACCESS_TOKEN_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_GET_ENTRANCE_LAYER_FAILED:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_ENTRANCE_LAYER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.CORE_JWT_TOKEN_INVALID_TOKEN:
      emitErrorMessage(translatedMessage, 1)

      // JWT 失效共用處理（含節流 + reset auth + reload/push login）
      handleJwtAuthError(response, { resetAuth, router })
      break

    // --- 特殊代碼判斷 (靜默處理，不顯示錯誤訊息) ---
    case ERROR_CODE_TYPE.Enums.P_PHONE_EXIST:
    case ERROR_CODE_TYPE.Enums.P_LAUNCH_GAME_GSMD_OFFLINE:
    case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NICKNAME_REACH_MAX:
    case ERROR_CODE_TYPE.Enums.CHATROOM_MEMBER_NOT_FOUND:
    case ERROR_CODE_TYPE.Enums.P_USER_PREFERENCES_EXCLUSION:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_AMOUNT_LESSER_THAN_COLLECTION:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXIST_IN_SAME_TIME_RANGE:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_EXCEED_MAIN_TIME_SETTING:
    case ERROR_CODE_TYPE.Enums.P_CETNER_MEMBER_SELF_BET_RESTRICTION_COLLECTION_AMOUNT_MEET_LIMIT:
    case ERROR_CODE_TYPE.Enums.P_USER_AUTH_REQUIRED:
      break

    // --- Maya的error code時，判斷錯誤訊息 ---
    case ERROR_CODE_TYPE.Enums.P_EXTERNAL_ERROR_MAYA:
      emitErrorMessage(
        genMayaErrorMsg(
          {
            excode: response.excode
          },
          t
        ),
        2
      )
      break

    // --- 搜尋範圍錯誤 ---
    case ERROR_CODE_TYPE.Enums.CORE_SEARCH_RANGE_EXCEED: {
      const regex = /(\d+)/
      const match = response.msg?.match(regex)
      const limitDays = match ? parseInt(match[1], 10) : null
      emitErrorMessage(
        t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string, {
          limitDays
        }),
        3
      )
      break
    }
    // --- 統一顯示錯誤訊息 (預設) ---
    default:
      // 使用傳入的 te()
      if (te(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string)) {
        emitErrorMessage(t(ERROR_CODE_TYPE.I18nKeys[response.code as ERROR_CODE_TYPE.Enums] as string), 4)
      } else {
        emitErrorMessage(`${response.msg}${response.code ? " (" + response.code + ")" : ""}`, 5)
      }
  }
}
