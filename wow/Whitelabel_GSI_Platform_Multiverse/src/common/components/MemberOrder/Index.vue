<template>
  <div>
    <Module1 :theme="props.theme" />
  </div>
</template>

<script setup lang="ts">
import Module1 from "./components/module1.vue"

const props = withDefaults(
  defineProps<{
    theme?: "dark" | "light"
  }>(),
  {
    theme: "light"
  }
)
</script>

<style scoped></style>
