<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md">
        <q-tabs
          v-model="tabs.selector"
          class="q-pt-md text-grey bg-transparent tabsMenuWrapper2"
          content-class="tabsMenu"
          indicator-color="transparent"
          active-color="white"
          active-bg-color="main-color"
          align="left"
        >
          <q-route-tab
            v-for="(tab, key) in tabs.list"
            :key="key"
            :to="{ name: tab.routerName }"
            :label="$t(tab.i18nKey || 'common.unknow')"
            :name="tab.routerName"
            content-class="q-py-xs tabLabel"
            class="tabItem q-mx-xs"
            :ripple="false"
          />
        </q-tabs>
      </div>
    </template>

    <template #after>
      <router-view :key="$route.fullPath" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import { useEnvInfoStore } from "src/stores/envStore"
  import { useUserInfo } from "src/hook/useUserInfo"

  const { isAMUSEVIP } = useUserInfo()

  const { isAgentMode } = useEnv()

  const splitterModel = ref(100)
  const route = useRoute()
  const router = useRouter()
  const { envData } = useEnv()
  const { envInfo } = useEnvInfoStore()
  const tabs = computed(() => {
    const commonList = [
      {
        routerName: "WebsiteLogo",
        i18nKey: "menu.logo_settings"
      }
    ]

    if (isAMUSEVIP.value) {
      return {
        list: commonList
      }
    } else {
      return {
        list: [
          ...commonList
          // {
          //   routerName: "MobileHome",
          //   i18nKey: "menu.mobile_home"
          // },
        ],
        selector: ""
      }
    }
  })
</script>
