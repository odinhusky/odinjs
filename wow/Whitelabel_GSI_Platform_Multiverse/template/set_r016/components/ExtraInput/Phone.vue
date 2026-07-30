<template>
  <div class="phone-group">
    <q-select
      v-if="countryFiled"
      v-model="inputCountry"
      class="form-select country"
      bg-color="white"
      :options="countryFiled.values || []"
      :display-value="inputCountry ? undefined : countryLabel"
      :rules="countryFiled.required ? [Rules.required()] : []"
      :option-label="(opt) => opt.value"
      emit-value
      map-options
      dense
      borderless
      lazy-rules
      no-error-icon
      hide-bottom-space
    >
    </q-select>
    <q-input
      v-if="phoneFiled"
        ref="phoneNationalInputRef"
        v-model="inputPhone"
      class="form-input flex-1"
      bg-color="white"
      :rules="phoneInputRules"
      @blur="onNationalPhoneBlur"
      @focus="onNationalPhoneFocus"
      :maxlength="Rules.nationalPhoneMaxLength(props.country)"
      inputmode="numeric"
      :placeholder="
        phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`)
      "
      dense
      borderless
      :lazy-rules="Rules.nationalPhoneLazyRules(props.country)"
      unmasked-value
      no-error-icon
      hide-bottom-space
    />
  </div>
</template>

<script setup lang="ts">
import * as Response from "src/api/response.type"
import { useI18n } from "vue-i18n"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import {
  useNationalPhoneBlurFullGate,
  useNationalPhoneRevalidateOnDialCodeChange
} from "src/common/utils/nationalPhoneByDialCode"
import { computed, onMounted, ref } from "vue"

const { t } = useI18n()
const Rules = useRule()
const { nowLang } = useLanguage()
const { handleRegisterCustomInput } = useAuth()

interface Field {
  column_name: string
  customize: boolean
  edit: boolean
  lang: {
    [key: string]: string
  }
  required: boolean
  type: number
  values: Array<{ value: number | string; label: string }>
}

interface Props {
  phone: any
  country: any
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  phone: "",
  country: null
})

const emit = defineEmits(["update:phone", "update:country"])

const customInputList = ref<Response.RegistInputCustomList>([])

const phoneFiled = ref<Field>()

const countryFiled = ref<Field>()

const phoneNationalInputRef = ref()
const { requireFullNationalNumber, onNationalPhoneBlur, onNationalPhoneFocus } = useNationalPhoneBlurFullGate(
  phoneNationalInputRef,
  computed(() => props.country)
)
useNationalPhoneRevalidateOnDialCodeChange(() => props.country, phoneNationalInputRef)

const phoneInputRules = computed(() => {
  if (!phoneFiled.value?.required) {
    return []
  }
  if (countryFiled.value) {
    return [Rules.nationalPhoneByDialCode(props.country, { requireFullNationalNumber })]
  }
  return [Rules.required()]
})

const inputPhone = computed({
  get: () => props.phone,
  set: (value: string | number) => emit("update:phone", Rules.sanitizeNationalPhoneDigits(value, props.country))
})

const countryLabel = computed(() => {
  return countryFiled.value?.lang[nowLang.value]
    ? countryFiled.value?.lang[nowLang.value]
    : t(`member.register.${countryFiled.value?.column_name}`)
})

const inputCountry = computed({
  get: () => props.country,
  set: (value: number) => emit("update:country", value)
})

onMounted(async () => {
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []
  countryFiled.value = customInputList.value.filter((field) => field.column_name === "country")[0]
  phoneFiled.value = customInputList.value.filter((field) => field.column_name === "phone")[0]
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/form.scss";

.phone-group {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .country {
    width: 5.875rem;
    margin-right: 0.625rem;
  }
}
</style>
