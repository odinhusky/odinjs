<template>
  <q-layout>
    <q-page-container>
      <component :is="loginPage" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, computed, onMounted } from "vue"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import { authWhiteIp } from "@/api/systemSettings"
  import { useMetaData } from "@/hook/useMetaData"

  const { envData } = useEnv()
  const { getMetaData } = useMetaData()

  const envMode = computed(() => envData().VITE_APP_MODE)
  const loginPage = computed(() => {
    switch (envMode.value) {
      case ENV_MODE_ENUM.ADMIN:
        return defineAsyncComponent(() => import("./Login/Admin.vue"))
      case ENV_MODE_ENUM.GENERAL_AGENT:
        return defineAsyncComponent(() => import("./Login/GeneralAgent.vue"))
      default:
        return defineAsyncComponent(() => import("./Login/Agent.vue"))
    }
  })

  onMounted(async () => {
    await authWhiteIp()
    await getMetaData()
  })
</script>

<style>
  .bg-image {
    background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
  }
</style>
