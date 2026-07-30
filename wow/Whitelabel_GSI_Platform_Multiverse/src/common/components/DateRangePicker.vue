<template>
  <q-input v-model="displayValue" v-bind="filteredAttrs" :class="mergedClass" :input-class="props.inputClass" readonly>
    <template v-slot:append>
      <q-icon name="event" :class="props.iconClass">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <!-- 用 :style 注入 --q-primary，讓 q-date 的 header 背景、選中日期背景都跟 dateColor 走 -->
          <div :style="dateColorStyle">
            <q-date
              range
              v-model="internalDateRange"
              mask="YYYY-MM-DD"
              :options="wrappedOptions"
              color="primary"
              :text-color="dateTextColor"
              :dark="resolvedDark"
              @range-start="wrappedOnRangeStart"
              @range-end="wrappedOnRangeEnd"
              @update:modelValue="handleDateRangeUpdate"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, watch, ref, useAttrs } from "vue"
import { useQuasar } from "quasar"
import { useDateRangePicker, type DateObject } from "src/common/composables/useDateRangePicker"

export type DateRange = { from: string; to: string }

/** q-date 內部可能為字串（同天）或未完成 range；對外僅使用 DateRange */
type QDateModelValue = DateRange | string | null

interface Props {
  modelValue?: DateRange | string | null
  maxDays?: number
  disableFutureDates?: boolean
  inputClass?: string
  iconClass?: string
  dateColor?: string
  dateTextColor?: string
  dateDark?: boolean // 不傳則自動跟隨 Quasar dark mode
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  maxDays: 3,
  disableFutureDates: true,
  inputClass: undefined,
  iconClass: "cursor-pointer self-center",
  dateColor: "#1976D2",
  dateTextColor: "white",
  dateDark: undefined // undefined = 自動偵測
})

const $q = useQuasar()

const resolvedDark = computed(() => (props.dateDark !== undefined ? props.dateDark : $q.dark.isActive))

const emit = defineEmits<{
  "update:modelValue": [value: DateRange | null]
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})

const mergedClass = computed(() => {
  const attrsClass = attrs.class
  const propsClass = props.inputClass

  if (!attrsClass && !propsClass) return undefined
  if (!attrsClass) return propsClass
  if (!propsClass) return attrsClass

  if (typeof attrsClass === "string" && typeof propsClass === "string") {
    return `${attrsClass} ${propsClass}`
  }

  if (Array.isArray(attrsClass)) {
    return [...attrsClass, propsClass]
  }

  if (typeof attrsClass === "object") {
    return { ...attrsClass, [propsClass]: true }
  }

  return propsClass
})

const displayValue = computed(() => {
  const range = normalizeParentRange(props.modelValue)
  if (range) return `${range.from} - ${range.to}`
  return ""
})

const dateColorStyle = computed(() => {
  if (!props.dateColor) return {}

  const isQuasarColorName = /^[a-zA-Z]/.test(props.dateColor) && !props.dateColor.startsWith("#")
  const resolvedColor = isQuasarColorName ? `var(--q-${props.dateColor})` : props.dateColor

  return {
    "--q-primary": resolvedColor
  } as Record<string, string>
})

const {
  dateRange: composableDateRange,
  onRangeStart,
  onRangeEnd,
  options
} = useDateRangePicker({
  maxDays: props.maxDays,
  disableFutureDates: props.disableFutureDates
})

const internalDateRange = ref<QDateModelValue>(null)
const isUpdatingFromModel = ref(false)

/** 將對外 model（含舊版字串）正規化為 { from, to } */
function normalizeParentRange(value: DateRange | string | null | undefined): DateRange | null {
  if (!value) return null
  if (typeof value === "string") return { from: value, to: value }
  if (value.from && value.to) return { from: value.from, to: value.to }
  return null
}

function isDateRangeEqual(a: DateRange | null, b: DateRange | null): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  return a.from === b.from && a.to === b.to
}

/**
 * 將 q-date 的 value 轉成可 emit 給父層的 range。
 * - `incomplete`：選取中（僅 from 或僅 to），不通知父層
 */
function toParentRange(value: QDateModelValue): DateRange | null | "incomplete" {
  if (!value) return null
  if (typeof value === "string") return { from: value, to: value }
  if (value.from && value.to) return { from: value.from, to: value.to }
  return "incomplete"
}

const convertToSlashFormat = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null
  return dateStr.replace(/-/g, "/")
}

const syncToComposable = (dateRange: DateRange | null) => {
  if (!dateRange) {
    composableDateRange.value = null
    return
  }

  composableDateRange.value = {
    from: convertToSlashFormat(dateRange.from) || "",
    to: convertToSlashFormat(dateRange.to) || ""
  } as any
}

const wrappedOptions = (dateStr: string) => {
  const slashFormat = convertToSlashFormat(dateStr)
  if (!slashFormat) return false
  return options(slashFormat)
}

const wrappedOnRangeStart = (dateInput: DateObject) => {
  onRangeStart(dateInput)
}

const wrappedOnRangeEnd = () => {
  onRangeEnd()
}

function emitParentRange(range: DateRange | null) {
  if (isDateRangeEqual(range, normalizeParentRange(props.modelValue))) {
    return
  }
  emit("update:modelValue", range)
  syncToComposable(range)
}

const handleDateRangeUpdate = (value: QDateModelValue, reason?: string) => {
  if (isUpdatingFromModel.value) {
    return
  }

  // Quasar 同天選取前會先 remove-range：只更新 q-date 綁定，不把父層清成 null
  if (reason === "remove-range") {
    internalDateRange.value = value
    return
  }

  internalDateRange.value = value

  const parentRange = toParentRange(value)
  if (parentRange === "incomplete") {
    return
  }

  emitParentRange(parentRange)
}

watch(
  () => props.modelValue,
  (newValue) => {
    const normalized = normalizeParentRange(newValue)
    const internalAsRange =
      typeof internalDateRange.value === "string"
        ? normalizeParentRange(internalDateRange.value)
        : internalDateRange.value?.from && internalDateRange.value?.to
          ? { from: internalDateRange.value.from, to: internalDateRange.value.to }
          : null

    if (isDateRangeEqual(normalized, internalAsRange)) {
      return
    }

    isUpdatingFromModel.value = true
    try {
      if (normalized) {
        // 與 q-date 同天字串格式相容：起訖相同時用字串綁定內部
        internalDateRange.value =
          normalized.from === normalized.to ? normalized.from : { from: normalized.from, to: normalized.to }
        syncToComposable(normalized)
      } else {
        internalDateRange.value = null
        composableDateRange.value = null
      }
    } finally {
      isUpdatingFromModel.value = false
    }
  },
  { immediate: true, deep: true }
)
</script>
