<template>
  <q-dialog
    :model-value="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    @update:model-value="onDialogUpdate"
  >
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section class="card-right">
        <div class="close-btn-container">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
          <q-btn icon="close" class="hide-hover text-gold" flat round dense @click="handleClose" />
        </div>
        <div class="card-right-form">
          <ModeLoginRegister ref="formRef" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEventBus } from "src/common/hooks/useEventBus"
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

const $q = useQuasar()
const { getWideLogo } = useLogo()
const { eventEmit, eventOnce } = useEventBus()
const route = useRoute()

const formRef = ref<InstanceType<typeof ModeLoginRegister> | null>(null)
const suppressDialogClose = ref(false)

function handleClose() {
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
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";
@import "app/template/okbet_blackGold/assets/css/text.scss";

.login-card {
  @include hideScrollBar;
  &.pc {
    border-radius: 1.25rem;
    min-width: 30rem;
    width: auto;
    height: 42rem;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 20px);
    max-width: 37.5rem;
    background: $primary-black-color;
    color: $primary-white-color;
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
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: $primary-gold-color;
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
      padding: 0rem 2.5rem 0.8125rem;
      overflow: hidden scroll;
      position: relative;
      .close-btn-container {
        width: 100%;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        top: 0rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;
        img {
          height: 5rem;
          padding: 0.625rem;
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
        margin-top: 20px;
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    background-image: url("app/template/okbet_blackGold/assets/images/login/bg-h5.jpg");
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        @apply w-full flex justify-between items-center;
        margin-top: 1.875rem;
        .q-btn {
          color: #6d7693;
        }
        img {
          padding: 0 0.625rem;
          max-width: calc(100% - 2.125rem);
          max-height: 4.625rem;
          height: 100% !important;
          width: auto;
        }
      }
      .card-right-header {
        margin-top: 2rem;
        margin-bottom: 4rem;
        img {
          width: auto;
          height: 8.5rem;
        }
      }
      .card-right-form {
        width: 90%;
      }
      @include phone-width {
        @apply p-3;
        .close-btn-container {
          margin-top: 1rem;
          img {
            height: 4.375rem;
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
}
</style>
