<script setup lang="ts">
import BaseFloatingAction from "@shared-src/lib/components/BaseFloatingAction.vue"
import { useCmsContactUs } from "@shared-lib/composables/useCmsContactUs"

const { contactList, isLoading, isError, handleItemClick } = useCmsContactUs()

const hasContent = computed(() => !isLoading.value && !isError.value && contactList.value.length > 0)

const isExpanded = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const FLOATING_BUTTON_SIZE = 64
const PANEL_GAP = 8
const PANEL_VIEWPORT_MARGIN = 8
const PANEL_BELOW_THRESHOLD = 80
const PANEL_DESIGN_MAX_HEIGHT = 540

const computePanelBelow = (buttonY: number) => buttonY < PANEL_BELOW_THRESHOLD

const computePanelMaxHeight = (buttonY: number, below: boolean) => {
  const vh = typeof window === "undefined" ? 0 : window.innerHeight
  if (!vh) return PANEL_DESIGN_MAX_HEIGHT
  const available = below
    ? vh - (buttonY + FLOATING_BUTTON_SIZE + PANEL_GAP + PANEL_VIEWPORT_MARGIN)
    : buttonY - PANEL_GAP - PANEL_VIEWPORT_MARGIN
  return Math.max(Math.min(available, PANEL_DESIGN_MAX_HEIGHT), 120)
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const collapse = () => {
  isExpanded.value = false
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!isExpanded.value) return
  const target = event.target as Node | null
  if (!target) return
  if (panelRef.value && panelRef.value.contains(target)) return
  if (rootRef.value && rootRef.value.contains(target)) return
  collapse()
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isExpanded.value) collapse()
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true)
  document.addEventListener("keydown", onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true)
  document.removeEventListener("keydown", onDocumentKeydown)
})
</script>

<template>
  <ClientOnly>
    <div v-if="hasContent" ref="rootRef" class="cms-contact-us-floating">
      <BaseFloatingAction
        storage-key="r017.cmsContactUs.position"
        aria-label="Service"
        :size="FLOATING_BUTTON_SIZE"
        :initial-right="24"
        :initial-bottom="312"
        :mobile-bottom-offset="276"
        :disable-hover-scale="true"
        :class-obj="{
          button: isExpanded
            ? 'cms-contact-us-floating__button cms-contact-us-floating__button--open'
            : 'cms-contact-us-floating__button'
        }"
        @click="toggleExpand"
      >
        <svg
          class="cms-contact-us-floating__icon"
          viewBox="0 0 16.6667 15.8333"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2.5 5.83333C2.5 4.28624 3.11458 2.80251 4.20854 1.70854C5.30251 0.614581 6.78624 0 8.33333 0C9.88043 0 11.3642 0.614581 12.4581 1.70854C13.5521 2.80251 14.1667 4.28624 14.1667 5.83333V6.69583C15.58 6.89833 16.6667 8.11417 16.6667 9.58333V9.79167C16.6667 11.2708 15.3908 12.5675 13.89 12.4983C13.2733 14.265 11.705 15.4558 10.0125 15.7575C9.62083 15.9008 9.1575 15.8333 8.75 15.8333C8.41848 15.8333 8.10054 15.7016 7.86612 15.4672C7.6317 15.2328 7.5 14.9149 7.5 14.5833C7.5 14.2518 7.6317 13.9339 7.86612 13.6995C8.10054 13.465 8.41848 13.3333 8.75 13.3333C9.41083 13.3333 10.1425 13.2375 10.5892 13.8408C11.6692 13.3267 12.5 12.2408 12.5 10.8333V5.83333C12.5 4.72826 12.061 3.66846 11.2796 2.88706C10.4982 2.10565 9.4384 1.66667 8.33333 1.66667C7.22826 1.66667 6.16846 2.10565 5.38705 2.88706C4.60565 3.66846 4.16667 4.72826 4.16667 5.83333V11.0417C4.16667 11.4284 4.01302 11.7994 3.73953 12.0729C3.46604 12.3464 3.09511 12.5 2.70833 12.5C1.99004 12.5 1.30116 12.2147 0.793252 11.7067C0.285341 11.1988 0 10.51 0 9.79167V9.58333C0 8.88185 0.252466 8.20379 0.711629 7.67346C1.17079 7.14313 1.80571 6.79605 2.5 6.69583V5.83333Z"
            fill="currentColor"
          />
        </svg>

        <template #overlay="{ isLeftSide, position }">
          <Transition name="cms-contact-us-floating-panel">
            <div
              v-if="isExpanded"
              ref="panelRef"
              class="cms-contact-us-floating__panel"
              :class="[
                isLeftSide ? 'cms-contact-us-floating__panel--left' : 'cms-contact-us-floating__panel--right',
                computePanelBelow(position.y)
                  ? 'cms-contact-us-floating__panel--below'
                  : 'cms-contact-us-floating__panel--above'
              ]"
              :style="{ maxHeight: `${computePanelMaxHeight(position.y, computePanelBelow(position.y))}px` }"
              role="dialog"
              aria-labelledby="cms-contact-us-floating-title"
              @pointerdown.stop
              @click.stop
            >
              <div class="cms-contact-us-floating__header">
                <p id="cms-contact-us-floating-title" class="cms-contact-us-floating__header-text">Service</p>
                <button
                  type="button"
                  class="cms-contact-us-floating__close"
                  aria-label="Close Service"
                  @click="collapse"
                >
                  <svg
                    class="cms-contact-us-floating__close-icon"
                    viewBox="0 0 9.6 9.6"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M4.8 5.82205L1.22281 9.39924C1.08897 9.53308 0.918631 9.6 0.711787 9.6C0.504943 9.6 0.3346 9.53308 0.20076 9.39924C0.0669199 9.2654 0 9.09506 0 8.88821C0 8.68137 0.0669199 8.51103 0.20076 8.37719L3.77795 4.8L0.20076 1.22281C0.0669199 1.08897 0 0.918631 0 0.711787C0 0.504943 0.0669199 0.3346 0.20076 0.20076C0.3346 0.0669199 0.504943 0 0.711787 0C0.918631 0 1.08897 0.0669199 1.22281 0.20076L4.8 3.77795L8.37719 0.20076C8.51103 0.0669199 8.68137 0 8.88821 0C9.09506 0 9.2654 0.0669199 9.39924 0.20076C9.53308 0.3346 9.6 0.504943 9.6 0.711787C9.6 0.918631 9.53308 1.08897 9.39924 1.22281L5.82205 4.8L9.39924 8.37719C9.53308 8.51103 9.6 8.68137 9.6 8.88821C9.6 9.09506 9.53308 9.2654 9.39924 9.39924C9.2654 9.53308 9.09506 9.6 8.88821 9.6C8.68137 9.6 8.51103 9.53308 8.37719 9.39924L4.8 5.82205Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <div class="cms-contact-us-floating__list">
                <div
                  v-for="item in contactList"
                  :key="item.id"
                  class="cms-contact-us-floating__card"
                  :class="{ 'cms-contact-us-floating__card--disabled': !item.hasEntrance }"
                  @click="item.hasEntrance ? handleItemClick(item) : undefined"
                >
                  <div v-if="item.title" class="cms-contact-us-floating__card-title">{{ item.title }}</div>

                  <div v-if="item.contactImageUrl" class="cms-contact-us-floating__card-image-wrap">
                    <img
                      :src="item.contactImageUrl"
                      :alt="item.title || 'contact'"
                      class="cms-contact-us-floating__card-image"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />
                  </div>

                  <div v-if="item.contactText" class="cms-contact-us-floating__card-account">{{ item.contactText }}</div>
                </div>
              </div>
            </div>
          </Transition>
        </template>
      </BaseFloatingAction>
    </div>
  </ClientOnly>
