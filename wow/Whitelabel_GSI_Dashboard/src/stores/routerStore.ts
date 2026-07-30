import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import { reactive } from "vue"

// 往後所有state型別定義都固定以此方式命名(stateType)
interface stateType {
  [key: string]: any
  path: string
  name: string
}

export const useRouterStore = defineStore("routerData", () => {
  const router = useRouter()

  const routeData: stateType = reactive({
    path: "/",
    name: "首頁"
  })

  const go = (name: string) => {
    router.push({
      name
    })
  }

  return { routeData, go }
})
