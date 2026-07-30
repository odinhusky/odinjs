<template>
  <q-card class="no-shadow bg-transparent promotion-add">
    <EventInfo></EventInfo>
    <DepositLifetimeSection v-if="showDepositLifetimeSection" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { EVENT_TYPE, LANGUAGE_TYPE, PRIZE_TYPE } from "@/utils/constants"
  import { useStepper } from "@/hook/useStepper"
  import type * as Request from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import { AddPromotionItem } from "@/api/promotion"
  import EventInfo from "@/pages/Promotion/PromotionSetting/component/EventInfo.vue"
  import { useSearch } from "@/hook/useSearch"
  import { hydratePromotionImagesBeforeSubmit } from "./imageHydration"
  import DepositLifetimeSection from "./DepositLifetimeSection.vue"
  import {
    ensureDepositLifetimeState,
    isDepositLifetimeFlow,
    syncRewardRangeMode,
    validateDepositLifetimeConfig
  } from "./depositLifetime"

  const $q = useQuasar()
  const { t } = useI18n()
  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)
  const { nextPrevStep } = useStepper()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const showDepositLifetimeSection = computed(
    () =>
      form.value.type === EVENT_TYPE.Enums.DepositBonus &&
      (form.value.prize_type === PRIZE_TYPE.Enums.CASH || form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME)
  )

  function checkInfoValidity(info: Request.PromotionInfo[]): boolean {
    console.log("info", info)
    for (let obj of info) {
      if (obj.title === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.content === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_content")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.image === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
    return true
  }
  function canSendApi(): boolean {
    console.log(form.value)
    if (!checkInfoValidity(form.value.info)) {
      return false
    }
    if (!form.value.start_date || !form.value.end_date) {
      $q.notify({
        type: "negative",
        message: `${t("table_header.please_select")}${t("edit_form.event_date")}`,
        position: "top",
        timeout: 1000
      })
      return false
    }

    // 验证开始时间不能早于当前时间
    const currentDate = new Date()
    const startDate = new Date(form.value.start_date)

    // 设置当前时间为当天的 00:00:00，只比较日期部分
    currentDate.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)

    if (startDate < currentDate) {
      $q.notify({
        type: "negative",
        message: t("error_msg.start_date_cannot_than_today"),
        position: "top",
        timeout: 3000
      })
      return false
    }

    if (form.value.type === EVENT_TYPE.Enums.RegisterBonus) {
      if (!form.value.reward || form.value.reward.length === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_distribution_amount"),
          position: "top",
          timeout: 1000
        })
        return false
      }

      const rewardAmount = form.value.reward[0]?.amount
      if ((!rewardAmount || Number(rewardAmount) <= 0) && form.value.prize_type !== PRIZE_TYPE.Enums.FREE_GAME) {
        $q.notify({
          type: "negative",
          message: t("error_msg.amount_cannot_be_0"),
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    if (isDepositLifetimeFlow(form.value)) {
      ensureDepositLifetimeState(form.value)
      const { valid, message } = validateDepositLifetimeConfig(form.value, t)
      if (!valid) {
        $q.notify({
          type: "negative",
          message,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    return true
  }
  async function onSubmit() {
    // 檢查欄位規則，不符合則return掉
    syncRewardRangeMode(form.value)
    if (!canSendApi()) {
      return
    }
    console.log(form.value)

    if (form.value.type === EVENT_TYPE.Enums.RegisterBonus || form.value.type === EVENT_TYPE.Enums.CustomizeBonus) {
      const { search, status } = useSearch(AddPromotionItem)
      try {
        await hydratePromotionImagesBeforeSubmit(form.value.info, VITE_APP_DYNAMIC_RESOURCE_URL)
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error instanceof Error ? error.message : t("error_msg.pictures_not_uploaded"),
          position: "top",
          timeout: 1000
        })
        return
      }
      if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
        form.value.reward.length = 1
        const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
        if (freeRoundSetting) {
          const normalizedRounds = Number.parseInt(String(freeRoundSetting.rounds || 0), 10)
          freeRoundSetting.rounds = Number.isNaN(normalizedRounds) ? 0 : normalizedRounds
          freeRoundSetting.total_bet_amount = freeRoundSetting.total_bet_amount || "0"
          freeRoundSetting.bet_per_line = freeRoundSetting.bet_per_line || "0"
        }
      }
      console.log("form.value", form.value)
      await search(form.value)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.add_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        return
      }
    }
    nextPrevStep(true)
  }
</script>

<style lang="scss" scoped>
  .promotion-add {
    line-height: normal;
  }

  .promotion-add :deep(.q-btn) {
    line-height: normal !important;
  }
</style>
