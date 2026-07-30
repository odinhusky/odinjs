<template>
  <q-form class="pad:pt-3" @submit.prevent="registerSms">
    <template v-for="(column, key) in customInputList" :key="key">
      <PhoneInput
        v-if="column.column_name === firstPhoneOrCountryColumn"
        v-model:phone="formRegister.phone"
        v-model:country="formRegister.country"
      ></PhoneInput>

      <LoginRegisterOuterInputContainer
        v-else-if="column.column_name === 'sms_otp'"
        :label-props="{
          labelText: column?.lang?.[nowLang] || $t(`member.register.${ column.column_name }`),
          labelContainerClass: 'padLg:px-3',
          labelTextClass: 'label-text-color',
          isRequired: column.required
        }"
        :class="`dynamic-input-${ column.column_name }`"
      >
        <div class="w-full">
          <SmsOtpInput
            :field="column"
            :phone="formRegister.phone ?? ''"
            :country-code="formRegister.country || defaultCountryCode"
            class="form-input !pt-0"
            v-model="(formRegister as Request.register)[column.column_name]"
          />
        </div>
      </LoginRegisterOuterInputContainer>

      <LoginRegisterOuterInputContainer
        v-else-if="excludeColumn(column.column_name)"
        :label-props="{
          labelText: column?.lang?.[nowLang] || $t(`member.register.${ column.column_name }`),
          labelContainerClass: 'padLg:px-3',
          labelTextClass: 'label-text-color',
          isRequired: column.required
        }"
        :class="`dynamic-input-${ column.column_name }`"
      >
        <div class="w-full">
          <div v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input" class="field-input">
            <ExtraInput
              :field="column"
              :class="'form-control !pt-0'"
              v-model="(formRegister as Request.register)[column?.column_name]"
            ></ExtraInput>
          </div>

          <div
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
            class="field-input"
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
    <div>
      <q-btn class="btn-submit" type="submit" :loading="isLoading" :disabled="!agreeTerms">
        {{ $t("common.btn.register") }}</q-btn
      >
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
import { FIELD_TYPE, LOGIN_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { getSingleRegisterCurrencyValue } from "src/common/utils/registerCurrency"
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
const { defaultCountryCode, isRegisterOtpEnabled } = useEnv()
const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const eventbus = injectStrict(EventBusKey)
const { isLoading, handleRegisterCustomInput, handleLogin, handleRegister } = useAuth()
const { getUserWalletList, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const agreeTerms = ref(true)
const customInputList = ref<Response.RegistInputCustomList>([])

const firstPhoneOrCountryColumn = computed(() => { return customInputList.value.find((c) => c.column_name === "phone" || c.column_name === "country")?.column_name })

const schemaHasSmsOtp = computed(() => customInputList.value.some((c) => c.column_name === "sms_otp"))

const formRegister = ref<Request.register>({
  is_customize: true,
  country: defaultCountryCode.value })

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

const registerSms = async () => {
  const registerPayload = { ...formRegister.value }
  if (!schemaHasSmsOtp.value) { delete registerPayload.sms_otp }
  const { status } = await handleRegister(registerPayload)

  if (!status) { return }
  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000 })
  if (isRegisterOtpEnabled.value || schemaHasSmsOtp.value) {
    const payload: Request.login = {
      login_method: LOGIN_METHOD.Enums.Sms,
      username: formRegister.value.phone,
      sms_otp: formRegister.value.sms_otp }
    await login(payload)
    return
  }

  closeDialog()
}

const login = async (payload: Request.login) => {
  const { status } = await handleLogin(payload)
  if (!status) { return }
  await getUserWalletList()
  $q.notify({
    type: "positive",
    message: t("common.alarm.loginSuccess"),
    position: "top",
    timeout: 1000 })
  router.push({ name: "Home" })
  closeDialog()
}

const closeDialog = () => { eventbus.emit("openLoginWithRegister", false) }

watch(defaultCountryCode, (code) => {
  if (code && !formRegister.value.country) { formRegister.value.country = code }
})

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  const singleCurrencyValue = getSingleRegisterCurrencyValue(customInputList.value)
  if (singleCurrencyValue !== undefined) {
    formRegister.value = { ...formRegister.value, currency: singleCurrencyValue }
  }

  const { referral_code } = route.query
  if (referral_code) { formRegister.value.ref_account = referral_code as string }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_ed8888/assets/css/form.scss";

.field-input {
  @apply mb-8;

  :deep(.q-field__messages) { color: #ed4014; }
}

.input-style { @apply w-10/12; }

.get-otp-wrapper {
  @apply flex items-center gap-2 mb-4;

  .otp-btn {
    @apply text-white rounded-[.625rem];
    background: $primary-color-light;
  }
}

.btn-submit { @apply my-0; }
</style>
