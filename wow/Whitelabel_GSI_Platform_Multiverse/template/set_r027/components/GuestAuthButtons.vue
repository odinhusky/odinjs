<template>
  <div v-if="!isLogin" class="guest-auth-buttons" :class="`guest-auth-buttons--${variant}`">
    <q-btn class="login-btn" @click="showLoginOrRegister(0, $q.platform.is.mobile ? true : false)">
      {{ $t("common.btn.login") }}
    </q-btn>

    <q-btn class="register-btn" @click="showLoginOrRegister(1, $q.platform.is.mobile ? true : false)">
      {{ $t("common.btn.register") }}
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuasar } from "quasar"
import { EventBusKey } from "src/symbols"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"

const props = withDefaults(
  defineProps<{
    variant?: "header" | "home"
  }>(),
  {
    variant: "header"
  }
)

const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const { isLogin } = useAuth()
const variant = computed(() => props.variant)

const showLoginOrRegister = (type: number, forcePasswordLogin = false) => {
  if (!type) {
    eventbus.emit("openLogin", true, forcePasswordLogin)
  } else {
    eventbus.emit("openRegister", true)
  }
}
</script>

<style lang="scss" scoped>
.guest-auth-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  @media (max-width: 767px) {
    margin-top: 12px;
  }

  .login-btn,
  .register-btn {
    border-radius: 8px;
    color: var(--btn-text-05) !important;
    font-weight: 700;
    font-size: 14px;
    font-family: Arial;
  }

  &--header {
    gap: 0.5rem;

    .login-btn,
    .register-btn {
      width: 8.5rem;
      min-height: 36px;
      padding: 0.65rem 0.75rem;

      :deep(.q-btn__content) {
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .login-btn {
      background: var(--btn-bg-01) !important;
    }

    .register-btn {
      background: var(--btn-bg-08) !important;
    }
  }

  &--home {
    width: 100%;
    gap: 12px;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;

    .login-btn,
    .register-btn {
      flex: 1 1 0;
      min-height: 47px;
      padding: 8px 12px;
    }

    .login-btn {
      background: var(--btn-bg-05, #24263e) !important;
    }

    .register-btn {
      background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
    }
  }
}
</style>
