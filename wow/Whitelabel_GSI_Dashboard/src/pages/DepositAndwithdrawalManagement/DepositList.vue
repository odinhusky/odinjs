<template>
  <div class="q-pa-md">
    <query ref="queryRef" v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start q-gutter-xs">
          <q-select
            v-model="reloadInterval"
            :options="queryStore.reloadIntervalDropdown"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            class="reloadInterval currency-select"
            style="min-width: 4.6875rem"
            @update:model-value="onReloadIntervalChange"
            :option-label="
              (item) =>
                !item.value ? $t(`query_params.${item.label}`) : $t(`query_params.${item.label}`, { num: item.value })
            "
          />
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            class="table_v2"
            row-key="id"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  <div class="column" v-if="col.name === 'id'">
                    <span>{{ col.label }}</span>
                    <span>{{ $t("query_params.ref_trans_code") }}</span>
                  </div>
                  <div class="column" v-else-if="col.name === 'member_account'">
                    <span>{{ col.label }}</span>
                    <span>{{ $t("table_header.member_name") }}</span>
                  </div>
                  <div class="column" v-else-if="col.name === 'payment_type'">
                    <span>{{ col.label }}</span>
                    <span>{{ $t("table_header.payment_gateway") }}</span>
                  </div>
                  <div class="column" v-else-if="col.name === 'amount'">
                    <span>{{ $t("table_header.actual_deposit") }}</span>
                    <span>{{ `${col.label} - ${$t("table_header.handle_fee")}` }}</span>
                  </div>
                  <div class="column" v-else-if="col.name === 'status'">
                    <span>{{ col.label }}</span>
                    <span>{{ $t("table_header.failure_message") }}</span>
                  </div>
                  <div class="column" v-else-if="col.name === 'verified_date'">
                    <span>{{ $t("table_header.date_of_application") }}</span>
                    <span>{{ col.label }}</span>
                  </div>
                  <div v-else>
                    {{ col.label }}
                  </div>
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr>
                <q-td key="id" :props="props">
                  <span style="display: block; color: #2196f3; cursor: pointer" @click="onOpenRemark(props.row)">
                    {{ props.row.trans_code }}
                  </span>
                  <span style="color: orange" v-if="props.row.ref_trans_code !== ''">
                    {{ props.row.ref_trans_code }}
                  </span>
                </q-td>
                <q-td key="member_account" :props="props">
                  <div class="column">
                    <span>{{ props.row.member_account }}</span>
                    <span>{{ props.row.member_name }}</span>
                  </div>
                </q-td>
                <q-td key="recommender" :props="props">
                  {{ props.row.recommender }}
                </q-td>
                <q-td key="payment_type" :props="props">
                  <div class="column">
                    <span>{{
                      $t(FUND_METHOD_TYPE.I18nKeys[props.row.payment_type as FUND_METHOD_TYPE.Enums] || "common.unknow")
                    }}</span>
                    <span>{{ props.row.payment_gateway_name }}</span>
                  </div>
                </q-td>
                <q-td key="currency" :props="props">
                  {{ props.row.currency }}
                </q-td>
                <q-td key="amount" :props="props">
                  <div class="column">
                    <span v-if="parseFloat(props.row.deduction_fee) !== 0">{{
                      moneyFormat(props.row.actual_amount, 2)
                    }}</span>
                    <span>{{
                      parseFloat(props.row.deduction_fee) === 0
                        ? moneyFormat(props.row.amount, 2)
                        : `${moneyFormat(props.row.amount, 2)} - ${parseFloat(props.row.deduction_fee)}`
                    }}</span>
                  </div>
                </q-td>
                <q-td key="audit_amount" :props="props">
                  {{ props.row.audit_amount }}
                </q-td>
                <q-td key="promotion_amount" :props="props">
                  <span v-if="props.row.promotion_id" style="display: block">
                    {{ props.row.promotion_amount }}
                  </span>
                  <span v-if="props.row.promotion_id">
                    {{ props.row.promotion_title || "N/A" }}
                  </span>
                  <span v-else>- </span>
                </q-td>
                <q-td key="crypto" :props="props">
                  <template v-if="props.row.payment_type !== 3 && props.row.payment_type !== 7"> - </template>
                  <template v-else> {{ props.row.crypto }} {{ props.row.crypto_amount }} </template>
                </q-td>
                <q-td style="max-width: 300px" key="status" :props="props">
                  <div class="column">
                    <span
                      class="text-bold"
                      :class="{
                        'text-positive': props.row.status === SAVE_STATUS_TYPE.Enums.Success,
                        'text-negative': props.row.status === SAVE_STATUS_TYPE.Enums.Fail
                      }"
                      >{{
                        $t(SAVE_STATUS_TYPE.I18nKeys[props.row.status as SAVE_STATUS_TYPE.Enums] || "common.unknow")
                      }}</span
                    >
                    <span v-if="props.row.remark" style="white-space: break-spaces; width: 100%; word-wrap: break-word"
                      >[{{ props.row.remark }}]</span
                    >
                  </div>
                </q-td>
                <!-- 審核日期 -->
                <q-td key="verified_date" :props="props">
                  <div class="column">
                    <span>{{ genTimeFormat(props.row.submit_date) }}</span>
                    <span>{{ genTimeFormat(props.row.verified_date) }}</span>
                  </div>
                </q-td>
                <!--供應商狀況-->
                <q-td key="third_party_status" :props="props">
                  {{
                    props.row.third_party_status === 0
                      ? ""
                      : $t(
                          SAVE_STATUS_TYPE.I18nKeys[props.row.third_party_status as SAVE_STATUS_TYPE.Enums] ||
                            "common.unknow"
                        )
                  }}
                </q-td>
                <q-td key="third_party_updated_date" :props="props">
                  {{ props.row.third_party_updated_date ? genTimeFormat(props.row.third_party_updated_date) : "" }}
                </q-td>
                <q-td key="operator" :props="props">
                  {{ props.row.operator }}
                </q-td>
                <!-- 編輯 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn
                    flat
                    v-if="props.row.status === 1"
                    color="green"
                    class="q-mr-xs"
                    @click="onConfirm(props.row)"
                    >{{ $t("btn.pass") }}</q-btn
                  >
                  <q-btn flat v-if="props.row.status === 1" color="red" @click="onReject(props.row)">{{
                    $t("btn.reject")
                  }}</q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm column no_data">
                <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
              </div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
  <!-- 設定彈窗 -->
  <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #mainContent>
      <div class="text-grey-8 flex flex-column q-mb-md">
        <span>{{ $t("common.illustrate") }}</span>
        <span>{{ $t("common.sends_a_deposit_request_detail_one") }}</span>
        <span>{{ $t("common.sends_a_deposit_request_detail_two") }}</span>
        <span>{{ $t("common.sends_a_deposit_request_detail_three") }}</span>
      </div>
      <span>{{ $t("common.tag_choice") }}</span>
      <div class="row" style="width: 430px">
        <div class="col-12">
          <memberTagOption :parent-value="tagLabel" @update:labelValue="handelBlockTags" />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 彈窗 -->
  <dialog-comp v-model="detailDialog" :configs="dialogConfigs.detail">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">
            {{ $t("table_header.deposit_number") }}
            <span class="text-blue">{{ dialogData.detail.trans_code }}</span>
          </div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <!--會員資料-->
        <div class="col-12" v-if="dialogMemberData[0].id !== 0">
          <div class="q-mb-md">
            {{ $t("table_header.member_details") }}
          </div>
          <q-table
            square
            hide-pagination
            :rows="dialogMemberData"
            :columns="dialogAccountColumn"
            row-key="order_number"
            class="table_v2"
          >
            <template #body="props">
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("table_header.account") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.account }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("query_params.tier_when_withdrawal") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.member_level }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("query_params.account_status") }}
                </q-td>
                <q-td key="content" :props="props">
                  <span v-if="props.row.enable == 1">{{ $t("common.enable") }}</span>
                  <span v-else>{{ $t("common.disable") }}</span>
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props"> {{ $t("query_params.member_tag") }} </q-td>
                <!--會員標籤-->
                <q-td key="content" :props="props">
                  <div class="q-pt-md">
                    <p v-for="(item, Index) in props.row.member_tag" :key="item.id">
                      {{ item.name }}
                    </p>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!--金流明細-->
          <div class="q-my-md">
            {{ $t("table_header.cash_flow_details") }}
          </div>
          <q-table
            square
            hide-pagination
            :rows="dialogBankData"
            :columns="dialogAccountColumn"
            row-key="order_number"
            class="table_v2"
          >
            <template #body="props">
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("table_header.currency") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.currency }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("query_params.fund_method") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.payment_type }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("table_header.payment_provider") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.payment_gateway_name }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("edit_form.bank_account") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.bank_account }}
                  <q-btn
                    icon="content_copy"
                    size="sm"
                    color="primary"
                    flat
                    dense
                    @click="copyToClipboard(props.row.bank_account)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="q-my-md">
            {{ $t("table_header.deposit_details") }}
          </div>
          <q-table
            square
            hide-pagination
            :rows="dialogAmountData"
            :columns="dialogWithdrawalColumn"
            row-key="order_number"
            class="table_v2"
          >
            <template #body="props">
              <q-tr>
                <q-td key="project" :props="props">
                  {{ $t("table_header.withdrawal_currency") }}
                </q-td>
                <q-td key="withdrawal_currency" :props="props">
                  {{ props.row.amount }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="project" :props="props">
                  {{ $t("table_header.fee") }}
                </q-td>
                <q-td key="withdrawal_currency" :props="props">
                  <span class="text-deep-pink">-{{ props.row.deduction_fee }}</span>
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="project" :props="props">
                  {{ $t("table_header.failure_to_meet_audit") }}
                </q-td>
                <q-td key="withdrawal_currency" :props="props">
                  <span class="text-deep-pink">-{{ props.row.audit_amount }}</span>
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="project" :props="props">
                  {{ $t("common.total") }}
                </q-td>
                <q-td key="withdrawal_currency" :props="props">
                  {{ props.row.actual_amount }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="q-my-md">
            {{ $t("table_header.private_remark") }}
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-8">
              <q-select
                v-model="dialogData.detail.remark_template"
                :options="templateOption"
                emit-value
                :label="`* ${$t('table_header.apply_template')}`"
                map-options
                outlined
              />
            </div>
            <div class="col-4">
              <q-btn outline color="main-color" @click="changeTemplate">
                {{ $t("btn.apply") }}
              </q-btn>
            </div>
            <div class="col-12">
              <q-input
                v-model="dialogData.detail.remark"
                outlined
                stack-label
                type="textarea"
                :label="$t('table_header.remark')"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 彈窗 -->
  <dialog-comp v-model="remarkDialog" :configs="dialogConfigs.remark">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("dialog.deposit_number_merchant") }}</div>
      </div>
    </template>
    <template #mainContent>
      <div class="row">
        <div class="col-12">
          <div class="q-pb-md">
            <span class="q-mr-xl">{{ $t("table_header.deposit_number") }}</span>
            <span class="text-blue">{{ dialogData.remark.trans_code }}</span>
          </div>
        </div>
        <div class="col-12">
          <div class="q-mb-md">
            {{ $t("common.deposit_message") }}
          </div>
          <div class="q-mb-md">
            <p v-for="(item, index) in dialogData.remark.contents">{{ item.title }} : {{ item.content }}</p>
          </div>
        </div>
        <div class="col-12">
          <div class="q-mb-md">
            {{ $t("common.detailed_upload") }}
          </div>
          <div class="q-mb-md column items-center">
            <div
              v-if="dialogData.remark?.images?.length > 0"
              class="items-center column"
              v-for="(item, index) in dialogData.remark.images"
              :key="`${item.upload_at}-${index}`"
            >
              <span class="q-mb-sm">{{ genTimeFormat(item.upload_at) }}</span>
              <q-img
                class="cursor-pointer"
                loading="lazy"
                width="300px"
                :src="`${item.path}?t=${Date.now()}`"
                @click="onZoomIn(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-12 q-mt-lg" style="justify-content: end; display: flex">
          <q-btn outline color="primary" @click="closeremarkDialog" class="btns detail-btn">
            {{ $t("btn.cancel") }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-comp>

  <q-dialog style="background-color: rgba(0, 0, 0, 0.5)" v-model="zoomInDialog">
    <div class="column items-center no-wrap">
      <span class="q-mb-md text-white">{{ genTimeFormat(zoomInImage.upload_at) }}</span>
      <q-img class="q-mb-md" width="500px" loading="lazy" :src="zoomInImage.path" />
      <q-btn color="primary" @click="downloadImage">
        {{ $t("btn.download_images") }}
      </q-btn>
    </div>
  </q-dialog>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, reactive, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar, Notify } from "quasar"

  import { useQueryStore } from "@/stores/queryStore"
  import { FUND_METHOD_TYPE, SAVE_STATUS_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useDialog } from "@/hook/useDialog"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import {
    getDepositList,
    getDepositDetail,
    getRemarkList,
    depositConfirm,
    depositReject,
    getCheckTag,
    updateCheckTag,
    exportDepositList
  } from "@/api/depositAndwithdrawal"
  import type { GetDepositAndWithdrawalList } from "@/api/request.type"
  import type { DepositAndWithdrawalItem } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { getGatewayRemark } from "@/api/paymentGateway"
  import { getMemberDetail, getMemberTagList } from "@/api/member"
  import memberTagOption from "@/components/forms/memberTagOption.vue"
  import { useLanguageStore } from "src/stores/languageStore"
  import { usePermission } from "@/hook/usePermission"
  import { useEnv } from "src/hook/useEnv"
  import { useNotifyStore } from "@/stores/notifyStore"
  import { useIntervalFn } from "@vueuse/core"

  const reloadInterval = shallowRef(0)
  const queryStore = useQueryStore()
  const notifyStore = useNotifyStore()
  const queryRef = ref(null)
  const reloadIntervalMillisecond = computed(() => reloadInterval.value * 1000)

  const { pause, resume, isActive } = useIntervalFn(() => {
    queryRef.value?.onSubmit()
    closeEditDialog()
    closeDetailLoading()
    closeremarkDialog()
  }, reloadIntervalMillisecond)

  watch(
    () => notifyStore.newPendingTransactions,
    (newValue, oldValue) => {
      if (newValue && reloadInterval.value > 0) {
        queryRef.value?.onSubmit()
        notifyStore.updateNewPendingTransactions(false) // 更新狀態
      }
    }
  )

  function onReloadIntervalChange(value: number) {
    if (value === 0) {
      pause()
    } else {
      notifyStore.updateNewPendingTransactions(false) // 更新狀態
      queryRef.value?.onSubmit()
      resume()
    }
  }

  const { permission } = usePermission()
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const { t } = useI18n()
  const $q = useQuasar()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDepositNumber: true,
    useRefTransCode: true,
    useMemberAccount: true,
    usePaymentType: true,
    useTierWhenDepositing: true,
    useCurrency: true,
    useFirstDeposit: true,
    useSaveStatus: true,
    useOperator: true,
    useRecommender: true,
    useDatePicker: true,
    useDateType: true
  })
  //正式
  let { search, tableData, totalSize } = useSearch(getDepositList)

  const { genTimeFormat, moneyFormat, copyToClipboard } = useCommon()
  let catchQueryForm: GetDepositAndWithdrawalList

  async function onSubmit(queryForm: GetDepositAndWithdrawalList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  interface Tag {
    id: number
  }
  //標籤 後端尚未提供
  let tagLabel: number[] = reactive([])
  let checkLabel: Tag[] = reactive([])

  onMounted(() => {
    //取得幣別
    //getCurrency()
    //取得所有標籤
    getMemberTag()

    //取得彈窗標籤設定
    //getDialogTag()

    //取得remark
    getRemarkTemplate()
  })
  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.deposit_number"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "recommender",
        label: t("table_header.recommender"),
        field: "recommender",
        sortable: false,
        align: "center"
      },
      {
        name: "payment_type",
        label: t("query_params.payment_types"),
        field: "payment_type",
        sortable: false,
        align: "center"
      },
      {
        name: "currency",
        label: t("table_header.currency"),
        field: "currency",
        sortable: false,
        align: "center"
      },
      {
        name: "amount",
        label: t("table_header.amount"),
        field: "amount",
        sortable: false,
        align: "center"
      },
      {
        name: "audit_amount",
        label: t("table_header.audit"),
        field: "audit_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "promotion_amount",
        label: t("table_header.promotion"),
        field: "promotion_amount",
        sortable: false,
        align: "center"
      },
      {
        name: "crypto",
        label: t("table_header.crypto"),
        field: "crypto",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.save_status"),
        field: "status",
        sortable: false,
        align: "center"
      },
      {
        name: "verified_date",
        label: t("table_header.review_date"),
        field: "verified_date",
        sortable: false,
        align: "center"
      },
      {
        name: "third_party_status",
        label: t("table_header.supplier_status"),
        field: "third_party_status",
        sortable: false,
        align: "center"
      },
      {
        name: "third_party_updated_date",
        label: t("table_header.supplier_update_time"),
        field: "third_party_updated_date",
        sortable: false,
        align: "center"
      },
      {
        name: "operator",
        label: t("table_header.operator"),
        field: "operator",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const dialogAccountColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "cash_flow_project",
      label: t("table_header.cash_flow_project"),
      field: "cash_flow_project",
      sortable: false,
      align: "center"
    },
    {
      name: "content",
      label: t("table_header.content"),
      field: "content",
      sortable: false,
      align: "center"
    }
  ])
  const dialogWithdrawalColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "project",
      label: t("table_header.project"),
      field: "project",
      sortable: false,
      align: "center"
    },
    {
      name: "withdrawal_currency",
      label: t("table_header.withdrawal_currency"),
      field: "withdrawal_currency",
      sortable: false,
      align: "center"
    }
  ])
  const dialogData = reactive({
    detail: {} as DepositAndWithdrawalItem,
    edit: {},
    remark: {} as {
      trans_code: string
      contents: { title: string; content: string }[]
      images: { path: string; base64: string; upload_at: string }[]
    }
  })
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    detail: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleOpenDetail
    },
    edit: {
      dialogLabelI18nKey: "btn.tag_settings",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit
    },
    remark: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD
    }
  })
  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEditDialog
  } = useDialog()

  async function handleEdit() {
    openEditLoading()

    const res = await updateCheckTag({ labels: tagLabel })
    if (res.code === 0) {
      checkLabel = tagLabel
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      closeEditDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }

    closeEditLoading()
  }

  async function onTagSetting() {
    console.log("openEditDialog")
    openEditDialog()
  }
  //存款備註
  const {
    dialog: remarkDialog,
    openDialog: openremarkDialog,
    loading: remarkLoading,
    openLoading: openremarkLoading,
    closeLoading: closeremarkLoading,
    closeDialog: closeremarkDialog
  } = useDialog()

  function onOpenRemark(row: DepositAndWithdrawalItem) {
    getRemark(row.trans_code)

    openremarkDialog()
  }
  //取得該筆存款詳細內容
  const getRemark = async (trans_code: string) => {
    const sendData = {
      trans_code: trans_code,
      lang: languageStore.currentLanguage
    }
    const { data } = await getGatewayRemark(sendData)
    if (data) {
      dialogData.remark.contents = data.content
      dialogData.remark.images = data.images.map((image) => {
        return {
          path: `${VITE_APP_BASE_API}/${image.path}`,
          base64: image.base64,
          upload_at: image.upload_at
        }
      })
      dialogData.remark.trans_code = trans_code
    }
  }

  //存款備註 end

  const {
    dialog: detailDialog,
    openDialog: openDetailDialog,
    loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading
  } = useDialog()

  function onOpenDetail(row: DepositAndWithdrawalItem) {
    dialogData.detail.id = row.id
    dialogData.detail.member_id = 0

    getDepositInfo(row.id)

    openDetailDialog()
  }

  const dialogBankData = reactive([
    {
      currency: "",
      payment_type: "",
      payment_gateway_name: "",
      bank_account: ""
    }
  ])

  const dialogAmountData = reactive([
    {
      amount: 0,
      deduction_fee: 0,
      promotion_amount: 0,
      audit_amount: 0,
      actual_amount: 0
    }
  ])

  //取得該筆存款詳細內容
  const getDepositInfo = async (id: number) => {
    const sendData = {
      id: id
    }
    const { data } = await getDepositDetail(sendData)

    dialogData.detail.member_id = data.member_id
    dialogData.detail.trans_code = data.trans_code
    dialogData.detail.remark_template = 0
    dialogData.detail.remark = ""

    //紀錄存款時的層級
    dialogMemberData[0].member_level = data.level_id

    //彈窗-金流明細
    /* const currencyLabel = currencyList?.find((item) => item.value === parseInt(data.currency))
      console.log(data.currency)*/
    dialogBankData[0].currency = data.currency
    dialogBankData[0].payment_type = t(FUND_METHOD_TYPE.I18nKeys[data.payment_type as Enums])
    dialogBankData[0].payment_gateway_name = data.payment_gateway_name
    //缺銀行帳號
    dialogBankData[0].bank_account = "123456"

    //彈窗存款明細
    dialogAmountData[0].amount = data.amount
    dialogAmountData[0].deduction_fee = data.deduction_fee
    dialogAmountData[0].promotion_amount = data.promotion_amount
    dialogAmountData[0].audit_amount = data.audit_amount
    dialogAmountData[0].actual_amount = data.actual_amount

    getMemberInfo(dialogData.detail.member_id)

    console.log(data)
  }

  const memberData = reactive({ id: 0, account: "", member_level: 0, enable: 0, labels: [] })
  const dialogMemberData = reactive([
    {
      id: 0,
      account: "",
      member_level: 0,
      enable: 0,
      member_tag: [] as Tag[]
    }
  ])

  let memberFilterTag: Tag[]
  let memberTagIds: number[] // 修改類型為 number[]
  const getMemberInfo = async (id: number) => {
    const sendData = {
      id: id
    }
    const res = await getMemberDetail(sendData)

    Object.assign(memberData, res.data)
    dialogMemberData[0].id = memberData.id
    dialogMemberData[0].account = memberData.account
    //dialogMemberData[0].member_level = memberData.member_level
    dialogMemberData[0].enable = memberData.enable

    memberTagIds = memberData.labels ? (memberData.labels as number[]) : []

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
  const languageStore = useLanguageStore()

  function getDynamicLangValue(data: any) {
    if (data === null || data === "") {
      return ""
    }
    const currentLang = languageStore.currentLanguage

    const langValue = data[currentLang.toLowerCase()]

    return langValue || ""
  }
  function handleOpenDetail() {
    console.log(dialogData.detail, "detail")
    openDetailLoading()

    // call api
    $q.notify({
      type: "positive",
      message: t("message.add_success"),
      position: "top",
      timeout: 300
    })

    closeDetailLoading()
  }
  const templateOption = ref([
    {
      label: "",
      value: 0
    }
  ])
  const templateData = ref([] as { id: number; title: string; context: string }[])
  //remark樣板
  const getRemarkTemplate = async () => {
    //正式
    const { data } = await getRemarkList()

    for (const item of data.list) {
      const newItem = {
        label: item.title,
        value: item.id
      }
      templateOption.value.push(newItem)
    }
    templateData.value = [...data.list]
  }

  const changeTemplate = () => {
    for (const item of templateData.value) {
      if (item.id === dialogData.detail.remark_template) {
        dialogData.detail.remark = item.context
        break
      }
    }
  }

  const handelBlockTags = (value: number[]) => {
    tagLabel = value
  }
  const onConfirm = async (row: DepositAndWithdrawalItem) => {
    //取得該會員的標籤
    /*await getMemberInfo(row.member_id)
      //核對是否有彈窗設定的標籤 有的話要跳出警告
      const memberTags = checkLabel.filter((tag) => memberTagIds.includes(tag.id))
      if (memberTags.length > 0) {
      }*/

    let sendData = {
      id: row.id
    }
    const res = await depositConfirm(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      let errorMsg = res.msg
      if (res.code === 400) {
        errorMsg = t("error_msg.cannot_be_approved")
      }
      $q.notify({
        type: "negative",
        message: errorMsg,
        position: "top",
        timeout: 300
      })
    }
  }
  const onReject = async (row: DepositAndWithdrawalItem) => {
    let sendData = {
      id: row.id
    }
    const res = await depositReject(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      let errorMsg = res.msg
      if (res.code === 400) {
        errorMsg = t("error_msg.cannot_be_rejected")
      }
      $q.notify({
        type: "negative",
        message: errorMsg,
        position: "top",
        timeout: 300
      })
    }
  }
  //取得目前有勾選哪些tag
  const getDialogTag = async () => {
    const res = await getCheckTag({})
    if (res.code === 0) {
      tagLabel = res.data.labels !== null ? res.data.labels : []
      checkLabel = res.data.labels !== null ? res.data.labels : []
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  const onExport = async () => {
    const params: GetDepositAndWithdrawalList = catchQueryForm

    // 匯出所有搜尋結果
    params.size = totalSize.value
    const { search } = useSearch(exportDepositList)
    await search(params)
  }

  const zoomInDialog = ref(false)
  const zoomInImage = ref({ path: "", upload_at: "", base64: "" })
  const onZoomIn = (image: { path: string; upload_at: string; base64: string }) => {
    zoomInImage.value = image
    zoomInDialog.value = true
  }
  const downloadImage = async () => {
    try {
      const link = document.createElement("a")
      link.style.display = "none"
      link.href = zoomInImage.value.base64
      link.download = zoomInImage.value.path.split("/").pop() || "image"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      zoomInDialog.value = false
    } catch (error) {
      console.error("下載圖片失敗:", error)
      $q.notify({
        type: "negative",
        message: t("error_msg.download_failed"),
        position: "top",
        timeout: 300
      })
    }
  }
</script>

<style lang="scss" scoped>
  .table-container {
    .q-table thead tr th {
      background-color: #e6f7ff !important;
    }

    :deep(.q-table thead tr:last-child th:last-child) {
      position: sticky;
      background-color: #e6f7ff !important;
      right: 0;
      z-index: 3;
    }

    :deep(.q-table tbody tr td:last-child) {
      position: sticky;
      background-color: #fff !important;
      right: 0;
      z-index: 2;
    }
  }
</style>
