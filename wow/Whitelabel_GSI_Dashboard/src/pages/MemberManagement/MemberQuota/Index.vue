<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template v-slot:mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn @click="onAdd('deposit')" v-if="permission.edit" class="btns btn-green q-mr-sm">
            <q-icon class="q-mr-xs" size="xs" name="savings" />
            {{ $t("btn.manual_deposit") }}
          </q-btn>
          <q-btn @click="onAdd('Withdraw')" v-if="permission.edit" class="btns btn-pink">
            <q-icon class="q-mr-xs" size="xs" name="money_off" />
            {{ $t("btn.manual_withdraw") }}
          </q-btn>
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export" v-if="permission.export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div class="table-white-bg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="trans_code"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!-- 調整類型 -->
                <q-td key="action_type" :props="props">
                  {{ t(QUOTA_TYPE.I18nKeys[props.row.action_type as QUOTA_TYPE.Enums]) }}
                </q-td>
                <!-- 會員帳號 -->
                <q-td key="account" :props="props">
                  {{ props.row.account }}
                </q-td>

                <q-td key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>

                <!-- 幣別 -->
                <q-td key="currency_id" :props="props">
                  {{
                    store.currencyList
                      .find((item) => item.value === props.row.currency_id)
                      ?.label.replace("currency.", "")
                  }}
                </q-td>

                <!-- 異動金額 -->
                <q-td key="amount" :props="props">
                  {{ moneyFormat(props.row.amount, 2) }}
                </q-td>

                <!-- 稽核 -->
                <q-td key="audit_amount" :props="props" v-if="!siteStore.isCredit">
                  {{ moneyFormat(props.row.audit_amount) }}
                </q-td>

                <!-- 異動原因 -->
                <q-td key="reason_id" :props="props">
                  {{
                    QUOTA_MODIFY_REASON.I18nKeys[props.row.reason_id as QUOTA_MODIFY_REASON.Enums]
                      ? $t(QUOTA_MODIFY_REASON.I18nKeys[props.row.reason_id as QUOTA_MODIFY_REASON.Enums])
                      : ""
                  }}
                </q-td>
                <!-- 備註 -->
                <q-td key="remark" :props="props">
                  {{ props.row.remark }}
                </q-td>
                <!-- 異動時間 -->
                <q-td key="created_at" :props="props">
                  {{ formatDateTime(props.row.created_at) }}
                </q-td>
                <!-- 操作人 -->
                <q-td key="updated_by" :props="props">
                  {{ props.row.updated_by }}
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

  <!-- 編輯彈窗 -->
  <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("table_header.order_number") }} {{ dialogData.edit.trans_code }}</div>
      </div>
    </template>
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <!--會員帳號-->
        <div class="col-12">
          <!--<q-select
            v-model="dialogData.edit.member_id"
            :options="accountOption"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterAccount"
            @input-value="setAccount"
            :label="`* ${$t('query_params.member_account')}`"
            outlined
          />-->
          <q-input
            v-model.trim="dialogData.edit.account"
            type="text"
            class=""
            outlined
            disable
            :label="`* ${$t('table_header.member_account')}`"
          />
        </div>

        <div class="col-12">
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
                <q-td key="member_level" :props="props"> VIP {{ props.row.member_level }} </q-td>
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
                <!--會員姓名-->
                <q-td key="fullname" :props="props">
                  <span>{{ props.row.fullname }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <!--錢包類型-->
        <!-- <div class="col-12">
          <q-select
            v-model="dialogData.edit.wallet_type"
            :options="dropdownData.walletList"
            emit-value
            :label="`* ${$t('query_params.wallet_type')}`"
            map-options
            outlined
            disable
          />
        </div>-->
        <!-- 幣別 -->
        <div class="col-12">
          <q-select
            v-if="store.currencyList.length"
            v-model="dialogData.edit.currency_id"
            :options="store.currencyList"
            emit-value
            :label="`* ${$t('common.currency')}`"
            map-options
            outlined
            disable
            :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
          />
          <div class="q-mt-md">{{ $t("common.current_balance") }} : {{ balance }}</div>
        </div>

        <!-- 異動原因 -->
        <div class="col-12">
          <q-select
            v-model="dialogData.edit.reason_id"
            :options="dropdownData.modifyReason"
            :option-label="(item) => (item && item.label ? $t(item.label) : item.value)"
            emit-value
            :label="`* ${$t('table_header.modify_reason')}`"
            map-options
            outlined
            disable
          />
        </div>
        <!-- 異動金額 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.edit.amount"
            type="text"
            class=""
            outlined
            :label="`* ${$t('table_header.modify_amount')}`"
            disable
          />
        </div>

        <!--活動-->
        <!---<div class="col-12">
          <q-select
            v-model="dialogData.edit.promotion_id"
            :options="promotionDropdownList"
            emit-value
            :label="`* ${$t('common.matching_offer')}`"
            map-options
            outlined
          />
        </div>-->
        <!-- 備註 -->
        <div class="col-12">
          <q-input
            v-model.trim="dialogData.edit.remark"
            type="text"
            class=""
            outlined
            :label="`${$t('table_header.remark')}`"
            disable
          />
        </div>
        <!--佔無資料 隱藏-->
        <!--
        <div class="col-12 q-mb-sm">
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
          <div class="q-pb-md q-pt-md">{{ $t("btn.modify_detail") }}</div>

          <q-table
            square
            hide-pagination
            :rows="dialogModifyData"
            :columns="dialogModifyColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <q-td key="deposit_project" :props="props"> {{ props.row.deposit_project }} </q-td>
                <q-td key="deposits" :props="props"> {{ props.row.deposits }} </q-td>
                <q-td key="audit_multiple" :props="props"> {{ props.row.audit_multiple }} </q-td>
                <q-td key="audit" :props="props"> {{ props.row.audit }} </q-td>
              </q-tr>
            </template>
            <template #bottom-row="props">
              <q-tr :props="props">
                <q-td v-for="col in dialogModifyColumn" :key="col.name">
                  {{ isTotalColumn(col.name) ? sumTotal(col.name) : $t("common.total") }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>-->
      </div>
    </template>
  </dialog-comp>

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title" v-if="dialogData.add.type === 'deposit'">{{ $t("btn.manual_deposit") }}</div>
        <div class="dialog_title" v-else>{{ $t("btn.manual_withdraw") }}</div>
      </div>
    </template>
    <template #mainContent>
      <div class="items-baseline q-mb-md">
        <div class="col-12">
          <q-btn :outline="quotaModes !== 'single'" color="amber-9" @click="changeMode('single')" class="btns">
            {{ $t("btn.single_adjustment") }}
          </q-btn>
          <q-btn :outline="quotaModes !== 'batch'" color="amber-9" class="q-ml-md btns" @click="changeMode('batch')">
            {{ $t("btn.batch_adjustment") }}
          </q-btn>
        </div>
      </div>
      <div class="items-baseline q-mb-md" v-if="quotaModes === 'batch'">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("btn.please_select_file") }}</div>
        <div class="col-12 col-sm-9">
          <q-file
            ref="fileInput"
            outlined
            bottom-slots
            v-model="memberListCsv"
            max-files="1"
            accept=".csv"
            @update:model-value="handleFileUpload"
            class="default-input"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="triggerFileUpload" />
            </template>
          </q-file>
        </div>
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
            </q-tr>
          </template>
        </q-table>
      </div>

      <!--會員帳號-->
      <div class="items-baseline q-mb-md" v-if="quotaModes === 'single'">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ $t("query_params.member_account") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-12">
          <q-select
            v-model="dialogData.add.member_id"
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
            outlined
            class="default-input"
          />
        </div>
      </div>

      <div class="col-12 q-mb-md" v-if="dialogMemberData[0].id !== 0 && quotaModes === 'single'">
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
                <div class="">
                  <p v-for="(item, Index) in props.row.member_tag" :key="item.id">
                    {{ item.name }}
                  </p>
                </div>
              </q-td>
              <!--會員姓名-->
              <q-td key="fullname" :props="props">
                <span>{{ props.row.fullname }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <!--錢包類型-->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("query_params.wallet_type") }}</div>
        <div class="col-12 col-sm-12">
          <q-select
            v-model="dialogData.add.wallet_type"
            :options="dropdownData.walletList"
            emit-value
            map-options
            outlined
            class="default-input"
          />
        </div>
      </div>

      <!-- 幣別 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("common.currency") }}<span class="required-dot"></span></div>
        <div class="col-12 col-sm-12">
          <q-select
            v-if="store.currencyList.length"
            v-model="dialogData.add.currency_id"
            :options="store.currencyList"
            emit-value
            map-options
            outlined
            :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
            class="default-input"
          />
          <div class="q-mt-md q-ml-xs" v-if="quotaModes === 'single'">
            {{ $t("common.current_balance") }} : {{ balance }}
          </div>
        </div>
      </div>

      <!-- 異動原因 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ $t("table_header.modify_reason") }}<span class="required-dot"></span>
          <q-icon name="info" size="18px" color="grey-6" class="q-ml-xs cursor-pointer">
            <q-tooltip style="white-space: pre-line">
              {{ formattedModifyReasonTip }}
            </q-tooltip>
          </q-icon>
        </div>
        <div class="col-12 col-sm-12">
          <q-select
            v-if="dialogData.add.type === 'deposit'"
            v-model="dialogData.add.reason_id"
            :options="getDepositModifyReasonOptions()"
            :option-label="(item) => (item && item.label ? $t(item.label) : item.value)"
            emit-value
            map-options
            outlined
            @update:model-value="changeReason"
            class="default-input"
          />
          <q-select
            v-else
            v-model="dialogData.add.reason_id"
            :options="getWithdrawModifyReasonOptions()"
            :option-label="(item) => (item && item.label ? $t(item.label) : item.value)"
            emit-value
            :label="`* ${$t('table_header.modify_reason')}`"
            map-options
            outlined
            @update:model-value="changeReason"
          />
        </div>
      </div>

      <!-- 異動金額 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ $t("table_header.modify_amount") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-12">
          <q-input
            v-model.trim="dialogData.add.amount"
            type="number"
            outlined
            @update:modelValue="handleAmountChange"
            class="default-input"
          />
        </div>
      </div>

      <!-- 稽核倍數 -->
      <div class="items-baseline q-mb-md" v-if="dialogData.add.type === 'deposit' && !siteStore.isCredit">
        <div class="col-12 col-sm-3 dialog_title2">
          {{ $t("edit_form.audit_multiple") }}<span class="required-dot"></span>
        </div>
        <div class="col-12 col-sm-12">
          <q-input
            v-model.trim="dialogModifyData[0].audit_multiple"
            type="number"
            outlined
            @update:modelValue="handleAmountChange"
            class="default-input"
          />
        </div>
      </div>

      <!--活動-->
      <!-- <div class="col-12" v-if="dialogData.add.type === 'deposit' && siteStore.isCash">
          <q-select
            v-model="dialogData.add.promotion_id"
            :options="dropdownData.promotions"
            :label="`${$t('common.matching_offer')}`"
            emit-value
            map-options
            outlined
            @update:model-value="getPromotionInfo()"
          />
        </div>-->
      <!--後端尚有BUG 先隱藏
        <div class="col-12" v-if="dialogData.add.type === 'Withdraw'">
          <div class="q-mt-md q-ml-xs">{{ $t("common.amount_of_payment") }} : {{ turnover }}</div>
        </div>
        <div class="col-12" v-if="dialogData.add.type === 'Withdraw'">
          <div class="q-mt-md q-ml-xs">{{ $t("common.withdrawal_audit") }} : {{ audit_turnover }}</div>
        </div>-->

      <!-- 備註 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("table_header.remark") }}</div>
        <div class="col-12 col-sm-12">
          <q-input v-model.trim="dialogData.add.remark" type="text" outlined class="default-input" />
        </div>
      </div>

      <div class="col-12 q-mb-sm dialog" v-if="dialogData.add.type === 'deposit'">
        <q-card-section style="padding: 0">
          <q-separator />
        </q-card-section>
        <div class="q-pb-md q-pt-md">{{ $t("btn.modify_detail") }}</div>

        <q-table
          square
          hide-pagination
          :rows="dialogModifyData"
          :columns="dialogModifyColumn"
          row-key="id"
          table-header-class="bg-success"
        >
          <template #body="props">
            <q-tr>
              <q-td key="deposit_project" :props="props"> {{ props.row.deposit_project }} </q-td>
              <q-td key="deposits" :props="props"> {{ props.row.deposits }} </q-td>
              <q-td key="audit_multiple" :props="props" v-if="!siteStore.isCredit">
                {{ props.row.audit_multiple === "" ? 0 : props.row.audit_multiple }}
              </q-td>
              <q-td key="audit" :props="props" v-if="!siteStore.isCredit">
                {{ moneyFormat(props.row.audit, 2) }}
              </q-td>
            </q-tr>
          </template>
          <template #bottom-row="props">
            <q-tr :props="props">
              <q-td v-for="col in dialogModifyColumn" :key="col.name">
                {{ isTotalColumn(col.name) ? moneyFormat(sumTotal(col.name), 2) : $t("common.total") }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { Notify } from "quasar"
  import { useQueryStore } from "@/stores/queryStore"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { QUOTA_TYPE, QUOTA_MODIFY_REASON, CURRENCY_TYPE, ERROR_CODE } from "@/utils/constants"
  import {
    getMemberQuotaList,
    getMemberQuotaMemberSearch,
    getMemberQuotaReason,
    MemberQuotaDeposit,
    MemberQuotaWithdraw,
    getMemberDetail,
    getMemberTagList,
    getPromotionList,
    getPromotionDetail,
    getQuotaExport,
    MemberQuotaDepositBatch,
    MemberQuotaWithdrawBatch,
    MemberQuotaCheckAccount
  } from "@/api/member"

  //import { getPromotionList } from "@/api/promotion"
  import type { GetMemberQuota, MemberQuotaList } from "@/api/request.type"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { MemberQuotaItem, EditQuota, I18nTab } from "@/api/response.type"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { format, differenceInMonths, fromUnixTime, subMonths } from "date-fns"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useSiteStore } from "@/stores/siteStore"
  import { useRoute } from "vue-router"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  import Papa from "papaparse"

  const { t } = useI18n()
  const store = useQueryStore()
  const $q = useQuasar()
  const siteStore = useSiteStore()
  const languageStore = useLanguageStore()
  const { walletSwitch } = useWalletBouns()
  type i18nKeys = keyof I18nTab<undefined>

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useQuotaType: true,
      useCurrency: true,
      customDateTimeLabelI18nKey: "query_params.modify_time"
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    baseConfig.useQuotaModifyReason = true
    baseConfig.useDatePicker = true

    return baseConfig
  })

  const balance = computed(() => {
    const wallets = dialogMemberData[0].wallets as {
      currency: string
      balance: string
      wallet_type: number
    }[]
    if (!wallets?.length) return 0
    const currencyItem = store.currencyList.find((item) => item.value === dialogData.add.currency_id)
    const currencyCode = currencyItem?.label?.split(".")[1]
    if (!currencyCode) return 0
    const wallet = wallets.find((w) => w.currency === currencyCode && w.wallet_type === dialogData.add.wallet_type)
    return wallet ? Number(wallet.balance) : 0
  })

  const { moneyFormat, numberEnumToArray } = useCommon()
  const { formatDateTime } = useRfc3339()

  const { search, tableData, totalSize } = useSearch(getMemberQuotaList)
  let catchQueryForm: GetMemberQuota

  async function onSubmit(queryForm: GetMemberQuota) {
    catchQueryForm = queryForm
    //只能查詢兩個月內
    const { start, end } = queryForm
    if (start !== undefined && end !== undefined) {
      const startDate = fromUnixTime(Number(start) / 1000)
      const endDate = fromUnixTime(Number(end) / 1000)
      // 計算兩個日期之間的月份差異
      const monthDifference = differenceInMonths(endDate, startDate)
      if (monthDifference > 2) {
        $q.notify({
          type: "negative",
          message: t("error_msg.query_time_cannot_two_months"),
          position: "top",
          timeout: 300
        })
        return
      }
    }
    await search(queryForm)
  }

  const dialogMemberData = reactive([
    {
      id: 0,
      member_level: 0,
      enable: 0,
      member_tag: [] as Tag[],
      fullname: "",
      wallets: []
    }
  ])
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "action_type",
        label: t("table_header.quota_type"),
        field: "action_type",
        sortable: false,
        align: "center"
      },
      {
        name: "account",
        label: t("table_header.member_account"),
        field: "account",
        sortable: false,
        align: "center"
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_id",
        label: t("table_header.currency"),
        field: "currency_id",
        sortable: false,
        align: "center"
      },
      {
        name: "amount",
        label: t("table_header.modify_amount"),
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
        name: "reason_id",
        label: t("table_header.modify_reason"),
        field: "reason_id",
        sortable: false,
        align: "center"
      },
      {
        name: "remark",
        label: t("table_header.remark"),
        field: "remark",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.modify_time"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "updated_by",
        label: t("table_header.operator"),
        field: "updated_by",
        sortable: false,
        align: "center"
      }
    ]

    let filteredColumns = baseColumns

    if (!walletSwitch.value) {
      filteredColumns = filteredColumns.filter((column) => column.name !== "wallet_type")
    }

    if (siteStore.isCredit) {
      filteredColumns = filteredColumns.filter((column) => column.name !== "audit_amount")
    }

    return filteredColumns
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
    },
    {
      name: "fullname",
      label: t("website_settings_reg.fullname"),
      field: "fullname",
      sortable: false,
      align: "center"
    }
  ])

  const dialogModifyColumn = computed<QTableProps["columns"]>(() => {
    const baseColumns: QTableProps["columns"] = [
      {
        name: "deposit_project",
        label: t("table_header.deposit_project"),
        field: "deposit_project",
        sortable: false,
        align: "center"
      },
      {
        name: "deposits",
        label: t("table_header.deposits"),
        field: "deposits",
        sortable: false,
        align: "center"
      },
      {
        name: "audit_multiple",
        label: t("edit_form.audit_multiple"),
        field: "audit_multiple",
        sortable: false,
        align: "center"
      },
      {
        name: "audit",
        label: t("table_header.audit"),
        field: "audit",
        sortable: false,
        align: "center"
      }
    ]

    if (siteStore.isCredit) {
      return baseColumns.filter((column) => column.name !== "audit_multiple" && column.name !== "audit")
    }

    return baseColumns
  })

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
    }
  ])

  const dialogModifyData = ref([
    {
      deposit_project: "",
      deposits: 0,
      audit_multiple: 1.0,
      audit: 0
    }
  ])

  const dropdownData = reactive<{
    currencyList: {
      label: string
      value: number
    }[]
    modifyReason: {
      label: string
      value: number
    }[]
    promotions: {
      label: string
      value: number
    }[]
    walletList: {
      label: string
      value: number
    }[]
  }>({
    currencyList: [],
    modifyReason: [],
    promotions: [{ label: "", value: 0 }],
    walletList: []
  })

  type ModifyReasonOption = (typeof dropdownData.modifyReason)[number]

  function getDepositModifyReasonOptions(): ModifyReasonOption[] {
    return dropdownData.modifyReason.filter((item) => item.value !== QUOTA_MODIFY_REASON.Enums.AbnormalDeduct)
  }

  function getWithdrawModifyReasonOptions(): ModifyReasonOption[] {
    return dropdownData.modifyReason.filter(
      (item) =>
        item.value !== QUOTA_MODIFY_REASON.Enums.StoredValueLimit &&
        item.value !== QUOTA_MODIFY_REASON.Enums.AbnormalCompensation
    )
  }

  function getModifyReasonOptions(mode: string): ModifyReasonOption[] {
    return mode === "deposit" ? getDepositModifyReasonOptions() : getWithdrawModifyReasonOptions()
  }

  function getDefaultModifyReasonId(mode: string): number {
    return getModifyReasonOptions(mode)[0]?.value ?? 0
  }

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    add: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    },
    edit: {
      dialogLabelI18nKey: "",
      type: DialogType.EDIT,
      useActions: false,
      submitFunction: handleEdit
    }
  })
  const route = useRoute()
  const { permission } = usePermission()

  onMounted(async () => {
    await store.getMemberLevel()
    //await store.getCurrencyList()
    //取得異動原因
    getReason()
    //搜尋會員
    getMember("")
    //取得會員標籤
    getMemberTag()

    //錢包類型
    numberEnumToArray(BONUS_WALLET_TYPE.Enums).forEach((item) => {
      dropdownData.walletList.push({
        label: t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow",
        value: item as number
      })
    })
  })

  const quotaModes = ref("single")
  const fileInput = ref(null)
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
      member_account_list: result.data.map((item: {}) => Object.values(item)[0])
    }
    const res = await MemberQuotaCheckAccount(sendData)

    openAddLoading()
    if (res?.code === 0) {
      const member = res.data as EditQuota
      csvResultData.value = sendData.member_account_list.map((member_account: string) => ({
        member_account,
        results: Object.values(member).includes(member_account) ? 0 : 1
      }))
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

  const dialogData = reactive({
    add: {} as EditQuota,
    edit: {} as EditQuota
  })
  const modifyReasonTip = computed(() =>
    t(
      dialogData.add.type === "deposit"
        ? "query_params.modify_reason_tip_deposit"
        : "query_params.modify_reason_tip_withdraw"
    )
  )
  const formattedModifyReasonTip = computed(() => modifyReasonTip.value.replace(/\\n/g, "\n"))
  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  function onAdd(mode: string) {
    dialogData.add.type = mode
    //dialogData.add.trans_code = ""
    dialogData.add.member_id = 0
    // dialogData.add.currency_id = 0
    dialogData.add.reason_id = getDefaultModifyReasonId(mode)
    dialogData.add.amount = 0
    dialogData.add.promotion_id = 0
    dialogData.add.remark = ""

    dialogData.add.member_account_list = []

    dialogData.add.wallet_type = BONUS_WALLET_TYPE.Enums.GENERALLY

    //會員詳細
    dialogMemberData[0].id = 0
    dialogMemberData[0].wallets = []

    //預設異動明細的存入項目
    dialogModifyData.value = [
      {
        deposit_project: t(
          QUOTA_MODIFY_REASON.I18nKeys[dialogData.add.reason_id as keyof typeof QUOTA_MODIFY_REASON.I18nKeys]
        ),
        deposits: 0,
        audit_multiple: 1.0,
        audit: 0
      }
    ]
    changeReason()
    //重置活動下拉資料
    dropdownData.promotions.length = 0
    dropdownData.promotions.push({ label: "", value: 0 })

    //匯入重製
    quotaModes.value = "single"
    memberListCsv.value = null
    csvResultData.value = []

    turnover.value = 0
    audit_turnover.value = 0

    openAddDialog()
  }

  const getTotalAudit = () => {
    if (dialogModifyData.value.length === 1) {
      return dialogModifyData.value[0].deposits
    }

    return dialogModifyData.value.reduce((total, item) => total + Number(item.deposits), 0)
  }
  async function handleAdd() {
    let amount = 0
    let auditRate = 0
    if (dialogData.add.type === "deposit") {
      amount = getTotalAudit()
      auditRate = dialogModifyData.value[0].audit_multiple ? dialogModifyData.value[0].audit_multiple : 0
    } else {
      amount = dialogData.add.amount
    }

    const sendData = {
      member_id: dialogData.add.member_id,
      currency_id: dialogData.add.currency_id,
      reason_id: dialogData.add.reason_id,
      amount: amount,
      audit_rate: auditRate,
      promotion_id: dialogData.add.promotion_id,
      remark: dialogData.add.remark,
      wallet_type: dialogData.add.wallet_type,
      //wallet_type: 1, //1119收到通知 先隱藏錢包
      member_account_list: csvResultData.value
        .filter((item: { member_account: string; results: number }) => item.results !== 0)
        .map((item: { member_account: string; results: number }) => item.member_account)
      //trans_code: ""
    }
    /*console.log(auditRate)
    return*/

    if (!sendData.member_id && quotaModes.value === "single") {
      errorMsg("error_msg.please_select_member_account")
      return
    } else if (sendData.amount <= 0) {
      errorMsg("error_msg.the_amount_greater_than_0")
      return
    }

    openAddLoading()
    /*let res
    if (quotaModes.value === "single") {
      res = dialogData.add.type === "deposit" ? await MemberQuotaDeposit(sendData) : await MemberQuotaWithdraw(sendData)
    } else {
      res =
        dialogData.add.type === "deposit"
          ? await MemberQuotaDepositBatch(sendData)
          : await MemberQuotaWithdrawBatch(sendData)
    }*/
    const { search, status, resCode, message } = useSearch(
      quotaModes.value === "single"
        ? dialogData.add.type === "deposit"
          ? MemberQuotaDeposit
          : MemberQuotaWithdraw
        : dialogData.add.type === "deposit"
          ? MemberQuotaDepositBatch
          : MemberQuotaWithdrawBatch
    )
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeAddLoading()
      closeAddDialog()
    } else {
      if (resCode.value === ERROR_CODE.Enums.A_INSUFFICIENT_BALANCE) {
        $q.notify({
          type: "negative",
          message: `${t(message.value.split(":")[0])}${t("error_msg.insufficient_balance")}`,
          position: "top",
          timeout: 3000
        })
      }
      closeAddLoading()
    }
  }

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEditDialog
  } = useDialog()

  async function onEdit(item: EditQuota) {
    dialogData.edit.trans_code = item.trans_code
    dialogData.edit.account = item.account
    dialogData.edit.member_id = item.member_id
    dialogData.edit.currency_id = item.currency_id
    dialogData.edit.reason_id = item.reason_id
    dialogData.edit.amount = item.amount
    dialogData.edit.promotion_id = item.promotion_id
    dialogData.edit.remark = item.remark
    dialogData.edit.wallet_type = item.wallet_type

    getMemberBalance(item.member_id, item.currency_id)
    getMemberInfo("edit")
    dialogMemberData[0].id = 0
    openEditDialog(item)
  }

  const sumTotal = (columnName: string) => {
    const total = dialogModifyData.value.reduce((sum, rows: any) => sum + parseFloat(rows[columnName]) || 0, 0)
    return total
  }

  const isTotalColumn = (columnName: string) => {
    // 檢查是否是要加總的列
    return ["deposits", "audit_multiple", "audit"].includes(columnName)
  }
  function handleEdit() {
    openEditLoading()
    // call api
    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })

    closeEditLoading()
  }

  const accountOption = ref([])
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
      const newItem = {
        label: item.account,
        value: item.id
      }
      accountOption.value.push(newItem as never)
    })
  }

  const filterAccount = (val: string, update: Function, abort: Function) => {
    const needle = val.trim().toLowerCase()

    if (needle === "") {
      accountOption.value.length = 0
      return
    }

    update(() => {
      getMember(needle)
    })
  }

  //取得異動原因
  const getReason = async () => {
    const { data } = await getMemberQuotaReason()
    if (!data || !Object.keys(data).length) {
      dropdownData.modifyReason.length = 0
      return
    }

    for (const [reason, value] of Object.entries(data)) {
      const newItem = {
        label: QUOTA_MODIFY_REASON.I18nKeys[value.id as keyof typeof QUOTA_MODIFY_REASON.value.id] ?? value.desc,
        value: value.id
      }

      if (value.id !== QUOTA_MODIFY_REASON.Enums.AgentQuotaAdjustment) {
        dropdownData.modifyReason.push(newItem as never)
      }
    }
  }

  const turnover = ref(0)
  const audit_turnover = ref(0)
  const setAccount = async (value: string) => {
    const member = accountOption.value.find((item: { label: string; value: number }) => item.label === value)

    if (member !== undefined) {
      const sendData = {
        id: member["value"]
      }

      const res = await getMemberDetail(sendData)
      Object.assign(memberData, res.data)

      dialogMemberData[0].id = memberData.id
      dialogMemberData[0].member_level = memberData.member_level
      dialogMemberData[0].enable = memberData.enabled
      dialogMemberData[0].wallets = memberData.wallets
      dialogMemberData[0].fullname = memberData.fullname
    }
  }
  //取得會員餘額

  const getMemberBalance = (id: number, currency: number) => {
    if (!id || !currency) {
      return
    }
    const currencys = store.currencyList.find((item) => item.value === currency)
    if (currency) {
      const wallets = dialogMemberData[0].wallets.find(
        (item: { currency: string; audit_turnover: number; turnover: number }) =>
          item.currency === currencys?.label.split(".")[1]
      ) as { currency: string; audit_turnover: number; turnover: number } | undefined

      audit_turnover.value = wallets?.audit_turnover || 0
      turnover.value = wallets?.turnover || 0
    }
  }

  //取得活動列表
  const getPromotion = async (currency: number) => {
    const sendData = {
      currency: currency,
      enable: true
    }
    const { data } = await getPromotionList(sendData)

    if (!data || !Object.keys(data).length) {
      return
    }
    dropdownData.promotions.length = 0
    dropdownData.promotions.push({ label: "", value: 0 })
    data.list.forEach((item) => {
      const newItem = {
        label: item.title[languageStore.currentLanguage.toLowerCase()],
        value: item.id
      }
      dropdownData.promotions.push(newItem)
    })
    if (dialogData.add.promotion_id !== 0) {
      dialogData.add.promotion_id = 0
      dialogModifyData.value.splice(-1, 1)
    }
  }

  //取得活動的稽核倍數跟金額
  const getPromotionInfo = async () => {
    //如果不要選活動
    if (dialogData.add.promotion_id === 0) {
      dialogModifyData.value.splice(-1, 1)
      return
    }

    const sendData = {
      id: dialogData.add.promotion_id
    }
    const { data } = await getPromotionDetail(sendData)
    if (data) {
      if (dialogModifyData.value.length > 1) {
        dialogModifyData.value.splice(-1, 1)
      }
      const fliter_reward = data.reward.filter(
        (item: { currency_id: number }) => item.currency_id === dialogData.add.currency_id
      )
      const fliter_title = data.details.find(
        (item: { lang: string }) => item.lang === languageStore.currentLanguage.toLowerCase()
      ) as { title: string } | undefined

      if (fliter_title && fliter_reward.length > 0) {
        const amount = parseInt((fliter_reward[0] as { amount: string }).amount)
        const title = fliter_title.title

        dialogModifyData.value.push({
          deposit_project: title,
          deposits: amount,
          audit_multiple: data.audit_rate,
          audit: amount * data.audit_rate
        })
      }
    }
  }

  //金額輸入計算
  const handleAmountChange = () => {
    dialogModifyData.value[0].audit_multiple =
      dialogModifyData.value[0].audit_multiple < 0 ? 0 : dialogModifyData.value[0].audit_multiple
    dialogData.add.amount = dialogData.add.amount < 0 ? 0 : dialogData.add.amount

    dialogModifyData.value[0].deposits = dialogData.add.amount || 0
    dialogModifyData.value[0].audit =
      (dialogModifyData.value[0].deposits * dialogModifyData.value[0].audit_multiple) | 0
  }

  //變更原因
  const changeReason = () => {
    dialogModifyData.value[0].deposit_project = t(
      QUOTA_MODIFY_REASON.I18nKeys[dialogData.add.reason_id as keyof typeof QUOTA_MODIFY_REASON.I18nKeys]
    )
  }

  //取得該會員的詳細
  const memberData = reactive({ id: 0, member_level: 0, enabled: 0, labels: [], wallets: [], fullname: "" })
  interface Tag {
    id: number
  }

  let memberFilterTag: Tag[]
  const getMemberInfo = async (mode: string) => {
    let id = 0
    if (mode === "add") {
      id = dialogData.add.member_id
    } else if (mode === "edit") {
      id = dialogData.edit.member_id
    }
    const sendData = {
      id: id
    }
    const res = await getMemberDetail(sendData)
    Object.assign(memberData, res.data)
    dialogMemberData[0].id = memberData.id
    dialogMemberData[0].member_level = memberData.member_level
    dialogMemberData[0].enable = memberData.enabled
    dialogMemberData[0].wallets = memberData.wallets
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

  // 匯出
  const onExport = async () => {
    const { search } = useSearch(getQuotaExport)
    await search(catchQueryForm)
  }
  function getLevel(memberLevel: number) {
    for (const item of store.memberLevel) {
      if (item.value === memberLevel) {
        return item.label
      }
    }
    return ""
  }
</script>
<style lang="scss" scoped>
  .order_btn {
    cursor: pointer;
    color: #1673d0;
  }
  .dialog {
    ::v-deep(.q-table tbody td) {
      text-align: right;
    }
  }
</style>
