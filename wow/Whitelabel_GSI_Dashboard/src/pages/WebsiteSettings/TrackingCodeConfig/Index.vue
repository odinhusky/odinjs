<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md">
        <q-tabs
          v-model="tabs.selector"
          class="q-pt-md text-grey bg-transparent tabsMenuWrapper hidden"
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
  import { ref, reactive } from "vue"
  import { useRoute } from "vue-router"

  const splitterModel = ref(100)
  const route = useRoute()

  const tabs = reactive({
    list: [
      {
        routerName: "WebsitePixelCode",
        i18nKey: ""
      }
      // {
      //   routerName: "WebsiteFileUpload",
      //   i18nKey: "檔案上傳"
      // }
    ],
    selector: ""
  })
</script>
