<template>
  <div
    v-if="props.isRequired || props.labelText"
    class="flex items-center gap-1 text-white text-sm font-bold"
    :class="props.labelContainerClass"
    :style="{
      ...props.labelStyle
    }"
  >
    <span v-if="props.isRequired" class="block text-red" :class="props.labelStarClass">*</span>
    <span v-if="props.labelText" :class="props.labelTextClass">{{ props.labelText }}</span>
    <LoginRegisterToolTip v-if="props.tooltipProps" v-bind="props.tooltipProps" />
  </div>
</template>

<script setup lang="ts">
import type { LoginRegisterOuterInputLabelProps } from "./types"
import LoginRegisterToolTip from "../LoginRegisterToolTip/index.vue"

const props = withDefaults(defineProps<LoginRegisterOuterInputLabelProps>(), {
  labelText: "",
  labelContainerClass: "",
  labelStyle: () => ({}),
  labelTextClass: "",
  isRequired: false,
  labelStarClass: ""
})
</script>

<style lang="scss" scoped></style>
