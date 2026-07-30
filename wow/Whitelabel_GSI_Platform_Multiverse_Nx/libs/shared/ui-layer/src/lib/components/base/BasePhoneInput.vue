<script setup lang="ts">
import { computed } from "vue"
import BaseInput from "@shared-lib/components/base/BaseInput.vue"
import BaseSelect from "@shared-lib/components/base/BaseSelect.vue"
import BaseRequiredIcon from "@shared-lib/components/base/BaseRequiredIcon.vue"
import { useGetRegisterInfo } from "@shared-lib/api/hooks/useGetRegisterInfo"

interface Props {
  countryCode?: string | number
  phoneNumber?: string | number
  options?: Array<{ label: string; value: string | number }>
  registerInfoType?: string
  label?: string
  placeholder?: string
  invalid?: boolean
  required?: boolean
  errorMessage?: string
  disabled?: boolean

  // 💡 控制顯示哪些子欄位（預設都顯示）。用於 register 動態表單只傳其中一個欄位的情境
  showCountry?: boolean
  showPhone?: boolean

  classObj?: {
    root?: string // 最外層容器
    label?: string // 標籤文字
    select?: string // 國碼 Select 容器 (可用來覆寫預設的 w-[110px])
    input?: string // 號碼 Input 容器
    errorMessage?: string // 錯誤訊息容器
  }
}

const props = withDefaults(defineProps<Props>(), {
  invalid: false,
  required: false,
  disabled: false,
  registerInfoType: "register",
  placeholder: "請輸入 ...",
  showCountry: true,
  showPhone: true,
  classObj: () => ({})
})

const emit = defineEmits(["update:countryCode", "update:phoneNumber"])

const localCountryCode = computed({
  get: () => props.countryCode,
  set: (val) => emit("update:countryCode", val)
})

const localPhoneNumber = computed({
  get: () => props.phoneNumber,
  set: (val) => emit("update:phoneNumber", val)
})

const shouldLoadCountryFromApi = !Boolean(props.options?.length) && props.showCountry

const { registerInfoList } = useGetRegisterInfo({
  params: { type: props.registerInfoType },
  options: {
    enabled: shouldLoadCountryFromApi
  }
})

const countryOptions = computed(() => {
  if (props.options?.length) return props.options
  if (!registerInfoList.value) return []
  const countryField = registerInfoList.value.find((item) => item.column_name === "country")
  return countryField?.values || []
})
</script>

<template>
  <div :class="cx('flex flex-col gap-1 w-full', props.classObj?.root)">
    <label
      v-if="label"
      :class="
        cx(
          'flex items-center gap-1 text-sm leading-5 font-medium text-[var(--text-text-primary)]',
          props.classObj?.label
        )
      "
    >
      {{ label }}
      <BaseRequiredIcon v-if="required" />
    </label>

    <div class="flex gap-2 w-full">
      <!-- 💡 國碼選單：僅當 showCountry === true 時顯示 -->
      <BaseSelect
        v-if="showCountry"
        v-model="localCountryCode"
        :options="countryOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="請選擇..."
        :invalid="invalid"
        :disabled="disabled"
        :class-obj="{
          wrapper: cx('w-[110px] flex-shrink-0', props.classObj?.select),
          select: 'min-w-0'
        }"
      />

      <!-- 💡 電話輸入框：僅當 showPhone === true 時顯示 -->
      <BaseInput
        v-if="showPhone"
        v-model="localPhoneNumber"
        type="text"
        :placeholder="placeholder"
        :invalid="invalid"
        :disabled="disabled"
        :class-obj="{
          root: cx('flex-1', props.classObj?.input)
        }"
      />
    </div>

    <!-- 💡 錯誤訊息以 phone input 為主 -->
    <BaseErrorMessage v-if="invalid && errorMessage" :errorMessage="errorMessage" />
  </div>
</template>
