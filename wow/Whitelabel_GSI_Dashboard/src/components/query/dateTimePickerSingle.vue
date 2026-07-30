<template>
  <div>
    <q-input
      ref="inputElement"
      :hide-bottom-space="true"
      v-model="dateTimeRangeLabel"
      :dense="withDense"
      :outlined="withOutlined"
      :borderless="withBorderless"
      :readonly="readonly"
      @click="openDateTimePicker"
    >
      <template #prepend>
        <q-icon name="event" :class="{ 'cursor-pointer': !readonly }" />
        <q-popup-proxy
          ref="proxyPopup"
          cover
          transition-show="jump-up"
          transition-hide="jump-down"
          @show="isProxyShow = true"
          @hide="isProxyShow = false"
          v-if="!readonly"
        >
          <q-date v-model="dateRange.from" mask="YYYY-MM-DD" minimal @update:model-value="updateDateTime">
            <template v-if="useTimePicker" #default>
              <div style="max-width: 100%">
                <q-card flat>
                  <!-- 開始時間 -->
                  <div class="text-overline text-datetip">
                    {{ dateTimeRangeLabel }}
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
  import { ref, computed, watchEffect } from "vue"
  import { QPopupProxy, QInput } from "quasar"

  const props = defineProps({
    dateTimeModel: {
      type: Object as PropType<{ from?: string; fromHms?: string }>,
      required: true,
      default: (value?: { from?: string; fromHms?: string }) => {
        return {
          from: value?.from || "",
          fromHms: value?.fromHms || "00:00:00"
        }
      }
    },
    label: {
      type: [String],
      required: false,
      default: "query_params.date_time_range"
    },
    onUpdateDateTime: {
      type: [Function],
      required: true,
      default: (value: { from: string; fromHms: string }) => {
        console.log(`function onUpdateDateTime is not exists.`)
      }
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
    withDense: {
      type: Boolean,
      required: false,
      default: false
    },
    useTimePicker: {
      type: Boolean,
      required: false,
      default: () => false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  function generateStringArray(n: number): string[] {
    return Array.from({ length: n + 1 }, (_, i) => i.toString().padStart(2, "0"))
  }

  const dateTimeRangeLabel = computed(() => {
    if (dateRange.value.from) {
      if (!props.useTimePicker) {
        return `${dateRange.value.from}`
      }
      return `${dateRange.value.from} ${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value}`
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
    set(value: { from?: string; fromHms?: string }) {
      props.onUpdateDateTime({
        ...value,
        fromHms: `${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value}`
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
      return {
        from: dateRange.value.from
      }
    },
    set(value: { from?: string } | string) {
      if (typeof value === "string") {
        dateRange.value.from = value
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

  watchEffect(() => {})

  const inputElement = ref() as Ref<QInput>
  const proxyPopup = ref() as Ref<QPopupProxy>
  const isProxyShow = ref(false)
  const openDateTimePicker = () => {
    if (props.readonly) return
    if (!isProxyShow.value) {
      proxyPopup.value.show()
    } else {
      inputElement.value.blur()
    }
  }

  const updateDateTime = () => {
    props.onUpdateDateTime({
      ...dateRange.value,
      fromHms: `${bindFromHh.value}:${bindFromMm.value}:${bindFromSs.value}`
    })
  }
</script>

<style lang="scss" scoped>
  .dots {
    display: flex;
    align-items: center;
  }
  .text-datetip {
    height: 1.875rem;
  }
</style>
