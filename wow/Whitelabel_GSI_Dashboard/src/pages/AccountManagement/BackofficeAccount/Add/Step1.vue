<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section align="center" class="add-account">
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <p class="text-left q-mb-xs">{{ $t("table_header.account") }}</p>
          <q-input
            v-model="form.account"
            outlined
            :placeholder="$t('common.please_enter_account')"
            class="default-input"
          />
        </div>
        <div class="col-6">
          <p class="text-left q-mb-xs">{{ $t("table_header.password") }}</p>
          <q-input
            v-model="form.password"
            outlined
            type="password"
            :placeholder="$t('step_input_tip.member_pw')"
            class="default-input"
          />
        </div>
        <div class="col-6">
          <p class="text-left q-mb-xs">{{ $t("table_header.name") }}</p>
          <q-input v-model="form.name" outlined :placeholder="$t('common.please_enter_name')" class="default-input" />
        </div>
        <div class="col-6">
          <p class="text-left q-mb-xs">{{ $t("table_header.phone_number") }}</p>
          <q-input v-model="form.phone" outlined :placeholder="$t('common.please_enter_phone')" class="default-input" />
        </div>
        <div class="col-6">
          <p class="text-left q-mb-xs">{{ $t("table_header.email") }}</p>

          <q-input v-model="form.email" outlined :placeholder="$t('common.please_enter_email')" class="default-input" />
        </div>
        <div class="col-12">
          <p class="text-left q-mb-xs">{{ $t("table_header.remark") }}</p>

          <q-input v-model="form.remark" outlined type="textarea" :placeholder="$t('common.please_enter_content')" />
        </div>
        <div class="col-4 column items-start">
          <p class="text-left q-mb-xs">{{ $t("table_header.enable_or_disable") }}</p>

          <q-btn-toggle
            class="btn_toggle_style"
            v-model="form.enabled"
            :options="[
              { label: $t('common.enable'), value: true },
              { label: $t('common.disable'), value: false }
            ]"
            toggle-color="primary"
            unelevated
            rounded
          />
        </div>
        <div class="col-4 column items-start">
          <p class="text-left q-mb-xs">{{ $t("query_params.account_status") }}</p>

          <q-btn-toggle
            class="btn_toggle_style"
            v-model="form.is_ban"
            :options="[
              { label: $t('common.un_frozen'), value: false },
              { label: $t('common.frozen'), value: true }
            ]"
            toggle-color="primary"
            unelevated
            rounded
          />
        </div>
        <!-- <div class="col-4 column items-start">
          <div class="text-left q-pl-sm q-pb-sm">{{ $t("table_header.second_verification") }}</div>
          <q-btn-toggle
            v-model="form.verify_binding"
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
      <q-btn color="main-color" class="edit_btns" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, defineEmits } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import type { AddAdminAccount } from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const { nextPrevStep } = useStepper()
  const emits = defineEmits(["step1Submit"])
  const $q = useQuasar()
  const { t } = useI18n()

  const form = reactive<AddAdminAccount>({
    account: "",
    password: "",
    enabled: false,
    is_ban: false,
    name: "",
    phone: "",
    email: "",
    remark: "",
    verify_binding: false,
    role_id: 0
  })
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
  }
  onMounted(() => {
    console.log("step1")
  })
  //8~20字內，至少包含1個大寫字母，1個小寫字母和1個號碼
  const passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,20}$/
  function onSubmit() {
    // 檢查欄位規則，不符合則return掉
    // 检查是否包含禁止输入的特殊字符
    const forbiddenChars = /^[a-zA-Z0-9]+$/
    if (form.account === "") {
      errorMsg("common.please_enter_account")
      return
    } else if (form.account.length < 4) {
      errorMsg("error_msg.enter_account_four_characters_error")
      return
    } else if (!forbiddenChars.test(form.account)) {
      errorMsg("error_msg.enter_account_forbidden_error")
      return
    } else if (form.password === "") {
      errorMsg("common.please_enter_password")
      return
    } else if (!passwordReg.test(form.password)) {
      errorMsg("error_msg.enter_member_pw_forbidden_error")
      return
    }

    emits("step1Submit", form)

    nextPrevStep(true)
  }
</script>

<style lang="scss" scoped></style>
