<template>
  <div
    class="agent-report__back-bar flex items-center gap-1 mb-4 md:mb-5 cursor-pointer text-base md:text-xl font-semibold"
    @click="report.handlerBackAgentReportMember()"
  >
    <q-icon name="chevron_left" class="text-[1.25rem] md:text-[1.5rem]" />
    <span>{{ report.agentReportParentMemberAccount }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useAgentReportContext } from "../useAgentReportContext"

const report = useAgentReportContext()
</script>
