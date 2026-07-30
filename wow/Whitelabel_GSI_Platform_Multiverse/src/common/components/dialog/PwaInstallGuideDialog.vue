<template>
  <q-dialog ref="dialogRef" class="pwa-install-guide-dialog" :persistent="persistent" @hide="onDialogHide">
    <q-card
      class="pwa-install-guide-dialog-card q-dialog-plugin !rounded-2xl min-w-0 !w-[calc(100vw-20px)] !max-w-[calc(100vw-20px)] sm:!w-[600px] sm:!max-w-[600px]"
    >
      <q-card-section class="pwa-install-guide-dialog-header flex justify-between items-center flex-nowrap gap-3 px-5 py-4">
        <div class="pwa-install-guide-dialog-title min-w-0 flex-1 leading-tight">
          {{ title }}
        </div>
        <q-btn
          class="pwa-install-guide-dialog-close shrink-0"
          icon="close"
          flat
          round
          dense
          :aria-label="$q.lang.label.close"
          @click="onDialogCancel"
        />
      </q-card-section>

      <q-card-section class="pwa-install-guide-dialog-content flex flex-col gap-4 !p-5">
        <div class="pwa-install-guide-steps">
            <div class="pwa-install-guide-steps-labels">
              <p
                v-for="(step, index) in steps"
                :key="`label-${index}`"
                class="pwa-install-guide-step-label"
              >
                {{ index + 1 }}. {{ step.label }}
              </p>
            </div>
            <div class="pwa-install-guide-steps-icons">
              <div
                v-for="(step, index) in steps"
                :key="`icon-${index}`"
                class="pwa-install-guide-step-icon-wrap"
              >
                <q-img
                  v-if="step.icon"
                  :src="step.icon"
                  class="pwa-install-guide-step-icon"
                  loading="lazy"
                  :alt="step.label"
                />
                <div v-else class="pwa-install-guide-step-icon-circle">
                  <Icon
                    :icon="step.iconify ?? 'mdi:image-outline'"
                    width="32"
                    height="32"
                    class="pwa-install-guide-step-iconify"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="tipTitle || tipDesc" class="pwa-install-guide-tip">
            <div class="flex items-start gap-1.5">
              <span v-if="tipTitle" class="pwa-install-guide-tip-icon shrink-0" aria-hidden="true" />
              <div class="flex min-w-0 flex-1 flex-col gap-2">
                <p v-if="tipTitle" class="pwa-install-guide-tip-title">{{ tipTitle }}</p>
                <p v-if="tipDesc" class="pwa-install-guide-tip-desc">{{ tipDesc }}</p>
              </div>
            </div>
          </div>
      </q-card-section>

      <q-card-actions align="right" class="pwa-install-guide-dialog-footer px-5 py-2">
        <q-btn
          class="pwa-install-guide-dialog-footer-btn !rounded-lg"
          unelevated
          no-caps
          :label="footerLabel"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useDialogPluginComponent, useQuasar } from "quasar"
import { computed } from "vue"
import { useI18n } from "vue-i18n"

export type PwaInstallGuideDialogStep = {
  label: string
  /** Iconify icon name */
  iconify?: string
  /** Image URL override */
  icon?: string
}

defineOptions({
  name: "PwaInstallGuideDialog",
})

const props = withDefaults(
  defineProps<{
    title: string
    steps?: PwaInstallGuideDialogStep[]
    tipTitle?: string
    tipDesc?: string
    footerLabel?: string
    persistent?: boolean
  }>(),
  {
    persistent: true,
    steps: () => [],
  }
)

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { t } = useI18n()
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const footerLabel = computed(() => props.footerLabel ?? t("pwa.install.dialog.footerBtn"))
</script>

<!-- 亮暗色變數內建於元件；body--dark 時切換深色（okbet 等無 dark 的 template 維持亮色） -->
<style lang="scss">
.pwa-install-guide-dialog {
  --pigd-card-bg: #ffffff;
  --pigd-header-footer-bg: #f1f5f9;
  --pigd-content-bg: #ffffff;
  --pigd-title-color: #64748b;
  --pigd-close-color: #64748b;
  --pigd-step-label-color: #64748b;
  --pigd-icon-circle-bg: #f1f5f9;
  --pigd-icon-color: #64748b;
  --pigd-tip-bg: #e2e8f0;
  --pigd-tip-title-color: #000000e0;
  --pigd-tip-desc-color: #1e293b;
  --pigd-footer-btn-bg: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  --pigd-footer-btn-color: #f1f5f9;
}

.body--dark .pwa-install-guide-dialog {
  --pigd-card-bg: #0d2533;
  --pigd-header-footer-bg: #164e63;
  --pigd-content-bg: #083344;
  --pigd-title-color: #e2e8f0;
  --pigd-close-color: #e2e8f0;
  --pigd-step-label-color: #e2e8f0;
  --pigd-icon-circle-bg: #ffffff17;
  --pigd-icon-color: #e2e8f0;
  --pigd-tip-bg: #ffffff33;
  --pigd-tip-title-color: #e2e8f0;
  --pigd-tip-desc-color: #f8fafc;
  --pigd-footer-btn-bg: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
  --pigd-footer-btn-color: #ffffff;
}
</style>

<style scoped>
.pwa-install-guide-dialog-card {
  background: var(--pigd-card-bg) !important;
}

.pwa-install-guide-dialog-title {
  color: var(--pigd-title-color);
  font-size: 24px;
  font-weight: 600;
}

.pwa-install-guide-dialog-header {
  background: var(--pigd-header-footer-bg);
}

.pwa-install-guide-dialog-content {
  background: var(--pigd-content-bg);
}

.pwa-install-guide-dialog-close {
  color: var(--pigd-close-color);

  :deep(.q-icon) {
    font-size: 20px;
  }
}

.pwa-install-guide-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pwa-install-guide-steps-labels,
.pwa-install-guide-steps-icons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 0.5rem;
}

.pwa-install-guide-steps-icons {
  justify-items: center;
}

.pwa-install-guide-step-label {
  margin: 0;
  color: var(--pigd-step-label-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25rem;
  text-align: center;
}

.pwa-install-guide-step-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
}

.pwa-install-guide-step-icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.pwa-install-guide-step-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--pigd-icon-circle-bg);
}

.pwa-install-guide-step-iconify {
  color: var(--pigd-icon-color);
}

.pwa-install-guide-tip {
  padding: 12px;
  border-radius: 8px;
  background: var(--pigd-tip-bg);
}

.pwa-install-guide-tip-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, #ffdc83 0%, #f2ae00 100%);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm6-10h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm6-10h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12z'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.pwa-install-guide-tip-title {
  margin: 0;
  color: var(--pigd-tip-title-color);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25rem;
}

.pwa-install-guide-tip-desc {
  margin: 0;
  color: var(--pigd-tip-desc-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25rem;
}

.pwa-install-guide-dialog-footer {
  display: flex;
  justify-content: flex-end;
  background: var(--pigd-header-footer-bg);
}

.pwa-install-guide-dialog-footer-btn {
  background: var(--pigd-footer-btn-bg) !important;
  color: var(--pigd-footer-btn-color) !important;
  font-size: 16px;
  font-weight: 700;
  padding: 16px;
  min-height: unset;
}
</style>
