<script setup lang="ts">
  import { computed, ref } from "vue"
  import { useValidate } from "src/hook/useValidate"
  import { getLocaleOptions, getNationalityOptions, getTimezoneOptions } from "src/utils/constants/kolOptions"
  import { useKolStore } from "src/stores/kol"
  import { useRule } from "src/hook/useRule"
  import { ElSelect, ElOption } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"

  const { validateValue, handleMinus, handleAdd } = useValidate()
  const Rules = useRule()

  const emits = defineEmits(["nextStep"])
  const store = useKolStore()
  const scrollEl = ref<HTMLDivElement | null>(null)
  const NATIONALITY_OPTIONS = computed(() => getNationalityOptions())
  const LOCALE_OPTIONS = computed(() => getLocaleOptions())
  const TIMEZONE_OPTIONS = computed(() => getTimezoneOptions())

  defineExpose({ scrollEl })
</script>

<template>
  <q-form ref="scrollEl" class="flex flex-col gap-5" @submit="emits('nextStep')">
    <!-- 國籍 -->
    <div class="flex gap-[15px]">
      <div class="flex flex-col gap-[.375rem] w-full">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_nationality") }}
        </div>
        <ElSelect filterable v-model="store.nationality" class="w-full">
          <ElOption
            v-for="option in NATIONALITY_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>
    </div>
    <!-- 語言度區、時區 -->
    <div class="flex flex-nowrap items-center justify-between gap-5">
      <div class="flex flex-col gap-[.375rem] w-1/2">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_language_region") }}
        </div>
        <ElSelect filterable v-model="store.locale" class="w-full">
          <ElOption v-for="option in LOCALE_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
        </ElSelect>
      </div>
      <div class="flex flex-col gap-[.375rem] w-1/2">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_timezone") }}
        </div>
        <ElSelect filterable v-model="store.timezone" class="w-full">
          <ElOption
            v-for="option in TIMEZONE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>
    </div>
    <!-- 姓名、性別 -->
    <div class="flex flex-nowrap items-center justify-between gap-5">
      <div class="flex flex-col gap-[.375rem] w-1/2">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_name") }}
        </div>
        <q-input
          v-model="store.name"
          outlined
          dense
          :rules="[Rules.required()]"
          lazy-rules
          no-error-icon
          hide-bottom-space
          :placeholder="$t('table_header.please_enter')"
        />
      </div>
      <div class="flex flex-col gap-[.375rem] w-1/2">
        <div class="basic-label required-label">
          {{ $t("services.virtualKOL.management_gender") }}
        </div>
        <q-radio v-model="store.visual.body_info.gender" val="male" :label="$t('common.male')" dense></q-radio>
        <q-radio v-model="store.visual.body_info.gender" val="female" :label="$t('common.female')" dense></q-radio>
      </div>
    </div>
    <!-- 年齡 -->
    <div class="flex flex-nowrap items-center gap-5">
      <div class="basic-label required-label w-[130px]">
        {{ $t("services.virtualKOL.management_age") }}
      </div>
      <q-slider
        v-model="store.visual.body_info.age"
        :min="18"
        :max="80"
        track-size="10px"
        thumb-size="14px"
        thumb-color="white"
        class="basic-slider"
      />
      <q-input
        v-model="store.visual.body_info.age"
        borderless
        dense
        class="input-btn-minus-add"
        @blur="
          (evt) => {
            store.visual.body_info.age = validateValue(store.visual.body_info.age, {
              min: 18,
              max: 80,
              step: 1
            })
          }
        "
      >
        <template v-slot:prepend>
          <div
            class="input-btn-minus"
            @click="store.visual.body_info.age = handleMinus(store.visual.body_info.age, { min: 18, max: 80, step: 1 })"
          >
            -
          </div>
        </template>
        <template v-slot:append>
          <div
            class="input-btn-add"
            @click="store.visual.body_info.age = handleAdd(store.visual.body_info.age, { min: 18, max: 80, step: 1 })"
          >
            +
          </div>
        </template>
      </q-input>
    </div>

    <!-- 身高 -->
    <div class="flex flex-nowrap items-center gap-5">
      <div class="basic-label required-label w-[130px]">
        {{ $t("services.virtualKOL.management_height") }}
      </div>
      <q-slider
        v-model="store.visual.body_info.height"
        :min="140"
        :max="190"
        track-size="10px"
        thumb-size="14px"
        thumb-color="white"
        class="basic-slider"
      />
      <q-input
        v-model="store.visual.body_info.height"
        borderless
        dense
        class="input-btn-minus-add"
        @blur="
          (evt) => {
            store.visual.body_info.height = validateValue(store.visual.body_info.height, {
              min: 140,
              max: 190,
              step: 1
            })
          }
        "
      >
        <template v-slot:prepend>
          <div
            class="input-btn-minus"
            @click="
              store.visual.body_info.height = handleMinus(store.visual.body_info.height, {
                min: 140,
                max: 190,
                step: 1
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
              store.visual.body_info.height = handleAdd(store.visual.body_info.height, { min: 140, max: 190, step: 1 })
            "
          >
            +
          </div>
        </template>
      </q-input>
    </div>

    <!-- 體重 -->
    <div class="flex flex-nowrap items-center gap-5">
      <div class="basic-label required-label w-[130px]">
        {{ $t("services.virtualKOL.management_weight") }}
      </div>
      <q-slider
        v-model="store.visual.body_info.weight"
        :min="40"
        :max="120"
        track-size="10px"
        thumb-size="14px"
        thumb-color="white"
        class="basic-slider"
      />
      <q-input
        v-model="store.visual.body_info.weight"
        borderless
        dense
        class="input-btn-minus-add"
        @blur="
          (evt) => {
            store.visual.body_info.weight = validateValue(store.visual.body_info.weight, { min: 40, max: 120, step: 1 })
          }
        "
      >
        <template v-slot:prepend>
          <div
            class="input-btn-minus"
            @click="
              store.visual.body_info.weight = handleMinus(store.visual.body_info.weight, { min: 40, max: 120, step: 1 })
            "
          >
            -
          </div>
        </template>
        <template v-slot:append>
          <div
            class="input-btn-add"
            @click="
              store.visual.body_info.weight = handleAdd(store.visual.body_info.weight, { min: 40, max: 120, step: 1 })
            "
          >
            +
          </div>
        </template>
      </q-input>
    </div>

    <div class="flex w-full justify-center items-center">
      <q-btn class="btn-next" type="submit">
        {{ $t("services.virtualKOL.management_next_step") }}
      </q-btn>
    </div>
  </q-form>
</template>

<style scoped lang="scss">
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

  .btn-next {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-8 w-[18.75rem];

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }

  .el-select {
    :deep(.el-select__wrapper) {
      @apply min-h-10;
    }
  }
</style>
