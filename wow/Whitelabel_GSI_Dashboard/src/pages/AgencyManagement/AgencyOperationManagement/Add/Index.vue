<template>
  <SubPage action-label-i18n-key="btn.add" />
  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section class="add-container">
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp v-model="form" @onCancel="onCancel" />
        </template>
        <template #step2>
          <Step2Comp v-model="form" @onCancel="onCancel" />
        </template>
        <template #step3>
          <Step3Comp v-model="form" @onCancel="onCancel" @step3-submit="step3Submit" />
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
  import { AddAgencyManagement } from "@/api/agencyManagement"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"
  import { useSearch } from "@/hook/useSearch"

  const router = useRouter()
  const $q = useQuasar()
  const { t } = useI18n()
  const form = ref({
    agent_code: "",
    display_name: "",
    password: "",
    confirm_password: "",
    title: "",
    contact: "",
    mobile: "",
    email: "",
    remark: "",
    enabled: true,
    is_ban: false,
    unbind_2fa: false,
    currency_ids: [],
    currency: {},
    product_code: []
  })
  const { nextPrevStep } = useStepper()

  const step3Submit = async (data: any) => {
    const { search, status } = useSearch(AddAgencyManagement)
    await search(form.value)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      nextPrevStep(true)
    }
  }

  // computed 區分event type
  // 步驟標頭
  const stepLabelsI18nKey = computed(() => {
    if (EVENT_TYPE.Enums.DepositBonus) {
      return [
        "step_label.add_agent",
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
        "step_tip.set_agent_info",
        "step_tip.set_currency_deposit_method",
        "step_tip.set_product_setting",
        "step_tip.added_successfully"
      ]
    } else {
      return ["step_tip.set_add_promotion", "step_tip.added_successfully"]
    }
  })

  onMounted(() => {
    //store.initAddPormotionItem()
  })

  function SuccessFunc() {
    router.push({
      name: "AgencyOperationManagementList"
    })
  }

  const onCancel = () => {
    router.push({
      name: "AgencyOperationManagementList"
    })
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
