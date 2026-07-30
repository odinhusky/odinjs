<template>
  <component
    :is="compMap[props.module]"
    :deposit-threshold="props.depositThreshold"
    :valid-bet-threshold="props.validBetThreshold"
  />
</template>

<script setup lang="ts">
import Module1 from "./components/module1.vue"

const props = withDefaults(
  defineProps<{
    module?: "module1"
    depositThreshold?: number
    validBetThreshold?: number
  }>(),
  {
    module: "module1",
    depositThreshold: 0,
    validBetThreshold: 0
  }
)

const compMap = {
  module1: Module1
} as const
</script>

<style scoped></style>
