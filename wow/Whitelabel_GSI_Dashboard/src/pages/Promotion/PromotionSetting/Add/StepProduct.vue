<template>
  <q-card class="no-shadow bg-transparent add_card">
    <Product />

    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"

  import { usePromotionStore } from "@/stores/promotionStore"
  import { useStepper } from "@/hook/useStepper"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { useEnv } from "src/hook/useEnv"
  import { AddPromotionItem } from "@/api/promotion"
  import Product from "@/pages/Promotion/PromotionSetting/component/Product.vue"
  import { useSearch } from "@/hook/useSearch"
  import { PRIZE_TYPE, EVENT_TYPE } from "@/utils/constants"
  import { hydratePromotionImagesBeforeSubmit } from "./imageHydration"
  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)
  console.log("form", form.value)
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const { nextPrevStep } = useStepper()

  const $q = useQuasar()

  async function onSubmit() {
    console.log("form", form.value)
    if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
      form.value.reward.length = 1
      const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
      if (freeRoundSetting) {
        const normalizedRounds = Number.parseInt(String(freeRoundSetting.rounds || 0), 10)
        freeRoundSetting.rounds = Number.isNaN(normalizedRounds) ? 0 : normalizedRounds
      }
    }
    if (form.value.type === EVENT_TYPE.Enums.BetBonus) {
      if ((form.value.game_type?.length || 0) === 0 && (form.value.product_code?.length || 0) === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_product"),
          position: "top",
          timeout: 1000
        })
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
  }
</script>
