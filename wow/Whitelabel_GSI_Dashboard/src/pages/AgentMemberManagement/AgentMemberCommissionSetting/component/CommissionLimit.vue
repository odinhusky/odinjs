<template>
  <div>
    <q-card-section class="q-pb-xs">
      <div class="text-subtitle2 text-bold">{{ $t("edit_form.single_commission_limit") }}</div>

      <q-markup-table square separator="none">
        <thead class="bg-success">
          <tr>
            <th v-for="item in form.commission_limit_data" :key="item.currency">{{ item.currency }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="item in form.commission_limit_data" :key="item.currency">
              <q-number
                v-model="item.amount"
                :placeholder="$t('common.no_statistics')"
                :options="optionsLimit"
                dense
                borderless
                square
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect } from "vue"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { getCurrencyList } from "@/api/common"
  import { LANGUAGE_TYPE, CURRENCY_TYPE } from "@/utils/constants"

  const languageStore = useLanguageStore()
  const store = useAgentCommissionStore()
  const { commissionItem: form } = storeToRefs(store)

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: 0
  }
  const optionsLimit = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const optionsParcent = {
    suffix: "%",
    min: 0,
    max: 100,
    minimumFractionDigits: "0",
    nullValue: 0
  }
  const checkCurreny = ref<CURRENCY_TYPE.Enums[]>([])
  type CurrencyList = { [currency: string]: number }
  const currencyList = ref<CurrencyList>({})

  onMounted(async () => {
    const { data } = await getCurrencyList()

    checkCurreny.value = Object.keys(data) as any as CURRENCY_TYPE.Enums[]

    currencyList.value = data

    if (form.value.commission_limit_data.length === 0) {
      checkCurreny.value.forEach((currency) => {
        const rewardObj = {
          currency: currency,
          amount: ""
        }
        form.value.commission_limit_data.push(rewardObj)
      })
    }

    //編輯
    if (form.value.commission_limit.length > 0) {
      for (let i = 0; i < form.value.commission_limit.length; i++) {
        const commission_limit = form.value.commission_limit[i]

        for (let j = 0; j < form.value.commission_limit_data.length; j++) {
          const commission_limit_data = form.value.commission_limit_data[j]

          if (commission_limit.currency === commission_limit_data.currency) {
            commission_limit_data.amount = commission_limit.amount
          }
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
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
          padding: 0 !important;
          border-right: none !important;
          border-bottom: 1px solid #666 !important;

          ::v-deep(.q-field__control) {
            &::before {
              border: 0 !important;
            }
            padding-right: 5px;
          }
          ::v-deep(input.q-field__input) {
            text-align: end;
          }
        }
      }
    }
  }
</style>
