<template>
  <q-card class="no-shadow bg-transparent add_card" style="width: 1080px">
    <RebateRatio></RebateRatio>
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
  import { useQuasar } from "quasar"

  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import RebateRatio from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/component/RebateRatio.vue"
  import { addAgentMemberCommissionSetting } from "@/api/agentMemberManagements"
  import { useCommon } from "@/hook/useCommon"

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()
  const store = useAgentCommissionStore()
  const $q = useQuasar()
  const { genWeeksStartSun } = useCommon()

  const { commissionItem: form } = storeToRefs(store)
  onMounted(() => {})

  async function onSubmit() {
    form.value.payout_method = Number(form.value.payout_method ?? 1)
    form.value.currency_limit = []

    for (let i = 0; i < form.value.currency_limit_data.length; i++) {
      // if (form.value.currency_limit_data[i].limit !== "" || form.value.currency_limit_data[i].limit != 0) {
      if (form.value.currency_limit_data[i].limit !== 0) {
        const rewardItem = {
          currency: form.value.currency_limit_data[i].currency,
          currency_id: form.value.currency_limit_data[i].currency_id,
          limit:
            form.value.currency_limit_data[i].limit !== ""
              ? parseInt(form.value.currency_limit_data[i].limit as string)
              : 0
        }
        form.value.currency_limit.push(rewardItem)
      }
    }
    const weeks = genWeeksStartSun()

    if (form.value.settlement_type === 1) {
      form.value.billing_type = "daily"
    } else if (form.value.settlement_type === 3) {
      form.value.billing_type = "monthly"
    } else {
      weeks.forEach((item) => {
        if (item.value === form.value.settlement_week) {
          form.value.billing_type = item.label.split(".")[1]
        }
      })
    }

    const { code, msg } = await addAgentMemberCommissionSetting(form.value)
    if (code !== 0) {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      return
    } else {
      $q.notify({
        color: "green",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
      nextPrevStep(true)
    }
  }
</script>
