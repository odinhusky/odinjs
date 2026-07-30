<template>
  <q-card class="q-py-md no-shadow editWrapper">
    <q-form>
      <q-card-section class="q-pt-xs">
        <div class="row q-col-gutter-md">
          <div class="col-6 q-flex">
            <q-tabs v-model="formData.type" class="text-main-color">
              <q-tab name="english" :label="$t('common.english')" />
              <q-tab name="thai" :label="$t('common.thai')" />
              <q-tab name="india" :label="$t('common.india')" />
              <q-tab name="vietnam" :label="$t('common.vietnam')" />
              <q-tab name="simple" :label="$t('common.simple')" />
              <q-tab name="traditional" :label="$t('common.traditional')" />
            </q-tabs>
          </div>
          <div class="col-12" style="padding-top: 0">
            <q-tab-panels v-model="formData.type" animated style="width: 100%">
              <q-tab-panel name="english" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>

              <q-tab-panel name="thai" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>
              <q-tab-panel name="india" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>
              <q-tab-panel name="vietnam" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>
              <q-tab-panel name="simple" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>
              <q-tab-panel name="traditional" class="q-flex">
                <div style="width: 16%" class="q-mr-lg">
                  <span class="label">{{ $t("table_header.level_name") }}</span>
                  <q-input v-model="formData.title" outlined disable />
                </div>
                <div style="width: 40%">
                  <span class="label">{{ $t("table_header.remark") }}</span>
                  <q-input v-model="formData.remark" outlined disable />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-separator />
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <div class="row q-col-gutter-md">
          <div class="col-6 multiTable">
            <div class="text-h6 text-bold">{{ $t("common.promotion_settings") }}</div>

            <q-table
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="(formData.promotion as any)"
              :columns="promotionTableColumn"
              row-key="id"
              class="no-hover no-box-shadow"
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th rowspan="2">{{ props.cols[0].label }}</q-th>
                  <q-th colspan="2">{{ $t("table_header.level_up_condition") }}</q-th>
                  <q-th colspan="2">{{ $t("table_header.level_up_offer") }}</q-th>
                </q-tr>
                <q-tr>
                  <q-th>{{ props.cols[1].label }}</q-th>
                  <q-th>{{ props.cols[2].label }}</q-th>
                  <q-th>{{ props.cols[3].label }}</q-th>
                  <q-th>{{ props.cols[4].label }}</q-th>
                </q-tr>
              </template>
              <template #body="props" class="body_td">
                <q-tr>
                  <q-td key="currency" :props="props">
                    {{ props.row.currency }}
                  </q-td>
                  <q-td key="validate_bet" :props="props">
                    <q-input
                      v-model="props.row.validate_bet"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="deposit_amount" :props="props">
                    <q-input
                      v-model="props.row.deposit_amount"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="level_up_reward" :props="props">
                    <q-input
                      v-model="props.row.level_up_reward"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="birthday_reward" :props="props">
                    <q-input
                      v-model="props.row.birthday_reward"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>

          <div class="col-6 multiTable">
            <div class="text-h6 text-bold">{{ $t("table_header.deposit_settings") }}</div>
            <q-table
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="formData.withdrawal_setting as any"
              :columns="withdrawalSettingsTableColumn"
              row-key="id"
              class="no-hover no-box-shadow"
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th rowspan="2">{{ props.cols[0].label }}</q-th>
                  <q-th colspan="4">{{ $t("table_header.deposit_fee") }}</q-th>
                </q-tr>
                <q-tr>
                  <q-th>{{ props.cols[1].label }}</q-th>
                  <q-th>{{ props.cols[2].label }}</q-th>
                  <q-th>{{ props.cols[3].label }}</q-th>
                  <q-th>{{ props.cols[4].label }}</q-th>
                </q-tr>
              </template>
              <template #body="props" class="body_td">
                <q-tr>
                  <q-td key="currency" :props="props">
                    {{ props.row.currency }}
                  </q-td>
                  <q-td key="bank_card" :props="props">
                    <q-input
                      v-model="props.row.bank_card"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="third_party_payment" :props="props">
                    <q-input
                      v-model="props.row.third_party_payment"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="electronic_wallet" :props="props">
                    <q-input
                      v-model="props.row.electronic_wallet"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="audit_ratio" :props="props">
                    <q-input
                      v-model="props.row.audit_ratio"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <div class="row q-col-gutter-md">
          <div class="col-12 multiTable">
            <div class="text-h6 text-bold">{{ $t("table_header.withdrawal_settings") }}</div>

            <q-table
              hide-pagination
              :rows-per-page-options="[0]"
              :rows="formData.withdrawal_limit as any"
              :columns="WithdrawLimitTableColumn"
              row-key="id"
              class="no-hover no-box-shadow"
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th rowspan="2">{{ props.cols[0].label }}</q-th>
                  <q-th colspan="2">{{ $t("table_header.withdraw_limit_by_day") }}</q-th>
                  <q-th colspan="4">{{ $t("table_header.withdrawal_fee") }}</q-th>
                </q-tr>
                <q-tr>
                  <q-th>{{ props.cols[1].label }}</q-th>
                  <q-th>{{ props.cols[2].label }}</q-th>
                  <q-th>{{ props.cols[1].label }}</q-th>
                  <q-th>{{ props.cols[2].label }}</q-th>
                  <q-th>{{ props.cols[3].label }}</q-th>
                  <q-th>{{ props.cols[4].label }}</q-th>
                </q-tr>
              </template>
              <template #body="props" class="body_td">
                <q-tr>
                  <q-td key="currency" :props="props">
                    {{ props.row.currency }}
                  </q-td>
                  <q-td key="withdraw_limit_amount" :props="props">
                    <div class="q-flex q-item-center">
                      <q-input
                        v-model="props.row.withdraw_limit_amount_min"
                        :disable="readOnly"
                        standout="text-black bg-grey"
                        autocomplete="off"
                        class="q-mr-sm"
                        style="width: 50%"
                      />
                      -
                      <q-input
                        v-model="props.row.withdraw_limit_amount_max"
                        :disable="readOnly"
                        standout="text-black bg-grey"
                        autocomplete="off"
                        class="q-ml-sm"
                        style="width: 50%"
                      />
                    </div>
                  </q-td>
                  <q-td key="withdraw_count" :props="props">
                    <q-input
                      v-model="props.row.withdraw_count"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="bank_card" :props="props">
                    <q-input
                      v-model="props.row.bank_card"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="third_party_payment" :props="props">
                    <q-input
                      v-model="props.row.third_party_payment"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="electronic_wallet" :props="props">
                    <q-input
                      v-model="props.row.electronic_wallet"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                  <q-td key="failure_to_meet_fees" :props="props">
                    <q-input
                      v-model="props.row.failure_to_meet_fees"
                      :disable="readOnly"
                      standout="text-black bg-grey"
                      autocomplete="off"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pb-xs">
        <div class="text-h6 text-bold">{{ $t("common.deposit_method_settings") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <SelectAllOptionGroup
          :parentValue="formData.deposit_bank_card"
          :group-options="bankCardTags"
          :read-only="readOnly"
          @update:parentValue="handelBankCardTags"
          :selectAllLabel="$t('table_header.bank_card')"
        />
        <SelectAllOptionGroup
          :parentValue="formData.deposit_electronic_wallet"
          :group-options="electronicWalletTags"
          :read-only="readOnly"
          @update:parentValue="handelElectronicWalletTags"
          :selectAllLabel="$t('table_header.electronic_wallet')"
        />
        <SelectAllOptionGroup
          :parentValue="formData.deposit_third_payment"
          :group-options="thirdPaymentTags"
          :read-only="readOnly"
          @update:parentValue="handelThirdPaymentTags"
          :selectAllLabel="$t('table_header.third_party_payment')"
        />
      </q-card-section>

      <q-card-section class="q-pb-xs">
        <div class="text-h6 text-bold">{{ $t("common.withdrawal_method_settings") }}</div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <SelectAllOptionGroup
          :parentValue="formData.withdraw_bank_card"
          :group-options="bankCardTags"
          :read-only="readOnly"
          @update:parentValue="handelWithdrawBankCardTags"
          :selectAllLabel="$t('table_header.bank_card')"
        />
        <SelectAllOptionGroup
          :parentValue="formData.withdraw_electronic_wallet"
          :group-options="electronicWalletTags"
          :read-only="readOnly"
          @update:parentValue="handelWithdrawElectronicWalletTags"
          :selectAllLabel="$t('table_header.electronic_wallet')"
        />
        <SelectAllOptionGroup
          :parentValue="formData.withdraw_third_payment"
          :group-options="thirdPaymentTags"
          :read-only="readOnly"
          @update:parentValue="handelWithdrawThirdPaymentTags"
          :selectAllLabel="$t('table_header.third_party_payment')"
        />
      </q-card-section>
      <q-card-actions v-if="!readOnly" class="q-py-md" align="center">
        <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
          {{ $t("btn.cancel") }}
        </q-btn>
        <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
  import { defineProps, ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"
  import { getMemberLevel } from "@/api/member"
  import { QTableProps } from "quasar"

  import type { GetMemberLevel } from "@/api/response.type"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const tab = ref("mails")

  const props = defineProps({
    readOnly: {
      type: [Boolean],
      required: false,
      default: () => false
    },
    id: {
      type: [Number],
      required: false,
      default: () => 0
    }
  })

  const form = reactive<GetMemberLevel>([
    {
      id: 10,
      type: "english",
      title: "",
      remark: "",
      promotion: [
        {
          id: 1,
          currency: "CNY",
          validate_bet: 100,
          deposit_amount: 100,
          level_up_reward: 100,
          birthday_reward: 100
        },
        {
          id: 2,
          currency: "CNY",
          validate_bet: 0,
          deposit_amount: 0,
          level_up_reward: 100,
          birthday_reward: 100
        },
        {
          id: 3,
          currency: "CNY",
          validate_bet: 0,
          deposit_amount: 0,
          level_up_reward: 100,
          birthday_reward: 100
        },
        {
          id: 4,
          currency: "CNY",
          validate_bet: 0,
          deposit_amount: 0,
          level_up_reward: 100,
          birthday_reward: 100
        }
      ],
      withdrawal_setting: [
        {
          id: 1,
          currency: "CNY",
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          audit_ratio: 100
        },
        {
          id: 2,
          currency: "CNY",
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          audit_ratio: 100
        },
        {
          id: 3,
          currency: "CNY",
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          audit_ratio: 100
        },
        {
          id: 4,
          currency: "CNY",
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          audit_ratio: 100
        }
      ],
      withdrawal_limit: [
        {
          id: 1,
          currency: "CNY",
          withdraw_limit_amount_min: 100,
          withdraw_limit_amount_max: 100,
          withdraw_count: 100,
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          failure_to_meet_fees: 100
        },
        {
          id: 2,
          currency: "CNY",
          withdraw_limit_amount_min: 100,
          withdraw_limit_amount_max: 100,
          withdraw_count: 100,
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          failure_to_meet_fees: 100
        },
        {
          id: 3,
          currency: "CNY",
          withdraw_limit_amount_min: 100,
          withdraw_limit_amount_max: 100,
          withdraw_count: 100,
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          failure_to_meet_fees: 100
        },
        {
          id: 4,
          currency: "CNY",
          withdraw_limit_amount_min: 100,
          withdraw_limit_amount_max: 100,
          withdraw_count: 100,
          bank_card: 100,
          third_party_payment: 100,
          electronic_wallet: 100,
          failure_to_meet_fees: 100
        }
      ],
      deposit_bank_card: [],
      deposit_electronic_wallet: [],
      deposit_third_payment: [],
      withdraw_bank_card: [],
      withdraw_electronic_wallet: [],
      withdraw_third_payment: []
    }
  ])

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData } = useSearch(getMemberLevel)
  const [formData] = form
  onMounted(() => {
    const id = props.id ? props.id.toString() : (route.params.id as string)

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        if (!isSuccess.value) {
          return
        }
        let data = tableData.value[0]
        formData.type = data.type
        formData.title = data.title
        formData.remark = data.remark
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  const genderList = ref([
    {
      label: t("common.man"),
      value: 1
    },
    {
      label: t("common.woman"),
      value: 2
    }
  ])

  const bankCardTags = computed(() => [
    { label: t("bank_card.farmers"), value: 0 },
    { label: t("bank_card.hsbc"), value: 1 },
    { label: t("bank_card.mega"), value: 2 },
    { label: t("bank_card.tcb"), value: 3 },
    { label: t("bank_card.rakuten"), value: 4 },
    { label: t("bank_card.international"), value: 5 }
  ])
  const electronicWalletTags = computed(() => [
    { label: t("electronic_wallet.gc"), value: 0 },
    { label: t("electronic_wallet.btc"), value: 1 },
    { label: t("electronic_wallet.go"), value: 2 },
    { label: t("electronic_wallet.alipay"), value: 3 },
    { label: t("electronic_wallet.line"), value: 4 },
    { label: t("electronic_wallet.tg"), value: 5 },
    { label: t("electronic_wallet.ul"), value: 6 }
  ])
  const thirdPaymentTags = computed(() => [
    { label: "GC PAY", value: 0 },
    { label: "BTC PAY", value: 1 },
    { label: "GO PAY", value: 2 },
    { label: "A+ PAY", value: 3 },
    { label: "LINE PAY", value: 4 },
    { label: "TG PAY", value: 5 },
    { label: "U PAY", value: 6 }
  ])

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

  const $q = useQuasar()
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
  }

  const handelBankCardTags = (value: number[]) => {
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
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  ::v-deep(.q-tab) {
    width: 8%;
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
    ::v-deep(.q-field--standout .q-field__control) {
      background: rgba(194, 194, 202, 0.4);
      // border-radius: 6px;
      height: 36px;
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
