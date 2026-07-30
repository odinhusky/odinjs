<template>
  <LoginRegisterOuterInputContainer
    v-if="countryFiled || phoneFiled"
    :label-props="{
      labelText: phoneFiled ? t('member.register.phone') : t('member.register.country'),
      labelContainerClass: 'padLg:px-3',
      labelTextClass: 'label-text-color',
      isRequired: phoneFiled ? phoneFiled.required : countryFiled ? countryFiled.required : false
    }"
  >
    <div class="phone-group field-input padLg:px-3 !mb-8 !pt-0" style="white-space: nowrap !important">
      <q-select
        v-if="countryFiled"
        v-model="inputCountry"
        :options="countryFiled.values || []"
        emit-value
        map-options
        dense
        borderless
        lazy-rules
        clearable
        :display-value="inputCountry ? undefined : countryLabel"
        :rules="countryFiled.required ? [Rules.required()] : [Rules.noRule]"
        :option-value="(opt) => opt.value"
        :option-label="(opt) => opt.label"
        class="form-input country form-control"
        popup-content-class="ed8888-country-popup"
        options-dark
      >
      </q-select>
      <q-input
        v-if="phoneFiled"
        ref="phoneNationalInputRef"
        v-model="inputPhone"
        :rules="phoneInputRules"
        @blur="onNationalPhoneBlur"
        @focus="onNationalPhoneFocus"
        :lazy-rules="Rules.nationalPhoneLazyRules(props.country)"
        dense
        borderless
        class="form-input phone form-control"
        :maxlength="Rules.nationalPhoneMaxLength(props.country)"
        :placeholder="
          phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`)
        "
        :disable="phoneDisable"
        inputmode="numeric"
      />
    </div>
  </LoginRegisterOuterInputContainer>
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
import LoginRegisterOuterInputContainer from "src/common/components/LoginRegisterOuterInputContainer/index.vue"

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
  values: []
}

interface Props {
  phone: any
  country: any
  class?: string
  phoneDisable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  phone: "",
  country: null,
  phoneDisable: false
})

const emit = defineEmits(["update:phone", "update:country"])

const customInputList = ref<Response.RegistInputCustomList>([])

const phoneFiled = ref<Field>()

const countryFiled = ref<Field>()

const countryLabel = computed(() => {
  return countryFiled.value?.lang[nowLang.value]
    ? countryFiled.value?.lang[nowLang.value]
    : t(`member.register.${countryFiled.value?.column_name}`)
})

const phoneNationalInputRef = ref()
const { requireFullNationalNumber, onNationalPhoneBlur, onNationalPhoneFocus } = useNationalPhoneBlurFullGate(
  phoneNationalInputRef,
  computed(() => props.country)
)
useNationalPhoneRevalidateOnDialCodeChange(() => props.country, phoneNationalInputRef)

const phoneInputRules = computed(() => {
  if (!phoneFiled.value?.required) {
    return [Rules.noRule]
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

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.form-input
  ::v-deep(.q-field__inner)
    .q-field__control
      height: 44px
    .q-field__append
      height: 44px
  &.q-field--with-bottom
    padding-bottom: 0
  ::v-deep(.q-field__native),
  ::v-deep(.q-field__prefix),
  ::v-deep(.q-field__suffix),
  ::v-deep(.q-field__input)
    padding-left: 8px !important

.phone-group
  border: 1px solid #400001
  border-radius: 0.625rem
  display: flex
  justify-content: space-between
  align-content: center
  ::v-deep(.q-field--with-bottom)
    +iphone-width
      padding: 0
  .country
    flex-grow: 2
  .phone
    flex-grow: 1
  +iphone-width
    width: 100%
    margin-bottom: 0.5rem
    padding: 1rem 0rem 0rem
    position: relative

:global(.ed8888-country-popup .q-item),
:global(.ed8888-country-popup .q-item__label)
  color: $common-white-color !important
</style>
