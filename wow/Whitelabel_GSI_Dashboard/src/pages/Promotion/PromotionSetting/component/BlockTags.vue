<template>
  <q-card-section
    v-if="
      depositTags.length > 0 ||
      withdrawalTags.length > 0 ||
      promotionTags.length > 0 ||
      betTags.length > 0 ||
      otherTags.length > 0
    "
    class="q-pa-md q-ma-md rounded-borders activity-info"
    style="background-color: #fcf8ff"
  >
    <!-- 阻擋派發標籤 -->
    <SelectAllOptionGroup
      v-if="depositTags.length > 0"
      :parentValue="checkTags.deposit"
      :group-options="depositTags"
      @update:parentValue="handelBlockDepositTags"
      :selectAllLabel="$t('member_tag_type.deposit')"
      :title="$t('edit_form.block_dispatch_tag_title')"
    />
    <SelectAllOptionGroup
      v-if="withdrawalTags.length > 0"
      :parentValue="checkTags.withdrawal"
      :group-options="withdrawalTags"
      @update:parentValue="handelBlockWithDrawalTags"
      :selectAllLabel="$t('member_tag_type.withdraw')"
    />
    <SelectAllOptionGroup
      v-if="promotionTags.length > 0"
      :parentValue="checkTags.promotion"
      :group-options="promotionTags"
      @update:parentValue="handelBlockPromotionTags"
      :selectAllLabel="$t('member_tag_type.promotion')"
    />
    <SelectAllOptionGroup
      v-if="betTags.length > 0"
      :parentValue="checkTags.bet"
      :group-options="betTags"
      @update:parentValue="handelBlockBetTags"
      :selectAllLabel="$t('member_tag_type.betting')"
    />
    <SelectAllOptionGroup
      v-if="otherTags.length > 0"
      :parentValue="checkTags.other"
      :group-options="otherTags"
      @update:parentValue="handelBlockOtherTags"
      :selectAllLabel="$t('member_tag_type.other')"
    />
    <SelectAllOptionGroup
      v-if="aiTags.length > 0"
      :parentValue="checkTags.ai"
      :group-options="aiTags"
      @update:parentValue="handelBlockAiTags"
      :selectAllLabel="$t('member_tag_type.ai')"
    />
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, watch, ref } from "vue"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import { getMemberTags } from "@/api/member"
  import type * as Response from "@/api/response.type"
  import { MEMBER_TAG_TYPE } from "@/utils/constants"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"

  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)

  const checkTags = reactive<{
    deposit: number[]
    withdrawal: number[]
    promotion: number[]
    bet: number[]
    other: number[]
    ai: number[]
  }>({
    deposit: [],
    withdrawal: [],
    promotion: [],
    bet: [],
    other: [],
    ai: []
  })
  const memberTags = reactive<{
    list: Response.MemberTags[]
  }>({ list: [] })

  const depositTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.Deposit)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })
  const withdrawalTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.Withdraw)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })
  const promotionTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.Promotion)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })
  const betTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.Betting)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })

  const otherTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.Other)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })

  const aiTags = computed(() => {
    const tags = memberTags.list.filter((e) => e.type === MEMBER_TAG_TYPE.Enums.AI)
    return tags.map((e) => {
      const label = e.name
      const value = e.id
      return {
        label,
        value
      }
    })
  })

  const handelBlockDepositTags = (value: number[]) => {
    checkTags.deposit = value
  }
  const handelBlockWithDrawalTags = (value: number[]) => {
    checkTags.withdrawal = value
  }
  const handelBlockPromotionTags = (value: number[]) => {
    checkTags.promotion = value
  }
  const handelBlockBetTags = (value: number[]) => {
    checkTags.bet = value
  }
  const handelBlockOtherTags = (value: number[]) => {
    checkTags.other = value
  }
  const handelBlockAiTags = (value: number[]) => {
    checkTags.ai = value
  }

  watch(
    checkTags,
    (newValue) => {
      form.value.block_label_ids = newValue.deposit.concat(
        newValue.withdrawal,
        newValue.promotion,
        newValue.bet,
        newValue.other,
        newValue.ai
      )
    },
    { deep: true }
  )

  onMounted(async () => {
    const payload = {
      enableStatus: true,
      offset: 0,
      size: 10000
    }
    const { data } = await getMemberTags(payload)
    if (!data || !data.list.length) {
      memberTags.list.length = 0
      return
    }
    const enableTags = data.list.filter((e) => e.enabled === true)
    memberTags.list = enableTags
    enableTags.forEach((tag) => {
      if (form.value.block_label_ids.includes(tag.id)) {
        if (tag.type === MEMBER_TAG_TYPE.Enums.Deposit) {
          checkTags.deposit.push(tag.id)
        }
        if (tag.type === MEMBER_TAG_TYPE.Enums.Withdraw) {
          checkTags.withdrawal.push(tag.id)
        }
        if (tag.type === MEMBER_TAG_TYPE.Enums.Promotion) {
          checkTags.promotion.push(tag.id)
        }
        if (tag.type === MEMBER_TAG_TYPE.Enums.Betting) {
          checkTags.bet.push(tag.id)
        }
        if (tag.type === MEMBER_TAG_TYPE.Enums.Other) {
          checkTags.other.push(tag.id)
        }
        if (tag.type === MEMBER_TAG_TYPE.Enums.AI) {
          checkTags.ai.push(tag.id)
        }
      }
    })
  })
</script>

<style lang="scss" scoped></style>
