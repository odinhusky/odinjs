<template>
  <q-card class="no-shadow bg-transparent add_card">
    <SingleDepositThreshold
      v-if="promotionItem.type !== EVENT_TYPE.Enums.BetBonus && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH"
    />
    <PromotionAmount
      v-if="promotionItem.type !== EVENT_TYPE.Enums.BetBonus && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH"
    />
    <PromotionlevelAmount
      v-if="promotionItem.type === EVENT_TYPE.Enums.BetBonus && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH"
    />
    <PromotionFreeGame v-if="promotionItem.prize_type === PRIZE_TYPE.Enums.FREE_GAME" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useEnv } from "src/hook/useEnv"
  import { useStepper } from "@/hook/useStepper"
  import { AddPromotionItem } from "@/api/promotion"
  import SingleDepositThreshold from "@/pages/Promotion/PromotionSetting/component/SingleDepositThreshold.vue"
  import PromotionAmount from "@/pages/Promotion/PromotionSetting/component/PromotionAmount.vue"
  import PromotionlevelAmount from "@/pages/Promotion/PromotionSetting/component/PromotionlevelAmount.vue"
  import PromotionFreeGame from "@/pages/Promotion/PromotionSetting/component/PromotionFreeGame.vue"
  import { EVENT_TYPE, PROMOTION_REWARD_TYPE, PRIZE_TYPE } from "@/utils/constants"
  import { useSearch } from "@/hook/useSearch"
  import { hydratePromotionImagesBeforeSubmit } from "./imageHydration"
  import { syncRewardRangeMode } from "./depositLifetime"
  const $q = useQuasar()
  const { t } = useI18n()
  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)
  const { nextPrevStep } = useStepper()
  const { promotionItem } = promotionStore
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  //投注優惠金額有設定門檻時獎金是否為０
  function checkLevelDataValidity() {
    for (const levelItem of form.value.levelData) {
      const level = levelItem.level

      for (const currencyItem of levelItem.currency) {
        const { currency, condition, amount } = currencyItem

        if (condition !== "" && (Math.round(amount) === 0 || amount === "")) {
          $q.notify({
            color: "green",
            message: `LV${level} 的 ${currency} ${t("error_msg.bonus_cannot_be_0")}`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }

    return true
  }
  //存款優惠金額獎金是否為０
  function checkCurrencyDataValidity() {
    for (const currencyItem of form.value.reward) {
      const { currency, condition, amount } = currencyItem

      // 檢查 condition 為 0 或 amount 等於 0
      if (Number(condition) === 0 || condition === "" || Number(amount) === 0 || amount === "") {
        $q.notify({
          color: "green",
          message: `${currency} ${t("error_msg.amount_cannot_be_0")}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    return true
  }
  async function onSubmit() {
    syncRewardRangeMode(form.value)
    if (promotionItem.type !== EVENT_TYPE.Enums.BetBonus && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH) {
      //存款優惠
      if (form.value.type === EVENT_TYPE.Enums.DepositBonus) {
        if (!checkCurrencyDataValidity()) {
          return false
        }
      }
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
      await search(form.value)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.add_success"),
          position: "top",
          timeout: 1000
        })
        nextPrevStep(true)
      } else {
        return
      }
    } else if (promotionItem.type === EVENT_TYPE.Enums.BetBonus && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH) {
      console.log("CASH")
      form.value.reward = []
      form.value.levelData.forEach((item) => {
        item.currency.forEach((currency: any) => {
          const rewardItem = {
            currency: currency.currency,
            condition: currency.condition !== "" ? parseFloat(currency.condition) : 0,
            amount: currency.amount !== "" ? parseFloat(currency.amount) : 0,
            level: item.level,
            type: form.value.rewardType as PROMOTION_REWARD_TYPE.Enums
          }
          if (!currency.condition || !currency.amount) {
            return
          }
          form.value.reward.push(
            rewardItem as {
              currency: string
              condition: number | string
              type: PROMOTION_REWARD_TYPE.Enums
              amount: number | string
              limit?: string | number | undefined
              level: number
            }
          )
        })
      })

      //投注優惠
      if (form.value.type === EVENT_TYPE.Enums.BetBonus) {
        if (!checkLevelDataValidity()) {
          return false
        }
      }

      //投注優惠後面還有產品設定
      nextPrevStep(true)
    } else {
      const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
      console.log("FREEGAME")
      console.log("form.value.reward[0].free_round_setting", form.value.reward, freeRoundSetting)
      // 确保所有字段类型正确，直接修改原对象
      if (freeRoundSetting) {
        freeRoundSetting.bet_per_line = freeRoundSetting.bet_per_line || "0"
        freeRoundSetting.total_bet_amount = freeRoundSetting.total_bet_amount || "0"
        const normalizedRounds = Number.parseInt(String(freeRoundSetting.rounds || 0), 10)
        freeRoundSetting.rounds = Number.isNaN(normalizedRounds) ? 0 : normalizedRounds
      }
      form.value.reward[0].type = 2
      form.value.reward[0].condition = form.value.reward[0].condition
      console.log("form.value.reward", form.value.reward[0])

      if (form.value.type === EVENT_TYPE.Enums.DepositBonus) {
        if (promotionItem.prize_type === PRIZE_TYPE.Enums.CASH && !checkCurrencyDataValidity()) {
          return false
        }
        console.log("form.value.reward", form.value.reward)
        const { search, status } = useSearch(AddPromotionItem)
        if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME && freeRoundSetting) {
          const submitRounds = Number.parseInt(String(freeRoundSetting.rounds || 0), 10)
          freeRoundSetting.rounds = Number.isNaN(submitRounds) ? 0 : submitRounds
          form.value.reward.length = 1
        }
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
        console.log("form.value", form.value)
        await search(form.value)
        if (status.value) {
          $q.notify({
            color: "green",
            message: t("message.add_success"),
            position: "top",
            timeout: 1000
          })
          nextPrevStep(true)
        } else {
          return
        }
      }

      //投注優惠
      if (form.value.type === EVENT_TYPE.Enums.BetBonus) {
        if (promotionItem.prize_type === PRIZE_TYPE.Enums.CASH && !checkLevelDataValidity()) {
          return false
        }
      }

      //投注優惠後面還有產品設定
      nextPrevStep(true)
    }
  }
</script>
