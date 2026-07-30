<template>
  <div>
    <p>{{ label ? $t(label) : "" }}</p>
    <q-input
      :hide-bottom-space="true"
      v-model="dateTimeRangeLabel"
      dense
      :outlined="withOutlined"
      :borderless="withBorderless"
      :label="inputLabel"
      :readonly="readonly"
      :disable="disable"
      @click="openDateTimePicker"
      :rules="[(value) => isWithinLimit || $t('error_msg.date_range_limit', { dateRangeLimit: dateRangeLimit })]"
    >
      <template #prepend>
        <q-icon name="event" size="16px" :class="{ 'cursor-pointer': !readonly }" />
        <q-popup-proxy
          ref="proxyPopup"
          cover
          no-parent-event
          transition-show="scale"
          transition-hide="scale"
          @show="onPopupShow"
          @hide="
            () => {
              isProxyShow = false
            }
          "
          v-if="!readonly"
          class="row"
        >
          <!-- 日期快速選擇 -->
          <div v-if="bindDateRange">
            <DateTimeQuickSelector v-model="props.dateTimeModel" :quick-selectors="props.quickSelectors" class="mr-4" />
          </div>
          <q-date v-model="bindDateRange" range mask="YYYY-MM-DD" minimal :options="dateOption">
            <template #default>
              <div v-if="bindDateRange && useTimePicker" class="q-gutter-md" style="max-width: 100%">
                <q-card flat>
                  <!-- 開始時間 -->
                  <div class="text-overline">
                    {{ bindDateRange.from ? bindDateRange.from : bindDateRange }}
                  </div>
                  <q-card-section horizontal class="align-center">
                    <q-select
                      v-model="bindFromHh"
                      :options="generateStringArray(23)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                    <span class="dots">：</span>
                    <q-select
                      v-model="bindFromMm"
                      :options="generateStringArray(59)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                    <span class="dots">：</span>
                    <q-select
                      v-model="bindFromSs"
                      :options="generateStringArray(59)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                  </q-card-section>

                  <!-- 結束時間 -->
                  <div class="text-overline">
                    {{ bindDateRange.to ? bindDateRange.to : bindDateRange }}
                  </div>
                  <q-card-section horizontal class="align-center">
                    <q-select
                      v-model="bindToHh"
                      :options="generateStringArray(23)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                    <span class="dots">：</span>
                    <q-select
                      v-model="bindToMm"
                      :options="generateStringArray(59)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                    <span class="dots">：</span>
                    <q-select
                      v-model="bindToSs"
                      :options="generateStringArray(59)"
                      outlined
                      inline
                      dense
                      options-dense
                      @update:model-value="updateDateTime"
                    ></q-select>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-date>
        </q-popup-proxy>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType, Ref } from "vue"
  import { ref, computed, watchEffect, nextTick } from "vue"
  import type { QDateProps } from "quasar"
  import { QPopupProxy } from "quasar"
  import { differenceInCalendarDays } from "date-fns"
  import DateTimeQuickSelector from "@/components/query/buttons/dateTimeQuickSelector.vue"
  import { DATE_TIME_QUICK_SELECTOR } from "@/utils/constants"

  const props = defineProps({
    dateTimeModel: {
      type: Object as PropType<{ from?: string; fromHms?: string; to?: string; toHms?: string }>,
      required: true,
      default: (value?: { from?: string; fromHms?: string; to?: string; toHms?: string }) => {
        return {
          from: value?.from || "",
          fromHms: value?.fromHms || "00:00:00",
          to: value?.to || "",
          toHms: value?.toHms || "23:59:59"
        }
      }
    },
    useLabel: {
      type: Boolean,
      required: false,
      default: true
    },
    label: {
      type: [String],
      required: false,
      default: "query_params.date_time_range"
    },
    inputLabel: {
      type: String,
      required: false,
      default: ""
    },
    onUpdateDateTime: {
      type: Function,
      required: false
    },
    withOutlined: {
      type: Boolean,
      required: false,
      default: true
    },
    withBorderless: {
      type: Boolean,
      required: false,
      default: false
    },
    useTimePicker: {
      type: Boolean,
      required: false,
      default: () => false
    },
    disable: {
      type: Boolean,
      required: false,
      default: () => false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    dateRangeLimit: {
      type: Number,
      required: false,
      default: () => 0
    },
    quickSelectors: {
      type: Array as PropType<DATE_TIME_QUICK_SELECTOR.Enums[]>,
      required: false,
      default: () => [
        DATE_TIME_QUICK_SELECTOR.Enums.Today,
        DATE_TIME_QUICK_SELECTOR.Enums.Yesterday,
        DATE_TIME_QUICK_SELECTOR.Enums.ThreeDaysBefore,
        DATE_TIME_QUICK_SELECTOR.Enums.ThisWeek,
        DATE_TIME_QUICK_SELECTOR.Enums.LastWeek,
        DATE_TIME_QUICK_SELECTOR.Enums.ThisMonth,
        DATE_TIME_QUICK_SELECTOR.Enums.LastMonth
      ]
    },
    dateOption: {
      type: [Function, Array] as PropType<QDateProps["options"]>,
      required: false,
      default: undefined
    }
  })

  const emitDateTimeUpdate = (payload: { from?: string; fromHms?: string; to?: string; toHms?: string }) => {
    props.onUpdateDateTime?.(payload)
  }

  function generateStringArray(n: number): string[] {
    return Array.from({ length: n + 1 }, (_, i) => i.toString().padStart(2, "0"))
  }

  const dateTimeRangeLabel = computed(() => {
    if (dateRange.value.from && dateRange.value.to) {
      if (!props.useTimePicker) {
        return `${dateRange.value.from} ~ ${dateRange.value.to}`
      }
      return `${dateRange.value.from} ${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value} ~ ${dateRange.value.to} ${bindToHh.value}:${bindToMm.value}:${bindToSs.value}`
    }
    return ""
  })

  /**
   * 用於中介，接收與傳輸至外層的 model
   *
   * 型別固定為 { from: string, to: string }
   */
  const dateRange = computed({
    get() {
      return props.dateTimeModel
    },
    set(value: { from?: string; fromHms?: string; to?: string; toHms?: string }) {
      emitDateTimeUpdate({
        ...value,
        fromHms: `${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value}`,
        toHms: `${bindToHh.value}:${bindToMm.value}:${bindToSs.value}`
      })
    }
  })

  /**
   * 因 q-date range 綁定的資料需要為 string 型別，才能顯示單一日期
   * 故使用 bindDateModel 作為 q-date 的 v-model
   *
   * 型別可能為 { from: string; to: string } 或 string
   */
  const bindDateRange = computed<any>({
    get() {
      if (dateRange.value.from === dateRange.value.to) {
        return dateRange.value.from
      }
      return {
        from: dateRange.value.from,
        to: dateRange.value.to
      }
    },
    set(value: { from?: string; to?: string } | string) {
      if (typeof value === "string") {
        dateRange.value = {
          from: value,
          to: value
        }
        return
      }

      dateRange.value = value
    }
  })

  /** 開始時間 */
  // 時
  const bindFromHh = computed<string>({
    get() {
      if (dateRange.value.fromHms) {
        return dateRange.value.fromHms.split(":")[0] || "00"
      }
      return "00"
    },
    set(value: string) {
      dateRange.value.fromHms = `${value}:${bindFromMm.value}:${bindFromSs.value}`
    }
  })

  // 分
  const bindFromMm = computed<string>({
    get() {
      if (dateRange.value.fromHms) {
        return dateRange.value.fromHms.split(":")[1] || "00"
      }
      return "00"
    },
    set(value: string) {
      dateRange.value.fromHms = `${bindFromHh.value}:${value}:${bindFromSs.value}`
    }
  })

  // 秒
  const bindFromSs = computed<string>({
    get() {
      if (dateRange.value.fromHms) {
        return dateRange.value.fromHms.split(":")[2] || "00"
      }
      return "00"
    },
    set(value: string) {
      dateRange.value.fromHms = `${bindFromHh.value}:${bindFromMm.value}:${value}`
    }
  })

  /** 結束時間 */
  // 時
  const bindToHh = computed<string>({
    get() {
      if (dateRange.value.toHms) {
        return dateRange.value.toHms.split(":")[0] || "23"
      }
      return "23"
    },
    set(value: string) {
      dateRange.value.toHms = `${value}:${bindToMm.value}:${bindToSs.value}`
    }
  })

  // 分
  const bindToMm = computed<string>({
    get() {
      if (dateRange.value.toHms) {
        return dateRange.value.toHms.split(":")[1] || "59"
      }
      return "59"
    },
    set(value: string) {
      dateRange.value.toHms = `${bindToHh.value}:${value}:${bindToSs.value}`
    }
  })

  // 秒
  const bindToSs = computed<string>({
    get() {
      if (dateRange.value.toHms) {
        return dateRange.value.toHms.split(":")[2] || "59"
      }
      return "59"
    },
    set(value: string) {
      dateRange.value.toHms = `${bindToHh.value}:${bindToMm.value}:${value}`
    }
  })

  watchEffect(() => {})

  const proxyPopup = ref() as Ref<QPopupProxy>
  const isProxyShow = ref(false)

  const onPopupShow = () => {
    isProxyShow.value = true
    // Firefox 的 visibility: collapse 修正
    nextTick(() => {
      const el = proxyPopup.value?.$el?.nextElementSibling || document.querySelector(".q-menu.q-position-engine")
      if (el && getComputedStyle(el).visibility === "collapse") {
        el.style.visibility = "visible"
        el.style.height = "auto"
      }
    })
  }

  const openDateTimePicker = () => {
    if (props.readonly) return
    if (!isProxyShow.value) {
      proxyPopup.value.show()
    } else {
      proxyPopup.value.hide()
    }
  }

  const updateDateTime = () => {
    emitDateTimeUpdate({
      ...dateRange.value,
      fromHms: `${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value}`,
      toHms: `${bindToHh.value}:${bindToMm.value}:${bindToSs.value}`
    })
  }
  // 計算日期區間不可超過dateRangeLimit
  const isWithinLimit = computed(() => {
    if (props.dateRangeLimit === 0) return true // 如果 dateRangeLimit 為 0，不做限制
    if (dateRange.value.from && dateRange.value.to) {
      const fromDate = new Date(dateRange.value.from)
      const toDate = new Date(dateRange.value.to)
      return differenceInCalendarDays(toDate, fromDate) < props.dateRangeLimit
    }
    return true
  })
</script>

<style lang="scss" scoped>
  .dots {
    display: flex;
    align-items: center;
  }
</style>
