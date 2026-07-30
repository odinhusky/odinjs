<template>
  <div
    v-if="isDown.pc"
    :class="
      cx('w-full', route.name === 'ProductLobby' ? 'mb-[8px]' : 'my-[12px]', 'mx-auto', {
        'mobile-nav-container': isNeedPaddingX
      })
    "
  >
    <q-tabs
      v-model="activeIndex"
      class="nav-tabs"
      :mobile-arrows="false"
      :outside-arrows="false"
      align="left"
      :shrink="false"
      no-caps
      indicator-color="transparent"
    >
      <q-tab
        v-for="(cmsItem, cmsIndex) in navigationBarList"
        :key="cmsIndex"
        :name="cmsIndex"
        class="nav-tab-item"
        @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })"
      >
        <div class="tab-content">
          <img
            v-if="cmsItem.Setting.icon_path"
            class="btn-icon"
            :src="
              isActive(cmsItem.Entrance[0], cmsIndex, (cmsItem.Setting?.lang?.[nowLang as LANGUAGE_TYPE.Enums] ?? '') as string) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path
            "
          />

          <div
            v-else
            class="btn-icon"
            :class="{'customActiveClass': isActive(cmsItem.Entrance[0], cmsIndex, (cmsItem.Setting?.lang?.[nowLang as LANGUAGE_TYPE.Enums] ?? '') as string)}"
          ></div>

          <div class="btn-title">
            <span class="btn-title-text">{{ (cmsItem.Setting?.lang?.[nowLang as LANGUAGE_TYPE.Enums] ?? '') as string }}</span>
          </div>
        </div>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script lang="ts" setup>
import { isCmsEntranceActive, useEntranceHandler } from "app/template/okbet/composables/useCms"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import {
  // CMS_TYPE,
  LANGUAGE_TYPE
} from "src/common/utils/constants"
import { cx } from "src/common/utils/cx"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import {
  ref
  // nextTick,
  // watch
} from "vue"
import { useRoute } from "vue-router"

const { isDown } = useMediaQuery()
// const isMobile = toRef(isDown, "padXl")

const eventbus = injectStrict(EventBusKey)

const { handleEntranceClick } = useEntranceHandler()
const { nowLang } = useLanguage()
const { navigationBarList } = useCms()
const route = useRoute()

const activeIndex = ref(0)

const prop = defineProps({
  modelValue: {},
  isNeedPaddingX: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["update:modelValue"])

const isActive = (entrance: any, index: number, text: string) => {
  const active = isCmsEntranceActive(entrance, route)

  if (active) {
    activeIndex.value = index
  }

  return active
}

// onMounted(async () => {
// await nextTick()
// })
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";

:deep(.nav-tabs) {
  .q-tabs__content {
    gap: 4px;
    overflow-x: auto;
    overflow-y: hidden !important;
  }

  .q-tab {
    border-radius: 8px;
    flex-shrink: 0;
    min-width: auto;
    padding: 0;
    width: 86.75px;
    height: 84px;

    border: 1px solid $border-pale-gray-color;
    min-width: auto;
    padding: 0;

    &.q-tab--active {
      background-color: $primary-color;

      .btn-title {
        color: $text-light-color;
      }
    }
  }
}

.tab-content {
  // @apply w-full gap-1 flex-col;
  @include setFlex;
  flex-direction: column;
}

.btn-title {
  // @apply w-full overflow-hidden;
  // @apply px-1;
  // @apply text-sm iphone:text-xs;
  // @apply capitalize text-ellipsis whitespace-nowrap text-center not-italic font-normal;

  color: $text-night-sky-color;
  font-family: Helvetica;
}

:deep(.nav-tabs .q-tab__content) {
  padding: 0 !important;
}

/* iphone tab size */
@media (max-width: $iphone-media) {
  :deep(.nav-tabs .q-tab) {
    width: 86.75px;
    height: 84px;
  }
}

/* fixed internal layout: 12(top) + icon + 8(gap) + title(2 lines) + 8(bottom) */
.tab-content {
  width: 100%;
  height: 100%;
  padding-top: 12px;
  padding-bottom: 8px;
  display: grid !important;
  justify-items: center;
  align-content: start;
  row-gap: 8px;
}

.tab-content .btn-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  display: block;
  object-fit: contain;
}

@media (max-width: $iphone-media) {
  .tab-content .btn-icon {
    width: 24px;
    height: 24px;
  }
}

.btn-title {
  width: 100%;
  height: 32px;
  line-height: 16px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  text-transform: capitalize;
  font-size: 0.75rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
}

@media (max-width: $iphone-media) {
  .btn-title {
    font-size: 0.75rem; // text-xs
  }
}

.btn-title-text {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.mobile-nav-container {
  width: 100%;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  padding-left: 0;
  padding-right: 0;

  // 1000px–1439px: container width 923px
  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  // < 992px: don't limit width; padding 20px
  @media (max-width: 991px) {
    max-width: none;
    padding-left: 20px;
    padding-right: 20px;
  }

  // < 768px: don't limit width; padding 8px
  @media (max-width: 767px) {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
