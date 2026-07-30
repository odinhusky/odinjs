export enum Enums {
  // 集成線1
  GSCP = 1,

  // 集成線2
  YF = 2
}

/** GameLobby 路由預設集成線（目前平台僅使用 GSCP） */
export const Default = Enums.GSCP

export function resolveLobbyIntegrationId(integrationId?: number | null): Enums {
  if (integrationId != null && !Number.isNaN(integrationId) && integrationId in Enums) {
    return integrationId as Enums
  }

  return Default
}
