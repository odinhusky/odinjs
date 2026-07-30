<template>
  <!-- <BasicSetting
    v-if="kolsExamples.length"
    :list="kolsExamples"
    :is-id-show="false"
    :is-cadence-show="false"
    :is-show-hard-do-not="false"
    :is-show-generate-post-btn="false"
  /> -->
  <div v-if="kolsExamples.length">odin 有資料</div>
  <NoData v-else />
</template>

<script setup lang="ts">
  import { onMounted } from "vue"
  import { useAIKol } from "@/composables/useAIKol"
  // import BasicSetting from "./components/BasicSetting.vue"
  import NoData from "../components/NoData.vue"

  const { kolsExamples, getExamples } = useAIKol()

  onMounted(() => {
    getExamples()
  })
</script>
