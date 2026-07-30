<template>
  <div class="category-tabs">
    <ul class="category-tabs-list">
      <li
        v-for="item in tabs"
        :key="item.value"
        class="category-tabs-item"
        :class="{ active: gameSearchType === item.value }"
        @click="handleTabClick(item.value)"
      >
        {{ t(item.i18nLabel) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { GAME_TAG_TYPE } from "src/common/utils/constants"

const { t } = useI18n()

const gameSearchType = defineModel<number>({ required: true })

const tabs = [
  { i18nLabel: "common.btn.all", value: GAME_TAG_TYPE.Enums.All },
  { i18nLabel: "common.btn.new", value: GAME_TAG_TYPE.Enums.New },
  { i18nLabel: "common.btn.hot", value: GAME_TAG_TYPE.Enums.Hot }
]

const handleTabClick = (value: number) => {
  gameSearchType.value = value
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_amuse/assets/css/_variable.sass";

.category-tabs {
  .category-tabs-list {
    margin-bottom: 2.25rem;
    display: flex;
    flex-direction: row;
    gap: 10px;

    @include iphone-width {
      margin-bottom: 1.125rem;
    }
    .category-tabs-item {
      min-width: 72px;
      width: auto;
      height: 44px;
      border-radius: 10px;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      line-height: 1.3125rem;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;

      @include iphone-width {
        min-width: 60px;
        width: auto;
        height: 36px;
      }

      &:hover {
        opacity: 0.8;
      }
    }
    .active {
      border: 1px solid #ed7721;
      color: #ed7721;
    }
  }
}
</style>
