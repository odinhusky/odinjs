<template>
  <div>
    <q-card-section class="q-pb-xs">
      <div class="text-subtitle2 text-bold">{{ $t("edit_form.rebate_ratio") }}</div>

      <q-markup-table square separator="none">
        <thead class="bg-success">
          <tr>
            <th v-for="item in form.currency_limit_data" :key="item.currency">{{ item.currency }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="item in form.currency_limit_data" :key="item.currency">
              <q-input
                type="number"
                v-model="item.limit"
                dense
                borderless
                square
                :disable="readOnly"
                @focus="handleFocus(item)"
                @blur="handleBlur(item)"
                @change="handleInput(item)"
              >
                <template v-slot:append> % </template>
              </q-input>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted } from "vue"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"

  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"

  import { getCurrencyList } from "@/api/common"
  import { CURRENCY_TYPE } from "@/utils/constants"

  const props = defineProps({
    readOnly: {
      type: [Boolean],
      required: false,
      default: () => false
    }
  })

  const languageStore = useLanguageStore()
  const store = useAgentCommissionStore()
  const { commissionItem: form } = storeToRefs(store)

  const checkCurreny = ref<CURRENCY_TYPE.Enums[]>([])
  type CurrencyList = { [currency: string]: number }
  const currencyList = ref<CurrencyList>({})

  const updateRebateRatio = async () => {
    const { data } = await getCurrencyList()

    checkCurreny.value = Object.keys(data) as any as CURRENCY_TYPE.Enums[]
    currencyList.value = data

    if (form.value.currency_limit_data.length === 0) {
      Object.entries(currencyList.value).forEach(([currency, currency_id]) => {
        const rewardObj = {
          currency: currency,
          currency_id: currency_id,
          limit: 0
        }

        form.value.currency_limit_data.push(rewardObj)
      })
    }

    //編輯
    if (form.value.currency_limit.length > 0) {
      for (let i = 0; i < form.value.currency_limit.length; i++) {
        const currency_limit = form.value.currency_limit[i]

        for (let j = 0; j < form.value.currency_limit_data.length; j++) {
          const currency_limit_data = form.value.currency_limit_data[j]

          if (currency_limit.currency_id === currency_limit_data.currency_id) {
            currency_limit_data.limit = currency_limit.limit
          }
        }
      }
    }
  }
  interface CurrencyLimitData {
    currency: number | string
    currency_id: number | string
    limit: number | string
  }
  const handleFocus = (item: CurrencyLimitData) => {
    const limit = typeof item.limit === "string" ? parseFloat(item.limit) : item.limit
    if (limit === 0) {
      item.limit = ""
    }
  }

  const handleBlur = (item: CurrencyLimitData) => {
    if (item.limit === "") {
      item.limit = 0
    }
  }
  const handleInput = (item: CurrencyLimitData) => {
    const limit = typeof item.limit === "string" ? parseFloat(item.limit) : item.limit

    item.limit = limit < 0 ? 0 : limit > 100 ? 100 : limit
  }
  onMounted(async () => {
    await updateRebateRatio()
  })

  watch(
    () => form.value.currency_limit_data,
    async () => {
      await updateRebateRatio()
    },
    { immediate: true }
  )
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
    overflow-x: auto;
    thead {
      tr {
        th {
          border: none !important;
          text-align: end;
          padding: 0;
          padding-right: 5px;
        }
      }
    }

    tbody {
      tr {
        &:hover {
          background-color: #fff !important;
        }
        background-color: #fff !important;
        td {
          min-width: 80px;
          padding: 0 !important;
          border-right: none !important;
          border-bottom: 1px solid #666 !important;

          ::v-deep(.q-field__control) {
            &::before {
              border: 0 !important;
            }
            //padding-right: 5px;
          }
          ::v-deep(.q-field__native) {
            text-align: end;
            padding: 0px;
          }

          ::v-deep(.q-field__marginal) {
            font-size: 16px;
            color: black;
            padding: 0px;
          }
          /*::v-deep(input.q-field__input) {

          }*/
        }
      }
    }
  }
</style>
