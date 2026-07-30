<template>
  <q-form @submit.prevent="register" class="register-form-wrapper pad:pt-3" autocomplete="new-password">
    <template v-for="(column, key) in customInputList" :key="key">
      <PhoneInput
        v-if="column.column_name === firstPhoneOrCountryColumn"
        v-model:phone="formRegister.phone"
        v-model:country="formRegister.country"
      ></PhoneInput>

      <LoginRegisterOuterInputContainer
        v-else-if="column.column_name === 'sms_otp'"
        :label-props="{
          labelText: column?.lang?.[nowLang] || $t(`member.register.${column.column_name}`),
          labelContainerClass: 'padLg:px-3',
          labelTextClass: 'label-text-color',
          isRequired: column.required,
        }"
        :class="`dynamic-input-${column.column_name}`"
      >
        <div class="w-full">
          <SmsOtpInput
            :field="column"
            :phone="formRegister.phone ?? ''"
            :country-code="formRegister.country || defaultCountryCode"
            class="form-input"
            v-model="(formRegister as Request.register)[column.column_name]"
          />
        </div>
      </LoginRegisterOuterInputContainer>

      <LoginRegisterOuterInputContainer
        v-else-if="excludeColumn(column.column_name)"
        :label-props="{
          labelText: column?.lang?.[nowLang] || $t(`member.register.${column.column_name}`),
          labelContainerClass: 'padLg:px-3',
          labelTextClass: 'label-text-color',
          isRequired: column.required,
        }"
        :class="`dynamic-input-${column.column_name}`"
      >
        <div class="w-full">
          <div v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input" class="field-input">
            <ExtraInput
              :field="column"
              :class="'form-control !pt-0'"
              :hide-bottom-space="envInfoStore.envInfo.member_bank_real_name === 1 && column.column_name === 'fullname'"
              v-model="(formRegister as Request.register)[column?.column_name]"
            ></ExtraInput>
          </div>

          <div
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
            class="field-input !pt-0"
          >
            <ExtraSelect
              v-model="(formRegister as Request.register)[column?.column_name]"
              :field="column"
              :class="'form-control !pt-0'"
            ></ExtraSelect>
          </div>
          <div
            class="field-input"
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
          >
            <DateInput
              :field="column"
              :class="'form-control !pt-0'"
              v-model="(formRegister as Request.register)[column?.column_name]"
            ></DateInput>
          </div>
          <RealNameBankMatchNotice v-if="column.column_name === 'fullname'" />
        </div>
      </LoginRegisterOuterInputContainer>
    </template>
    <div class="btn-wrapper">
      <q-btn class="btn-submit" type="submit" :loading="isLoading"> {{ $t("common.btn.register") }}</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"
import RealNameBankMatchNotice from "src/common/components/RealNameBankMatchNotice.vue"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE, LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
import { useEnvInfoStore } from "src/stores/envStore"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

import DateInput from "../../ExtraInput/Date.vue"
import ExtraInput from "../../ExtraInput/Index.vue"
import PhoneInput from "../../ExtraInput/Phone.vue"
import ExtraSelect from "../../ExtraInput/Select.vue"
import SmsOtpInput from "../../ExtraInput/SmsOtpInput.vue"

const { nowLang } = useLanguage()
const { defaultCountryCode } = useEnv()
const envInfoStore = useEnvInfoStore()
const $q = useQuasar()
const _Rules = useRule()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const {
  isLoading,
  _handleGetOTP,
  _hiddenColumn,
  handleRegisterCustomInput,
  handleLogin,
  handleRegister,
  _auth,
  _handleCheckPhone,
} = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()

useBasicInfoQuery()
const eventbus = injectStrict(EventBusKey)
const _errorSpacing = ref(false)
const customInputList = ref<Response.RegistInputCustomList>([])

const firstPhoneOrCountryColumn = computed(() => {
  return customInputList.value.find((c) => c.column_name === "phone" || c.column_name === "country")?.column_name
})

const schemaHasSmsOtp = computed(() => customInputList.value.some((c) => c.column_name === "sms_otp"))

const formRegister = ref<Request.register>({
  is_customize: true,
  country: defaultCountryCode.value,
})

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
    case "sms_otp":
      return false

    default:
      return true
  }
}

const register = async () => {
  const registerPayload = { ...formRegister.value }
  if (!schemaHasSmsOtp.value) {
    delete registerPayload.sms_otp
  }
  const { status } = await handleRegister(registerPayload)

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000,
  })

  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Password,
    username: formRegister.value.account,
    password: formRegister.value.password,
  }
  await login(payload)
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000,
  })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => {
  eventbus.emit("openLoginWithRegister", false)
}

watch(defaultCountryCode, (code) => {
  if (code && !formRegister.value.country) {
    formRegister.value.country = code
  }
})

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  const { referral_code } = route.query
  if (referral_code) {
    formRegister.value.ref_account = referral_code as string
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/_variable.scss";
@import "app/template/set_ed8888/assets/css/form.scss";

.form-input {
  // Override autofill background - use actual form input background
  :deep(.q-field__native),
  :deep(input) {
    background-color: transparent !important;
    background-image: none !important;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      // Force specific background color - no autofill highlight
      -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
      box-shadow: 0 0 0 1000px #ffffff inset !important;

      // Set text color to white (neutral-01)
      -webkit-text-fill-color: black !important;

      // Suppress autofill animation/flash
      transition: background-color 5000s ease-in-out 0s !important;

      // Ensure caret color matches text
      caret-color: black !important;
    }

    &:-moz-autofill {
      background-color: transparent !important;
      box-shadow: 0 0 0 1000px #000 inset !important;
      color: black !important;
      caret-color: black !important;
    }

    // Remove border
    border: none;
    border-color: transparent;
    border-bottom: 1px solid black !important;
    border-radius: 0px;
  }

  :deep(.q-field__inner) {
    height: fit-content;
    .q-field__control {
      &::before {
        border: none;
        border-bottom: 1px solid black !important;
      }
    }
  }
  :deep(.q-field__append) {
    i {
      color: black;
    }
  }
}

.field-input {
  @apply mb-8;

  :deep(.q-field__messages) {
    color: #ed4014;
  }
}

.register-form-wrapper {
  .btn-wrapper {
    @apply flex;
    .btn-submit {
      @apply my-0;
    }
  }
}
</style>
