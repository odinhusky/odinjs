<template>
  <q-card class="no-shadow bg-transparent promotion-add">
    <q-card-section class="q-pt-s">
      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_ID") }}</div>
          <q-input
            v-model="localForm.agent_code"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.agent_id_limited_to_4')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_account") }}</div>
          <q-input
            v-model="localForm.display_name"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_agent_account')"
          />
        </div>
      </div>
      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.password") }}</div>
          <q-input
            v-model="localForm.password"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_agent_account')"
            type="password"
          />
        </div>
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.confirm_password") }}</div>
          <q-input
            v-model="localForm.confirm_password"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_confirm_your_password')"
            type="password"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.agent_name") }}</div>
          <q-input
            v-model="localForm.title"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_agent_name')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("common.contact_person") }}</div>
          <q-input
            v-model="localForm.contact"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_contact_person')"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.phone_number") }}</div>
          <q-input
            v-model="localForm.mobile"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_phone')"
          />
        </div>

        <div class="col-4">
          <div class="q-pb-xs">{{ $t("table_header.email") }}</div>
          <q-input
            v-model="localForm.email"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_email')"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl flex-center q-pb-lg">
        <div class="col-8">
          <div class="q-pb-xs">{{ $t("table_header.remark") }}</div>
          <q-input
            v-model="localForm.remark"
            outlined
            square
            standout="bg-white text-black"
            :placeholder="$t('common.please_enter_content')"
            type="textarea"
          />
        </div>
      </div>
      <div class="row flex-center q-col-gutter-xl q-pb-lg q-pl-xl">
        <!--  <div class="col-3">
          <div class="q-ml-md q-mt-md">{{ $t("query_params.status") }}</div>
          <q-card class="q-mt-md bg-transparent">
            <q-card-actions align="left">
              <q-toggle
                v-model="localForm.enabled"
                :color="localForm.enabled ? 'positive' : 'negative'"
                :false-value="false"
                :true-value="true"
                keep-color
                stack-label
                :label="localForm.enabled ? $t('common.enable') : $t('common.disable')"
              />
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-3">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("query_params.account_status") }}</div>
          <q-btn-toggle
            v-model="localForm.is_ban"
            toggle-color="main-color"
            :options="[
              { label: $t('common.un_frozen'), value: false },
              { label: $t('common.frozen'), value: true }
            ]"
          />
        </div>-->
        <!--<div class="col-3">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("table_header.second_verification") }}</div>
          <q-btn-toggle
            v-model="localForm.unbind_2fa"
            toggle-color="main-color"
            :options="[
              { label: $t('common.binding'), value: true },
              { label: $t('common.unbind'), value: false }
            ]"
          />
        </div>-->
      </div>
    </q-card-section>
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" outline @click="onCancel">{{ $t("btn.cancel") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color q-px-xl" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import { defineEmits, defineProps, ref, watch } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const { nextPrevStep } = useStepper()
  const $q = useQuasar()
  const { t } = useI18n()
  const props = defineProps<{ modelValue: any }>()
  const emit = defineEmits(["update:modelValue", "onCancel", "onSubmit"])
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
  }
  const agent_code_rule = /^[a-zA-Z0-9]{1,4}$/
  const rule = /^[a-zA-Z0-9]{4,}$/
  function onSubmit() {
    // 檢查欄位規則，不符合則return掉
    if (localForm.value.agent_code === "") {
      errorMsg("common.please_enter_agent_id")
      return
    } else if (!agent_code_rule.test(localForm.value.agent_code)) {
      errorMsg("error_msg.the_agent_id_limited_to_4")
      return
    } else if (localForm.value.display_name === "") {
      errorMsg("common.please_enter_account")
      return
    } else if (!rule.test(localForm.value.display_name)) {
      errorMsg("error_msg.enter_agent_account_error")
      return
    } else if (localForm.value.password === "") {
      errorMsg("common.please_enter_password")
      return
    } else if (!rule.test(localForm.value.password)) {
      errorMsg("error_msg.enter_agent_password_error")
      return
    } else if (localForm.value.confirm_password === "") {
      errorMsg("common.please_confirm_your_password")
      return
    } else if (localForm.value.confirm_password !== localForm.value.password) {
      errorMsg("common.confirm_password_error")
      return
    } else if (localForm.value.title === "") {
      errorMsg("common.please_enter_agent_name")
      return
    }

    emit("onSubmit", localForm)
  }

  const onCancel = () => {
    emit("onCancel")
  }

  const localForm = ref({ ...props.modelValue })
  watch(
    localForm,
    (newVal) => {
      emit("update:modelValue", newVal)
    },
    { deep: true }
  )
</script>
