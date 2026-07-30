<template>
  <q-card class="no-shadow bg-transparent promotion-add">
    <EventInfo></EventInfo>
    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { LANGUAGE_TYPE } from "@/utils/constants"
  import { useStepper } from "@/hook/useStepper"
  import type * as Request from "@/api/request.type"
  import EventInfo from "@/pages/InvitationBonus/InvitationBonusSetting/component/EventInfo.vue"

  const $q = useQuasar()
  const { t } = useI18n()
  const invitationBonusStore = useInvitationBonusStore()
  const { invitationBonusItem: form } = storeToRefs(invitationBonusStore)
  const { nextPrevStep } = useStepper()

  function checkInfoValidity(info: Request.InvitationBonusInfo[]): boolean {
    for (let obj of info) {
      if (obj.title === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } /*else if (obj.description_page === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_content")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.images === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }*/
    }
    return true
  }
  function canSendApi(): boolean {
    if (!checkInfoValidity(form.value.i18n)) {
      return false
    }
    if (!form.value.start_date || !form.value.end_date) {
      $q.notify({
        type: "negative",
        message: `${t("table_header.please_select")}${t("edit_form.event_date")}`,
        position: "top",
        timeout: 1000
      })
      return false
    }

    return true
  }
  async function onSubmit() {
    // 檢查欄位規則，不符合則return掉
    if (!canSendApi()) {
      return
    }

    nextPrevStep(true)
  }
</script>

<style lang="scss" scoped>
  .promotion-add {
  }
</style>
