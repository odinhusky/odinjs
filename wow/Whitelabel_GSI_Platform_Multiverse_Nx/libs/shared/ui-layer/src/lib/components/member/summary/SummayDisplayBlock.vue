<script setup lang="ts">
interface Props {
  label: string
  value: number | string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="
      cx('rounded-lg', 'bg-[var(--card-card-bg-primary-enabled)]', 'px-3 py-2', 'min-h-[56px]', FLEX_COL, 'gap-[13px]')
    "
  >
    <div class="text-xs leading-6 font-medium capitalize text-[var(--card-card-title-fourth-enabled)]">
      {{ props.label }}
    </div>

    <div class="text-xl capitalize leading-5 font-bold text-[var(--card-card-title-primary-enabled)]">
      {{ typeof props.value === "number" ? props.value : props.value }}
    </div>
  </div>
</template>
