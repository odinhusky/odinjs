<template>
  <div>
    <SelectAllOptionGroup
      v-if="depositTags.length > 0"
      :parent-value="blockDepositTags"
      :group-options="depositTags"
      :select-all-label="$t('member_tag_type.deposit')"
      @update:parentValue="handelBlockDepositTags"
    />
    <SelectAllOptionGroup
      v-if="withdrawalTags.length > 0"
      :parent-value="blockWithdrawalTags"
      :group-options="withdrawalTags"
      :select-all-label="$t('member_tag_type.withdraw')"
      @update:parentValue="handelBlockWithDrawalTags"
    />
    <SelectAllOptionGroup
      v-if="promotionTags.length > 0"
      :parent-value="blockPromotionTags"
      :group-options="promotionTags"
      :select-all-label="$t('member_tag_type.promotion')"
      @update:parentValue="handelBlockPromotionTags"
    />
    <SelectAllOptionGroup
      v-if="betTags.length > 0"
      :parent-value="blockBetTags"
      :group-options="betTags"
      :select-all-label="$t('member_tag_type.betting')"
      @update:parentValue="handelBlockBetTags"
    />
    <SelectAllOptionGroup
      v-if="otherTags.length > 0"
      :parent-value="blockOtherTags"
      :group-options="otherTags"
      :select-all-label="$t('member_tag_type.other')"
      @update:parentValue="handelBlockOtherTags"
    />
    <SelectAllOptionGroup
      v-if="aiTags.length > 0"
      :parent-value="blockAiTags"
      :group-options="aiTags"
      :select-all-label="$t('member_tag_type.ai')"
      @update:parentValue="handelBlockAiTags"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, toRefs, defineEmits, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useMemberTagDropdownQuery } from "@/query/dropdown"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"

  const props = defineProps({
    parentValue: {
      type: Array as () => number[],
      required: true,
      default: () => []
    }
  })
  interface TagItem {
    type: number
    name: string
    id: number
    enabled?: boolean
  }
  const { parentValue } = toRefs(props)
  //const groupValue = ref(parentValue.value)

  interface Tag {
    label: string
    value: number
  }
  const { t } = useI18n()
  const { data: memberTagData } = useMemberTagDropdownQuery()
  const enabledTagItems = computed<TagItem[]>(() =>
    (memberTagData.value || []).filter((item: TagItem) => item.enabled === true)
  )
  const depositTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 1).map((item) => ({ label: item.name, value: item.id }))
  )
  const withdrawalTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 2).map((item) => ({ label: item.name, value: item.id }))
  )
  const promotionTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 3).map((item) => ({ label: item.name, value: item.id }))
  )
  const betTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 4).map((item) => ({ label: item.name, value: item.id }))
  )
  const otherTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 5).map((item) => ({ label: item.name, value: item.id }))
  )
  const aiTags = computed<Tag[]>(() =>
    enabledTagItems.value.filter((item) => item.type === 6).map((item) => ({ label: item.name, value: item.id }))
  )

  //記錄勾選的tag
  const blockDepositTags = ref<number[]>([])
  const blockWithdrawalTags = ref<number[]>([])
  const blockPromotionTags = ref<number[]>([])
  const blockBetTags = ref<number[]>([])
  const blockOtherTags = ref<number[]>([])
  const blockAiTags = ref<number[]>([])

  watch(
    [enabledTagItems, parentValue],
    ([items, selectedIds]) => {
      blockDepositTags.value = []
      blockWithdrawalTags.value = []
      blockPromotionTags.value = []
      blockBetTags.value = []
      blockOtherTags.value = []
      blockAiTags.value = []
      ;(selectedIds || []).forEach((id) => {
        const matchedTag = items.find((item) => item.id === id)
        if (!matchedTag) return
        if (matchedTag.type === 1) blockDepositTags.value.push(id)
        if (matchedTag.type === 2) blockWithdrawalTags.value.push(id)
        if (matchedTag.type === 3) blockPromotionTags.value.push(id)
        if (matchedTag.type === 4) blockBetTags.value.push(id)
        if (matchedTag.type === 5) blockOtherTags.value.push(id)
        if (matchedTag.type === 6) blockAiTags.value.push(id)
      })
    },
    { immediate: true }
  )
  const emit = defineEmits(["update:labelValue"])

  const handelBlockDepositTags = (value: []) => {
    blockDepositTags.value = value
    handelMergeTags()
  }
  const handelBlockWithDrawalTags = (value: []) => {
    blockWithdrawalTags.value = value
    handelMergeTags()
  }
  const handelBlockPromotionTags = (value: []) => {
    blockPromotionTags.value = value
    handelMergeTags()
  }
  const handelBlockBetTags = (value: []) => {
    blockBetTags.value = value
    handelMergeTags()
  }
  const handelBlockOtherTags = (value: []) => {
    blockOtherTags.value = value
    handelMergeTags()
  }
  const handelBlockAiTags = (value: []) => {
    blockAiTags.value = value
    handelMergeTags()
  }
  //把勾選的合併起來
  const handelMergeTags = () => {
    const mergedTags = [
      ...blockDepositTags.value,
      ...blockWithdrawalTags.value,
      ...blockPromotionTags.value,
      ...blockBetTags.value,
      ...blockOtherTags.value,
      ...blockAiTags.value
    ]
    emit("update:labelValue", mergedTags)
  }
</script>
