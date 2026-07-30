<template>
  <div class="q-pl-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section>
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp @step1-submit="step1Submit" />
        </template>

        <template #step2>
          <Step2Comp @step2-submit="step2Submit" />
        </template>

        <template #step3>
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
  import Step2Comp from "./Step2.vue"
  import DoneComp from "@/components/stepper/Done.vue"
  import { useRouter } from "vue-router"
  import { onMounted, computed, ref, reactive } from "vue"
  import { addAdminAccount } from "@/api/adminAccount"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"
  import type { AddAdminAccount } from "@/api/request.type"
  import { useSearch } from "@/hook/useSearch"

  // 步驟標頭
  const stepLabelsI18nKey = ["step_label.add_account", "step_label.permission_information", "step_label.finish"]

  // 步驟概述
  const stepTipsI18nKey = [
    "step_tip.basic_account_information_settings",
    "step_tip.check_permission_information",
    "step_tip.added_successfully"
  ]

  const router = useRouter()
  // const store = usePromotionStore()
  const $q = useQuasar()
  const { t } = useI18n()
  const { nextPrevStep } = useStepper()
  let formData = reactive<AddAdminAccount>({
    account: "",
    password: "",
    enabled: true,
    is_ban: false,
    name: "",
    phone: "",
    email: "",
    remark: "",
    verify_binding: false,
    role_id: 0
  })
  // 接收從 Step1Comp 提交的表單數據，並將其存儲到父組件的 formData 中
  const step1Submit = (data: any) => {
    formData = data
    console.log(formData)
  }

  const step2Submit = async (id: number) => {
    formData.role_id = id
    const { search, status } = useSearch(addAdminAccount)
    await search(formData)

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
  function SuccessFunc() {
    router.push({
      name: "BackofficeAccountList"
    })
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
