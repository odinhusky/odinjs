<template>
  <q-card class="no-shadow bg-transparent add_card">
    <EventInfo></EventInfo>
    <EligibilityThreshold></EligibilityThreshold>
    <RebateRatio></RebateRatio>
    <q-card-section align="center">
      <q-btn color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import { useI18n } from "vue-i18n"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import { useQuasar } from "quasar"
  import { LANGUAGE_TYPE } from "@/utils/constants"
  import EventInfo from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/component/EventInfo.vue"
  import type * as Request from "@/api/request.type"

  import RebateRatio from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/component/RebateRatio.vue"
  import EligibilityThreshold from "@/pages/AgentMemberManagement/AgentMemberCommissionSetting/component/EligibilityThreshold.vue"
  import { addAgentMemberCommissionSetting } from "@/api/agentMemberManagements"
  import { useCommon } from "@/hook/useCommon"

  const store = useAgentCommissionStore()
  const { commissionItem: form } = storeToRefs(store)
  const { genWeeksStartSun } = useCommon()

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()
  const $q = useQuasar()

  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: `${t("error_msg.form_validate_error_tip")} (${t(msg)})`,
      position: "top",
      timeout: 1000
    })
  }

  async function onSubmit() {
    // 檢查欄位規則，不符合則return掉
    if (form.value.name === "") {
      errorMsg("query_params.commission_name")
      return
    } else if (form.value.member_ids && !form.value.member_ids.length) {
      errorMsg("query_params.member_account")
      return
    }
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

<style scoped>
  .q-align-center {
    align-items: center;
  }

  .q-radio-w {
    /*width: 45%;*/
  }
  .radio-group {
    display: flex;
    flex-direction: column;
  }

  .radio-group > div {
    display: flex;
    margin-bottom: 0.8em;
  }

  .d-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .direction {
    flex-direction: row !important;
    align-items: center !important;
  }

  .d-center {
    display: flex;
    justify-content: flex-start;
  }
  .audit-multiple-container {
    width: 60%;
    border: 1px solid #999;

    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
    }
    ::v-deep(input.q-field__input) {
      text-align: center !important;
    }
  }
</style>
