<template>
  <div class="form-wrapper sms-otp-wrapper">
    <label class="form-label">{{ field?.lang?.["en"] || $t(`member.register.${field.column_name}`) }}</label>
    <div class="forgot_wrap">
      <div class="input-with-error-space">
        <q-input
          v-model="inputValue"
          class="text-white w-full"
          lazy-rules
          :rules="field.required ? [Rules.required()] : [Rules.noRule]"
        >
          <template #prepend>
            <img :src="shieldIcon" alt="sms-otp" class="field-icon-image" />
          </template>
        </q-input>
      </div>
      <q-btn v-if="counting" class="hide-hover !w-[60px] btn-modal-reg btn-counting" flat borderless disable>
        <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
          {{ `${totalSeconds}S` }}
        </vue-countdown>
      </q-btn>
      <q-btn
        v-else
        class="hide-hover btn-modal-reg btn-counting !w-[60px]"
        :label="$t('common.btn.send')"
        @click="getOtpCode"
        :disable="isLoading || !phone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { SMS_OTP_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import shieldIcon from "app/template/set_royalslot88/assets/images/svg/shield.svg"

interface Props {
  modelValue: string
  phone: string
  /** Dialing code for SMS OTP API, e.g. "+886" */
  countryCode?: string
  requestType?: SMS_OTP_TYPE.Enums
  field: Response.RegistInputCustom
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  phone: "",
  countryCode: "",
  requestType: SMS_OTP_TYPE.Enums.Register
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const { t } = useI18n()
const $q = useQuasar()
const Rules = useRule()
const { isLoading, handleGetOTP } = useAuth()
const counting = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value)
})

async function getOtpCode() {
  counting.value = true
  const { status } = await handleGetOTP({
    phone: props.phone,
    country_code: props.countryCode || undefined,
    request_type: props.requestType
  })
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}
</script>

<style scoped lang="scss">
.field-icon-image {
  width: 1rem;
  height: 1rem;
}

.sms-otp-wrapper {
  .forgot_wrap {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .input-with-error-space {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  :deep(.q-field--standard .q-field__control:before) {
    border-bottom: 1px solid rgba(255, 255, 255);
  }

  :deep(.q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input) {
    color: #ffffff;
  }
}
</style>
