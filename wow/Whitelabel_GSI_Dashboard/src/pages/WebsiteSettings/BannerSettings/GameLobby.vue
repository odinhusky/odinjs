<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden" class="q-pa-md">
    <!-- <template class="bg-white"> -->
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md">
        <div v-if="gameTypeTabs.list.length && gameTypeTabs.selector" class="q-px-md">
          <q-tabs
            v-model="gameTypeTabs.selector"
            dense
            active-color="black"
            active-bg-color="light-blue-1"
            indicator-color="light-blue-1"
            class="text-grey game-type-tabs"
          >
            <q-tab
              v-for="tab in gameTypeTabs.list"
              :key="tab.gameType"
              :name="tab.gameTypeId"
              :label="tab.i18nKey"
              content-class="q-px-xs tabLabel rounded-borders"
              @click="changeGameType(tab.gameTypeId)"
            />
          </q-tabs>
        </div>
        <div v-if="supplierTabs.list.length && supplierTabs.selector" class="q-pa-sm bg-light-blue-1 sub-tabs">
          <q-tabs
            v-model="supplierTabs.selector"
            class="text-grey bg-white tabsWrapper"
            content-class="tabsMenu"
            indicator-color="transparent"
            active-color="white"
            active-bg-color="main-color"
            align="left"
          >
            <q-tab
              v-for="(tab, key) in supplierTabs.list"
              :key="key"
              :label="tab.productName || $t('common.unknow')"
              :name="tab.productCode"
              content-class="q-py-xs tabLabel"
              class="tabItem q-mx-xs"
              :ripple="false"
              @click="changeProductCode(tab.productCode)"
            />
          </q-tabs>
        </div>
      </div>
    </template>

    <template #after v-if="gameTypeTabs.selector && supplierTabs.selector">
      <BannerTable :position="3" :gameCode="gameTypeTabs.selector" :productCode="supplierTabs.selector" />
    </template>
    <!-- </template> -->
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import BannerTable from "./component/BannerTable.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import * as CONSTANTS from "@/utils/constants"
  import { useI18n } from "vue-i18n"
  import { getProductDropdown, productGameCode } from "@/api/product"

  const store = useQueryStore()
  const { t } = useI18n()

  const splitterModel = ref(100)
  const route = useRoute()
  const router = useRouter()

  const gameTypeTabs = reactive({
    list: [] as { gameType: string; i18nKey: string | number; gameTypeId: number }[],
    selector: 0
  })
  const supplierTabs = reactive({
    list: [] as { supplierType: string; productName: string; productCode: number }[],
    selector: 0
  })

  function changeGameType(gameTypeId: number) {
    router.replace({ params: { gameType: gameTypeId, supplierType: "" } })
  }

  function changeProductCode(productCode: number) {
    router.replace({ params: { gameType: gameTypeTabs.selector, supplierType: productCode } })
  }

  onMounted(async () => {
    // 路由參數
    const { gameType, supplierType } = route.params

    // 遊戲類型
    await store.getGameTypeList()
    gameTypeTabs.list = store.gameTypeList.map((item) => ({
      gameType: item.label,
      i18nKey: t((CONSTANTS.GAME_TYPE.I18nKeys as any)[item.value] || "common.unknow"),
      gameTypeId: item.value as number
    }))

    if (gameType) {
      gameTypeTabs.selector = Number(gameType)
    } else {
      gameTypeTabs.selector = gameTypeTabs.list.length
        ? gameTypeTabs.list[0].gameTypeId
        : CONSTANTS.GAME_TYPE.Enums.SLOT
    }

    // 產品列表
    const payload: productGameCode = { only_actived: true, game_type: gameTypeTabs.selector }
    const { data } = await getProductDropdown(payload)
    supplierTabs.list = data.map((item) => ({
      supplierType: item.game_type,
      productName: item.product_name,
      productCode: item.product_code
    }))

    if (supplierType) {
      supplierTabs.selector = Number(supplierType)
    } else {
      supplierTabs.selector = supplierTabs.list.length ? supplierTabs.list[0].productCode : 0
    }

    router.replace({ params: { gameType: gameTypeTabs.selector, supplierType: supplierTabs.selector } })
  })
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";

  .tabsWrapper {
    border-radius: 1.5rem;
    padding: 0;
  }
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

  .sub-tabs {
    border-radius: 10px 10px 0 0;
  }
</style>
