<template>
  <div class="management-area">
    <div class="page-title">
      <span>{{ $t("menu.membershipManagement") }}</span>
    </div>

    <!-- 新增下級畫面 -->
    <AddSubordinateMember v-if="memberManagementStore.showAddSubordinateStatus" />

    <template v-else>
      <q-tabs
        v-model="memberManagementStore.activeTab"
        class="type-tabs"
        indicator-color="transparent"
        align="left"
        no-caps
        inline-label
        @update:model-value="memberManagementStore.handlerChangeActiveTab"
      >
        <q-tab v-for="tab in tabOptions" :key="tab.value" :label="tab.label" :name="tab.value" />
      </q-tabs>

      <div class="content-box">
        <q-tab-panels v-model="memberManagementStore.activeTab" class="bg-transparent">
          <q-tab-panel name="manage" class="manage-panel">
            <ManagePanel />
          </q-tab-panel>

          <q-tab-panel v-if="isCredit" name="detail" class="detail-panel">
            <DetailPanel />
          </q-tab-panel>

          <q-tab-panel name="betReport" class="bet-report-panel">
            <BetReportPanel />
          </q-tab-panel>

          <q-tab-panel name="betRecordQuery" class="bet-record-query-panel">
            <BetRecordQueryPanel />
          </q-tab-panel>

          <q-tab-panel name="agentReport" class="agent-report-panel" lazy>
            <AgentReportPanel :active="memberManagementStore.activeTab === 'agentReport'" />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- 加減款彈窗 -->
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
import ManagePanel from "./components/MembershipManagement/ManagePanel.vue"
import DetailPanel from "./components/MembershipManagement/DetailPanel.vue"
import BetReportPanel from "./components/MembershipManagement/BetReportPanel.vue"
import BetRecordQueryPanel from "./components/MembershipManagement/BetRecordQueryPanel.vue"
import AgentReportPanel from "./components/MembershipManagement/AgentReport.vue"
import MemberAddMinusDialog from "./components/MembershipManagement/MemberAddMinusDialog.vue"
import AddSubordinateMember from "./components/MembershipManagement/AddSubordinateMember.vue"

const router = useRouter()
const { t } = useI18n()
const { isCredit } = useEnv()
const { userInfo2 } = useUserInfo()
const memberManagementStore = useMemberManagement()

// 額度帳變明細僅信用版顯示：現金版過濾掉 detail 分頁，信用版覆寫分頁名稱
const tabOptions = computed(() =>
  memberManagementStore.tabOptions
    .filter((tab) => isCredit.value || tab.value !== "detail")
    .map((tab) => (tab.value === "detail" ? { ...tab, label: t("menu.creditQuotaChangeDetails") } : tab))
)

onMounted(async () => {
  if (!userInfo2.value.is_member_agent) {
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

<style lang="scss">
@import "app/template/set_r033/assets/css/membershipManagement.scss";
</style>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r033/assets/css/_variable.scss";
@import "app/template/set_r033/assets/css/membershipManagement.scss";

.management-area {
  width: 100%;
  max-width: 71.875rem;
  margin: auto;
  padding-bottom: 10dvh;

  @include phone-width {
    padding: 1rem 1rem 20vh;
  }

  .manage-panel {
    padding: 0;

    :deep(.q-table__top) {
      background: transparent !important;
      margin-bottom: 0.625rem;
    }
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 3.75rem;
    margin-bottom: 0.5rem;
    color: var(--text-01);

    @include phone-width {
      margin-top: 0;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      font-size: 1rem;
    }

    .page-title-blue {
      color: var(--text-01);
    }
  }

  // 上方折頁式 tabs（參考歷史注單頁）
  .type-tabs {
    :deep(.q-tab) {
      min-width: 6.25rem;
      min-height: auto;
      background: var(--btn-bg-07);
      color: var(--tab-text-01);
      font-size: 0.875rem;
      font-weight: 700;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      padding: 0.5rem 1.25rem;

      &.q-tab--active {
        background: var(--primary-01) !important;
      }

      .q-tab__content {
        padding: 0;
      }
    }
  }

  // 下方內容卡片（參考歷史注單頁）
  .content-box {
    background-color: var(--bg-11);
    color: var(--text-01);
    border-radius: 0.5rem;
    border-top-left-radius: 0;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    box-shadow: 0px -2px 8px 0px #0000004d;

    @include phone-width {
      padding: 0.625rem;
    }
  }
}
</style>
