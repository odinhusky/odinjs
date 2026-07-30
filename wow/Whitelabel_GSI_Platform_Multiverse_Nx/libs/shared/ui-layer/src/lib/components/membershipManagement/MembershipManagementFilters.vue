<script setup lang="ts">
interface Props {
  isLowerLevelMode: boolean
  memberAccount: string
  recommenderAccount: string
  searchSubordinateMemberAccount: string
  isSearching: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  "update:memberAccount": [string]
  "update:recommenderAccount": [string]
  "update:searchSubordinateMemberAccount": [string]
  search: []
  "add-subordinate": []
}>()

// 對齊 referral：BaseInput 用 classObj 控寬度與高度
const inputClassObj = { root: "!w-[200px] phone:!w-full", input: "!h-10" }
</script>

<template>
  <form
    class="flex w-full items-end gap-2 phone:flex-col phone:items-stretch"
    @submit.prevent="emit('search')"
  >
    <!-- 直屬模式：帳號 + 推薦人 -->
    <template v-if="!isLowerLevelMode">
      <BaseInput
        :model-value="memberAccount"
        label="會員帳號"
        placeholder="請輸入..."
        :class-obj="inputClassObj"
        @update:model-value="emit('update:memberAccount', String($event))"
      />
      <BaseInput
        :model-value="recommenderAccount"
        label="推薦人"
        placeholder="請輸入..."
        :class-obj="inputClassObj"
        @update:model-value="emit('update:recommenderAccount', String($event))"
      />
    </template>

    <!-- 下級模式 -->
    <template v-else>
      <BaseInput
        :model-value="searchSubordinateMemberAccount"
        label="下級會員帳號"
        placeholder="請輸入..."
        :class-obj="inputClassObj"
        @update:model-value="emit('update:searchSubordinateMemberAccount', String($event))"
      />
    </template>

    <BaseBtn theme="secondary" size="lg" :loading="isSearching" class="w-[100px] phone:w-full" @click.prevent="emit('search')">
      搜尋
    </BaseBtn>

    <!-- PC: 新增下級在篩選列右側 -->
    <BaseBtn theme="primary" size="lg" class="ml-auto phone:hidden" @click.prevent="emit('add-subordinate')">
      新增下級
    </BaseBtn>
  </form>
</template>
