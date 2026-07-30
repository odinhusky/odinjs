import { get, post } from "@/utils/request"

export interface CacheMaster {
  id: number
  agent_code: string
}

export interface CacheAgent {
  id: number
  agent_code: string
  display_name: string
  layer_id: number
  enabled: boolean
  children: CacheAgent[]
}

export interface ClearCacheParams {
  master_id: number
  cache_type: "frontend" | "backend"
  target_agent_code?: string
}

export const getCacheMasters = () => {
  return get<{ masters: CacheMaster[] }>(
    "/cache-management/masters",
    {},
    {
      name: "getCacheMasters"
    }
  )
}

export const getCacheAgents = (masterId: number) => {
  return get<{ agents: CacheAgent[] }>(
    `/cache-management/masters/${masterId}/agents`,
    {},
    {
      name: "getCacheAgents"
    }
  )
}

export const clearCache = (params: ClearCacheParams) => {
  return post<{ master_agent_code: string }>("/cache-management/clear", params, {
    name: "clearCache"
  })
}

/**
 * 代理端清緩存（只清當前登入站，後端用 JWT 代理身分決定）
 * POST /v1/agent/cache-management/clear
 */
export const clearAgentCache = (cacheType: "frontend" | "backend") => {
  return post<{ target_agent_code: string }>(
    "/cache-management/clear",
    { cache_type: cacheType },
    {
      name: "clearAgentCache"
    }
  )
}
