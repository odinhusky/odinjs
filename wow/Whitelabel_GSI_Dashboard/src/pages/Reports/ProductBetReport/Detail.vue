<template>
  <q-layout>
    <q-page-container>
      <component :is="productBetReportPage" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, computed } from "vue"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  const { envData } = useEnv()

  const envMode = computed(() => envData().VITE_APP_MODE)
  const productBetReportPage = computed(() => {
    switch (envMode.value) {
      case ENV_MODE_ENUM.ADMIN:
        return defineAsyncComponent(() => import("./components/AdminDetail.vue"))
      case ENV_MODE_ENUM.AGENT:
      case ENV_MODE_ENUM.ANIBET_AGENT:
      case ENV_MODE_ENUM.AMUSEVIP:
        return defineAsyncComponent(() => import("./components/AgentDetail.vue"))
      case ENV_MODE_ENUM.GENERAL_AGENT:
        return defineAsyncComponent(() => import("./components/GeneralAgentDetail.vue"))
    }
  })
</script>
