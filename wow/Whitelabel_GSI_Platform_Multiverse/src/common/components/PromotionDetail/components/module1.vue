<template>
  <div class="promotion-detail-area">
    <div class="title-area">
      <div
        class="title-area-content w-full h-full max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]"
      >
        <div>
          {{ $t("menu.promotion") }}
        </div>

        <img :src="promotionImg('promotion-banner.svg')" class="h-full" />
      </div>
    </div>

    <div class="back-area w-full max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw]">
      <div class="back-icon" @click="router.push({ name: 'promotion' })">
        <img :src="promotionImg('promotion-back.svg')" />
      </div>
      <div>
        {{ $t("menu.promotion") }}
      </div>
    </div>

    <div class="detail-area">
      <q-img :src="promotionDetail.image" class="main-pic" />
      <div class="title ellipsis">{{ promotionDetail.title }}</div>
      <div class="detail-content" v-html="promotionDetail.content"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, watch, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { usePromotion } from "src/common/composables/usePromotion"
import type * as Response from "src/api/response.type"
import { useSiteImg } from "src/common/hooks/useSiteImg"

const { promotionImg } = useSiteImg()
const { promotionList, handlePromotionList } = usePromotion()
const { locale } = useI18n({ useScope: "global" })
const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
// 依當前語系從已撈取的清單中取出對應詳情（promotionList 會隨語系響應式重算）
const promotionDetail = computed<Response.PromotionDetail>(() => {
  const promotion = promotionList.value.find((item) =>
    item.details.some((detail) => detail.promotion_id.toString() === route.params.id)
  )
  return (
    promotion?.details.find((detail) => detail.promotion_id.toString() === route.params.id) ?? {
      promotion_id: 0,
      lang: "",
      title: "",
      content: "",
      image: ""
    }
  )
})

// 語系切換時重新撈取優惠資料（確保 store 有當前語系的資料）
watch(locale, async () => {
  await handlePromotionList()
})

onMounted(async () => {
  window.addEventListener("resize", updateIsMobile)
  await handlePromotionList()
})

onUnmounted(() => {
  window.removeEventListener("resize", updateIsMobile)
})
</script>

<style lang="scss">
@import "src/common/css/_variable.sass";

.promotion-detail-area {
  width: 100%;
  padding-bottom: 3.25rem;

  .title-area {
    width: 100%;
    height: 7.1875rem;
    margin-bottom: 1.25rem;
    background: var(--bg-14);
    display: flex;
    justify-content: center;
    align-items: center;

    @include phone-width {
      height: 4.875rem;
      margin-bottom: 0.625rem;
      padding: 0 1rem;
    }

    .title-area-content {
      color: var(--text-03);
      font-size: 2.25rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;

      @include phone-width {
        width: 100%;
        font-size: 1.5rem;
      }
    }
  }

  table {
    width: 100% !important;
    th,
    td {
      border: 1px solid;
    }
  }

  .back-area {
    margin: 0 auto;
    color: var(--text-01);
    font-size: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.25rem;
    margin-bottom: 0.625rem;

    @include phone-width {
      padding: 0 1rem;
    }

    .back-icon {
      width: 1.25rem;
      height: 1.25rem;
      background: var(--icon-05);
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 0.625rem;
      }
    }
  }

  .detail-area {
    width: 100%;
    max-width: 40.625rem;
    margin: 0 auto;
    color: var(--text-01);

    @include phone-width {
      padding: 0 1rem;
    }

    .ellipsis {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title {
      width: 100%;
      overflow-wrap: break-word;
      font-weight: 700;
      font-size: 1.5rem;
      margin-top: 0.625rem;
    }

    .main-pic {
      width: 100%;
      border-radius: 0.25rem;
    }

    .detail-content {
      width: 100%;
      margin-top: 0.25rem;
      font-weight: 400;
      font-size: 1.125rem;
      color: var(--text-03);
      word-wrap: break-word;
      font-family: initial;
    }
  }
}
</style>
