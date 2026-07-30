<template>
  <div>
    <component :is="compMap[props.module]" :custom-style="props.customStyle">
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import Module1 from "./components/module1.vue"
import Module2 from "./components/module2.vue"

const props = withDefaults(
  defineProps<{
    module?: "module1" | "module2"
    customStyle?: Record<string, string> | string
  }>(),
  {
    module: "module1",
    customStyle: undefined
  }
)

const compMap = {
  module1: Module1,
  module2: Module2
} as const
</script>

<style scoped></style>
