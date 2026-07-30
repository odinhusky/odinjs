<template>
  <div
    class="agent-report__account-cell inline-flex max-w-full flex-row flex-nowrap items-center justify-center gap-1 whitespace-nowrap"
  >
    <q-icon
      v-if="showExpandIcon"
      :name="isExpanded ? 'arrow_drop_up' : 'arrow_drop_down'"
      class="agent-report__link shrink-0 cursor-pointer align-middle"
      @click.stop="report.toggleAgentReportTeamRowDetail(memberId)"
    />
    <q-spinner v-if="isLoading" size="1rem" class="shrink-0 align-middle" />
    <span
      v-if="report.isAgentReportDownlineExplorationEnabled"
      class="agent-report__link agent-report__link--underline min-w-0 truncate cursor-pointer"
      @click="report.searchSubordinateAgentReport(memberId)"
    >
      {{ memberAccount }}
    </span>
    <span v-else class="min-w-0 truncate">{{ memberAccount }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgentReportContext } from "../useAgentReportContext"

const props = defineProps<{
  memberId: number
  memberAccount: string
}>()

const { isMobile } = useMediaQuery()
const report = useAgentReportContext()

const isExpanded = computed(() => report.isAgentReportTeamRowDetailExpanded(props.memberId))
const isLoading = computed(() => report.isAgentReportTeamRowDetailLoading(props.memberId))
const showExpandIcon = computed(() => {
  if (!report.isAgentReportTeamRowExpandIconVisible(props.memberId)) return false
  if (isMobile.value && isExpanded.value) return false
  return true
})
</script>
