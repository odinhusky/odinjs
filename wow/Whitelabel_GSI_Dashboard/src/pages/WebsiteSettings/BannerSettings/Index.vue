<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md q-mb-md">
        <div class="q-pt-md tabsMenuWrapper">
          <q-btn
            v-for="(tab, key) in tabs.list"
            :key="key"
            :to="{ name: tab.routerName }"
            :color="$route.name === tab.routerName ? 'main-color' : 'transparent'"
            :text-color="$route.name === tab.routerName ? 'white' : 'grey'"
            :flat="$route.name !== tab.routerName"
            class="q-mx-xs q-py-xs tabLabel"
            :ripple="false"
          >
            {{ $t(tab.i18nKey || "common.unknow") }}
          </q-btn>
        </div>
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
        routerName: "Home",
        i18nKey: "menu.home"
      }
    ]
    //日本站隱藏ProductLobby+GameLobby
    if (isAMUSEVIP.value) {
      return {
        list: commonList
      }
    } else {
      return {
        list: [
          ...commonList,
          // {
          //   routerName: "MobileHome",
          //   i18nKey: "menu.mobile_home"
          // },
          {
            routerName: "ProductLobby",
            i18nKey: "menu.product_lobby"
          },
          {
            routerName: "GameLobby",
            i18nKey: "menu.game_lobby"
          }
        ],
        selector: ""
      }
    }
  })
</script>
