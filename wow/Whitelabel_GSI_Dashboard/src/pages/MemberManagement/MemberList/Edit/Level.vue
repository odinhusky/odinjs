<template>
  <q-card class="q-py-md no-shadow editWrapper">
    <q-form>
      <q-card-section>
        <div class="text-bold q-mb-md text-left">{{ $t("table_header.level_name") }}</div>
        <div class="row q-col-gutter-md">
          <div class="col-5 languageTabsWrapper">
            <q-tabs
              v-model="language.current"
              dense
              class="bg-transparent text-grey-8"
              active-color="main-color"
              content-class="languageTab"
              outside-arrows
            >
              <q-tab
                v-for="(lang, key) in language.list"
                :key="key"
                :name="lang.value"
                :label="lang.label"
                class="q-px-none"
                content-class="languageTabItem"
              />
            </q-tabs>

            <q-tab-panels v-model="language.current" animated swipeable>
              <q-tab-panel
                v-for="(lang, key) in language.list"
                :name="lang.value"
                :label="lang.value"
                class="q-px-none"
              >
                <div class="text-h6">
                  <q-input
                    v-model.trim="formData.lang[lang.label]"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    disable
                    :placeholder="$t('common.please_enter_content')"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>

          <div class="col-2 q-col-gutter-md avatarWrapper">
            <div class="label text-left">{{ $t("common.vip_avatar") }}</div>
            <div class="row q-pt-none" style="padding-top: 0.3125rem; align-items: center; display: flex">
              <div class="q-mr-md avatarImg">
                <PreviewImage
                  :parentImage="formData.img"
                  :defaultImage="addAvatarDefault()"
                  :aspectRatio="'52/52'"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="col-3">
            <div class="label text-left">{{ $t("table_header.remark") }}</div>
            <q-input
              v-model="formData.remark"
              outlined
              dense
              hide-bottom-space
              outline
              borderless
              disable
              :placeholder="$t('common.please_enter_content')"
              class="q-pt-md"
              style="max-width: 31.25rem"
            />
          </div>
          <div class="col-2">
            <div class="label text-left">{{ $t("table_header.number_of_withdrawals") }}</div>
            <q-input
              v-model="formData.withdraw_count"
              outlined
              dense
              hide-bottom-space
              outline
              borderless
              disable
              :placeholder="$t('common.please_enter_content')"
              class="q-pt-md"
              style="max-width: 31.25rem"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pt-xs" v-if="!spinShow">
        <div class="row q-col-gutter-md">
          <!-- 晉級設置 -->
          <div class="col-12 col-md-6 q-mb-md multiTable">
            <div class="text-bold q-mb-md text-left">{{ $t("common.promotion_settings") }}</div>
            <div class="row items-center">
              <div class="text-bold q-mb-md text-left">{{ $t("table_header.promotion_calculation_method") }}</div>
              <q-option-group
                v-model="formData.level_up_tags"
                :options="levelUpTags"
                color="primary"
                class="row q-mb-md"
                :disable="true"
              />
            </div>
            <q-markup-table square separator="none">
              <thead thead class="bg-success">
                <tr>
                  <th rowspan="2">{{ $t("table_header.currency") }}</th>
                  <th colspan="2">{{ $t("table_header.level_up_condition") }}</th>
                </tr>
                <tr>
                  <th>{{ $t("table_header.validate_bet") }}</th>
                  <th>{{ $t("table_header.deposit_amount") }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in queryStore.currencyList" :key="index">
                  <!-- 幣別 -->
                  <td key="currency">
                    {{ item.label }}
                  </td>

                  <!-- 有效投注 -->
                  <q-td key="valid_betting">
                    <q-number
                      v-model="formData.valid_bet_amount[item.value]"
                      :options="generalOptions"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      disable
                    />
                  </q-td>

                  <!-- 存款金額 -->
                  <q-td key="deposit_amount">
                    <q-number
                      v-model="formData.deposit_amount[item.value]"
                      :options="generalOptions"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      disable
                    />
                  </q-td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div class="col-12 col-md-6 q-mb-md multiTable">
            <div class="text-bold q-mb-md text-left">{{ $t("table_header.gift_money_settings") }}</div>
            <q-markup-table square separator="none">
              <thead thead class="bg-success">
                <tr>
                  <th rowspan="2">{{ $t("table_header.currency") }}</th>
                  <th colspan="2">{{ $t("table_header.level_up_offer") }}</th>
                </tr>
                <tr>
                  <th>{{ $t("table_header.level_up_reward") }}</th>
                  <th>{{ $t("table_header.birthday_reward") }}</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in queryStore.currencyList" :key="index">
                  <!-- 幣別 -->
                  <td key="currency">
                    {{ item.label }}
                  </td>

                  <q-td key="level_up_reward">
                    <q-number
                      v-model="formData.promotion_bonus[item.value]"
                      :options="generalOptions"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      disable
                    />
                  </q-td>

                  <q-td key="birthday_reward">
                    <q-number
                      v-model="formData.birthday_bonus[item.value]"
                      :options="generalOptions"
                      outlined
                      dense
                      hide-bottom-space
                      outline
                      borderless
                      disable
                    />
                  </q-td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <!--end-->
        </div>
      </q-card-section>

      <!-- <q-card-section class="q-pb-xs">
        <div class="text-h6 text-bold">{{ $t("common.deposit_method_settings") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-xs" v-if="!spinShow">

        <div v-for="(label, value) in typeList" :key="value">
          <SelectAllOptionGroup
            :parentValue="formData.deposit_label"
            :group-options="getDepositList(value)"
            :read-only="readOnly"
            @update:parentValue="handelDepositTags"
            :selectAllLabel="label"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pb-xs">
        <div class="text-h6 text-bold">{{ $t("common.withdrawal_method_settings") }}</div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div v-for="(label, value) in typeList" :key="value">
          <SelectAllOptionGroup
            :parentValue="formData.withdraw_label"
            :group-options="getWithdrawList(value)"
            :read-only="readOnly"
            @update:parentValue="handelWithdrawTags"
            :selectAllLabel="label"
          />
        </div>
      </q-card-section>
    -->
      <q-card-actions v-if="!readOnly" class="q-py-md" align="center">
        <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
          {{ $t("btn.cancel") }}
        </q-btn>
        <q-btn color="main-color" class="btnSubmit" :loading="spinShow" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { getMemberLevel, getMemberDetail, getPaymentTypeList, getGatewayList } from "@/api/member"
  import type { QTableProps } from "quasar"
  import type { MemberInfoLevelItem, MemberLevelLangTitle } from "@/api/response.type"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { CURRENCY_TYPE, LANGUAGE_TYPE, LEVEL_UP_TYPE } from "@/utils/constants"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useImage } from "@/hook/useImage"
  import relativeToAbsoluteResource from "@/utils/relativeToAbsoluteResource"
  import { useEnv } from "src/hook/useEnv"
  import { useLanguage } from "src/composables/useLanguage"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const queryStore = useQueryStore()
  const default_limit = ref(0)
  const readOnly = ref(true)
  const spinShow = ref(true)
  const { addAvatarDefault } = useImage()
  const { envData } = useEnv()
  const { VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { getAgentSetting } = useLanguage()

  interface Language {
    label: string
    value: number
  }
  interface LanguageState {
    list: Language[]
    current: number
  }
  const levelUpTags = computed(() =>
    Object.values(LEVEL_UP_TYPE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(LEVEL_UP_TYPE.I18nKeys[item as keyof typeof LEVEL_UP_TYPE.I18nKeys]),
        value: item
      }))
  )

  const { enumToArray } = useCommon()
  const currencyList = computed(() => {
    const currencies: CURRENCY_TYPE.Enums[] = enumToArray(CURRENCY_TYPE.Enums)

    return currencies.map((e) => {
      const currencyId = CURRENCY_TYPE.Enums[e] as any as CURRENCY_TYPE.Enums
      const label = t(CURRENCY_TYPE.I18nKeys[currencyId as CURRENCY_TYPE.Enums])
      const value = e
      return { label, value }
    })
  })

  const generalOptions = {
    min: 0,
    precision: "0",
    nullValue: "0"
  }
  const precision = {
    min: "0%",
    precision: "0%",
    nullValue: "0%"
  }
  const form = reactive<MemberInfoLevelItem[]>([
    {
      lang: {},
      img: "",
      withdraw_count: 0,
      remark: "",
      level_up_tags: 1,
      promotion_type: 0,
      valid_bet_amount: {},
      deposit_amount: {},
      promotion_bonus: {},
      birthday_bonus: {}
    }
  ])

  function goBack() {
    router.back()
  }

  const [formData] = form
  /*let typeList = reactive({})
  let depositList = reactive([])
  let withdrawList = reactive([])*/
  let languageList: Language[] = reactive([])
  let language: LanguageState = reactive({
    list: [],
    current: 0
  })

  onMounted(async () => {
    try {
      await getAgentSetting()
      languageList = siteStore.langList.map((e) => {
        const label = e.label
        const value = e.value
        return {
          label,
          value
        }
      })
      language.list = languageList
      language.current = languageList[0].value

      const memberLevel = await getMemberInfo(parseInt(route.params.id as string))
      await getMemberLevelDetail(memberLevel)
      // typeList = await getTypeList()

      //待API完成
      /*const getTypeDetailPromises = Object.keys(typeList).map((id) => getTypeDetail(id))
      await Promise.all(getTypeDetailPromises)*/
      /*測試用*/
      //const getTypeDetailPromises = await getTypeDetail(1)
    } catch (error) {
      // 取得資料失敗則踢回上一頁
      //goBack()
    }
  })
  //取得充值提款的支付類型列表
  const getTypeList = async () => {
    try {
      //const list = await getPaymentTypeList()
      //假資料
      const list = {
        "1": t("table_header.money_transfer"),
        "2": t("table_header.electronic_wallet"),
        "3": t("table_header.third_party_payment")
      }
      return list
    } catch (error) {
      //goBack()
    }
  }
  //取得該筆存提款的清單(用支付類型列表來取得
  /* const getTypeDetail = async (id: number) => {
    try {
      //const detail = await getGatewayList(id)
      //假資料
      const detail = [
        {
          id: 1,
          name: t("bank_card.farmers"),
          type: 1,
          display: true,
          deposit: true,
          withdraw: true,
          currency: 1,
          operational_status: false
        },
        {
          id: 2,
          name: t("bank_card.hsbc"),
          type: 1,
          display: true,
          deposit: true,
          withdraw: true,
          currency: 1,
          operational_status: false
        },
        {
          id: 3,
          name: t("electronic_wallet.gc"),
          type: 2,
          display: true,
          deposit: true,
          withdraw: true,
          currency: 1,
          operational_status: false
        },
        {
          id: 4,
          name: t("electronic_wallet.go"),
          type: 3,
          display: true,
          deposit: true,
          withdraw: true,
          currency: 1,
          operational_status: false
        }
      ]
      //整理出充值跟提款各要顯示的列表
      detail.forEach((item: any) => {
        if (item.deposit && item.withdraw) {
          depositList.push(item)
          withdrawList.push(item)
        } else if (item.deposit) {
          depositList.push(item)
        } else if (item.withdraw) {
          withdrawList.push(item)
        }
      })

      return detail
    } catch (error) {
      // goBack()
    }
  }*/
  //取得層級資料
  const getMemberLevelDetail = async (id: number) => {
    try {
      const sendData = {
        id: id
      }
      const { data } = await getMemberLevel(sendData)

      if (!data || !Object.keys(data).length) {
        //goBack()
        return
      }
      formData.lang = data.lang
      formData.remark = data.remark
      //const absolutePath = relativeToAbsoluteResource(data.img)
      formData.img = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${data.img}`
      formData.withdraw_count = data.withdraw_count

      const validBetAmount: { [key: string]: number | string } = {}
      const depositAmount: { [key: string]: number | string } = {}

      data.condition.forEach((item: { currency_id: number; valid_bet_amount: number; deposit_amount: number }) => {
        validBetAmount[item.currency_id] = item.valid_bet_amount
        depositAmount[item.currency_id] = item.deposit_amount
      })

      formData.valid_bet_amount = validBetAmount
      formData.deposit_amount = depositAmount

      const promotion_bonus: { [key: string]: number | string } = {}
      const birthday_bonus: { [key: string]: number | string } = {}

      data.reward.forEach((item: { currency_id: number; promotion_bonus: number; birthday_bonus: number }) => {
        promotion_bonus[item.currency_id] = item.promotion_bonus
        birthday_bonus[item.currency_id] = item.birthday_bonus
      })
      formData.promotion_bonus = promotion_bonus
      formData.birthday_bonus = birthday_bonus

      formData.level_up_tags = data.promotion_type === 0 ? 1 : data.promotion_type
      spinShow.value = false
    } catch (error) {
      console.log(error)
      // goBack()
    }
  }

  const getMemberInfo = async (id: number) => {
    const sendData = {
      id: id
    }
    const { data } = await getMemberDetail(sendData)
    if (!data || !Object.keys(data).length) {
      goBack()
      return
    }

    return data.member_level
  }
  //選出充值各type的值
  /*const getDepositList = (type: number) => {
    const filteredData = depositList.filter((item) => item.type === parseInt(type))
    const transformedData = filteredData.map(({ id, name }) => ({ label: name, value: id }))
    return transformedData
  }

  const getWithdrawList = (type: number) => {
    const filteredData = withdrawList.filter((item) => item.type === parseInt(type))
    const transformedData = filteredData.map(({ id, name }) => ({ label: name, value: id }))
    return transformedData
  }*/

  const handelDepositTags = (value: number[]) => {
    console.log(value)
    //formData.deposit_label = value
  }
  const handelWithdrawTags = (value: number[]) => {
    console.log(value)
    //formData.deposit_label = value
  }
  const promotionTableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "validate_bet",
      label: t("table_header.validate_bet"),
      field: "validate_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_amount",
      label: t("table_header.deposit_amount"),
      field: "deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "level_up_reward",
      label: t("table_header.level_up_reward"),
      field: "level_up_reward",
      sortable: false,
      align: "center"
    },
    {
      name: "birthday_reward",
      label: t("table_header.birthday_reward"),
      field: "birthday_reward",
      sortable: false,
      align: "center"
    }
  ])
  const withdrawalSettingsTableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "bank_card",
      label: t("table_header.bank_card"),
      field: "bank_card",
      sortable: false,
      align: "center"
    },
    {
      name: "third_party_payment",
      label: t("table_header.third_party_payment"),
      field: "third_party_payment",
      sortable: false,
      align: "center"
    },
    {
      name: "electronic_wallet",
      label: t("table_header.electronic_wallet"),
      field: "electronic_wallet",
      sortable: false,
      align: "center"
    },
    {
      name: "audit_ratio",
      label: t("table_header.audit_ratio"),
      field: "audit_ratio",
      sortable: false,
      align: "center"
    }
  ])
  const WithdrawLimitTableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "withdraw_limit_amount",
      label: t("table_header.withdraw_limit_amount"),
      field: "withdraw_limit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "withdraw_count",
      label: t("table_header.withdraw_count"),
      field: "withdraw_count",
      sortable: false,
      align: "center"
    },
    {
      name: "bank_card",
      label: t("table_header.bank_card"),
      field: "bank_card",
      sortable: false,
      align: "center"
    },
    {
      name: "third_party_payment",
      label: t("table_header.third_party_payment"),
      field: "third_party_payment",
      sortable: false,
      align: "center"
    },
    {
      name: "electronic_wallet",
      label: t("table_header.electronic_wallet"),
      field: "electronic_wallet",
      sortable: false,
      align: "center"
    },
    {
      name: "failure_to_meet_fees",
      label: t("table_header.failure_to_meet_fees"),
      field: "failure_to_meet_fees",
      sortable: false,
      align: "center"
    }
  ])
  function onCancel() {
    router.push({ name: "MemberList" })
  }
  function onSubmit() {}

  /*const $q = useQuasar()
    const isLoading = ref(false)
    function onSubmit() {
      isLoading.value = true
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })

      // 待確定修改後是否退回到會員列表
      setTimeout(() => {
        router.push({ name: "MemberList" })
        isLoading.value = false
      }, 500)
    }*/

  /* const handelBankCardTags = (value: number[]) => {
      formData.deposit_bank_card = value
    }
    const handelElectronicWalletTags = (value: number[]) => {
      formData.deposit_electronic_wallet = value
    }
    const handelThirdPaymentTags = (value: number[]) => {
      formData.deposit_third_payment = value
    }
    const handelWithdrawBankCardTags = (value: number[]) => {
      formData.withdraw_bank_card = value
    }
    const handelWithdrawElectronicWalletTags = (value: number[]) => {
      formData.withdraw_electronic_wallet = value
    }
    const handelWithdrawThirdPaymentTags = (value: number[]) => {
      formData.withdraw_third_payment = value
    }*/
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  ::v-deep(.q-tab) {
    width: 13%;
    flex: 0 0 auto;
  }

  .q-tab-panel {
    padding: 0 0 0 0;
  }

  /*輸入框相關*/
  // ::v-deep(.q-field--outlined .q-field__control) {
  //   border-radius: 7px;
  // }

  ::v-deep(.q-field--outlined .q-field__control:before) {
    border: 1px solid rgba(0, 0, 0, 0.24) !important;
    transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  ::v-deep(.q-field--outlined .q-field__control:hover:before) {
    border: 1px solid rgba(0, 0, 0, 0.24);
    box-shadow: unset;
  }

  ::v-deep(.q-field--disabled .q-field__control) {
    background-color: rgba(194, 194, 202, 0.3);
  }

  ::v-deep(.q-tabs__content--align-center) {
    justify-content: left;
  }
  .avatarImg {
    width: 52px;
    height: 52px;
  }
  /*輸入框相關 end*/

  /* .q-field--outlined .q-field__control:hover:before {
    border: none !important;
    box-shadow: 0px 6px 12px #4a54605f;
  }*/
  .multiTable {
    .no-hover .q-td:hover,
    .no-hover .q-tr:hover {
      background-color: transparent !important;
      color: inherit !important;
    }
    .q-item-center {
      align-items: center;
    }
    .no-box-shadow {
      box-shadow: none;
    }
    ::v-deep(.q-table) {
      border: none !important;
    }
    .q-table__container .q-table tbody tr:nth-child(even) {
      background-color: initial !important;
    }

    ::v-deep(.q-field__native, .q-field__input) {
      text-align: end !important;
    }
    ::v-deep(.q-field--outlined .q-field__control) {
      background: rgba(194, 194, 202, 0.4);
      // border-radius: 6px;
      //height: 36px;
    }
    ::v-deep(.q-field__input) {
      text-align: end;
    }

    ::v-deep(.q-table th) {
      padding: 0 0 0 0 !important;
      border-top: white 1px solid;
    }
    ::v-deep(.q-table td) {
      border-bottom: #dbe0f2 1px solid;
      border-top: #dbe0f2 1px solid;
    }
    ::v-deep(.q-table__container .q-table tbody tr td:not(:last-child)) {
      border-right: 0 !important;
    }
    ::v-deep(.q-table__container .q-table thead) {
      background-color: #652dcc !important;
      color: white;
    }
  }
</style>
