<template>
  <div class="w-full">
    <div class="flex gap-2 items-start">
      <div class="text-grey-8 min-w-32 pt-2">
        {{ label }}
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
  }>()
</script>
