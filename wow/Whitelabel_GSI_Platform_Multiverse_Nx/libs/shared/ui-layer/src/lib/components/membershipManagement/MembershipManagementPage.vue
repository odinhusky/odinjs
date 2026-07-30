<script setup lang="ts">
import { useSetting } from "../../api/hooks/useSetting"
import { AGENT_TYPE_ENUMS } from "../../constants/enums/agentType"
import { useAccountInfo } from "../../api/hooks/useAccountInfo"
import { ROUTE_PATH } from "../../constants/routePath"
import MembershipManagementPanel from "./MembershipManagementPanel.vue"
import BetReportPanel from "./BetReportPanel.vue"
import BetRecordQueryPanel from "./BetRecordQueryPanel.vue"
import AgentReportPanel from "./AgentReportPanel.vue"
import QuotaMoneyHistoryPanel from "./QuotaMoneyHistoryPanel.vue"

interface MembershipManagementPageClassObj {
  // 透傳給 MembershipManagementPanel → MemberAddMinusDialog body 的客製 class
  // 例：r017 用來掛 bg-[url(/images/bg-dialog.png)]
  dialogBody?: string
}

const props = withDefaults(
  defineProps<{
    sectionMaxWidth?: string
    classObj?: MembershipManagementPageClassObj
  }>(),
  {
    sectionMaxWidth: "1200px",
    classObj: () => ({})
  }
)

// 代理 gate：profile 載入後若非代理，redirect 到會員中心。
// middleware 已在 profile 已載入時擋掉，這裡兜底 race（直開連結 / SSR / 慢載入）。
const { accountInfo, isLoading: isAccountInfoLoading } = useAccountInfo()
const isMemberAgent = computed(() => Boolean(accountInfo.value?.is_member_agent))
const isAgentGateReady = computed(() => !isAccountInfoLoading.value && accountInfo.value !== undefined)

watch(
  [isAgentGateReady, isMemberAgent],
  ([ready, agent]) => {
    if (ready && !agent) {
      navigateTo(ROUTE_PATH.MEMBER.SUMMARY, { replace: true })
    }
  },
  { immediate: true }
)

interface MembershipTab {
  key: string
  labelKey: string
  creditOnly?: boolean
}

// 五個分頁；額度帳變明細僅信用版顯示。
const TABS: MembershipTab[] = [
  { key: "manage", labelKey: "menu.membershipManagement" },
  { key: "quotaHistory", labelKey: "menu.memberChangeDetails", creditOnly: true },
  { key: "betReport", labelKey: "member.membershipManagement.betReport" },
  { key: "betRecord", labelKey: "member.membershipManagement.betRecordQuery" },
  { key: "agentReport", labelKey: "member.membershipManagement.agentReport" }
]

const activeTab = ref("manage")

// betReport drill-down 狀態，傳給 BetRecordQuery
const drillDownAccount = ref("")
const drillDownDateRange = ref<string[] | null>(null)

const BASE_ENABLED_TABS = new Set(["manage", "betReport", "betRecord", "agentReport"])

const handleTabChange = (key: string) => {
  if (!enabledTabs.value.has(key)) return
  activeTab.value = key
}

const handleBetReportDrillDown = (account: string, dateRange: string[] | null) => {
  drillDownAccount.value = account
  drillDownDateRange.value = dateRange
  activeTab.value = "betRecord"
}

const { t } = useI18n()
const pageHeaderTitle = computed(() => t("member.membershipManagement.agentCenter"))

// 產品模式：信用版 / 現金版，對應舊 main useEnv().isCredit。
const { setting: agentType } = useSetting<AGENT_TYPE_ENUMS | undefined>({ selector: (s) => s.agent_type })
const isCredit = computed(() => agentType.value === AGENT_TYPE_ENUMS.CREDIT)

const visibleTabs = computed(() => TABS.filter((tab) => !tab.creditOnly || isCredit.value))

const enabledTabs = computed(() => {
  const tabs = new Set(BASE_ENABLED_TABS)
  if (isCredit.value) tabs.add("quotaHistory")
  return tabs
})

watch(isCredit, (credit) => {
  if (!credit && activeTab.value === "quotaHistory") {
    activeTab.value = "manage"
  }
})
</script>

<template>
  <MemberContainer
    :header-title="pageHeaderTitle"
    :show-aside="false"
    :disable-content-max-width="true"
    :section-max-width="sectionMaxWidth"
  >
    <!-- tab 列放在 #tabs slot，渲染在深色 card 外，使 tab 列與 card 視覺分離 -->
    <template v-if="isAgentGateReady && isMemberAgent" #tabs>
      <div :class="cx(FLEX_ITEMS_CENTER, 'flex-nowrap w-max')">
        <BaseTab
          v-for="tab in visibleTabs"
          :key="tab.key"
          category="default"
          :active="activeTab === tab.key"
          :class-obj="{ item: 'shrink-0 min-w-fit px-5 py-2 whitespace-nowrap phone:w-[120px] phone:min-w-[120px]' }"
          @click="handleTabChange(tab.key)"
        >
          {{ $t(tab.labelKey) }}
        </BaseTab>
      </div>
    </template>

    <div v-if="!isAgentGateReady" class="flex min-h-[360px] items-center justify-center">
      <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--icon-icon-primary-enabled)]" />
    </div>

    <!-- KeepAlive：保留各 tab panel 的 state，切換 tab 不會 unmount 也不會清空 -->
    <KeepAlive v-else-if="isMemberAgent">
      <MembershipManagementPanel
        v-if="activeTab === 'manage'"
        key="manage"
        :is-credit="isCredit"
        :class-obj="{ dialogBody: props.classObj.dialogBody }"
      />
      <QuotaMoneyHistoryPanel v-else-if="activeTab === 'quotaHistory'" key="quotaHistory" />
      <BetReportPanel
        v-else-if="activeTab === 'betReport'"
        key="betReport"
        @drill-down="handleBetReportDrillDown"
      />
      <BetRecordQueryPanel
        v-else-if="activeTab === 'betRecord'"
        key="betRecord"
        :initial-member-account="drillDownAccount"
        :initial-date-range="drillDownDateRange"
      />
      <AgentReportPanel v-else-if="activeTab === 'agentReport'" key="agentReport" />
    </KeepAlive>
  </MemberContainer>
</template>
