import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

export const useCmsPopupStore = defineStore("cmsPopup", () => {
  const alreadyShow = useSessionStorage<boolean>("cmsPopupAlreadyShow", false)

  const markShown = () => {
    alreadyShow.value = true
  }

  return { alreadyShow, markShown }
})
