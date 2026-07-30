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
        routerName: "MemberLevelSetting",
        i18nKey: "menu.member_level_settings"
      },
      {
        routerName: "MemberLevelModify",
        i18nKey: "menu.member_level_modify"
      },
      {
        routerName: "MemberLevelHistory",
        i18nKey: "menu.member_level_history"
      },
      {
        routerName: "MemberLevelRewardList",
        i18nKey: "menu.send_rewards_list"
      }
    ],
    selector: ""
  })

  const route = useRoute()
  const router = useRouter()
  onMounted(() => {
    //信用版隱藏派發清單
    if (siteStore.isCredit) {
      tabs.list = tabs.list.filter((tab) => tab.routerName !== "MemberLevelRewardList")
    }
    if (route.name === "MemberLevelSetting") {
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
