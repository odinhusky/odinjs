<script setup lang="ts">
import BaseFloatingAction from "@shared-src/lib/components/BaseFloatingAction.vue"
import { useCmsFloatingIcon } from "@shared-lib/composables/useCmsFloatingIcon"

const { mainIconUrl, visibleList, hasContent, isExpanded, toggleExpand, collapse, handleItemClick } =
  useCmsFloatingIcon()
</script>

<template>
  <ClientOnly>
    <div v-if="hasContent" class="cms-floating-icon">
      <BaseFloatingAction
        storage-key="r017.cmsFloatingIcon.position"
        aria-label="Floating menu"
        :size="64"
        :initial-right="24"
        :initial-bottom="216"
        :mobile-bottom-offset="180"
        @click="toggleExpand"
      >
        <img
          v-if="mainIconUrl"
          :src="mainIconUrl"
          alt="floating"
          class="h-full w-full object-contain"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-if="!mainIconUrl" class="cms-floating-icon__fallback">
          <span>≡</span>
        </div>

        <template #overlay="{ isLeftSide, isTopHalf }">
          <Transition name="cms-floating-icon-list">
            <ul
              v-if="isExpanded && visibleList.length"
              class="cms-floating-icon__list"
              :class="[
                isLeftSide ? 'left-0' : 'right-0',
                isTopHalf ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'
              ]"
              @pointerdown.stop
            >
              <li
                v-for="item in visibleList"
                :key="item.id"
                class="cms-floating-icon__list-item"
                :class="{ 'cms-floating-icon__list-item--disabled': !item.hasEntrance }"
                @click="item.hasEntrance ? handleItemClick(item) : undefined"
              >
                <img
                  v-if="item.iconUrl"
                  :src="item.iconUrl"
                  :alt="item.label || 'icon'"
                  class="cms-floating-icon__list-icon"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
                <span v-if="item.label" class="cms-floating-icon__list-label">{{ item.label }}</span>
              </li>
            </ul>
          </Transition>
        </template>
      </BaseFloatingAction>

      <div v-if="isExpanded" class="cms-floating-icon__backdrop" @click="collapse"></div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.cms-floating-icon__fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: var(--brand-brand-primary, #6366f1);
  color: #fff;
  font-size: 1.5rem;
}

.cms-floating-icon__list {
  position: absolute;
  z-index: 1;
  pointer-events: auto;
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--p-content-background, rgba(20, 20, 30, 0.95));
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 140px;
  max-width: 220px;
}

.cms-floating-icon__list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cms-floating-icon__list-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.cms-floating-icon__list-item--disabled {
  cursor: default;
  opacity: 0.6;
}

.cms-floating-icon__list-item--disabled:hover {
  background-color: transparent;
}

.cms-floating-icon__list-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.cms-floating-icon__list-label {
  font-size: 0.875rem;
  word-break: break-word;
}

.cms-floating-icon__backdrop {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: transparent;
}

.cms-floating-icon-list-enter-active,
.cms-floating-icon-list-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.cms-floating-icon-list-enter-from,
.cms-floating-icon-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
