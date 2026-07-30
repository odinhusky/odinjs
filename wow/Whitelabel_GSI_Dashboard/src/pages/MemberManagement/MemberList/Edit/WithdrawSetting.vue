<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <div class="row justify-start">
      <q-btn @click="onAdd" class="btns btn-blue">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <!-- 銀行轉帳 -->
    <div class="edit_title q-mb-sm q-mt-md">
      {{ $t("table_header.money_transfer") }}
    </div>

    <q-table
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="bank_transfer_list"
      :columns="bankTableColumn"
      row-key="id"
    >
      <template #body="props">
        <q-tr>
          <q-td key="id" :props="props">
            {{ bank_transfer_list.indexOf(props.row) + 1 }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="bank_name" :props="props">
            {{ props.row.bank_name }}
          </q-td>
          <q-td key="account_number" :props="props">
            {{ props.row.account_number }}
          </q-td>
          <q-td key="account_name" :props="props">
            {{ props.row.account_name }}
          </q-td>

          <q-td key="created_at" :props="props">
            {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
          </q-td>
          <!-- 暫時先隱藏 -->
          <!-- <q-td key="status" :props="props">
            <q-icon v-if="props.row.deleted" size="xs" color="positive" name="check_circle" />
            <span v-else>- - -</span>
          </q-td> -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
            </q-btn>

            <q-btn flat fab-mini icon="delete" class="del q-mr-xs" @click="onRemove(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <!-- 查無資料 -->
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
      </template>
    </q-table>
    <!-- 虛擬貨幣 -->
    <div class="edit_title q-mb-sm q-mt-md">
      {{ $t("common.crypto_wallet") }}
    </div>

    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="crypto_list"
      :columns="cryptoWalletTableColumn"
      row-key="id"
    >
      <template #body="props">
        <q-tr>
          <q-td key="id" :props="props">
            {{ crypto_list.indexOf(props.row) + 1 }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="wallet_address" :props="props">
            {{ props.row.wallet_address }}
          </q-td>
          <q-td key="currency_brand" :props="props">
            {{ props.row.currency_brand }}
          </q-td>
          <q-td key="chain" :props="props">
            {{ props.row.chain }}
          </q-td>
          <q-td key="created_at" :props="props">
            {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
            </q-btn>

            <q-btn flat fab-mini icon="delete" class="del q-mr-xs" @click="onRemove(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
      </template>
    </q-table>

    <!-- 第三方支付 -->

    <div class="edit_title q-mb-sm q-mt-md">
      {{ $t("fund_method_type.third_party_payment") }}
    </div>

    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="e_wallet_list"
      :columns="bankTableColumn"
      row-key="id"
    >
      <template #body="props">
        <q-tr>
          <q-td key="id" :props="props">
            {{ e_wallet_list.indexOf(props.row) + 1 }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="bank_name" :props="props">
            {{ props.row.bank_name }}
          </q-td>
          <q-td key="account_number" :props="props">
            {{ props.row.account_number }}
          </q-td>
          <q-td key="account_name" :props="props">
            {{ props.row.account_name }}
          </q-td>

          <q-td key="created_at" :props="props">
            {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
          </q-td>
          <!-- 暫時先隱藏 -->
          <!-- <q-td key="status" :props="props">
            <q-icon v-if="props.row.deleted" size="xs" color="positive" name="check_circle" />
            <span v-else>- - -</span>
          </q-td> -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
            </q-btn>

            <q-btn flat fab-mini icon="delete" class="del q-mr-xs" @click="onRemove(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <!-- 查無資料 -->
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
      </template>
    </q-table>
    <!-- 編輯彈窗 -->
    <dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading">
      <template #label>
        <div class="q-card__section q-card__section--vert">
          <div class="dialog_title">{{ $t("common.add_and_edit_withdrawal_method") }}</div>
        </div>
      </template>
      <template #mainContent>
        <!-- 類別 -->
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">*{{ $t("query_params.withdraw_status") }}</div>
          <div class="col-12 col-sm-9">
            <q-select
              v-model="dialogData.edit.type"
              :options="typeDropdownList"
              dense
              emit-value
              map-options
              outlined
              readonly
              class="default-input"
            />
          </div>
        </div>
        <!-- 銀行轉帳 -->
        <div v-if="dialogData.edit.type === FUND_METHOD_TYPE.Enums.MoneyTransfer">
          <!-- 銀行 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 分行 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.bankName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.branch" outlined class="default-input" />
            </div>
          </div>
          <!-- 卡號 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.card_number") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.card_no" outlined class="default-input" />
            </div>
          </div>
          <!-- 幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.edit.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
                class="default-input"
              />
            </div>
          </div>
          <!-- 帳戶名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.account_name") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.account_name" outlined class="default-input" />
            </div>
          </div>
        </div>
        <!-- 電子錢包 -->
        <div v-if="dialogData.edit.type === FUND_METHOD_TYPE.Enums.CryptoWallet">
          <!-- 卡片名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 錢包位址 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.wallet_address") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.wallet_address" outlined class="default-input" />
            </div>
          </div>
          <!-- 虛擬貨幣 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.currency_brand") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.currency_brand" outlined class="default-input" />
            </div>
          </div>
          <!-- 區塊鏈 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.chain") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.chain" outlined class="default-input" />
            </div>
          </div>
          <!--出款幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.withdrawal_currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.edit.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                class="default-input"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
        </div>
        <div v-if="dialogData.edit.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment">
          <!-- 卡片名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.edit.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                class="default-input"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
          <!-- gateway -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("edit_form.gateway") }}</div>
            <div class="col-12 col-sm-9">
              <Gateway
                :currency="dialogData.edit.currency"
                :type="FUND_METHOD_TYPE.Enums.ThirdPartyPayment"
                :selectedOption="dialogData.edit.payment_gateway_id"
                @update:parentValue="handelEditGatewayTags"
              />
            </div>
          </div>
          <!-- BankName -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.bankName") }}</div>
            <div class="col-12 col-sm-9">
              <BankName
                :selectedOption="dialogData.edit.bank_id"
                :gateway="dialogData.edit.payment_gateway_id"
                @update:parentValue="handelEditBankNameTags"
              />
            </div>
          </div>
          <!-- 卡號 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.card_number") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.card_no" outlined class="default-input" />
            </div>
          </div>

          <!-- 帳戶名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.account_name") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.edit.account_name" outlined class="default-input" />
            </div>
          </div>
        </div>
      </template>
    </dialog-comp>
    <!-- 新增彈窗 -->
    <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" :loading="addLoading" max-width="600px">
      <template #label>
        <div class="q-card__section q-card__section--vert">
          <div class="dialog_title">{{ $t("common.add_and_edit_withdrawal_method") }}</div>
        </div>
      </template>
      <template #mainContent>
        <!-- 類別 -->
        <div class="items-baseline q-mb-md">
          <div class="col-12 col-sm-3 dialog_title2">*{{ $t("query_params.withdraw_status") }}</div>
          <div class="col-12 col-sm-12">
            <q-select
              v-model="dialogData.add.type"
              :options="typeDropdownList"
              dense
              emit-value
              map-options
              outlined
              class="default-input"
            />
          </div>
        </div>
        <!-- 銀行轉帳 -->
        <div v-if="dialogData.add.type === FUND_METHOD_TYPE.Enums.MoneyTransfer">
          <!-- 銀行 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 分行 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.bankName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.branch" outlined class="default-input" />
            </div>
          </div>
          <!-- 卡號 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.card_number") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.card_no" outlined class="default-input" />
            </div>
          </div>
          <!-- 幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.add.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                class="default-input"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
          <!-- 帳戶名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.account_name") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.account_name" outlined class="default-input" />
            </div>
          </div>
        </div>
        <!-- 虛擬貨幣錢包 -->
        <div v-if="dialogData.add.type === FUND_METHOD_TYPE.Enums.CryptoWallet">
          <!-- 卡片名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 錢包位址 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.wallet_address") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.wallet_address" outlined class="default-input" />
            </div>
          </div>
          <!-- 虛擬貨幣 -->
          <div class="row items-baseline q-mb-md">
            <div class="col-12 col-sm-3">*{{ $t("table_header.currency_brand") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.currency_brand" outlined class="default-input" />
            </div>
          </div>
          <!-- 區塊鏈 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.chain") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.chain" outlined class="default-input" />
            </div>
          </div>
          <!-- 出款幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.withdrawal_currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.add.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                class="default-input"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
        </div>
        <!--第三方-->
        <div v-if="dialogData.add.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment">
          <!-- 卡片名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.cardName") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.bank" outlined class="default-input" />
            </div>
          </div>
          <!-- 幣別 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.currency") }}</div>
            <div class="col-12 col-sm-9">
              <q-select
                v-model="dialogData.add.currency"
                :options="store.currencyList"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                style="min-width: 4.6875rem"
                class="default-input"
                :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
          <!-- gateway -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("edit_form.gateway") }}</div>
            <div class="col-12 col-sm-9">
              <Gateway
                :currency="dialogData.add.currency"
                :type="FUND_METHOD_TYPE.Enums.ThirdPartyPayment"
                :selectedOption="dialogData.add.payment_gateway_id"
                @update:parentValue="handelAddGatewayTags"
              />
            </div>
          </div>
          <!-- BankName -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.bankName") }}</div>
            <div class="col-12 col-sm-9">
              <BankName
                :selectedOption="dialogData.add.bank_id"
                :gateway="dialogData.add.payment_gateway_id"
                @update:parentValue="handelAddBankNameTags"
              />
            </div>
          </div>

          <!-- 卡號 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("common.card_number") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.card_no" outlined class="default-input" />
            </div>
          </div>

          <!-- 帳戶名稱 -->
          <div class="items-baseline q-mb-md">
            <div class="col-12 col-sm-3 dialog_title2">*{{ $t("table_header.account_name") }}</div>
            <div class="col-12 col-sm-9">
              <q-input v-model="dialogData.add.account_name" outlined class="default-input" />
            </div>
          </div>
        </div>
      </template>
    </dialog-comp>

    <!-- 刪除彈窗 -->
    <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading" max-width="600px">
      <template #mainContent>
        <div class="text-red q-mb-lg">{{ $t("common.delete_withdrawal settings") }}</div>
      </template>
    </dialog-comp>
  </q-card>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import type { CustomQTableProps } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import {
    getWithdrawSettingList,
    getWithdrawSetting,
    updateWithdrawSetting,
    addWithdrawSetting,
    deleteWithdrawSetting
  } from "@/api/member"
  import { useQueryStore } from "@/stores/queryStore"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/fundMethodType"
  import { FUND_METHOD_TYPE, ERROR_CODE } from "@/utils/constants"
  import type { WithdrawSettingItem } from "@/api/response.type"
  import Gateway from "./component/Gateway.vue"
  import BankName from "./component/BankName.vue"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const store = useQueryStore()
  const $q = useQuasar()

  const { search, tableData } = useSearch(getWithdrawSettingList)

  /** 此頁 tableData 為 API 物件（含各 list）；僅保證各 prop 為陣列，避免 q-table rows 為 undefined */
  const bank_transfer_list = computed(() => {
    const list = (tableData.value as { bank_transfer_list?: unknown })?.bank_transfer_list
    return Array.isArray(list) ? list : []
  })
  const crypto_list = computed(() => {
    const list = (tableData.value as { crypto_list?: unknown })?.crypto_list
    return Array.isArray(list) ? list : []
  })
  const e_wallet_list = computed(() => {
    const list = (tableData.value as { e_wallet_list?: unknown })?.e_wallet_list
    return Array.isArray(list) ? list : []
  })

  const { genTimeFormat } = useCommon()
  const typeDropdownList = genEnumToDropdown(Enums, FUND_METHOD_TYPE.I18nKeys)
    .map((e) => {
      e.label = t(e.label)
      return e
    })
    .filter(
      (e) => e.value === Enums.MoneyTransfer || e.value === Enums.CryptoWallet || e.value === Enums.ThirdPartyPayment
    )

  const bankTableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "id",
      label: t("table_header.id"),
      field: "id",
      sortable: false,
      align: "center"
    },
    {
      name: "name",
      label: t("table_header.cardName"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "bank_name",
      label: t("table_header.bankName"),
      field: "bank_name",
      sortable: false,
      align: "center"
    },
    {
      name: "account_number",
      label: t("table_header.card_number"),
      field: "account_number",
      sortable: false,
      align: "center"
    },
    {
      name: "account_name",
      label: t("table_header.account_name"),
      field: "account_name",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.created_on"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    // {
    //   name: "status",
    //   label: t("table_header.frequently_used_accounts"),
    //   field: "status",
    //   sortable: false,
    //   align: "center"
    // },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])
  const cryptoWalletTableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "id",
      label: t("table_header.id"),
      field: "id",
      sortable: false,
      align: "center"
    },
    {
      name: "name",
      label: t("table_header.cardName"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "wallet_address",
      label: t("table_header.wallet_address"),
      field: "wallet_address",
      sortable: false,
      align: "center"
    },
    {
      name: "currency_brand",
      label: t("table_header.currency_brand"),
      field: "currency_brand",
      sortable: false,
      align: "center"
    },
    {
      name: "chain",
      label: t("table_header.chain"),
      field: "chain",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.created_on"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  onMounted(async () => {
    await store.getCurrencyList()
    Promise.all([onSubmit()])
  })
  const dialogData = reactive<{
    edit: {
      id: string
      type: number
      bank: string
      branch: string
      card_no: string
      currency: number
      account_name: string
      bank_card_id: number
      wallet_address: string
      currency_brand: string
      chain: string
      payment_gateway_id: number
      bank_id: number
    }
    remove: {
      id: string
      bank_card_id: number
    }
    add: {
      id: string
      type: number
      bank: string
      branch: string
      card_no: string
      currency: number
      account_name: string
      bank_card_id: number
      wallet_address: string
      currency_brand: string
      chain: string
      payment_gateway_id: number
      bank_id: number
    }
  }>({
    edit: {
      id: route.params.id as string,
      type: 1,
      bank: "",
      branch: "",
      card_no: "",
      currency: 0,
      account_name: "",
      bank_card_id: 0,
      wallet_address: "",
      currency_brand: "",
      chain: "",
      payment_gateway_id: 0,
      bank_id: 0
    },
    remove: { id: route.params.id as string, bank_card_id: 0 },
    add: {
      id: route.params.id as string,
      type: 1,
      bank: "",
      branch: "",
      card_no: "",
      currency: 0,
      account_name: "",
      bank_card_id: 0,
      wallet_address: "",
      currency_brand: "",
      chain: "",
      payment_gateway_id: 0,
      bank_id: 0
    }
  })
  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    edit: {
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleEdit
    },
    add: {
      type: DialogType.ADD,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleAdd
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleRemove
    }
  })
  async function handleAdd() {
    if (dialogData.add.type === FUND_METHOD_TYPE.Enums.MoneyTransfer) {
      if (dialogData.add.bank === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.branch === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_branch"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.card_no === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_card_no"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.account_name === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_account_name"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }
    if (dialogData.add.type === FUND_METHOD_TYPE.Enums.CryptoWallet) {
      if (dialogData.add.wallet_address === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_wallet_address"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.currency_brand === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency_brand"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.chain === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_branch"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }
    if (dialogData.add.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment) {
      if (dialogData.add.bank === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.payment_gateway_id === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_channel"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.bank_id === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.card_no === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_card_no"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.add.account_name === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_account_name"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }
    openAddLoading()
    const sendData = {
      id: route.params.id as string,
      type: dialogData.add.type,
      bank: dialogData.add.bank,
      branch: dialogData.add.branch,
      card_no: dialogData.add.card_no,
      currency: dialogData.add.currency,
      account_name: dialogData.add.account_name,
      bank_card_id: dialogData.add.bank_card_id,
      wallet_address: dialogData.add.wallet_address,
      currency_brand: dialogData.add.currency_brand,
      chain: dialogData.add.chain,
      payment_gateway_id: dialogData.add.payment_gateway_id,
      bank_id: dialogData.add.bank_id
    }

    console.log(sendData, "sendData")
    const res = await addWithdrawSetting(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      onSubmit()
      closeAddDialog()
    } else {
      const i18nKey = ERROR_CODE.I18nKeys[res.code as ERROR_CODE.Enums]
      $q.notify({
        type: "negative",
        message: i18nKey ? t(i18nKey) : res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeAddLoading()
  }
  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading,
    closeDialog: closeAddDialog
  } = useDialog()

  function onAdd() {
    dialogData.add.type = 1
    dialogData.add.bank = ""
    dialogData.add.branch = ""
    dialogData.add.card_no = ""
    dialogData.add.currency = store.currencyList.length > 0 ? store.currencyList[0].value : 0
    dialogData.add.account_name = ""
    dialogData.add.wallet_address = ""
    dialogData.add.currency_brand = ""
    dialogData.add.chain = ""
    dialogData.add.payment_gateway_id = 0
    dialogData.add.bank_id = 0

    openAddDialog()
  }
  // 編輯彈窗
  const {
    dialog: EditDialog,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    loading: editLoading,
    openLoading: openeditLoading,
    closeLoading: closeeditLoading
  } = useDialog()

  const onAction = async (row: WithdrawSettingItem) => {
    openeditLoading()
    const sendData = {
      id: route.params.id as string,
      bank_card_id: row.id
    }
    const res = await getWithdrawSetting(sendData)
    if (res.code === 0) {
      dialogData.edit.type = res.data.payment_type_id
      dialogData.edit.bank = res.data.name
      dialogData.edit.branch = res.data.bank_name
      dialogData.edit.card_no = res.data.account_number
      dialogData.edit.currency = res.data.currency_id
      dialogData.edit.account_name = res.data.account_name
      dialogData.edit.bank_card_id = row.id
      dialogData.edit.wallet_address = row.wallet_address
      dialogData.edit.currency_brand = row.currency_brand
      dialogData.edit.chain = row.chain

      dialogData.edit.payment_gateway_id = res.data.payment_gateway_id
      dialogData.edit.bank_id = res.data.bank_id

      openEditDialog()
      closeeditLoading()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }
  async function handleEdit() {
    if (dialogData.edit.type === FUND_METHOD_TYPE.Enums.MoneyTransfer) {
      if (dialogData.edit.bank === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.branch === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_branch"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.card_no === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_card_no"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.account_name === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_account_name"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }
    if (dialogData.edit.type === FUND_METHOD_TYPE.Enums.CryptoWallet) {
      if (dialogData.edit.wallet_address === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_wallet_address"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.currency_brand === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency_brand"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.chain === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_branch"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }

    if (dialogData.edit.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment) {
      if (dialogData.edit.bank === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.currency === 0) {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_currency"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.payment_gateway_id === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_channel"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.bank_id === 0) {
        $q.notify({
          type: "negative",
          message: t("error_msg.please_select_bank"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.card_no === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_card_no"),
          position: "top",
          timeout: 1000
        })
        return
      } else if (dialogData.edit.account_name === "") {
        $q.notify({
          type: "negative",
          message: t("common.please_enter_account_name"),
          position: "top",
          timeout: 1000
        })
        return
      }
    }
    openeditLoading()

    const sendData = {
      id: route.params.id as string,
      type: dialogData.edit.type,
      bank: dialogData.edit.bank,
      branch: dialogData.edit.branch,
      card_no: dialogData.edit.card_no,
      currency: dialogData.edit.currency,
      account_name: dialogData.edit.account_name,
      bank_card_id: dialogData.edit.bank_card_id,
      wallet_address: dialogData.edit.wallet_address,
      currency_brand: dialogData.edit.currency_brand,
      chain: dialogData.edit.chain,
      payment_gateway_id: dialogData.edit.payment_gateway_id,
      bank_id: dialogData.edit.bank_id
    }

    const res = await updateWithdrawSetting(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit()
      closeEditDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeeditLoading()
  }
  // 刪除彈窗
  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    closeDialog: closeRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading
  } = useDialog()

  function onRemove(row: WithdrawSettingItem) {
    dialogData.remove.bank_card_id = row.id
    openRemoveDialog(row)
  }
  async function handleRemove() {
    const sendData = {
      id: route.params.id as string,
      bank_card_id: dialogData.remove.bank_card_id
    }
    openRemoveLoading()
    const res = await deleteWithdrawSetting(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      closeRemoveDialog()
      onSubmit()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeRemoveLoading()
  }
  function onSubmit() {
    const id = route.params.id as string
    search({ id: parseInt(id) })
  }

  const handelAddGatewayTags = (value: number) => {
    dialogData.add.payment_gateway_id = value
  }
  const handelAddBankNameTags = (value: number) => {
    dialogData.add.bank_id = value
  }
  const handelEditGatewayTags = (value: number) => {
    dialogData.edit.payment_gateway_id = value
  }
  const handelEditBankNameTags = (value: number) => {
    dialogData.edit.bank_id = value
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.q-table__container) {
    border-top-left-radius: inherit !important;
    border-top-right-radius: inherit !important;
  }
</style>
