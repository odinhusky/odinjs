<template>
  <q-select
    v-model="selectedOptionComputed"
    :options="optionDate"
    outlined
    dense
    emit-value
    map-options
    color="primary"
    :display-value="displayLabel"
  />
</template>

<script lang="ts" setup>
  import { computed, watch, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { FUND_METHOD_TYPE } from "@/utils/constants"
  import type * as Request from "@/api/request.type"
  import { getThirdGatewayList } from "@/api/paymentGateway"

  const props = defineProps({
    /** 渠道編號 */
    gateway: {
      type: Number,
      required: true,
      default: 0
    },
    /** 取款方式類型（預設為第三方支付，須搭配渠道編號） */
    paymentTypeId: {
      type: Number,
      required: false,
      default: FUND_METHOD_TYPE.Enums.ThirdPartyPayment
    },
    selectedOption: {
      type: Number,
      required: true,
      default: 0
    }
  })
  const { t } = useI18n()
  const emit = defineEmits(["update:parentValue"])

  const optionDate = computed(() => mapFilteredBankList())

  const selectedOptionComputed = computed({
    get: () => props.selectedOption,
    set: (value) => emit("update:parentValue", value)
  })

  const mapFilteredBankList = () => {
    return (bankList.value || []).map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
  const displayLabel = computed(() => {
    if (selectedOptionComputed.value === 0) {
      return t("table_header.please_select")
    }
    const selected = optionDate.value.find((item) => item.value === selectedOptionComputed.value)
    return selected ? selected.label : selectedOptionComputed.value
  })
  const bankList = ref<Request.promotionGatewayItem[]>([])

  /** 依 payment/gateway/bank 規則組查詢參數 */
  const bankListQuery = computed((): Request.GetThirdGatewayBankQuery | undefined => {
    const gid = props.gateway
    const ptid = props.paymentTypeId

    // 銀行轉帳、虛擬貨幣轉帳：未選渠道時只帶取款類型，勿帶渠道編號
    if (ptid === FUND_METHOD_TYPE.Enums.MoneyTransfer || ptid === FUND_METHOD_TYPE.Enums.CryptoWallet) {
      return { payment_type_id: String(ptid) }
    }
    // 第三方支付及須指定渠道之取款：須已選渠道，帶渠道編號
    if (ptid === FUND_METHOD_TYPE.Enums.ThirdPartyPayment || ptid === FUND_METHOD_TYPE.Enums.CryptoWalletThird) {
      if (gid === 0) return undefined
      return { payment_gateway_id: String(gid) }
    }
    return undefined
  })

  const updateGateway = async () => {
    const query = bankListQuery.value
    if (!query) {
      bankList.value = []
      return
    }
    const { data } = await getThirdGatewayList(query)
    bankList.value = data.list
  }

  watch(optionDate, (newOptions) => {
    /*if (props.selectedOption === 0 && newOptions.length > 0) {
      emit("update:parentValue", newOptions[0].value)
    } else {
      emit("update:parentValue", 0)
    }*/
    /*if (newOptions.length > 0) {
      emit("update:parentValue", newOptions[0].value)
    } else {
      emit("update:parentValue", 0)
    }*/
  })
  watch(bankListQuery, () => {
    updateGateway()
    emit("update:parentValue", 0)
  })

  onMounted(async () => {
    await updateGateway()
  })
</script>

<style lang="scss" scoped></style>
