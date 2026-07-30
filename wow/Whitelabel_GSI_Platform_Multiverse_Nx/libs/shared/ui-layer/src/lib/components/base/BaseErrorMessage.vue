<script setup lang="ts">
import BaseIcon from "@shared-lib/components/base/BaseIcon.vue"

interface Props {
  errorMessage?: string
  classObj?: {
    root?: string // 最外層容器
    icon?: string // 錯誤圖示
    text?: string // 錯誤訊息文字
  }
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: ""
})
</script>

<template>
  <div
    :class="cx('flex items-center gap-1.5 text-xs text-[var(--input-input-negative)]', props.classObj?.root)"
  >
    <BaseIcon name="si:warning-fill" size="14px" :class="props.classObj?.icon" />
    <span :class="props.classObj?.text">{{ errorMessage }}</span>
  </div>
</template>
