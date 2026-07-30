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
    <div class="phone-group form-input padLg:px-3 !pt-0">
      <q-select
        v-if="countryFiled"
        v-model="inputCountry"
        :options="countryFiled.values || []"
        emit-value
        map-options
        borderless
        lazy-rules
        clearable
        :display-value="inputCountry ? undefined : countryLabel"
        :rules="countryFiled.required ? [Rules.required()] : [Rules.noRule]"
        :option-value="(opt) => opt.value"
        :option-label="(opt) => opt.label"
        :dense="true"
        class="form-input mb-2 pb-4 country"
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
        borderless
        class="form-input mb-2 pb-4 phone"
        :maxlength="Rules.nationalPhoneMaxLength(props.country)"
        inputmode="numeric"
        :placeholder="
          phoneFiled?.lang[nowLang] ? phoneFiled?.lang[nowLang] : $t(`member.register.${phoneFiled.column_name}`)
        "
        autocomplete="new-password"
      />
    </div>
  </LoginRegisterOuterInputContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import * as Response from "src/api/response.type"
import { useI18n } from "vue-i18n"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { useRule } from "src/common/hooks/useRule"
import {
  useNationalPhoneBlurFullGate,
  useNationalPhoneRevalidateOnDialCodeChange
} from "src/common/utils/nationalPhoneByDialCode"
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
}

const props = withDefaults(defineProps<Props>(), {
  phone: "",
  country: null
})

const emit = defineEmits(["update:phone", "update:country"])

const customInputList = ref<Response.RegistInputCustomList>([])

const phoneFiled = ref<Field>()

const countryFiled = ref<Field>()

console.log(phoneFiled)

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

  // 若 countryFiled 載入完成後 props.country 仍為空，且只有一個選項，自動帶入
  if (!props.country && countryFiled.value?.values?.length) {
    const first = (countryFiled.value.values[0] as any)
    const value = first?.value !== undefined ? String(first.value) : String(first)
    emit("update:country", value)
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";

.form-input {
  :deep(.q-field__inner.self-stretch) {
    align-self: center !important;
  }

  :deep(.q-field__inner) {
    border: 1px solid $gray-border-color;
    border-radius: 0.375rem;

    .q-field__control {
      height: 40px;

      &:before {
        border-bottom: 1px solid $gray-border-color;
      }
    }
    .q-field__append {
      height: 40px;
    }
  }
}

.form-input.country {
  :deep(.q-select__dropdown-icon) {
    color: $primary-gold-color;
  }
  :deep(.q-field__control.relative-position.row.no-wrap) {
    border-radius: 6px !important;
    padding-left: 12px;
  }
}

.form-input.phone {
  :deep(.q-field__control.relative-position.row.no-wrap) {
    border-radius: 6px !important;
    padding-left: 12px;
  }
}

.phone-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  :deep(.q-field--with-bottom) {
    @include iphone-width {
      padding: 0;
    }
  }
  .country {
    flex-grow: 2;
  }
  .phone {
    flex-grow: 1;
  }
  @include iphone-width {
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 1rem 0rem 0.5rem;
    position: relative;
  }
}
</style>
