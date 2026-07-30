<template>
  <div class="q-pa-md">
    <q-card class="editWrapper_v2 bg-white">
      <q-form style="padding-left: 6%; padding-right: 6%; max-width: 63.75rem" class="q-mx-auto" v-if="isLoading">
        <q-card-section>
          <div class="bold h1-bold text-center grey">{{ $t("menu.commission_rate_setting") }}</div>
        </q-card-section>
        <q-card-section style="padding-top: 0" class="q-pb-sm">
          <EventInfo>
            <template #title>
              <div class="text-h5 text-bold text-dark">{{ $t("edit_form.promotion_edit_title") }}</div>
            </template>
          </EventInfo>
        </q-card-section>
        <DepositAmount />
        <ActiveSetting />
        <q-card-actions class="q-py-md" align="center">
          <q-btn color="main-color" class="btnSubmit" :loading="submitLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, watch } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar, CustomColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { useShareholderProxyStore } from "@/stores/shareholderProxyStore"
  import { storeToRefs } from "pinia"

  import { getShareholdersSetting, updateShareholdersSetting } from "@/api/shareholdersSetting"

  import { CURRENCY_TYPE, GAME_TYPE, LANGUAGE_TYPE, SETTLEMENT_CYCLE, SEND_TYPE } from "@/utils/constants"
  import BlockTags from "./component/BlockTags.vue"
  import EventInfo from "./component/EventInfo.vue"
  import DepositAmount from "./component/DepositAmount.vue"
  import ActiveSetting from "./component/ActiveSetting.vue"

  import { useCommon } from "@/hook/useCommon"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSiteStore } from "@/stores/siteStore"
  import { getCurrencyList } from "@/api/common"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const queryStore = useQueryStore()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const shareholderProxyStore = useShareholderProxyStore()
  shareholderProxyStore.initProxyItem()
  const { proxyItem: form } = storeToRefs(shareholderProxyStore)

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()

  const $q = useQuasar()
  const isLoading = ref(false)
  const submitLoading = ref(false)

  type CurrencyRate = {
    rate: number
    currencyId: number
    product_code: number
  }

  interface newItemType {
    label?: string
    value?: number
  }
  const currencyDropdownList = reactive<newItemType[]>([])

  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      currencyDropdownList.length = 0
      return
    }
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      } as newItemType
      currencyDropdownList.push(newItem)
    }
  }

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getShareholdersSetting)

  onMounted(() => {
    Promise.all([search(), getCurrencyList()])
      .then(([listResponse, currency]) => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }

        //form.titles = result
        // 語系設定
        //const result = siteStore.langList
        // form.titles = result
        form.value.settlement_enabled = tableData.value.settlement_enabled
        form.value.show_agent_details = tableData.value.show_agent_details
        form.value.payout_method = tableData.value.payout_method === 0 ? 1 : tableData.value.payout_method
        form.value.settlement_cycle = tableData.value.settlement_cycle === 0 ? 1 : tableData.value.settlement_cycle
        form.value.settlement_day = tableData.value.settlement_day === 0 ? 1 : tableData.value.settlement_day
        form.value.turnover_rate = tableData.value.turnover_rate

        form.value.base_rate = tableData.value.base_rate
        form.value.rate_decay = tableData.value.rate_decay
        //API來的資料把沒有的語系資料過濾掉
        const validLangs = siteStore.langList.map((item) => item.label)
        let filtered = tableData.value.i18n.filter((item: any) => validLangs.includes(item.language))
        //如果API來的資料沒有目前設定的語系要加上去
        const newEntries = siteStore.langList
          .filter((item) => !filtered.some((a: { language: string }) => a.language === item.label))
          .map((lang) => {
            return {
              language: lang.label,
              description_page: ""
            }
          })
        filtered = [...filtered, ...newEntries]
        form.value.i18n = filtered
        form.value.metrics = tableData.value.metrics || []
        // 補齊 currency 資料中缺少的幣種
        for (const [currencyCode, currencyId] of Object.entries(currency.data)) {
          if (!form.value.metrics.some((setting) => setting.currency_id === currencyId)) {
            form.value.metrics.push({
              currency_id: currencyId,
              currency_code: currencyCode,
              total_deposit: 0,
              total_valid_bet: 0,
              commission_cap: 0
            })
          }
        }
        form.value.metrics.forEach((setting) => {
          const matchedCurrency = Object.entries(currency.data).find(
            ([currencyCode, currencyId]) => currencyId === setting.currency_id
          )
          if (matchedCurrency) {
            setting.currency_code = matchedCurrency[0]
          }
        })
        // 刪除 currency 資料中不存在的幣種
        form.value.metrics = form.value.metrics.filter((setting) =>
          Object.keys(currency.data).includes(setting.currency_code)
        )

        form.value.active_levels = tableData.value.active_levels || []
        form.value.rate_base = tableData.value.rate_base
        isLoading.value = true
      })
      .catch((e: any) => {
        console.log(e)
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  function onCancel() {
    router.push({ name: "CommissionSettingList" })
  }

  const onSubmit = async () => {
    // 處理 levelData
    form.value.levelData.forEach((item) => {
      if (item.required_members === "" || Number(item.required_members) < 0) {
        item.required_members = 0
      }
      if (item.rate === "" || Number(item.rate) < 0) {
        item.rate = 0
      }
    })

    // 處理 metrics
    form.value.metrics.forEach((item) => {
      if (item.total_deposit === "" || Number(item.total_deposit) < 0) {
        item.total_deposit = 0
      }
      if (item.total_valid_bet === "" || Number(item.total_valid_bet) < 0) {
        item.total_valid_bet = 0
      }
      if (item.commission_cap === "" || Number(item.commission_cap) < 0) {
        item.commission_cap = 0
      }
    })
    form.value.base_rate = form.value.base_rate === "" ? 0 : form.value.base_rate
    form.value.rate_decay = form.value.rate_decay === "" ? 0 : form.value.rate_decay

    for (let i = 0; i < form.value.levelData.length; i++) {
      for (let j = i + 1; j < form.value.levelData.length; j++) {
        const low = form.value.levelData[i]
        const high = form.value.levelData[j]

        if (Number(low.required_members) >= Number(high.required_members)) {
          $q.notify({
            color: "red",
            message: `LV${low.level}  ${t("edit_form.active_member_count")}${t("error_msg.cannot_less_than_equa")}  LV${
              high.level
            }`,
            position: "top",
            timeout: 1000
          })
          return
        }

        if (Number(low.rate) >= Number(high.rate)) {
          $q.notify({
            color: "red",
            message: `LV${low.level}  ${t("edit_form.commission_rate")}${t("error_msg.cannot_less_than_equa")}  LV${
              high.level
            }`,
            position: "top",
            timeout: 1000
          })
          return
        }
      }
    }
    form.value.active_levels = form.value.levelData
    submitLoading.value = true
    try {
      const response = await updateShareholdersSetting(form.value)

      if (response?.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top",
          timeout: 300
        })
        setTimeout(() => {
          location.reload()
        }, 500)
      } else {
        $q.notify({
          type: "negative",
          message: response.msg,
          position: "top",
          timeout: 300
        })
      }
      submitLoading.value = false
    } catch (error) {
      // Log the error response
      console.log("Error Response:", error)
    }
  }
</script>
<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/setting.scss";
</style>
