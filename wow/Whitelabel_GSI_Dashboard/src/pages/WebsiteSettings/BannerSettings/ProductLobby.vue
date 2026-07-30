<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden" class="q-px-md">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md">
        <q-tabs
          v-model="tabs.selector"
          dense
          class="q-pt-md text-grey bg-transparent game-type-tabs q-px-md"
          content-class="tabsMenu"
          indicator-color="light-blue-1"
          active-color="black"
          active-bg-color="light-blue-1"
          align="left"
        >
          <q-route-tab
            v-for="(tab, key) in tabs.list"
            :key="key"
            :to="{ name: routeName, params: { gameType: tab.gameType } }"
            :label="tab.i18nKey"
            :name="tab.gameType"
            content-class="q-py-xs tabLabel"
            :ripple="false"
          />
        </q-tabs>
      </div>
    </template>

    <template #after v-if="loading">
      <BannerTable :position="2" :gameCode="gameCode" backgroundColor="bg-light-blue-1" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import BannerTable from "./component/BannerTable.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import * as CONSTANTS from "@/utils/constants"
  import { useI18n } from "vue-i18n"

  const store = useQueryStore()
  const { t } = useI18n()

  const splitterModel = ref(100)

  const gameCode = ref(0)
  const loading = ref(false)
  const route = useRoute()
  const router = useRouter()

  const routeName = "ProductLobby"
  const tabs = reactive({
    list: [] as { gameType: string; i18nKey: string | number }[],
    selector: ""
  })

  onMounted(async () => {
    await store.getGameTypeList()

    tabs.list = store.gameTypeList.map((item) => ({
      gameType: item.label,
      i18nKey: t((CONSTANTS.GAME_TYPE.I18nKeys as any)[item.value] || "common.unknow")
    }))

    const { gameType } = route.params
    const filteredItem = store.gameTypeList.filter((item) => item.label === gameType)[0]
    gameCode.value = filteredItem ? Number(filteredItem.value) : 0

    if (route.name === routeName && !gameType) {
      router
        .push({
          name: routeName,
          params: { gameType: tabs.list[0].gameType }
        })
        .then(() => {
          tabs.selector = tabs.list[0].gameType
        })
    }
    loading.value = true
  })
</script>

<style lang="scss" scoped>
  .tabsMenu {
    .tabItem {
      border-radius: 1.5rem;
      margin-right: 0.5rem;
    }
  }

  .game-type-tabs {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
      padding-left: 0.5rem;
      .q-tab {
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #f0f2f5;
        border-left: 1px solid #f0f2f5;
        border-right: 1px solid #f0f2f5;
        &--active {
          border: none;
        }
      }
    }
  }

  .q-splitter {
    &:before {
      content: ""; /* 必須設置內容 */
      position: absolute; /* 絕對定位 */
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: white; /* 設定包圍空間的背景色 */
      border-radius: 10px;
      z-index: -1; /* 確保偽元素在內容下方 */
      margin: 0 16px; /* 調整大小以包括 padding */
    }
  }
</style>
