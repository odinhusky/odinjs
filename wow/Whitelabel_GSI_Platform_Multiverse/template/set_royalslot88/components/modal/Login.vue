<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" use-title :title="$t('common.btn.login')">
    <PhoneLoginForm v-if="showPhoneLoginForm" />
    <AccountLoginForm v-else />
  </ModalBase>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

import ModalBase from "./modalBase.vue"
import PhoneLoginForm from "../Form/PhoneLogin.vue"
import AccountLoginForm from "../Form/AccountLogin.vue"

const { isPhoneRegisterMode, isLoginOtpEnabled } = useEnv()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const showPhoneLoginForm = computed(() => isPhoneRegisterMode.value || isLoginOtpEnabled.value)

onMounted(() => {
  eventbus.on("openLogin", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style scoped lang="scss"></style>
