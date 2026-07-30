<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("edit_form.agent_commission_ratio_setting") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section>
          <q-card-section class="q-pb-xs">
            <div class="other-group">
              <div class="row items-center d-flex direction">
                <span>{{ $t("edit_form.set_by_category") }}</span>
                <q-btn
                  outline
                  color="main-color"
                  class="b-radius-30 q-mr-md"
                  :class="{ 'bg-main-color': item.value === selectedGameType }"
                  v-for="item in filteredGameTypeDropdownList"
                  :key="item.value"
                  @click="setGameType(item.value)"
                >
                  {{ item.label }}
                </q-btn>
                <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
                  <q-btn size="md" square flat @click="categorySubStep('categoryPercent')">-</q-btn>
                  <q-number
                    v-model="categoryPercent"
                    :options="generalOptions"
                    dense
                    borderless
                    square
                    class="audit-multiple"
                  >
                    <template v-slot:append> % </template>
                  </q-number>
                  <q-btn size="md" square flat @click="categoryAddStep('categoryPercent')">+</q-btn>
                </div>
                <q-btn color="main-color" class="q-mr-md" @click="onSettingCategory">
                  {{ $t("btn.settings") }}
                </q-btn>
              </div>

              <div class="row items-center d-flex direction">
                <span>{{ $t("edit_form.set_by_currency") }}</span>
                <q-btn
                  outline
                  color="main-color"
                  class="b-radius-30 q-mr-md"
                  :class="{ 'bg-main-color': item.value === selectedSetCurrency }"
                  v-for="item in currencyDropdownList"
                  :key="item.value"
                  @click="setCurrency(item.value)"
                >
                  {{ item.label }}
                </q-btn>
                <div class="q-pt-md">
                  <div class="row items-center no-wrap audit-multiple-container">
                    <q-btn size="md" square flat @click="categorySubStep('categoryCurrency')">-</q-btn>
                    <q-number
                      v-model="categoryCurrency"
                      :options="generalOptions"
                      dense
                      borderless
                      square
                      class="audit-multiple"
                    >
                      <template v-slot:append> % </template>
                    </q-number>
                    <q-btn size="md" square flat @click="categoryAddStep('categoryCurrency')">+</q-btn>
                  </div>
                </div>
                <q-btn color="main-color" class="q-mr-md" @click="onSettingCurrency">
                  {{ $t("btn.settings") }}
                </q-btn>
              </div>
            </div>
            <div class="row tableWrapper">
              <div class="col-12">
                <q-tabs
                  v-model="filteredGameType.current"
                  dense
                  class="bg-transparent text-grey-8"
                  active-color="main-color"
                  content-class="languageTab"
                  outside-arrows
                  style="width: 100%"
                >
                  <q-tab
                    outline
                    color="main-color"
                    class="b-radius-30 q-mr-md"
                    v-for="item in filteredGameType.list"
                    :key="item.value"
                    :name="item.value"
                    :label="item.label"
                  />
                </q-tabs>
                <q-tab-panels v-model="filteredGameType.current" animated swipeable>
                  <q-tab-panel
                    v-for="item in filteredGameType.list"
                    :name="item.value"
                    :value="item.value"
                    :label="item.value"
                    class="q-px-none"
                  >
                    <q-table
                      v-if="isLoading"
                      :rows="formatTableData.rebateRateConfigList[filteredGameType.current - 1].result"
                      :columns="formatGameTableColumn"
                      row-key="id"
                      hide-pagination
                      flat
                      :pagination="{
                        rowsPerPage: 100,
                        page: 1
                      }"
                    >
                      <template v-slot:body="props">
                        <q-tr>
                          <q-td key="provider_name">
                            {{ props.row.product_name }}
                          </q-td>
                          <q-td
                            v-for="(col, idx) in formatGameTableColumn.length - 1"
                            :key="props.row.currencyRate[idx]"
                          >
                            <q-input
                              type="number"
                              v-model.number="props.row.currencyRate[idx].commission_rate"
                              class="col-6"
                              input-class="text-right"
                              outlined
                              stack-label
                              :min="0"
                              v-if="props.row.currencyRate[idx].product_code !== -1"
                            >
                              <template v-slot:append> % </template>
                            </q-input>

                            <q-input
                              type="number"
                              v-model.number="props.row.currencyRate[idx].commission_rate"
                              class="col-6"
                              style="visibility: hidden"
                              v-else
                            >
                            </q-input>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </div>
          </q-card-section>
          <div></div>
        </q-card-section>

        <q-card-actions class="q-py-md" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
          <q-btn color="main-color" class="btnSubmit" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar, CustomColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import {
    getCommissionSetting,
    getGameType,
    GetAgencyManagementDetail,
    updateCommssionSetting
  } from "@/api/agencyManagement"
  import { getProductDropdown } from "@/api/product"
  import { CURRENCY_TYPE, GAME_TYPE, LANGUAGE_TYPE } from "@/utils/constants"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/gameType"
  import { useCommon } from "@/hook/useCommon"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSiteStore } from "@/stores/siteStore"
  import { getCurrencyList } from "@/api/common"
  import { useQueryStore } from "@/stores/queryStore"

  const queryStore = useQueryStore()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const categoryPercent = ref(0)
  const categoryCurrency = ref(0)
  const selectedGameType = ref(1)
  const selectedSetCurrency = ref(0)
  const $q = useQuasar()
  const isLoading = ref(false)
  const auditMultipleStep = 0.5

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  const form = reactive<
    {
      rebate_rate_config: { game_type: string; product_code: number; currency_id: number; commission_rate: string }[]
    }[]
  >([
    {
      rebate_rate_config: []
    }
  ])

  const gameTypeDropdownList = genEnumToDropdown(Enums, GAME_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })
  const filteredGameTypeDropdownList = computed(() => {
    console.log(gameTypeDropdownList)
    return gameTypeDropdownList.filter((item) => item.value !== 0)
  })

  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })
  const language = ref({
    list: languageList,
    current: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const filteredGameType = reactive({
    list: filteredGameTypeDropdownList,
    current: filteredGameTypeDropdownList.value[0].value
  })

  type CurrencyRate = {
    commission_rate: number
    currencyId: number
    product_code: number
  }
  type ResultItem = {
    currencyRate: CurrencyRate[]
  }
  type RebateRateConfig = {
    value: number
    result: ResultItem[]
  }

  const formatTableData = reactive({
    rebateRateConfigList: [] as RebateRateConfig[]
  })

  interface newItemType {
    label?: string
    value?: number
  }
  const currencyDropdownList = reactive<newItemType[]>([])

  interface FormatResultItem {
    game_type: string
    product_id: number
    currency_id: number
    commission_rate: string
  }

  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      currencyDropdownList.length = 0
      return
    }

    console.log(data)
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      } as newItemType
      currencyDropdownList.push(newItem)
    }
  }

  const formatGameTableColumn = computed((): CustomColumn[] => {
    const providerName = "provider_name"
    const gameColumns = currencyDropdownList.map((currency) => {
      return {
        name: currency.value ? currency.value : "",
        label: currency.label || "",
        field: currency.label || "",
        sortable: false,
        align: "center"
      } as CustomColumn
    })

    // 在開頭插入 providerName
    gameColumns.unshift({
      name: providerName,
      label: t("query_params.product_name"),
      field: providerName,
      sortable: false,
      align: "center"
    } as CustomColumn)

    return gameColumns.sort((a, b) => Number(a.name) - Number(b.name))
  })
  function goBack() {
    router.back()
  }

  function mapCurrency(productCurrency: string | undefined | number) {
    // 找到對應的物件
    const mappedCurrency = currencyDropdownList.find((item) => productCurrency === item.label)

    // 如果找到則返回物件，否則返回 false
    return mappedCurrency || false
  }

  interface productItem {
    product_code: number
    product_name: string
    game_type_id: number
    currency: string
  }

  const onSettingCurrency = () => {
    formatTableData.rebateRateConfigList.forEach((item) => {
      // 目前有鎖定當下產品tab 如果不要拿掉判斷就好
      if (item.value === filteredGameType.current) {
        item.result.forEach((resultItem) => {
          resultItem.currencyRate.forEach((rateItem) => {
            if (rateItem.currencyId === selectedSetCurrency.value) {
              rateItem.commission_rate = Number(categoryCurrency.value)
            }
          })
        })
      }
    })
  }
  const onSettingCategory = () => {
    formatTableData.rebateRateConfigList.forEach((item) => {
      if (item.value === selectedGameType.value) {
        item.result.forEach((resultItem) => {
          resultItem.currencyRate.forEach((rateItem) => {
            rateItem.commission_rate = Number(categoryPercent.value)
          })
        })
      }
    })
  }

  const ProductDropdown = ref<productItem[]>([])

  const { search, spinShow, isSuccess, tableData } = useSearch(getCommissionSetting)
  let productList = ref<string[]>([])
  onMounted(async () => {
    // await getCurrency()
    const { data }: { data: productItem[] } = await getProductDropdown()
    ProductDropdown.value = data
    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) }), GetAgencyManagementDetail({ id: parseInt(id) }), getCurrencyList()])
      .then(([settingRes, detail, currencyData]) => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        } else {
          for (const [currency, id] of Object.entries(currencyData.data)) {
            if (detail.data.currency_ids.includes(id)) {
              currencyDropdownList.push({
                label: currency,
                value: id
              })
            }
          }
          console.log(tableData.value)
          // 佣金比例設定
          formData.rebate_rate_config = tableData.value
          initTable()
          isLoading.value = true
        }
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  const initTable = () => {
    // 佣金比例設定
    if (formatGameTableColumn.value.length !== 0) {
      const filteredResult = filteredGameType.list.map((gameType) => {
        // 筛选出符合当前 gameType 的数据
        const filteredItems = formData.rebate_rate_config.filter((item) => item.game_type === gameType.value)
        const result = filteredItems.map((product) => {
          const currencyRate = formatGameTableColumn.value
            .map((currencyColumn) => {
              if (currencyColumn.name === "provider_name") return null // 跳过 provider_name 列
              const mapC = mapCurrency(product.currency_id)
              const defaultData = {
                currencyId: Number(currencyColumn.name),
                currency_name: currencyColumn.label,
                commission_rate: 0,
                game_type: gameType.value,
                product_name: product.product_name,
                //product_code: -1
                product_code: product.product_code
              }
              /*//如果幣別mapiing不到那就所有幣別可以輸入 例如IDR2 先保留
              if (!mapC) {
                const matchingProductMapping = filteredItems.find((item) => item.product_name === product.product_name)
                defaultData.product_code = matchingProductMapping?.product_code ?? -1
              } else {
                const matchingProduct = filteredItems.find(
                  (item) => item.currency === currencyColumn.label && item.product_name === product.product_name
                )
                defaultData.product_code = matchingProduct ? matchingProduct.product_code : -1
              }*/
              return defaultData
            })
            .filter(Boolean) // 过滤掉 null 值

          return {
            game_type: gameType.value,
            product_name: product.product_name,
            product_code: product.product_code,
            currencyRate
          }
        })

        return {
          ...gameType,
          result
        }
      })

      formatTableData.rebateRateConfigList = filteredResult.map((group) => {
        const uniqueResult = group.result.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.product_code === item.product_code && t.product_name === item.product_name)
        )
        return { ...group, result: uniqueResult }
      })

      console.log(formatTableData.rebateRateConfigList)
      const rateMap = new Map()
      formData.rebate_rate_config.forEach(
        (item: { game_type: string; product_code: number; currency_id: number; commission_rate: string }) => {
          rateMap.set(`${item.product_code}-${item.currency_id}-${item.game_type}`, item.commission_rate)
        }
      )
      // 更新 formatTableData.rebateRateConfigList
      formatTableData.rebateRateConfigList.forEach((gameType) => {
        gameType.result.forEach(
          (product: { currencyRate: { product_code: number; commission_rate: number; currencyId: number }[] }) => {
            product.currencyRate.forEach((currency: any) => {
              // 生成匹配键
              const key = `${currency.product_code}-${currency.currencyId}-${currency.game_type}`
              if (rateMap.has(key)) {
                // 更新 rate
                currency.commission_rate = rateMap.get(key)
              }
            })
          }
        )
      })
    }
  }

  const setCurrency = (value: any) => {
    categoryPercent.value = 0
    selectedSetCurrency.value = value
  }

  const setGameType = (value: any) => {
    categoryPercent.value = 0
    selectedGameType.value = value
  }
  const [formData] = form

  function onCancel() {
    router.push({ name: "AgencyOperationManagementList_v2" })
  }
  const onSubmit = async () => {
    // Get the rebate rate configuration data
    let formatResult: any[] = []
    formatTableData.rebateRateConfigList.forEach((item) => {
      item.result.forEach((product: any) => {
        product.currencyRate.forEach((pitem: { commission_rate: number; currencyId: number; product_code: number }) => {
          if (pitem.product_code !== -1) {
            formatResult.push({
              game_type: product.game_type,
              product_code: pitem.product_code,
              currency_id: pitem.currencyId,
              commission_rate: pitem.commission_rate.toString()
            })
          }
        })
      })
    })
    formData.rebate_rate_config = formatResult

    formData.id = Number(route.params.id)

    const { search, status } = useSearch(updateCommssionSetting)
    await search(formData)

    if (status.value) {
      $q.notify({
        color: "green",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
      setTimeout(() => {
        router.push({ name: "AgencyOperationManagementList_v2" })
        isLoading.value = false
      }, 500)
    }
  }

  function updateCategoryValue(category: string, operation: (a: number, b: number) => number) {
    let target = category === "categoryPercent" ? categoryPercent : categoryCurrency

    target.value = typeof target.value === "string" ? parseFloat(target.value) : target.value

    if (typeof target.value !== "number" || isNaN(target.value)) {
      target.value = 0
    }
    target.value = operation(target.value as number, auditMultipleStep)
    if (target.value <= 0) {
      target.value = 0
    }
  }

  function categoryAddStep(category: string) {
    updateCategoryValue(category, preciseAdd)
  }
  function categorySubStep(category: string) {
    updateCategoryValue(category, preciseSubtract)
  }
</script>

<style scoped>
  .radio-group {
    display: flex;
    flex-direction: column;
    width: 40%;
  }

  .radio-group > div {
    display: flex;
    margin-bottom: 0.8em;
  }

  .d-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .direction {
    flex-direction: row !important;
    align-items: center !important;
  }

  .d-center {
    display: flex;
    justify-content: flex-start;
  }

  .container {
    flex-direction: column;
  }

  .other-group > * {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 1.8em 0;
  }

  .title {
    font-size: 14px;
  }

  .download {
    cursor: pointer;
    text-decoration: underline;
    color: #5298ff;
  }

  .bg-main-color {
    background: #6e39cb !important;
    color: white !important;
  }
  .tableWrapper {
    .q-tab--active {
      background: #6e39cb !important;
      color: white !important;
    }
  }

  .b-radius-30 {
    border-radius: 30px;
  }
  ::v-deep(.q-field__control) {
    min-width: 80px;
  }
  .audit-multiple ::v-deep(.q-field__native) input {
    text-align: right;
  }
  ::v-deep(.q-tab__indicator) {
    display: none;
  }

  ::v-deep(.languageTab) {
    justify-content: left !important;
  }
</style>
