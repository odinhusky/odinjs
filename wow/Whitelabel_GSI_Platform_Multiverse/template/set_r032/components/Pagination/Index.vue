<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    boundary-links
    flat
    active-design="flat"
    color="deep-grey"
    :active-color="$q.dark.isActive ? 'yellow-8' : 'blue-8'"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
defineProps<{
  modelValue: number
  totalPages: number
  maxPages?: number
}>()

defineEmits<{
  "update:model-value": [value: number]
}>()

const $q = useQuasar()
</script>
