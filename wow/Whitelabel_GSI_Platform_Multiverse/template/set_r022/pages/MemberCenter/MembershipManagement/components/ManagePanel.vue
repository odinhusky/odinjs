<template>
  <div class="manage-toolbar">
    <q-btn
      v-if="!memberManagementStore.showSubordinateMemberAccount?.account"
      :label="$t('common.btn.addSubordinate')"
      unelevated
      class="agent-center-primary-btn"
      @click="memberManagementStore.showAddSubordinateStatus = true"
    />

    <q-btn
      v-else
      :label="$t('common.btn.back')"
      icon="chevron_left"
      unelevated
      class="agent-center-outline-btn"
      @click="memberManagementStore.handlerBackSubordinateMember()"
    />

    <div v-if="isCredit" class="quota-text">
      {{ $t("collaboration.remaining_agent_amount") }} :
      <span>{{ moneyFormat(memberManagementStore.remainQuotaAmount) }}</span>
    </div>
  </div>

  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.manageRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.manageColumns"
    row-key="id"
    hide-pagination
    flat
    class="manage-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="level" :props="props">
          <span>{{ props.row.hierarchy_level }}</span>
        </q-td>
        <q-td key="register_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.register_date) }}</span>
        </q-td>
        <q-td key="last_login_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.last_login_date) }}</span>
        </q-td>
        <q-td key="balance" :props="props">
          <span>{{ moneyFormat(props.row.balance) }}</span>
        </q-td>
        <q-td v-if="isCredit" key="remain_quota_amount" :props="props">
          <span>{{ moneyFormat(props.row.remain_quota_amount) }}</span>
        </q-td>
        <q-td key="actions" :props="props" class="manage-actions-cell">
          <div class="desktop-operation-icons">
            <template v-if="isCredit">
              <button
                v-for="(option, index) in memberManagementStore.operationOptions"
                :key="index"
                type="button"
                class="agent-center-action-btn"
                :title="option.label"
                @click="
                  memberManagementStore.handlerClickOperation(
                    props.row.member_account,
                    props.row.member_id,
                    option.value,
                    props.row.is_member_agent,
                    props.row.balance,
                    props.row.remain_quota_amount
                  )
                "
              >
                {{ option.label }}
              </button>
            </template>

            <button
              v-if="props.row.is_downline_search_available"
              type="button"
              class="agent-center-action-btn"
              :title="$t('member.membershipManagement.viewSubordinateMember')"
              @click="
                memberManagementStore.handlerClickOperation(
                  props.row.member_account,
                  props.row.member_id,
                  MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                  props.row.is_member_agent
                )
              "
            >
              {{ $t("member.membershipManagement.viewSubordinateMember") }}
            </button>

            <button
              v-if="props.row.is_direct_downline"
              type="button"
              class="agent-center-action-btn"
              :title="$t('common.btn.edit')"
              @click="
                memberManagementStore.handlerClickOperation(
                  props.row.member_account,
                  props.row.member_id,
                  MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                  props.row.is_member_agent
                )
              "
            >
              {{ $t("common.btn.edit") }}
            </button>
          </div>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <div class="agent-center-empty">
        <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
        <span>{{ $t("tableHeader.noData") }}</span>
      </div>
    </template>
  </q-table>

  <div v-else class="expansion-menu">
    <q-list v-if="memberManagementStore.manageRows?.length">
      <q-expansion-item
        v-for="data in memberManagementStore.manageRows"
        :key="getManageRowKey(data)"
        :model-value="expandedManageKeys.includes(getManageRowKey(data))"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        hide-expand-icon
        class="expansion-item"
        @update:model-value="(expanded) => updateExpandedManageKey(expanded, getManageRowKey(data))"
      >
        <template v-slot:header="{ expanded, toggle }">
          <q-item-section class="expansion-header">
            <div class="manage-mobile-card-summary">
              <div class="manage-mobile-summary-item">
                <div class="text-gray">{{ data.member_account }}</div>
                <div class="manage-mobile-summary-label">{{ $t("menu.account") }}</div>
              </div>
              <div class="manage-mobile-summary-item text-right">
                <div class="manage-mobile-summary-value-row">
                  <div class="manage-mobile-summary-value-group">
                    <div class="text-gray">
                      {{ moneyFormat(data.remain_quota_amount) }}
                    </div>
                    <div class="manage-mobile-summary-label">{{ $t("tableHeader.balance") }}</div>
                  </div>
                  <button type="button" class="manage-mobile-toggle-btn" @click.stop="toggle">
                    <q-icon :name="expanded ? 'expand_less' : 'expand_more'" />
                  </button>
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.level") }}</span>
                <span class="text-right">{{ data.hierarchy_level }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.registerTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.register_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.lastLoginTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.last_login_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("common.btn.point") }}</span>
                <span class="text-right">{{ moneyFormat(data.balance) }}</span>
              </div>
              <div
                v-if="isCredit || data.is_downline_search_available || data.is_direct_downline"
                class="expansion-detail-operation"
              >
                <div
                  class="manage-mobile-detail-actions"
                  :class="{ 'manage-mobile-detail-actions--single': getManageActionCount(data) === 1 }"
                >
                  <template v-if="isCredit">
                    <button
                      v-for="(option, optionIndex) in memberManagementStore.operationOptions"
                      :key="optionIndex"
                      type="button"
                      class="agent-center-action-btn"
                      :title="option.label"
                      @click.stop="
                        memberManagementStore.handlerClickOperation(
                          data.member_account,
                          data.member_id,
                          option.value,
                          data.is_member_agent,
                          data.balance,
                          data.remain_quota_amount
                        )
                      "
                    >
                      {{ option.label }}
                    </button>
                  </template>

                  <button
                    v-if="data.is_downline_search_available"
                    type="button"
                    class="agent-center-action-btn"
                    :title="$t('member.membershipManagement.viewSubordinateMember')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                        data.is_member_agent
                      )
                    "
                  >
                    {{ $t("member.membershipManagement.viewSubordinateMember") }}
                  </button>

                  <button
                    v-if="data.is_direct_downline"
                    type="button"
                    class="agent-center-action-btn"
                    :title="$t('common.btn.edit')"
                    @click.stop="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                        data.is_member_agent
                      )
                    "
                  >
                    {{ $t("common.btn.edit") }}
                  </button>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div v-else class="agent-center-empty">
      <img :src="orderImg('no-data.svg')" alt="no-data" class="agent-center-empty-img" />
      <span>{{ $t("tableHeader.noData") }}</span>
    </div>
  </div>

  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangePage"
      direction-links
      flat
      active-design="flat"
      color="deep-grey"
      active-color="blue-8"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, ref } from "vue"

const { isCredit: envIsCredit } = useEnv()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()
const isCredit = computed(() => envIsCredit.value)
const expandedManageKeys = ref<string[]>([])

const getManageRowKey = (row: { member_id?: number; member_account?: string }) =>
  String(row.member_id ?? row.member_account ?? "")

const getManageActionCount = (row: { is_downline_search_available?: boolean; is_direct_downline?: boolean }) =>
  (isCredit.value ? memberManagementStore.operationOptions.length : 0) +
  (row.is_downline_search_available ? 1 : 0) +
  (row.is_direct_downline ? 1 : 0)

const updateExpandedManageKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedManageKeys.value.includes(key)) {
      expandedManageKeys.value = [...expandedManageKeys.value, key]
    }
    return
  }

  expandedManageKeys.value = expandedManageKeys.value.filter((currentKey) => currentKey !== key)
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
