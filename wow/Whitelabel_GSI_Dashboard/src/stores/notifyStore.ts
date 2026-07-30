import { defineStore } from "pinia"

export const useNotifyStore = defineStore("notifyStore", {
  state: () => {
    return {
      newPendingTransactions: false as boolean
    }
  },
  actions: {
    updateNewPendingTransactions(status: boolean) {
      this.newPendingTransactions = status
    }
  },
  persist: true
})
