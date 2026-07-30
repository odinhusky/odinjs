import { GAME_TYPE } from "src/common/utils/constants"

export const SPORTBET_PRODUCT_LOBBY_USERNAME = "sportbet"
export const SPORTBET_PRODUCT_LOBBY_GAME_TYPE = GAME_TYPE.Enums.SPORTBOOK

export function canAccessSportbetProductLobby(username?: string | null): boolean {
  return username === SPORTBET_PRODUCT_LOBBY_USERNAME
}

export function isSportbetRestrictedProductLobby(gameType: number): boolean {
  return gameType === SPORTBET_PRODUCT_LOBBY_GAME_TYPE
}

export function canAccessProductLobbyByUsername(gameType: number, username?: string | null): boolean {
  if (!isSportbetRestrictedProductLobby(gameType)) return true
  return canAccessSportbetProductLobby(username)
}
