<template>
  <!-- 優惠金額設定 -->
  <q-card-section class="q-pb-xs">
    <!-- 反佣設定 -->
    <div class="text-subtitle2 text-bold">{{ $t("edit_form.rebate_settings") }}</div>
    <div class="containers q-mt-md" v-for="(lvData, lvKey) in form.levelData" :key="lvKey">
      <!-- 表頭 -->
      <div class="header">
        <div>{{ t("edit_form.level") }}</div>
        <div>{{ t("edit_form.active_member_count") }}</div>
        <div>{{ t("edit_form.commission_rate") }}</div>
      </div>

      <!-- 第一行 -->
      <div class="row">
        <div class="first_row">Lv{{ lvKey + 1 }}</div>
        <div class="first_row">
          <q-number
            v-model.number="lvData.active_members"
            dense
            borderless
            square
            outlined
            :options="generalOptions"
            @update:model-value="checkBasicRules"
            @focus="clearIfZero(lvData, 'active_members')"
          />
        </div>
        <div class="first_row">
          <q-number
            v-model="lvData.commission_rate"
            dense
            borderless
            square
            outlined
            :options="generalOptions"
            @update:model-value="checkBasicRules"
            @focus="clearIfZero(lvData, 'commission_rate')"
          />%
        </div>
      </div>

      <!-- 分區 -->
      <div class="section-title">{{ t("edit_form.net_profit") }}</div>

      <div class="currency-scroll-wrapper">
        <div class="currency-column" v-for="(item, index) in lvData.net_profit" :key="item.currency">
          <!-- 幣別 -->
          <div class="currency-title">{{ item.currency }}</div>
          <!-- 淨盈利數字 -->
          <div class="currency-input-box">
            <q-number
              v-model="item.amount"
              dense
              borderless
              outlined
              square
              :options="generalOptions"
              @update:model-value="checkCurrencyRules"
              @focus="clearIfZero(item, 'amount')"
            />
          </div>
        </div>
      </div>

      <!-- 分區 -->
      <div class="section-title">{{ t("edit_form.platform_management_fee") }}</div>

      <div class="currency-scroll-wrapper">
        <div class="currency-column" v-for="(item, index) in lvData.platform_fee" :key="item.currency">
          <!-- 幣別 -->
          <div class="currency-title">{{ item.currency }}</div>
          <!-- 平台數字 -->
          <div class="currency-input-box">
            <q-number
              v-model="item.amount"
              dense
              borderless
              outlined
              square
              :options="generalOptions"
              @update:model-value="checkCurrencyRules"
              @focus="clearIfZero(item, 'amount')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex q-pt-md q-pb-lg" style="text-align: center">
      <q-btn outline color="main-color" icon="add" align="center" class="q-mr-md add_btn" @click="addLv"> </q-btn>
      <q-btn outline color="red-6" icon="remove" align="center" class="add_btn" @click="minusLv"> </q-btn>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useCollaborationStore } from "@/stores/collaborationStore"
  import { onMounted, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { getCurrencyList } from "@/api/common"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const store = useCollaborationStore()
  const { collaborationItem: form } = storeToRefs(store)

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }

  const $q = useQuasar()
  const { t } = useI18n()

  type CurrencyList = { [currency: string]: number }
  const currencyList = ref<CurrencyList>({})
  const defaultEntry = () => {
    const currencyMap = Object.entries(currencyList.value)
    return {
      active_members: 0,
      commission_rate: 0,
      net_profit: currencyMap.map(([currency, id]) => ({
        currency_id: id,
        currency: currency,
        amount: "0"
      })),
      platform_fee: currencyMap.map(([currency, id]) => ({
        currency_id: id,
        currency: currency,
        amount: "0"
      }))
    }
  }
  onMounted(async () => {
    const { data } = await getCurrencyList()
    currencyList.value = data

    // 防呆：如果是空陣列，新增一筆預設數據
    if (form.value.rebate_settings.length === 0) {
      form.value.rebate_settings.push(defaultEntry())
    }

    const result = form.value.rebate_settings.map((item) => {
      const currencyMap = Object.entries(currencyList.value)

      // 深拷貝 item，避免直接修改原數據
      const updatedItem = { ...item }

      // 處理 net_profit 和 platform_fee
      ;(["net_profit", "platform_fee"] as const).forEach((key) => {
        updatedItem[key] = currencyMap.map(([currency, id]) => {
          const existing = (item as any)[key]?.find((cid: any) => cid.currency_id === id)
          return {
            currency_id: id,
            currency: currency,
            amount: existing ? existing.amount : 0
          }
        })
      })

      return updatedItem
    })
    form.value.levelData = result
  })

  const addLv = () => {
    const addDefaultEntry = () => {
      const currencyMap = Object.entries(currencyList.value)
      return {
        active_members: 0,
        commission_rate: 0,
        net_profit: currencyMap.map(([currency, id]) => ({
          currency_id: id,
          currency: currency,
          amount: "0"
        })),
        platform_fee: currencyMap.map(([currency, id]) => ({
          currency_id: id,
          currency: currency,
          amount: "0"
        }))
      }
    }
    form.value.levelData.push(addDefaultEntry())
    console.log(form.value.levelData)
  }
  const minusLv = () => {
    if (form.value.levelData.length > 1) {
      form.value.levelData.pop() // 刪除最後一個 lv 對象
    }
  }
  type CurrencyField = "active_members" | "commission_rate" | "net_profit" | "platform_fee" | "amount"

  const clearIfZero = (item: any, field: CurrencyField) => {
    if (item[field] <= 0) {
      item[field] = ""
    }
  }
  const checkBasicRules = () => {
    for (let i = 1; i < form.value.levelData.length; i++) {
      const currentLevel = form.value.levelData[i]
      const previousLevel = form.value.levelData[i - 1]

      // 檢查 commission_rate
      // 確保將值轉換為字串再解析，以避免型別錯誤
      const currentRate = String(currentLevel.commission_rate)
      const prevRate = String(previousLevel.commission_rate)

      if (parseFloat(currentRate) < parseFloat(prevRate)) {
        $q.notify({
          color: "red",
          message: `LV${i + 1}  ${t("edit_form.commission_rate")}${t("error_msg.cannot_less_than")}  LV${i}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
      // 檢查 active_members
      if (currentLevel.active_members < previousLevel.active_members) {
        $q.notify({
          color: "red",
          message: `LV${i + 1}  ${t("edit_form.active_member_count")}${t("error_msg.cannot_less_than")}  LV${i}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    return true
  }

  const checkCurrencyRules = () => {
    for (let i = 1; i < form.value.levelData.length; i++) {
      const currentLevel = form.value.levelData[i]
      const previousLevel = form.value.levelData[i - 1]

      // 檢查 net_profit
      const currentNetProfit = currentLevel.net_profit
      const previousNetProfit = previousLevel.net_profit

      for (let prevProfit of previousNetProfit) {
        const currProfit = currentNetProfit.find((p) => p.currency_id === prevProfit.currency_id)
        if (!currProfit || parseFloat(String(currProfit.amount)) < parseFloat(String(prevProfit.amount))) {
          /*console.error(
            `Error: Level ${i}'s net_profit for currency_id ${prevProfit.currency_id} (${
              currProfit ? currProfit.amount : "undefined"
            }) is lower than Level ${i - 1} (${prevProfit.amount}).`
          )*/
          $q.notify({
            color: "red",
            message: `LV${i + 1}  ${t("edit_form.net_profit")}${t("error_msg.cannot_less_than")}  LV${i}`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
      // 檢查 platform_fee (如需檢查，這裡可加入類似的邏輯)
    }

    return true
  }
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
        }
      }
    }
  }
  .threshold {
    display: flex;
    align-items: center;
  }
  ::v-deep(.q-markup-table td:hover),
  ::v-deep(.q-markup-table th:hover) {
    background-color: transparent !important;
    transition: none !important;
  }
</style>
<style scoped>
  ::v-deep(input.q-field__input) {
    text-align: end;
  }
  /* ::v-deep(.q-field) {
    width: 10%;
  }*/
  .containers {
    width: 100%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    background-color: #dceeff; /* 紫色背景 */
    color: #535252;
    padding: 10px;
    align-items: center;
  }

  .header div {
    flex: 1;
    text-align: center;
  }

  .header div:first-child {
    flex: 1;
  }

  .row {
    display: flex;
  }

  .row div {
    flex: 1;
    padding: 10px;
    text-align: center;
  }

  .row div:last-child {
  }
  .first_row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-title {
    background-color: #dceeff; /* 深紫色背景 */
    color: #535252;
    text-align: center;
    padding: 10px;
  }

  /* 新增的外層捲動容器 */
  .currency-scroll-wrapper {
    display: flex; /* 改為橫向排列 column */
    overflow-x: auto;
    width: 100%;
  }

  /* 每個幣別直向排列 */
  .currency-column {
    display: flex;
    flex-direction: column;
    min-width: 150px; /* 固定寬度 */
    flex: 1 0 150px;
  }

  /* 幣別標題 */
  .currency-title {
    background-color: #dceeff;
    color: #535252;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-right: 1px solid #fff; /* 加上分隔線比較清楚 */
  }

  /* 輸入框區塊 */
  .currency-input-box {
    padding: 10px;
    text-align: center;
    color: #fff;
    /* border-right: 1px solid #eee; */ /* 若需要分隔線可加 */

    ::v-deep(.q-field__control) {
      &::before {
        /* 保留原本的樣式 */
      }
    }
  }
</style>
