<template>
  <div :class="rootClass">
    <div :class="labelClass">
      {{ $t("collaboration.currency") }}
    </div>

    <div :class="selectWrapperClass">
      <AgentReportCurrencySelect :select-class="selectClass" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import AgentReportCurrencySelect from "./AgentReportCurrencySelect.vue"

const props = defineProps<{
  variant: "desktop" | "mobile"
}>()

const rootClass = computed(() =>
  props.variant === "desktop"
    ? "flex items-center justify-center mr-9 text-sm overflow-hidden max-md:w-full max-md:mr-0 max-md:mb-5 max-md:flex-col max-md:items-stretch"
    : "contents"
)

const labelClass = computed(() =>
  props.variant === "desktop"
    ? "agent-report__field-label agent-report__field-label--currency mr-5 mb-0 whitespace-nowrap max-md:w-full max-md:mr-0 max-md:mb-1.5"
    : "agent-report__field-label mb-1.5 w-full"
)

const selectWrapperClass = computed(() =>
  props.variant === "desktop"
    ? "max-md:w-full max-md:px-4 max-md:bg-[#f0f1f4] max-md:rounded-full max-md:box-border"
    : "w-full px-4 bg-[#f0f1f4] rounded-full box-border"
)

const selectClass = computed(() =>
  props.variant === "desktop"
    ? "agent-report__currency-select w-[8.8125rem] max-md:w-full"
    : "agent-report__currency-select w-full"
)
</script>
