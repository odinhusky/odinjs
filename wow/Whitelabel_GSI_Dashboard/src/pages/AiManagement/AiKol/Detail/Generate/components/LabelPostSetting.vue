<script setup lang="ts">
  import { computed, ref } from "vue"
  import { getTopicOptions } from "src/utils/constants/kolOptions"
  import { useKolStore } from "src/stores/kol"
  import { useAIKol } from "src/composables/useAIKol"
  import { useValidate } from "src/hook/useValidate"
  import DatePicker from "vue-datepicker-next"
  import "vue-datepicker-next/index.css"
  import { ElSelect, ElOption } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"

  const emits = defineEmits(["prevStep", "createResult"])
  const { createKol, isLoading } = useAIKol()
  const TOPIC_OPTS = computed(() => getTopicOptions())
  const { validateValue, handleMinus, handleAdd } = useValidate()
  const store = useKolStore()

  // --- 禁止詞彙 ---
  const wordInputVisible = ref(false)
  const wordInput = ref("")
  const newQuietHour = ref<[number, number] | null>(null)

  const addWord = () => {
    if (wordInput.value.trim()) {
      store.hard_do_not.words.push(wordInput.value.trim())
    }
    wordInputVisible.value = false
    wordInput.value = ""
  }

  const removeWord = (idx: number) => {
    store.hard_do_not.words.splice(idx, 1)
  }

  const formatHour = (h: number) => {
    const amPm = h < 12 ? "AM" : "PM"
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:00 ${amPm}`
  }

  const addQuietHour = () => {
    if (newQuietHour.value) {
      const [start, end] = newQuietHour.value
      store.cadence.quiet_hours.push([Number(start), Number(end)])
      newQuietHour.value = null
    }
  }

  const removeQuietHour = (idx: number) => {
    store.cadence.quiet_hours.splice(idx, 1)
  }

  const generateKol = async () => {
    const res = await createKol(store.$state)

    if (res && res.id) {
      emits("createResult", { status: true, id: res.id })
      return
    }
    emits("createResult", { status: false })
  }

  const scrollEl = ref<HTMLDivElement | null>(null)

  defineExpose({ scrollEl })
</script>

<template>
  <div ref="scrollEl" class="flex flex-col gap-[.625rem]">
    <q-card shadow="never" class="life-style-section">
      <h3 class="life-style-section-title">
        {{ $t("services.virtualKOL.management_post_frequency_settings") }}
      </h3>
      <!-- slider -->
      <div class="flex flex-col gap-[.625rem]">
        <div class="flex items-center gap-[4px]">
          <span class="font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-black">
            {{ $t("services.virtualKOL.management_daily_post_average") }}
          </span>
          <small class="font-[NotoSansTC] font-normal text-[.75rem] leading-[.875rem] text-[#6B6B6B]">
            {{ $t("services.virtualKOL.management_post_hint") }}
          </small>
        </div>
        <div class="flex flex-nowrap items-center gap-5">
          <q-slider
            v-model="store.cadence.lambda_per_day"
            :min="0.1"
            :max="3.0"
            :step="0.1"
            track-size="10px"
            thumb-size="14px"
            thumb-color="white"
            class="basic-slider"
          />
          <q-input
            v-model="store.cadence.lambda_per_day"
            borderless
            dense
            class="input-btn-minus-add"
            @blur="
              (evt) => {
                store.cadence.lambda_per_day = validateValue(store.cadence.lambda_per_day, {
                  min: 0.1,
                  max: 3.0,
                  step: 0.1
                })
              }
            "
          >
            <template v-slot:prepend>
              <div
                class="input-btn-minus"
                @click="
                  store.cadence.lambda_per_day = handleMinus(store.cadence.lambda_per_day, {
                    min: 0.1,
                    max: 3.0,
                    step: 0.1
                  })
                "
              >
                -
              </div>
            </template>
            <template v-slot:append>
              <div
                class="input-btn-add"
                @click="
                  store.cadence.lambda_per_day = handleAdd(store.cadence.lambda_per_day, {
                    min: 0.1,
                    max: 3.0,
                    step: 0.1
                  })
                "
              >
                +
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <!-- 禁止發文時段 -->
      <div class="flex flex-col gap-[.625rem]">
        <div class="flex items-center gap-[.625rem]">
          <div>{{ $t("services.virtualKOL.management_post_forbidden_time") }}</div>
          <div
            v-for="(range, idx) in store.cadence.quiet_hours"
            :key="idx"
            class="py-[.3125rem] px-3 rounded-[6.25rem] bg-[#FFF9E8] flex items-center gap-2"
          >
            <span class="font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-[#6B6B6B]">
              {{ formatHour(range[0]) }} - {{ formatHour(range[1]) }}</span
            >
            <q-icon name="close" size="1rem" @click="removeQuietHour(idx)" class="cursor-pointer"></q-icon>
          </div>
        </div>
        <div class="flex items-center gap-5">
          <date-picker
            v-model:value="newQuietHour"
            type="time"
            range
            format="HH"
            value-type="format"
            :placeholder="`${$t('query_params.start_time')}    ~    ${$t('query_params.end_time')}`"
            class="setting-date-picker"
          >
          </date-picker>
          <q-btn @click="addQuietHour" class="btn-add-quiet-hour">
            {{ $t("services.virtualKOL.management_add_forbidden_time") }}
          </q-btn>
        </div>
      </div>
    </q-card>
    <q-card class="life-style-section">
      <h3 class="life-style-section-title">
        {{ $t("services.virtualKOL.management_topic_restriction") }}
      </h3>
      <!-- 禁止話題 -->
      <div class="flex flex-col gap-[.375rem] w-full">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_forbidden_topics") }}
        </div>
        <!-- $t('table_header.please_select') -->
        <ElSelect
          v-model="store.hard_do_not.topics"
          multiple
          filterable
          allow-create
          :placeholder="$t('table_header.please_select')"
          class="w-full"
        >
          <ElOption v-for="item in TOPIC_OPTS" :key="item.value" :label="item.label" :value="item.value">
            <div class="flex flex-col">
              <span class="font-medium">{{ item.label }}</span>
            </div>
          </ElOption>
        </ElSelect>
      </div>
      <!-- 禁止詞彙 -->
      <div class="flex flex-col gap-[.375rem] w-full">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_forbidden_words") }}
        </div>
        <div class="flex items-center gap-[.625rem]">
          <div
            v-for="(word, idx) in store.hard_do_not.words"
            :key="idx"
            class="py-[.3125rem] px-3 rounded-[6.25rem] bg-[#F56C6C] flex items-center gap-2"
          >
            <span class="font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-white">
              {{ word }}
            </span>
            <q-icon name="close" size="1rem" @click="removeWord(idx)" class="cursor-pointer text-white"></q-icon>
          </div>
          <q-input
            v-if="wordInputVisible"
            v-model="wordInput"
            outlined
            dense
            class="w-40"
            :placeholder="$t('services.virtualKOL.management_add_word')"
            @keyup.enter="addWord"
            @blur="addWord"
          />
          <q-btn v-else class="btn-add-word" @click="wordInputVisible = true">
            {{ $t("services.virtualKOL.management_add_word") }}
          </q-btn>
        </div>
      </div>
      <!-- 注意事項 -->
      <div class="flex flex-col gap-[.375rem] w-full">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_notes") }}
        </div>
        <q-input
          v-model="store.hard_do_not.guidelines"
          outlined
          dense
          type="textarea"
          :rows="3"
          :placeholder="$t('services.virtualKOL.enter_notes')"
          counter
          maxlength="200"
        />
      </div>
    </q-card>

    <div class="flex w-full justify-center items-center gap-5 mt-[.625rem]">
      <q-btn class="btn-prev" @click="emits('prevStep')" :loading="isLoading">
        {{ $t("services.virtualKOL.management_prev_step") }}
      </q-btn>
      <q-btn class="btn-next" @click="generateKol" :loading="isLoading">
        {{ $t("services.virtualKOL.management_generateKOL") }}
      </q-btn>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .life-style-section {
    @apply rounded-[.625rem] p-5 flex flex-col gap-5 bg-[#EFF7FF] shadow-none;
  }

  .life-style-section-title {
    @apply font-[NotoSansTC] font-bold text-[1.125rem] leading-[1.375rem] text-[#535252];
  }

  .basic-slider {
    :deep(.q-slider__thumb-shape) {
      stroke-width: 10px;
      border: 1px solid #409eff;
      border-radius: 50%;
    }
  }

  .input-btn-minus-add {
    :deep(.q-field__control) {
      @apply px-0;

      &::before {
        border: 1px solid #e5e5e5;
      }

      .input-btn-minus,
      .input-btn-add {
        @apply px-[.6875rem]  text-[#535252] cursor-pointer;
      }

      .input-btn-minus {
        border-right: 1px solid #e5e5e5;
      }
      .input-btn-add {
        border-left: 1px solid #e5e5e5;
      }

      .q-field__native {
        text-align: center;
      }
    }
  }

  .btn-add-word {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-[1.6875rem];

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }

  .setting-date-picker {
    width: 23.75rem;
    :deep(.mx-input-wrapper) {
      input {
        height: 2.5rem;
        text-align: center;
      }
    }
  }

  .btn-add-quiet-hour {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-10;

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }

  .btn-prev {
    @apply rounded py-[.3125rem] px-4 bg-[#EFF7FF] min-h-8  w-[18.75rem] border border-solid border-[#409EFF];

    &::before {
      @apply shadow-none;
    }
    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-[#409EFF] capitalize;
    }

    :deep(.q-spinner) {
      @apply text-[#409EFF];
    }
  }

  .btn-next {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-8  w-[18.75rem];

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }

    :deep(.q-spinner) {
      @apply text-white;
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
