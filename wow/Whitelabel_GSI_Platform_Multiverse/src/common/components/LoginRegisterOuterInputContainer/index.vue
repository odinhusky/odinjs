<template>
  <div :class="cx('w-full flex flex-col gap-1', props.containerClass)" :style="props.containerStyle">
    <LoginRegisterOuterInputLabel v-bind="props.labelProps" />

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { cx } from "src/common/utils/cx"
import LoginRegisterOuterInputLabel from "../LoginRegisterOuterInputLabel/index.vue"
import type { LoginRegisterOuterInputContainerProps } from "./types"

const props = withDefaults(defineProps<LoginRegisterOuterInputContainerProps>(), {
  containerClass: "",
  containerStyle: () => ({})
})
</script>

<style lang="scss" scoped></style>
