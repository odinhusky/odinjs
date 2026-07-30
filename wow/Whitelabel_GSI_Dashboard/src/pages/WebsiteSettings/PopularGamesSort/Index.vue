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
            :to="{ name: routeName, params: { gameType: tab.gamtType } }"
            :label="$t(`common.${tab.i18nKey}` || 'common.unknow')"
            :name="tab.gamtType"
            content-class="q-py-xs tabLabel"
            class="tabItem q-mx-xs"
            :ripple="false"
          />
        </q-tabs>
      </div>
    </template>

    <template #after>
      <ExpansionUpload />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import ExpansionUpload from "./component/ExpansionUpload.vue"

  const splitterModel = ref(100)
  const route = useRoute()
  const router = useRouter()

  const routeName = "PopularGamesSort"
  const tabs = reactive({
    list: [
      {
        gamtType: "slot",
        i18nKey: "slot"
      },
      {
        gamtType: "casino",
        i18nKey: "casino"
      },
      {
        gamtType: "poker",
        i18nKey: "poker"
      },
      {
        gamtType: "fishing",
        i18nKey: "fishing"
      },
      {
        gamtType: "esport",
        i18nKey: "esport"
      },
      {
        gamtType: "sport_book",
        i18nKey: "sport_book"
      },
      {
        gamtType: "cock_fight",
        i18nKey: "cock_fight"
      },
      {
        gamtType: "lottery",
        i18nKey: "lottery"
      }
    ],
    selector: ""
  })

  onMounted(() => {
    const { gameType } = route.params
    router
      .push({
        name: routeName,
        params: { gameType: "slot" }
      })
      .then(() => {
        tabs.selector = "slot"
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
