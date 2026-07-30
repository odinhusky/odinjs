<template>
  <div class="page-component-item">
    <div class="page-component-item-label">
      {{ $t(CMS_PAGE_COMPONENT_TYPE.I18nKeys[props.id]) }}
    </div>
    <div class="page-component-item-content">
      <!-- 輪播圖、圖片 -->
      <template
        v-if="props.id === CMS_PAGE_COMPONENT_TYPE.Enums.SLIDER || props.id === CMS_PAGE_COMPONENT_TYPE.Enums.IMAGE"
      >
        <q-img
          :src="cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[props.id])"
          class="page-component-item-img"
        ></q-img>
      </template>
      <!-- 文字編輯器 -->
      <template v-else-if="props.id === CMS_PAGE_COMPONENT_TYPE.Enums.TEXT">
        <div class="page-component-item-text">{{ $t("cms.text_editor") }}</div>
      </template>
      <!-- 遊戲入口 -->
      <template v-else-if="props.id === CMS_PAGE_COMPONENT_TYPE.Enums.GAME_ENTRANCE">
        <div class="page-component-item-game-entrance">
          <q-img
            :src="cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[props.id])"
            class="page-component-item-game-entrance-img"
          ></q-img>
        </div>
      </template>
      <!-- 公告、排行榜、導航欄 -->
      <template
        v-else-if="
          props.id === CMS_PAGE_COMPONENT_TYPE.Enums.ANNOUNCEMENT ||
          props.id === CMS_PAGE_COMPONENT_TYPE.Enums.LEADERBOARD ||
          props.id === CMS_PAGE_COMPONENT_TYPE.Enums.NAVBAR
        "
      >
        <q-img
          :src="cmsCustomPage(CMS_PAGE_COMPONENT_TYPE.ImageName[props.id])"
          class="page-component-item-img"
        ></q-img>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useImage } from "src/hook/useImage"
  import { CMS_PAGE_COMPONENT_TYPE } from "src/utils/constants"

  const props = defineProps<{ id: CMS_PAGE_COMPONENT_TYPE.Enums }>()
  const { cmsCustomPage } = useImage()
</script>

<style scoped lang="scss">
  .page-component-item {
    @apply cursor-pointer flex flex-col gap-1.5;
    .page-component-item-label {
      font-family: NotoSansTC;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      line-height: 17px;
    }

    .page-component-item-content {
      .page-component-item-img {
        border-radius: 0.625rem;
        box-shadow: 0px 0px 16px 0px #0000001a;
      }
      .page-component-item-text {
        @apply flex items-center;
        width: 100%;
        height: 3.75rem;
        border-radius: 4px;
        border: 1px dashed #e5e5e5;
        padding: 0.625rem 1rem;
        background-color: #fff;
        box-shadow: 0px 4px 4px 0px #0000001a;
        color: #9e9e9e;
        font-family: NotoSansTC;
        font-weight: 500;
        font-style: Medium;
        font-size: 14px;
        line-height: 17px;
      }

      .page-component-item-game-entrance {
        .page-component-item-game-entrance-img {
          border-radius: 0.625rem;
        }
      }
    }
  }
</style>
