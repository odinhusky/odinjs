import { defineStore } from "pinia"
import { ref } from "vue"
import type { GetGiftListResponseType } from "@shared-lib/api/apiFunctions/gift_getGiftList"

export const useGiftStore = defineStore("gift", () => {
  const giftList = ref<GetGiftListResponseType>([])

  function setGiftList(data: GetGiftListResponseType) {
    giftList.value = data
  }

  function clearGiftList() {
    giftList.value = []
  }

  return {
    giftList,
    setGiftList,
    clearGiftList
  }
})
