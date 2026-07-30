<template>
  <ElSelect
    v-model="selectValues"
    multiple
    :placeholder="t('table_header.please_select')"
    class="member-level-tag-select w-full"
  >
    <template #tag="{ data, deleteTag, selectDisabled }">
      <div v-for="item in data" :key="String(item.value)" class="member-level-tag-select__selected-item">
        <ElTag
          :closable="!selectDisabled && !item.isDisabled"
          disable-transitions
          :class="getChipClass(String(item.value))"
          @close="deleteTag($event, item)"
        >
          <span class="member-level-tag-chip__label">{{ item.currentLabel }}</span>
        </ElTag>
      </div>
    </template>

    <ElOptionGroup v-if="levelOptions.length" :label="t('table_header.member_level')">
      <ElOption v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
    </ElOptionGroup>

    <ElOptionGroup v-if="tagOptions.length" :label="t('query_params.member_tag')">
      <ElOption v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
    </ElOptionGroup>
  </ElSelect>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { ElOption, ElOptionGroup, ElSelect, ElTag } from "element-plus"
  import "element-plus/es/components/select/style/css"
  import "element-plus/es/components/option/style/css"
  import "element-plus/es/components/option-group/style/css"
  import "element-plus/es/components/tag/style/css"
  import { useQueryStore } from "@/stores/queryStore"

  const LEVEL_TAG_VALUE_PREFIX = {
    level: "level:",
    tag: "tag:"
  } as const

  type SelectOption = {
    label: string
    value: string
  }

  const levelIds = defineModel<number[]>("levelIds", { required: true })
  const labelIds = defineModel<number[]>("labelIds", { required: true })

  const props = withDefaults(
    defineProps<{
      /** 其他列已選的會員等級，本列下拉不顯示 */
      excludedLevelIds?: number[]
      /** 其他列已選的會員標籤，本列下拉不顯示 */
      excludedLabelIds?: number[]
    }>(),
    {
      excludedLevelIds: () => [],
      excludedLabelIds: () => []
    }
  )

  const { t } = useI18n()
  const queryStore = useQueryStore()

  const excludedLevelIdSet = computed(() => new Set(props.excludedLevelIds))
  const excludedLabelIdSet = computed(() => new Set(props.excludedLabelIds))

  const levelOptions = computed<SelectOption[]>(() =>
    queryStore.memberLevel
      .filter((item) => !excludedLevelIdSet.value.has(Number(item.value)))
      .map((item) => ({
        label: item.label,
        value: `${LEVEL_TAG_VALUE_PREFIX.level}${item.value}`
      }))
  )

  const tagOptions = computed<SelectOption[]>(() =>
    queryStore.memberTags
      .filter((tag) => tag.enabled && !excludedLabelIdSet.value.has(tag.id))
      .sort((a, b) => a.type - b.type || a.name.localeCompare(b.name))
      .map((tag) => ({
        label: tag.name,
        value: `${LEVEL_TAG_VALUE_PREFIX.tag}${tag.id}`
      }))
  )

  const selectValues = computed<string[]>({
    get() {
      return [
        ...levelIds.value.map((id) => `${LEVEL_TAG_VALUE_PREFIX.level}${id}`),
        ...labelIds.value.map((id) => `${LEVEL_TAG_VALUE_PREFIX.tag}${id}`)
      ]
    },
    set(values) {
      levelIds.value = values
        .filter((value) => value.startsWith(LEVEL_TAG_VALUE_PREFIX.level))
        .map((value) => Number(value.slice(LEVEL_TAG_VALUE_PREFIX.level.length)))
        .filter((id) => Number.isFinite(id))

      labelIds.value = values
        .filter((value) => value.startsWith(LEVEL_TAG_VALUE_PREFIX.tag))
        .map((value) => Number(value.slice(LEVEL_TAG_VALUE_PREFIX.tag.length)))
        .filter((id) => Number.isFinite(id))
    }
  })

  function getChipClass(value: string) {
    if (value.startsWith(LEVEL_TAG_VALUE_PREFIX.level)) {
      return "member-level-tag-chip member-level-tag-chip--level"
    }

    return "member-level-tag-chip member-level-tag-chip--tag"
  }
</script>

<style scoped lang="scss">
  .member-level-tag-select {
    :deep(.el-select__wrapper) {
      min-height: 2.5rem;
    }

    :deep(.el-select__selection) {
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  }

  .member-level-tag-select__selected-item {
    max-width: 100%;
  }

  .member-level-tag-chip {
    max-width: 100%;
    border: 0;

    :deep(.el-tag__content) {
      overflow: hidden;
    }

    &__label {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--level {
      --el-tag-bg-color: #e8f5e9;
      --el-tag-border-color: #81c784;
      --el-tag-text-color: #2e7d32;
    }

    &--tag {
      --el-tag-bg-color: #fff8e1;
      --el-tag-border-color: #ffd54f;
      --el-tag-text-color: #f57f17;
    }
  }
</style>
