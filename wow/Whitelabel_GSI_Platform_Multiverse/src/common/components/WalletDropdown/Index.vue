<template>
  <div>
    <component :is="compMap[props.module]" v-bind="$attrs" :onAction="props.onAction">
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    module?: "module1" | "module2"
    onAction?: () => void
  }>(),
  {
    module: "module1"
  }
)

const compMap = {
  module1: defineAsyncComponent(() => import("./components/module1.vue")),
  module2: defineAsyncComponent(() => import("./components/module2.vue"))
} as const
</script>

<style scoped></style>
