<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>

  <q-card class="q-pa-md no-shadow bg-transparent addWrapper">
    <q-card-section class="add-container">
      <StepperComp :step-labels-i18n-key="stepLabels" :step-tips-i18n-key="stepTips">
        <template #step1>
          <StepEventInfo />
        </template>
        <template #step2>
          <StepTags />
        </template>
        <template #step3>
          <StepActiveMember />
        </template>
        <template #step4>
          <StepLvAmount />
        </template>
        <template #step5>
          <DoneComp :success-func="SuccessFunc" :show-prev="false" />
        </template>
      </StepperComp>
    </q-card-section>
  </q-card>
  <PromotionGuild :open-dialog="dialog" />
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useQueryStore } from "@/stores/queryStore"
  import SubPage from "layouts/SubPage/Index.vue"
  import StepperComp from "@/components/stepper/Index.vue"
  import StepEventInfo from "./StepEventInfo.vue"
  import StepTags from "./StepTags.vue"
  import StepActiveMember from "./StepActiveMember.vue"
  import StepLvAmount from "./StepLvAmount.vue"
  import DoneComp from "@/components/stepper/Done.vue"

  const router = useRouter()
  const queryStore = useQueryStore()
  const stepLabels = computed(() => {
    return ["", "", "", "", "step_label.finish"]
  })

  const stepTips = computed(() => {
    return ["", "", "", "", "step_tip.added_successfully"]
  })

  onMounted(async () => {
    await queryStore.getCurrencyList()
  })
  function SuccessFunc() {
    router.push({
      name: "InvitationBonusSettingList"
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
    }
  }
</style>
