import { defineStore } from "pinia"
import { ref } from "vue"

export const useTestStore = defineStore("test", () => {
  // 1. State: 本地專案特有的狀態
  const message = ref("這是來自 okbet 本地 Store 的初始訊息")

  // 2. Actions: 更新訊息的方法
  function updateMessage(newMsg: string) {
    message.value = newMsg
  }

  return {
    message,
    updateMessage
  }
})
