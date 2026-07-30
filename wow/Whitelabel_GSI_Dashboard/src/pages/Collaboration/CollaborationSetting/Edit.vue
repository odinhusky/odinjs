<template>
  <div v-if="showComponent" class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <EventInfo>
          <template #title>
            <div class="text-h5 text-center text-bold text-grey-9">{{ $t("edit_form.copy_setting") }}</div>
          </template>
        </EventInfo>

        <!-- 活躍會員條件設定 -->
        <DepositAmount />
        <!-- 新會員有效投注額條件 -->
        <BetAmount />
        <!-- 反佣設定 -->
        <LevelAmount />

        <q-card-actions class="q-mt-xl q-py-md" align="center">
          <q-btn color="main-color" class="btnSubmit col-3" size="20px" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useCollaborationStore } from "@/stores/collaborationStore"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "@/stores/siteStore"
  import { getCollaborationSetting, updateCollaborationSetting } from "@/api/collaboration"
  import type * as Request from "@/api/request.type"
  import { LANGUAGE_TYPE } from "@/utils/constants"
  import EventInfo from "./component/EventInfo.vue"
  import BetAmount from "./component/BetAmount.vue"
  import DepositAmount from "./component/DepositAmount.vue"
  import LevelAmount from "./component/LevelAmount.vue"
  import { useEnv } from "src/hook/useEnv"
  import { getCurrencyList } from "@/api/common"

  const collaborationStore = useCollaborationStore()
  collaborationStore.initCollaborationItem()
  const { collaborationItem: form } = storeToRefs(collaborationStore)

  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()

  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()

  const showComponent = ref(false)

  function goBack() {
    router.back()
  }

  const { search, isSuccess, tableData } = useSearch(getCollaborationSetting)
  onMounted(() => {
    Promise.all([search(), getCurrencyList()])
      .then(([listResponse, currency]) => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
        form.value.basic_setting.rebate = tableData.value.basic_setting.rebate
        form.value.basic_setting.show = tableData.value.basic_setting.show
        form.value.basic_setting.settlement_type =
          tableData.value.basic_setting.settlement_type === 0 ? 1 : tableData.value.basic_setting.settlement_type
        form.value.basic_setting.settlement_week =
          tableData.value.basic_setting.settlement_week === 0 ? 1 : tableData.value.basic_setting.settlement_week

        form.value.basic_setting.calculation_type = tableData.value.basic_setting.calculation_type

        //API來的資料把沒有的語系資料過濾掉
        const validLangs = siteStore.langList.map((item) => item.label)
        let filtered = tableData.value.content_settings.filter((item: any) => validLangs.includes(item.lang))
        //如果API來的資料沒有目前設定的語系要加上去
        const newEntries = siteStore.langList
          .filter((item) => !filtered.some((a: { lang: string }) => a.lang === item.label))
          .map((lang) => {
            return {
              lang: lang.label,
              title: "",
              detail: "",
              image: ""
            }
          })
        filtered = [...filtered, ...newEntries]
        form.value.content_settings = filtered.map((e: Request.CollaborationContent) => {
          if (e.image.includes("uploads")) {
            e.image = `${VITE_APP_BASE_API}/${e.image}`
          }
          return e
        })
        form.value.active_member_settings = tableData.value.active_member_settings

        // 補齊 currency 資料中缺少的幣種
        for (const [currencyCode, currencyId] of Object.entries(currency.data)) {
          if (!form.value.active_member_settings.some((setting) => setting.currency_id === currencyId)) {
            form.value.active_member_settings.push({
              currency_id: currencyId,
              currency_code: currencyCode,
              deposit_amount: 0,
              valid_bet_amount: 0
            })
          }
        }

        form.value.active_member_settings.forEach((setting) => {
          const matchedCurrency = Object.entries(currency.data).find(
            ([currencyCode, currencyId]) => currencyId === setting.currency_id
          )
          if (matchedCurrency) {
            setting.currency_code = matchedCurrency[0]
          }
        })

        // 刪除 currency 資料中不存在的幣種
        form.value.active_member_settings = form.value.active_member_settings.filter((setting) =>
          Object.keys(currency.data).includes(setting.currency_code)
        )

        form.value.rebate_settings = tableData.value.rebate_settings

        showComponent.value = true
      })
      .catch((e: any) => {
        console.log(e)
      })
  })

  const $q = useQuasar()
  const isLoading = ref(false)
  function checkInfoValidity(info: Request.CollaborationContent[]): boolean {
    for (let obj of info) {
      if (obj.title === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.detail === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_content")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.image === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
    return true
  }

  function validateLevels() {
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

      // 檢查 net_profit
      const currentNetProfit = currentLevel.net_profit
      const previousNetProfit = previousLevel.net_profit

      for (let prevProfit of previousNetProfit) {
        const currProfit = currentNetProfit.find((p) => p.currency_id === prevProfit.currency_id)
        if (!currProfit || parseFloat(String(currProfit.amount)) < parseFloat(String(prevProfit.amount))) {
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
  async function onSubmit() {
    if (!checkInfoValidity(form.value.content_settings)) {
      return false
    }
    if (!validateLevels()) {
      return false
    }

    console.log(form.value)

    isLoading.value = true
    const { code, msg } = await updateCollaborationSetting(form.value)
    if (code !== 0) {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      isLoading.value = false
    } else {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
      setTimeout(() => {
        isLoading.value = false
        location.reload()
      }, 500)
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep(input) {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
</style>
