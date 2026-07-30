<template>
  <div class="q-px-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-card-section class="q-pa-none">
        <div class="h1-bold bold text-center">
          <span style="color: rgba(21, 42, 76, 1)">{{ $t("common.edit_member_account") }}</span>
          <span style="color: rgba(8, 110, 255, 1)">({{ memberAccount }})</span>
        </div>

        <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
          <template #before>
            <q-tabs
              v-model="selector"
              class="q-pt-md text-grey bg-transparent tabsMenuWrapper"
              content-class="tabsMenu"
              indicator-color="transparent"
              active-color="white"
              active-bg-color="edit-color"
              align="left"
            >
              <q-route-tab
                v-for="(tab, key) in tabs"
                :key="key"
                :to="{ name: tab.routerName }"
                :label="$t(tab.i18nKey || 'common.unknow')"
                :name="tab.routerName"
                content-class="q-py-xs tabLabel"
                class="tabItem q-mx-xs"
                :ripple="false"
              />
            </q-tabs>
          </template>

          <template #after>
            <router-view />
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { routes } from "src/router/routes"
  import { useUserInfo } from "src/hook/useUserInfo"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import { useSearch } from "@/hook/useSearch"
  import { getMemberDetail } from "@/api/member"
  const { isAnibetAgent } = useUserInfo()
  const { envData } = useEnv()

  const splitterModel = ref(100)
  const selector = ref("")

  const tabs = computed(() => {
    const route = routes[0].children
      ?.find((e) => e.name === "MemberManagement")
      ?.children?.find((e) => e.name === "MemberManagementList")
      ?.children?.find((e) => e.name === "MemberListEdit")?.children

    if (!route) {
      return [
        {
          routerName: "EditMemberInfo",
          i18nKey: "menu.member_info"
        },
        /*{
          routerName: "EditMemberLevel",
          i18nKey: "menu.member_level"
        },*/
        {
          routerName: "EditWithdrawSetting",
          i18nKey: "menu.withdraw_setting"
        },
        {
          routerName: "EditTransactionReport",
          i18nKey: "menu.transaction_report"
        },
        // {
        //   routerName: "CommisionReportList",
        //   i18nKey: "menu.commision_report"
        // },
        {
          routerName: "EditBettingReport",
          i18nKey: "menu.betting_report"
        },
        {
          routerName: "EditSessionLog",
          i18nKey: "menu.session_log"
        },
        {
          routerName: "EditRemark",
          i18nKey: "menu.private_remark"
        },
        {
          routerName: "EditCollaborationDomain",
          i18nKey: "menu.collaborationDomain"
        }
      ]
    }

    let appMode = envData().VITE_APP_MODE
    if (isAnibetAgent.value && appMode === ENV_MODE_ENUM.AGENT) {
      appMode = ENV_MODE_ENUM.ANIBET_AGENT
    }

    return route
      .filter((e: any) => e.meta.menuShow.includes(appMode))
      .map((e: any) => {
        return {
          routerName: e.name,
          i18nKey: e.meta.i18nKey
        }
      })
  })

  const route = useRoute()
  const router = useRouter()
  const { search, spinShow, isSuccess, tableData } = useSearch(getMemberDetail)
  const memberAccount = ref("")
  onMounted(() => {
    Promise.all([search({ id: route.params.id })]).then(() => {
      let data = tableData.value
      memberAccount.value = data.account
    })

    if (route.name === "MemberListEdit") {
      router
        .push({
          name: tabs.value[0].routerName
        })
        .then(() => {
          selector.value = tabs.value[0].routerName
        })
    }
  })
</script>
