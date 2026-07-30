<template>
  <q-card-section class="q-pb-xs">
    <!-- 派發會員層級 -->
    <SelectAllOptionGroup
      :parentValue="parentValue"
      :group-options="options"
      @update:parentValue="handelMemberLevelTags"
      :title="$t('common.distribute_membership_levels')"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useMemberLevelDropdownOptions } from "@/query/dropdown"

  const props = defineProps({
    parentValue: {
      type: Array<any>,
      required: true,
      default: () => ({})
    }
  })
  const { options } = useMemberLevelDropdownOptions()

  const emit = defineEmits(["update:parentValue"])
  const handelMemberLevelTags = (value: number[]) => {
    emit("update:parentValue", value)
  }
</script>

<style lang="scss" scoped></style>
