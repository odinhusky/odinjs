<template>
  <SubPage action-label-i18n-key="btn.add" />

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section>
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp @step1-submit="step1Submit" />
        </template>
        <template #step2>
          <DoneComp :success-func="SuccessFunc" :showPrev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import Step1Comp from "./Step1.vue"
  import DoneComp from "@/components/stepper/Done.vue"
  import { useRouter } from "vue-router"
  import { onMounted, computed, ref, reactive } from "vue"
  import { addAuroraAgent } from "@/api/agencyManagement"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"
  import type { AddAuroraAgent } from "@/api/request.type"

  // 步驟標頭
  const stepLabelsI18nKey = ["step_label.add_agent", "step_label.finish"]

  // 步驟概述
  const stepTipsI18nKey = ["", "step_tip.added_successfully"]

  const router = useRouter()
  // const store = usePromotionStore()
  const $q = useQuasar()
  const { t } = useI18n()
  const { nextPrevStep } = useStepper()
  let formData = reactive<AddAuroraAgent>({
    agent_code: "",
    agent_name: ""
  })

  const step1Submit = async (data: any) => {
    formData = data
    const res = await addAuroraAgent(formData)
    console.log(res)
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

  function SuccessFunc() {
    router.push({
      name: "AdminProxySettingsList"
    })
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
