<template>
  <div v-if="quickSelectors.length" class="quick-select-wrapper">
    <q-btn-group push>
      <q-btn
        v-for="select in quickSelectors"
        push
        v-bind="attrs"
        class="btn-quick-select"
        :class="actionEffect(select) ? 'bg-success text-white' : undefined"
        @click="onAction(select)"
      >
        {{ $t(CONSTANTS.DATE_TIME_QUICK_SELECTOR.I18nKeys[select] || "common.unknow") }}
      </q-btn>
    </q-btn-group>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, defineModel, useAttrs } from "vue"
  import * as CONSTANTS from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import {} from "quasar"
  import { addDays, format } from "date-fns"
  const { genTimeFormat, genThreeDayBefore, genThisWeek, genLastWeek, genThisMonth, genLastMonth } = useCommon()

  const props = defineProps({
    quickSelectors: {
      type: Array as PropType<CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums[]>,
      required: false,
      default: () => {
        return []
      }
    }
  })

  const attrs = useAttrs()

  interface IDateTime {
    from?: string
    fromHms?: string
    to?: string
    toHms?: string
  }
  const model = defineModel<IDateTime>({ default: () => ({}) })

  function onToday() {
    const now = new Date()
    const date = format(now, "yyyy-MM-dd")
    model.value.from = date
    model.value.fromHms = "00:00:00"
    model.value.to = date
    model.value.toHms = "23:59:59"
    return
  }

  function onYesterday() {
    const now = new Date()
    const date = format(addDays(now, -1), "yyyy-MM-dd")
    model.value.from = date
    model.value.fromHms = "00:00:00"
    model.value.to = date
    model.value.toHms = "23:59:59"
    return
  }

  function onThreeDayBefore() {
    const { from, to } = genThreeDayBefore()
    model.value.from = from
    model.value.fromHms = `00:00:00`
    model.value.to = to
    model.value.toHms = `23:59:59`
    return
  }

  function onThisWeek() {
    const { from, to } = genThisWeek()
    model.value.from = from
    model.value.fromHms = `00:00:00`
    model.value.to = to
    model.value.toHms = `23:59:59`
    return
  }

  function onLastWeek() {
    const { from, to } = genLastWeek()
    model.value.from = from
    model.value.fromHms = `00:00:00`
    model.value.to = to
    model.value.toHms = `23:59:59`
    return
  }

  function onThisMonth() {
    const { from, to } = genThisMonth()
    model.value.from = from
    model.value.fromHms = `00:00:00`
    model.value.to = to
    model.value.toHms = `23:59:59`
    return
  }

  function onLastMonth() {
    const { from, to } = genLastMonth()
    model.value.from = from
    model.value.fromHms = `00:00:00`
    model.value.to = to
    model.value.toHms = `23:59:59`
    return
  }

  function actionEffect(action: CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums) {
    switch (action) {
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.Today: {
        const now = new Date()
        const date = genTimeFormat(now, "yyyy-MM-dd")
        const isActive =
          model.value.from === date &&
          model.value.to === date &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.Yesterday: {
        const now = new Date()
        const date = genTimeFormat(addDays(now, -1), "yyyy-MM-dd")
        const isActive =
          model.value.from === date &&
          model.value.to === date &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThreeDaysBefore: {
        const { from, to } = genThreeDayBefore()
        const isActive =
          model.value.from === from &&
          model.value.to === to &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThisWeek: {
        const { from, to } = genThisWeek()
        const isActive =
          model.value.from === from &&
          model.value.to === to &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.LastWeek: {
        const { from, to } = genLastWeek()
        const isActive =
          model.value.from === from &&
          model.value.to === to &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThisMonth: {
        const { from, to } = genThisMonth()
        const isActive =
          model.value.from === from &&
          model.value.to === to &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.LastMonth: {
        const { from, to } = genLastMonth()
        const isActive =
          model.value.from === from &&
          model.value.to === to &&
          (!model.value.fromHms || model.value.fromHms === `00:00:00`) &&
          (!model.value.toHms || model.value.toHms === `23:59:59`)
        return isActive
      }
    }
  }

  function onAction(action: CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums) {
    switch (action) {
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.Today:
        onToday()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.Yesterday:
        onYesterday()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThreeDaysBefore:
        onThreeDayBefore()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThisWeek:
        onThisWeek()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.LastWeek:
        onLastWeek()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.ThisMonth:
        onThisMonth()
        break
      case CONSTANTS.DATE_TIME_QUICK_SELECTOR.Enums.LastMonth:
        onLastMonth()
        break
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.q-btn-group) {
    display: grid;
    width: 130px;
    grid-template-columns: repeat(1, 1fr);
    box-shadow: none;
    .q-btn {
      border: 0px;
      border-radius: 0px !important;
      &::before {
        border: 0px;
      }
    }
  }
</style>
