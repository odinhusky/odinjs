<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" :dialog-btn="true" @update:openDialog="openDialog" />
  </div>

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section class="add-container">
      <StepperComp v-if="isDepositLifetimeFlow" :step-labels-i18n-key="stepLabels" :step-tips-i18n-key="stepTips">
        <template #step1>
          <StepEventInfo />
        </template>
        <template #step2>
          <StepTags />
        </template>
        <template #step3>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>

      <StepperComp
        v-else-if="promotionItem.type === EVENT_TYPE.Enums.DepositBonus"
        :step-labels-i18n-key="stepLabels"
        :step-tips-i18n-key="stepTips"
      >
        <template #step1>
          <StepEventInfo />
        </template>
        <template #step2>
          <StepTags />
        </template>
        <template #step3>
          <StepCurrency />
        </template>
        <template #step4>
          <StepPromotionAmount />
        </template>
        <template #step5>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>

      <StepperComp
        v-if="promotionItem.type === EVENT_TYPE.Enums.BetBonus"
        :step-labels-i18n-key="stepLabels"
        :step-tips-i18n-key="stepTips"
      >
        <template #step1>
          <StepEventInfo />
        </template>
        <template #step2>
          <StepTags />
        </template>
        <!-- TODO: 有效投注門檻及獎金、產品設定-->
        <template #step3>
          <StepPromotionAmount />
        </template>
        <template #step4><StepProduct /></template>
        <template #step5>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>

      <StepperComp
        v-if="
          promotionItem.type === EVENT_TYPE.Enums.RegisterBonus ||
          promotionItem.type === EVENT_TYPE.Enums.CustomizeBonus
        "
        :step-labels-i18n-key="stepLabels"
        :step-tips-i18n-key="stepTips"
      >
        <template #step1>
          <StepEventInfo />
        </template>
        <template #step2>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
  <PromotionGuild :open-dialog="dialog" />
</template>

<script lang="ts" setup>
  import { computed, ref } from "vue"
  import { useRouter } from "vue-router"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { COUNT_BASIS, EVENT_TYPE, PRIZE_TYPE } from "@/utils/constants"
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import StepEventInfo from "./StepEventInfo.vue"
  import StepTags from "./StepTags.vue"
  import StepCurrency from "./StepCurrency.vue"
  import StepPromotionAmount from "./StepPromotionAmount.vue"
  import StepProduct from "./StepProduct.vue"

  import DoneComp from "@/components/stepper/Done.vue"
  import PromotionGuild from "../component/PromotionGuild.vue"
  import { useAIHelperStore } from "@/stores/aiHelperStore"

  const router = useRouter()
  const promotionStore = usePromotionStore()
  const aiHelperStore = useAIHelperStore()

  // 判斷是否是ai銷售助手傳過來的優惠設定
  if (!aiHelperStore.isAIHelperPromotionDetail) {
    promotionStore.initPromotionItem()
  } else {
    aiHelperStore.isAIHelperPromotionDetail = false
  }

  const { promotionItem } = promotionStore
  const isDepositLifetimeCountBasis = computed(
    () =>
      promotionItem.type === EVENT_TYPE.Enums.DepositBonus &&
      (promotionItem.count_basis === COUNT_BASIS.Enums.LIFETIME ||
        promotionItem.count_basis === COUNT_BASIS.Enums.CUSTOM_PERIOD)
  )
  const isDepositLifetimeCashFlow = computed(
    () => isDepositLifetimeCountBasis.value && promotionItem.prize_type === PRIZE_TYPE.Enums.CASH
  )
  const isDepositLifetimeFreeGameFlow = computed(
    () => isDepositLifetimeCountBasis.value && promotionItem.prize_type === PRIZE_TYPE.Enums.FREE_GAME
  )
  const isDepositLifetimeFlow = computed(() => isDepositLifetimeCashFlow.value || isDepositLifetimeFreeGameFlow.value)

  const stepLabels = computed(() => {
    if (isDepositLifetimeFlow.value) {
      return ["step_label.add_promotion", "step_label.block_tag_member_level", "step_label.finish"]
    }
    if (promotionItem.type === EVENT_TYPE.Enums.DepositBonus) {
      return [
        "step_label.add_promotion",
        "step_label.block_tag_member_level",
        "step_label.currency_deposit_method",
        "step_label.amount_setting",
        "step_label.finish"
      ]
    }
    // TODO: 找pm確認label title
    if (promotionItem.type === EVENT_TYPE.Enums.BetBonus) {
      return [
        "step_label.add_promotion",
        "step_label.block_tag_member_level",
        "step_label.effective_betting",
        "step_label.product_setting",
        "step_label.finish"
      ]
    }

    return ["step_label.add_promotion", "step_label.finish"]
  })

  const stepTips = computed(() => {
    if (isDepositLifetimeFlow.value) {
      return ["step_tip.set_promotion_info", "step_tip.set_block_tag_member_level", "step_tip.added_successfully"]
    }
    if (promotionItem.type === EVENT_TYPE.Enums.DepositBonus) {
      return [
        "step_tip.set_promotion_info",
        "step_tip.set_block_tag_member_level",
        "step_tip.set_currency_deposit_method",
        "step_tip.set_amount_setting",
        "step_tip.added_successfully"
      ]
    }
    // TODO: 找pm確認label tip
    if (promotionItem.type === EVENT_TYPE.Enums.BetBonus) {
      return [
        "step_tip.set_promotion_info",
        "step_tip.set_block_tag_member_level",
        "step_tip.set_betting_thresholds_and_bonuses",
        "step_tip.set_product_setting",
        "step_tip.added_successfully"
      ]
    }

    return ["step_tip.set_promotion_info", "step_tip.added_successfully"]
  })

  function SuccessFunc() {
    router.push({
      name: "PromotionSettingList"
    })
  }
  const dialog = ref(false)
  function openDialog() {
    dialog.value = !dialog.value
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .addWrapper {
    .add-container {
      margin: 0 auto;
      width: 90%;
    }
  }
</style>
