<script setup lang="ts">
interface Props {
  oldPassword?: string
  password: string
  confirmPassword: string
  oldPasswordError?: string
  passwordError?: string
  confirmPasswordError?: string
  showOldPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  oldPassword: "",
  oldPasswordError: "",
  passwordError: "",
  confirmPasswordError: "",
  showOldPassword: false
})

const emit = defineEmits<{
  "update:oldPassword": [value: string]
  "update:password": [value: string]
  "update:confirmPassword": [value: string]
}>()
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-4')">
    <BaseInput
      v-if="props.showOldPassword"
      :model-value="props.oldPassword"
      type="password"
      label="舊密碼"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.oldPasswordError"
      :error-message="props.oldPasswordError"
      @update:model-value="emit('update:oldPassword', $event as string)"
    />

    <BaseInput
      :model-value="props.password"
      type="password"
      label="新密碼"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.passwordError"
      :error-message="props.passwordError"
      @update:model-value="emit('update:password', $event as string)"
    />

    <BaseInput
      :model-value="props.confirmPassword"
      type="password"
      label="確認密碼"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.confirmPasswordError"
      :error-message="props.confirmPasswordError"
      @update:model-value="emit('update:confirmPassword', $event as string)"
    />
  </div>
</template>
