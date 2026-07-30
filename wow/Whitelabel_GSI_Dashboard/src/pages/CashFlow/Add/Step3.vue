<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section>
      <span class="q-ml-sm">{{ $t("common.tag_choice") }}</span>
      <div class="row q-col-gutter-md q-pt-xs">
        <div class="col-12">
          <SelectAllOptionGroup
            :parent-value="form.blockDepositTags"
            :group-options="depositTags"
            :select-all-label="$t('member_tag_type.deposit')"
            @update:parentValue="handelBlockDepositTags"
          />
          <SelectAllOptionGroup
            :parent-value="form.blockWithdrawalTags"
            :group-options="withdrawalTags"
            :select-all-label="$t('member_tag_type.withdraw')"
            @update:parentValue="handelBlockWithDrawalTags"
          />
          <SelectAllOptionGroup
            :parent-value="form.blockPromotionTags"
            :group-options="promotionTags"
            :select-all-label="$t('member_tag_type.promotion')"
            @update:parentValue="handelBlockPromotionTags"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color" class="q-px-xl" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, computed } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useI18n } from "vue-i18n"

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()

  const form = reactive({ blockDepositTags: [], blockWithdrawalTags: [], blockPromotionTags: [] })
  onMounted(() => {})
  const depositTags = computed(() => [
    { label: t("block_dispatch_tag.deposit_prohibited"), value: 0 },
    { label: t("block_dispatch_tag.deposit_prohibited_apay"), value: 1 },
    { label: t("block_dispatch_tag.deposit_prohibited_gcash"), value: 2 },
    { label: t("block_dispatch_tag.deposit_prohibited_help2"), value: 3 }
  ])
  const withdrawalTags = computed(() => [
    { label: t("block_dispatch_tag.withdrawal_prohibited"), value: 0 },
    { label: t("block_dispatch_tag.withdrawals_prohibited_bank_card"), value: 1 },
    { label: t("block_dispatch_tag.withdrawals_prohibited_gcash"), value: 2 },
    { label: t("block_dispatch_tag.withdrawals_prohibited_help2"), value: 3 }
  ])
  const promotionTags = computed(() => [
    { label: t("block_dispatch_tag.distribution_prohibited_rebate"), value: 0 },
    { label: t("block_dispatch_tag.distribution_prohibited_referral"), value: 1 },
    { label: t("block_dispatch_tag.distribution_prohibited_promotions"), value: 2 },
    { label: t("block_dispatch_tag.distribution_prohibited_vip_upgrade"), value: 3 },
    { label: t("block_dispatch_tag.distribution_prohibited_relief_funds"), value: 4 }
  ])
  const handelBlockDepositTags = (value: []) => {
    form.blockDepositTags = value
  }
  const handelBlockWithDrawalTags = (value: []) => {
    form.blockWithdrawalTags = value
  }
  const handelBlockPromotionTags = (value: []) => {
    form.blockPromotionTags = value
  }
  function onSubmit() {
    // 檢查欄位規則，不符合則return掉

    nextPrevStep(true)
  }
</script>

<style lang="scss" scoped>
  .add_card {
    width: 1100px;
    margin: 0 auto;
  }
</style>
