<template>
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.creditQuotaRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="creditQuotaColumns"
    row-key="trans_code"
    hide-pagination
    flat
    class="detail-table agent-center-table"
  >
    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchCreditQuotaHistory" class="search-form">
        <div class="search-form-row">
          <div class="search-item date-range">
            <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout
              class="search-item-input date"
            >
              <template #append>
                <q-icon name="calendar_month" class="cursor-pointer" />
              </template>
              <q-menu
                ref="menuRef"
                @show="memberManagementStore.datePickerShow = true"
                @hide="memberManagementStore.datePickerShow = false"
              >
                <q-date
                  v-model="memberManagementStore.dateRange"
                  mask="YYYY-MM-DD"
                  range
                  minimal
                  class="agent-center-date-picker"
                  @range-end="hideMenu"
                />
              </q-menu>
            </q-input>
          </div>

          <div class="search-item">
            <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout
              class="search-item-input account"
            />
          </div>

          <div class="search-item">
            <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
            <q-select
              v-model="memberManagementStore.changeType"
              :options="memberManagementStore.creditQuotaTypeOptions"
              :placeholder="$t('shareholder_platform.please_select')"
              emit-value
              map-options
              dense
              standout
              outlined
              borderless
              no-error-icon
              hide-bottom-space
              color="select"
              behavior="menu"
              options-dense
              class="agent-report-profile-select agent-report__currency-select search-item-input type"
              popup-content-class="agent-center-select-menu"
            />
          </div>

          <SearchButton :action="memberManagementStore.handlerSearchCreditQuotaHistory" />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">{{ props.row.member_account }}</q-td>
        <q-td key="created_at" :props="props">{{ formatDateTime(props.row.created_at) }}</q-td>
        <q-td key="type" :props="props">{{ memberManagementStore.creditQuotaTypeName(props.row.type) }}</q-td>
        <q-td key="account_variable_object" :props="props">
          {{ memberManagementStore.creditQuotaTypeName(props.row.type) }}
        </q-td>
        <q-td key="amount" :props="props">
          {{ formatCreditQuotaAmount(props.row.amount) }}
        </q-td>
        <q-td key="before_balance" :props="props">
          {{ formatCreditQuotaBalance(props.row.before_balance) }}
        </q-td>
        <q-td key="after_balance" :props="props">
          {{ formatCreditQuotaBalance(props.row.after_balance) }}
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

  <div v-else class="expansion-menu detail-expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchCreditQuotaHistory" class="search-form">
      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
          <q-input
            v-model="formattedDateRange"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            dense
            standout
            class="search-item-input date"
          >
            <template #append>
              <q-icon name="calendar_month" class="cursor-pointer" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date
                v-model="memberManagementStore.dateRange"
                mask="YYYY-MM-DD"
                range
                minimal
                class="agent-center-date-picker"
                @range-end="hideMenu"
              />
            </q-menu>
          </q-input>
        </div>
      </div>

      <div class="search-form-row detail-mobile-inline-row">
        <div class="search-item">
          <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout
            class="search-item-input account"
          />
        </div>

        <div class="search-item">
          <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
          <q-select
            v-model="memberManagementStore.changeType"
            :options="memberManagementStore.creditQuotaTypeOptions"
            :placeholder="$t('shareholder_platform.please_select')"
            emit-value
            map-options
            dense
            standout
            outlined
            borderless
            no-error-icon
            hide-bottom-space
            color="select"
            behavior="menu"
            options-dense
            class="agent-report-profile-select agent-report__currency-select search-item-input type"
            popup-content-class="agent-center-select-menu"
          />
        </div>
      </div>

      <div class="search-form-row">
        <SearchButton :action="memberManagementStore.handlerSearchCreditQuotaHistory" />
      </div>
    </q-form>

    <q-list v-if="memberManagementStore.creditQuotaRows?.length">
      <q-expansion-item
        v-for="data in memberManagementStore.creditQuotaRows"
        :key="getDetailRowKey(data)"
        :model-value="expandedDetailKeys.includes(getDetailRowKey(data))"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        hide-expand-icon
        class="expansion-item"
        @update:model-value="(expanded) => updateExpandedDetailKey(expanded, getDetailRowKey(data))"
      >
        <template v-slot:header="{ expanded, toggle }">
          <q-item-section class="expansion-header">
            <div class="manage-mobile-card-summary detail-mobile-card-summary">
              <div class="manage-mobile-summary-item">
                <div class="text-gray">{{ data.member_account }}</div>
                <div class="manage-mobile-summary-label">{{ $t("menu.userAccount") }}</div>
              </div>
              <div class="manage-mobile-summary-item text-right">
                <div class="manage-mobile-summary-value-row">
                  <div class="manage-mobile-summary-value-group">
                    <div class="text-gray">{{ formatCreditQuotaBalance(data.after_balance) }}</div>
                    <div class="manage-mobile-summary-label">{{ $t("tableHeader.amountAfterChange") }}</div>
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
                <div>{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="text-right">{{ formatDateTime(data.created_at) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.accountType") }}</div>
                <div class="text-right">{{ memberManagementStore.creditQuotaTypeName(data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.accountVariableObject") }}</div>
                <div class="text-right">{{ memberManagementStore.creditQuotaTypeName(data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.amount") }}</div>
                <div class="text-right">{{ formatCreditQuotaAmount(data.amount) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.amountBeforeChanges") }}</div>
                <div class="text-right">{{ formatCreditQuotaBalance(data.before_balance) }}</div>
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
      @update:model-value="memberManagementStore.handleChangeCreditQuotaPage"
      direction-links
      flat
      active-design="flat"
      color="deep-grey"
      active-color="orange-8"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { useSiteImg } from "src/common/hooks/useSiteImg"
import { useMemberManagement } from "src/stores/useMemberManagement"
import SearchButton from "./SearchButton.vue"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { formatDateTime } = useRfc3339()
const { orderImg } = useSiteImg()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)
const expandedDetailKeys = ref<string[]>([])

// set_r017 額度帳變明細欄位與共用 creditQuotaColumns（8 欄）不同：無流水號/異動項目欄，帳變對象以類型顯示，故於本版型自行定義
const creditQuotaColumns = computed(() => {
  return [
    {
      name: "member_account",
      label: t("menu.userAccount"),
      field: "member_account",
      align: "center" as const,
    },
    {
      name: "created_at",
      label: t("tableHeader.accountChangeTime"),
      field: "created_at",
      align: "center" as const,
    },
    { name: "type", label: t("tableHeader.accountType"), field: "type", align: "center" as const },
    {
      name: "account_variable_object",
      label: t("tableHeader.accountVariableObject"),
      field: "type",
      align: "center" as const,
    },
    { name: "amount", label: t("tableHeader.amount"), field: "amount", align: "center" as const },
    {
      name: "before_balance",
      label: t("tableHeader.amountBeforeChanges"),
      field: "before_balance",
      align: "center" as const,
    },
    {
      name: "after_balance",
      label: t("tableHeader.amountAfterChange"),
      field: "after_balance",
      align: "center" as const,
    },
  ]
})

const getDetailRowKey = (row: { trans_code?: string; created_at?: string; member_account?: string }) =>
  row.trans_code || `${row.created_at ?? ""}-${row.member_account ?? ""}`

const updateExpandedDetailKey = (expanded: boolean, key: string) => {
  if (expanded) {
    if (!expandedDetailKeys.value.includes(key)) {
      expandedDetailKeys.value = [...expandedDetailKeys.value, key]
    }
    return
  }

  expandedDetailKeys.value = expandedDetailKeys.value.filter((currentKey) => currentKey !== key)
}

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${memberManagementStore.dateRange}`
  }

  if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
  return `${memberManagementStore.dateRange.from} ${t("common.btn.to")} ${memberManagementStore.dateRange.to}`
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}

const formatCreditQuotaAmount = (amount: string) => {
  return moneyFormat(Math.abs(Number(amount || 0)))
}

const formatCreditQuotaBalance = (amount: string | null) => {
  if (amount === null) return "-"
  return moneyFormat(amount)
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r017/assets/css/membershipManagement.scss";

.agent-report-profile-select {
  width: 100%;

  :deep(.q-field__control) {
    min-height: 2.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    border: 2px solid var(--input-dropdown-text-03);
    border-radius: 0.5rem;
    background: var(--input-dropdown-bg-01) !important;
    box-shadow: 0 2px 4px 0 #00000080;

    &::before,
    &::after {
      border: 0 !important;
    }
  }

  :deep(.q-field__control-container) {
    padding-top: 0;
  }

  :deep(.q-field__native),
  :deep(.q-field__input) {
    padding: 0;
    color: var(--input-dropdown-text-01) !important;
    font-family: "Noto Sans TC", sans-serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.1875rem;
  }

  :deep(.q-field__append),
  :deep(.q-select__dropdown-icon) {
    color: var(--input-dropdown-text-01) !important;
  }
}

@media (max-width: 768px) {
  .detail-expansion-menu .search-form-row {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: stretch !important;
    gap: 0.625rem !important;
  }

  .detail-expansion-menu .search-form-row > .search-item {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    flex: 1 0 auto !important;
  }

  .detail-expansion-menu .search-form-row > .search-item .search-item-input {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
  }

  .detail-table .search-form-row {
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-items: stretch !important;
    gap: 0.625rem !important;
  }

  .detail-table .search-form-row > .search-item,
  .detail-table .search-form-row > .search-item.date-range {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    flex: 1 0 auto !important;
  }

  .detail-table .search-form-row > .search-item .search-item-input {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
  }

  .detail-table .search-form-row :deep(.agent-center-search-btn),
  .detail-expansion-menu :deep(.agent-center-search-btn) {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    margin-left: 0 !important;
    align-self: stretch !important;
    flex: 1 0 auto !important;
  }

  .detail-expansion-menu .detail-mobile-inline-row {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.625rem !important;
    align-items: stretch !important;
  }

  .detail-expansion-menu .detail-mobile-inline-row > .search-item {
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    flex: none !important;
  }
}
</style>
