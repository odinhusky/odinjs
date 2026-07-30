<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-flex page-header">
      <q-toolbar class="q-px-lg" style="padding-right: 0px">
        <q-toolbar-title class="text-bold q-toolbar-title">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            style="left: calc(0rem - 5px); z-index: 1; font-size: 14px; color: rgba(83, 82, 82, 1)"
          />
          <BreadcrumbBar v-if="breadcrumbList !== undefined" :list="breadcrumbList" />
        </q-toolbar-title>

        <div class="q-gutter-md row items-center">
          <!-- notification(alert) -->
          <SoundNotify />
          <q-btn :ripple="false" unelevated text-color="white" size="md" class="country">
            <img src="~assets/images/common/earth.svg" />
            <q-menu class="dropdownWrapper dropdownTop" anchor="bottom middle" self="top middle">
              <q-list>
                <q-item
                  v-for="lang in availableLanguages"
                  :key="lang"
                  v-close-popup
                  clickable
                  @click="updateLanguage(lang)"
                  :class="{ 'active-item': selectedLanguage === lang }"
                >
                  <q-item-section avatar>
                    <img v-if="getFlagUrl(lang)" :src="getFlagUrl(lang)!" width="20" class="flag" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ LANGUAGE_TYPE.Labels[lang as LANGUAGE_TYPE.Enums] }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn :ripple="false" text square flat class="currency-btn">
            <img src="~assets/images/common/header_coin.svg" class="q-ml-xs" />
            <span class="q-ml-sm" style="padding-left: 0.3125rem; padding-right: 0.625rem">
              {{ $t(dropdownData.currencyList.find((c) => c.value === selectedCurrency)?.label || "common.unknow") }}
            </span>
            <img src="~assets/images/common/tip_down.svg" class="arrow-icon q-ml-xs" :class="{ open: currencyOpen }" />
            <q-menu
              class="dropdownWrapper"
              @show="currencyOpen = true"
              @hide="currencyOpen = false"
              anchor="bottom right"
              self="top right"
            >
              <q-list>
                <q-item
                  v-for="currency in dropdownData.currencyList"
                  :key="currency.value"
                  v-close-popup
                  clickable
                  @click="updateCurrency(currency.value)"
                  :class="{ 'active-item': selectedCurrency === currency.value }"
                >
                  <q-item-section>
                    {{ $t(currency.label) }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <!-- user info -->
        <q-btn :ripple="false" text square flat>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="q-pl-sm column items-start">
            <span class="text-left text-bold user-name">{{ username }}</span>
            <Clock />
          </div>
          <img src="~assets/images/common/tip_down.svg" class="arrow-icon" :class="{ open: avatarOpen }" />
          <q-menu
            class="dropdownWrapper"
            @show="avatarOpen = true"
            @hide="avatarOpen = false"
            anchor="bottom middle"
            self="top middle"
          >
            <q-list>
              <q-item
                v-close-popup
                clickable
                @click="timezoneStore.setTimeZone(REPORT_TIMEZONE_TYPE.Enums.UTC0)"
                :class="{ 'active-item': timezoneStore.isUTC0Timezone }"
              >
                <q-item-section avatar>
                  <q-icon size="sm" name="history" />
                </q-item-section>
                <q-item-section>UTC+0</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="timezoneStore.setTimeZone(REPORT_TIMEZONE_TYPE.Enums.Client)"
                :class="{ 'active-item': timezoneStore.isClientTimezone }"
              >
                <q-item-section avatar>
                  <q-icon size="sm" name="update" />
                </q-item-section>
                <q-item-section
                  >UTC{{ timezoneStore.utcOffset >= 0 ? "+" : "" }}{{ timezoneStore.utcOffset }}</q-item-section
                >
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="changePasswordDialog?.openChangePasswordDialog"
                class="active-item"
              >
                <q-item-section avatar>
                  <q-icon size="sm" name="lock" />
                </q-item-section>
                <q-item-section>{{ $t("common.change_password") }}</q-item-section>
              </q-item>
              <q-item
                v-if="![ENV_MODE_ENUM.AMUSEVIP].includes(envInfo.agentCode)"
                v-close-popup
                clickable
                class="active-item"
              >
                <q-item-section avatar>
                  <q-icon size="sm" name="settings" />
                </q-item-section>
                <q-item-section>{{ $t("common.bind_authenticator") }}</q-item-section>
              </q-item>
              <q-item v-close-popup clickable @click="goLogout()" class="active-item">
                <q-item-section avatar>
                  <q-icon size="sm" name="logout" />
                </q-item-section>
                <q-item-section>{{ $t("btn.logout") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <div class="absolute q-px-lg" style="bottom: 0; width: 100%" v-if="isLoading">
        <q-tabs
          v-model="tabModel"
          class="sub-menu"
          inline-label
          outside-arrows
          mobile-arrows
          :align="$q.platform.is.mobile ? 'center' : 'left'"
        >
          <q-route-tab
            v-for="child in childRoutes"
            :key="child.path"
            :name="child.path"
            class="q-pa-none q-mr-lg"
            :to="
              currentParentPath === '/WebsiteSettings'
                ? { name: child.name }
                : route.path?.includes('/TeamAgentReport/') && child.path === 'CashReport'
                  ? { path: '/Report/CashReport' }
                  : { path: child.path }
            "
            :ripple="false"
          >
            <!-- label slot -->
            <template v-slot:default>
              <q-icon
                name="error"
                color="red"
                size="20px"
                class="q-ml-xs"
                v-if="
                  child.meta.permission[0] === PERMISSION.Enums.A_F_WARNING_SETTINGS &&
                  warningNotifyStore.warningStatus.length > 0
                "
              />
              {{ getChildRouteLabel(child) }}
            </template>
          </q-route-tab>
        </q-tabs>
      </div>
    </q-header>

    <!-- menu -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-main-light-color" :width="260">
      <q-item class="divLogo">
        <div class="logo-style logo-custom" v-if="isLoading && appModes !== ENV_MODE_ENUM.ADMIN">
          <img :src="logoImg()" v-if="webSiteLogo === ''" />
          <img :src="webSiteLogo" v-else />
        </div>
        <div class="logo-style logo-custom" v-else-if="isLoading">
          <img :src="adminLogo()" />
        </div>
      </q-item>
      <q-list class="menu-style menu-list">
        <template v-for="group in orderedGroups" :key="group">
          <template v-if="menuItems && menuItems[group] && menuItems[group].length">
            <q-expansion-item
              expand-separator
              dense
              header-class="text-bold text-main-deep-color bg-black expansion-header-text"
              class="q-mb-xs"
              :label="getGroupLabel(group)"
              :default-opened="isGroupActive(group)"
            >
              <template v-for="menuItem in menuItems[group]" :key="menuItem.to">
                <q-item
                  v-if="menuItem.menuShow"
                  v-ripple
                  dense
                  :to="menuItem.to"
                  clickable
                  active-class="q-item-no-link-highlighting text-white"
                  class="q-py-md text-main-deep-color text-bold bg-black"
                  style="max-height: 3.5rem; padding-left: 30px"
                >
                  <q-item-section avatar>
                    <img
                      :src="isActive(menuItem.to) ? useGetSvgAct(menuItem.icon) : useGetSvg(menuItem.icon)"
                      style="width: 20px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ menuItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
          </template>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="custom-bg">
      <q-page>
        <router-view v-if="isLoading" />
      </q-page>
    </q-page-container>
    <AIHelper />
  </q-layout>
  <ChangePassword ref="changePasswordDialog" />
  <AddGiftDdetails />
  <EditInvitationRouletteTimes />
</template>

<script lang="ts">
  // import EssentialLink from 'components/EssentialLink.vue'
  // import Messages from './Messages.vue';
  import SoundNotify from "@/components/SoundNotify.vue"
  import WarningNotify from "@/components/WarningNotify.vue"
  import Clock from "@/components/clocks/Index.vue"
  import BreadcrumbBar from "components/BreadcrumbBar.vue"
  import { useI18n } from "vue-i18n"
  import { routes } from "../router/routes"
  // import { useUserInfoStore } from 'stores/userInfoStore';
  // import { useRouterStore } from 'stores/routerStore';
  import type { RouteLocationRaw } from "vue-router"
  import { useRoute, useRouter } from "vue-router"
  // import { storeToRefs } from 'pinia'; // 解構成ref
  import { useQuasar } from "quasar"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import { useUserInfo } from "src/hook/useUserInfo"
  import { useImage } from "src/hook/useImage"
  import type { RouteMeta } from "src/interface/common"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useCurrencyStore } from "src/stores/currencyStore"
  import { computed, defineComponent, onMounted, onBeforeUnmount, ref, watch, provide, reactive } from "vue"
  import ChangePassword from "@/components/dialogs/ChangePassword.vue"
  import { useEnvInfoStore } from "src/stores/envStore"
  import { useSiteStore } from "@/stores/siteStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermissionStore } from "src/stores/permissionStore"
  import { REPORT_TIMEZONE_TYPE, PERMISSION, LANGUAGE_TYPE, CURRENCY_TYPE, EVENT_TYPE } from "src/utils/constants"
  import { useTimeZoneStore } from "@/stores/timezoneStore"
  import { authWhiteIp } from "@/api/systemSettings"
  import { getSiteLogo, getCurrencyList } from "@/api/common"
  import { useLanguage } from "src/composables/useLanguage"
  import { useMetaData } from "@/hook/useMetaData"
  import { useFavicon } from "@vueuse/core"
  import { useWarningNotifyStore } from "@/stores/warningNotifyStore"
  import AIHelper from "@/components/ai/Helper.vue"
  import AddGiftDdetails from "@/components/dialogs/AddGiftDdetails.vue"
  import { getWhiteIpAuthWithAgent } from "@/api/common"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"
  import { usePromotionStore } from "@/stores/promotionStore"

  import EditInvitationRouletteTimes from "@/components/dialogs/EditInvitationRouletteTimes.vue"

  export default defineComponent({
    name: "MainLayout",

    components: {
      BreadcrumbBar,
      Clock,
      ChangePassword,
      SoundNotify,
      AIHelper,
      AddGiftDdetails,
      EditInvitationRouletteTimes,
      WarningNotify
      // EssentialLink,
      // Messages
    },

    setup() {
      const { logoImg, adminLogo, adminFav } = useImage()
      // 教學
      // const { name, doubleCount } = store
      // 不起作用，因為破壞了響應, 裡面是reactive結構
      let router = useRouter()
      let route = useRoute()
      const avatarOpen = ref(false)
      const currencyOpen = ref(false)

      const { getAgentSetting, availableLanguages, getFlagUrl } = useLanguage()

      // In the parent component
      const warningNotifyStore = useWarningNotifyStore()
      const username = sessionStorage.getItem("account")

      const leftDrawerOpen = ref(false)
      const $q = useQuasar()

      const { t } = useI18n()
      const { envInfo } = useEnvInfoStore()
      const queryStore = useQueryStore()
      const siteStore = useSiteStore()
      const { userInfo, isAMUSEVIP } = useUserInfo()
      const languageStore = useLanguageStore()
      const currencyStore = useCurrencyStore()

      const permissionStore = usePermissionStore()
      const timezoneStore = useTimeZoneStore()
      const { getMetaData, logoUrl } = useMetaData()
      const eventbus = injectStrict(EventBusKey)
      const promotionStore = usePromotionStore()

      const selectedLanguage = ref(languageStore.currentLanguage)
      const { envData, isAgentMode } = useEnv()
      const updateLanguage = (newLanguage: any) => {
        selectedLanguage.value = newLanguage
        languageStore.setLanguage(newLanguage)
      }

      const selectedCurrency = ref(Number(currencyStore.currentCurrency))
      const updateCurrency = (newCurrency: any) => {
        selectedCurrency.value = newCurrency
        currencyStore.setCurrency(newCurrency)
      }
      let dropdownData = reactive<{
        currencyList: {
          label: string
          value: number
        }[]
      }>({
        currencyList: []
      })
      const webSiteLogo = ref("")
      const isLoading = ref(false)
      const appModes = envData().VITE_APP_MODE

      if (appModes === ENV_MODE_ENUM.ADMIN) {
        useFavicon(adminFav, {
          rel: "icon"
        })
      }
      onMounted(async () => {
        await Promise.all([permissionStore.fetchPermissionList(), getAgentSetting(), getCurrencyList()])
          .then(([permissionListRes, agentSettingRes, currencyData]) => {
            if (!currencyData.data || !Object.keys(currencyData.data).length) {
              return
            }
            Object.keys(currencyData.data).forEach((item) => {
              const currencyValue: CURRENCY_TYPE.Enums = currencyData.data[item]
              const label = CURRENCY_TYPE.I18nKeys[currencyValue]
              // 跳過沒有定義語系 key 的幣別
              if (label) {
                dropdownData.currencyList.push({
                  label,
                  value: currencyValue
                })
              }
            })
            if (dropdownData.currencyList && dropdownData.currencyList.length) {
              if (currencyStore.currentCurrency === 0) {
                const agentCode = (siteStore.agent_code || "").toLowerCase()
                const usdItem =
                  agentCode === "skg1"
                    ? dropdownData.currencyList.find((c) => c.value === CURRENCY_TYPE.Enums.USD)
                    : undefined
                updateCurrency(usdItem ? usdItem.value : dropdownData.currencyList[0].value)
              }
            }
          })

          .catch((error) => {
            console.log(error)
          })
          .finally(() => {
            isLoading.value = true
            selectedLanguage.value = languageStore.currentLanguage
          })
      })

      const menuItems = computed(() => {
        const groups: Record<string, any[]> = {}

        routes[0].children?.forEach((route: any) => {
          const hasChildren = route.children && route.children.length > 0
          const breadcrumb = route.meta.breadcrumb?.[route.meta.breadcrumb.length - 1]
          const label = breadcrumb?.i18nKey ? t(breadcrumb.i18nKey) : breadcrumb?.name || ""
          let appMode = envData().VITE_APP_MODE

          if (isAMUSEVIP.value && appMode === ENV_MODE_ENUM.AGENT) {
            appMode = ENV_MODE_ENUM.AMUSEVIP
          }

          let menuShows = route.meta.menuShow?.includes(appMode)

          // 信用版強制隱藏
          if (route.meta.menuShow?.includes("credit") && siteStore.isCredit) {
            menuShows = false
          }

          // 權限判斷
          if (route.meta.permission && menuShows && route.path !== "/Home") {
            const permission = route.meta.permission
            menuShows = permission.some((permissionId: number) => {
              if (permissionStore.permission.hasOwnProperty(permissionId)) {
                const permissions = permissionStore.permission[permissionId]
                return permissions.some((p: { view: boolean }) => p.view === true)
              } else {
                return false
              }
            })
          }

          if (!menuShows) return // 無權限或不顯示的直接跳過

          const groupKey = route.meta.group || "others"
          if (!groups[groupKey]) groups[groupKey] = []

          groups[groupKey].push({
            label,
            permission: route.meta.permission,
            icon: route.meta.icon || "default_icon",
            to: route.path,
            menuShow: menuShows,
            children: hasChildren
              ? route.children.map((child: any) => {
                  const childBreadcrumb = child.meta.breadcrumb?.[child.meta.breadcrumb.length - 1]
                  const childLabel = childBreadcrumb?.i18nKey ? t(childBreadcrumb.i18nKey) : childBreadcrumb?.name
                  return {
                    label: childLabel,
                    to: child.path,
                    icon: child.meta.icon || "default_icon"
                  }
                })
              : []
          })
        })

        return groups
      })

      const breadcrumbList = computed(() => {
        const parentRoute = routes[0].children?.find((r) => r.path === currentParentPath.value)

        let meta: RouteMeta | undefined = parentRoute?.meta

        if (!meta) {
          meta = route.meta as RouteMeta
        }

        return meta.breadcrumb
          ? meta.breadcrumb.map((item) => ({
              name: item.i18nKey ? t(item.i18nKey) : item.name,
              link: item.path || ""
            }))
          : []
      })

      const currentParentPath = computed(() => {
        // Assuming your route paths are always in the format /parent/child
        const pathSegments = route.path.split("/")
        return "/" + pathSegments[1] // This will give you '/Product'
      })

      const childRoutes = computed(() => {
        const allowedAgents = siteStore.product_v2_agent
        const agent_code = siteStore.agent_code.toLocaleLowerCase()
        const parentRoute = routes[0].children?.find((r) => r.path === currentParentPath.value)
        const filteredChildren = parentRoute?.children?.filter((child: any) => {
          if (child.meta?.menuShow) {
            let appMode = envData().VITE_APP_MODE

            if (isAMUSEVIP.value && appMode === ENV_MODE_ENUM.AGENT) {
              appMode = ENV_MODE_ENUM.AMUSEVIP
            }

            let menushow = child.meta.menuShow.includes(appMode)

            //權限功能,總控暫時不判斷
            if (child.meta.permission && menushow) {
              const permissionNames = child.meta.permission

              let foundViewPermission = false
              const permissionList = permissionStore.permission
              for (const group in permissionList) {
                if (permissionList.hasOwnProperty(group)) {
                  const permissions = permissionList[group]

                  // 檢查每一個權限名稱
                  for (const permissionName of permissionNames) {
                    for (const permission of permissions) {
                      if (permission.id === permissionName) {
                        if (permission.view) {
                          foundViewPermission = true
                          break // 找到並且是true，跳出循環
                        }
                      }
                    }
                    if (foundViewPermission) break // 如果已經找到 view 为 true 的權限
                  }
                  if (foundViewPermission) break // 如果已經找到 view 为 true 的權限
                }
              }

              menushow = foundViewPermission

              //現金版隱藏會員層級
              /* if (!siteStore.isCredit && permissionNames[0] === PERMISSION.Enums.A_F_MEMBER_LEVEL) {
                menushow = false
              }*/
              //暫時等候端好
              //menushow = true
            }
            return menushow
          }
          // 如果 menuShow 不存在，也返回 false
          return false
        })
        return filteredChildren || []
      })

      const getChildRouteLabel = (child: any) => {
        // Assuming the child.meta.breadcrumb is an array and the second element has the name or i18nKey
        const breadcrumb = child.meta.breadcrumb[0]
        return breadcrumb.i18nKey ? t(breadcrumb.i18nKey) : breadcrumb.name
      }

      const tabModel = ref("")

      onMounted(async () => {
        try {
          const response = await getWhiteIpAuthWithAgent()
          if (!response.data) {
            window.location.href = "https://www.agoda.com/"
          }
        } catch (error) {
          console.error(error)
        }

        await authWhiteIp()
        await getMetaData()
        if (logoUrl.value !== "") {
          webSiteLogo.value = logoUrl.value
        }
        // 初始化时也应用相同的逻辑
        const currentPath = route.path
        if (currentPath.includes("/WebsiteSettings/ProductEntranceMap")) {
          tabModel.value = "/WebsiteSettings/ProductEntranceMap" // 默认选择第一个游戏类型
        } else if (currentPath.includes("/WebsiteSettings/PopularGamesSort")) {
          tabModel.value = "/WebsiteSettings/PopularGamesSort" // 默认选择第一个游戏类型
        } else {
          tabModel.value = currentPath
        }

        // 監聽 AI 優惠設定事件
        eventbus.on("handleAIAddPromotionDetail", handleAIAddPromotionDetail)
      })

      watch(
        () => route.path,
        (newPath) => {
          if (newPath.includes("/WebsiteSettings/ProductEntranceMap")) {
            // 提取游戏类型，如果没有则默认为 slot
            tabModel.value = `/WebsiteSettings/ProductEntranceMap`
          } else if (newPath.includes("/WebsiteSettings/PopularGamesSort")) {
            // 提取游戏类型，如果没有则默认为 slot
            tabModel.value = `/WebsiteSettings/PopularGamesSort`
          } else {
            tabModel.value = newPath
          }
          console.log("Route changed:", newPath, "TabModel:", tabModel.value)
        }
      )

      const goToRoute = (path: RouteLocationRaw) => {
        console.log(path)
        router.push(path)
      }

      // 處理 AI 優惠設定事件
      const handleAIAddPromotionDetail = async (data: any) => {
        try {
          await promotionStore.initPromotionItem()
          promotionStore.promotionItem.info = siteStore.langList.map((lang) => {
            return {
              lang: lang.label,
              title: data.detail?.[0]?.title || "",
              content: data.detail?.[0]?.content || "",
              image: ""
            }
          })

          if (data.rewards) {
            // 因AI是做投注優惠，所以要寫死為投注優惠
            promotionStore.promotionItem.type = EVENT_TYPE.Enums.BetBonus

            const { data: currencyData } = await getCurrencyList()
            const allCurrencies = Object.keys(currencyData)

            promotionStore.promotionItem.levelData = data.rewards.map((reward: any, index: number) => {
              promotionStore.promotionItem.rewardType = reward.type

              const currencies = allCurrencies.map((currency: string) => {
                const matchingReward = data.rewards.find((r: any) => r.currency === currency)
                return {
                  currency: currency,
                  currency_id: currencyData[currency],
                  condition: matchingReward ? matchingReward.condition.toString() : "",
                  amount: matchingReward ? matchingReward.amount.toString() : ""
                }
              })

              return {
                level: index + 1,
                currency: currencies
              }
            })
          }

          if (data.wallet_type) {
            promotionStore.promotionItem.wallet_type = data.wallet_type
          }
          if (data.start_date) {
            promotionStore.promotionItem.start_date = data.start_date
          }
          if (data.end_date) {
            promotionStore.promotionItem.end_date = data.end_date
          }
          if (data.audit_rate) {
            promotionStore.promotionItem.audit_rate = Number(data.audit_rate)
          }

          // 導航到優惠設定新增頁面
          router.push({
            name: "PromotionSettingAdd"
          })
        } catch (error) {
          console.error("處理 AI 優惠設定事件失敗:", error)
        }
      }

      // const userInfoStore = useUserInfoStore();
      // let { updatedUserInfo } = userInfoStore;
      // 登入後帶入的使用者基本資料, 先塞假資料
      // updatedUserInfo({
      //   username: '代理帳號',
      //   account: 'Blues',
      //   token: '',
      //   userId: 12,
      //   menuList: [],
      // });

      const goLogout = async () => {
        localStorage.removeItem("publicToken")
        queryStore.$reset()
        siteStore.$reset()
        userInfo.$reset()
        router.push({ name: "Login" })
      }

      const useGetSvg = (iconName: string) => {
        const result = new URL(`/src/assets/svg/sidebar_${iconName}.svg`, import.meta.url).href
        return result
      }
      const useGetSvgAct = (iconName: string) => {
        const result = new URL(`/src/assets/svg/sidebar_${iconName}_w.svg`, import.meta.url).href
        return result
      }
      const isActive = (path: string) => {
        const routePath = "/" + route.path.split("/").filter(Boolean).slice(0, 1).join("/")
        return routePath === path
      }
      const changePasswordDialog = ref<InstanceType<typeof ChangePassword>>()

      onBeforeUnmount(() => {
        // 清理事件監聽器
        eventbus.off("handleAIAddPromotionDetail", handleAIAddPromotionDetail)
      })

      const groupLabelMap: Record<string, string> = {
        ai_tools: "ai_tools",
        cash_flow: "cash_flow",
        member_management: "member_management",
        affiliate: "affiliate",
        promotions: "promotions",
        records: "records",
        cms: "cms",
        settings: "settings",
        documents: "documents",
        home: "home"
      }
      const orderedGroups = [
        "home", // 首頁
        "ai_tools", // AI 工具
        "cash_flow", // 財務管理
        "member_management", // 會員管理
        "affiliate", // 代理管理
        "promotions", // 行銷活動
        "records", // 平台記錄
        "cms", // 內容管理
        "settings", // 系統設定
        "documents" // 文件中心
      ]
      const getGroupLabel = (group: string) => $t(`main_menu.${groupLabelMap[group]}`) || group

      const isGroupActive = (group: string) => {
        return menuItems.value[group]?.some((item) => route.path.startsWith(item.to))
      }
      return {
        logoImg,
        $q,
        leftDrawerOpen,
        breadcrumbList,
        menuItems,
        childRoutes,
        tabModel,
        route,
        goLogout,
        goToRoute,
        toggleLeftDrawer() {
          leftDrawerOpen.value = !leftDrawerOpen.value
        },
        t,
        selectedLanguage,
        updateLanguage,
        getChildRouteLabel,
        username,
        getFlagUrl,
        useGetSvg,
        useGetSvgAct,
        isActive,
        changePasswordDialog,
        ENV_MODE_ENUM,
        envInfo,
        timezoneStore,
        REPORT_TIMEZONE_TYPE,
        isAgentMode,
        isLoading,
        availableLanguages,
        LANGUAGE_TYPE,
        siteStore,
        webSiteLogo,
        selectedCurrency,
        updateCurrency,
        dropdownData,
        appModes,
        adminLogo,
        PERMISSION,
        warningNotifyStore,
        avatarOpen,
        currencyOpen,
        currentParentPath,
        getGroupLabel,
        isGroupActive,
        orderedGroups
      }
    }
  })
</script>

<style lang="scss">
  @import "../css/_variable_v2.sass";
  @import "../css/custom_v2.scss";
  .q-item__section--avatar {
    min-width: 35px;
  }
  .q-list {
    background-color: #eaebf8;
  }

  .q-toolbar__title {
    width: 50vw;
  }

  /* FONT AWESOME GENERIC BEAT */
  .fa-beat {
    animation: fa-beat 5s ease infinite;
  }

  @keyframes fa-beat {
    0% {
      transform: scale(1);
    }

    5% {
      transform: scale(1.25);
    }

    20% {
      transform: scale(1);
    }

    30% {
      transform: scale(1);
    }

    35% {
      transform: scale(1.25);
    }

    50% {
      transform: scale(1);
    }

    55% {
      transform: scale(1.25);
    }

    70% {
      transform: scale(1);
    }
  }

  .custom-flex {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-style {
    display: flex;
    height: 50%;
    > img {
      width: 100%;
    }
  }

  .active-tab {
    border-bottom: 4px solid white;
    opacity: 1;

    > div > div {
      font-weight: bold;
      color: white !important;
    }
  }

  .tab-header {
    position: absolute;
    bottom: 0;
    width: 100% !important;

    > div {
      justify-content: flex-start !important;
      margin: 0 10px;
    }
  }

  .country {
    border-radius: 8px;
    width: 26px;
    height: 26px;
    min-height: unset;
    background: rgba(217, 173, 255, 1) !important;
    padding: 0px;
    color: #000;
    img {
      width: 0.875rem;
      max-width: none;
    }
  }
  .currency-btn {
    color: #000;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0.625rem;
  }
  .arrow-icon {
    width: 20px;
    margin-left: 8px;
    transition: transform 0.3s ease;
  }

  .arrow-icon.open {
    transform: rotate(180deg);
  }
  .dropdownWrapper {
    position: relative;
    overflow: unset !important;
    .q-list {
      background-color: #ffffff;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      padding: 4px 0;
      position: relative;
      max-height: 500px;
      overflow-y: auto;
    }

    .q-list::before {
      content: "";
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #ffffff;
      z-index: 1;
    }

    .q-list::after {
      content: "";
      position: absolute;
      top: -7px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid rgba(0, 0, 0, 0.1);
      z-index: 0;
    }
    .q-item {
      padding: 8px 16px;
      min-height: 40px;

      .q-item__section--avatar {
        margin-right: 0px;
        min-width: 0px;
        padding-right: 0.5rem;
      }
    }
    font-size: 0.875rem;
    font-weight: 400;
    // 預設灰色
    .q-item {
      color: rgba(158, 158, 158, 1);

      .q-icon {
        color: rgba(158, 158, 158, 1);
      }
    }
    // active 狀態
    .active-item {
      color: #000;
      font-weight: 500;

      .q-icon {
        color: #1976d2;
      }
    }
  }
  .dropdownWrapper::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #ffffff;
    z-index: 1;
  }
  .dropdownWrapper::after {
    content: "";
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid rgba(0, 0, 0, 0.1);
    z-index: 0;
  }
  .dropdownTop {
    top: 3.125rem !important;
  }

  .language-select > div {
    box-shadow: none;
  }

  /* Customize the dropdown menu */
  .custom-q-select {
    background: #edefff !important;
    color: #409eff !important;
  }

  .flag-item:hover {
    background-color: #dde1fa !important;
  }

  .page-header {
    background: $headerMainColor;
    color: $mainColor;
    font-size: 1rem;

    .user-name {
      color: #086eff;
      font-size: 0.875rem;
      line-height: 18px;
    }

    .sub-menu {
      .q-tabs__content {
        overflow-x: scroll;
      }
      .q-tab {
        color: #858585; // 預設灰色
      }
      .q-tab--active {
        color: #086eff !important; // 選中藍色
      }
      .q-tab__label {
        font-weight: 700;
        font-size: 1.125rem;
      }
    }
    .q-toolbar-title {
      display: flex;
      overflow: unset;
    }
  }

  .custom-bg {
    background: linear-gradient(91.83deg, #f1f7ff 0.57%, #fff6ff 50.28%, #f3f3fe 100%);
  }
  .expansion-header-text {
    .q-item__label {
      font-size: 0.9375rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
  }
</style>
