<template>
  <div>
    <div class="title-container q-mt-xs row q-col-gutter-md items-center">
      <div v-if="title" class="text-subtitle2 text-bold">{{ title }}</div>
      <div v-if="showSelecAllNextToTitle">
        <q-radio
          v-model="selectAllRadio"
          val="true"
          :label="$t('btn.select_all')"
          size="lg"
          :disable="readOnly"
          @update:model-value="toggleSelectAllRadio"
        />
        <q-radio
          v-model="selectAllRadio"
          val="false"
          :label="$t('btn.cancel_all')"
          size="lg"
          class="q-ml-md"
          :disable="readOnly"
          @update:model-value="toggleSelectAllRadio"
        />
      </div>
    </div>
    <div>
      <div class="row justify-start">
        <q-checkbox
          v-if="!hideSelectAll"
          v-model="selectAll"
          :label="checkboxLabel"
          :disable="readOnly"
          @update:model-value="toggleSelectAll"
          class="q-mb-xs"
        />
      </div>

      <div :class="props.isColumn ? 'column' : 'row'">
        <q-checkbox
          v-for="item in groupOptions"
          :key="item.value"
          v-model="groupValue"
          :label="item.label"
          :val="item.value"
          :disable="disableArray ? disableValue(item.value) : readOnly"
          :class="{ 'button-style': itemButtonStyle }"
          class="q-mr-xl q-mb-xs"
        >
          <img v-if="openSelectIcon" :src="item.iconLink" />
        </q-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { watch, ref, computed, watchEffect, toRefs, defineEmits, nextTick } from "vue"
  import type { QOptionGroupProps } from "quasar"
  import { useI18n } from "vue-i18n"

  type QOptionGroupOptions = QOptionGroupProps["options"]
  const props = defineProps({
    parentValue: {
      type: Array<any>,
      required: true,
      default: () => ({})
    },
    groupOptions: {
      type: Object as () => QOptionGroupOptions,
      required: true,
      default: () => ({})
    },
    selectAllLabel: {
      type: String,
      required: false,
      default: ""
    },
    itemButtonStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    hideSelectAll: {
      type: Boolean,
      required: false,
      default: false
    },
    showSelecAllNextToTitle: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    readOnly: {
      type: [Boolean],
      required: false,
      default: () => false
    },
    openSelectIcon: {
      type: Boolean,
      required: false,
      default: ""
    },
    iconLink: {
      type: String,
      required: false,
      default: ""
    },
    topStyle: {
      type: Boolean,
      required: false,
      default: true
    },
    disableArray: {
      type: Array<any>,
      required: false,
      default: () => []
    },
    isColumn: {
      type: Boolean,
      default: false
    }
  })
  const { parentValue, groupOptions, selectAllLabel, disableArray } = toRefs(props)
  const groupValue = ref(parentValue.value)
  const selectAll = ref(false)
  const selectAllRadio = ref("")

  const { t } = useI18n()
  const checkboxLabel = computed(() => {
    if (selectAllLabel.value) {
      return selectAllLabel.value
    }
    return t("btn.select_all")
  })
  const disableValue = (value: number) => Array.isArray(disableArray.value) && disableArray.value.includes(value)

  const toggleSelectAll = (value: boolean) => {
    if (value) {
      groupValue.value = groupOptions.value?.map((e) => e.value) as Array<any>
    } else {
      groupValue.value = []
    }
  }
  const toggleSelectAllRadio = (value: string) => {
    if (value === "true") {
      groupValue.value = groupOptions.value?.map((e) => e.value) as Array<any>
    } else {
      groupValue.value = []
    }
  }

  const emit = defineEmits(["update:parentValue"])

  /** 由父層 props 寫入 groupValue 時不可再 emit，否則會形成 parent ↔ child 無限更新（QForm 內會觸發 Maximum recursive updates） */
  const syncingFromParent = ref(false)

  watch(parentValue, (newValue) => {
    syncingFromParent.value = true
    groupValue.value = newValue
    checkAll()
    nextTick(() => {
      syncingFromParent.value = false
    })
  })

  watch(
    groupValue,
    (newValue) => {
      checkAll()
      if (syncingFromParent.value) return
      emit("update:parentValue", newValue)
    },
    { deep: true }
  )

  //產品搜尋
  watch(
    groupOptions,
    () => {
      checkAll()
    },
    { deep: true }
  )

  watchEffect(() => {
    setTimeout(() => {
      checkAll()
    })
  })

  function checkAll() {
    const hasAllOptions = groupOptions.value?.every((e) => groupValue.value.includes(e.value))
    if (hasAllOptions) {
      selectAll.value = true
      selectAllRadio.value = "true"
    } else {
      selectAll.value = false
      selectAllRadio.value = ""
    }
    if (groupValue.value.length === 0) {
      selectAll.value = false
      selectAllRadio.value = "false"
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../css/_variable_v2.sass";
  ::v-deep(.button-style) {
    margin-top: 1.25rem;
    .q-checkbox__inner {
      display: none;
    }
    .q-checkbox__label {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 0.0625rem solid #3f3c4433;
      padding: 0.5rem 32px;
      border-radius: 62.4375rem;
      img {
        margin-right: 0.5rem;
      }
    }
    &[aria-checked="true"] {
      .q-checkbox__label {
        border-color: $mainColor;
        border-width: 0.125rem;
      }
    }
  }
</style>
