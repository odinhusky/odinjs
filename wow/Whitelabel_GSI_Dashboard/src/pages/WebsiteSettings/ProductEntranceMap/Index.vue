<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md">
        <q-tabs
          v-model="tabs.selector"
          class="q-pt-md text-grey bg-transparent"
          content-class="tabsMenu"
          indicator-color="transparent"
          active-color="white"
          active-bg-color="main-color"
          align="left"
        >
          <q-route-tab
            v-for="(tab, key) in tabs.list"
            :key="key"
            :to="{ name: routeName, params: { gameType: tab.gameType } }"
            :label="tab.i18nKey"
            :name="tab.gameType"
            content-class="q-py-xs tabLabel"
            class="tabItem q-mx-xs"
            :ripple="false"
          />
        </q-tabs>
      </div>
    </template>

    <template #after>
      <ExpansionUpload :gameCode="gameCode" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import ExpansionUpload from "./component/ExpansionUpload.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import * as CONSTANTS from "@/utils/constants"
  import { useI18n } from "vue-i18n"

  const splitterModel = ref(100)
  const route = useRoute()
  const router = useRouter()
  const store = useQueryStore()
  const tabs = reactive({
    list: [] as { gameType: string; i18nKey: string | number }[],
    selector: ""
  })
  const routeName = "ProductEntranceMap"

  const { t } = useI18n()
  const gameCode = ref(0)

  onMounted(async () => {
    await store.getGameTypeList()

    tabs.list = store.gameTypeList.map((item) => ({
      gameType: item.label,
      i18nKey: t((CONSTANTS.GAME_TYPE.I18nKeys as any)[item.value] || "common.unknow")
    }))

    const { gameType } = route.params
    const filteredItem = store.gameTypeList.filter((item) => item.label === gameType)[0]
    gameCode.value = filteredItem ? Number(filteredItem.value) : 0

    router
      .push({
        name: routeName,
        params: { gameType: tabs.list[0].gameType }
      })
      .then(() => {
        tabs.selector = tabs.list[0].gameType
      })
  })
</script>

<style lang="scss" scoped>
  .tabsMenu {
    .tabItem {
      border-radius: 1.5rem;
      margin-right: 0.5rem;
    }
  }
</style>
