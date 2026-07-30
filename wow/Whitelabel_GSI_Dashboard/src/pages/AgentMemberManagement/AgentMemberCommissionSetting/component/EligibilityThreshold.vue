<template>
  <div>
    <q-card-section class="q-pb-xs">
      <div class="text-subtitle2 text-bold q-mb-sm">{{ $t("edit_form.calculation_threshold") }}</div>

      <!-- 會員存款金額條件 -->
      <div class="row items-center q-mb-xs">
        <div class="text-bold q-mr-md">{{ $t("edit_form.member_deposit_condition") }}</div>
        <q-radio
          v-model="form.eligibility.deposit.mode"
          val="accumulated"
          :label="$t('edit_form.eligibility_mode_accumulated')"
          :disable="readOnly"
        />
        <q-radio
          v-model="form.eligibility.deposit.mode"
          val="single"
          :label="$t('edit_form.eligibility_mode_single')"
          :disable="readOnly"
        />
      </div>

      <q-markup-table square separator="none" class="threshold-table">
        <thead class="bg-success">
          <tr>
            <th v-for="item in currencyEntries" :key="item.currency">{{ item.currency }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="item in currencyEntries" :key="item.currency">
              <q-input
                type="number"
                v-model="form.eligibility.deposit.currency_threshold[item.currency_id]"
                dense
                borderless
                square
                :disable="readOnly"
                @focus="handleFocus(form.eligibility.deposit.currency_threshold, item.currency_id)"
                @blur="handleBlur(form.eligibility.deposit.currency_threshold, item.currency_id)"
                @change="handleInput(form.eligibility.deposit.currency_threshold, item.currency_id)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- 會員有效投注額條件 -->
      <div class="text-bold q-mt-md q-mb-xs">{{ $t("edit_form.member_valid_bet_condition") }}</div>
      <q-markup-table square separator="none" class="threshold-table">
        <thead class="bg-success">
          <tr>
            <th v-for="item in currencyEntries" :key="item.currency">{{ item.currency }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="item in currencyEntries" :key="item.currency">
              <q-input
                type="number"
                v-model="form.eligibility.valid_bet_amount.currency_threshold[item.currency_id]"
                dense
                borderless
                square
                :disable="readOnly"
                @focus="handleFocus(form.eligibility.valid_bet_amount.currency_threshold, item.currency_id)"
                @blur="handleBlur(form.eligibility.valid_bet_amount.currency_threshold, item.currency_id)"
                @change="handleInput(form.eligibility.valid_bet_amount.currency_threshold, item.currency_id)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="text-caption text-grey-8 q-mt-sm">
        {{ $t("edit_form.eligibility_threshold_tip") }}
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import { getCurrencyList } from "@/api/common"

  defineProps({
    readOnly: {
      type: Boolean,
      required: false,
      default: () => false
    }
  })

  const store = useAgentCommissionStore()
  const { commissionItem: form } = storeToRefs(store)

  type CurrencyEntry = { currency: string; currency_id: string }
  const currencyEntries = ref<CurrencyEntry[]>([])

  const ensureEligibility = () => {
    if (!form.value.eligibility) {
      form.value.eligibility = {
        deposit: { mode: "accumulated", currency_threshold: {} },
        valid_bet_amount: { currency_threshold: {} }
      }
    }
  }

  const initThresholds = async () => {
    ensureEligibility()
    const { data } = await getCurrencyList()
    currencyEntries.value = Object.entries(data).map(([currency, currency_id]) => ({
      currency,
      currency_id: String(currency_id)
    }))

    currencyEntries.value.forEach(({ currency_id }) => {
      if (form.value.eligibility.deposit.currency_threshold[currency_id] === undefined) {
        form.value.eligibility.deposit.currency_threshold[currency_id] = "0"
      }
      if (form.value.eligibility.valid_bet_amount.currency_threshold[currency_id] === undefined) {
        form.value.eligibility.valid_bet_amount.currency_threshold[currency_id] = "0"
      }
    })
  }

  const handleFocus = (target: { [key: string]: string }, key: string) => {
    if (Number(target[key]) === 0) target[key] = ""
  }

  const handleBlur = (target: { [key: string]: string }, key: string) => {
    if (target[key] === "" || target[key] === null || target[key] === undefined) target[key] = "0"
  }

  const handleInput = (target: { [key: string]: string }, key: string) => {
    const num = Number(target[key])
    target[key] = isNaN(num) || num < 0 ? "0" : String(num)
  }

  onMounted(async () => {
    await initThresholds()
  })
</script>

<style lang="scss" scoped>
  .threshold-table.q-table__container {
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
          }
          ::v-deep(.q-field__native) {
            text-align: end;
            padding: 0px;
          }
        }
      }
    }
  }
</style>
