<template>
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("common.cash_gift_distribution") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-btn :outline="quotaModes !== 'single'" color="amber-9" @click="changeMode('single')">
            {{ $t("btn.single_distribution") }}
          </q-btn>
          <q-btn :outline="quotaModes !== 'batch'" color="amber-9" class="q-ml-md" @click="changeMode('batch')">
            {{ $t("btn.batch_distribution") }}
          </q-btn>
        </div>
        <!--上傳檔案-->
        <div class="col-12" v-if="quotaModes === 'batch'">
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
        </div>
        <div
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
                <q-td key="amount" :props="props"> {{ props.row.amount }} </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <!--會員帳號-->
        <div class="col-12" v-if="quotaModes === 'single'">
          <q-select
            v-model="dialogData.add.id"
            :options="accountOption"
            use-input
            emit-value
            map-options
            hide-selected
            fill-input
            input-debounce="600"
            @filter="filterAccount"
            @input-value="setAccount"
            @update:model-value="getMemberInfo('add')"
            :label="`* ${$t('query_params.member_account')}`"
            outlined
          />
        </div>

        <div class="col-12" v-if="dialogMemberData[0].id !== 0 && quotaModes === 'single'">
          <q-table
            square
            hide-pagination
            :rows="dialogMemberData"
            :columns="dialogAccountColumn"
            row-key="trans_code"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!-- 會員層級 -->
                <q-td key="member_level" :props="props"> {{ getLevel(props.row.member_level) }} </q-td>
                <!-- 啟/停用 -->
                <q-td key="enable" :props="props">
                  <span v-if="props.row.enable == 1">{{ $t("common.enable") }}</span>
                  <span v-else>{{ $t("common.disable") }}</span>
                </q-td>
                <!--會員標籤-->
                <q-td key="member_tag" :props="props">
                  <div class="q-pt-md">
                    <p v-for="(item, Index) in props.row.member_tag" :key="item.id">
                      {{ item.name }}
                    </p>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <!--錢包類型-->
        <div class="col-12" v-if="walletSwitch">
          <q-select
            v-model="dialogData.add.wallet_type"
            :options="dropdownData.walletList"
            emit-value
            :label="`* ${$t('query_params.wallet_type')}`"
            map-options
            outlined
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
            @update:model-value="getMemberBalance(dialogData.add.id, dialogData.add.currency_id)"
          />
          <!--<div class="q-mt-md q-ml-xs" v-if="quotaModes === 'single'">
            {{ $t("common.current_balance") }} : {{ balance }}
          </div>-->
        </div>
        <!-- 名稱 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.add.name"
            type="text"
            class=""
            outlined
            :label="`* ${$t('table_header.gift_type_name')}`"
          />
        </div>
        <!-- 金額 -->
        <div class="col-12" v-if="quotaModes === 'single'">
          <q-input
            v-model.trim="dialogData.add.amount"
            type="text"
            class=""
            outlined
            :label="`* ${$t('edit_form.distribution_amount')}`"
          />
        </div>
        <!-- 稽核倍數 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.add.rate"
            type="text"
            class=""
            outlined
            :label="`* ${$t('edit_form.audit_multiple')}`"
          />
        </div>
        <div class="col-12">
          <DateTimePickerSingle
            :date-time-model="dialogData.add.dispatched_at"
            class="edit-input"
            :label="`* ${$t('common.distribution_time')}`"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="(value: any) => onDateChange(value, 'dispatched_at')"
          />
        </div>
        <div class="col-12">
          <DateTimePickerSingle
            :date-time-model="dialogData.add.expired_at"
            class="edit-input"
            :label="`${$t('common.overdue_time')}`"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="(value: any) => onDateChange(value, 'expired_at')"
          />
        </div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import type { QTableProps } from "quasar"
  import { QFile } from "quasar"
  import { reactive, onMounted, onUnmounted, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { MemberCheckAccount, GiftDispatch, GiftDispatchBatch, getMemberDetail } from "@/api/giftDetail"
  import { getMemberQuotaMemberSearch, getMemberQuotaBalance, getMemberTagList } from "@/api/member"
  import type {
    GiftQuota,
    AICompleteGiftDetail,
    AICompleteGiftDetailBatch,
    AICompleteGiftDetailSingle
  } from "@/api/response.type"
  import { BONUS_WALLET_TYPE, ERROR_CODE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useQueryStore } from "@/stores/queryStore"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import Papa from "papaparse"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"

  const { t } = useI18n()
  const $q = useQuasar()
  const { walletSwitch } = useWalletBouns()
  const eventbus = injectStrict(EventBusKey)

  const balance = ref(0)

  const dropdownData = reactive<{
    currencyList: {
      label: string
      value: number
    }[]
    walletList: {
      label: string
      value: number
    }[]
  }>({
    currencyList: [],
    walletList: []
  })

  const { numberEnumToArray } = useCommon()

  const store = useQueryStore()

  onMounted(async () => {
    //錢包類型
    numberEnumToArray(BONUS_WALLET_TYPE.Enums).forEach((item) => {
      dropdownData.walletList.push({
        label: t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow",
        value: item as number
      })
    })

    eventbus.on("handleAddGiftDetailShow", (show) => {
      if (show) {
        onAdd()
        return
      }
    })

    eventbus.on("handleAIAddGiftDetail", (data) => {
      handleCompleteGiftDetail(data)
    })
  })

  onUnmounted(() => {
    eventbus.off("handleAddGiftDetailShow")
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
      name: "amount",
      label: t("edit_form.distribution_amount"),
      field: "amount",
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
    /*edit: {
      dialogLabelI18nKey: "",
      type: DialogType.EDIT,
      useActions: false,
      submitFunction: handleEdit
    }*/
  })

  const dialogData = reactive({
    add: {
      id: 0,
      amount: 0,
      dispatched_at: { from: "", fromHms: "00:00:00", dateTime: "" },
      expired_at: { from: "", fromHms: "00:00:00", dateTime: "" }
    } as GiftQuota,
    edit: {} as GiftQuota
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

    //取得會員標籤
    getMemberTag()
    dialogData.add.id = 0
    //dialogData.add.currency_id = 0
    dialogData.add.amount = 0
    dialogData.add.wallet_type = BONUS_WALLET_TYPE.Enums.GENERALLY
    dialogData.add.rate = 1
    dialogData.add.name = ""
    dialogData.add.dispatched_at.from = ""
    dialogData.add.dispatched_at.fromHms = "00:00:00"
    dialogData.add.dispatched_at.dateTime = ""
    dialogData.add.expired_at.from = ""
    dialogData.add.expired_at.fromHms = "00:00:00"
    dialogData.add.expired_at.dateTime = ""
    //會員詳細
    dialogMemberData[0].id = 0

    //餘額規0
    balance.value = 0

    //匯入重製
    quotaModes.value = "single"
    memberListCsv.value = null
    csvResultData.value = []

    openAddDialog()
  }

  const buildBatchGiftRows = async (accounts: string[], amount: number) => {
    if (!accounts.length) {
      csvResultData.value = []
      return
    }

    const res = await MemberCheckAccount({ list: accounts as [] })
    if (res?.code !== 0) {
      csvResultData.value = accounts.map((account: string) => ({
        member_account: account,
        results: 0,
        amount,
        id: 0
      }))
      return
    }

    const members = res.data.list as { id: number; account: string }[]
    csvResultData.value = accounts.map((account: string) => {
      const foundMember = members.find((member) => member.account === account)
      return {
        member_account: account,
        results: foundMember ? 1 : 0,
        amount,
        id: foundMember ? foundMember.id : 0
      }
    })
  }

  async function handleCompleteGiftDetailSingle(data: AICompleteGiftDetailSingle) {
    await getMember(data.account)

    if (accountOption.value.length) {
      dialogData.add.id = accountOption.value[0].value || 0
    }
  }

  async function handleCompleteGiftDetailBatch(data: AICompleteGiftDetailBatch) {
    quotaModes.value = "batch"
    const accounts = data.accounts.filter((account) => !!account?.trim())
    const amount = Number(data.amount)
    await buildBatchGiftRows(accounts, isNaN(amount) ? 0 : amount)
  }

  async function handleCompleteGiftDetail(data: AICompleteGiftDetail) {
    await onAdd()

    dialogData.add.name = data.name

    const amount = Number(data.amount)
    dialogData.add.amount = isNaN(amount) ? 0 : amount

    const rate = Number(data.rate)
    dialogData.add.rate = isNaN(rate) ? 0 : rate

    if ("accounts" in data) {
      await handleCompleteGiftDetailBatch(data)
      return
    }

    await handleCompleteGiftDetailSingle(data)
  }

  async function handleAdd() {
    const sendData = {
      id: dialogData.add.id,
      currency_id: dialogData.add.currency_id,
      wallet_type: dialogData.add.wallet_type,
      name: dialogData.add.name,
      amount: dialogData.add.amount,
      rate: dialogData.add.rate,
      dispatched_at: dialogData.add.dispatched_at.dateTime,
      expired_at: dialogData.add.expired_at.dateTime,
      list: csvResultData.value
        .filter((item: { results: number }) => item.results === 1)
        .map(({ id, member_account, amount }) => ({
          id,
          account: member_account,
          amount: Number(amount)
        }))
    }

    if (quotaModes.value !== "single" && sendData.list.length <= 0) {
      errorMsg("error_msg.please_upload_file")
      return
    }
    if (!sendData.id && quotaModes.value === "single") {
      errorMsg("error_msg.please_select_member_account")
      return
    } else if (!sendData.currency_id && sendData.currency_id !== null) {
      errorMsg("error_msg.please_select_currency")
      return
    } else if (sendData.name === "") {
      errorMsg("error_msg.please_enter_amount_name")
      return
    } else if (sendData.amount <= 0 && quotaModes.value === "single") {
      errorMsg("error_msg.the_amount_greater_than_0")
      return
    } else if (sendData.rate === 0 || sendData.rate === "") {
      errorMsg("error_msg.please_enter_audit_multiplier")
      return
    } else if (sendData.dispatched_at === "") {
      errorMsg("error_msg.please_enter_the_distribution_time")
      return
    }
    const dispatchedAt = new Date(sendData.dispatched_at)
    const expiredAt = new Date(sendData.expired_at)
    const now = new Date()

    if (sendData.expired_at !== "") {
      if (expiredAt < now) {
        errorMsg("error_msg.date_error_dispatch")
        return
      }
      if (expiredAt < dispatchedAt) {
        errorMsg("error_msg.date_error_expiration")
        return
      }
    }
    openAddLoading()
    let res
    if (quotaModes.value === "single") {
      res = await GiftDispatch(sendData)
    } else {
      res = await GiftDispatchBatch(sendData)
    }
    if (res?.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      eventbus.emit("handleAddGiftDetailFinish")
      closeAddLoading()
      closeAddDialog()
    } else {
      if (res?.code === ERROR_CODE.Enums.A_INSUFFICIENT_BALANCE) {
        $q.notify({
          type: "negative",
          message: `${t(res.msg.split(":")[0])}${t("error_msg.insufficient_balance")}`,
          position: "top",
          timeout: 300
        })
      } else {
        $q.notify({
          type: "negative",
          message: res.msg,
          position: "top",
          timeout: 300
        })
      }

      closeAddLoading()
    }
  }

  const quotaModes = ref("single")
  const fileInput = ref<InstanceType<typeof QFile> | null>(null)
  const memberListCsv = ref(null)
  const csvResultData = ref([])
  const changeMode = (modes: string) => {
    quotaModes.value = modes
  }
  const triggerFileUpload = () => {
    fileInput.value?.pickFiles()
  }
  const handleFileUpload = (file: File | null) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: handleParsedData,
        error: handleParseError
      })
    }
  }
  const handleParsedData = async (result: Papa.ParseResult<unknown>) => {
    const sendData = {
      list: result.data.map((item: {}) => Object.values(item)[0])
    }

    const res = await MemberCheckAccount(sendData)
    openAddLoading()
    if (res?.code === 0) {
      const members = res.data.list as { id: number; account: string }[]

      csvResultData.value = result.data.map((member: { account: string; amount: number }) => {
        const foundMember = members.find((m) => m.account === member.account)
        return {
          member_account: member.account,
          results: foundMember ? 1 : 0, // 有匹配到則為 1，否則為 0
          amount: member.amount,
          id: foundMember ? foundMember.id : 0
        }
      })
      closeAddLoading()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
      closeAddLoading()
    }
  }
  const handleParseError = (error: Papa.ParseError) => {
    console.error("Error parsing CSV:", error.message)
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
  //const stringOptions = ref([])

  const getMember = async (name: string) => {
    const sendData = {
      type: 1,
      account: name + "%",
      offset: 0,
      size: 100
    }

    const { data } = await getMemberQuotaMemberSearch(sendData)

    accountOption.value.length = 0

    if (!data || !Object.keys(data).length || !data.list) return

    data.list.forEach((item: any) => {
      accountOption.value.push({
        label: item.account,
        value: item.id
      } as never)
    })
  }

  const filterAccount = (val: string, update: Function, abort: Function) => {
    const needle = val.trim().toLowerCase() // 避免空格誤觸

    if (needle === "") {
      accountOption.value.length = 0
      return
    }

    update(() => {
      getMember(needle)
    })
  }

  const turnover = ref(0)
  const audit_turnover = ref(0)
  const setAccount = async (value: string) => {
    const member = accountOption.value.find((item: { label: string; value: number }) => item.label === value)
    if (member !== undefined) {
      getMemberBalance(member["value"], dialogData.add.currency_id)

      const res = await getMemberDetail(member["value"])
      Object.assign(memberData, res.data)

      dialogMemberData[0].id = memberData.id
      dialogMemberData[0].member_level = memberData.member_level
      dialogMemberData[0].enable = memberData.enabled
      dialogMemberData[0].wallets = memberData.wallets
    }
  }
  //取得會員餘額
  const getMemberBalance = async (id: number, currency: number) => {
    if (!id || !currency) {
      return
    }
    const sendData = {
      member_id: id,
      currency_id: currency
    }
    const res = await getMemberQuotaBalance(sendData)
    balance.value = res.code === 0 ? res.data.balance : 0

    const currencys = store.currencyList.find((item) => item.value === currency)
    if (currency) {
      const wallets = dialogMemberData[0].wallets.find(
        (item: { currency: string; audit_turnover: number; turnover: number }) =>
          item.currency === currencys?.label.split(".")[1]
      ) as { currency: string; audit_turnover: number; turnover: number } | undefined

      audit_turnover.value = wallets?.audit_turnover || 0
      turnover.value = wallets?.turnover || 0
    }
    //getPromotion(currency)
  }
  //取得該會員的詳細
  const memberData = reactive({ id: 0, member_level: 0, enabled: 0, labels: [], wallets: [] })

  let memberFilterTag: Tag[]
  const getMemberInfo = async (mode: string) => {
    let id = 0
    if (mode === "add") {
      id = dialogData.add.id
    } else if (mode === "edit") {
      id = dialogData.edit.id
    }

    const res = await getMemberDetail(id)
    Object.assign(memberData, res.data)
    dialogMemberData[0].id = memberData.id
    dialogMemberData[0].member_level = memberData.member_level
    dialogMemberData[0].enable = memberData.enabled
    const memberTagIds = memberData.labels ? (memberData.labels as number[]) : []

    //會員標籤
    memberFilterTag = memberTag.filter((tag) => memberTagIds.includes(tag.id))
    dialogMemberData[0].member_tag = memberFilterTag
  }

  //取得所有會員標籤

  const memberTag: Tag[] = reactive([])

  const getMemberTag = async () => {
    const sendData = {
      enableStatus: true,
      offset: 0,
      size: 100
    }
    const res = await getMemberTagList(sendData)

    Object.assign(memberTag, res.data.list)
  }

  function getLevel(memberLevel: number) {
    for (const item of store.memberLevel) {
      if (item.value === memberLevel) {
        return item.label
      }
    }
    return ""
  }

  function onDateChange(value: { from: string; fromHms: string }, key: "dispatched_at" | "expired_at") {
    if (!dialogData.add[key]) {
      dialogData.add[key] = { from: "", fromHms: "", dateTime: "" } // 確保它是物件
    }
    dialogData.add[key].dateTime = `${value.from} ${value.fromHms}`
  }

  const downloadCsv = () => {
    const data = [
      ["account", "amount"],
      ["test1", 100],
      ["test2", 200],
      ["sjtest05g", 200]
    ]

    let csvContent = "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "csvDemo.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
</script>
