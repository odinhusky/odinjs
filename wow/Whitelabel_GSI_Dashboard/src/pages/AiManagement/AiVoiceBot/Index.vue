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
      <router-view />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"

  const route = useRoute()
  const router = useRouter()

  const splitterModel = ref(100)

  const tabs = reactive({
    list: [
      {
        routerName: "TaskList",
        i18nKey: "menu.task_list"
      },
      {
        routerName: "SingleCall",
        i18nKey: "menu.single_call"
      }
    ],
    selector: ""
  })
  onMounted(() => {
      router.push({
          name: tabs.list[0].routerName
    }).then(() => {
      tabs.selector = tabs.list[0].routerName
    })
  })
</script>
