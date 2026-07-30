import { Enums, I18nKeys } from "@/utils/constants/gameType"

/**
 * 根據遊戲類型枚舉值獲取對應的 i18n key
 * @param gameType 遊戲類型枚舉值
 * @returns i18n key，如果沒有匹配則返回 "common.unknow"
 */
export function useGameType() {
  const getGameTypeI18nKey = (gameType: Enums): string => {
    return I18nKeys[gameType] || "common.unknow"
  }

  return {
    getGameTypeI18nKey
  }
}

