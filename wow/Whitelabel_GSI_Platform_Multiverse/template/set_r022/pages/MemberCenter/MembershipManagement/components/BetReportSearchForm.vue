<template>
  <q-form @submit.prevent="memberManagementStore.handlerSearchBetReport" class="search-form">
    <div class="search-form-row">
      <div class="search-item bet-report bet-report-date-search-item">
        <div class="search-item-label">{{ $t("member.summary.query_time") }}</div>
        <q-input
          v-model="formattedDateRange"
          :placeholder="$t('placeholder.pleaseSelectDate')"
          readonly
          dense
          standout="bg-grey-10 text-white"
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
              color="primary"
              minimal
              class="agent-center-date-picker"
              @range-end="hideMenu"
            />
          </q-menu>
        </q-input>
      </div>

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

      <div class="agent-center-search-actions">
        <q-btn
          :label="$t('common.btn.reset')"
          type="button"
          unelevated
          no-caps
          class="agent-center-reset-btn"
          @click="memberManagementStore.resetBetReportSearch"
        />
        <SearchButton :action="memberManagementStore.handlerSearchBetReport" />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { useMemberManagement } from "src/stores/useMemberManagement"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

import SearchButton from "./SearchButton.vue"

const { t } = useI18n()
const memberManagementStore = useMemberManagement()
const menuRef = ref(null)

const formattedDateRange = computed(() => {
  if (typeof memberManagementStore.dateRange === "string") {
    if (!memberManagementStore.dateRange) return ""
    return `${memberManagementStore.dateRange} ${t("common.btn.to")} ${memberManagementStore.dateRange}`
  } else {
    if (!memberManagementStore.dateRange?.from || !memberManagementStore.dateRange?.to) return ""
    return `${memberManagementStore.dateRange.from} ${t("common.btn.to")} ${memberManagementStore.dateRange.to}`
  }
})

const hideMenu = () => {
  ;(menuRef.value as any)?.hide()
}
</script>

<style lang="scss" scoped>
@import "app/template/set_r022/assets/css/membershipManagement.scss";
</style>
