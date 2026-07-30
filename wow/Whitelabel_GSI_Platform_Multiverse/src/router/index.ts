import axios from "axios"
import { route } from "quasar/wrappers"
import type { ApiResponse } from "src/common/apiHooks/useApiQuery/types"
import type * as Response from "src/api/response.type"
import { startEarlyHomeBannerPrefetch } from "src/common/composables/useBanner"
import { useTrackingParams } from "src/common/composables/useTrackingParams"
import { REFERRAL_REBATE_TARGET } from "src/common/utils/constants"
import { useAuthStore } from "src/stores/authStore"
import { useEnvInfoStore } from "src/stores/envStore"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router"

import getRoutes from "./routes"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export let router: Router

export default route(async function (/* { store, ssrContext } */) {
  const store = useAuthStore()
  const { updatedEnvInfo } = useEnvInfoStore()
  const { saveFromRouteQuery } = useTrackingParams()
  console.log(
    `website version: ${
      process.env.NODE_ENV === "development" ? process.env.NODE_ENV : process.env.VITE_APP_SITE_VERSION
    }`
  )

  // 取得環境變數檔裡的siteKey
  let siteKey
  if (process.env.NODE_ENV === "development") {
    await import("src/env/environment.json").then((module: any) => {
      siteKey = module.siteKey
      updatedEnvInfo(module, "")
    })
  } else {
    const res = await axios.get(`/environment.json?v=${process.env.VITE_APP_SITE_VERSION}`)
    siteKey = res.data?.siteKey
    updatedEnvInfo(res.data, "")
  }

  // set_r022：env 就緒後立刻 prefetch 首頁 banner / LCP（與 HomeBanner 共用同一條 promise）
  startEarlyHomeBannerPrefetch(siteKey)

  const { routes, beforeEach } = await getRoutes(siteKey)

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory

  router = createRouter({
    // fix: q-layout 跳路由scroll
    scrollBehavior: (to, from, savedPosition) => {
      if (to.meta.keepScrollPosition) {
        return savedPosition || {}
      }

      document.querySelector(".scroll")?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      })
      return { top: 0, left: 0 }
    },
    routes: routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // history: createHistory(process.env.VUE_ROUTER_BASE)
    history: createWebHistory(),
  })

  // template beforeEach
  if (beforeEach) {
    router.beforeEach(beforeEach)
  }

  // common beforeEach
  router.beforeEach((to, from, next) => {
    const { access_token } = to.query
    saveFromRouteQuery(to.query)
    if (access_token && typeof access_token === "string") {
      console.log("query 存在 access_token，將 access_token 存到 authStore")
      store.$patch({ access_token })

      // 移除 URL 中的 access_token 參數
      const query = { ...to.query }
      delete query.access_token
      return next({ ...to, query, replace: true })
    }

    // 關閉遊戲 dialog，清空 iframe 狀態
    try {
      const { useGameDialogStore } = require("src/stores/gameDialogStore")
      const gameDialogStore = useGameDialogStore()
      if (gameDialogStore.launchGameDialog.show) {
        gameDialogStore.launchGameDialog.closeDialog()
      }
    } catch (e) {
      // ignore if store not ready
    }

    const { needAuth, goRouteIfNoToken } = to.meta
    const needsReferralRebateAccess = to.matched.some((record) => record.meta.referralRebateAccess)

    const redirectUnauthorized = () => {
      const { login_token, redirect } = to.query
      const query = { login_token, redirect }

      if (goRouteIfNoToken) {
        return next({
          name: goRouteIfNoToken as any,
          query,
        })
      }

      return next({
        path: "/",
        query,
      })
    }

    if (needAuth && !store.isLogin) {
      console.warn("token is not available. back to home page.")
      return redirectUnauthorized()
    }

    if (needsReferralRebateAccess) {
      const userInfoStore = useUserInfoStore()
      const isMemberAgent =
        userInfoStore.userInfo?.is_member_agent ?? userInfoStore.userInfo2?.is_member_agent ?? false

      void import("src/api/referral_rebate")
        .then(({ getReferralRebateGroup }) => getReferralRebateGroup())
        .then((response) => {
          const { status, data } = response as unknown as ApiResponse<Response.ReferralRebateGroup>

          if (!status || !data) {
            return redirectUnauthorized()
          }

          const { rebate_target } = data
          const allowed =
            rebate_target === REFERRAL_REBATE_TARGET.Enums.All ||
            (rebate_target === REFERRAL_REBATE_TARGET.Enums.Member && !isMemberAgent) ||
            (rebate_target === REFERRAL_REBATE_TARGET.Enums.Agent && isMemberAgent)

          if (!allowed) {
            return redirectUnauthorized()
          }

          return next()
        })
        .catch(() => {
          return redirectUnauthorized()
        })
      return
    }

    next()
  })

  router.afterEach(() => {
    if ((window as any).fbq) {
      ;(window as any).fbq("track", "PageView")
    }
  })

  return router
})
