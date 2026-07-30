<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section align="center" class="add-account">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("table_header.agent_ID") }}</div>
          <q-input v-model="form.agent_code" outlined square :placeholder="$t('common.please_enter_account')" />
        </div>

        <div class="col-6">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("table_header.agent_name") }}</div>
          <q-input v-model="form.agent_name" outlined square :placeholder="$t('common.please_enter_name')" />
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, defineEmits } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import type { AddAuroraAgent } from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const { nextPrevStep } = useStepper()
  const emits = defineEmits(["step1Submit"])
  const $q = useQuasar()
  const { t } = useI18n()

  const agent_code_rule = /^[a-zA-Z0-9]{1,4}$/
  const form = reactive<AddAuroraAgent>({
    agent_code: "",
    agent_name: ""
  })
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
  }
  onMounted(() => {})
  function onSubmit() {
    if (form.agent_code === "") {
      errorMsg("common.please_enter_agent_id")
      return
    } else if (!agent_code_rule.test(form.agent_code)) {
      errorMsg("error_msg.the_agent_id_limited_to_4")
      return
    } else if (form.agent_name === "") {
      errorMsg("common.please_enter_agent_name")
      return
    }

    emits("step1Submit", form)
  }
</script>

<style lang="scss" scoped>
  .add-account {
    width: 600px;
    margin: 0 auto;
  }
</style>
