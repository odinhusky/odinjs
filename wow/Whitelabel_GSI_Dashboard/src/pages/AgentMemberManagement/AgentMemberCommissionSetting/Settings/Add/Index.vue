<template>
  <SubPage action-label-i18n-key="btn.add" />

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section>
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp />
        </template>
        <template #step2>
          <DoneComp :success-func="SuccessFunc" :showPrev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"

  import { useRouter } from "vue-router"
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import Step1Comp from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/Settings/Add/Step1.vue"

  import DoneComp from "@/components/stepper/Done.vue"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"

  const router = useRouter()

  // 步驟標頭
  const stepLabelsI18nKey = ["step_label.add_commission_group", "step_label.finish"]

  // 步驟概述
  const stepTipsI18nKey = ["step_tip.set_commission_settlement_rules", "step_tip.added_successfully"]
  function SuccessFunc() {
    router.push({
      name: "AgentMemberCommissionSettingList"
    })
  }

  const agentCommissioStore = useAgentCommissionStore()
  onMounted(async () => {
    await agentCommissioStore.initCommissionItem()
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";

  .addWrapper .add_card {
    max-width: 100%;
  }
</style>
