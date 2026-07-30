import { defineRouter } from "#q-app/wrappers"
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from "vue-router"
import routes from "./routes"
import { useRouter } from "vue-router"
import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  const { envData } = useEnv()
  Router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem("publicToken")
    let appMode = envData().VITE_APP_MODE
    if (to.name !== "Login" && !token) {
      next({ name: "Login" })
    } else {
      const permissionList = sessionStorage.getItem("permission")
      //總控暫時不要
      if (permissionList && to.meta.permission && to.name !== "Dashboard") {
        const permission: { [key: string]: { id: number; view: boolean }[] } = JSON.parse(permissionList)
        const toPermission: number[] = to.meta.permission
        //判斷該頁view是否有開啟
        const hasPermission = toPermission.some((pid) => {
          return Object.values(permission).some((category: any) => {
            return category.some((item: { id: number; view: boolean }) => item.id === pid && item.view)
          })
        })
        //如果權限表沒找到就要找該單元其他子單元是否有開啟 , 有其他子單元開啟就導去如果都沒有就導回首頁
        if (!hasPermission) {
          const pathName = to.matched[1].path
          let entry = routes[0].children?.find((entry) => entry.path === pathName)
          if (entry && entry.children) {
            const permissions = entry.children.map((child) => child.meta?.permission)
            let matchedId = 0
            // console.log(entry.children)
            permissions.find((subArray: any) => {
              // 檢查子單元的id 是否有符合權限表
              return subArray.find((id: number) => {
                for (const key in permission) {
                  if (permission.hasOwnProperty(key)) {
                    const subArrayA = permission[key]
                    // view是否為true
                    const found = subArrayA.find((item) => {
                      return item.id === id && item.view
                    })

                    if (found) {
                      matchedId = found.id
                      return true
                    }
                  }
                }
              })
            })
            //子選單裡有其他開放的頁面就導去該頁
            if (matchedId !== 0) {
              for (const item of entry.children) {
                if (item.meta?.permission && Array.isArray(item.meta.permission)) {
                  // 檢查是否包含匹配的 ID
                  if (item.meta.permission.includes(matchedId)) {
                    const router = useRouter()
                    const matchedName = item.path
                    router.push(matchedName)
                    break
                  }
                }
              }
            } else {
              //子單元都關閉 直接導回首頁
              next({ name: "Dashboard" })
            }
          } else {
            //子單元都關閉 直接導回首頁
            next({ name: "Dashboard" })
          }
        }
      } //permission  end
      next()
    }
  })

  return Router
})
