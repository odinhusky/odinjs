<script setup lang="ts">
  import { computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { Notify } from "quasar"
  import {
    getCaptionToneOptions,
    getFashionOptions,
    getLanguageStyleOptions,
    getPersonalityOptions,
    getPhotoTopicOptions,
    getPoseOptions,
    getSceneOptions
  } from "src/utils/constants/kolOptions"
  import { useKolStore } from "src/stores/kol"
  import { ElSelect, ElOption } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"

  const emits = defineEmits(["prevStep", "nextStep"])
  const { t } = useI18n()
  const store = useKolStore()

  const FASHION_OPTS = computed(() => getFashionOptions())
  const SCENE_OPTS = computed(() => getSceneOptions())
  const POSE_OPTS = computed(() => getPoseOptions())
  const CAPTION_TONE_OPTS = computed(() => getCaptionToneOptions())
  const LANGUAGE_STYLE_OPTS = computed(() => getLanguageStyleOptions())
  const PERSONALITY_OPTS = computed(() => getPersonalityOptions())
  const PHOTO_TOPIC_OPTS = computed(() => getPhotoTopicOptions())
  const scrollEl = ref<HTMLDivElement | null>(null)

  const handleNext = () => {
    if (!store.kolDataValidInfo.validate) {
      Notify.create({
        message: t(store.kolDataValidInfo.msg),
        type: "negative",
        position: "top",
        timeout: 300
      })
      return
    }
    emits("nextStep")
  }

  defineExpose({ scrollEl })
</script>

<template>
  <q-form ref="scrollEl" class="flex flex-col gap-[.625rem]" @submit="handleNext">
    <!-- Visual 區塊 -->
    <q-card shadow="never" class="life-style-section">
      <h3 class="life-style-section-title">
        {{ $t("services.virtualKOL.management_scene_preference") }}
      </h3>
      <div class="grid grid-cols-2 gap-5">
        <!-- 服裝風格 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_clothing_style") }}
          </div>
          <ElSelect
            v-model="store.visual.clothing_styles"
            multiple
            filterable
            allow-create
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption v-for="option in FASHION_OPTS" :key="option.value" :label="option.label" :value="option.value" />
          </ElSelect>
        </div>
        <!-- 場景偏好 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_scene_preference") }}
          </div>
          <ElSelect
            v-model="store.visual.scenes_pref"
            multiple
            filterable
            allow-create
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption v-for="option in SCENE_OPTS" :key="option.value" :label="option.label" :value="option.value" />
          </ElSelect>
        </div>
        <!-- 姿勢偏好 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_pose_preference") }}
          </div>
          <ElSelect
            v-model="store.visual.poses_pref"
            multiple
            filterable
            allow-create
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption v-for="option in POSE_OPTS" :key="option.value" :label="option.label" :value="option.value" />
          </ElSelect>
        </div>
      </div>
    </q-card>

    <!-- Life 區塊 -->
    <q-card shadow="never" class="life-style-section">
      <h3 class="life-style-section-title">
        {{ $t("services.virtualKOL.management_lifestyle_traits") }}
      </h3>
      <div class="grid grid-cols-2 gap-5">
        <!-- 人格特質 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_personality_traits") }}
          </div>
          <ElSelect
            v-model="store.life.traits"
            multiple
            filterable
            allow-create
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption
              v-for="option in PERSONALITY_OPTS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>
        <!-- 說話風格 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_speaking_style") }}
          </div>
          <ElSelect
            v-model="store.life.speech_style"
            multiple
            filterable
            allow-create
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption
              v-for="option in LANGUAGE_STYLE_OPTS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>
      </div>
    </q-card>

    <!-- Content Style 區塊 -->
    <q-card shadow="never" class="life-style-section">
      <h3 class="life-style-section-title">
        {{ $t("services.virtualKOL.management_content_style") }}
      </h3>
      <div class="grid grid-cols-2 gap-5">
        <!-- 文案語調 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_tone") }}
          </div>
          <ElSelect
            v-model="store.content_style.caption_tones"
            filterable
            allow-create
            multiple
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption
              v-for="option in CAPTION_TONE_OPTS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>
        <!-- 照片主題 -->
        <div class="flex flex-col gap-[.375rem] w-full">
          <div class="basic-label required-label">
            {{ $t("services.virtualKOL.management_photo_theme") }}
          </div>
          <ElSelect
            v-model="store.content_style.photo_topics"
            filterable
            allow-create
            multiple
            class="w-full"
            :placeholder="$t('table_header.please_select')"
          >
            <ElOption
              v-for="option in PHOTO_TOPIC_OPTS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>
      </div>
    </q-card>

    <div class="flex w-full justify-center items-center gap-5 mt-[.625rem]">
      <q-btn class="btn-prev" @click="emits('prevStep')">
        {{ $t("services.virtualKOL.management_prev_step") }}
      </q-btn>
      <q-btn class="btn-next" type="submit">
        {{ $t("services.virtualKOL.management_next_step") }}
      </q-btn>
    </div>
  </q-form>
</template>

<style scoped lang="scss">
  .life-style-section {
    @apply rounded-[.625rem] p-5 flex flex-col gap-5 bg-[#EFF7FF] shadow-none;
  }

  .life-style-section-title {
    @apply font-[NotoSansTC] font-bold text-[1.125rem] leading-[1.375rem] text-[#535252];
  }

  .basic-label {
    @apply font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-black flex items-center gap-[.375rem];
  }

  .required-label::after {
    content: "";
    display: block;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #f56c6c;
  }

  .btn-prev {
    @apply rounded py-[.3125rem] px-4 bg-[#EFF7FF] min-h-8  w-[18.75rem] border border-solid border-[#409EFF];

    &::before {
      @apply shadow-none;
    }
    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-[#409EFF] capitalize;
    }
  }

  .btn-next {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-8  w-[18.75rem];

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }

  .basic-select {
    :deep(.q-field__native) {
      span {
        color: #9e9e9e;
      }
    }

    &.has-value {
      :deep(.q-field__native) {
        span {
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }
  }

  .el-select {
    :deep(.el-select__wrapper) {
      @apply min-h-10;
    }
  }
</style>
