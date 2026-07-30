<template>
  <q-dialog
    ref="dialogRef"
    class="confirm-dialog"
    :class="dialogClass"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin !rounded-2xl min-w-0 !w-[calc(100vw-20px)] !max-w-[calc(100vw-20px)] sm:!min-w-[600px] sm:!max-w-none sm:!w-auto"
    >
      <q-card-section class="flex justify-between items-center flex-nowrap p-5 pb-2.5">
        <div class="confirm-dialog-title text-2xl font-bold">
          {{ title }}
        </div>
        <Icon
          icon="mdi:close"
          width="20"
          height="20"
          class="confirm-dialog-close shrink-0 cursor-pointer outline-none"
          role="button"
          tabindex="0"
          :aria-label="$q.lang.label.close"
          @click="onDialogCancel"
          @keydown.enter.prevent="onDialogCancel"
          @keydown.space.prevent="onDialogCancel"
        />
      </q-card-section>
      <q-card-section v-if="message" class="q-dialog__message p-5 !pt-2.5">
        {{ message }}
      </q-card-section>
      <q-card-actions align="right" class="gap-2 py-3 !px-6">
        <q-btn v-bind="cancelBtnProps" :class="cancelBtnClass" @click="onDialogCancel" />
        <q-btn v-bind="okBtnProps" :class="okBtnClass" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import type { QBtnProps } from "quasar"
import { useDialogPluginComponent, useQuasar } from "quasar"
import { computed } from "vue"

defineOptions({
  name: "ConfirmDialog",
})

const props = withDefaults(
  defineProps<{
    title: string
    message: string
    persistent?: boolean
    /** 遮罩背景色（任意合法 CSS 顏色），預設為 design token `--secondary-08` */
    backdropScrim?: string
    dialogClass?: string
    okBtn: QBtnProps
    cancelBtn: QBtnProps
  }>(),
  {
    persistent: true,
  }
)

defineEmits([...useDialogPluginComponent.emits])

const backdropScrimCss = computed(() => props.backdropScrim ?? "var(--secondary-08)")

const isMemberMessengerConfirm = computed(() => props.dialogClass === "member-messenger-confirm-dialog")

const cancelBtnClass = computed(() =>
  isMemberMessengerConfirm.value
    ? "messenger-compose-btn-cancel !rounded-lg !border-2 !border-solid !px-6 text-base font-semibold"
    : "!text-base !font-semibold"
)

const okBtnClass = computed(() =>
  isMemberMessengerConfirm.value
    ? "messenger-compose-btn-submit !rounded-lg !px-6 text-base font-normal"
    : "!bg-[var(--primary-04)] !text-white !text-base !font-semibold"
)

const cancelBtnProps = computed<QBtnProps>(() => {
  const { flat: _flat, outline: _outline, color: _color, ...rest } = props.cancelBtn as QBtnProps &
    Record<string, unknown>
  if (isMemberMessengerConfirm.value) {
    return {
      ...rest,
      flat: true,
      noCaps: true,
    }
  }
  return {
    ...rest,
    outline: true,
    color: "primary",
  }
})

const okBtnProps = computed<QBtnProps>(() => {
  const { outline: _outline, flat: _flat, color: _color, ...rest } = props.okBtn as QBtnProps & Record<string, unknown>
  return {
    ...rest,
    unelevated: true,
    ...(isMemberMessengerConfirm.value ? { noCaps: true } : {}),
  }
})

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<style scoped>
.confirm-dialog-title {
  color: var(--primary-04);
}

.confirm-dialog-close {
  color: var(--neutral-08);
}

.confirm-dialog :deep(.q-dialog__backdrop) {
  background-color: v-bind(backdropScrimCss);
}
</style>
