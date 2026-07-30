<template>
  <router-view name="layout" />
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from "vue"
  import { useAIHelperEvent } from "@/hook/useAIHelperEvent"
  import { AI_HELPER_EVENT_ROUTES } from "@/utils/constants"

  const { handleAIHelperRouteEvent } = useAIHelperEvent()

  onMounted(() => {
    handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.MEMBER_MANAGEMENT)
  })
</script>
