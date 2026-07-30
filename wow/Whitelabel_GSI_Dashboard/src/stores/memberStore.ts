import { defineStore } from "pinia"
import { ref } from "vue"
import type * as Request from "src/api/request.type"

export const useMemberStore = defineStore("memberStore", () => {
  const memberAddForm = ref<Request.AddMemberAccount>({
    enabled: true,
    block: false,
    label: []
  })

  function initMemberAddForm() {
    memberAddForm.value = {
      enabled: true,
      block: false,
      label: []
    }
  }

  return {
    memberAddForm,
    initMemberAddForm
  }
})
