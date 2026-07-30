<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" :dialog-btn="true" @update:openDialog="openDialog" />
  </div>
  <div v-if="showComponent" class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <EventInfo>
          <template #title>
            <div class="text-h5 text-center text-bold text-grey-9">{{ $t("edit_form.promotion_edit_title") }}</div>
          </template>
        </EventInfo>
        <!-- TODO:各種優惠不同介面，自行引入模塊 -->
        <div v-if="form.type === EVENT_TYPE.Enums.DepositBonus && form.show_component">
          <BlockTags />
          <MemberLevelTags />
          <template v-if="showDepositLifetimeSection">
            <DepositLifetimeSection />
          </template>
          <template v-else>
            <CurrencyTags />
            <DepositMethodTags />
            <SingleDepositThreshold v-if="form.prize_type === PRIZE_TYPE.Enums.CASH" />
            <PromotionAmount v-if="form.prize_type === PRIZE_TYPE.Enums.CASH" />
          </template>
          <PromotionFreeGame v-if="form.prize_type === PRIZE_TYPE.Enums.FREE_GAME && !showDepositLifetimeSection" />
        </div>
        <div v-if="form.type === EVENT_TYPE.Enums.BetBonus && form.show_component">
          <BlockTags />
          <PromotionlevelAmount v-if="form.prize_type === PRIZE_TYPE.Enums.CASH" />
          <PromotionFreeGame v-if="form.prize_type === PRIZE_TYPE.Enums.FREE_GAME" />
          <Product />
        </div>

        <q-card-actions class="q-mt-xl q-py-md" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
          <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
  <PromotionGuild :open-dialog="dialog" />
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { storeToRefs } from "pinia"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "@/stores/siteStore"
  import { getPromotionDetail, updatePromotionItem } from "@/api/promotion"
  import type * as Response from "@/api/response.type"
  import type * as Request from "@/api/request.type"
  import { CURRENCY_TYPE, EVENT_TYPE, BONUS_WALLET_TYPE, LANGUAGE_TYPE, PRIZE_TYPE } from "@/utils/constants"
  import EventInfo from "./component/EventInfo.vue"
  import BlockTags from "./component/BlockTags.vue"
  import MemberLevelTags from "./component/MemberLevelTags.vue"
  import CurrencyTags from "./component/CurrencyTags.vue"
  import DepositMethodTags from "./component/DepositMethodTags.vue"
  import SingleDepositThreshold from "./component/SingleDepositThreshold.vue"
  import PromotionAmount from "./component/PromotionAmount.vue"
  import PromotionlevelAmount from "./component/PromotionlevelAmount.vue"
  import Product from "./component/Product.vue"
  import PromotionGuild from "./component/PromotionGuild.vue"
  import { useEnv } from "src/hook/useEnv"
  import SubPage from "layouts/SubPage/Index.vue"
  import PromotionFreeGame from "@/pages/Promotion/PromotionSetting/component/PromotionFreeGame.vue"
  import { useCommon } from "@/hook/useCommon"
  import DepositLifetimeSection from "@/pages/Promotion/PromotionSetting/Add/DepositLifetimeSection.vue"
  import {
    buildDepositLifetimeRewards,
    ensureDepositLifetimeState,
    hydrateDepositLifetimeState,
    isDepositLifetimeFlow,
    syncRewardRangeMode,
    validateDepositLifetimeConfig
  } from "@/pages/Promotion/PromotionSetting/Add/depositLifetime"
  import { normalizeSelectableFreeRoundWalletTypeWhenReady } from "@/utils/freeRoundWalletType"

  const promotionStore = usePromotionStore()
  promotionStore.initPromotionItem()
  const { promotionItem: form } = storeToRefs(promotionStore)

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const siteStore = useSiteStore()

  const { envData } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()
  const { genTimeFormat } = useCommon()
  const DATA_URL_IMAGE_PATTERN = /^data:image\/[a-zA-Z0-9.+-]+;base64,/

  const showComponent = ref(false)
  const showDepositLifetimeSection = computed(() => isDepositLifetimeFlow(form.value))

  function normalizeFreeRoundDate(value: string | number | undefined | null) {
    if (typeof value === "number") {
      return value
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Math.floor(new Date(value).getTime() / 1000)
      return Number.isNaN(parsed) ? 0 : parsed
    }

    return 0
  }

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getPromotionDetail)
  onMounted(() => {
    const id = route.params.id as string
    Promise.all([search(parseInt(id))])
      .then(() => {
        // 查無資料則踢回上一頁
        form.value.show_component = false
        if (!isSuccess.value) {
          goBack()
        }
        form.value.mode = "edit"
        form.value.id = tableData.value.id
        form.value.type = tableData.value.type
        form.value.category = tableData.value.category
        form.value.show = tableData.value.show
        form.value.count_basis = tableData.value.count_basis
        form.value.start_date = genTimeFormat(new Date(tableData.value.start_date), "yyyy-MM-dd", false)
        form.value.end_date = genTimeFormat(new Date(tableData.value.end_date), "yyyy-MM-dd", false)
        form.value.allow_same_ip = tableData.value.allow_same_ip
        form.value.auto_payout = tableData.value.auto_payout
        form.value.audit_rate = tableData.value.audit_rate
        form.value.audit_rate_source = tableData.value.audit_rate_source ?? 0
        form.value.prize_type = tableData.value.prize_type

        form.value.wallet_type = tableData.value.wallet_type || BONUS_WALLET_TYPE.Enums.GENERALLY
        //API來的資料把沒有的語系資料過濾掉
        const validLangs = siteStore.langList.map((item) => item.label)
        let filtered = tableData.value.details.filter((item: any) => validLangs.includes(item.lang))
        //如果API來的資料沒有目前設定的語系要加上去
        const promotionId = tableData.value.details[0].promotion_id
        const newEntries = siteStore.langList
          .filter((item) => !filtered.some((a: { lang: string }) => a.lang === item.label))
          .map((lang) => {
            return {
              promotion_id: promotionId,
              lang: lang.label,
              title: "",
              content: "",
              image: "",
              storage_key: ""
            }
          })
        filtered = [...filtered, ...newEntries]
        form.value.info = filtered.map((e: Response.PromotionDetail) => {
          delete e.promotions_id
          const storage_key = e.image
          if (e.image.includes("uploads")) {
            e.image = `${VITE_APP_DYNAMIC_RESOURCE_URL}/${e.image}`
          }
          return {
            ...e,
            storage_key
          }
        })

        form.value.block_label_ids = tableData.value.block_lebel.map((e: Response.PromotionBlockLebel) => e.label_id)
        form.value.member_levels = tableData.value.member_level.map((e: Response.PromotionMemberLevel) => e.level_id)
        form.value.payment_gateway = tableData.value.payment_gateway
        if (form.value.type !== EVENT_TYPE.Enums.BetBonus) {
          form.value.reward = tableData.value.reward.map((e: Response.PromotionRewardItem) => {
            form.value.rewardType = e.type
            return {
              currency: CURRENCY_TYPE.Enums[e.currency_id],
              condition: parseFloat(e.condition),
              type: e.type,
              amount: parseFloat(e.amount),
              limit: e.limit === "0" ? "" : e.limit,
              level: e.level,
              max_level: e.max_level,
              repeatable: e.repeatable
            }
          })
        } else {
          //投注優惠
          form.value.mode = "edit"
          form.value.reward = tableData.value.reward

          const rewardList = tableData.value.reward.filter((item: { condition: string }) => item.condition !== "0")
          if (rewardList.length > 0) {
            form.value.rewardType = rewardList[0].type
          }
          form.value.settlement_type = tableData.value.settlement_type
          form.value.settlement_week = tableData.value.settlement_week === 0 ? 1 : tableData.value.settlement_week
          form.value.game_type = JSON.parse(tableData.value.game_type_json)
          form.value.product_code = JSON.parse(tableData.value.product_code_json)
        }
        if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
          form.value.reward = tableData.value.reward
          form.value.reward = tableData.value.reward.map((e: Response.PromotionRewardItem) => {
            return {
              currency: CURRENCY_TYPE.Enums[e.currency_id],
              condition: parseFloat(e.condition),
              type: e.type,
              amount: parseFloat(e.amount),
              limit: e.limit === "0" ? "" : e.limit,
              level: e.level,
              max_level: e.max_level,
              repeatable: e.repeatable,
              free_round_setting: e.free_round_setting.map((setting) => ({
                ...setting,
                begin_date: normalizeFreeRoundDate(setting.begin_date),
                end_date: normalizeFreeRoundDate(setting.end_date),
                wallet_type: normalizeSelectableFreeRoundWalletTypeWhenReady(
                  setting.wallet_type,
                  siteStore.wallet_type_list,
                  siteStore.walletTypeListReady
                )
              }))
            }
          })
        }

        hydrateDepositLifetimeState(form.value, tableData.value.reward_range_mode)

        showComponent.value = true

        form.value.show_component = true
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })
  function onCancel() {
    router.push({ name: "PromotionSettingList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  function checkInfoValidity(info: Request.PromotionInfo[]): boolean {
    for (let obj of info) {
      if (obj.title === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${t(LANGUAGE_TYPE.I18nKeys[obj.lang])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.content === "") {
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

  //投注優惠金額有設定門檻時獎金是否為０
  function checkLevelDataValidity() {
    for (const levelItem of form.value.levelData) {
      const level = levelItem.level

      for (const currencyItem of levelItem.currency) {
        const { currency, condition, amount } = currencyItem

        if (
          condition !== "" &&
          (Math.round(amount) === 0 || amount === "") &&
          form.value.prize_type === PRIZE_TYPE.Enums.CASH
        ) {
          $q.notify({
            color: "green",
            message: `LV${level} 的 ${currency} ${t("error_msg.bonus_cannot_be_0")}`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }

    return true
  }
  //存款優惠金額獎金是否為０
  function checkCurrencyDataValidity() {
    for (const currencyItem of form.value.reward) {
      const { currency, condition, amount } = currencyItem

      // 檢查 condition 為 0 或 amount 等於 0
      if (
        (Number(condition) === 0 || condition === "" || Number(amount) === 0 || amount === "") &&
        form.value.prize_type === PRIZE_TYPE.Enums.CASH
      ) {
        $q.notify({
          color: "green",
          message: `${currency} ${t("error_msg.amount_cannot_be_0")}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }

    return true
  }
  function isBase64PromotionImage(value?: string) {
    return Boolean(value && DATA_URL_IMAGE_PATTERN.test(value.trim()))
  }

  function toPromotionStorageKey(value?: string) {
    if (!value) {
      return ""
    }

    const normalizedValue = value.trim()
    if (!normalizedValue || normalizedValue.startsWith("blob:") || isBase64PromotionImage(normalizedValue)) {
      return ""
    }

    const strippedValue = normalizedValue.split("#")[0].split("?")[0]
    if (/^https?:\/\//.test(strippedValue)) {
      try {
        return decodeURIComponent(new URL(strippedValue).pathname.replace(/^\/+/, ""))
      } catch (error) {
        return strippedValue
      }
    }

    return strippedValue.replace(/^\/+/, "")
  }

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Failed to convert blob to base64"))
      reader.readAsDataURL(blob)
    })
  }

  function resolvePromotionImageUrl(item: Request.PromotionInfo) {
    const normalizedStorageKey = toPromotionStorageKey(item.storage_key || item.image)
    if (normalizedStorageKey) {
      return `${VITE_APP_DYNAMIC_RESOURCE_URL}/${normalizedStorageKey}`
    }

    const normalizedImage = item.image?.trim() ?? ""
    if (/^https?:\/\//.test(normalizedImage.split("#")[0].split("?")[0])) {
      return normalizedImage.split("#")[0].split("?")[0]
    }

    return ""
  }

  async function hydratePromotionImagesBeforeSubmit(info: Request.PromotionInfo[]) {
    await Promise.all(
      info.map(async (item) => {
        if (isBase64PromotionImage(item.image)) {
          return
        }

        const imageUrl = resolvePromotionImageUrl(item)
        if (!imageUrl) {
          throw new Error(`Missing image source for ${item.lang}`)
        }

        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image for ${item.lang}: ${response.status}`)
        }

        item.image = await blobToDataUrl(await response.blob())
      })
    )
  }

  async function onSubmit() {
    console.log("form", form.value)
    syncRewardRangeMode(form.value)
    if (!checkInfoValidity(form.value.info)) {
      return false
    }

    //投注優惠
    if (form.value.type === EVENT_TYPE.Enums.BetBonus && form.value.prize_type === PRIZE_TYPE.Enums.CASH) {
      if (!checkLevelDataValidity()) {
        return false
      }
    }
    if (isDepositLifetimeFlow(form.value)) {
      ensureDepositLifetimeState(form.value)
      const { valid, message } = validateDepositLifetimeConfig(form.value, t)
      if (!valid) {
        $q.notify({
          type: "negative",
          message,
          position: "top",
          timeout: 1000
        })
        return false
      }
    } else if (form.value.type === EVENT_TYPE.Enums.DepositBonus && form.value.prize_type === PRIZE_TYPE.Enums.CASH) {
      if (!checkCurrencyDataValidity()) {
        return false
      }
    }

    isLoading.value = true
    console.log("form.value", form.value)
    try {
      await hydratePromotionImagesBeforeSubmit(form.value.info)
    } catch (error) {
      isLoading.value = false
      $q.notify({
        type: "negative",
        message: error instanceof Error ? error.message : t("error_msg.pictures_not_uploaded"),
        position: "top",
        timeout: 1000
      })
      return false
    }
    if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME && !isDepositLifetimeFlow(form.value)) {
      form.value.reward.length = 1
      form.value.reward[0].free_round_setting[0].rounds = parseInt(form.value.reward[0].free_round_setting[0].rounds)
      form.value.reward[0].free_round_setting[0].total_bet_amount =
        form.value.reward[0].free_round_setting[0].total_bet_amount || "0"
      form.value.reward[0].free_round_setting[0].bet_per_line =
        form.value.reward[0].free_round_setting[0].bet_per_line || "0"
    }
    const payload = isDepositLifetimeFlow(form.value)
      ? {
          ...form.value,
          reward: buildDepositLifetimeRewards(form.value)
        }
      : form.value

    const { code, msg } = await updatePromotionItem(payload)
    if (code !== 0) {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      return
    } else {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
    }

    setTimeout(() => {
      router.push({ name: "PromotionSettingList" })
      isLoading.value = false
    }, 500)
  }
  const dialog = ref(false)
  function openDialog() {
    dialog.value = !dialog.value
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
