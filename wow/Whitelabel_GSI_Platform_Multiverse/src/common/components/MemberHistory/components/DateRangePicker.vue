<template>
  <div class="row items-center no-wrap q-gutter-sm">
    <q-btn unelevated :ripple="false" class="date-trigger">
      <span class="label">{{ labelText }}</span>
      <q-icon name="fa-solid fa-calendar" class="q-ml-sm cursor-pointer icon-calendar"> </q-icon>

      <q-popup-proxy
        transition-show="jump-down"
        transition-hide="jump-up"
        anchor="bottom right"
        self="top right"
        class="member-history-date-popup"
        :offset="[0, 8]"
      >
        <q-card class="date-pop member-history-date-pop q-pa-md">
          <div class="date-pop-body row q-col-gutter-md">
            <div class="date-pop-calendar col-12 col-sm-7">
              <q-btn-toggle
                v-model="historyState.query.dateType"
                class="q-mb-md toggle-date-picker member-history-date-shortcuts font"
                no-caps
                unelevated
                spread
                toggle-color="primary"
                :options="dayTypeTabs"
              />

              <q-date
                class="member-history-q-date"
                v-model="dateValue"
                flat
                range
                dark
                mask="YYYY-MM-DD"
                color="date"
              />
            </div>
          </div>
        </q-card>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { REPORT_DATE_TYPES } from "src/common/utils/constants"
import { useI18n } from "vue-i18n"

type Range = { from: string; to: string }

const historyState = inject("historyState") as any

const { t } = useI18n()

const datePickerValue = defineModel<Range>({ required: true })

// q-date range 模式，選同一天時會直接回傳一個字串，故在此進行轉換
const dateValue = computed({
  get: () => {
    const val = datePickerValue.value
    // 當 from === to 時，直接回傳字串讓 q-date 正確顯示高亮樣式
    if (val?.from && val.from === val.to) {
      return val.from
    }
    return val
  },
  set: (val: Range | string) => {
    if (typeof val === "string") {
      // 同一天選擇時，q-date 回傳字串
      datePickerValue.value = { from: val, to: val }
    } else {
      datePickerValue.value = val
    }
  }
})

const dayTypeTabs = computed(() => [
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Today]),
    value: REPORT_DATE_TYPES.Enums.Today
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.Yesterday]),
    value: REPORT_DATE_TYPES.Enums.Yesterday
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastSevenDays]),
    value: REPORT_DATE_TYPES.Enums.LastSevenDays
  },
  {
    label: t(REPORT_DATE_TYPES.I18nKeys[REPORT_DATE_TYPES.Enums.LastThirtyDays]),
    value: REPORT_DATE_TYPES.Enums.LastThirtyDays
  }
])

const labelText = computed(() => `${datePickerValue.value.from} ~ ${datePickerValue.value.to}`)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.date-trigger {
  align-items: center;
  justify-content: center;
  font-size: inherit;
  font-weight: inherit;
  margin: 0;

  :deep(.row) {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  @include phone-width {
    width: 100%;
    display: flex;
    align-items: flex-start;

    :deep(.row) {
      display: flex;
      width: 100%;

      .label {
        flex: 1;
        align-items: center;
        justify-content: flex-start;
        display: flex;
      }
    }
  }

  .icon-calendar {
    font-size: 1rem;
  }
}

.date-pop {
  background: var(--dialog-bg);
  max-width: 340px;

  @media (max-width: 767px) {
    max-width: 100%;
  }

  :deep(.toggle-date-picker) {
    width: 100% !important;
    max-width: 310px;
    display: flex !important;
    flex-wrap: wrap;
    gap: 0.625rem;

    .q-btn {
      min-height: auto;
      background: var(--tab-bg-04);
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--tab-text-01);
      border-radius: 50em !important;
      flex: unset;

      &.bg-primary {
        background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
      }
    }
  }
}
</style>

<style lang="scss">
.date-pop .toggle-date-picker .q-btn {
  min-width: 0;
  overflow: hidden;

  .q-btn__content {
    flex-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
