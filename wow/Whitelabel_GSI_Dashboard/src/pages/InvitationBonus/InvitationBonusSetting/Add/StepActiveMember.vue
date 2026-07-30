<template>
  <q-card class="no-shadow bg-transparent add_card">
    <ActiveMember />

    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue"
  import { useQueryStore } from "@/stores/queryStore"

  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { useStepper } from "@/hook/useStepper"
  import { AddInvitationBouns } from "@/api/invitationBouns"
  import ActiveMember from "@/pages/InvitationBonus/InvitationBonusSetting/component/ActiveMember.vue"

  import { EVENT_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"

  const $q = useQuasar()
  const { t } = useI18n()
  const queryStore = useQueryStore()
  const invitationBonusStore = useInvitationBonusStore()
  const { invitationBonusItem: form } = storeToRefs(invitationBonusStore)
  const { nextPrevStep } = useStepper()

  onMounted(async () => {
    form.value.metrics = []
    queryStore.currencyList.forEach((currency) => {
      form.value.metrics.push({
        currency_id: currency.value,
        valid_bet: "0.00",
        deposit: "0.00"
      })
    })
  })

  async function onSubmit() {
    nextPrevStep(true)
  }
</script>
