<template>
  <div id="membership-management" class="agent-center-page">
    <div class="agent-center-title">{{ $t("member.membershipManagement.agentCenter") }}</div>

    <AddSubordinateMember v-if="memberManagementStore.showAddSubordinateStatus" />

    <template v-else>
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
import { computed, onBeforeUnmount, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMemberManagement } from "src/stores/useMemberManagement"

import AddSubordinateMember from "./components/MembershipManagement/AddSubordinateMember.vue"
import AgentReportPanel from "./components/MembershipManagement/AgentReport.vue"
import BetRecordQueryPanel from "./components/MembershipManagement/BetRecordQueryPanel.vue"
import BetReportPanel from "./components/MembershipManagement/BetReportPanel.vue"
import DetailPanel from "./components/MembershipManagement/DetailPanel.vue"
import ManagePanel from "./components/MembershipManagement/ManagePanel.vue"
import MemberAddMinusDialog from "./components/MembershipManagement/MemberAddMinusDialog.vue"

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

  memberManagementStore.memberAgentAccount = userInfo2.value.account

  await memberManagementStore.handlerGetMemberAgentQuotaAmount()
  await memberManagementStore.handlerGetMemberAgentQuotaBalance()
})

onBeforeUnmount(() => {
  memberManagementStore.activeTab = "manage"
  memberManagementStore.resetPage()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_r017/assets/css/membershipManagement.scss";
</style>
