<script setup lang="ts">
  import { computed, defineEmits, defineProps } from "vue"
  import { useRouter } from "vue-router"
  import { useImage } from "src/hook/useImage"
  import { useLabel } from "src/composables/useLabel"
  import {
    getCaptionToneOptions,
    getFashionOptions,
    getGenderOptions,
    getLanguageStyleOptions,
    getLocaleOptions,
    getNationalityOptions,
    getPersonalityOptions,
    getPhotoTopicOptions,
    getPoseOptions,
    getSceneOptions,
    getTimezoneOptions,
    getTopicOptions
  } from "src/utils/constants/kolOptions"
  // import { useKolStore } from '#/store/kol';

  const { svgImg } = useImage()
  const props = withDefaults(
    defineProps<{
      isCadenceShow?: boolean
      isIdShow?: boolean
      isShowGeneratePostBtn?: boolean
      isShowHardDoNot?: boolean
      kolInfo: any
      visible: boolean
      selected: number
      maxLength: number
    }>(),
    {
      isShowGeneratePostBtn: true,
      isIdShow: true,
      isCadenceShow: true,
      isShowHardDoNot: true,
      selected: 0,
      maxLength: 0
    }
  )
  const emit = defineEmits(["update:visible", "changeSelected"])
  const FASHION_OPTS = computed(() => getFashionOptions())
  const CAPTION_TONE_OPTS = computed(() => getCaptionToneOptions())
  const GENDER_OPTS = computed(() => getGenderOptions())
  const LANGUAGE_STYLE_OPTS = computed(() => getLanguageStyleOptions())
  const PERSONALITY_OPTS = computed(() => getPersonalityOptions())
  const PHOTO_TOPIC_OPTS = computed(() => getPhotoTopicOptions())
  const POSE_OPTS = computed(() => getPoseOptions())
  const SCENE_OPTS = computed(() => getSceneOptions())
  const TOPIC_OPTS = computed(() => getTopicOptions())
  const NATIONALITY_OPTIONS = computed(() => getNationalityOptions())
  const LOCALE_OPTIONS = computed(() => getLocaleOptions())
  const TIMEZONE_OPTIONS = computed(() => getTimezoneOptions())

  // const kolStore = useKolStore();

  const router = useRouter()

  const { getLabel } = useLabel()

  const handleClose = () => emit("update:visible", false)

  const toGeneratePost = () => {
    router.push({
      name: "AiKolPostGeneration",
      query: { kol_id: props.kolInfo.id }
    })
  }

  const formatQuietHours = (range: number[]) => {
    if (!Array.isArray(range) || range.length !== 2) return ""
    const [start, end] = range as [number, number]
    const format = (h: number) => {
      const amPm = h >= 12 ? "PM" : "AM"
      const hr = h % 12 === 0 ? 12 : h % 12
      return `${hr}:00 ${amPm}`
    }
    return `${format(start)} - ${format(end)}`
  }
</script>

