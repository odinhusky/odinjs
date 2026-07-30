<template>
  <div class="agent-report w-full">
    <AgentReportSearchForm v-if="!report.isAgentReportSubordinateView" :variant="variant" />
    <AgentReportBackBar v-else />

    <div class="relative w-full">
      <q-inner-loading :showing="report.isSearching" color="primary" />
      <AgentReportSelfDataSection />

      <div class="agent-report__section-title w-full" :class="teamTitleClass">
        {{ $t("shareholder_platform.teamData") }}
      </div>

      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgentReportContext } from "../useAgentReportContext"
import AgentReportBackBar from "./AgentReportBackBar.vue"
import AgentReportSearchForm from "./AgentReportSearchForm.vue"
import AgentReportSelfDataSection from "./AgentReportSelfDataSection.vue"

const { isMobile } = useMediaQuery()
const report = useAgentReportContext()

const variant = computed(() => (isMobile.value ? "mobile" : "desktop"))

const teamTitleClass = computed(() => (isMobile.value ? "mb-1" : "mb-2.5 max-md:mb-1"))
</script>
