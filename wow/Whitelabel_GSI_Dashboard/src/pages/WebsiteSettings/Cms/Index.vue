<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #before>
      <div v-if="!route.meta.disableTabs" class="q-px-md tabsMenuWrapper2">
        <q-btn
          class="q-mt-md"
          v-for="(tab, key) in tabs.list"
          :key="tab.routerName"
          :to="{ name: tab.routerName }"
          :ripple="false"
          :color="isActive(tab.routerName) ? 'main-color' : 'transparent'"
          :text-color="isActive(tab.routerName) ? 'white' : 'grey'"
          :flat="!isActive(tab.routerName)"
        >
          {{ $t(tab.i18nKey || "common.unknow") }}
        </q-btn>
      </div>
    </template>

    <template #after>
      <router-view :key="$route.fullPath" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from "vue"
  import { useRoute } from "vue-router"
  import { useCommon } from "src/hook/useCommon"
  import { CMS_TYPE } from "src/utils/constants"
  import { useSiteStore } from "src/stores/siteStore"

  const siteStore = useSiteStore()

  const splitterModel = ref(100)
  const route = useRoute()
  const { numberEnumToArray } = useCommon()

  const allowedAgents = ["dobt"]
  const agent_code = siteStore.agent_code.toLocaleLowerCase()

  const allTabs = numberEnumToArray(CMS_TYPE.Enums)
    .filter((e) => allowedAgents.includes(agent_code) || e !== CMS_TYPE.Enums.GCASHHOME)
    .map((e) => ({
      routerName: CMS_TYPE.RouterName[e as CMS_TYPE.Enums],
      i18nKey: CMS_TYPE.I18nKeys[e as CMS_TYPE.Enums]
    }))

  if (allowedAgents.includes(agent_code)) {
    const gcashTab = allTabs.find((e) => e.routerName === CMS_TYPE.RouterName[CMS_TYPE.Enums.GCASHHOME])
    if (gcashTab) {
      const filteredTabs = allTabs.filter((e) => e.routerName !== CMS_TYPE.RouterName[CMS_TYPE.Enums.GCASHHOME])
      filteredTabs.splice(1, 0, gcashTab) // 插入到第二個位置
      allTabs.length = 0
      allTabs.push(...filteredTabs)
    }
  }

  const tabs = reactive({
    list: allTabs,
    selector: ""
  })
  const isActive = (tabRouterName: string) => {
    const routeName = route.name as string
    return routeName.includes(tabRouterName)
  }
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  .active {
    color: white;
    opacity: 1;
    background-color: $mainColor;
  }
</style>
