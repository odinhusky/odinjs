<template>
  <SubPage action-label-i18n-key="btn.add" />
  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section class="add-container">
      <StepperComp :step-labels-i18n-key="stepLabelsI18nKey" :step-tips-i18n-key="stepTipsI18nKey">
        <template #step1>
          <Step1Comp v-model="form" @onCancel="onCancel" @onSubmit="submit" />
        </template>
        <template #step2>
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
  import DoneComp from "@/components/stepper/Done.vue"
  import { AddAgencyManagement } from "@/api/agencyManagement"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"

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

  const submit = async (data: any) => {
    const res = await AddAgencyManagement(form.value)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      nextPrevStep(true)
    } else if (res.code === 201001) {
      $q.notify({
        type: "negative",
        message: t("message.agent_id_exists"),
        position: "top",
        timeout: 300
      })
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
    return ["step_label.add_agent", "step_label.finish"]
  })
  // 步驟概述
  const stepTipsI18nKey = computed(() => {
    return ["step_tip.set_agent_info", "step_tip.added_successfully"]
  })

  onMounted(() => {
    //store.initAddPormotionItem()
  })

  function SuccessFunc() {
    router.push({
      name: "AgencyOperationManagementList_v2"
    })
  }

  const onCancel = () => {
    router.push({
      name: "AgencyOperationManagementList_v2"
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
