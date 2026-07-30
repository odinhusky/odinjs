<template>
  <q-input class="q-mr-sm" dense filled :model-value="playerFormattedDateDisplay">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <div class="q-pa-sm" style="min-width: 300px">
            <q-date v-model="selectedDate" mask="YYYY-MM-DD" />

            <!-- 時分秒下拉 -->
            <div class="row q-mt-sm q-col-gutter-sm">
              <q-select dense outlined v-model="hour" :options="hours" label="時" class="col-4" />
              <q-select dense outlined v-model="minute" :options="minutes" label="分" class="col-4" />
              <q-select dense outlined v-model="second" :options="seconds" label="秒" class="col-4" />
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
    readonly
    :model-value="isPlayerSelfExcluded()"
    class="btn_toggle_style"
    toggle-color="primary"
    unelevated
    rounded
    map-options
    :options="[
      { label: t('common.self_active'), value: false },
      { label: t('common.self_excluded'), value: true }
    ]"
  />
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from "vue"
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

  const selectedDate = ref<string>("")
  const hour = ref<number>(23)
  const minute = ref<number>(59)
  const second = ref<number>(59)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

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
    },
    { immediate: true }
  )

  const applyDateTime = () => {
    if (!selectedDate.value) return

    const [year, month, day] = selectedDate.value.split("-").map(Number)
    const d = new Date(year, month - 1, day, hour.value, minute.value, second.value)

    //emit("update:parentValue", Math.floor(d.getTime() / 1000))
    emit("update:parentValue", props.returnMs ? d.getTime() : Math.floor(d.getTime() / 1000))
  }

  const isPlayerSelfExcluded = () => {
    const nowEnd = new Date()
    nowEnd.setHours(23, 59, 59, 0)
    if (!exclusionAtInMs.value) return false
    return (exclusionAtInMs.value as number) >= nowEnd.getTime()
  }
</script>

<style lang="scss" scoped></style>
