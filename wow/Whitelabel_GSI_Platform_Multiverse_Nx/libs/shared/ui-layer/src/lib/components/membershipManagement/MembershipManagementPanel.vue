<script setup lang="ts">
import { useMemberManagementTab } from "../../composables/useMembershipManagement/useMemberManagementTab"
import { provideMemberManagementContext } from "../../composables/useMembershipManagement/useMemberManagementContext"
import MembershipManagementSummaryCards from "./MembershipManagementSummaryCards.vue"
import MembershipManagementLowerLevelHeader from "./MembershipManagementLowerLevelHeader.vue"
import MembershipManagementFilters from "./MembershipManagementFilters.vue"
import MembershipManagementTablePanel from "./MembershipManagementTablePanel.vue"
import MembershipManagementMobileList from "./MembershipManagementMobileList.vue"
import MemberAddMinusDialog from "./MemberAddMinusDialog.vue"
import AddSubordinateMemberPanel from "./AddSubordinateMemberPanel.vue"

interface PanelClassObj {
  dialogBody?: string
}

interface Props {
  isCredit: boolean
  classObj?: PanelClassObj
}

const props = withDefaults(defineProps<Props>(), {
  classObj: () => ({})
})

const ctx = useMemberManagementTab()
provideMemberManagementContext(ctx)

const {
  page, size, totalRecords, isLoading,
  memberAccount, recommenderAccount, searchSubordinateMemberAccount,
  showSubordinateMemberAccount, isLowerLevelMode,
  manageRows, remainQuotaAmount,
  showQuotaDialog, dialogType, dialogAmount, dialogIncreaseItem,
  dialogMemberAccount, dialogMemberBalance, dialogMemberRemainQuotaAmount, dialogMemberIsAgent,
  isQuotaBalanceSubmitting,
  showAddSubordinateStatus,
  memberAgentCustomizeColumnId,
  handleSearch, handleLowerLevelSearch,
  handleViewLowerLevel, handleBackToDirectList, handlePageChange,
  handleOpenQuotaDialog, handleAmountInput, handleSubmitQuotaBalance
} = ctx

const { accountInfo } = useAccountInfo()
const selfAccount = computed(() => accountInfo.value?.account ?? "")

// mobile 展開行
const expandedRowId = ref<number | undefined>()
const handleToggleRow = (id: number) => {
  expandedRowId.value = expandedRowId.value === id ? undefined : id
}

const { isDown } = useCustomBreakpoints()

const handleSearch_ = () => {
  if (isLowerLevelMode.value) {
    handleLowerLevelSearch()
  } else {
    handleSearch()
  }
}
</script>

<template>
  <div :class="cx(FLEX_COL, 'w-full gap-4')">
    <!-- 新增/編輯下級面板 -->
    <AddSubordinateMemberPanel v-if="showAddSubordinateStatus" />

    <template v-else>
    <!-- 查看下級：返回列（mobile 頂部） -->
    <MembershipManagementLowerLevelHeader
      v-if="isLowerLevelMode && isDown.phone"
      :account="showSubordinateMemberAccount?.account ?? ''"
      @back="handleBackToDirectList"
    />

    <!-- dark container 已提升至 page level（membershipManagement.vue），此處只負責內容堆疊 -->
    <div :class="cx(FLEX_COL, 'w-full gap-4')">
      <!-- 摘要卡片 -->
      <MembershipManagementSummaryCards
        :member-agent-account="selfAccount"
        :remain-quota-amount="remainQuotaAmount"
        :is-credit="props.isCredit"
        :viewing-account="showSubordinateMemberAccount?.account"
      />

      <!-- 查看下級：返回列（PC 版，顯示在卡片下方） -->
      <MembershipManagementLowerLevelHeader
        v-if="isLowerLevelMode && !isDown.phone"
        :account="showSubordinateMemberAccount?.account ?? ''"
        @back="handleBackToDirectList"
      />

      <!-- 篩選列 -->
      <MembershipManagementFilters
        :is-lower-level-mode="isLowerLevelMode"
        :member-account="memberAccount"
        :recommender-account="recommenderAccount"
        :search-subordinate-member-account="searchSubordinateMemberAccount"
        :is-searching="isLoading"
        @update:member-account="memberAccount = $event"
        @update:recommender-account="recommenderAccount = $event"
        @update:search-subordinate-member-account="searchSubordinateMemberAccount = $event"
        @search="handleSearch_"
        @add-subordinate="showAddSubordinateStatus = true"
      />

      <!-- PC 表格 -->
      <MembershipManagementTablePanel
        v-if="!isDown.phone"
        :rows="manageRows"
        :is-credit="props.isCredit"
        :is-loading="isLoading"
        :total-records="totalRecords"
        :page="page"
        :size="size"
        @page-change="handlePageChange"
        @add="handleOpenQuotaDialog($event, 1)"
        @minus="handleOpenQuotaDialog($event, 2)"
        @edit="showAddSubordinateStatus = true; memberAgentCustomizeColumnId = $event.member_id"
        @view-lower-level="handleViewLowerLevel"
      />

      <!-- Mobile 列表 -->
      <MembershipManagementMobileList
        v-else
        :rows="manageRows"
        :is-credit="props.isCredit"
        :is-loading="isLoading"
        :expanded-row-id="expandedRowId"
        :total-records="totalRecords"
        :page="page"
        :size="size"
        @toggle-row="handleToggleRow"
        @page-change="handlePageChange"
        @add="handleOpenQuotaDialog($event, 1)"
        @minus="handleOpenQuotaDialog($event, 2)"
        @edit="showAddSubordinateStatus = true; memberAgentCustomizeColumnId = $event.member_id"
        @view-lower-level="handleViewLowerLevel"
      />
    </div>

    <!-- Mobile: 新增下級 底部 CTA -->
    <div v-if="isDown.phone" class="w-full pt-2">
      <BaseBtn theme="primary" size="lg" class="w-full" @click="showAddSubordinateStatus = true">
        新增下級
      </BaseBtn>
    </div>

    </template>

    <!-- 加減款 Dialog -->
    <MemberAddMinusDialog
      v-model:visible="showQuotaDialog"
      :type="dialogType"
      :amount="dialogAmount"
      :dialog-increase-item="dialogIncreaseItem"
      :member-account="dialogMemberAccount"
      :member-balance="dialogMemberBalance"
      :member-remain-quota-amount="dialogMemberRemainQuotaAmount"
      :remain-quota-amount="remainQuotaAmount"
      :is-credit="props.isCredit"
      :is-member-agent="dialogMemberIsAgent"
      :is-submitting="isQuotaBalanceSubmitting"
      :class-obj="{ body: props.classObj.dialogBody }"
      @update:amount="handleAmountInput"
      @update:dialog-increase-item="dialogIncreaseItem = $event"
      @submit="handleSubmitQuotaBalance"
    />
  </div>
</template>
