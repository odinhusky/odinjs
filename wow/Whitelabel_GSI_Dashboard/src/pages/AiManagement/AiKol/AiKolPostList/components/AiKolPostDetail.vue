<template>
  <q-dialog v-model="showDetail" transition-show="scale" transition-hide="scale">
    <div class="relative w-full h-full flex flex-center !max-w-[43.75rem]">
      <!-- 導航按鈕 -->
      <div class="absolute-left flex flex-center">
        <q-btn
          v-if="!(isFirst && isLast)"
          round
          color="primary"
          text-color="white"
          icon="chevron_left"
          unelevated
          size="md"
          class="shadow-2 opacity-90 hover:opacity-100"
          :disable="isFirst"
          @click.stop="emit('prev')"
        />
      </div>

      <div class="absolute-right flex flex-center">
        <q-btn
          v-if="!(isFirst && isLast)"
          round
          color="primary"
          text-color="white"
          icon="chevron_right"
          unelevated
          size="md"
          class="shadow-2 opacity-90 hover:opacity-100"
          :disable="isLast"
          @click.stop="emit('next')"
        />
      </div>

      <!-- 卡片內容 -->
      <q-card :class="`bg-white overflow-y-auto shadow-2xl rounded-[0.625rem] w-[33.75rem] ${SCROLLBAR_HIDDEN}`">
        <div class="h-[3.875rem] row items-center justify-between q-px-md q-py-sm">
          <div :class="`${TITLE_TEXT_CLASS}`">
            {{ t("ai_kol.post_detail") || "貼文詳情" }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-7" size="13px" />
        </div>

        <div class="relative-position flex flex-center pt-2.5">
          <div
            class="w-[31.25rem] h-[31.25rem] rounded-xl"
            :class="{
              'flex justify-center items-center flex-col gap-5  bg-[#F9F9F9]': isImgError(post)
            }"
          >
            <q-img
              :src="displayImg"
              class="w-full h-full rounded-xl"
              :class="{
                'max-w-[13.75rem] !h-auto': isImgError(post)
              }"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center column text-grey-5 bg-grey-2">
                  <q-icon name="broken_image" size="xl" />
                  <div class="q-mt-sm">Image Load Failed</div>
                </div>
              </template>
            </q-img>

            <!-- 失敗的文字 -->
            <div v-if="isImgError(post)" class="w-full text-center font-bold text-sm text-[#858585] relative z-[2]">
              {{ t("save_status_type.fail") }}
            </div>
          </div>
        </div>

        <div class="w-full p-5">
          <div class="row justify-between items-start no-wrap">
            <div class="col q-pr-md">
              <div :class="`${TITLE_TEXT_CLASS} q-mb-xs`">
                {{ post.kol_name || "Unknown KOL" }}
              </div>
              <div :class="`text-caption ${CONTENT_TEXT_CLASS} whitespace-pre-wrap`" style="word-break: break-word">
                {{ post.caption || "No caption provided." }}
              </div>
            </div>

            <div
              v-if="formatDuration(post.created_at)"
              :class="`col-auto text-caption ${TIME_TEXT_CLASS} whitespace-nowrap`"
            >
              {{ formatDuration(post.created_at) }}
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-dialog>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type * as Response from "src/api/response.type"
  import { useFormateTime } from "../composables/useFormateTime"
  import { useImage } from "@/hook/useImage"

  const SCROLLBAR_HIDDEN = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
  const TEXT_COLOR_CLASS = "text-[#535252]"
  const TITLE_TEXT_CLASS = `font-bold text-lg ${TEXT_COLOR_CLASS} leading-tight`
  const TIME_TEXT_CLASS = `text-xs ${TEXT_COLOR_CLASS} leading-normal`
  const CONTENT_TEXT_CLASS = `text-sm ${TEXT_COLOR_CLASS} leading-normal`

  const { t } = useI18n()
  const { formatDuration } = useFormateTime()
  const { noDataImg } = useImage()

  const props = defineProps<{
    modelValue: boolean
    post: Response.AiKolPostItem
    isFirst: boolean
    isLast: boolean
  }>()

  const emit = defineEmits(["update:modelValue", "prev", "next"])

  const showDetail = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val)
  })

  const isImgError = (post: Response.AiKolPostItem) => {
    return post.error_code === 9001 || post.error_message
  }

  const displayImg = computed(() => {
    return isImgError(props.post) ? noDataImg("ai_kol_post_img_no_data.webp") : props.post.image_url
  })
</script>

<style lang="scss" scoped></style>
