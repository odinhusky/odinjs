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
                    <span>{{ $t("table_header.actual_withdrawal") }}</span>
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
                  <span style="display: block; color: #2196f3; cursor: pointer" @click="onOpenDetail(props.row)">
                    {{ props.row.trans_code }}
                  </span>
                  <span
                    style="color: orange; cursor: pointer"
                    @click="onOpenDetail(props.row)"
                    v-if="props.row.ref_trans_code !== ''"
                  >
                    {{ props.row.ref_trans_code }}
                  </span>
                </q-td>
                <q-td key="member_account" :props="props">
                  <div class="column">
                    <span>{{ props.row.member_account }}</span>
                    <span>{{ props.row.member_name }}</span>
                  </div>
                </q-td>
                <q-td key="level_name" :props="props">
                  {{ getDynamicLangValue(props.row.level_name) }}
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
                        'text-negative':
                          props.row.status === SAVE_STATUS_TYPE.Enums.Fail ||
                          props.row.status === SAVE_STATUS_TYPE.Enums.RISKCONTROLPROGRESS ||
                          props.row.status === SAVE_STATUS_TYPE.Enums.RISKLOCKED ||
                          props.row.status === SAVE_STATUS_TYPE.Enums.WAITINGFORBACK
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
                <q-td key="risk_result" :props="props">
                  <div v-for="reason in props.row.risk_result" :key="reason">
                    {{ $t(riskReasonMap[reason]) }}
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
                  <template
                    v-if="
                      props.row.status === SAVE_STATUS_TYPE.Enums.RISKCONTROLPROGRESS ||
                      props.row.status === SAVE_STATUS_TYPE.Enums.RISKLOCKED ||
                      props.row.status === SAVE_STATUS_TYPE.Enums.WAITINGFORBACK
                    "
                  >
                    <template v-if="props.row.status === SAVE_STATUS_TYPE.Enums.RISKCONTROLPROGRESS">
                      <q-btn color="green" class="q-mr-xs" @click="riskLock(props.row.id)">{{
                        $t("btn.risk_control_lock")
                      }}</q-btn>
                    </template>
                    <template v-else-if="props.row.status === SAVE_STATUS_TYPE.Enums.RISKLOCKED">
                      <q-btn color="green" class="q-mr-xs" @click="riskAgree(props.row.id)">{{ $t("btn.pass") }}</q-btn>
                      <q-btn color="red" @click="riskDisagree(props.row.id)">{{ $t("btn.reject") }}</q-btn>
                    </template>

                    <template v-else-if="props.row.status === SAVE_STATUS_TYPE.Enums.WAITINGFORBACK">
                      <q-btn color="green" class="q-mr-xs" @click="onConfirm(props.row.id)">{{ $t("btn.pass") }}</q-btn>
                      <q-btn color="red" @click="onReject(props.row.id)">{{ $t("btn.reject") }}</q-btn>
                    </template>
                  </template>
                  <template v-else>
                    <template
                      v-if="
                        props.row.payment_type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment ||
                        props.row.payment_type === FUND_METHOD_TYPE.Enums.CryptoWalletThird ||
                        props.row.payment_type === FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
                      "
                    >
                      <q-btn
                        v-if="props.row.status === SAVE_STATUS_TYPE.Enums.UnderReview"
                        color="green"
                        :disable="props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                        class="q-mr-xs"
                        @click="onConfirm(props.row.id)"
                        >{{ $t("btn.pass") }}</q-btn
                      >
                      <q-btn
                        v-if="props.row.status === SAVE_STATUS_TYPE.Enums.UnderReview"
                        color="red"
                        :disable="props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                        @click="onReject(props.row.id)"
                        >{{ $t("btn.reject") }}</q-btn
                      >
                    </template>

                    <template
                      v-else-if="
                        props.row.payment_type === FUND_METHOD_TYPE.Enums.MoneyTransfer ||
                        props.row.payment_type === FUND_METHOD_TYPE.Enums.CryptoWallet
                      "
                    >
                      <!--如果已通過或取消或標籤拒絕-->
                      <template
                        v-if="
                          props.row.status === SAVE_STATUS_TYPE.Enums.Success ||
                          props.row.status === SAVE_STATUS_TYPE.Enums.Fail ||
                          props.row.status === SAVE_STATUS_TYPE.Enums.FailedTagBlocking
                        "
                      >
                        <q-btn
                          v-if="props.row.status === SAVE_STATUS_TYPE.Enums.UnderReview"
                          color="green"
                          :disable="props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                          class="q-mr-xs"
                          @click="onConfirm(props.row.id)"
                        >
                          {{ $t("btn.pass") }}
                        </q-btn>
                        <q-btn
                          v-if="props.row.status === SAVE_STATUS_TYPE.Enums.UnderReview"
                          color="red"
                          :disable="props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                          @click="onReject(props.row.id)"
                        >
                          {{ $t("btn.reject") }}
                        </q-btn>
                      </template>
                      <!-- 鎖單且當前操作者等於之前操作者 -->
                      <template
                        v-else-if="
                          props.row.status === SAVE_STATUS_TYPE.Enums.ORDERLOCKET &&
                          props.row.operator?.toLowerCase() === username?.toLowerCase()
                        "
                      >
                        <q-btn
                          color="green"
                          :disable="
                            props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview &&
                            props.row.status !== SAVE_STATUS_TYPE.Enums.ORDERLOCKET
                          "
                          class="q-mr-xs"
                          @click="onConfirm(props.row.id)"
                        >
                          {{ $t("btn.pass") }}
                        </q-btn>
                        <q-btn
                          color="red"
                          :disable="
                            props.row.status !== SAVE_STATUS_TYPE.Enums.UnderReview &&
                            props.row.status !== SAVE_STATUS_TYPE.Enums.ORDERLOCKET
                          "
                          @click="onReject(props.row.id)"
                        >
                          {{ $t("btn.reject") }}
                        </q-btn>
                      </template>
                      <!-- 已鎖單且之前操作者不等於當前操作者 -->
                      <template
                        v-else-if="
                          props.row.status === SAVE_STATUS_TYPE.Enums.ORDERLOCKET &&
                          props.row.operator?.toLowerCase() !== username?.toLowerCase()
                        "
                      >
                        <q-btn color="orange" class="q-mr-xs" @click="openCheckLocked(props.row.id)">
                          {{ $t("btn.has_locked") }}
                        </q-btn>
                      </template>
                      <!-- 非鎖單狀態且還未通過跟拒絕 -->
                      <template v-else-if="props.row.status !== SAVE_STATUS_TYPE.Enums.ORDERLOCKET">
                        <q-btn
                          color="orange"
                          class="q-mr-xs"
                          @click="onLocked(props.row.id)"
                          :disable="props.row.status === SAVE_STATUS_TYPE.Enums.MEMBERCANCELL"
                        >
                          {{ $t("btn.locked") }}
                        </q-btn>
                      </template>
                    </template> </template
                  ><!--end-->
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
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("dialog.withdrawal_number_merchant") }}</div>
      </div>
    </template>
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="q-pb-md">
            <span class="q-mr-xl h7-bold grey">{{ $t("query_params.withdraw_number") }}</span>
            <span class="text-blue">{{ dialogData.detail.trans_code }}</span>
          </div>
        </div>
        <!--會員資料-->
        <div class="col-12" v-if="dialogMemberData[0].id !== 0">
          <div class="q-mb-sm bold h4-bold grey">
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
                  {{ getLevel(props.row.member_level) }}
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
              <q-tr>
                <q-td key="cash_flow_project" :props="props"> {{ $t("table_header.full_name") }} </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.fullname || "" }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props"> {{ $t("common.country_code") }} </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.country || "" }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props"> {{ $t("table_header.phone_number") }} </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.phone || "" }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props"> {{ $t("table_header.email") }} </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.email || "" }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!--金流明細-->
          <div class="q-my-sm bold h4-bold grey">
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
                    v-if="props.row.bank_account"
                    icon="content_copy"
                    size="sm"
                    color="primary"
                    flat
                    dense
                    @click="copyToClipboard(props.row.bank_account)"
                  />
                </q-td>
              </q-tr>
              <q-tr
                ><!--虛擬幣-->
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("table_header.virtual_currency") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.crypto }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("edit_form.protocol") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.chain }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="cash_flow_project" :props="props">
                  {{ $t("table_header.wallet_address") }}
                </q-td>
                <q-td key="content" :props="props">
                  {{ props.row.wallet_address }}
                  <q-btn
                    v-if="props.row.wallet_address"
                    icon="content_copy"
                    size="sm"
                    color="primary"
                    flat
                    dense
                    @click="copyToClipboard(props.row.wallet_address)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div class="q-my-sm bold h4-bold grey">
            {{ $t("table_header.withdrawal_details") }}
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
                  {{ $t("table_header.withdrawal_amounts") }}
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
                  <span class="text-deep-pink" v-if="props.row.deduction_fee > 0">-{{ props.row.deduction_fee }}</span>
                  <span class="text-deep-pink" v-else>0</span>
                </q-td>
              </q-tr>
              <q-tr>
                <q-td key="project" :props="props">
                  {{ $t("table_header.failure_to_meet_audit") }}
                </q-td>
                <q-td key="withdrawal_currency" :props="props">
                  <span class="text-deep-pink" v-if="props.row.audit_amount > 0">-{{ props.row.audit_amount }}</span>
                  <span class="text-deep-pink" v-else>0</span>
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
          <div class="q-my-md bold h4-bold grey">
            {{ $t("table_header.withdrawal_info") }}
          </div>
          <div
            v-for="(item, index) in dialogData.detail.images"
            :key="`${item.upload_at}-${index}`"
            class="column items-center q-mb-lg"
          >
            <span class="q-mb-sm">{{ genTimeFormat(item.upload_at) }}</span>
            <q-img :src="`${item.path}?t=${Date.now()}`" alt="withdrawal_info" width="300px" />
          </div>
          <div class="q-my-md bold h4-bold grey">
            {{ $t("table_header.private_remark") }}
          </div>
          <!--<p class="bold h4-bold grey">
            {{ $t("table_header.apply_template") }}
          </p>-->
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select
                v-model="dialogData.detail.remark_template"
                :options="templateOption"
                emit-value
                map-options
                outlined
                class="default-input"
              />
            </div>
            <div class="col-4" style="display: flex; align-items: center">
              <q-btn @click="changeTemplate" class="btns btn-blue">
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
          <div class="row q-col-gutter-sm">
            <div class="col-12 q-mt-lg" style="justify-content: end; display: flex">
              <q-btn outline color="primary" @click="closeDetailDialog" class="btns detail-btn">
                {{ $t("btn.cancel") }}
              </q-btn>
              <!--風控-->
              <template
                v-if="
                  dialogData.detail.status === SAVE_STATUS_TYPE.Enums.RISKCONTROLPROGRESS ||
                  dialogData.detail.status === SAVE_STATUS_TYPE.Enums.RISKLOCKED ||
                  dialogData.detail.status === SAVE_STATUS_TYPE.Enums.WAITINGFORBACK
                "
              >
                <template v-if="dialogData.detail.status === SAVE_STATUS_TYPE.Enums.RISKCONTROLPROGRESS">
                  <q-btn class="q-ml-sm btns btn-green" @click="riskLock(dialogData.detail.id)">{{
                    $t("btn.risk_control_lock")
                  }}</q-btn>
                </template>
                <template v-else-if="dialogData.detail.status === SAVE_STATUS_TYPE.Enums.RISKLOCKED">
                  <q-btn
                    color="green btns btn-green"
                    class="q-mr-xs q-ml-xs"
                    @click="riskAgree(dialogData.detail.id)"
                    >{{ $t("btn.pass") }}</q-btn
                  >
                  <q-btn color="red" @click="riskDisagree(dialogData.detail.id)">{{ $t("btn.reject") }}</q-btn>
                </template>
                <template v-else-if="dialogData.detail.status === SAVE_STATUS_TYPE.Enums.WAITINGFORBACK">
                  <q-btn
                    color="green btns btn-green"
                    class="q-mr-xs q-ml-xs"
                    @click="onConfirm(dialogData.detail.id)"
                    >{{ $t("btn.pass") }}</q-btn
                  >
                  <q-btn color="red" @click="onReject(dialogData.detail.id)">{{ $t("btn.reject") }}</q-btn>
                </template>
              </template>
              <template v-else>
                <template
                  v-if="
                    dialogData.detail.payment_type_id === FUND_METHOD_TYPE.Enums.ThirdPartyPayment ||
                    dialogData.detail.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWalletThird ||
                    dialogData.detail.payment_type_id === FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
                  "
                >
                  <q-btn
                    :disable="dialogData.detail.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                    @click="onConfirm(dialogData.detail.id, dialogData.detail.remark)"
                    class="q-ml-sm btns btn-green"
                  >
                    {{ $t("btn.pass") }}
                  </q-btn>
                  <q-btn
                    :disable="dialogData.detail.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                    @click="onReject(dialogData.detail.id, dialogData.detail.remark)"
                    class="q-ml-sm btns btn-pink"
                  >
                    {{ $t("btn.reject") }}
                  </q-btn>
                </template>
                <template
                  v-else-if="
                    dialogData.detail.payment_type_id === FUND_METHOD_TYPE.Enums.MoneyTransfer ||
                    dialogData.detail.payment_type_id === FUND_METHOD_TYPE.Enums.CryptoWallet
                  "
                >
                  <!--如果已通過或取消或標籤拒絕-->
                  <template
                    v-if="
                      dialogData.detail.status === SAVE_STATUS_TYPE.Enums.Success ||
                      dialogData.detail.status === SAVE_STATUS_TYPE.Enums.Fail ||
                      dialogData.detail.status === SAVE_STATUS_TYPE.Enums.FailedTagBlocking
                    "
                  >
                    <q-btn
                      :disable="dialogData.detail.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                      @click="onConfirm(dialogData.detail.id, dialogData.detail.remark)"
                      class="q-ml-sm btns btn-green"
                    >
                      {{ $t("btn.pass") }}
                    </q-btn>
                    <q-btn
                      :disable="dialogData.detail.status !== SAVE_STATUS_TYPE.Enums.UnderReview"
                      @click="onReject(dialogData.detail.id, dialogData.detail.remark)"
                      class="q-ml-sm btns btn-pink"
                    >
                      {{ $t("btn.reject") }}
                    </q-btn>
                  </template>
                  <!-- 鎖單且當前操作者等於之前操作者 -->
                  <template
                    v-else-if="
                      dialogData.detail.status === SAVE_STATUS_TYPE.Enums.ORDERLOCKET &&
                      dialogData.detail.operator?.toLowerCase() === username?.toLowerCase()
                    "
                  >
                    <q-btn
                      :disable="
                        ![SAVE_STATUS_TYPE.Enums.UnderReview, SAVE_STATUS_TYPE.Enums.ORDERLOCKET].includes(
                          dialogData.detail.status
                        )
                      "
                      @click="onConfirm(dialogData.detail.id, dialogData.detail.remark)"
                      class="q-ml-sm btns btn-green"
                    >
                      {{ $t("btn.pass") }}
                    </q-btn>
                    <q-btn
                      :disable="
                        ![SAVE_STATUS_TYPE.Enums.UnderReview, SAVE_STATUS_TYPE.Enums.ORDERLOCKET].includes(
                          dialogData.detail.status
                        )
                      "
                      @click="onReject(dialogData.detail.id, dialogData.detail.remark)"
                      class="q-ml-sm btns btn-pink"
                    >
                      {{ $t("btn.reject") }}
                    </q-btn>
                  </template>
                  <!-- 已鎖單且之前操作者不等於當前操作者 -->
                  <template
                    v-else-if="
                      dialogData.detail.status === SAVE_STATUS_TYPE.Enums.ORDERLOCKET &&
                      dialogData.detail.operator?.toLowerCase() !== username?.toLowerCase()
                    "
                  >
                    <q-btn
                      color="orange"
                      class="q-ml-sm btns btn-orange"
                      @click="openCheckLocked(dialogData.detail.id)"
                    >
                      {{ $t("btn.has_locked") }}
                    </q-btn>
                  </template>
                  <!-- 非鎖單狀態且還未通過跟拒絕 -->
                  <template v-else-if="dialogData.detail.status !== SAVE_STATUS_TYPE.Enums.ORDERLOCKET">
                    <q-btn
                      color="orange"
                      class="q-ml-sm btns btn-orange"
                      @click="onLocked(dialogData.detail.id)"
                      :disable="dialogData.detail.status === SAVE_STATUS_TYPE.Enums.MEMBERCANCELL"
                    >
                      {{ $t("btn.locked") }}
                    </q-btn>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>
  <!-- lock彈窗 -->
  <dialog-comp v-model="lockedDialog" :configs="dialogConfigs.locked" :loading="lockedLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_lock") }}</div>
    </template>
  </dialog-comp>

  <!-- 風控同意 -->
  <dialog-comp
    v-model="riskAgreeDialog"
    :configs="dialogConfigs.riskAgree"
    :loading="riskAgreeLoading"
    max-width="30rem"
  >
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("dialog.confirm_proceed_payment") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div>{{ $t("dialog.no_response_paid") }}</div>
      </div>
    </template>
  </dialog-comp>

  <!-- 風控取消 -->
  <dialog-comp
    v-model="riskDisagreeDialog"
    :configs="dialogConfigs.riskDisagree"
    :loading="riskDisagreeLoading"
    max-width="30rem"
  >
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("dialog.confirm_reject_payment") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div>{{ $t("dialog.once_confirmed_not") }}</div>
      </div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, reactive, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar, Notify } from "quasar"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import { FUND_METHOD_TYPE, SAVE_STATUS_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import type { GetDepositAndWithdrawalList } from "@/api/request.type"
  import type { DepositAndWithdrawalItem } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import {
    getWithdrawsList,
    getWithdrawDetail,
    getRemarkList,
    withdrawConfirm,
    withdrawReject,
    getCheckTag,
    updateCheckTag,
    exportWithdrawalList,
    WithdrawLlocked,
    riskLocked,
    riskConfirm
  } from "@/api/depositAndwithdrawal"

  import { getMemberDetail, getMemberTagList } from "@/api/member"
  import memberTagOption from "@/components/forms/memberTagOption.vue"
  import { useLanguageStore } from "src/stores/languageStore"
  import { usePermission } from "@/hook/usePermission"
  import { useQueryStore } from "@/stores/queryStore"
  import { useNotifyStore } from "@/stores/notifyStore"
  import { useIntervalFn } from "@vueuse/core"
  import { useEnv } from "src/hook/useEnv"

  const reloadInterval = shallowRef(0)
  const queryStore = useQueryStore()
  const notifyStore = useNotifyStore()
  const queryRef = ref(null)
  const reloadIntervalMillisecond = computed(() => reloadInterval.value * 1000)

  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const { pause, resume, isActive } = useIntervalFn(() => {
    queryRef.value?.onSubmit()
    closeEditDialog()
    closeDetailLoading()
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
  const username = sessionStorage.getItem("account")
  const { t } = useI18n()
  const $q = useQuasar()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useWithdrawalNumber: true,
    useRefTransCode: true,
    useMemberAccount: true,
    usePaymentType: true,
    useTierWhenWithdrawal: true,
    useCurrency: true,
    useSaveStatus: true,
    useOperator: true,
    useDatePicker: true,
    useDateType: true
  })

  //正式
  let { search, tableData, totalSize } = useSearch(getWithdrawsList)

  const { genTimeFormat, moneyFormat, copyToClipboard } = useCommon()
  let catchQueryForm: GetDepositAndWithdrawalList

  async function onSubmit(queryForm: GetDepositAndWithdrawalList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }
  //標籤 後端尚未提供
  let tagLabel: Tag[] = reactive([])
  let checkLabel: Tag[] = reactive([])
  onMounted(async () => {
    await queryStore.getMemberLevel()

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
        label: t("table_header.withdrawal_number"),
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
        name: "level_name",
        label: t("table_header.tier_when_withdrawal"),
        field: "level_name",
        sortable: false,
        align: "center"
      },
      {
        name: "payment_type",
        label: t("table_header.payment_gateway"),
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
        label: t("table_header.withdrawal_amounts"),
        field: "amount",
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
        label: t("table_header.save_withdrawal_status"),
        field: "status",
        sortable: false,
        align: "center"
      },
      {
        name: "risk_result",
        label: t("table_header.risk_control_reason"),
        field: "risk_result",
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
      label: t("table_header.withdrawal_amounts"),
      field: "withdrawal_currency",
      sortable: false,
      align: "center"
    }
  ])
  const dialogData = reactive({
    detail: {} as DepositAndWithdrawalItem,
    edit: {},
    locked: {},
    riskAgree: { id: 0, content: "" } as { id: number; content: string | number },
    riskDisagree: { id: 0, content: "" } as { id: number; content: string | number }
  })
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    detail: {
      dialogLabelI18nKey: "",
      type: DialogType.ADD,
      useActions: false,
      submitFunction: handleOpenDetail
    },
    edit: {
      dialogLabelI18nKey: "btn.tag_settings",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit
    },
    locked: {
      dialogLabelI18nKey: "btn.locked",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleLocked
    },
    riskAgree: {
      dialogLabelI18nKey: "",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRiskAgree
    },
    riskDisagree: {
      dialogLabelI18nKey: "",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRiskDisagree
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

  const {
    dialog: detailDialog,
    openDialog: openDetailDialog,
    loading: detailLoading,
    openLoading: openDetailLoading,
    closeLoading: closeDetailLoading,
    closeDialog: closeDetailDialog
  } = useDialog()

  async function onOpenDetail(row: DepositAndWithdrawalItem) {
    dialogData.detail.id = row.id
    dialogData.detail.member_id = 0
    await getWithdrawInfo(row.id)

    openDetailDialog()
  }

  const dialogBankData = reactive([
    {
      currency: "",
      payment_type: "",
      payment_gateway_name: "",
      bank_account: "",
      crypto: "",
      chain: "",
      wallet_address: ""
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

  //取得該筆提款詳細內容
  const getWithdrawInfo = async (id: number) => {
    const sendData = {
      id: id
    }
    const { data } = await getWithdrawDetail(sendData)

    dialogData.detail.member_id = data.member_id
    dialogData.detail.trans_code = data.trans_code
    dialogData.detail.images = data.images.map((image) => {
      return {
        path: `${VITE_APP_BASE_API}/${image.path}`,
        base64: image.base64,
        upload_at: image.upload_at
      }
    })

    dialogData.detail.status = data.status
    dialogData.detail.remark = data.status === 1 ? "" : data.remark
    dialogData.detail.payment_type_id = data.payment_type
    dialogData.detail.operator = data.operator
    //紀錄存款時的層級
    dialogMemberData[0].member_level = data.level_id

    //彈窗-金流明細
    /* const currencyLabel = currencyList?.find((item) => item.value === parseInt(data.currency))
        console.log(data.currency)*/
    dialogBankData[0].currency = data.currency
    dialogBankData[0].payment_type = t(FUND_METHOD_TYPE.I18nKeys[data.payment_type as FUND_METHOD_TYPE.Enums])
    dialogBankData[0].payment_gateway_name = data.payment_gateway_name

    dialogBankData[0].bank_account = data.bank_detail.bank_account ? (data.bank_detail.bank_account as string) : ""

    dialogBankData[0].crypto = data.crypto_detail?.crypto || ""
    dialogBankData[0].chain = data.crypto_detail?.chain || ""
    dialogBankData[0].wallet_address = data.crypto_detail?.wallet_address || ""
    /*虛擬幣相關*/

    //彈窗存款明細
    dialogAmountData[0].amount = data.amount
    dialogAmountData[0].deduction_fee = data.deduction_fee
    dialogAmountData[0].promotion_amount = data.promotion_amount
    dialogAmountData[0].audit_amount = data.audit_amount
    dialogAmountData[0].actual_amount = data.actual_amount

    getMemberInfo(dialogData.detail.member_id)

    console.log(data)
  }

  const memberData = reactive({
    id: 0,
    account: "",
    member_level: 0,
    enable: 0,
    enabled: false,
    labels: [],
    fullname: "",
    country: "",
    phone: "",
    email: ""
  })
  const dialogMemberData = reactive([
    {
      id: 0,
      account: "",
      member_level: 0,
      enable: 0,
      fullname: "",
      country: "",
      phone: "",
      email: "",
      member_tag: [] as Tag[]
    }
  ])
  interface Tag {
    id: number
  }

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
    dialogMemberData[0].enable = memberData.enabled == true ? 1 : 0
    dialogMemberData[0].fullname = memberData.fullname || ""
    dialogMemberData[0].country = memberData.country || ""
    dialogMemberData[0].phone = memberData.phone || ""
    dialogMemberData[0].email = memberData.email || ""

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
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
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

  const handelBlockTags = (value: []) => {
    tagLabel = value
  }
  const onConfirm = async (id: number, content: string | number = "") => {
    dialogData.riskAgree.id = id
    dialogData.riskAgree.content = content
    openRiskAgreeDialog()
    //取得該會員的標籤
    /*await getMemberInfo(row.member_id)
        //核對是否有彈窗設定的標籤 有的話要跳出警告
        const memberTags = checkLabel.filter((tag) => memberTagIds.includes(tag.id))
        if (memberTags.length > 0) {
        }*/
  }
  const onReject = async (id: number, content: string | number = "") => {
    dialogData.riskDisagree.id = id
    dialogData.riskDisagree.content = content
    openRiskDisagreeDialog()
  }

  const onExport = async () => {
    const params: GetDepositAndWithdrawalList = catchQueryForm

    // 匯出所有搜尋結果
    params.size = totalSize.value
    const { search } = useSearch(exportWithdrawalList)
    await search(params)
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

  //鎖單
  const {
    dialog: lockedDialog,
    openDialog: openlockedDialog,
    closeDialog: closlockedDialog,
    loading: lockedLoading,
    openLoading: openlockedLoading,
    closeLoading: closelockedLoading
  } = useDialog()
  const lockId = ref(0)
  function openCheckLocked(id: number) {
    lockId.value = id
    openlockedDialog()
  }

  async function handleLocked() {
    onLocked(lockId.value)
    openlockedDialog()
  }

  async function onLocked(id: number) {
    let sendData = {
      id: id
    }
    const res = await WithdrawLlocked(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      if (dialogData.detail.id) {
        getWithdrawInfo(dialogData.detail.id)
      }
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closelockedLoading()
    closlockedDialog()
  }
  function getLevel(memberLevel: number) {
    for (const item of queryStore.memberLevel) {
      if (item.value === memberLevel) {
        return item.label
      }
    }
    return ""
  }

  //風控
  const riskReasonMap: Record<number, string> = {
    1: "risk_control_settings.first_withdrawal",
    2: "risk_control_settings.withdrawal_amount_than_set",
    3: "risk_control_settings.bonus_claimed",
    4: "risk_control_settings.total_withdrawal"
  }
  const {
    dialog: riskAgreeDialog,
    openDialog: openRiskAgreeDialog,
    loading: riskAgreeLoading,
    openLoading: openRiskAgreeLoading,
    closeLoading: closeRiskAgreeLoading,
    closeDialog: closeRiskAgreeDialog
  } = useDialog()

  async function riskAgree(id: number) {
    const res = await riskConfirm(id)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  async function handleRiskAgree() {
    openRiskAgreeLoading()
    let sendData = {
      id: dialogData.riskAgree.id,
      remark: dialogData.riskAgree.content
    }
    const res = await withdrawConfirm(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeDetailDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeRiskAgreeDialog()
    closeRiskAgreeLoading()
    closeDetailDialog()
  }

  const {
    dialog: riskDisagreeDialog,
    openDialog: openRiskDisagreeDialog,
    loading: riskDisagreeLoading,
    openLoading: openDisagreeLoading,
    closeLoading: closeDisagreeLoading,
    closeDialog: closeDisagreeDialog
  } = useDialog()

  async function riskDisagree(id: number) {
    let sendData = {
      id: id,
      remark: ""
    }
    const res = await withdrawReject(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })

      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  async function handleRiskDisagree() {
    openDisagreeLoading()
    let sendData = {
      id: dialogData.riskDisagree.id,
      remark: dialogData.riskDisagree.content
    }

    const res = await withdrawReject(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeDetailDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeDisagreeDialog()
    closeDisagreeLoading()
    closeDetailDialog()
  }
  //風控鎖單
  async function riskLock(id: number) {
    const res = await riskLocked(id)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.order_locked_successfully"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
    closeDetailDialog()
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
