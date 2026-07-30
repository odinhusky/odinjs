<template>
  <div class="flex justify-end q-mt-md">
    <q-pagination
      v-model="computedPage"
      :min="1"
      :max="totalPages"
      :max-pages="6"
      direction-links
      color="grey-7"
      active-color="primary"
      active-text-color="white"
      :boundary-numbers="false"
      flat
      active-design="unelevated"
      size="12px"
      gutter="sm"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from "vue"

  const props = defineProps<{
    modelValue: number
    totalPages: number
  }>()

  const emit = defineEmits(["update:modelValue"])

  const computedPage = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val)
  })
</script>

<style scoped>
  :deep(.q-btn) {
    border-radius: 2px;
    background-color: #f0f2f5;
  }
</style>
