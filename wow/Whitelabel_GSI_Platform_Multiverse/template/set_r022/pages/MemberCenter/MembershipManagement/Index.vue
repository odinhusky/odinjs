<template>
  <div id="membership-management" class="agent-center-page">
    <div class="agent-center-title">
      <q-btn flat dense round icon="chevron_left" class="agent-center-title-btn" @click="router.back()" />
      <span>{{ $t("member.membershipManagement.agentCenter") }}</span>
      <q-btn flat dense round icon="close" class="agent-center-title-btn" @click="router.push({ name: 'home' })" />
    </div>

    <AddSubordinateMember v-if="memberManagementStore.showAddSubordinateStatus" />

    <template v-else>
      <div class="agent-center-filter-card">
        <div class="agent-center-desktop-title">{{ $t("member.membershipManagement.agentCenter") }}</div>

        <q-tabs
          v-model="memberManagementStore.activeTab"
          class="agent-center-tabs"
          indicator-color="transparent"
          align="left"
          dense
          outside-arrows
          @update:model-value="memberManagementStore.handlerChangeActiveTab"
        >
          <q-tab v-for="tab in tabOptions" :key="tab.value" :label="tab.label" :name="tab.value" class="tab-item" />
        </q-tabs>

        <ManageSearchForm v-if="memberManagementStore.activeTab === 'manage'" />
        <BetReportSearchForm v-if="memberManagementStore.activeTab === 'betReport'" />
        <BetRecordQuerySearchForm v-if="memberManagementStore.activeTab === 'betRecordQuery'" />
      </div>

      <div class="agent-center-card">
        <q-tab-panels v-model="memberManagementStore.activeTab" class="agent-center-panels">
          <q-tab-panel name="manage" class="agent-center-panel">
            <ManagePanel />
          </q-tab-panel>

          <q-tab-panel v-if="isAgentCenterCredit" name="detail" class="agent-center-panel">
            <DetailPanel />
          </q-tab-panel>

          <q-tab-panel name="betReport" class="agent-center-panel">
            <BetReportPanel />
          </q-tab-panel>

          <q-tab-panel name="betRecordQuery" class="agent-center-panel">
            <BetRecordQueryPanel />
          </q-tab-panel>

          <q-tab-panel name="agentReport" class="agent-center-panel" lazy>
            <AgentReportPanel :active="memberManagementStore.activeTab === 'agentReport'" />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <MemberAddMinusDialog v-if="memberManagementStore.showDialog" v-model="memberManagementStore.showDialog" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, onBeforeUnmount, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import AddSubordinateMember from "./components/AddSubordinateMember.vue"
import AgentReportPanel from "./components/AgentReport.vue"
import BetRecordQueryPanel from "./components/BetRecordQueryPanel.vue"
import BetRecordQuerySearchForm from "./components/BetRecordQuerySearchForm.vue"
import BetReportPanel from "./components/BetReportPanel.vue"
import BetReportSearchForm from "./components/BetReportSearchForm.vue"
import DetailPanel from "./components/DetailPanel.vue"
import ManagePanel from "./components/ManagePanel.vue"
import ManageSearchForm from "./components/ManageSearchForm.vue"
import MemberAddMinusDialog from "./components/MemberAddMinusDialog.vue"

const router = useRouter()
const { t } = useI18n()
const { isCredit } = useEnv()
const { userInfo, userInfo2, useBasicInfoQuery } = useUserInfo()
const basicInfoQuery = useBasicInfoQuery()
const memberManagementStore = useMemberManagement()
const isMemberAgent = computed(() => Boolean(userInfo2.value?.is_member_agent || userInfo.value?.is_member_agent))
const isAgentCenterCredit = computed(() => isCredit.value)

const tabOptions = computed(() =>
  memberManagementStore.tabOptions
    .filter((tab) => isAgentCenterCredit.value || tab.value !== "detail")
    .map((tab) => {
      if (tab.value === "manage") {
        return { ...tab, label: t("member.membershipManagement.title") }
      }

      if (tab.value === "detail") {
        return { ...tab, label: t("menu.creditQuotaChangeDetails") }
      }

      return tab
    })
)

onMounted(async () => {
  if (!isMemberAgent.value) {
    await basicInfoQuery.refetch()
  }

  if (!isMemberAgent.value) {
    return router.push({ name: "home" })
  }

  memberManagementStore.memberAgentAccount = userInfo2.value?.account || userInfo.value?.account || ""

  await memberManagementStore.handlerGetMemberAgentQuotaAmount()
  await memberManagementStore.handlerGetMemberAgentQuotaBalance()
})

onBeforeUnmount(() => {
  memberManagementStore.activeTab = "manage"
  memberManagementStore.resetPage()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
