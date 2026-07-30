<script setup lang="ts">
defineProps<{ account: string }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div
    :class="cx(FLEX_ITEMS_CENTER, 'gap-2 cursor-pointer w-fit')"
    @click="emit('back')"
  >
    <BaseIcon name="mdi:arrow-left" size="20px" class="text-[var(--text-text-primary)]" />
    <span class="text-sm font-medium text-[var(--text-text-primary)]">回上一層</span>
  </div>
</template>
