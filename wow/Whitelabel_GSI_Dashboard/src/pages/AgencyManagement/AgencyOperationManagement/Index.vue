<template>
  <router-view name="layout" />
  <router-view />
</template>
<!--
<script lang="ts" setup>
  import { onMounted, ref } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useSiteStore } from "src/stores/siteStore"

  const siteStore = useSiteStore()

  const isOld = siteStore.product_v2_agent
  const agent_code = siteStore.agent_code.toLocaleLowerCase()

  const router = useRouter()
  const loading = ref(false)
  onMounted(() => {
    if (isOld.includes(agent_code)) {
      router.push({
        name: "AgencyOperationsManagementList"
      })
    } else {
      router.push({
        name: "AgencyOperationManagementList_v2"
      })
    }
    loading.value = true
  })
</script>
-->
