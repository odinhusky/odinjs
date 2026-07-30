<template>
  <q-table
    v-if="!isMobile"
    :rows="memberManagementStore.creditQuotaRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.creditQuotaColumns"
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
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
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
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>