import { defineStore } from "pinia"
import { ref } from "vue"
import type { GetUserWalletListResponseType } from "@shared-lib/api/apiFunctions/userInfo_getUserWalletList"

export const useWalletStore = defineStore("wallet", () => {
  const walletList = ref<GetUserWalletListResponseType>([])

  function setWalletList(data: GetUserWalletListResponseType) {
    walletList.value = data
  }

  function clearWalletList() {
    walletList.value = []
  }

  return {
    walletList,
    setWalletList,
    clearWalletList
  }
})
