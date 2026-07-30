<template>
  <div v-if="isEnabled" class="real-name-bank-match-notice text-warning">
    <q-icon name="info" class="notice-icon" />
    <span>{{ $t("real_name_bank_match_notice") }}</span>
  </div>
</template>

<script setup lang="ts">
import { useEnvInfoStore } from "src/stores/envStore"
import { computed } from "vue"

const { envInfo } = useEnvInfoStore()

const isEnabled = computed<boolean>(() => envInfo.member_bank_real_name === 1)
</script>

<style scoped lang="scss">
.real-name-bank-match-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin: 0.25rem 0 0.5rem;
  font-size: 0.75rem;
  line-height: 1.25;
}

.notice-icon {
  flex-shrink: 0;
  font-size: 1rem;
}
</style>
