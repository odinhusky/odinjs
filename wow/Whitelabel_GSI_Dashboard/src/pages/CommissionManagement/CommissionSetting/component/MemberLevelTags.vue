<template>
  <div>
    <SelectAllOptionGroup
      :parentValue="parentValue"
      :group-options="options"
      @update:parentValue="handelMemberLevelTags"
      :is-column="isColumn"
    />
  </div>
</template>

<script lang="ts" setup>
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useMemberLevelDropdownOptions } from "@/query/dropdown"

  const props = defineProps({
    parentValue: {
      type: Array<any>,
      required: true,
      default: () => ({})
    },
    isColumn: {
      type: Boolean,
      default: false
    }
  })
  const { options } = useMemberLevelDropdownOptions()

  const emit = defineEmits(["update:parentValue"])
  const handelMemberLevelTags = (value: number[]) => {
    emit("update:parentValue", value)
  }
</script>

<style lang="scss" scoped></style>
