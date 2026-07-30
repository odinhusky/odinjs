<template>
  <div class="q-pa-md">
    <q-card class="p-5 pb-12 flex flex-col gap-5">
      <AiKolPostListSelect v-model="currentKol" :options="kols" :loading="isLoading" />

      <!-- 貼文內容 -->
      <div v-if="hasData" class="w-full h-auto">
        <AiKolPosts :posts="paginatedPosts" @click-post="openDetail" />

        <AiKolPostsPagination v-if="totalPages > 1" v-model="currentPage" :total-pages="totalPages" />

        <AiKolPostDetail
          v-if="currentDetailPost"
          v-model="showDetail"
          :post="currentDetailPost"
          :is-first="isDetailFirst"
          :is-last="isDetailLast"
          @prev="handlePrevDetail"
          @next="handleNextDetail"
        />
      </div>

      <!-- 沒資料的狀態 -->
      <div v-else class="w-full min-h-[47.5rem] flex flex-center column text-grey-6">
        <q-img :src="noDataImg('/ai_kol_post_no_data.webp')" width="220px" class="q-mb-md" />

        <div class="font-bold text-sm">{{ $t("common.no_data") }}</div>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import AiKolPostListSelect from "./components/AiKolPostListSelect.vue"
  import AiKolPosts from "./components/AiKolPosts.vue"
  import AiKolPostsPagination from "./components/AiKolPostsPagination.vue"
  import AiKolPostDetail from "./components/AiKolPostDetail.vue"

  import { useImage } from "@/hook/useImage"
  import { useAiKolPostListLogic } from "./composables/useAiKolPostListLogic"

  const { noDataImg } = useImage()

  // 一行代碼搞定所有邏輯
  // 解構出所有需要的變數與方法
  const {
    isLoading,
    kols,
    currentKol,
    paginatedPosts,
    currentPage,
    totalPages,
    hasData,
    // Detail 相關
    showDetail,
    currentDetailPost,
    isDetailFirst,
    isDetailLast,
    openDetail,
    handlePrevDetail,
    handleNextDetail
  } = useAiKolPostListLogic()
</script>

<style scoped lang="scss"></style>
