<template>
  <q-card class="no-shadow bg-transparent add_card" style="width: 1080px">
    <CommissionLimit></CommissionLimit>
    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, computed } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import { useI18n } from "vue-i18n"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import CommissionLimit from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/component/CommissionLimit.vue"

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()
  const store = useAgentCommissionStore()
  const { commissionItem: form } = storeToRefs(store)
  onMounted(() => {})

  function onSubmit() {
    form.value.commission_limit = []

    for (let i = 0; i < form.value.commission_limit_data.length; i++) {
      // if (form.value.rebate_ratio_data[i].amount !== "" || form.value.rebate_ratio_data[i].amount != 0) {
      if (form.value.commission_limit_data[i].amount != 0) {
        const rewardItem = {
          currency: form.value.commission_limit_data[i].currency,
          amount: form.value.commission_limit_data[i].amount !== "" ? form.value.commission_limit_data[i].amount : 0
        }
        form.value.commission_limit.push(rewardItem)
      }
    }
    console.log(form.value)
    nextPrevStep(true)
  }
</script>
