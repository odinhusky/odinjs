<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-white"
    table-header-class="bg-white"
    :rows="memberManagementStore.detailRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.detailColumns"
    row-key="id"
    hide-pagination
    flat
    class="detail-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchAccountAmount" class="search-form">
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
                <q-icon name="event" class="cursor-pointer" />
              </template>
              <q-menu
                ref="menuRef"
                @show="memberManagementStore.datePickerShow = true"
                @hide="memberManagementStore.datePickerShow = false"
              >
                <div class="data_wrapper">
                  <div class="date-picker-wrapper">
                    <div class="date-quick-btns">
                      <q-btn
                        v-for="item in dateShortcuts"
                        :key="item.days"
                        :label="item.label"
                        :class="{ active: activeShortcut === item.days }"
                        class="quick-btn"
                        dense
                        no-caps
                        @click="applyDateShortcut(item.days)"
                      />
                    </div>
                    <q-date
                      v-model="memberManagementStore.dateRange"
                      mask="YYYY-MM-DD"
                      range
                      color="primary"
                      class="r030-date-picker"
                      @range-end="hideMenu"
                    />
                  </div>
                </div>
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
              :options="memberManagementStore.changeTypeOptions"
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
        <q-td key="updated_at_unix" :props="props">
          <span>{{ formatUTCWithOffset(props.row.updated_at, envInfo.utc_offset) }}</span>
        </q-td>
        <q-td key="action_type" :props="props">
          <span>{{ memberManagementStore.searchTypeName(props.row.action_type) }}</span>
        </q-td>
        <q-td key="transaction_code" :props="props">
          <span>{{ props.row.transaction_code }}</span>
        </q-td>
        <q-td key="amount" :props="props">
          <span>{{ moneyFormat(props.row.amount) }}</span>
        </q-td>
        <q-td key="before_balance" :props="props">
          <span>{{ moneyFormat(props.row.before_balance) }}</span>
        </q-td>
        <q-td key="after_balance" :props="props">
          <span>{{ moneyFormat(props.row.after_balance) }}</span>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchAccountAmount" class="search-form">
      <div class="search-form-row">
        <div class="search-item">
          <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.startDate") }}</div>
          <q-input
            v-model="memberManagementStore.formattedStartDate"
            :placeholder="$t('placeholder.pleaseSelectDate')"
            readonly
            outlined
            standout="bg-grey-10 text-white"
            class="search-item-input date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <div class="data_wrapper">
                <q-date v-model="memberManagementStore.dateRange.from" mask="YYYY-MM-DD" color="primary" class="r030-date-picker" />
              </div>
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
            class="search-item-input date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" />
            </template>
            <q-menu
              ref="menuRef"
              @show="memberManagementStore.datePickerShow = true"
              @hide="memberManagementStore.datePickerShow = false"
            >
              <div class="data_wrapper">
                <q-date v-model="memberManagementStore.dateRange.to" mask="YYYY-MM-DD" color="primary" class="r030-date-picker" />
              </div>
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
            :options="memberManagementStore.changeTypeOptions"
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
    <q-list v-if="memberManagementStore.detailRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.detailRows"
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
                <div>{{ $t("menu.account") }}</div>
                <div class="text-gray">{{ data.member_account }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.accountType") }}</div>
                <div class="text-gray">{{ memberManagementStore.searchTypeName(data.action_type) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.amount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.accountChangeTime") }}</div>
                <div class="text-right">{{ formatUTCWithOffset(data.updated_at, envInfo.utc_offset) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.accountVariableObject") }}</div>
                <div class="text-right">{{ data.transaction_code }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.amountBeforeChanges") }}</div>
                <div class="text-right">{{ moneyFormat(data.before_balance) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.amountAfterChange") }}</div>
                <div class="text-right">{{ moneyFormat(data.after_balance) }}</div>
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
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnvInfoStore } from "src/stores/envStore"

const { envInfo } = useEnvInfoStore()
const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat, formatUTCWithOffset } = useCommon()
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

const activeShortcut = ref<number | null>(null)

const dateShortcuts = computed(() => [
  { label: t("common.btn.today2"), days: 0 },
  { label: `3${t("common.btn.days")}`, days: 3 },
  { label: t("common.btn.withinSevenDays"), days: 7 },
  { label: t("common.btn.withinThirtyDays"), days: 30 }
])

const padDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const applyDateShortcut = (days: number) => {
  activeShortcut.value = days
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  memberManagementStore.dateRange = days === 0
    ? padDate(end)
    : { from: padDate(start), to: padDate(end) }
  hideMenu()
}

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss">
@import "app/template/set_r030/assets/css/_variable.scss";
@import "app/template/set_r030/assets/css/date-picker.scss";
</style>

<style lang="scss" scoped>
@import "app/template/okbet/assets/css/membershipManagement.scss";
</style>
