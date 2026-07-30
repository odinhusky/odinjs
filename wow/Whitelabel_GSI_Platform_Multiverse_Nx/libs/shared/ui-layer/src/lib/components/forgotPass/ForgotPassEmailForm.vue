<script setup lang="ts">
interface Props {
  account: string
  email: string
  accountError?: string
  emailError?: string
}

const props = withDefaults(defineProps<Props>(), {
  accountError: "",
  emailError: ""
})

const emit = defineEmits<{
  "update:account": [value: string]
  "update:email": [value: string]
}>()
</script>

<template>
  <div :class="cx(FLEX_COL, 'gap-4')">
    <BaseInput
      :model-value="props.account"
      label="註冊帳戶"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.accountError"
      :error-message="props.accountError"
      @update:model-value="emit('update:account', $event as string)"
    />

    <BaseInput
      :model-value="props.email"
      label="註冊電子信箱"
      required
      placeholder="請輸入 ..."
      :invalid="!!props.emailError"
      :error-message="props.emailError"
      @update:model-value="emit('update:email', $event as string)"
    />
  </div>
</template>
