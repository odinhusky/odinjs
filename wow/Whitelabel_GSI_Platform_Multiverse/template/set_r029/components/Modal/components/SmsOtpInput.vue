<template>
  <div class="sms-otp-wrapper">
    <div class="field-input sms-otp-input">
      <q-input
        v-model="inputValue"
        class="input-control form-control"
        :label="field?.lang?.['en'] || $t(`member.register.${field.column_name}`)"
        dense
        borderless
        lazy-rules
        :rules="field.required ? [Rules.required()] : [Rules.noRule]"
      >
        <template #prepend>
          <img :src="shieldIcon" alt="sms-otp" class="field-icon-image" />
        </template>
      </q-input>
    </div>
    <q-btn class="otp-btn" :disable="isLoading || !phone || counting" @click="getOtpCode">
      <vue-countdown v-if="counting" @end="counting = false" :time="90000" v-slot="{ totalSeconds }">
        {{ `${totalSeconds}s` }}
      </vue-countdown>
      <span v-else>{{ $t("common.btn.send") }}</span>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import VueCountdown from "@chenfengyuan/vue-countdown"
import { computed, ref } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { SMS_OTP_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"
import shieldIcon from "app/template/set_r029/assets/images/svg/shield.svg"

interface Props {
  modelValue: string
  phone: string
  /** Dialing code for SMS OTP API, e.g. "+886" */
  countryCode?: string
  requestType?: SMS_OTP_TYPE.Enums
  field: Response.RegistInputCustom
}

interface ShieldIcon {
  default: string
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

const counting = ref(false)
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isLoading, handleGetOTP } = useAuth()

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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";
@import "app/template/set_r029/assets/css/form.scss";

.sms-otp-wrapper {
  @apply flex items-center gap-2 mb-4;

  .sms-otp-input {
    @apply mb-0 flex-1;
  }
}

.field-icon-image {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
}

.otp-btn {
  @apply rounded-[.625rem] capitalize;
  background: $r029-action-primary;
  color: $r029-bg-home;
  min-width: 6rem;
  height: 2.75rem;
}
</style>