<template>
  <q-dialog :model-value="props.visible" class="custom-dialog" @hide="handleClose">
    <div class="!max-w-[83.75rem] w-[83.75rem] p-5 bg-white relative !overflow-visible flex flex-col gap-5">
      <div class="flex justify-between items-center">
        <div class="font-[NotoSansTC] font-bold text-[1.125rem] leading-[1.375rem] text-[#535252]">KOL資訊</div>
        <img :src="svgImg('close')" alt="btn close" class="cursor-pointer" @click="handleClose" />
      </div>
      <div class="flex-1 flex w-full items-start gap-5">
        <!-- 左側圖片 -->
        <div class="flex w-[38.5%] items-center justify-center relative">
          <q-img
            :src="props.kolInfo.preview_image_url"
            fit="contain"
            class="max-w-[31.25rem] h-[80%] rounded-[.625rem] object-contain"
          />
          <div
            class="absolute bottom-[1px] left-0 flex w-full flex-col items-center gap-1 rounded-b-xl bg-gradient-to-b from-black/10 to-black/90 py-2 font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white"
          >
            <p v-if="props.isIdShow">ID: {{ props.kolInfo.id }}</p>
            <p>{{ props.kolInfo.name }}</p>
          </div>
        </div>

        <!-- 右側資訊 -->
        <div class="flex flex-[1] flex-col gap-[1.875rem] flex-nowrap overflow-y-auto">
          <div
            class="flex-1 max-h-[calc(100vh-200px)] rounded-[.625rem] p-5 bg-[#EFF7FF] flex flex-col flex-nowrap gap-[.625rem] overflow-y-auto"
          >
            <!-- ID -->
            <q-card v-if="props.isIdShow" class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">ID</span>
                <span class="small-card-row-value">{{ props.kolInfo.id }}</span>
              </div>
            </q-card>

            <!-- 一般資訊 -->
            <q-card class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_name") }}</span>
                <span class="small-card-row-value">{{ props.kolInfo.name }}</span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_nationality") }}</span>
                <span class="small-card-row-value">{{ getLabel(props.kolInfo.nationality, NATIONALITY_OPTIONS) }}</span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_language_region") }}</span>
                <span class="small-card-row-value">
                  {{ getLabel(props.kolInfo.locale, LOCALE_OPTIONS) }}
                </span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_timezone") }}</span>
                <span class="small-card-row-value">
                  {{ getLabel(props.kolInfo.timezone, TIMEZONE_OPTIONS) }}
                </span>
              </div>
            </q-card>

            <!-- 身體資訊 -->
            <q-card class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_age") }}</span>
                <span class="small-card-row-value">
                  {{ props.kolInfo.visual.body_info.age }}
                  {{ $t("services.virtualKOL.management_age_years_old") }}
                </span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_gender") }}</span>
                <span class="small-card-row-value">
                  {{ getLabel(props.kolInfo.visual.body_info.gender, GENDER_OPTS) }}
                </span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_height") }}</span>
                <span class="small-card-row-value">{{ props.kolInfo.visual.body_info.height }} cm</span>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_weight") }}</span>
                <span class="small-card-row-value">{{ props.kolInfo.visual.body_info.weight }} kg</span>
              </div>
            </q-card>

            <!-- 視覺偏好 -->
            <q-card class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_clothing_style") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.visual.clothing_styles"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, FASHION_OPTS) }}
                  </div>
                </div>
              </div>
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_scene_preference") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.visual.scenes_pref"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, SCENE_OPTS) }}
                  </div>
                </div>
              </div>

              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_pose_preference") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.visual.poses_pref"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, POSE_OPTS) }}
                  </div>
                </div>
              </div>
            </q-card>

            <!-- 生活特質 -->
            <q-card class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_personality_traits") }}</span>
                <div class="small-card-row-tags">
                  <div v-for="(item, i) in props.kolInfo.life.traits" :key="i" type="info" class="small-card-row-tag">
                    {{ getLabel(item, PERSONALITY_OPTS) }}
                  </div>
                </div>
              </div>

              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_speaking_style") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.life.speech_style"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, LANGUAGE_STYLE_OPTS) }}
                  </div>
                </div>
              </div>

              <div v-if="false" class="small-card-row">
                <span class="small-card-row-title">口頭禪</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.life.catchphrases"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </q-card>

            <!-- 內容風格 -->
            <q-card class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_tone") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.content_style.caption_tones"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, CAPTION_TONE_OPTS) }}
                  </div>
                </div>
              </div>

              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_photo_theme") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(item, i) in props.kolInfo.content_style.photo_topics"
                    :key="i"
                    type="info"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(item, PHOTO_TOPIC_OPTS) }}
                  </div>
                </div>
              </div>
            </q-card>

            <!-- 發文頻率 -->
            <q-card v-if="isCadenceShow" class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_daily_post_average") }}</span>
                <div class="small-card-row-value">
                  ≈
                  {{
                    props.kolInfo.cadence.lambda_per_day === 1
                      ? $t("services.virtualKOL.management_one_post_per_day")
                      : props.kolInfo.cadence.lambda_per_day < 1
                      ? `${$t("services.virtualKOL.management_about_every")} ${Math.round(
                          1 / props.kolInfo.cadence.lambda_per_day
                        )} ${$t("services.virtualKOL.management_days_one_post")}`
                      : `${props.kolInfo.cadence.lambda_per_day.toFixed(1)} ${$t(
                          "services.virtualKOL.management_posts_per_day"
                        )}`
                  }}
                </div>
              </div>

              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_post_forbidden_time") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(range, i) in props.kolInfo.cadence.quiet_hours"
                    :key="i"
                    type="danger"
                    class="small-card-row-tag quiet_hours"
                  >
                    {{ formatQuietHours(range) }}
                  </div>
                </div>
              </div>
            </q-card>

            <!-- 禁止話題 -->
            <q-card v-if="isShowHardDoNot" class="small-card">
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_forbidden_topics") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(topic, i) in props.kolInfo.hard_do_not.topics"
                    :key="i"
                    type="danger"
                    class="small-card-row-tag"
                  >
                    {{ getLabel(topic, TOPIC_OPTS) }}
                  </div>
                </div>
              </div>

              <!-- 禁止詞彙 -->
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_forbidden_words") }}</span>
                <div class="small-card-row-tags">
                  <div
                    v-for="(word, i) in props.kolInfo.hard_do_not.words"
                    :key="i"
                    type="danger"
                    effect="dark"
                    class="small-card-row-tag"
                  >
                    {{ word }}
                  </div>
                </div>
              </div>

              <!-- 注意事項 -->
              <div class="small-card-row">
                <span class="small-card-row-title">{{ $t("services.virtualKOL.management_notes") }}</span>
                <div class="small-card-row-value">
                  {{ props.kolInfo.hard_do_not.guidelines }}
                </div>
              </div>
            </q-card>
          </div>

          <div class="flex justify-end items-center">
            <q-btn v-if="isShowGeneratePostBtn" @click="toGeneratePost" class="btn-go-generate-post">
              {{ $t("services.virtualKOL.management_generate_post") }}
            </q-btn>
          </div>
        </div>
      </div>

      <q-img
        v-if="props.maxLength > 1"
        :src="svgImg('btn-prev')"
        class="absolute z-[10000] top-[50%] left-[-80px] -translate-y-1/2 w-10 h-10 cursor-pointer"
        :class="{ 'opacity-60 cursor-not-allowed': props.selected === 0 }"
        @click="emit('changeSelected', -1)"
      ></q-img>
      <q-img
        v-if="props.maxLength > 1"
        :src="svgImg('btn-next')"
        class="absolute z-[10000] top-[50%] right-[-80px] -translate-y-1/2 w-10 h-10 cursor-pointer"
        :class="{ 'opacity-60 cursor-not-allowed': props.selected >= props.maxLength - 1 }"
        @click="emit('changeSelected', 1)"
      ></q-img>
    </div>
  </q-dialog>
</template>

<style lang="scss">
  .custom-dialog {
    .q-dialog__inner {
      @apply px-20;
    }
  }
</style>
<style scoped lang="scss">
  .small-card {
    @apply rounded px-[.625rem] shadow-none;

    .small-card-row {
      @apply flex justify-between gap-5  py-[.625rem];
      border-bottom: 1px solid var(--neutral-04, #e5e5e5);

      &:last-child {
        border-bottom: none;
      }
      .small-card-row-title {
        width: 8rem;
        font-family: NotoSansTC;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.0625rem;
      }

      .small-card-row-value {
        font-family: NotoSansTC;
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 1.0625rem;
        color: #00bf95;
      }

      .small-card-row-tags {
        @apply flex flex-wrap justify-end items-center gap-[.625rem];

        .small-card-row-tag {
          @apply rounded-[6.25rem] bg-[#EFF7FF] px-3 py-[.3125rem] font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-[#409EFF];

          &.quiet_hours {
            @apply bg-[#FFF9E8] text-[#6B6B6B];
          }
        }
      }
    }
  }

  .btn-go-generate-post {
    @apply rounded py-[.3125rem] px-[.6875rem] bg-[#409EFF] min-h-8;

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }
</style>
