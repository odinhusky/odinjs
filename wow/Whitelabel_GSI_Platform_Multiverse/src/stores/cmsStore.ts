import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { ref } from "vue"

export const useCmsStore = defineStore("cmsStore", () => {
  const cmsDetail = ref<Response.CmsItem>()

  function setCmsDetail(item?: Response.CmsItem) {
    cmsDetail.value = item
  }

  return { cmsDetail, setCmsDetail }
})
