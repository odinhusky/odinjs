import type { LaunchGameParamsType } from "@shared-lib/api/apiFunctions/game_launchGame"
import type { LaunchGameResponse } from "@shared-lib/api/commonTypes/gameTypes"
import type { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"

export const buildLaunchGamePayload = (params: {
  integrationId: number
  productCode: number
  typeId: number
  gameCode?: string
  currency?: string
  languageCode: number
  walletType?: WALLET_TYPE_ENUMS
}) => {
  const payload: LaunchGameParamsType = {
    is_v2: true,
    game_code: params.gameCode || "",
    game_type_id: params.typeId,
    integration_id: params.integrationId,
    product_code: params.productCode,
    platform: "web",
    currency: params.currency || "",
    language_code: params.languageCode
  }

  if (typeof params.walletType === "number") {
    payload.wallet_type = params.walletType
  }

  return payload
}

export const resolveGameTarget = (data?: LaunchGameResponse | null) => {
  const gameUrl = String(data?.game_url || "").trim()
  const gameContent = String(data?.game_content || "").trim()
  return {
    gameUrl,
    gameContent,
    target: gameUrl || gameContent
  }
}

export const openGameTarget = (params: { gameUrl: string; gameContent: string; pup?: boolean }) => {
  const { gameUrl, gameContent, pup = false } = params
  const target = gameUrl || gameContent
  if (!target || !process.client) return false

  if (pup) {
    window.open(target, "_blank", "noopener,noreferrer")
    return true
  }

  if (gameUrl) {
    window.location.href = gameUrl
    return true
  }

  const popup = window.open("", "_blank", "noopener,noreferrer")
  if (!popup) return false
  popup.document.open()
  popup.document.write(gameContent)
  popup.document.close()
  return true
}

export const sanitizeInternalPath = (path: string) => {
  if (!path) return ""
  if (!path.startsWith("/")) return ""
  if (path.startsWith("//")) return ""
  return path
}
