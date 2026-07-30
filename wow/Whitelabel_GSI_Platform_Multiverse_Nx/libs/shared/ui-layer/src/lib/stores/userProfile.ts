import { defineStore } from "pinia"
import { ref } from "vue"
import type { GetAccountInfoResponseType } from "@shared-lib/api/apiFunctions/userInfo_getAccountInfo"

export const useUserProfileStore = defineStore("userProfile", () => {
  const profile = ref<GetAccountInfoResponseType | null>(null)

  function setProfile(data: GetAccountInfoResponseType) {
    profile.value = data
  }

  function clearProfile() {
    profile.value = null
  }

  return {
    profile,
    setProfile,
    clearProfile
  }
})
