<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md editLevelWrapper">
      <q-card-section>
        <div class="text-h6 text-bold text-center">{{ $t("common.edit_commission_group") }}</div>
      </q-card-section>
      <div class="q-mt-lg q-px-lg rounded-borders">
        <EventInfo :readOnly="true" :accountOption="accountOption"></EventInfo>
      </div>
      <EligibilityThreshold v-if="showComponent" />
      <RebateRatio :readOnly="true" v-if="showComponent" />
      <!--<CommissionLimit />-->
      <q-card-actions class="row q-gutter-md item-center justify-center">
        <q-btn style="min-width: 12rem" outline :label="$t('btn.cancel')" color="primary" @click="onCancel" />
        <q-btn style="min-width: 12rem" :label="$t('btn.check')" color="primary" class="q-ml-md" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useQuasar } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import {
    getAgentMemberCommissionSettingDetail,
    updateAgentMemberCommissionSetting
  } from "@/api/agentMemberManagements"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"
  import { storeToRefs } from "pinia"
  import EventInfo from "./component/EventInfo1.vue"
  import RebateRatio from "./component/RebateRatio.vue"
  import EligibilityThreshold from "./component/EligibilityThreshold.vue"
  const { walletSwitch } = useWalletBouns()
  const { t } = useI18n()
  //const { search, tableData } = useSearch(getMemberLevelDetail)
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { genWeeksStartSun } = useCommon()
  const weeks = genWeeksStartSun()
  const store = useAgentCommissionStore()
  store.initCommissionItem()
  const { commissionItem: form } = storeToRefs(store)
  const showComponent = ref(false)
  const accountOption = ref([])

  const { search, spinShow, isSuccess, tableData } = useSearch(getAgentMemberCommissionSettingDetail)

  function goBack() {
    router.back()
  }
  onMounted(() => {
    const { commission_name } = route.query
    if (commission_name === "") {
      return
    }

    const id = route.params.id as string

    Promise.all([search(parseInt(id))])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          //goBack()
        }
        form.value.id = parseInt(id)
        form.value.currency_limit = tableData.value.currency_limit
        form.value.member_ids = tableData.value.members.map((members: { member_id: number }) => members.member_id)

        form.value.name = tableData.value.name
        form.value.billing_type = tableData.value.billing_type
        form.value.payout_method = Number(tableData.value.payout_method ?? 1)
        form.value.wallet_type = tableData.value.wallet_type
        form.value.calculation_type = tableData.value.calculation_type ?? 1

        if (tableData.value.eligibility) {
          form.value.eligibility = {
            deposit: {
              mode: tableData.value.eligibility.deposit?.mode ?? "accumulated",
              currency_threshold: { ...(tableData.value.eligibility.deposit?.currency_threshold ?? {}) }
            },
            valid_bet_amount: {
              currency_threshold: {
                ...(tableData.value.eligibility.valid_bet_amount?.currency_threshold ?? {})
              }
            }
          }
        }

        accountOption.value = tableData.value.members

        if (form.value.billing_type === "daily") {
          form.value.settlement_type = 1
        } else if (form.value.billing_type === "monthly") {
          form.value.settlement_type = 3
        } else {
          form.value.settlement_type = 2
          weeks.forEach((item) => {
            if (form.value.billing_type === item.label.split(".")[1]) {
              form.value.settlement_week = item.value
            }
          })
        }

        showComponent.value = true
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        //goBack()
      })
  })

  function onCancel() {
    router.push({ name: "AgentMemberCommissionSettingList" })
  }

  const isLoading = ref(false)

  async function onSubmit() {
    isLoading.value = true
    form.value.payout_method = Number(form.value.payout_method ?? 1)
    form.value.currency_limit.length = 0
    for (let i = 0; i < form.value.currency_limit_data.length; i++) {
      // if (form.value.currency_limit_data[i].limit !== "" || form.value.currency_limit_data[i].limit != 0) {
      if (form.value.currency_limit_data[i].limit != 0) {
        const rewardItem = {
          currency: form.value.currency_limit_data[i].currency,
          currency_id: form.value.currency_limit_data[i].currency_id,
          limit: form.value.currency_limit_data[i].limit !== "" ? form.value.currency_limit_data[i].limit : 0
        }
        form.value.currency_limit.push(rewardItem)
      }
    }

    if (form.value.settlement_type == 1) {
      form.value.billing_type = "daily"
    } else if (form.value.settlement_type == 3) {
      form.value.billing_type = "monthly"
    } else {
      weeks.forEach((item) => {
        if (item.value === form.value.settlement_week) {
          form.value.billing_type = item.label.split(".")[1]
        }
      })
    }

    const { code, msg } = await updateAgentMemberCommissionSetting(form.value)
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
      router.push({ name: "AgentMemberCommissionSettingList" })
      isLoading.value = false
    }, 500)
  }
</script>

<style lang="scss" scoped>
  /*
    ::v-deep(.q-tab) {
    width: 8%;
    flex: 0 0 auto;
  }

  .q-tab-panel {
    padding: 0 0 0 0;
  }
  :deep(.editLevelWrapper) {
    .label {
      line-height: 2.25rem;
    }

    .languageTabsWrapper {
      max-width: 30rem;

      .languageTab {
        flex: 0.5 1 auto;

        .languageTabItem {
          min-width: 1rem;
        }
      }
    }

    .avatarWrapper {
      flex: auto;

      .avatarImg {
        border-radius: 0.3125rem;
        font-size: 1.6875rem;
        width: 3.25rem;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1/1;
      }

      .avatarTips {
        font-size: 0.75rem;
      }
    }
  }*/
  .q-align-center {
    align-items: center;
  }

  .q-radio-w {
    /*width: 45%;*/
  }
  .radio-group {
    display: flex;
    flex-direction: column;
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
  .audit-multiple-container {
    width: 40%;
    border: 1px solid #999;
    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
  .audit-multiple-bottom {
    width: 150px;
  }
  .add_btn {
    width: 50%;
  }
  .b-radius {
    border-radius: 20px;
    padding: 0px 25px;
  }
  .q-markup-table.q-table__container {
    border-radius: 15px 15px 0 0;
    thead {
      tr {
        th {
          border: none !important;
          text-align: end;
          padding: 0;
          padding-right: 5px;
        }
      }
    }

    tbody {
      tr {
        &:hover {
          background-color: #fff !important;
        }
        background-color: #fff !important;
        td {
          padding: 0 !important;
          border-right: none !important;
          /* border-bottom: 1px solid #666 !important;*/
          text-align: end;
          ::v-deep(.q-field__control) {
            &::before {
              border: 0 !important;
            }
            padding-right: 5px;
          }
          ::v-deep(input.q-field__input) {
            text-align: end;
          }
        }
      }
    }
  }
</style>
