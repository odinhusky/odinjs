<script setup lang="ts">
import { Icon } from "@iconify/vue"
import type { ClassValue } from "clsx" // 引入型別確保安全

interface Props {
  name: string // Iconify 的圖標名稱，例如 'mdi:home', https://icon-sets.iconify.design/
  className?: ClassValue // 外部傳入的 Tailwind class
  gradientClass?: ClassValue // 漸層背景 class，傳入後會以 mask 方式渲染 icon
  size?: string | number // 可選：快速設定大小，預設可交給 class 處理
}

const props = withDefaults(defineProps<Props>(), {
  size: "1em" // 預設跟隨字體大小
})

const iconClasses = computed(() => cx("inline-block align-middle", props.className))

const useGradientMask = computed(() => Boolean(props.gradientClass))

const gradientClasses = computed(() => cx("inline-block align-middle shrink-0", props.className, props.gradientClass))

const maskIconUrl = computed(() => `https://api.iconify.design/${props.name.replace(":", "/")}.svg`)

const gradientMaskStyles = computed(() => {
  const sizeValue = typeof props.size === "number" ? `${props.size}px` : props.size

  return {
    width: sizeValue,
    height: sizeValue,
    WebkitMask: `url('${maskIconUrl.value}') center / contain no-repeat`,
    mask: `url('${maskIconUrl.value}') center / contain no-repeat`
  }
})
</script>

<template>
  <span v-if="useGradientMask" :class="gradientClasses" :style="gradientMaskStyles" aria-hidden="true" />

  <Icon v-else :icon="name" :class="iconClasses" :style="{ fontSize: size }" />
</template>
