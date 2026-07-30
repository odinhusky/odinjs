import { ref } from "vue"
import {
  launchGuestGame as launchGuestGameApi,
  type LaunchGuestGameParamsType,
  type LaunchGuestGameResponseType
} from "@shared-lib/api/apiFunctions/game_launchGuestGame"
import type { ApiResponse } from "@shared-lib/api/types"

export function useLaunchGuestGame() {
  const isPending = ref(false)
  const error = ref<Error | null>(null)

  const launch = async (params: LaunchGuestGameParamsType) => {
    isPending.value = true
    error.value = null

    try {
      return (await launchGuestGameApi(params)) as ApiResponse<LaunchGuestGameResponseType>
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Failed to launch guest game")
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
