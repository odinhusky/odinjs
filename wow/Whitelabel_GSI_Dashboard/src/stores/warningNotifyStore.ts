import { defineStore } from "pinia"

export const useWarningNotifyStore = defineStore("warningNotifyStore", {
  state: () => {
    return {
      warningStatus: [] as number[]
    }
  },
  actions: {
    updateWarningStatue(id: number[]) {
      this.warningStatus = id
    }
  },
  persist: true
})
