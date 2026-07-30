import { defineStore } from "pinia"

export const useUserInfoStore = defineStore("userInfoStroe", {
  state: () => {
    return {
      generalAgentId: "",
      agentId: ""
    }
  },
  actions: {
    setGeneralAgentId(agentId: string) {
      this.generalAgentId = agentId
    },
    setAgentId(agentId: string) {
      this.agentId = agentId
    }
  },
  persist: true
})
