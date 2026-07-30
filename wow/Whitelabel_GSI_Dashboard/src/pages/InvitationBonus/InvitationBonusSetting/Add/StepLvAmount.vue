<template>
  <q-card class="no-shadow bg-transparent add_card">
    <LevelAmount />

    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit" :loading="isLoading">{{
        $t("btn.next_step")
      }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from "vue"
  import { useQueryStore } from "@/stores/queryStore"

  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { useStepper } from "@/hook/useStepper"
  import { AddInvitationBouns } from "@/api/invitationBouns"
  import LevelAmount from "@/pages/InvitationBonus/InvitationBonusSetting/component/LevelAmount.vue"
  import { ERROR_CODE } from "@/utils/constants"

  const $q = useQuasar()
  const { t } = useI18n()
  const queryStore = useQueryStore()
  const invitationBonusStore = useInvitationBonusStore()
  const { invitationBonusItem: form } = storeToRefs(invitationBonusStore)
  const { nextPrevStep } = useStepper()
  const isLoading = ref(false)

  onMounted(async () => {
    await queryStore.getCurrencyList()
    if (form.value.levelData.length <= 0) {
      form.value.levelData = [
        {
          level_name: "Lv1",
          level: 1,
          active_member_count: "",
          rewards: []
        }
      ]
      queryStore.currencyList.forEach((currency) => {
        form.value.levelData[0].rewards.push({
          currency_id: currency.value,
          reward_amount: ""
        })
      })
    }
  })

  async function onSubmit() {
    const levelData = form.value.levelData

    for (let i = 0; i < levelData.length; i++) {
      const current = levelData[i]

      if (current.active_member_count === "") {
        $q.notify({
          type: "negative",
          message: `${current.level_name}  ${t("error_msg.active_member_cannot_empty")}`,
          position: "top",
          timeout: 1000
        })
        return false
      }

      const currentCount = Number(current.active_member_count)
      for (let j = 0; j < i; j++) {
        const prevCount = Number(levelData[j].active_member_count)
        if (currentCount <= prevCount) {
          $q.notify({
            type: "negative",
            message: `${current.level_name}  ${t("error_msg.the_number_active_members_cannot_less")} ${
              levelData[j].level_name
            }`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }

      //處理 reward_amount 補 0
      current.rewards.forEach((reward) => {
        if (reward.reward_amount === "") {
          reward.reward_amount = "0"
        }
      })
    }

    //空字串API會報錯 所以強制給-1
    form.value.metrics.forEach((item) => {
      if (item.valid_bet === "") {
        item.valid_bet = -1
      }
      if (item.deposit === "") {
        item.deposit = -1
      }
    })
    form.value.levelData.forEach((item: { active_member_count: string | number }) => {
      item.active_member_count = parseInt(item.active_member_count)
    })
    isLoading.value = true
    const { code, msg } = await AddInvitationBouns(form.value)
    isLoading.value = false
    console.log(code)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 1000
      })
    } else if (code === ERROR_CODE.Enums.CAMPAIGN_TIME_OVERLAP_ADD) {
      $q.notify({
        type: "negative",
        message: t("error_msg.the_event_period_overlaps"),
        position: "top",
        timeout: 1000
      })
      return
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      return
    }
    nextPrevStep(true)
  }
</script>
