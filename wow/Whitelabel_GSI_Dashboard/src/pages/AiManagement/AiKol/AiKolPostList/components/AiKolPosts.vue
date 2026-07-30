<template>
  <div class="posts-wrapper">
    <div class="flex-container">
      <div v-for="(post, index) in posts" :key="post.id" class="post-item rounded-[0.625rem]">
        <div class="w-full h-full flex justify-center items-center relative bg-[#f5f5f5] overflow-hidden">
          <div class="w-full h-full flex justify-center items-center flex-col relative gap-5">
            <q-img
              :src="getShowImg(post)"
              fit="contain"
              class="cursor-pointer post-img rounded-[0.625rem]"
              :class="{
                'max-w-[13.75rem] w-[73%] relative z-[1]': isImgError(post)
              }"
              @click="emit('click-post', index)"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-grey-6 column">
                  <q-icon name="broken_image" size="md" />
                </div>
              </template>
            </q-img>

            <!-- 失敗的文字 -->
            <div v-if="isImgError(post)" class="w-full text-center font-bold text-sm text-[#858585] relative z-[2]">
              {{ t("save_status_type.fail") }}
            </div>
          </div>

          <div
            class="absolute-bottom text-white min-h-[2.3125rem] flex column justify-end custom-overlay leading-1 !p-2.5 rounded-b-[0.625rem] z-[3]"
          >
            <div class="text-caption text-center">
              {{ t("ai_kol.generation_time") }} :
              {{ `${formatDuration(post.created_at)}` }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type * as Response from "src/api/response.type"
  import { useI18n } from "vue-i18n"
  import { useFormateTime } from "../composables/useFormateTime"
  import { useImage } from "@/hook/useImage"

  const { t } = useI18n()
  const { formatDuration } = useFormateTime()
  const { noDataImg } = useImage()

  defineProps<{
    posts: Response.AiKolPostItem[]
  }>()

  const emit = defineEmits(["click-post"])

  const isImgError = (post: Response.AiKolPostItem) => {
    return post.error_code === 9001 || post.error_message
  }

  const getShowImg = (post: Response.AiKolPostItem) => {
    return isImgError(post) ? noDataImg("ai_kol_post_img_no_data.webp") : post.image_url
  }
</script>

<style scoped lang="scss">
  /* 外框樣式 */

  .flex-container {
    @apply flex flex-wrap gap-3;
  }

  .post-item {
    /* 核心計算公式：
    寬度 = (100% - (間距 * 4)) / 5

    解釋：5 欄中間會有 4 個間距。
    12px * 4 = 48px
  */
    width: calc((100% - 48px) / 5);
    aspect-ratio: 1 / 1; /* 高度自動等於寬度，保持正方形 */

    /* 確保圖片不變形 */
    box-sizing: border-box;
  }

  /* 樣式美化 */
  .post-img {
    background-color: #f5f5f5; /* 圖片還沒載入前的底色 */
  }

  .custom-overlay {
    /* 從下到上的漸層：黑色 -> 透明 */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%);
    backdrop-filter: blur(2px); /* 讓字更清楚一點 */
  }
</style>
