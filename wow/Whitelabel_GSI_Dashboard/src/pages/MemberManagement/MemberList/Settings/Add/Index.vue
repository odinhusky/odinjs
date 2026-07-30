<template>
  <div class="q-pl-md q-pr-md">
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

        <template #step3>
          <DoneComp :success-func="SuccessFunc" :showPrev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useMember } from "src/composables/useMember"
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import Step1Comp from "@/pages/MemberManagement/MemberList/Settings/Add/Step1.vue"
  import Step2Comp from "@/pages/MemberManagement/MemberList/Settings/Add/Step2.vue"
  import DoneComp from "@/components/stepper/Done.vue"

  const router = useRouter()
  const { initMemberAddForm } = useMember()

  // 步驟標頭
  const stepLabelsI18nKey = ["step_label.add_new_member", "step_label.member_tag", "step_label.finish"]

  // 步驟概述
  const stepTipsI18nKey = [
    "step_tip.member_information_settings",
    "step_tip.check_the_membership_tab",
    "step_tip.added_successfully"
  ]

  function SuccessFunc() {
    router.push({
      name: "MemberList"
    })
  }

  onMounted(() => {
    initMemberAddForm()
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
