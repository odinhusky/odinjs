import { defineStore } from "pinia"
import { ref } from "vue"
import type { GetFavoriteGameListResponseType } from "@shared-lib/api/apiFunctions/game_getFavoriteGameList"

export const useFavoriteGameStore = defineStore("favoriteGame", () => {
  const favoriteGameList = ref<GetFavoriteGameListResponseType>([])

  function setFavoriteGameList(data: GetFavoriteGameListResponseType) {
    favoriteGameList.value = data
  }

  function clearFavoriteGameList() {
    favoriteGameList.value = []
  }

  return {
    favoriteGameList,
    setFavoriteGameList,
    clearFavoriteGameList
  }
})
