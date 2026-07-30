<template>
  <q-card-section
    class="q-pa-md q-ma-md rounded-borders activity-info"
    style="background-color: #fcf8ff"
    v-if="form.event_type !== EVENT_TYPE.Enums.CustomizeBonus && (bankCardTags.length || electronicWalletTags.length || ExternalChannelTags.length || cryptoWalletTags.length || cryptoWalletThirdTags.length)"
  >
    <!-- 入款方式 -->
    <SelectAllOptionGroup
      v-if="bankCardTags.length"
      :parentValue="form.bankCardTags"
      :group-options="bankCardTags"
      @update:parentValue="handelBankCardTags"
      :selectAllLabel="$t('table_header.bank_card')"
      :title="$t('edit_form.deposit_method')"
      :itemButtonStyle="itemButtonStyle"
    />
    <SelectAllOptionGroup
      v-if="electronicWalletTags.length"
      :parentValue="form.electronicWallet"
      :group-options="electronicWalletTags"
      @update:parentValue="handelElectronicWalletTags"
      :selectAllLabel="$t('table_header.third_party_payment')"
      :itemButtonStyle="itemButtonStyle"
    />
    <SelectAllOptionGroup
      v-if="ExternalChannelTags.length"
      :parentValue="form.ExternalChannelTags"
      :group-options="ExternalChannelTags"
      @update:parentValue="handelExternalChannelTags"
      :selectAllLabel="$t('fund_method_type.external_channel_transfer')"
      :itemButtonStyle="itemButtonStyle"
    />

    <SelectAllOptionGroup
      v-if="cryptoWalletTags.length"
      :parentValue="form.cryptoWalletTags"
      :group-options="cryptoWalletTags"
      @update:parentValue="handelCryptoWalletTags"
      :selectAllLabel="$t('fund_method_type.crypto_wallet_trans')"
      :itemButtonStyle="itemButtonStyle"
    />

    <SelectAllOptionGroup
      v-if="cryptoWalletThirdTags.length"
      :parentValue="form.cryptoWalletThirdTags"
      :group-options="cryptoWalletThirdTags"
      @update:parentValue="handelCryptoWalletThirdTags"
      :selectAllLabel="$t('fund_method_type.crypto_wallet_third')"
      :itemButtonStyle="itemButtonStyle"
    />

    <!-- <SelectAllOptionGroup
      :parentValue="form.thirdPayment"
      :group-options="thirdPaymentTags"
      @update:parentValue="handelThirdPaymentTags"
      :selectAllLabel="$t('table_header.third_party_payment')"
      :itemButtonStyle="itemButtonStyle"
    /> -->
  </q-card-section>
</template>

<script lang="ts" setup>
  import { computed, watch, ref, onMounted } from "vue"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { EVENT_TYPE, FUND_METHOD_TYPE } from "@/utils/constants"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import type * as Request from "@/api/request.type"

  const props = defineProps({
    itemButtonStyle: {
      type: Boolean,
      required: false,
      default: false
    }
  })
  const { t } = useI18n()
  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)

  const mapFilteredGatewayList = (type: number) => {
    return (form.value.filteredGatewayList || [])
      .filter((item) => item.type === type)
      .map((item) => ({
        label: item.name,
        value: item.id
      }))
  }

  const bankCardTags = computed(() => mapFilteredGatewayList(FUND_METHOD_TYPE.Enums.MoneyTransfer))

  const electronicWalletTags = computed(() => mapFilteredGatewayList(FUND_METHOD_TYPE.Enums.ThirdPartyPayment))

  const ExternalChannelTags = computed(() => mapFilteredGatewayList(FUND_METHOD_TYPE.Enums.ExternalChannelTransfer))

  const cryptoWalletTags = computed(() => mapFilteredGatewayList(FUND_METHOD_TYPE.Enums.CryptoWallet))

  const cryptoWalletThirdTags = computed(() => mapFilteredGatewayList(FUND_METHOD_TYPE.Enums.CryptoWalletThird))

  const handelBankCardTags = (value: number[]) => {
    form.value.bankCardTags = value
    handelMergeTags()
  }

  const handelElectronicWalletTags = (value: number[]) => {
    form.value.electronicWallet = value
    handelMergeTags()
  }

  const handelExternalChannelTags = (value: number[]) => {
    form.value.ExternalChannelTags = value
    handelMergeTags()
  }

  const handelCryptoWalletTags = (value: number[]) => {
    form.value.cryptoWalletTags = value
    handelMergeTags()
  }

  const handelCryptoWalletThirdTags = (value: number[]) => {
    form.value.cryptoWalletThirdTags = value
    handelMergeTags()
  }
  //把勾選的合併起來
  const handelMergeTags = () => {
    const bankCardTags = Array.isArray(form.value.bankCardTags) ? form.value.bankCardTags : []
    const electronicWallet = Array.isArray(form.value.electronicWallet) ? form.value.electronicWallet : []
    const ExternalChannelTags = Array.isArray(form.value.ExternalChannelTags) ? form.value.ExternalChannelTags : []
    const cryptoWalletTags = Array.isArray(form.value.cryptoWalletTags) ? form.value.cryptoWalletTags : []
    const cryptoWalletThirdTags = Array.isArray(form.value.cryptoWalletThirdTags)
      ? form.value.cryptoWalletThirdTags
      : []

    const mergedTags = [
      ...bankCardTags,
      ...electronicWallet,
      ...ExternalChannelTags,
      ...cryptoWalletTags,
      ...cryptoWalletThirdTags
    ]
    form.value.payment_gateway = mergedTags
  }

  // 初始化已選擇的標籤
  const initializeTags = () => {
    if (Array.isArray(form.value.payment_gateway) && Array.isArray(form.value.filteredGatewayList)) {
      form.value.bankCardTags = []
      form.value.electronicWallet = []
      form.value.ExternalChannelTags = []
      form.value.cryptoWalletTags = []
      form.value.cryptoWalletThirdTags = []
      form.value.payment_gateway.forEach((id: number) => {
        if (Array.isArray(form.value.filteredGatewayList)) {
          const tag = form.value.filteredGatewayList.find((item: Request.promotionGatewayItem) => item.id === id)
          if (tag) {
            if (tag.type === FUND_METHOD_TYPE.Enums.MoneyTransfer) {
              if (Array.isArray(form.value.bankCardTags)) {
                form.value.bankCardTags.push(id)
              }
            } else if (tag.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment) {
              if (Array.isArray(form.value.electronicWallet)) {
                form.value.electronicWallet.push(id)
              }
            } else if (tag.type === FUND_METHOD_TYPE.Enums.ExternalChannelTransfer) {
              if (Array.isArray(form.value.ExternalChannelTags)) {
                form.value.ExternalChannelTags.push(id)
              }
            } else if (tag.type === FUND_METHOD_TYPE.Enums.CryptoWallet) {
              if (Array.isArray(form.value.cryptoWalletTags)) {
                form.value.cryptoWalletTags.push(id)
              }
            } else if (tag.type === FUND_METHOD_TYPE.Enums.CryptoWalletThird) {
              if (Array.isArray(form.value.cryptoWalletThirdTags)) {
                form.value.cryptoWalletThirdTags.push(id)
              }
            }
          }
        }
      })
    }
  }

  watch(
    () => form.value.filteredGatewayList,
    (newValue) => {
      // if (Array.isArray(newValue) && newValue.length) {
      initializeTags()
      // }
    }
  )

  onMounted(() => {
    if (Array.isArray(form.value.filteredGatewayList) && form.value.filteredGatewayList.length) {
      initializeTags()
    }
  })
</script>

<style lang="scss" scoped></style>
