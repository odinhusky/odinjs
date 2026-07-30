import { defineStore } from "pinia"
import { getVoiceBotLanguageList } from "@/api/AIVoiceBot"
import type { GetVoiceBotLanguageList } from "@/api/response.type"

export const useAiManagementStore = defineStore("aiManagement", {
  state: () => ({
    languageList: [] as GetVoiceBotLanguageList
  }),
  actions: {
    async getLanguageList() {
      const { data } = await getVoiceBotLanguageList()
      if (data) {
        this.languageList = data
      }
    }
  }
})
