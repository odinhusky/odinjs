<template>
  <div v-if="targetType !== MessageNotificationTargetType.ALL_MEMBERS" class="space-y-2">
    <div class="flex items-center justify-between gap-3">
      <div class="text-sm font-medium">{{ receiverLabel }}</div>
      <div v-if="showCheckboxActions" class="flex items-center gap-2">
        <q-btn flat dense color="primary" :label="t('btn.select_all2')" @click="onSelectAll" />
        <q-btn flat dense color="grey-7" :label="t('btn.cancel_all2')" @click="onClearSelected" />
      </div>
    </div>
    <q-field
      borderless
      :model-value="selectedReceiverIdsModel"
      :rules="receiverRules"
      lazy-rules="ondemand"
      no-error-icon
      hide-bottom-space
    >
      <template #control>
        <q-option-group
          v-if="isCheckboxTarget && isReadonly"
          :model-value="selectedReceiverValues"
          :options="receiverOptions"
          type="checkbox"
          inline
          class="flex flex-wrap gap-x-4 gap-y-2"
          disable
        />
        <q-option-group
          v-else-if="isCheckboxTarget"
          v-model="selectedReceiverIdsModel"
          :options="receiverOptions"
          type="checkbox"
          inline
          class="flex flex-wrap gap-x-4 gap-y-2"
        />
        <q-select
          v-else-if="isReadonly"
          :model-value="selectedReceiverValues"
          multiple
          :options="receiverOptions"
          use-chips
          filled
          emit-value
          map-options
          readonly
          class="w-full"
        />
        <q-select
          v-else-if="isSpecificMemberTarget"
          v-model="selectedReceiverIdsModel"
          multiple
          :options="receiverOptions"
          use-chips
          filled
          emit-value
          map-options
          use-input
          input-debounce="250"
          :loading="memberSearchLoading"
          @filter="filterMemberOptions"
          class="w-full"
        />
        <q-select
          v-else
          v-model="selectedReceiverIdsModel"
          multiple
          :options="receiverOptions"
          use-chips
          filled
          emit-value
          map-options
          class="w-full"
        />
      </template>
    </q-field>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { getMemberQuotaMemberSearch } from "@/api/member"
  import { MessageNotificationTargetType, type Response } from "@/api/messageManagement"
  import { useMemberLevelDropdownOptions, useMemberTagDropdownOptions } from "@/query/dropdown"

  const props = withDefaults(
    defineProps<{
      isReadonly: boolean
      targetType: MessageNotificationTargetType
      message: Response.MessageNotificationBase | Response.MessageNotificationDetail
      selectedReceiverIds?: number[]
    }>(),
    {
      selectedReceiverIds: () => []
    }
  )

  const emit = defineEmits<{
    (e: "update:selectedReceiverIds", value: number[]): void
  }>()

  const { t } = useI18n()
  const { options: memberLevelOptions } = useMemberLevelDropdownOptions()
  const { options: memberTagOptions } = useMemberTagDropdownOptions()

  const readonlyMemberReceiverOptions = computed(() =>
    "members" in props.message
      ? (props.message.members || []).map((item) => ({
          label: item.account,
          value: item.id
        }))
      : []
  )
  const memberSearchLoading = ref(false)
  const memberSearchOptions = ref<{ label: string; value: number }[]>([])
  const memberOptionLabelMap = ref<Record<number, string>>({})

  const memberReceiverOptions = computed(() => {
    if (props.isReadonly) return readonlyMemberReceiverOptions.value

    const selectedIds = Array.isArray(props.selectedReceiverIds) ? props.selectedReceiverIds : []
    const selectedOptions = selectedIds.map((id) => ({
      value: id,
      label: memberOptionLabelMap.value[id] || String(id)
    }))
    return [...selectedOptions, ...memberSearchOptions.value].filter(
      (item, index, arr) => arr.findIndex((e) => e.value === item.value) === index
    )
  })
  const levelReadonlyOptions = computed(() =>
    "levels" in props.message
      ? (props.message.levels || []).map((item) => ({
          label: item.name,
          value: item.id
        }))
      : []
  )
  const levelReceiverOptions = computed(() =>
    props.isReadonly ? levelReadonlyOptions.value : memberLevelOptions.value
  )
  const tagReadonlyOptions = computed(() =>
    "tags" in props.message
      ? (props.message.tags || []).map((item) => ({
          label: item.name,
          value: item.id
        }))
      : []
  )
  const tagReceiverOptions = computed(() => (props.isReadonly ? tagReadonlyOptions.value : memberTagOptions.value))

  const selectedMemberValues = computed(() => memberReceiverOptions.value.map((item) => item.value))
  const selectedLevelValues = computed(() => levelReceiverOptions.value.map((item) => item.value))
  const selectedTagValues = computed(() => tagReceiverOptions.value.map((item) => item.value))

  const targetReceiverConfigMap = computed(() => ({
    [MessageNotificationTargetType.SPECIFIC_MEMBERS]: {
      label: t("message_notification.target_type.specific_members"),
      options: memberReceiverOptions.value,
      readonlyValues: selectedMemberValues.value
    },
    [MessageNotificationTargetType.MEMBER_LEVEL]: {
      label: t("message_notification.target_type.member_level"),
      options: levelReceiverOptions.value,
      readonlyValues: selectedLevelValues.value
    },
    [MessageNotificationTargetType.MEMBER_TAG]: {
      label: t("message_notification.target_type.member_tag"),
      options: tagReceiverOptions.value,
      readonlyValues: selectedTagValues.value
    }
  }))

  const currentTargetReceiverConfig = computed(
    () => targetReceiverConfigMap.value[props.targetType as keyof typeof targetReceiverConfigMap.value]
  )

  const receiverLabel = computed(() => currentTargetReceiverConfig.value?.label || "")
  const receiverOptions = computed(() => currentTargetReceiverConfig.value?.options || [])
  const selectedReceiverValues = computed(() => currentTargetReceiverConfig.value?.readonlyValues || [])

  const isCheckboxTarget = computed(
    () =>
      props.targetType === MessageNotificationTargetType.MEMBER_LEVEL ||
      props.targetType === MessageNotificationTargetType.MEMBER_TAG
  )
  const isSpecificMemberTarget = computed(() => props.targetType === MessageNotificationTargetType.SPECIFIC_MEMBERS)
  const showCheckboxActions = computed(() => !props.isReadonly && isCheckboxTarget.value)
  const receiverRules = computed(() => {
    const shouldRequired =
      !props.isReadonly &&
      (props.targetType === MessageNotificationTargetType.SPECIFIC_MEMBERS ||
        props.targetType === MessageNotificationTargetType.MEMBER_LEVEL ||
        props.targetType === MessageNotificationTargetType.MEMBER_TAG)
    if (!shouldRequired) return []
    return [
      (value: number[] | undefined) =>
        Array.isArray(value) && value.length > 0 ? true : t("common.validate.mustNotBeEmpty")
    ]
  })

  const selectedReceiverIdsModel = computed({
    get: () => props.selectedReceiverIds,
    set: (value: number[]) => emit("update:selectedReceiverIds", value)
  })

  const onSelectAll = () => {
    selectedReceiverIdsModel.value = receiverOptions.value
      .map((item) => Number(item.value))
      .filter((v) => !Number.isNaN(v))
  }
  const onClearSelected = () => {
    selectedReceiverIdsModel.value = []
  }

  const filterMemberOptions = async (keyword: string, update: (callbackFn: () => void) => void, abort: () => void) => {
    if (!isSpecificMemberTarget.value) {
      abort()
      return
    }
    memberSearchLoading.value = true
    try {
      const query = keyword.trim()
      const res = await getMemberQuotaMemberSearch({
        account: query ? `${query}%` : "%",
        offset: 0,
        size: 100
      })
      const list = Array.isArray(res?.data?.list)
        ? res.data.list.map((item) => ({
            label: item.account,
            value: item.id
          }))
        : []
      update(() => {
        memberSearchOptions.value = list
        list.forEach((item) => {
          memberOptionLabelMap.value[item.value] = item.label
        })
      })
    } catch (error) {
      console.error("search member account failed:", error)
      update(() => {
        memberSearchOptions.value = []
      })
    } finally {
      memberSearchLoading.value = false
    }
  }
</script>
