<template>
  <div class="row q-col-gutter-md">
    <!-- Wallet type -->
    <div class="col-12">
      <q-select
        v-model="form.reward[0].free_round_setting[0].wallet_type"
        :options="walletTypeOptions"
        emit-value
        map-options
        :label="`* ${$t('query_params.wallet_type')}`"
        outlined
        @update:model-value="onWalletTypeChange"
      />
    </div>

    <!-- 幣別 -->
    <div class="col-4">
      <q-select
        v-if="currencyList.length && isFormReady"
        v-model="form.reward[0].free_round_setting[0].currency_id"
        :options="currencyList"
        emit-value
        :label="`* ${$t('common.currency')}`"
        map-options
        outlined
        @update:model-value="onCurrencyChange"
      />
    </div>

    <!-- 投注門檻 -->
    <div class="col-8">
      <q-input
        v-if="isFormReady"
        v-model.trim="form.reward[0].condition"
        type="number"
        class=""
        outlined
        :min="1"
        :label="`* ${
          form.type === EVENT_TYPE.Enums.DepositBonus ? $t('common.deposit_threshold') : $t('common.betting_threshold')
        }`"
        @keydown="onRoundsKeydown"
      />
    </div>

    <!-- 產品 -->
    <div class="col-12">
      <q-select
        v-if="isFormReady"
        v-model="form.reward[0].free_round_setting[0].product_code"
        :options="productList"
        emit-value
        :label="`* ${$t('table_header.product')}`"
        map-options
        outlined
        :loading="productLoading"
        @update:model-value="onProductChange"
      />
    </div>

    <!-- 遊戲 -->
    <div class="col-12">
      <q-select
        v-if="isFormReady"
        v-model="form.reward[0].free_round_setting[0].game_code"
        :options="gameList"
        emit-value
        :label="`* ${$t('table_header.game')}`"
        map-options
        outlined
        :loading="gameLoading"
        @update:model-value="onGameChange"
      />
    </div>

    <!-- 投注額度 -->
    <div class="col-12">
      <q-select
        v-if="isFormReady && form.reward[0].free_round_setting[0].product_code === 1006"
        v-model="form.reward[0].free_round_setting[0].bet_per_line"
        :options="betPerLineList"
        emit-value
        :label="`* ${$t('query_params.betting_amount_per_line')}`"
        map-options
        outlined
        :loading="betPerLineLoading"
        :disable="
          !form.reward[0].free_round_setting[0].currency_id ||
          !form.reward[0].free_round_setting[0].product_code ||
          !form.reward[0].free_round_setting[0].game_code
        "
      />
      <q-select
        v-if="isFormReady && form.reward[0].free_round_setting[0].product_code === 1148"
        v-model="form.reward[0].free_round_setting[0].total_bet_amount"
        :options="totalBetScalesList"
        emit-value
        :label="`* ${$t('table_header.total_bet_amount')}`"
        map-options
        outlined
        :loading="betPerLineLoading"
        :disable="
          !form.reward[0].free_round_setting[0].currency_id ||
          !form.reward[0].free_round_setting[0].product_code ||
          !form.reward[0].free_round_setting[0].game_code
        "
      />
    </div>

    <!-- 開始時間 -->
    <div class="col-12">
      <DateTimePickerSingle
        :date-time-model="date.begin_date"
        class="edit-input"
        :label="`* ${$t('query_params.start_time')}`"
        :with-outlined="true"
        :with-borderless="false"
        :useTimePicker="true"
        :on-update-date-time="(value: any) => onDateChange(value, 'begin_date')"
      />
    </div>

    <!-- 結束時間 -->
    <div class="col-12">
      <DateTimePickerSingle
        :date-time-model="date.end_date"
        class="edit-input"
        :label="`* ${$t('query_params.end_time')}`"
        :with-outlined="true"
        :with-borderless="false"
        :useTimePicker="true"
        :on-update-date-time="(value: any) => onDateChange(value, 'end_date')"
      />
    </div>

    <!-- 次數 -->
    <div class="col-12">
      <q-input
        v-if="isFormReady"
        v-model.trim="form.reward[0].free_round_setting[0].rounds"
        type="number"
        class=""
        outlined
        :min="1"
        :label="`* ${$t('table_header.given_time')}`"
        @keydown="onRoundsKeydown"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePromotionStore } from "@/stores/promotionStore"
  import { computed, onMounted, reactive, ref, watch } from "vue"
  import { storeToRefs } from "pinia"
  import { CURRENCY_TYPE, EVENT_TYPE } from "@/utils/constants"
  import { getCurrencyList } from "@/api/common"
  import { getFreeRoundProduct, getFreeRoundGamesBetScales } from "@/api/freeRound"
  import type * as Request from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import {
    getFreeRoundWalletTypeOptions,
    normalizeSelectableFreeRoundWalletType,
    normalizeSelectableFreeRoundWalletTypeWhenReady
  } from "@/utils/freeRoundWalletType"

  const store = usePromotionStore()
  const siteStore = useSiteStore()
  const { promotionItem: form } = storeToRefs(store)

  // 確保 form 是響應式的
  if (!form.value) {
    form.value = store.promotionItem
  }

  // 確保 reward 數組存在
  if (!form.value.reward) {
    form.value.reward = []
  }

  // 確保 reward[0] 存在
  if (!form.value.reward[0]) {
    form.value.reward[0] = {
      amount: 0,
      condition: 0,
      currency: "",
      level: 0,
      type: 2,
      limit: 0,
      free_round_setting: []
    }
  }

  // 確保 free_round_setting 數組存在
  if (!form.value.reward[0].free_round_setting) {
    form.value.reward[0].free_round_setting = []
  }

  // 確保 free_round_setting[0] 存在
  if (!form.value.reward[0].free_round_setting[0]) {
    form.value.reward[0].free_round_setting[0] = {
      begin_date: 0,
      end_date: 0,
      bet_per_line: "0",
      total_bet_amount: "0",
      currency_id: 0,
      game_code: "",
      product_code: 1006,
      rounds: "0",
      remark: "",
      wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
    }
  }

  // 添加计算属性来检查表单是否准备好
  const isFormReady = computed(() => {
    return !!form.value?.reward?.[0]?.free_round_setting?.[0]
  })

  const $q = useQuasar()
  const { t } = useI18n()

  // 计算属性来处理日期格式转换
  const date = ref({
    begin_date: { from: "", fromHms: "", dateTime: "" },
    end_date: { from: "", fromHms: "", dateTime: "" }
  })

  const productLoading = ref(false)
  const gameLoading = ref(false)
  const betPerLineLoading = ref(false)
  const productList = ref<{ label: string; value: number }[]>([
    {
      label: "PragmaticPlay",
      value: 1006
    },
    {
      label: "WOW Gaming",
      value: 1148
    }
  ])
  const gameList = ref<{ label: string; value: string }[]>([
    {
      label: "",
      value: ""
    }
  ])
  const betPerLineList = ref<{ label: string; value: number }[]>([])
  const totalBetScalesList = ref<{ label: string; value: number }[]>([])
  const currencyList = ref<{ label: string; value: number }[]>([])
  const walletTypeOptions = computed(() => getFreeRoundWalletTypeOptions(siteStore.wallet_type_list, t))

  let productData: any = null

  function normalizeCurrentWalletType() {
    const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
    if (!freeRoundSetting) {
      return
    }

    freeRoundSetting.wallet_type = normalizeSelectableFreeRoundWalletTypeWhenReady(
      freeRoundSetting.wallet_type,
      siteStore.wallet_type_list,
      siteStore.walletTypeListReady
    )
  }

  watch(
    () => siteStore.wallet_type_list,
    () => normalizeCurrentWalletType(),
    { deep: true }
  )

  const normalizeFreeRoundDate = (value: string | number | null | undefined) => {
    if (typeof value === "number") {
      return value
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Math.floor(new Date(value).getTime() / 1000)
      return Number.isNaN(parsed) ? 0 : parsed
    }

    return 0
  }

  // 將時間戳轉換為日期格式的函數
  const convertTimestampToDate = (timestamp: string | number | null | undefined) => {
    const normalizedTimestamp = normalizeFreeRoundDate(timestamp)
    if (!normalizedTimestamp) {
      return { from: "", fromHms: "", dateTime: "" }
    }
    const date = new Date(normalizedTimestamp * 1000)

    // 使用本地时间，不调整时区
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const from = `${year}-${month}-${day}`

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const fromHms = `${hours}:${minutes}:${seconds}`

    // console.log("timestamp", normalizedTimestamp, date, from, fromHms)
    return { from, fromHms, dateTime: `${from} ${fromHms}` }
  }

  // 初始化 date 值（只有在 form 中有資料時才轉換）
  const initDateFromForm = () => {
    const beginTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.begin_date)
    const endTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.end_date)

    if (beginTimestamp && beginTimestamp > 0) {
      form.value.reward[0].free_round_setting[0].begin_date = beginTimestamp
      date.value.begin_date = convertTimestampToDate(beginTimestamp)
    }
    if (endTimestamp && endTimestamp > 0) {
      form.value.reward[0].free_round_setting[0].end_date = endTimestamp
      date.value.end_date = convertTimestampToDate(endTimestamp)
    }
  }

  // 根據載入的資料初始化 free round 相關列表
  const initFreeRoundLists = async () => {
    const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
    if (!freeRoundSetting) return
    normalizeCurrentWalletType()

    // 如果有 currency_id，獲取產品列表
    if (freeRoundSetting.currency_id) {
      await getFreeRoundProductList(freeRoundSetting.currency_id)

      // 如果有 product_code，獲取遊戲列表
      if (freeRoundSetting.product_code) {
        await getFreeRoundGameList(freeRoundSetting.product_code)

        // 如果有 game_code，獲取投注額度列表
        if (freeRoundSetting.game_code) {
          await getFreeRoundBetScalesList(
            freeRoundSetting.currency_id,
            freeRoundSetting.product_code,
            freeRoundSetting.game_code
          )
        }
      }
    }
  }

  // 加载游戏列表的公共函数
  const loadGameList = async (currencyId: number, productCode: number) => {
    gameLoading.value = true
    try {
      const response = await getFreeRoundProduct(currencyId, productCode)
      if (response?.data) {
        productData = response.data
        const selectedProduct = response.data.products.find((item: any) => item.product_code === productCode)
        if (selectedProduct?.game_list) {
          gameList.value = selectedProduct.game_list.map((item: any) => ({
            label: item.game_name,
            value: item.game_code
          }))
        }
      }
    } catch (error) {
      console.error("获取游戏列表失败:", error)
    } finally {
      gameLoading.value = false
    }
  }

  // 獲取產品列表（已改为固定列表）
  const getFreeRoundProductList = async (currencyId: number) => {
    // 固定产品列表
    productList.value = [
      {
        label: "PragmaticPlay",
        value: 1006
      },
      {
        label: "WOW Gaming",
        value: 1148
      }
    ]

    // 如果币别和产品都有值，则获取游戏列表
    const productCode = form.value.reward[0]?.free_round_setting?.[0]?.product_code
    if (currencyId && productCode) {
      await loadGameList(currencyId, productCode)
    }
  }

  // 獲取遊戲列表
  const getFreeRoundGameList = async (productCode: number) => {
    const currencyId = form.value.reward[0]?.free_round_setting?.[0]?.currency_id
    if (productCode && currencyId) {
      await loadGameList(currencyId, productCode)
    }
  }

  // 獲取投注額度列表
  const getFreeRoundBetScalesList = async (currencyId: number, productCode: number, gameCode: string) => {
    betPerLineLoading.value = true
    try {
      const response = await getFreeRoundGamesBetScales({
        currency_id: currencyId,
        product_code: productCode,
        game_code: gameCode,
        wallet_type: normalizeSelectableFreeRoundWalletTypeWhenReady(
          form.value.reward[0].free_round_setting[0].wallet_type,
          siteStore.wallet_type_list,
          siteStore.walletTypeListReady
        )
      })
      if (response?.data?.betPerLineScales) {
        betPerLineList.value = response.data.betPerLineScales.map((item: any) => ({
          label: item.toString(),
          value: item
        }))
      }
      if (response?.data?.totalBetScales) {
        totalBetScalesList.value = response.data.totalBetScales.map((item: any) => ({
          label: item.toString(),
          value: item
        }))
      }
    } catch (error) {
      console.error("获取投注额度列表失败:", error)
    } finally {
      betPerLineLoading.value = false
    }
  }

  onMounted(async () => {
    await getCurrencyDropdown()
    // 初始化時，只有在 form 中有資料時才轉換進 date
    initDateFromForm()
    // 初始化 free round 相關列表
    await initFreeRoundLists()
  })

  const getCurrencyDropdown = async () => {
    const { data: currencyData } = await getCurrencyList()
    currencyList.value = Object.keys(currencyData).map((key) => ({
      value: currencyData[key] as number,
      label: t((CURRENCY_TYPE.I18nKeys as any)[currencyData[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key)
    }))
  }

  // 日期變更處理函數
  const onDateChange = (value: { from: string; fromHms: string }, key: "begin_date" | "end_date") => {
    // 将日期时间字符串转换为 Unix 时间戳
    const dateTimeString = `${value.from} ${value.fromHms}`
    const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000)
    form.value.reward[0].free_round_setting[0][key] = timestamp
    if (key === "begin_date") {
      const endTimestamp = form.value.reward[0]?.free_round_setting?.[0]?.end_date
      if (endTimestamp && endTimestamp > 0 && timestamp >= endTimestamp) {
        $q.notify({
          type: "negative",
          message: t("开始时间不能大于或等于结束时间"),
          position: "top"
        })
        // 验证不通过时，将开始时间和结束时间都设置为 0
        if (form.value.reward[0]?.free_round_setting?.[0]) {
          form.value.reward[0].free_round_setting[0].begin_date = 0
          form.value.reward[0].free_round_setting[0].end_date = 0
        }
        // 同时清空 date 值
        date.value.begin_date = { from: "", fromHms: "", dateTime: "" }
        date.value.end_date = { from: "", fromHms: "", dateTime: "" }
        return
      }
    } else if (key === "end_date") {
      const beginTimestamp = form.value.reward[0]?.free_round_setting?.[0]?.begin_date
      if (beginTimestamp && beginTimestamp > 0 && timestamp <= beginTimestamp) {
        $q.notify({
          type: "negative",
          message: t("结束时间不能小于或等于开始时间"),
          position: "top"
        })
        // 验证不通过时，将开始时间和结束时间都设置为 0
        if (form.value.reward[0]?.free_round_setting?.[0]) {
          form.value.reward[0].free_round_setting[0].begin_date = 0
          form.value.reward[0].free_round_setting[0].end_date = 0
        }
        // 同时清空 date 值
        date.value.begin_date = { from: "", fromHms: "", dateTime: "" }
        date.value.end_date = { from: "", fromHms: "", dateTime: "" }
        return
      }
    }
    if (!form.value.reward) {
      form.value.reward = []
    }
    if (!form.value.reward[0]) {
      form.value.reward[0] = {
        amount: 0,
        condition: 0,
        currency: "",
        level: 0,
        type: 2,
        limit: 0,
        free_round_setting: []
      }
    }
    if (!form.value.reward[0].free_round_setting) {
      form.value.reward[0].free_round_setting = []
    }
    // 同步更新 date 值，保持顯示一致
    date.value[key] = { from: value.from, fromHms: value.fromHms, dateTime: dateTimeString }
  }

  const onCurrencyChange = async (currencyId: number) => {
    // 重置游戏选择
    form.value.reward[0].free_round_setting[0].game_code = ""
    form.value.reward[0].free_round_setting[0].bet_per_line = ""
    form.value.reward[0].free_round_setting[0].total_bet_amount = ""
    gameList.value = [
      {
        label: "",
        value: ""
      }
    ]
    betPerLineList.value = []
    totalBetScalesList.value = []
    productData = null

    // 固定产品列表
    productList.value = [
      {
        label: "PragmaticPlay",
        value: 1006
      },
      {
        label: "WOW Gaming",
        value: 1148
      }
    ]

    // 如果币别和产品都有值，则获取游戏列表
    if (currencyId && form.value.reward[0].free_round_setting[0].product_code) {
      await loadGameList(currencyId, form.value.reward[0].free_round_setting[0].product_code)
    }
  }

  const onProductChange = async (productCode: number) => {
    // 重置游戏和投注额度选择
    form.value.reward[0].free_round_setting[0].game_code = ""
    form.value.reward[0].free_round_setting[0].bet_per_line = ""
    form.value.reward[0].free_round_setting[0].total_bet_amount = ""
    gameList.value = []
    betPerLineList.value = []
    totalBetScalesList.value = []

    // 如果产品和币别都有值，则获取游戏列表
    const currencyId = form.value.reward[0]?.free_round_setting?.[0]?.currency_id
    if (productCode && currencyId) {
      await loadGameList(currencyId, productCode)
    }
  }

  const onWalletTypeChange = async (walletType: number) => {
    form.value.reward[0].free_round_setting[0].wallet_type = normalizeSelectableFreeRoundWalletType(
      walletType,
      siteStore.wallet_type_list
    )
    form.value.reward[0].free_round_setting[0].bet_per_line = ""
    form.value.reward[0].free_round_setting[0].total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []

    if (form.value.reward[0].free_round_setting[0].game_code) {
      await getFreeRoundBetScalesList(
        form.value.reward[0].free_round_setting[0].currency_id,
        form.value.reward[0].free_round_setting[0].product_code,
        form.value.reward[0].free_round_setting[0].game_code
      )
    }
  }

  const onGameChange = async (gameCode: string) => {
    // 重置投注额度选择
    form.value.reward[0].free_round_setting[0].bet_per_line = ""
    form.value.reward[0].free_round_setting[0].total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []

    if (
      gameCode &&
      form.value.reward[0].free_round_setting[0].currency_id &&
      form.value.reward[0].free_round_setting[0].product_code
    ) {
      await getFreeRoundBetScalesList(
        form.value.reward[0].free_round_setting[0].currency_id,
        form.value.reward[0].free_round_setting[0].product_code,
        gameCode
      )
    }
  }

  function onRoundsKeydown(event: KeyboardEvent) {
    // 禁止输入负号和点号
    if (event.key === "-" || event.key === ".") {
      event.preventDefault()
      return false
    }

    // 只允许数字和功能键
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ]

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault()
      return false
    }
  }
</script>

<style lang="scss" scoped></style>
