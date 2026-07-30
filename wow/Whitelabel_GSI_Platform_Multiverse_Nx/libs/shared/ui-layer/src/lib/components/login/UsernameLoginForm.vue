<script setup lang="ts">
// ACCOUNT 模式登入表單：username + password，無路由切換按鈕

const username = defineModel<string>("username", { default: "" })
const password = defineModel<string>("password", { default: "" })
</script>

<template>
  <div class="space-y-4">
    <BaseInput v-model="username" label="Username" required placeholder="請輸入..." />

    <BaseInput v-model="password" label="Password" type="password" required placeholder="請輸入..." />

    <div :class="cx(FLEX_END_CENTER, 'w-full')">
      <ForgotPasswordBtn />
    </div>
  </div>
</template>
