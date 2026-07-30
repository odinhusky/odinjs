<template>
  <q-input class="q-mr-sm" dense filled :model-value="playerFormattedDateDisplay">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" @before-show="handlePopupBeforeShow">
          <div class="q-pa-sm" style="min-width: 300px">
            <q-date v-model="selectedDate" mask="YYYY-MM-DD" :options="optionsFn" />

            <!-- 時分秒下拉 -->

            <div class="row q-mt-sm q-col-gutter-sm">
              <q-select dense outlined v-model="hour" :options="filteredHours" label="時" class="col-4" />
              <q-select dense outlined v-model="minute" :options="filteredMinutes" label="分" class="col-4" />
              <q-select dense outlined v-model="second" :options="filteredSeconds" label="秒" class="col-4" />
            </div>

            <div class="row items-center justify-end q-mt-sm">
              <q-btn flat color="primary" :label="t('btn.check')" @click="applyDateTime" v-close-popup />
            </div>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>

  <q-btn-toggle
    v-model="activeToggle"
    class="btn_toggle_style"
    toggle-color="primary"
    unelevated
    rounded
    map-options
    :options="[
      { label: t('common.self_active'), value: false },

      { label: t('common.self_excluded'), value: true }
    ]"
    @update:model-value="handleActiveToggle"
  />
</template>

<script lang="ts" setup>
  import { computed, ref, watch, watchEffect } from "vue"

  import { useI18n } from "vue-i18n"

  import { date } from "quasar"

  const props = defineProps({
    exclusion_at: {
      type: [Number, null],

      required: true,

      default: 0
    },

    returnMs: { type: Boolean, default: true }
  })

  const emit = defineEmits(["update:parentValue"])

  const { t } = useI18n()

  const exclusionAtInMs = computed(() => {
    if (!props.exclusion_at) return 0
    return props.exclusion_at > 1e12 ? (props.exclusion_at as number) : (props.exclusion_at as number) * 1000
  })

  const playerFormattedDateDisplay = computed(() => {
    return exclusionAtInMs.value ? date.formatDate(exclusionAtInMs.value, "YYYY-MM-DD HH:mm:ss") : ""
  })

  const activeToggle = ref(false)

  const selectedDate = ref<string>("")

  const hour = ref<number>(23)

  const minute = ref<number>(59)

  const second = ref<number>(59)

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const seconds = Array.from({ length: 60 }, (_, i) => i)

  const buildCurrentTimeInfo = () => {
    const now = new Date()

    return {
      date: date.formatDate(now, "YYYY-MM-DD"),

      hour: now.getHours(),

      minute: now.getMinutes(),

      second: now.getSeconds()
    }
  }

  const currentTimeInfo = ref(buildCurrentTimeInfo())

  const updateCurrentTimeInfo = () => {
    currentTimeInfo.value = buildCurrentTimeInfo()
  }

  const getCurrentTimeInfo = () => currentTimeInfo.value

  const isTodaySelected = computed(() => {
    if (!selectedDate.value) return false

    return selectedDate.value === getCurrentTimeInfo().date
  })

  const filteredHours = computed(() => {
    if (!isTodaySelected.value) return hours

    const { hour: currentHour } = getCurrentTimeInfo()

    return hours.filter((value) => value >= currentHour)
  })

  const filteredMinutes = computed(() => {
    if (!isTodaySelected.value) return minutes

    const { hour: currentHour, minute: currentMinute } = getCurrentTimeInfo()

    if (hour.value === currentHour) {
      return minutes.filter((value) => value >= currentMinute)
    }

    return minutes
  })

  const filteredSeconds = computed(() => {
    if (!isTodaySelected.value) return seconds

    const { hour: currentHour, minute: currentMinute, second: currentSecond } = getCurrentTimeInfo()

    if (hour.value === currentHour && minute.value === currentMinute) {
      return seconds.filter((value) => value >= currentSecond)
    }

    return seconds
  })

  watchEffect(() => {
    const availableHours = filteredHours.value

    if (!availableHours.length) return

    if (!availableHours.includes(hour.value)) {
      hour.value = availableHours[0]
    }
  })

  watchEffect(() => {
    const availableMinutes = filteredMinutes.value

    if (!availableMinutes.length) return

    if (!availableMinutes.includes(minute.value)) {
      minute.value = availableMinutes[0]
    }
  })

  watchEffect(() => {
    const availableSeconds = filteredSeconds.value

    if (!availableSeconds.length) return

    if (!availableSeconds.includes(second.value)) {
      second.value = availableSeconds[0]
    }
  })

  watch(
    () => props.exclusion_at,

    (val) => {
      if (val === null) {
        val = Date.now()
      }

      const ms = (val as number) > 1e12 ? (val as number) : (val as number) * 1000

      const d = new Date(ms)

      selectedDate.value = date.formatDate(ms, "YYYY-MM-DD")

      hour.value = d.getHours()

      minute.value = d.getMinutes()

      second.value = d.getSeconds()

      if (props.exclusion_at && props.exclusion_at > Date.now()) {
        activeToggle.value = true
      } else {
        activeToggle.value = false
      }
    },

    { immediate: true }
  )

  const applyDateTime = () => {
    if (!selectedDate.value) return

    const [year, month, day] = selectedDate.value.split("-").map(Number)

    const selected = new Date(year, month - 1, day, hour.value, minute.value, second.value)

    const now = new Date()

    let finalDate = selected

    if (selected.getTime() <= now.getTime()) {
      finalDate = new Date(now.getTime() + 60 * 1000)

      selectedDate.value = date.formatDate(finalDate, "YYYY-MM-DD")

      hour.value = finalDate.getHours()

      minute.value = finalDate.getMinutes()

      second.value = finalDate.getSeconds()
    }

    emit("update:parentValue", props.returnMs ? finalDate.getTime() : Math.floor(finalDate.getTime() / 1000))
  }

  const optionsFn = (day: any) => {
    const today = date.formatDate(Date.now(), "YYYY/MM/DD")

    return day >= today
  }

  const handleActiveToggle = (exclude: boolean) => {
    if (!exclude) {
      emit("update:parentValue", null)
    }
  }

  const handlePopupBeforeShow = () => {
    updateCurrentTimeInfo()
  }
</script>

<style lang="scss" scoped></style>
