<template>
  <!-- 優惠金額設定 -->
  <q-card-section class="edit_area_bg p-3 ">
    <div class="text-subtitle2 text-bold">{{ $t("step_tip.betting_thresholds_and_bonuses") }}</div>
    <!-- 固定獎金 -->
    <q-radio
      v-model="form.rewardType"
      :val="PROMOTION_REWARD_TYPE.Enums.FixedAmount"
      :label="$t('edit_form.fixed_bonus')"
    />
    <!-- 比例獎金 -->
    <q-radio
      v-model="form.rewardType"
      :val="PROMOTION_REWARD_TYPE.Enums.Magnification"
      :label="$t('edit_form.percentage_bonus')"
    />
    <q-markup-table no-hover square separator="none" 　class="no-hover">
      <thead class="bg-success">
        <tr>
          <th width="80px"></th>
          <th v-for="item in checkCurreny">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lvData, lvKey) in form.levelData" :key="lvKey">
          <td>LV {{ lvData.level }}</td>
          <td v-for="(item, index) in lvData.currency" :key="item.currency">
            <div class="threshold">
              {{ $t("common.threshold") }} :
              <q-number
                v-model="item.condition"
                dense
                borderless
                square
                :placeholder="$t('common.no_statistics')"
                :options="optionsLimit"
                @update:model-value="handleInput(lvKey, index, 'condition')"
              />
            </div>
            <div class="threshold" v-if="form.rewardType === PROMOTION_REWARD_TYPE.Enums.FixedAmount">
              {{ $t("common.bonus") }} :
              <q-number
                v-model="item.amount"
                dense
                borderless
                square
                :options="optionsLimit"
                :disable="!isAmountEnabled(item.condition, lvKey, index, 'amount')"
                @focus="clearIfZero(lvKey, index, 'amount')"
              />
            </div>
            <div class="threshold" v-else>
              <q-number
                v-model="item.amount"
                :options="optionsParcent"
                dense
                borderless
                square
                :disable="!isAmountEnabled(item.condition, lvKey, index, 'amount')"
                @focus="clearIfZero(lvKey, index, 'amount')"
              >
                <template v-slot:append>%</template>
              </q-number>
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="d-flex q-pt-md q-pb-lg" style="text-align: center">
      <q-btn outline color="main-color" icon="add" align="center" class="q-mr-md add_btn" @click="addLv"> </q-btn>
      <q-btn outline color="red-6" icon="remove" align="center" class="add_btn" @click="minusLv"> </q-btn>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { usePromotionStore } from "@/stores/promotionStore"
  import { computed, onMounted, reactive, ref, watch } from "vue"
  import { storeToRefs } from "pinia"
  import { EVENT_TYPE, CURRENCY_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"
  import { getCurrencyList } from "@/api/common"
  import type * as Request from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store) as any

  const optionsLimit = {
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const optionsParcent = {
    min: 0,
    max: 100,
    minimumFractionDigits: 0,
    nullValue: "0"
  }
  /*const optionsParcent = {
    suffix: "%",
    min: 0,
    max: 100,
    minimumFractionDigits: "0",
    nullValue: "%"
  }*/
  const $q = useQuasar()
  const { t } = useI18n()

  const checkCurreny = ref<CURRENCY_TYPE.Enums[]>([])
  type CurrencyList = { [currency: string]: number }
  const currencyList = ref<CurrencyList>({})

  onMounted(async () => {
    const { data } = await getCurrencyList()

    checkCurreny.value = Object.keys(data) as any as CURRENCY_TYPE.Enums[]

    currencyList.value = data

    let count = 0
    const countedLevels = new Set<number>()
    //如果是編輯頁

    if (form.value.reward.length > 0) {
      form.value.reward.forEach((item: any) => {
        const level = item.level
        if (!countedLevels.has(level)) {
          countedLevels.add(level)
          count++
        }
      })
    } else {
      //預設1筆
      count = 1
    }
    if (form.value.levelData.length === 0) {
      console.log("form.value.levelData", form.value.levelData)
      for (let lv = 1; lv <= count; lv++) {
        const currencies: { currency: string; currency_id: number; condition: string; amount: string }[] = []

        Object.entries(data).forEach(([currency, value]) => {
          const rewardObj = {
            currency: currency,
            currency_id: value,
            condition: "",
            amount: ""
          }
          currencies.push(rewardObj)
        })
        form.value.levelData.push({
          level: lv,
          currency: currencies
        })
      }
    }

    //如果是編輯頁要把資料塞回去顯示在頁面上
    if (form.value.reward.length > 0) {
      form.value.reward.forEach((item: any) => {
        const targetLevel = form.value.levelData.find((setting) => setting.level === item.level)

        if (targetLevel) {
          const targetCurrency = targetLevel.currency.find((currency: any) => currency.currency_id === item.currency_id)
          if (targetCurrency) {
            const condition = item.condition !== "0" ? parseFloat(item.condition) : ""
            const amount = item.amount !== "0" ? parseFloat(item.amount) : ""
            targetCurrency.condition = condition
            targetCurrency.amount = amount
          }
        }
      })
    }
  })

  const addLv = () => {
    const currencies: { currency: string; currency_id: number; condition: string; amount: string }[] = []
    // 内部循环：遍历每个货币
    Object.entries(currencyList.value).forEach(([currency, value]) => {
      // 创建包含货币信息的对象
      const rewardObj = {
        currency: currency,
        currency_id: value,
        condition: "",
        amount: ""
      }

      currencies.push(rewardObj)
    })
    if (!form.value.levelData) {
      form.value.levelData = []
    }

    form.value.levelData.push({
      level: form.value.levelData.length + 1,
      currency: currencies
    })
    console.log(form.value.levelData)
  }
  const minusLv = () => {
    if (form.value.levelData.length > 1) {
      form.value.levelData.pop() // 刪除最後一個 lv 對象
    }
  }
  type CurrencyField = "currency" | "currency_id" | "condition" | "amount"

  const clearIfZero = (lvKey: number, index: number, field: CurrencyField) => {
    let inputValue = form.value.levelData[lvKey].currency[index][field] as number
    if (inputValue <= 0) {
      form.value.levelData[lvKey].currency[index][field] = ""
    }
  }
  const handleInput = (lvKey: number, index: number, field: CurrencyField) => {
    const inputValue = form.value.levelData[lvKey].currency[index][field]
    if (inputValue.trim() !== "") {
      // 遍歷所有等級
      for (let i = 0; i < form.value.levelData.length; i++) {
        if (i !== lvKey) {
          // 比較其他等級的 condition
          const otherCondition = form.value.levelData[i].currency[index].condition

          // 比較當前等級的 condition 值與其他等級的 condition 值
          if (
            (lvKey > i && inputValue < otherCondition) ||
            (lvKey < i && inputValue > otherCondition && otherCondition !== "")
          ) {
            console.log(lvKey + ":" + inputValue + ":" + otherCondition)
            $q.notify({
              color: "green",
              message: t("error_msg.lower_than_the_previous_level"),
              position: "top",
              timeout: 1000
            })
            return // 結束函數執行，防止其他代碼繼續執行
          }
        }
      }
    } else {
    }
  }

  const isAmountEnabled = (condition: number | string, lvKey: number, index: number, field: string) => {
    const conditionValue = typeof condition === "string" ? parseFloat(condition) : condition

    if (!!isNaN(conditionValue) && conditionValue !== null && conditionValue !== "") {
      form.value.levelData[lvKey].currency[index]["amount"] = ""
    }

    return !isNaN(conditionValue) && conditionValue !== null && conditionValue !== ""
  }

  watch(
    () => form.value.rewardType,
    (newVal) => {
      console.log(form.value.levelData)
      if (newVal === PROMOTION_REWARD_TYPE.Enums.Magnification) {
        form.value.levelData = form.value.levelData.map((level) => ({
          ...level,
          currency: level.currency.map((cur) => ({
            ...cur,
            amount: typeof cur.amount === "number" && cur.amount > 100 ? 0 : cur.amount
          }))
        }))
      }
    }
  )
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
    thead {
      tr {
        th {
          border: none !important;
          text-align: end;
          padding: 0;
          padding-right: 18px !important;
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0 !important;
          border-right: none !important;
          border-bottom: 1px solid #666 !important;
          background-color: #fff !important;

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

  .threshold {
    display: flex;
    align-items: center;
    ::v-deep(.q-field) {
      width: 100%;
      padding-right: 12px;
    }
  }

  ::v-deep(.q-markup-table) {
    tbody {
      tr {
        td {
          &::before {
            background-color: transparent !important;
            transition: none !important;
          }
        }
      }
    }
  }
</style>
