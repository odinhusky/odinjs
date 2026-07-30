<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useCmsPopup } from "@shared-lib/composables/useCmsPopup"

interface Props {
  logoSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  logoSrc: "/images/header_logo.png"
})

const { shouldShowPopup, popupData, markShown } = useCmsPopup()

const allAgreed = ref(false)

const hasAgreementGate = computed(() => Boolean(popupData.value?.agreeAllText))

const canConfirm = computed(() => !hasAgreementGate.value || allAgreed.value)

const onConfirm = () => {
  if (!canConfirm.value) return
  markShown()
  allAgreed.value = false
}

const onClose = () => {
  markShown()
  allAgreed.value = false
}

watch(shouldShowPopup, (visible) => {
  if (!visible) allAgreed.value = false
})
</script>

<template>
  <BaseDialog
    v-if="popupData"
    :visible="shouldShowPopup"
    :class-obj="{
      root: cx(
        'max-w-[450px] rounded-2xl',
        'phone:!w-[calc(100%-2rem)] phone:!max-w-[420px] phone:!h-auto phone:!max-h-[90vh] phone:!m-4 phone:!rounded-2xl'
      ),
      header: cx('py-4 bg-[var(--dialog-dialog-bg-header)]'),
      body: cx('p-5 gap-4')
    }"
    @close="onClose"
  >
    <template #header>
      <BaseImage
        :src="props.logoSrc"
        alt="logo"
        :class-obj="{
          container: cx('h-[34px] mx-auto', FLEX_ITEMS_CENTER, 'justify-center'),
          image: 'h-full w-auto object-contain'
        }"
      />
    </template>

    <h3
      v-if="popupData.title"
      class="text-center text-base leading-6 text-[var(--text-text-primary)]"
      v-html="popupData.title"
    />

    <div
      v-if="popupData.agreementList.length"
      :class="
        cx(
          'border border-[var(--border-border-secondary)] rounded-md p-3 max-h-[300px] overflow-y-auto',
          SCROLLBAR_HIDDEN
        )
      "
    >
      <ul :class="cx(FLEX_COL, 'gap-2')">
        <li
          v-for="item in popupData.agreementList"
          :key="item.value"
          class="flex items-start gap-2 text-sm leading-5 text-[var(--text-text-primary)]"
        >
          <span class="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--brand-brand-primary)]" />
          <span class="flex-1" v-html="item.label" />
        </li>
      </ul>
    </div>

    <label
      v-if="popupData.agreeAllText"
      :class="cx(FLEX_ITEMS_CENTER, 'gap-2 cursor-pointer')"
    >
      <BaseCheckBox
        v-model="allAgreed"
        :class-obj="{ box: '!rounded-full' }"
      />
      <span
        class="text-sm font-semibold leading-5 text-[var(--text-text-primary)]"
        v-html="popupData.agreeAllText"
      />
    </label>

    <template #footer>
      <div :class="cx(FLEX_COL, 'gap-3')">
        <BaseBtn
          class="w-full"
          size="xl"
          :disabled="!canConfirm"
          @click="onConfirm"
        >
          {{ popupData.confirmLabel }}
        </BaseBtn>
        <BaseBtn
          class="w-full"
          size="xl"
          theme="primary"
          category="outline"
          @click="onClose"
        >
          {{ popupData.rejectLabel }}
        </BaseBtn>

        <template v-if="popupData.imgs.length">
          <div class="h-px bg-[var(--border-border-secondary)] my-1" />
          <div :class="cx(FLEX_ITEMS_CENTER, 'justify-center gap-4 flex-wrap')">
            <BaseImage
              v-for="src in popupData.imgs"
              :key="src"
              :src="src"
              :alt="src"
              :class-obj="{
                container: 'h-[38px]',
                image: 'h-full w-auto object-contain'
              }"
            />
          </div>
        </template>
      </div>
    </template>
  </BaseDialog>
</template>
