<template>
  <q-card class="no-shadow bg-transparent add_card">
    <!-- 調整樣式成button checkbox -->
    <CurrencyTags v-if="!isDepositLifetimeFreeGame" itemButtonStyle hideSelectAll showSelecAllNextToTitle />
    <DepositMethodTags itemButtonStyle showSelecAllNextToTitle />

    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from "vue"
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useEnv } from "src/hook/useEnv"
  import { useStepper } from "@/hook/useStepper"
  import CurrencyTags from "@/pages/Promotion/PromotionSetting/component/CurrencyTags.vue"
  import DepositMethodTags from "@/pages/Promotion/PromotionSetting/component/DepositMethodTags.vue"
  import { AddPromotionItem, getGatewayList } from "@/api/promotion"
  import { useSearch } from "@/hook/useSearch"
  import type * as Request from "@/api/request.type"
  import { hydratePromotionImagesBeforeSubmit } from "./imageHydration"
  import {
    buildDepositLifetimeRewards,
    ensureDepositLifetimeState,
    getActiveDepositLifetimeConditions,
    isDepositLifetimeFreeGameFlow,
    syncRewardRangeMode,
    validateDepositLifetimeConfig
  } from "./depositLifetime"

  const $q = useQuasar()
  const { t } = useI18n()
  const { nextPrevStep } = useStepper()
  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const isDepositLifetimeFreeGame = computed(() => isDepositLifetimeFreeGameFlow(form.value))
  const gatewayList = ref<Request.promotionGatewayItem[]>([])

  function getFreeGameLifetimeCurrencyIds(): number[] {
    const currencyIds = getActiveDepositLifetimeConditions(form.value)
      .map((condition) => Number(condition.freeGame?.freeRoundSetting.currency_id) || 0)
      .filter((currencyId) => currencyId > 0)

    return Array.from(new Set(currencyIds))
  }

  function clearDepositMethodSelections(): void {
    form.value.filteredGatewayList = []
    form.value.payment_gateway = []
    form.value.bankCardTags = []
    form.value.electronicWallet = []
    form.value.ExternalChannelTags = []
    form.value.cryptoWalletTags = []
    form.value.cryptoWalletThirdTags = []
  }

  function syncFreeGameLifetimeGatewayList(): void {
    if (!isDepositLifetimeFreeGame.value) {
      return
    }

    const currencyIds = getFreeGameLifetimeCurrencyIds()
    if (currencyIds.length === 0) {
      clearDepositMethodSelections()
      return
    }

    form.value.filteredGatewayList = gatewayList.value.filter((item) => currencyIds.includes(item.currency))

    const validGatewayIds = new Set(form.value.filteredGatewayList.map((item) => item.id))
    form.value.payment_gateway = (form.value.payment_gateway || []).filter((id: number) => validGatewayIds.has(id))
  }

  onMounted(async () => {
    if (!isDepositLifetimeFreeGame.value) {
      return
    }

    const { data } = await getGatewayList({ display: true })
    gatewayList.value = data.list || []
    syncFreeGameLifetimeGatewayList()
  })

  watch(
    () =>
      getActiveDepositLifetimeConditions(form.value)
        .map((condition) => condition.freeGame?.freeRoundSetting.currency_id)
        .join("|"),
    () => {
      syncFreeGameLifetimeGatewayList()
    }
  )

  async function submitDepositLifetimeFreeGame() {
    syncRewardRangeMode(form.value)
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
      return false
    }

    await search(payload)
    if (!status.value) {
      return false
    }

    $q.notify({
      color: "green",
      message: t("message.add_success"),
      position: "top",
      timeout: 1000
    })
    return true
  }

  async function onSubmit() {
    if (isDepositLifetimeFreeGame.value) {
      const isSuccess = await submitDepositLifetimeFreeGame()
      if (!isSuccess) {
        return false
      }
      nextPrevStep(true)
      return true
    }

    if (form.value.reward.length <= 0) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_select_currency"),
        position: "top",
        timeout: 1000
      })
      return false
    } else if (
      form.value.reward.length > 0 &&
      (form.value.payment_gateway?.length ?? 0) < 1 &&
      form.value.filteredGatewayList.length > 0
    ) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_select_payment_method"),
        position: "top",
        timeout: 1000
      })
      return false
    }
    form.value.reward = form.value.reward.filter(
      (item, index, self) => index === self.findIndex((t) => t.currency === item.currency)
    )
    nextPrevStep(true)
    return true
  }
</script>
