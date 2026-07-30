import { ref } from "vue"
import {
  launchGame as launchGameApi,
  type LaunchGameParamsType,
  type LaunchGameResponseType
} from "@shared-lib/api/apiFunctions/game_launchGame"
import type { ApiResponse } from "@shared-lib/api/types"

export function useLaunchGame() {
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const launch = async (params: LaunchGameParamsType) => {
    isPending.value = true
    error.value = null

    try {
      return (await launchGameApi(params)) as ApiResponse<LaunchGameResponseType>
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Failed to launch game")
      throw error.value
    } finally {
      isPending.value = false
    }
  }

  return {
    launch,
    isPending,
    error
  }
}
