<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    flat
    class="custom-pagination"
    color="grey-7"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  totalPages: number
  maxPages?: number
}>()

defineEmits<{
  "update:model-value": [value: number]
}>()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r033/assets/css/_variable.scss";

.custom-pagination {
  :deep(.q-pagination__middle) {
    gap: 2px;

    .q-btn {
      background-color: var(--secondary-06);
      color: var(--text-01) !important;
    }
  }

  :deep(.q-btn) {
    border-radius: 0.35rem;
    background-color: var(--secondary-06);
    color: var(--text-01);
  }

  :deep(.q-icon) {
    color: var(--text-01);
  }

  :deep(.q-btn--standard) {
    background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%) !important;
    color: var(--text-01) !important;

    &::before {
      display: none;
    }
  }
}
</style>
