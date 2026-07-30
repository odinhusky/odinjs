<template>
  <li v-if="hasAuditRate">
    {{ t("member.deposit.auditRate") }}[{{ auditRateText }}{{ t("ai.multiplier") }}]
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  auditRate?: number | string | null
}>()

const { t } = useI18n()

const hasAuditRate = computed(() => {
  return props.auditRate !== null && props.auditRate !== undefined && `${props.auditRate}`.trim() !== ""
})

const auditRateText = computed(() => `${props.auditRate}`.trim())
</script>
