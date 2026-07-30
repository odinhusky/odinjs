<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-white"
    table-header-class="bg-white"
    :rows="memberManagementStore.betReportRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.betReportColumns"
    row-key="id"
    hide-pagination
    flat
    class="bet-report-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
        <div class="search-form-row">
          <div class="search-item bet-report">
            <div class="search-item-label bet-report">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account bet-report"
            />
          </div>

          <div class="search-item bet-report">
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

          <q-btn
            :label="$t('common.btn.search')"
            text-color="white"
            unelevated
            class="search-btn bet-report"
            type="submit"
          />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span
            class="cursor-pointer text-[#025BE8]"
            @click="memberManagementStore.searchAccountBetReport(props.row.member_account)"
          >
            {{ props.row.member_account }}
          </span>
        </q-td>
        <q-td key="bet_count" :props="props">
          <span>{{ props.row.bet_count }}</span>
        </q-td>
        <q-td key="win_count" :props="props">
          <span>{{ props.row.win_count }}</span>
        </q-td>
        <q-td key="bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.bet_amount) }}</span>
        </q-td>
        <q-td key="valid_bet_amount" :props="props">
          <span>{{ moneyFormat(props.row.valid_bet_amount) }}</span>
        </q-td>
        <q-td key="payout" :props="props">
          <span>{{ moneyFormat(props.row.payout) }}</span>
        </q-td>
        <q-td key="profit" :props="props">
          <span>{{ moneyFormat(props.row.profit) }}</span>
        </q-td>
        <q-td key="profit_rate" :props="props">
          <span>{{ `${props.row.profit_rate}%` }}</span>
        </q-td>
        <q-td key="bonus" :props="props">
          <span>{{ props.row.bonus }}</span>
        </q-td>
      </q-tr>
    </template>

    <template v-if="memberManagementStore.betReportRows?.length" #bottom-row>
      <q-tr class="page-total">
        <q-td>{{ $t("menu.pageTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryList" :key="index">{{ item }}</q-td>
      </q-tr>
      <q-tr class="search-result-total">
        <q-td>{{ $t("menu.searchTotal") }}</q-td>
        <q-td v-for="(item, index) in memberManagementStore.betReportSummaryTotalList" :key="index">{{ item }}</q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span class="no-data">{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
      <div class="search-form-row mb-5">
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
      </div>

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

        <q-btn
          :label="$t('common.btn.search')"
          text-color="white"
          unelevated
          class="search-btn bet-report"
          type="submit"
        />
      </div>
    </q-form>
    <q-list v-if="memberManagementStore.betReportRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.betReportRows"
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
                <div>{{ $t("menu.userAccount") }}</div>
                <div class="text-gray" @click="memberManagementStore.searchAccountBetReport(data.member_account)">
                  {{ data.member_account }}
                </div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("member.referralRebate.profit") }}</div>
                <div class="text-gray">{{ moneyFormat(data.profit) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.bettingAmount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.bet_amount) }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.validBetAmount") }}</div>
                <div class="text-gray">{{ moneyFormat(data.valid_bet_amount) }}</div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.orderQuantity") }}</div>
                <div class="text-right">{{ data.bet_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.winningNumber") }}</div>
                <div class="text-right">{{ data.win_count }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("common.payout") }}</div>
                <div class="text-right">{{ moneyFormat(data.payout) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.profitRatio") }}</div>
                <div class="text-right">{{ `${data.profit_rate}%` }}</div>
              </div>
              <div class="expansion-detail-item">
                <div class="mb-1">{{ $t("tableHeader.activityBonus") }}</div>
                <div class="text-right">{{ data.bonus }}</div>
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
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
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
