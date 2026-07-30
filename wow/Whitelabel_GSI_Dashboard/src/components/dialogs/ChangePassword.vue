<template>
  <dialog-comp
    v-model="changePasswordDialogDialog"
    :configs="dialogConfig"
    :loading="changePasswordDialogLoading"
    :disable="!canSend"
    width="500px"
    @hide="initFormData"
  >
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("common.change_password") }}</div>
      </div>
    </template>
    <template #customerContent>
      <div class="q-pa-xl">
        <div class="row q-gutter-sm q-mb-md">
          <div class="col-12 text-weight-bold">{{ $t("dialog.changePassword.original_password") }}</div>
          <div class="col-12">
            <q-input
              v-model="form.old_password"
              type="text"
              maxlength="50"
              outlined
              @focus="handleFocus('old_password')"
              @blur="handleBlur('old_password')"
            />
          </div>
          <div v-if="isShowTip('old_password')" :class="{ 'text-red': isTipError('old_password') }">
            * {{ $t("dialog.changePassword.password_rule_tip") }}
          </div>
        </div>
        <div class="row q-gutter-sm q-mb-md">
          <div class="col-12 text-weight-bold">{{ $t("dialog.changePassword.new_password") }}</div>
          <div class="col-12">
            <q-input
              v-model="form.new_password"
              type="text"
              maxlength="50"
              outlined
              @focus="handleFocus('new_password')"
              @blur="handleBlur('new_password')"
            />
          </div>
          <div v-if="isShowTip('new_password')" :class="{ 'text-red': isTipError('new_password') }">
            * {{ $t("dialog.changePassword.password_rule_tip") }}
          </div>
        </div>
        <div class="row q-gutter-sm q-mb-md">
          <div class="col-12 text-weight-bold">{{ $t("dialog.changePassword.confirm_new_password") }}</div>
          <div class="col-12">
            <q-input
              v-model="form.confirm_password"
              type="text"
              maxlength="50"
              outlined
              @focus="handleFocus('confirm_password')"
              @blur="handleBlur('confirm_password')"
            />
            <div v-if="isShowTip('confirm_password')" :class="{ 'text-red': isTipError('confirm_password') }">
              * {{ $t("dialog.changePassword.password_rule_tip") }}
            </div>
          </div>
        </div>
        <div class="row q-gutter-sm q-mb-md">
          <div class="col-12 text-weight-bold">{{ $t("dialog.changePassword.enter_dynamic_code") }}</div>
          <div class="col-12">
            <q-input v-model="form.google_otp" type="text" maxlength="6" outlined />
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { changePassword, ChangePasswordReq, ChangePasswordReqKeys } from "@/api/changePassword"
  import { useValidate } from "@/hook/useValidate"
  import { useSearch } from "@/hook/useSearch"

  const $q = useQuasar()
  const { t } = useI18n()
  const { validatePassword } = useValidate()

  const form = reactive<ChangePasswordReq>({
    old_password: "",
    new_password: "",
    confirm_password: "",
    google_otp: ""
  })
  const focusInput = ref("")
  const errorInput = ref<string[]>([])

  const canSend = computed(() => {
    return (
      validatePassword(form.old_password) &&
      validatePassword(form.new_password) &&
      validatePassword(form.confirm_password)
    )
  })

  const handleFocus = (formParameter: ChangePasswordReqKeys) => {
    focusInput.value = formParameter
  }
  const handleBlur = (formParameter: ChangePasswordReqKeys) => {
    if (focusInput.value === formParameter) {
      focusInput.value = ""
    }
    if (validatePassword(form[formParameter])) {
      errorInput.value = errorInput.value.filter((e) => e !== formParameter)
    } else {
      errorInput.value.push(formParameter)
    }
  }
  const isShowTip = (formParameter: ChangePasswordReqKeys) => {
    return focusInput.value === formParameter || errorInput.value.includes(formParameter)
  }
  const isTipError = (formParameter: ChangePasswordReqKeys) => {
    return errorInput.value.includes(formParameter)
  }

  const initFormData = () => {
    form.old_password = ""
    form.new_password = ""
    form.confirm_password = ""
    form.google_otp = ""
    focusInput.value = ""
    errorInput.value = []
  }

  const {
    dialog: changePasswordDialogDialog,
    openDialog: openChangePasswordDialog,
    closeDialog: closeChangePasswordDialog,
    loading: changePasswordDialogLoading,
    openLoading: openChangePasswordLoading,
    closeLoading: closeChangePasswordLoading
  } = useDialog()
  const onSubmit = async () => {
    if (!canSend.value) {
      $q.notify({
        type: "negative",
        message: t("error_msg.form_validate_error_tip"),
        position: "top",
        timeout: 1000
      })
      return
    }
    openChangePasswordLoading()

    const { search, status, tableData } = useSearch(changePassword)
    await search(form)

    if (status.value) {
      $q.notify({
        color: "green",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
      initFormData()
      closeChangePasswordDialog()
    }
    closeChangePasswordLoading()
  }
  const dialogConfig: IDialogConfig = {
    type: DialogType.CONFIRM,
    useActions: true,
    submitFunction: onSubmit
  }

  defineExpose({ openChangePasswordDialog })
</script>

<style lang="scss" scoped></style>
