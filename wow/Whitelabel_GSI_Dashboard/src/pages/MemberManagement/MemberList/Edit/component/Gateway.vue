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
  import { EVENT_TYPE, FUND_METHOD_TYPE } from "@/utils/constants"
  import type * as Request from "@/api/request.type"
  import { getGatewayList } from "@/api/promotion"
  const test = 0
  const props = defineProps({
    currency: {
      type: Number,
      required: true,
      default: 0
    },
    type: {
      type: Number,
      required: true,
      default: 0
    },
    selectedOption: {
      type: Number,
      required: true,
      default: 0
    }
  })
  const { t } = useI18n()

  const optionDate = computed(() => mapFilteredGatewayList(props.type))
  const selectedOptionComputed = computed({
    get: () => props.selectedOption,
    set: (value) => emit("update:parentValue", value)
  })
  const displayLabel = computed(() => {
    if (selectedOptionComputed.value === 0) {
      return t("table_header.please_select")
    }
    const selected = optionDate.value.find((item) => item.value === selectedOptionComputed.value)
    return selected ? selected.label : selectedOptionComputed.value
  })
  const gatewayList = ref<Request.promotionGatewayItem[]>([])
  const filteredGatewayList = ref<Request.promotionGatewayItem[]>([])

  const updateFilteredGatewayList = () => {
    filteredGatewayList.value = []
    filteredGatewayList.value = gatewayList.value.filter(
      (item) => item.currency === props.currency && item.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment
    )
  }
  const mapFilteredGatewayList = (type: number) => {
    return (filteredGatewayList.value || [])
      .filter((item) => item.type === type)
      .map((item) => ({
        label: item.name,
        value: item.id
      }))
  }

  watch(optionDate, (newOptions) => {
    if (newOptions.length > 0) {
      //emit("update:parentValue", newOptions[0].value)
    } else {
      emit("update:parentValue", 0)
    }
  })
  watch(
    () => props.currency,
    (newValue) => {
      console.log("props.currency" + props.currency)
      selectedOptionComputed.value = 0
      updateFilteredGatewayList()
    }
  )

  const emit = defineEmits(["update:parentValue"])

  onMounted(async () => {
    const params = { display: true }
    const { data } = await getGatewayList(params)
    if (data.list.length) {
      gatewayList.value = data.list
      updateFilteredGatewayList()
    }

    /*if (Array.isArray(form.value.filteredGatewayList) && form.value.filteredGatewayList.length) {
      initializeTags()
    }*/
  })
</script>

<style lang="scss" scoped></style>
