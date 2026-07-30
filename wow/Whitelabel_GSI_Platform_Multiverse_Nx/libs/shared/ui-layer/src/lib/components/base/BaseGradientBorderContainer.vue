<script setup lang="ts">
import { BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ } from "@shared-lib/constants/propsCategoryObj"

interface Props {
  size?: number | string
  type?: (typeof BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ)[keyof typeof BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ]
  class?: string | string[] | Record<string, boolean>
  classObj?: {
    root?: string
    inner?: string
  }
  gradientBackground?: string
  innerBackground?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 48,
  type: BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ.NORMAL,
  classObj: () => ({}),
  gradientBackground:
    "linear-gradient(180deg, var(--navbar-navbar-icon-dark-left-enabled) 0%, var(--navbar-navbar-icon-dark-right-enabled) 100%)",
  innerBackground: "var(--sidebar-sidebar-bg, #000025)"
})

const resolvedSize = computed(() => {
  if (typeof props.size === "number") return `${props.size}px`
  return props.size
})

const rootStyle = computed(() => ({
  width: props.type === BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ.CIRCLE ? resolvedSize.value : undefined,
  height: props.type === BASE_GRADIENT_BORDER_CONTAINER_TYPE_OBJ.CIRCLE ? resolvedSize.value : undefined,
  background: props.gradientBackground
}))

const innerStyle = computed(() => ({
  background: props.innerBackground
}))
</script>

<template>
  <div :class="cx('inline-flex rounded-full p-[1px] shrink-0', props.class, props.classObj?.root)" :style="rootStyle">
    <div :class="cx('h-full w-full rounded-full overflow-hidden', props.classObj?.inner)" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>
