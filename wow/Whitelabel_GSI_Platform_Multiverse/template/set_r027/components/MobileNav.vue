<template>
  <div v-if="isDown.pc" :class="wrapperClass">
    <q-tabs
      v-model="activeIndex"
      class="nav-tabs"
      :mobile-arrows="true"
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
              isActive(cmsItem.Entrance[0], cmsIndex)
                ? cmsItem.Setting.selected_icon_path || cmsItem.Setting.icon_path
                : cmsItem.Setting.icon_path
            "
            :alt="cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string"
          />

          <div
            v-else
            class="btn-icon btn-icon-fallback"
            :class="{ active: isActive(cmsItem.Entrance[0], cmsIndex) }"
          ></div>

          <div class="btn-title">
            <span class="btn-title-text">{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string }}</span>
          </div>
        </div>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script lang="ts" setup>
import { isSetR027CmsEntranceActive, useEntranceHandler } from "app/template/set_r027/composables/useCms"
import { MENU } from "app/template/set_r027/utils/constants"
import { createDidRouteResolver, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { cx } from "src/common/utils/cx"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
  isNeedPaddingX: {
    type: Boolean,
    default: true,
  },
})

const { isDown } = useMediaQuery()
const { nowLang } = useLanguage()
const { handleEntranceClick } = useEntranceHandler()
const {
  navigationBarList,
} = useCms()
const route = useRoute()

const activeIndex = ref(0)

const wrapperClass = computed(() =>
  cx("w-full", "mx-auto", route.name === "ProductLobby" ? "mb-[8px]" : "my-[12px]", {
    "mobile-nav-container": props.isNeedPaddingX,
  })
)

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any, index: number) => {
  const active = isSetR027CmsEntranceActive(entrance, route, resolveCmsRouteByDid)

  if (active) {
    activeIndex.value = index
  }

  return active
}

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

:deep(.nav-tabs) {
  .q-tabs__arrow {
    color: var(--icon-02);
    text-shadow: none;
  }

  .q-tabs__content {
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden !important;
    scrollbar-width: none;
  }

  .q-tabs__content::-webkit-scrollbar {
    display: none;
  }

  .q-tab {
    width: 86.75px;
    height: 84px;
    min-width: auto;
    flex-shrink: 0;
    padding: 0;
    border-radius: 12px;
    background: var(--btn-bg-05);

    &.q-tab--active {
      background: var(--btn-bg-01);

      .btn-title {
        color: var(--btn-text-01);
      }

      .btn-icon-fallback {
        background: var(--icon-navber-01);
        box-shadow: 0 0 0 6px var(--icon-navber-04);
      }
    }
  }

  .q-tab__content {
    padding: 0 !important;
  }
}

:deep(.nav-tabs.q-tabs--horizontal .q-tabs__arrow--right) {
  top: 0;
  right: -10px;
  bottom: 0;
}

.tab-content {
  width: 100%;
  height: 100%;
  padding-top: 9px;
  padding-bottom: 8px;
  display: grid !important;
  justify-items: center;
  align-content: center;
  row-gap: 6px;
}

.btn-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  display: block;
  object-fit: contain;
}

.btn-icon-fallback {
  margin: 3px;
  border-radius: 999px;
  background: var(--icon-navber-02);
  box-shadow: 0 0 0 6px transparent;
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &.active {
    background: var(--icon-navber-01);
    box-shadow: 0 0 0 6px var(--icon-navber-04);
  }
}

.btn-title {
  width: 100%;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-text-01);
  text-align: center;
  font-size: 12px !important;
  line-height: 14px;
  text-transform: capitalize;
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
  max-width: 1200px;
  padding-left: 0;
  padding-right: 0;

  @media (max-width: 1439px) and (min-width: 1000px) {
    max-width: 923px;
  }

  @media (max-width: 991px) and (min-width: 769px) {
    max-width: 889px;
    padding-left: 0;
    padding-right: 0;
  }

  @media (max-width: 768px) {
    max-width: none;
    padding-left: 8px;
    padding-right: 8px;
  }
}

@media (max-width: $iphone-media) {
  :deep(.nav-tabs .q-tab) {
    width: 64px;
    height: 68px;
  }

  .btn-title {
    font-size: 12px !important;
    color: var(--btn-text-01);
  }
}
</style>
