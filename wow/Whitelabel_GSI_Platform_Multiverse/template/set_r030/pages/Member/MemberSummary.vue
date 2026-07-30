<template>
  <MemberSummary id="member-summary-wrapper" class="flex-1" />
</template>

<script setup lang="ts">
import MemberSummary from "src/common/components/MemberSummary/Index.vue"
</script>

<style scoped lang="scss">
:deep(.member-summary-select-currency) .q-field__control .q-field__append .q-select__dropdown-icon {
  transform: rotate(-90deg);
  &.rotate-180 {
    transform: rotate(90deg);
  }
}
</style>
