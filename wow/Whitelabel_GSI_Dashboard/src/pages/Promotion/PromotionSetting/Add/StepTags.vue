<template>
  <q-card class="no-shadow bg-transparent add_card">
    <BlockTags />
    <MemberLevelTags v-if="promotionItem.type === EVENT_TYPE.Enums.DepositBonus" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useEnv } from "src/hook/useEnv"
  import { EVENT_TYPE } from "@/utils/constants"
  import { useStepper } from "@/hook/useStepper"
  import BlockTags from "@/pages/Promotion/PromotionSetting/component/BlockTags.vue"
  import MemberLevelTags from "@/pages/Promotion/PromotionSetting/component/MemberLevelTags.vue"
  import { AddPromotionItem } from "@/api/promotion"
  import { useSearch } from "@/hook/useSearch"
  import { hydratePromotionImagesBeforeSubmit } from "./imageHydration"
  import {
    buildDepositLifetimeRewards,
    ensureDepositLifetimeState,
    isDepositLifetimeFlow,
    syncRewardRangeMode,
    validateDepositLifetimeConfig
  } from "./depositLifetime"

  const $q = useQuasar()
  const { t } = useI18n()
  const promotionStore = usePromotionStore()
  const { promotionItem } = promotionStore
  const { promotionItem: form } = storeToRefs(promotionStore)
  const { nextPrevStep } = useStepper()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  async function onSubmit() {
    syncRewardRangeMode(form.value)
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
        return
      }

      const payload = {
        ...form.value,
        reward: buildDepositLifetimeRewards(form.value)
      }

      const { search, status } = useSearch(AddPromotionItem)
      try {
        await hydratePromotionImagesBeforeSubmit(payload.info, VITE_APP_DYNAMIC_RESOURCE_URL)
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error instanceof Error ? error.message : t("error_msg.pictures_not_uploaded"),
          position: "top",
          timeout: 1000
        })
        return
      }
      await search(payload)
      if (!status.value) {
        return
      }

      $q.notify({
        color: "green",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
    }

    nextPrevStep(true)
  }
</script>
