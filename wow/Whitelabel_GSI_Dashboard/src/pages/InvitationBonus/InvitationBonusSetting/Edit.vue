<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage
      action-label-i18n-key="btn.edit"
      @update:openDialog="openDialog"
      back-label-i18n-key="menu.invitation_bonus"
    />
  </div>
  <div v-if="showComponent" class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <EventInfo>
          <template #title>
            <div class="text-h5 text-bold text-dark">{{ $t("edit_form.edit_invitation_bonus") }}</div>
          </template>
        </EventInfo>
        <BlockTags />
        <q-separator class="q-my-md" />

        <ActiveMember />
        <q-separator class="q-my-md" />

        <LevelAmount />
        <q-card-actions class="q-mt-xl q-py-md" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md col-3" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
          <q-btn color="main-color" class="btnSubmit col-3" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
  <PromotionGuild :open-dialog="dialog" />
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "@/stores/siteStore"
  import { ERROR_CODE } from "@/utils/constants"
  import { getInvitationBounsDetail, updateInvitationBounsItem } from "@/api/invitationBouns"
  import type * as Request from "@/api/request.type"
  import { useQueryStore } from "@/stores/queryStore"
  import { LANGUAGE_TYPE } from "@/utils/constants"
  import EventInfo from "./component/EventInfo.vue"
  import BlockTags from "./component/BlockTags.vue"
  import ActiveMember from "./component/ActiveMember.vue"
  import LevelAmount from "./component/LevelAmount.vue"
  import SubPage from "layouts/SubPage/Index.vue"

  const invitationBonusStore = useInvitationBonusStore()
  invitationBonusStore.initItem()
  const { invitationBonusItem: form } = storeToRefs(invitationBonusStore)

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const queryStore = useQueryStore()
  const siteStore = useSiteStore()
  //const { envData } = useEnv()

  const showComponent = ref(false)

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getInvitationBounsDetail)
  const id = route.params.id as string
  onMounted(async () => {
    await queryStore.getCurrencyList()
    Promise.all([search(parseInt(id))])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }

        form.value.settlement_enabled = tableData.value.settlement_enabled
        form.value.start_date = tableData.value.period_start_at.slice(0, 10)
        form.value.end_date = tableData.value.period_end_at.slice(0, 10)
        form.value.payout_method = tableData.value.payout_method
        form.value.turnover_rate = tableData.value.turnover_rate

        form.value.labels = tableData.value.labels
        form.value.levelData = tableData.value.levels
        form.value.metrics = tableData.value.metrics

        //API來的資料把沒有的語系資料過濾掉
        const validLangs = siteStore.langList.map((item) => item.label)
        let filtered = tableData.value.i18n.filter((item: any) => validLangs.includes(item.language))
        //如果API來的資料沒有目前設定的語系要加上去
        const newEntries = siteStore.langList
          .filter((item) => !filtered.some((a: { language: string }) => a.language === item.label))
          .map((lang) => {
            return {
              language: lang.label,
              title: "",
              description_page: "",
              images: ""
            }
          })
        filtered = [...filtered, ...newEntries]
        form.value.i18n = filtered
        /*  form.value.i18n.forEach((item) => {
          if (item.images.includes("referral_signup")) {
            item.images = `${VITE_APP_BASE_API}/${item.images}`
          }
        })*/
        form.value.metrics.forEach((item) => {
          if (Number(item.valid_bet) === -1) {
            item.valid_bet = ""
          }
          if (Number(item.deposit) === -1) {
            item.deposit = ""
          }
        })

        const validCurrencyIds = queryStore.currencyList.map((item) => item.value)

        // 補齊缺少的幣別（用 currency_id 判斷）
        for (const currencyId of validCurrencyIds) {
          if (!form.value.metrics.some((setting) => setting.currency_id === currencyId)) {
            form.value.metrics.push({
              currency_id: currencyId,
              valid_bet: "0",
              deposit: "0"
            })
          }
        }
        // 移除已不存在於 currencyList 的幣別
        form.value.metrics = form.value.metrics.filter((setting) => validCurrencyIds.includes(setting.currency_id))

        form.value.levelData.forEach((level) => {
          const existingCurrencyIds = new Set(level.rewards.map((r) => r.currency_id))
          validCurrencyIds.forEach((currencyId) => {
            if (!existingCurrencyIds.has(currencyId)) {
              level.rewards.push({
                currency_id: currencyId,
                reward_amount: "0"
              })
            }
          })
          level.rewards = level.rewards.filter((r) => validCurrencyIds.includes(r.currency_id))
        })

        showComponent.value = true
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })
  function onCancel() {
    router.push({ name: "InvitationBonusSettingList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  function checkInfoValidity(info: Request.InvitationBonusInfo[]): boolean {
    for (let obj of info) {
      if (obj.title === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_event_name")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } /*else if (obj.description_page === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.please_enter_content")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      } else if (obj.images === "") {
        $q.notify({
          type: "negative",
          message: `${t("error_msg.pictures_not_uploaded")} (${t(LANGUAGE_TYPE.I18nKeys[obj.language])})`,
          position: "top",
          timeout: 1000
        })
        return false
      }*/
    }
    return true
  }

  async function onSubmit() {
    if (!checkInfoValidity(form.value.i18n)) {
      return false
    }
    const levelData = form.value.levelData

    for (let i = 0; i < levelData.length; i++) {
      const current = levelData[i]

      if (current.active_member_count === "") {
        $q.notify({
          type: "negative",
          message: `${current.level_name}  ${t("error_msg.active_member_cannot_empty")}`,
          position: "top",
          timeout: 1000
        })
        return false
      }

      const currentCount = Number(current.active_member_count)
      for (let j = 0; j < i; j++) {
        const prevCount = Number(levelData[j].active_member_count)
        if (currentCount <= prevCount) {
          $q.notify({
            type: "negative",
            message: `${current.level_name}  ${t("error_msg.the_number_active_members_cannot_less")} ${
              levelData[j].level_name
            }`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }

      //處理 reward_amount 補 0
      current.rewards.forEach((reward) => {
        if (reward.reward_amount === "") {
          reward.reward_amount = "0"
        }
      })
    }

    form.value.levelData.forEach((item: { active_member_count: string | number }) => {
      item.active_member_count = parseInt(item.active_member_count)
    })

    isLoading.value = true

    const { code, msg } = await updateInvitationBounsItem(form.value, parseInt(id))
    isLoading.value = false
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
    } else if (code === ERROR_CODE.Enums.CAMPAIGN_TIME_OVERLAP_EDIT) {
      $q.notify({
        type: "negative",
        message: t("error_msg.the_event_period_overlaps"),
        position: "top",
        timeout: 1000
      })
      return
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
      return
    }

    setTimeout(() => {
      router.push({ name: "InvitationBonusSettingList" })
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
