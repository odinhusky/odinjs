<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-white"
    table-header-class="bg-white"
    :rows="memberManagementStore.creditQuotaRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.creditQuotaColumns"
    row-key="trans_code"
    hide-pagination
    flat
    class="detail-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchCreditQuotaHistory" class="search-form">
        <div class="search-form-row">
          <div class="search-item">
            <div class="search-item-label">{{ $t("member.profile.date") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input date border-b-gray-300 border-b"
            >
              <template v-slot:append>
                <q-icon
                  :name="memberManagementStore.datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'"
                  class="cursor-pointer"
                />
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
                  color="primary"
                  minimal
                  @range-end="hideMenu"
                />
              </q-menu>
            </q-input>
          </div>
        </div>

        <div class="search-form-row">
          <div class="search-item">
            <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account"
            />
          </div>

          <div class="search-item">
            <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
            <q-select
              v-model="memberManagementStore.changeType"
              :options="memberManagementStore.creditQuotaTypeOptions"
              :placeholder="$t('shareholder_platform.please_select')"
              dense
              emit-value
              map-options
              standout="text-black"
              class="search-item-input type"
            />
          </div>

          <q-btn :label="$t('common.btn.search')" text-color="white" unelevated class="search-btn" type="submit" />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="created_at" :props="props">
          <span>{{ formatDateTime(props.row.created_at) }}</span>
        </q-td>
        <q-td key="type" :props="props">
          <span>{{ memberManagementStore.creditQuotaTypeName(props.row.type) }}</span>
        </q-td>
        <q-td key="trans_code" :props="props">
          <span>{{ props.row.trans_code }}</span>
        </q-td>
        <q-td key="change_item" :props="props">
          <span>{{ memberManagementStore.creditQuotaItemName(props.row.type) }}</span>
        </q-td>
        <q-td key="amount" :props="props">
          <span :class="creditQuotaAmountClass(props.row.type)">
            {{ formatCreditQuotaAmount(props.row.amount, props.row.type) }}
          </span>
        </q-td>
        <q-td key="before_balance" :props="props">
          <span>{{ formatCreditQuotaBalance(props.row.before_balance, props.row.type) }}</span>
        </q-td>
        <q-td key="after_balance" :props="props">
          <span>{{ formatCreditQuotaBalance(props.row.after_balance, props.row.type) }}</span>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchCreditQuotaHistory" class="search-form">
      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.startDate") }}</div>
          <q-input
            v-model="memberManagementStore.formattedStartDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            outlined
            standout="bg-grey-10 text-white"
            class="search-item-input date !h-[3.6rem]"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date v-model="memberManagementStore.dateRange.from" mask="YYYY-MM-DD" color="primary" minimal />
            </q-menu>
          </q-input>
        </div>
        <div class="search-item">
          <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.endDate") }}</div>
          <q-input
            v-model="memberManagementStore.formattedEndDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            outlined
            standout="bg-grey-10 text-white"
            class="search-item-input date !h-[3.6rem]"
          >
            <template v-slot:append>
              <q-icon name="calendar_month" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <q-date v-model="memberManagementStore.dateRange.to" mask="YYYY-MM-DD" color="primary" minimal />
            </q-menu>
          </q-input>
        </div>
      </div>

      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout="text-black"
            class="search-item-input account"
          />
        </div>

        <div class="search-item">
          <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
          <q-select
            v-model="memberManagementStore.changeType"
            :options="memberManagementStore.creditQuotaTypeOptions"
            :placeholder="$t('shareholder_platform.please_select')"
            dense
            emit-value
            map-options
            standout="text-black"
            class="search-item-input type"
          />
        </div>

        <q-btn :label="$t('common.btn.search')" text-color="white" unelevated class="search-btn" type="submit" />
      </div>
    </q-form>
    <q-list v-if="memberManagementStore.creditQuotaRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.creditQuotaRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        class="expansion-item"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.creditQuotaMemberAccount") }}</div>
                <div class="text-gray">{{ data.member_account }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.accountType") }}</div>
                <div class="text-gray">{{ memberManagementStore.creditQuotaTypeName(data.type) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.creditQuotaAmount") }}</div>
                <div class="text-gray" :class="creditQuotaAmountClass(data.type)">
                  {{ formatCreditQuotaAmount(data.amount, data.type) }}
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="text-right">{{ formatDateTime(data.created_at) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.creditQuotaTransCode") }}</div>
                <div class="text-right">{{ data.trans_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.changeItem") }}</div>
                <div class="text-right">{{ memberManagementStore.creditQuotaItemName(data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.creditQuotaBeforeBalance") }}</div>
                <div class="text-right">{{ formatCreditQuotaBalance(data.before_balance, data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.creditQuotaAfterBalance") }}</div>
                <div class="text-right">{{ formatCreditQuotaBalance(data.after_balance, data.type) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="q-expansion-item flex justify-center items-center !bg-white !mb-0">
      <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangeCreditQuotaPage"
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
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { CREDIT_QUOTA_HISTORY_TYPE } from "src/common/utils/constants"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const { formatDateTime } = useRfc3339()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${
      memberManagementStore.dateRange
    }`
  } else {
    if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
    return `${memberManagementStore.dateRange.from} ${t("common.btn.to")} ${
      memberManagementStore.dateRange.to
    }`
  }
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}

const isPositiveCreditQuotaType = (type: number) => CREDIT_QUOTA_HISTORY_TYPE.POSITIVE_TYPES.includes(type)

const creditQuotaAmountClass = (type: number) => {
  return isPositiveCreditQuotaType(type) ? "amount-positive" : "amount-negative"
}

const formatCreditQuotaAmount = (amount: string, type: number) => {
  const prefix = isPositiveCreditQuotaType(type) ? "+" : "-"
  return `${prefix}${moneyFormat(Math.abs(Number(amount || 0)))}`
}

// 代理額度類無帳變前後紀錄，依決議一律顯示 "-"
const formatCreditQuotaBalance = (amount: string | null, type: number) => {
  if (CREDIT_QUOTA_HISTORY_TYPE.QUOTA_TYPES.includes(type) || amount === null) return "-"
  return moneyFormat(amount)
}

</script>

<style lang="scss" scoped>
.amount-positive {
  color: #0fa958;
}

.amount-negative {
  color: #e02020;
}
</style>
