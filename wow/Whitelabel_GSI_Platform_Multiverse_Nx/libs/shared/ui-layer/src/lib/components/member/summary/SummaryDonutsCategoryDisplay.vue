<script setup lang="ts">
interface Props {
  label: string
  amount: number
  colorClass: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-[3px] h-[33px] rounded" :class="props.colorClass" />

    <div class="flex flex-col">
      <span class="text-xs leading-4 text-[var(--card-card-subtitle-primary-enabled)]">{{ props.label }}</span>

      <span class="text-base leading-none font-medium text-[var(--card-card-title-primary-enabled)]">
        {{ props.amount.toLocaleString("en-US") }}
      </span>
    </div>
  </div>
</template>
