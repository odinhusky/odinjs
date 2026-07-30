<template>
  <q-dialog
    :model-value="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="isLargeTablet ? '0' : '300'"
    :maximized="isLargeTablet"
    @update:model-value="onDialogUpdate"
  >
    <q-card :class="`${isLargeTablet ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
          <q-btn icon="close" class="hide-hover" flat round dense @click="handleClose" />
        </div>
        <div class="card-right-form">
          <ModeLoginRegister ref="formRef" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { usePromotionRegister } from "src/common/composables/usePromotionRegister"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { nextTick, ref, watch } from "vue"
import { useRoute } from "vue-router"

import ModeLoginRegister from "../Form/ModeLoginRegister.vue"

const AUTH_ROUTE_NAMES = new Set(["Login", "Register"])

const props = defineProps<{
  show: boolean
  mode: "login" | "register"
}>()

const emit = defineEmits<{
  close: []
}>()

const { getWideLogo } = useLogo()
const { isLargeTablet } = useMediaQuery()
const { eventEmit, eventOnce } = useEventBus()
const { promotionState, firstRegisterPromotion } = usePromotionRegister()
const route = useRoute()

const formRef = ref<InstanceType<typeof ModeLoginRegister> | null>(null)
const suppressDialogClose = ref(false)

function handleClose() {
  if (
    promotionState.value.isFinishSpinRegisterRoulette &&
    firstRegisterPromotion &&
    formRef.value?.isLoginMode === false
  ) {
    eventEmit("openRegisterPronotionTip", true)
    return
  }

  emit("close")
}

function onDialogUpdate(value: boolean) {
  if (!value && !suppressDialogClose.value) {
    handleClose()
  }
}

watch(
  () => route.name,
  (name, oldName) => {
    if (AUTH_ROUTE_NAMES.has(String(oldName)) && AUTH_ROUTE_NAMES.has(String(name))) {
      suppressDialogClose.value = true
      nextTick(() => {
        suppressDialogClose.value = false
      })
    }
  }
)

async function syncFormMode() {
  if (!props.show) return

  await nextTick()

  if (props.mode === "register") {
    if (formRef.value?.isLoginMode === false) return

    eventOnce("registerFormReady", () => {
      eventEmit("changeRegisterForm")
    })
    return
  }

  if (formRef.value?.isLoginMode !== false) return

  formRef.value?.changeDialog(true)
}

watch(() => [props.show, props.mode] as const, syncFormMode, { immediate: true })
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/button.scss";

.login-card {
  @include hideScrollBar;

  &.pc {
    border-radius: 1.25rem;
    width: 30rem;
    max-height: 42rem;
    background-color: var(--neutral-01);
    color: var(--primary-02);
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.15);
    overflow: hidden auto;
    padding: 1rem 2.5rem 1.25rem;

    .card-left {
      padding: 0;
      width: 30rem;
      height: 41.25rem;
      :deep(.q-carousel) {
        width: 100%;
        height: 41.25rem;
        .q-carousel__slide {
          padding: 0;
          background-size: contain;
        }
        .q-carousel__control {
          bottom: 0.9375rem;
          .q-btn {
            padding: 0;
            margin: 0 0.25rem;
            opacity: 0.2;
            color: var(--secondary-01);
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: var(--primary-01);
            }
            .q-icon {
              font-size: 0.5rem;
              width: 0.5rem;
              min-width: 0.5rem;
            }
          }
        }
      }
    }

    .card-right {
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      position: relative;

      :deep(.form-input) {
        height: fit-content !important;
        margin-top: 0 !important;
      }

      .close-btn-container {
        position: sticky;
        width: 100%;
        z-index: 2;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        top: 0rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;
        img {
          max-width: 13.285625rem;
          max-height: 5rem;
        }
        .q-btn {
          padding: 0;
        }
      }

      .card-right-header {
        margin: 1.25rem 0;
        position: sticky;
        top: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 5.625rem;
          aspect-ratio: auto 90 / 36;
        }
      }
      .card-right-form {
        height: calc(100% - 6.25rem);
        color: var(--neutral-01);
        margin-top: 20px;
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    background-color: var(--bg-main-bg);
    color: var(--secondary-01);
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 5rem; // Space for footer overlay

    .card-right {
      @apply mx-auto flex justify-start items-center flex-col;
      width: 100%;
      min-height: 100%;
      padding: 1.75rem 0.9375rem;

      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-bottom: 2.37125rem;

        .q-btn {
          background: var(--neutral-01);
          color: var(--neutral-09);
        }

        img {
          max-width: 17.5rem;
          max-height: 3.25rem;
        }
      }

      .card-right-header {
        margin-top: 1rem;
        margin-bottom: 2.125rem;
        img {
          height: 4.375rem;
        }
      }
      .card-right-form {
        width: 100%;
      }
    }
  }
}
</style>
