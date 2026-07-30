<template>
  <SubPage action-label-i18n-key="btn.add" />
  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section class="add-container">
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp @step1-submit="step1Submit" />
        </template>
        <template #step2>
          <Step2Comp @step2-submit="step2Submit" />
        </template>
        <template #step3>
          <Step3Comp @step3-submit="step3Submit" />
        </template>
        <template #step4>
          <DoneComp :success-func="SuccessFunc" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import { onMounted, computed, ref } from "vue"
  import { EVENT_TYPE } from "@/utils/constants"
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import Step1Comp from "./Step1.vue"
  import Step2Comp from "./Step2.vue"
  import Step3Comp from "./Step3.vue"
  import DoneComp from "@/components/stepper/Done.vue"

  import { AddSingleGeneralAgencyManagement } from "@/api/generalAgencyManagement"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"

  const router = useRouter()
  const $q = useQuasar()
  const { t } = useI18n()
  const formData = ref({})
  const { nextPrevStep } = useStepper()

  // 接收從 Step1Comp 提交的表單數據，並將其存儲到父組件的 formData 中
  const step1Submit = (data: any) => {
    formData.value = data
    nextPrevStep(true)
  }

  const step2Submit = (data: any) => {
    formData.value = { ...formData.value, ...data }
    nextPrevStep(true)
  }

  const step3Submit = async (data: any) => {
    const res = await AddSingleGeneralAgencyManagement(formData.value)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      nextPrevStep(true)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }
  // computed 區分event type
  // 步驟標頭
  const stepLabelsI18nKey = computed(() => {
    if (EVENT_TYPE.Enums.DepositBonus) {
      return [
        "step_label.add_new_general_agent",
        "step_label.available_currencies",
        "step_label.product_setting",
        "step_label.finish"
      ]
    } else {
      return ["step_label.add_promotion", "step_label.finish"]
    }
  })
  // 步驟概述
  const stepTipsI18nKey = computed(() => {
    if (EVENT_TYPE.Enums.DepositBonus) {
      return [
        "step_tip.general_agent_basic_information_settings",
        "step_tip.set_general_agent_currencies",
        "step_tip.set_product_setting",
        "step_tip.added_successfully"
      ]
    } else {
      return ["step_tip.set_add_promotion", "step_tip.added_successfully"]
    }
  })

  function SuccessFunc() {
    router.push({
      name: "GeneralAgencyManagementList"
    })
  }
</script>

<style lang="scss" scoped>
  .addWrapper {
    .add-container {
      margin: 0 auto;
      width: 90%;
    }
  }
</style>
