<template>
  <q-form @submit.prevent="memberManagementStore.handlerSearchCreditQuotaHistory" class="search-form">
    <div class="search-form-row">
      <div class="search-item">
        <div class="search-item-label">{{ $t("member.profile.date") }}</div>
        <q-input
          v-model="memberManagementStore.formattedDateRange"
          :placeholder="$t('placeholder.pleaseSelectDate')"
          readonly
          dense
          standout="bg-grey-10 text-white"
          class="search-item-input date"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" />
          </template>
          <q-menu ref="menuRef">
            <q-date v-model="memberManagementStore.dateRange" mask="YYYY-MM-DD" range minimal @range-end="hideMenu" />
          </q-menu>
        </q-input>
      </div>

      <div class="search-item">
        <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
        <q-input
          v-model="memberManagementStore.memberAccount"
          :placeholder="$t('placeholder.pleaseEnterUserAccount')"
          dense
          standout="bg-grey-10 text-white"
          class="search-item-input"
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
          standout="bg-grey-10 text-white"
          class="search-item-input"
        />
      </div>

      <q-btn
        :label="$t('common.btn.searchBtn')"
        color="black"
        text-color="white"
        unelevated
        class="search-btn"
        type="submit"
      />
    </div>
  </q-form>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-[#222222] text-white"
    table-header-class="bg-black text-white"
    :rows="memberManagementStore.creditQuotaRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.creditQuotaColumns"
    row-key="trans_code"
    hide-pagination
    flat
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
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
    <q-list v-if="memberManagementStore.creditQuotaRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.creditQuotaRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.creditQuotaMemberAccount") }}</div>
                <div>{{ data.member_account }}</div>
              </div>
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.accountType") }}</div>
                <div>{{ memberManagementStore.creditQuotaTypeName(data.type) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.creditQuotaAmount") }}</div>
                <div :class="creditQuotaAmountClass(data.type)">
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
                <div>{{ $t("tableHeader.accountChangeTime") }}</div>
                <div>{{ formatDateTime(data.created_at) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.creditQuotaTransCode") }}</div>
                <div>{{ data.trans_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.changeItem") }}</div>
                <div>{{ memberManagementStore.creditQuotaItemName(data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.creditQuotaBeforeBalance") }}</div>
                <div>{{ formatCreditQuotaBalance(data.before_balance, data.type) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.creditQuotaAfterBalance") }}</div>
                <div>{{ formatCreditQuotaBalance(data.after_balance, data.type) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="q-expansion-item flex justify-center items-center">
      <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      direction-links
      push
      color="pagination"
      icon-prev="keyboard_double_arrow_left"
      icon-next="keyboard_double_arrow_right"
      @update:model-value="memberManagementStore.handleChangeCreditQuotaPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { CREDIT_QUOTA_HISTORY_TYPE } from "src/common/utils/constants"

const { moneyFormat } = useCommon()
const { formatDateTime } = useRfc3339()
const { isMobile } = useMediaQuery()
const memberManagementStore = useMemberManagement()

const menuRef = ref(null)

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
@import "app/template/set_amuse/assets/css/membershipManagement.scss";

.amount-positive {
  color: #0fa958;
}

.amount-negative {
  color: #e02020;
}
</style>
