<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section>
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp />
        </template>

        <template #step2>
          <Step2Comp />
        </template>

        <!-- 先拿掉 -->
        <!-- <template #step3>
          <Step3Comp />
        </template> -->

        <template #step3>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"
  import { useRouter } from "vue-router"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useCashFlowStore } from "@/stores/cashflowStore"
  import StepperComp from "@/components/stepper/Index.vue"
  import Step1Comp from "./Step1.vue"
  import Step2Comp from "./Step2.vue"
  import Step3Comp from "./Step3.vue"
  import DoneComp from "@/components/stepper/Done.vue"

  const router = useRouter()
  const cashFlowStore = useCashFlowStore()

  onMounted(() => {
    cashFlowStore.initGatewayItem()
  })

  // 步驟標頭
  const stepLabelsI18nKey = [
    "step_label.add_new_payment",
    "step_label.currency_limit_deposit_information",
    // "table_header.block_tags_num",
    "step_label.finish"
  ]

  // 步驟概述
  const stepTipsI18nKey = [
    "step_tip.set_name_setting",
    "step_tip.set_currency_deposit_information",
    // "step_tip.set_tags_prohibit_distribution",
    "step_tip.added_successfully"
  ]

  function SuccessFunc() {
    router.push({
      name: "CashFlowList"
    })
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .add_card {
    width: 1000px !important;
  }
</style>
