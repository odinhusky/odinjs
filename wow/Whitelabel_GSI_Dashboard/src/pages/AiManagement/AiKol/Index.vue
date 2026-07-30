<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-pt-xs q-pl-sm">
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
      <router-view />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useSiteStore } from "@/stores/siteStore"

  const splitterModel = ref(100)
  const siteStore = useSiteStore()

  const tabs = reactive({
    list: [
      {
        routerName: "AiKolGenerate",
        i18nKey: "menu.generate_kol"
      },
      {
        routerName: "MyKols",
        i18nKey: "menu.my_kol"
      },
      // {
      //   routerName: "AiKolOverview",
      //   i18nKey: "Instagram"
      // },
      // {
      //   routerName: "AiKolFb",
      //   i18nKey: "Facebook"
      // },
      // {
      //   routerName: "AiKolTiktok",
      //   i18nKey: "TikTok"
      // },
      // {
      //   routerName: "AiKolTwitter",
      //   i18nKey: "X (Twitter)"
      // },
      {
        routerName: "AiKolPostGeneration",
        i18nKey: "menu.ai_kol_post_gen"
      },
      {
        routerName: "AiKolPostScheduling",
        i18nKey: "menu.ai_kol_post_schedule"
      },
      {
        routerName: "AiKolPostList",
        i18nKey: "ai_kol.ai_kol_post_list"
      }
    ],
    selector: ""
  })

  const route = useRoute()
  const router = useRouter()
  onMounted(() => {
    if (route.name === "AiKolOverview") {
      router
        .push({
          name: tabs.list[0].routerName
        })
        .then(() => {
          tabs.selector = tabs.list[0].routerName
        })
    }
  })
</script>