</template>

<style scoped>
:deep(.cms-contact-us-floating__button) {
  background-color: var(--icon-icon-secondary-enabled, #1d125d);
  background-image: none;
  filter: drop-shadow(0 0 4px var(--icon-icon-accent, #ea580c));
  padding: 8px;
}

@media (hover: hover) {
  :deep(.cms-contact-us-floating__button):hover {
    background-color: var(--icon-icon-secondary-hover, #0f073d);
  }
}

:deep(.cms-contact-us-floating__button--open) {
  background-color: transparent;
  background-image: linear-gradient(
    to right,
    var(--navbar-navbar-icon-right-active, #dc2626),
    var(--navbar-navbar-icon-left-active, #f97316)
  );
}

@media (hover: hover) {
  :deep(.cms-contact-us-floating__button--open):hover {
    background-color: transparent;
  }
}

.cms-contact-us-floating__icon {
  width: 100%;
  height: 100%;
  color: var(--icon-icon-accent, #ea580c);
  pointer-events: none;
  user-select: none;
}

.cms-contact-us-floating__button--open .cms-contact-us-floating__icon {
  color: var(--icon-icon-secondary-enabled, #1d125d);
}

.cms-contact-us-floating__panel {
  position: absolute;
  z-index: 1;
  pointer-events: auto;
  width: 196px;
  max-width: calc(100vw - 16px);
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--surface-surface-contrainer, #000025);
  border: 1px solid rgba(255, 152, 0, 0.4);
  border-radius: 12px;
  box-sizing: border-box;
}

.cms-contact-us-floating__panel--left {
  left: 0;
}

.cms-contact-us-floating__panel--right {
  right: 0;
}

.cms-contact-us-floating__panel--below {
  top: calc(100% + 8px);
}

.cms-contact-us-floating__panel--above {
  bottom: calc(100% + 8px);
}

.cms-contact-us-floating__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.cms-contact-us-floating__header-text {
  margin: 0;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  white-space: nowrap;
}

.cms-contact-us-floating__close {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  padding: 4px;
  border-radius: 9999px;
  border: 0;
  background-color: var(--icon-icon-bg-enabled, rgba(255, 255, 255, 0.09));
  cursor: pointer;
}

.cms-contact-us-floating__close-icon {
  width: 9.6px;
  height: 9.6px;
  color: #ef4444;
}

.cms-contact-us-floating__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.cms-contact-us-floating__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: var(--card-card-bg-primary-enabled, #1d125d);
  cursor: pointer;
  box-sizing: border-box;
}

.cms-contact-us-floating__card--disabled {
  cursor: default;
}

.cms-contact-us-floating__card-title {
  width: 100%;
  height: 28px;
  display: grid;
  place-items: center;
  padding: 4px 16px;
  border-radius: 8px;
  background-color: var(--surface-surface-contrainer, #000025);
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  box-sizing: border-box;
}

.cms-contact-us-floating__card-image-wrap {
  width: 140px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
}

.cms-contact-us-floating__card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cms-contact-us-floating__card-account {
  width: 100%;
  height: 28px;
  display: grid;
  place-items: center;
  padding: 4px 16px;
  border-radius: 8px;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  box-sizing: border-box;
}

.cms-contact-us-floating-panel-enter-active,
.cms-contact-us-floating-panel-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.cms-contact-us-floating-panel-enter-from,
.cms-contact-us-floating-panel-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .cms-contact-us-floating-panel-enter-active,
  .cms-contact-us-floating-panel-leave-active {
    transition: none;
  }

  .cms-contact-us-floating-panel-enter-from,
  .cms-contact-us-floating-panel-leave-to {
    transform: none;
  }
}
</style>
