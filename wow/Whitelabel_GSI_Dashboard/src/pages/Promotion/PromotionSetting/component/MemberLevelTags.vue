<template>
  <q-card-section
    class="q-pa-md q-ma-md rounded-borders activity-info"
    style="background-color: #fcf8ff"
    v-if="isLoading"
  >
    <!-- 綁定會員層級 -->
    <SelectAllOptionGroup
      :parentValue="form.member_levels"
      :group-options="options"
      @update:parentValue="handelMemberLevelTags"
      :title="$t('edit_form.bind_membership_level')"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { ref } from "vue"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useMemberLevelDropdownOptions } from "@/query/dropdown"

  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)

  const { options } = useMemberLevelDropdownOptions()

  const handelMemberLevelTags = (value: number[]) => {
    form.value.member_levels = value
  }

  const isLoading = ref(false)
  isLoading.value = true
</script>

<style lang="scss" scoped></style>
