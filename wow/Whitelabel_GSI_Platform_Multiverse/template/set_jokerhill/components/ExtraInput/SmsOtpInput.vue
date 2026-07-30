<template>
  <div class="sms-container">
    <q-input
      v-model="inputValue"
      dense
      lazy-rules
      :rules="field.required ? [Rules.required()] : [Rules.noRule]"
      :placeholder="field?.lang?.[nowLang] || $t(`member.register.${field.column_name}`)"
      :class="['sms-otp-input', attrs.class]"
    >
      <template #prepend>
        <div class="divider-error"></div>
        <div class="form-icon">
          <img :src="svgIcon('shield')" />
        </div>
        <div class="divider"></div>
      </template>
    </q-input>
    <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
      <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
        {{ `${totalSeconds}S` }}
      </vue-countdown>
    </q-btn>
    <q-btn
      v-else
      color="blue"
      class="btn-send hide-hover"
      :label="$t('common.btn.send')"
      @click="getOtpCode"
      :disable="isLoading || !phone"
    />
  </div>
</template>

<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown"
import { useSiteImg } from "app/template/set_jokerhill/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { computed, ref, useAttrs } from "vue"
import { useI18n } from "vue-i18n"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import { useLanguage } from "src/common/composables/useLanguage"
import { SMS_OTP_TYPE } from "src/common/utils/constants"

defineOptions({
  inheritAttrs: false
})

interface Props {
  modelValue: string
  phone: string
  /** Dialing code for SMS OTP API, e.g. "+886" */
  countryCode?: string
  requestType?: SMS_OTP_TYPE.Enums
  field: {
    column_name: string
    customize: boolean
    edit: boolean
    lang?: Record<string, string>
    required: boolean
    type: number
    values: []
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  phone: "",
  countryCode: "",
  requestType: SMS_OTP_TYPE.Enums.Register,
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: 1,
    values: []
  })
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const attrs = useAttrs()
const counting = ref(false)
const Rules = useRule()
const { nowLang } = useLanguage()
const { svgIcon } = useSiteImg()
const { isLoading, handleGetOTP } = useAuth()
const { t } = useI18n()
const $q = useQuasar()

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
.sms-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .sms-otp-input {
    flex: 1;
  }

  .btn-send {
    margin-left: 0.5rem;
    width: 5.625rem;
    height: 2.5rem;
    margin-top: 0.1875rem;

    &.counting {
      background: rgb(240, 242, 244) !important;
      color: rgb(160, 172, 201) !important;
      opacity: 1 !important;
    }
  }
}
</style>
