<template>
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("btn.add_times") }}</div>
          <div class="q-pb-md q-pt-md text-red-14">{{ $t("message.free_round_tip_s") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-btn :outline="quotaModes !== 'single'" color="amber-9" @click="changeMode('single')">
            {{ $t("btn.single_distribution") }}
          </q-btn>
          <!-- <q-btn :outline="quotaModes !== 'batch'" color="amber-9" class="q-ml-md" @click="changeMode('batch')">
            {{ $t("btn.batch_distribution") }}
          </q-btn> -->
        </div>
        <!--上傳檔案-->
        <!-- <div class="col-12" v-if="quotaModes === 'batch'">
          <q-file
            ref="fileInput"
            outlined
            bottom-slots
            v-model="memberListCsv"
            :label="$t('btn.please_select_file')"
            max-files="1"
            accept=".csv"
            @update:model-value="handleFileUpload"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="triggerFileUpload" />
            </template>
          </q-file>
          <q-btn :label="$t('edit_form.sample_download')" icon="cloud_download" @click="downloadCsv" color="primary" />
        </div> -->
        <!-- <div
          class="col-12"
          style="height: 200px; overflow-y: auto"
          v-if="quotaModes === 'batch' && csvResultData.length > 0"
        >
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="csvResultData"
            :columns="csvColumn"
            row-key="member_account"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="member_account" :props="props"> {{ props.row.member_account }} </q-td>
                <q-td key="results" :props="props">
                  <q-icon v-if="props.row.results" name="check" color="green" size="20px" />
                  <q-icon v-else name="close" color="red" size="20px" />
                </q-td>
                <q-td key="rounds" :props="props"> {{ props.row.rounds }} </q-td>
              </q-tr>
            </template>
          </q-table>
        </div> -->

        <!--會員帳號-->
        <div class="col-12">
          <q-select
            v-model="dialogData.add.member_id"
            :options="accountOption"
            use-input
            emit-value
            map-options
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterAccount"
            :label="`* ${$t('query_params.member_account')}`"
            outlined
          />
        </div>

        <!-- Wallet type -->
        <div class="col-12">
          <q-select
            v-model="dialogData.add.wallet_type"
            :options="walletTypeOptions"
            emit-value
            map-options
            :label="`* ${$t('query_params.wallet_type')}`"
            outlined
            @update:model-value="onWalletTypeChange"
          />
        </div>

        <!-- 幣別 -->
        <div class="col-12">
          <q-select
            v-if="store.currencyList.length"
            v-model="dialogData.add.currency_id"
            :options="store.currencyList"
            emit-value
            :label="`* ${$t('common.currency')}`"
            map-options
            outlined
            :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
            @update:model-value="onCurrencyChange"
          />
        </div>

        <!-- 產品 -->
        <div class="col-12">
          <q-select
            v-model="dialogData.add.product_code"
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
            v-model="dialogData.add.game_code"
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
            v-if="dialogData.add.product_code === 1006"
            v-model="dialogData.add.bet_per_line"
            :options="betPerLineList"
            emit-value
            :label="`* ${$t('query_params.betting_amount_per_line')}`"
            map-options
            outlined
            :loading="betPerLineLoading"
            :disable="!dialogData.add.currency_id || !dialogData.add.product_code || !dialogData.add.game_code"
          />
          <q-select
            v-if="dialogData.add.product_code === 1148"
            v-model="dialogData.add.total_bet_amount"
            :options="totalBetScalesList"
            emit-value
            :label="`* ${$t('table_header.total_bet_amount')}`"
            map-options
            outlined
            :loading="betPerLineLoading"
            :disable="!dialogData.add.currency_id || !dialogData.add.product_code || !dialogData.add.game_code"
          />
        </div>

        <div class="col-12">
          <DateTimePickerSingle
            :date-time-model="dialogData.add.begin_date"
            class="edit-input"
            :label="`* ${$t('query_params.start_time')}`"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="(value: any) => onDateChange(value, 'begin_date')"
          />
        </div>

        <div class="col-12">
          <DateTimePickerSingle
            :date-time-model="dialogData.add.end_date"
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
            v-model.trim="dialogData.add.rounds"
            type="number"
            class=""
            outlined
            :min="1"
            :label="`* ${$t('table_header.given_time')}`"
            @blur="dialogData.add.rounds = Math.floor(dialogData.add.rounds)"
            @keydown="onRoundsKeydown"
          />
        </div>

        <!-- 備註 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.add.remark"
            type="text"
            class=""
            outlined
            :label="`${$t('table_header.remark')}`"
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import type { QTableProps } from "quasar"
  import { reactive, onMounted, onUnmounted, computed, ref, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { getMemberQuotaMemberSearch } from "@/api/member"
  import { getFreeRoundProduct, getFreeRoundGamesBetScales, addFreeRound } from "@/api/freeRound"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useQueryStore } from "@/stores/queryStore"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"
  import { useSiteStore } from "@/stores/siteStore"
  import { getFreeRoundWalletTypeOptions, normalizeSelectableFreeRoundWalletType } from "@/utils/freeRoundWalletType"

  const { t } = useI18n()
  const $q = useQuasar()
  const eventbus = injectStrict(EventBusKey)
  const siteStore = useSiteStore()

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
  let productData: any = null

  const store = useQueryStore()
  const walletTypeOptions = computed(() => getFreeRoundWalletTypeOptions(siteStore.wallet_type_list, t))

  function setNormalizedWalletType(walletType: unknown) {
    dialogData.add.wallet_type = normalizeSelectableFreeRoundWalletType(walletType, siteStore.wallet_type_list)
  }

  watch(
    () => siteStore.wallet_type_list,
    () => setNormalizedWalletType(dialogData.add.wallet_type),
    { deep: true }
  )

  onMounted(async () => {
    eventbus.on("handleAddFreeRoundTimesShow", (show) => {
      if (show) {
        onAdd()
        return
      }
    })
  })

  onUnmounted(() => {
    eventbus.off("handleAddFreeRoundTimesShow")
  })

  const dialogAccountColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_level",
      label: t("table_header.member_level"),
      field: "member_level",
      sortable: false,
      align: "center"
    },
    {
      name: "enable",
      label: t("table_header.enable_or_disable"),
      field: "enable",
      sortable: false,
      align: "center"
    },
    {
      name: "member_tag",
      label: t("table_header.member_tag"),
      field: "member_tag",
      sortable: false,
      align: "center"
    }
  ])

  const csvColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "results",
      label: t("table_header.comparison_results"),
      field: "results",
      sortable: false,
      align: "center"
    },
    {
      name: "rounds",
      label: t("table_header.given_time"),
      field: "rounds",
      sortable: false,
      align: "center"
    }
  ])

  interface Tag {
    id: number
  }

  const dialogMemberData = reactive([
    {
      id: 0,
      member_level: 0,
      enable: 0,
      member_tag: [] as Tag[],
      wallets: []
    }
  ])

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    add: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    }
  })

  const dialogData = reactive({
    add: {
      member_id: 0,
      currency_id: 0,
      product_code: 1006,
      game_code: "",
      bet_per_line: "",
      total_bet_amount: "",
      rounds: 0,
      remark: "",
      wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list),
      begin_date: { from: "", fromHms: "00:00:00", dateTime: "" },
      end_date: { from: "", fromHms: "00:00:00", dateTime: "" }
    },
    edit: {}
  })

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  async function onAdd() {
    store.getCurrencyList()
    await store.getMemberLevel()
    //搜尋會員
    getMember("")
    dialogData.add.member_id = 0
    dialogData.add.currency_id = 0
    dialogData.add.product_code = 1006
    dialogData.add.game_code = ""
    dialogData.add.rounds = 0
    dialogData.add.bet_per_line = ""
    dialogData.add.total_bet_amount = ""
    dialogData.add.remark = ""
    setNormalizedWalletType(0)
    dialogData.add.begin_date.from = ""
    dialogData.add.begin_date.fromHms = "00:00:00"
    dialogData.add.begin_date.dateTime = ""
    dialogData.add.end_date.from = ""
    dialogData.add.end_date.fromHms = "00:00:00"
    dialogData.add.end_date.dateTime = ""

    //會員詳細
    dialogMemberData[0].id = 0

    //匯入重製
    quotaModes.value = "single"

    openAddDialog()
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

  async function handleAdd() {
    const sendData = {
      member_id: dialogData.add.member_id || 0,
      currency_id: dialogData.add.currency_id || 0,
      product_code: dialogData.add.product_code || 0,
      game_code: dialogData.add.game_code,
      bet_per_line: `${dialogData.add.bet_per_line}` || "0",
      total_bet_amount: `${dialogData.add.total_bet_amount}` || "0",
      rounds: dialogData.add.rounds ? Number(dialogData.add.rounds) : 0,
      remark: dialogData.add.remark,
      wallet_type: normalizeSelectableFreeRoundWalletType(dialogData.add.wallet_type, siteStore.wallet_type_list),
      begin_date: dialogData.add.begin_date.dateTime,
      end_date: dialogData.add.end_date.dateTime
    }

    if (!sendData.member_id) {
      errorMsg("error_msg.please_select_member_account")
      return
    } else if (!sendData.wallet_type) {
      errorMsg("error_msg.please_select_wallet_type")
      return
    } else if (!sendData.currency_id) {
      errorMsg("error_msg.please_select_currency")
      return
    } else if (!sendData.product_code) {
      errorMsg("error_msg.please_select_product")
      return
    } else if (!sendData.game_code) {
      errorMsg("error_msg.please_select_game")
      return
    } else if (sendData.product_code === 1006 && !sendData.bet_per_line) {
      errorMsg("error_msg.please_select_the_bet_amount")
      return
    } else if (sendData.product_code === 1148 && !sendData.total_bet_amount) {
      errorMsg("error_msg.please_select_the_bet_amount")
      return
    } else if (!sendData.rounds) {
      errorMsg("error_msg.please_enter_the_number_of_gifts")
      return
    } else if (!dialogData.add.begin_date.dateTime) {
      errorMsg("error_msg.please_enter_the_start_time")
      return
    } else if (!dialogData.add.end_date.dateTime) {
      errorMsg("error_msg.please_enter_the_end_time")
      return
    }

    const beginDate = sendData.begin_date
    const endDate = sendData.end_date
    const now = Math.floor(Date.now() / 1000)
    const beginDateTimestamp = Math.floor(new Date(beginDate).getTime() / 1000)
    const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
    if (endDateTimestamp < now) {
      errorMsg("error_msg.date_error_dispatch")
      return
    }
    if (endDateTimestamp < beginDateTimestamp) {
      errorMsg("error_msg.date_error_expiration")
      return
    }

    openAddLoading()
    try {
      const res = await addFreeRound(sendData)

      if (res?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.add_success"),
          position: "top",
          timeout: 300
        })
        eventbus.emit("handleAddFreeRoundTimesFinish")
        closeAddLoading()
        closeAddDialog()
      } else {
        $q.notify({
          type: "negative",
          message: res?.msg || "操作失败",
          position: "top",
          timeout: 300
        })
        closeAddLoading()
      }
    } catch (error) {
      console.error("新增免费旋转次数失败:", error)
      $q.notify({
        type: "negative",
        message: "新增失败，请稍后重试",
        position: "top",
        timeout: 300
      })
      closeAddLoading()
    } finally {
      closeAddLoading()
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
      gameList.value = [
        {
          label: "",
          value: ""
        }
      ]
    }
  }

  const quotaModes = ref("single")

  const changeMode = (modes: string) => {
    quotaModes.value = modes
  }

  const errorMsg = (msg: string) => {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 2000
    })
  }

  const accountOption = ref<
    {
      label: string
      value: number
    }[]
  >([])

  const filterAccount = (val: string, update: Function, abort: Function) => {
    update(() => {
      const needle = val.toLowerCase()
      getMember(needle)
    })
  }

  //搜尋會員
  const getMember = async (name: string | "") => {
    const sendData = {
      type: 1,
      account: name + "%",
      offset: 0,
      size: 100
    }
    const { data } = await getMemberQuotaMemberSearch(sendData)
    if (!data || !Object.keys(data).length || !data.list) {
      accountOption.value.length = 0
      return
    }

    accountOption.value.length = 0
    data.list.forEach((item: any) => {
      const newItem = {
        label: item.account,
        value: item.id
      }
      accountOption.value.push(newItem as never)
    })
  }

  function onDateChange(value: { from: string; fromHms: string }, key: "begin_date" | "end_date") {
    if (!dialogData.add[key]) {
      dialogData.add[key] = { from: "", fromHms: "", dateTime: "" }
    }
    dialogData.add[key].dateTime = `${value.from} ${value.fromHms}`
  }

  const onCurrencyChange = async (currencyId: number) => {
    // 重置游戏选择
    dialogData.add.game_code = ""
    dialogData.add.bet_per_line = ""
    dialogData.add.total_bet_amount = ""
    gameList.value = [
      {
        label: "",
        value: ""
      }
    ]
    betPerLineList.value = []
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
    if (currencyId && dialogData.add.product_code) {
      await loadGameList(currencyId, dialogData.add.product_code)
    }
  }

  const onProductChange = async (productCode: number) => {
    // 重置游戏和投注额度选择
    dialogData.add.game_code = ""
    dialogData.add.bet_per_line = ""
    dialogData.add.total_bet_amount = ""
    gameList.value = []
    betPerLineList.value = []

    // 如果币别和产品都有值，则获取游戏列表
    if (productCode && dialogData.add.currency_id) {
      await loadGameList(dialogData.add.currency_id, productCode)
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

  const onWalletTypeChange = async (walletType: number) => {
    setNormalizedWalletType(walletType)
    dialogData.add.bet_per_line = ""
    dialogData.add.total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []

    if (dialogData.add.game_code) {
      await onGameChange(dialogData.add.game_code)
    }
  }

  const onGameChange = async (gameCode: string) => {
    // 重置投注额度选择
    dialogData.add.bet_per_line = ""
    dialogData.add.total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []
    if (gameCode && dialogData.add.currency_id && dialogData.add.product_code && dialogData.add.wallet_type) {
      betPerLineLoading.value = true
      try {
        const response = await getFreeRoundGamesBetScales({
          currency_id: dialogData.add.currency_id,
          product_code: dialogData.add.product_code,
          game_code: gameCode,
          wallet_type: normalizeSelectableFreeRoundWalletType(dialogData.add.wallet_type, siteStore.wallet_type_list)
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
  }
</script>
