<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <div class="msk" v-if="!permission.edit"></div>
      <SEOConfig />
      <EmailConfig />
      <q-form class="form-container" @submit="setSettings">
        <q-card class="q-pa-md bg-transparent" flat>
          <q-card-section class="row q-gutter-xl q-pa-none">
            <!-- 遊戲大廳開啟方式 -->
            <div>
              <div>{{ $t("website_settings.open_lobby_mode") }}</div>
              <q-select
                v-model="form.open_lobby_mode"
                :options="openLobbyModeDropdownList"
                class="select-open-lobby q-mt-xs"
                dense
                options-dense
                outlined
                emit-value
                map-options
              />
            </div>
            <!-- 出款密碼 only okbet -->
            <!-- <div class="q-pl-xl">
              <div>{{ $t("website_settings.require_withdrawal_password") }}</div>
              <div class="enable q-mt-xs">
                <q-toggle
                  v-model="form.require_withdrawal_password"
                  :color="form.require_withdrawal_password ? 'positive' : 'negative'"
                  :false-value="WITHDRAWAL_PASSWORD.Enums.NoRequire"
                  :true-value="WITHDRAWAL_PASSWORD.Enums.Require"
                  stack-label
                  size="lg"
                  :label="form.require_withdrawal_password ? $t('common.enable') : $t('common.disable')"
                />
              </div>
            </div> -->
          </q-card-section>
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("website_settings.customer_support_links") }}</div>
            <div class="q-mt-xs link-container">
              <div v-for="service in Object.keys(form.customer_services)" :key="service" class="link-row">
                <div class="title">{{ service }}</div>
                <!-- 不同的客服連結，欄位不同 -->
                <template v-if="service === CUSTOMER_SERVICES.Enums.Unus">
                  <div class="column q-gutter-md no-wrap q-pt-xs">
                    <div class="enable">
                      <q-toggle
                        v-model="form.customer_services[service].enable"
                        :color="form.customer_services[service].enable ? 'positive' : 'negative'"
                        :false-value="false"
                        :true-value="true"
                        stack-label
                        size="lg"
                        :label="form.customer_services[service].enable ? $t('common.enable') : $t('common.disable')"
                      />
                    </div>
                    <q-input v-model="form.customer_services[service].appID" dense outlined class="input-url">
                      <template v-slot:before>
                        <span class="text-subtitle2 text-black q-pl-sm"> appID </span>
                      </template>
                    </q-input>
                    <q-input v-model="form.customer_services[service].compID" dense outlined class="input-url">
                      <template v-slot:before>
                        <span class="text-subtitle2 text-black q-pl-sm q-mr-lg"> compID </span>
                      </template>
                    </q-input>
                  </div>
                </template>
                <template v-if="service === CUSTOMER_SERVICES.Enums.TextLiveChat">
                  <div class="column q-gutter-md no-wrap q-pt-xs">
                    <div class="enable">
                      <q-toggle
                        v-model="form.customer_services[service].enable"
                        :color="form.customer_services[service].enable ? 'positive' : 'negative'"
                        :false-value="false"
                        :true-value="true"
                        stack-label
                        size="lg"
                        :label="form.customer_services[service].enable ? $t('common.enable') : $t('common.disable')"
                      />
                    </div>
                    <q-input v-model="form.customer_services[service].appID" dense outlined class="input-url">
                      <template v-slot:before>
                        <span class="text-subtitle2 text-black q-pl-sm"> appID </span>
                      </template>
                    </q-input>
                  </div>
                </template>
                <template v-if="service === CUSTOMER_SERVICES.Enums.Tawk">
                  <div class="column q-gutter-md no-wrap q-pt-xs">
                    <div class="enable">
                      <q-toggle
                        v-model="form.customer_services[service].enable"
                        :color="form.customer_services[service].enable ? 'positive' : 'negative'"
                        :false-value="false"
                        :true-value="true"
                        stack-label
                        size="lg"
                        :label="form.customer_services[service].enable ? $t('common.enable') : $t('common.disable')"
                      />
                    </div>
                    <q-input v-model="form.customer_services[service].appID" dense outlined class="input-url">
                      <template v-slot:before>
                        <span class="text-subtitle2 text-black q-pl-sm"> appID </span>
                      </template>
                    </q-input>
                    <q-input v-model="form.customer_services[service].compID" dense outlined class="input-url">
                      <template v-slot:before>
                        <span class="text-subtitle2 text-black q-pl-sm q-mr-lg"> compID </span>
                      </template>
                    </q-input>
                  </div>
                </template>
              </div>
            </div>
          </q-card-section>
          <!-- KYC -->
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("website_settings.kyc_setting") }}</div>
            <div class="q-mt-xs row kyc">
              <template v-for="(kycSetting, i) in form.kyc_setting" :key="i">
                <div class="col-3 kyc-outline">
                  <div class="kyc-container">
                    <!-- KYC 顯示控制 -->
                    <div>
                      <span class="text-subtitle2 text-black q-mr-sm">{{ $t("btn.show") }}</span>
                      <q-toggle dense v-model="kycSetting.display" />
                      <q-btn color="red" size="sm" class="q-ml-md" @click="updateKycCard(i)">{{
                        $t("btn.remove")
                      }}</q-btn>
                    </div>
                    <!-- KYC 類型 -->
                    <div class="q-mt-md">
                      <q-select
                        class="kyc-select"
                        dense
                        options-dense
                        outlined
                        emit-value
                        map-options
                        v-model="kycSetting.type"
                        :options="kycTypeList"
                      >
                        <template v-slot:before>
                          <span class="text-subtitle2 text-black q-mr-sm">{{ $t("query_params.type") }}</span>
                        </template>
                      </q-select>
                    </div>
                    <!-- KYC 標題 -->
                    <div class="q-mt-md row">
                      <template v-for="lang in kycSetting.lang" :key="lang">
                        <div class="col q-pr-md" v-if="langList.some((item) => item.label === lang.code)">
                          <div>{{ lang.code.toLocaleUpperCase() }}:</div>
                          <div>
                            <q-input outlined v-model="lang.title" :label="$t('table_header.title')"></q-input>
                            <q-input
                              outlined
                              class="q-mt-sm"
                              type="textarea"
                              v-model="lang.description"
                              :label="$t('table_header.content2')"
                            ></q-input>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <div class="col-6 kyc-outline">
                <div class="kyc-container kyc-add" @click="updateKycCard()">+</div>
              </div>
            </div>
          </q-card-section>

          <!-- 贈金錢包 -->
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("website_settings.gift_wallet_settings") }}</div>
            <div class="q-mt-xs row items-center q-gutter-md">
              <div>{{ $t("website_settings.enable_gift_wallet") }}：</div>
              <div class="enable">
                <q-toggle
                  :model-value="rewardWalletEnabled"
                  @update:model-value="toggleRewardWallet"
                  :color="rewardWalletEnabled ? 'positive' : 'negative'"
                  stack-label
                  size="lg"
                  :label="rewardWalletEnabled ? $t('common.enable') : $t('common.disable')"
                />
              </div>
            </div>
          </q-card-section>

          <!-- 贈金錢包轉出條件設定 -->
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("bonus_wallet.transfer_out_condition_settings") }}</div>
            <div class="q-mt-xs bonus-transfer-container">
              <div class="row items-start q-gutter-xl">
                <div class="column">
                  <q-radio
                    v-model="form.bonus_wallet_transfer_rule.eligibility_mode"
                    val="turnover"
                    :label="$t('bonus_wallet.audit_turnover_requirement_met')"
                    size="lg"
                  />
                  <div class="bonus-helper-text">*{{ $t("bonus_wallet.withdrawal_resets_balance") }}</div>
                </div>
                <q-radio
                  v-model="form.bonus_wallet_transfer_rule.eligibility_mode"
                  val="balance"
                  :label="$t('bonus_wallet.bonus_balance_requirement_met')"
                  size="lg"
                />
              </div>

              <div v-if="form.bonus_wallet_transfer_rule.eligibility_mode === 'balance'" class="bonus-transfer-row">
                <!-- <div class="bonus-transfer-label">{{ $t("bonus_wallet.bonus_balance_requirement") }}：</div> -->
                <div class="bonus-currency-inputs">
                  <div v-for="currency in maxBetRows" :key="currency.currency_id" class="bonus-currency-input">
                    <span>{{ currency.label }}</span>
                    <q-input
                      :model-value="getRemainingBalanceAmount(currency.currency_id)"
                      @update:model-value="
                        (val: string | number | null) => setRemainingBalanceAmount(currency.currency_id, val)
                      "
                      dense
                      outlined
                      type="number"
                      min="0"
                      class="bonus-amount-input"
                    />
                  </div>
                </div>
              </div>

              <q-checkbox
                v-model="form.bonus_wallet_transfer_rule.first_deposit_required"
                :label="$t('bonus_wallet.first_deposit_completed')"
                size="lg"
                class="bonus-condition-checkbox"
              />

              <div class="bonus-transfer-row">
                <div class="column">
                  <q-checkbox
                    :model-value="historyDepositEnabled"
                    @update:model-value="toggleHistoryDepositThresholds"
                    :label="$t('bonus_wallet.historical_cash_deposit_reached')"
                    size="lg"
                    class="bonus-condition-checkbox"
                  />
                  <div class="bonus-helper-text">*{{ $t("bonus_wallet.multi_currency_independent_conditions") }}</div>
                </div>
                <div v-if="historyDepositEnabled" class="bonus-currency-inputs">
                  <div v-for="currency in maxBetRows" :key="currency.currency_id" class="bonus-currency-input">
                    <span>{{ currency.label }}</span>
                    <q-input
                      :model-value="getHistoryDepositAmount(currency.currency_id)"
                      @update:model-value="
                        (val: string | number | null) => setHistoryDepositAmount(currency.currency_id, val)
                      "
                      dense
                      outlined
                      type="number"
                      min="0"
                      class="bonus-amount-input"
                    />
                  </div>
                </div>
              </div>

              <div class="bonus-transfer-row">
                <div class="column">
                  <q-checkbox
                    :model-value="singleTransferLimitEnabled"
                    @update:model-value="toggleSingleTransferLimits"
                    :label="$t('bonus_wallet.max_transfer_out_limit')"
                    size="lg"
                    class="bonus-condition-checkbox"
                  />
                  <div class="bonus-helper-text">*{{ $t("bonus_wallet.withdrawal_resets_balance_and_required") }}</div>
                  <div style="margin-top: 0.2rem" class="bonus-helper-text">
                    *{{ $t("bonus_wallet.multi_currency_independent_conditions") }}
                  </div>
                </div>
                <div v-if="singleTransferLimitEnabled" class="bonus-currency-inputs">
                  <div v-for="currency in maxBetRows" :key="currency.currency_id" class="bonus-currency-input">
                    <span>{{ currency.label }}</span>
                    <q-input
                      :model-value="getSingleTransferLimitAmount(currency.currency_id)"
                      @update:model-value="
                        (val: string | number | null) => setSingleTransferLimitAmount(currency.currency_id, val)
                      "
                      dense
                      outlined
                      type="number"
                      min="0"
                      class="bonus-amount-input"
                    />
                  </div>
                </div>
              </div>

              <div class="bonus-transfer-row">
                <q-checkbox
                  :model-value="vipLevelEnabled"
                  @update:model-value="toggleVipLevel"
                  :label="$t('bonus_wallet.vip_level_reached_or_above')"
                  size="lg"
                  class="bonus-condition-checkbox"
                />
                <q-select
                  :model-value="form.bonus_wallet_transfer_rule.min_vip_level"
                  @update:model-value="setVipLevel"
                  :options="memberLevelOptions"
                  :disable="!vipLevelEnabled"
                  dense
                  options-dense
                  outlined
                  emit-value
                  map-options
                  class="bonus-vip-select"
                />
              </div>

              <q-checkbox
                v-model="form.bonus_wallet_transfer_rule.kyc_required"
                :label="$t('bonus_wallet.kyc_passed')"
                size="lg"
                class="bonus-condition-checkbox"
              />

              <div>
                <q-checkbox
                  :model-value="activeDownlineEnabled"
                  @update:model-value="toggleActiveDownline"
                  :label="$t('bonus_wallet.active_downline')"
                  size="lg"
                  class="bonus-condition-checkbox"
                />
                <div v-if="activeDownlineEnabled" class="bonus-active-settings">
                  <!-- <div>{{ $t("bonus_wallet.activity_threshold") }}</div> -->
                  <div class="row items-center q-gutter-md">
                    <span>{{ $t("edit_form.active_member_count") }}</span>
                    <q-input
                      v-model.number="form.bonus_wallet_transfer_rule.active_downline.min_count"
                      dense
                      outlined
                      type="number"
                      min="0"
                      class="bonus-amount-input"
                    />
                  </div>
                  <div>{{ $t("edit_form.active_criteria") }}</div>
                  <q-markup-table class="bonus-active-table" flat bordered dense>
                    <thead>
                      <tr>
                        <th>{{ $t("table_header.currency") }}</th>

                        <th>
                          {{ $t("bonus_wallet.activity_threshold") }}<br />{{ $t("edit_form.accumulated_deposit") }}
                        </th>
                        <th>
                          {{ $t("bonus_wallet.activity_threshold") }}<br />{{ $t("edit_form.accumulated_valid_bet") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="currency in maxBetRows" :key="currency.currency_id">
                        <td class="text-center">{{ currency.label }}</td>
                        <td class="text-center">
                          <q-input
                            :model-value="getActiveDownlineDeposit(currency.currency_id)"
                            @update:model-value="
                              (val: string | number | null) => setActiveDownlineDeposit(currency.currency_id, val)
                            "
                            dense
                            outlined
                            type="number"
                            min="0"
                            class="bonus-table-input"
                          />
                        </td>
                        <td class="text-center">
                          <q-input
                            :model-value="getActiveDownlineValidBet(currency.currency_id)"
                            @update:model-value="
                              (val: string | number | null) => setActiveDownlineValidBet(currency.currency_id, val)
                            "
                            dense
                            outlined
                            type="number"
                            min="0"
                            class="bonus-table-input"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                  <div style="margin-left: 0rem; margin-top: -0.2rem" class="bonus-helper-text">
                    *{{ $t("bonus_wallet.multi_currency_single_currency_qualifies") }}
                  </div>
                </div>
              </div>
              <div>
                <q-checkbox
                  :model-value="blockedLabelsEnabled"
                  @update:model-value="toggleBlockedLabels"
                  :label="$t('bonus_wallet.member_tag_blocks_transfer_out')"
                  size="lg"
                  class="bonus-condition-checkbox"
                />
                <div v-if="blockedLabelsEnabled" class="row q-pl-lg">
                  <q-checkbox
                    v-for="tag in memberTagOptions"
                    :key="tag.value"
                    v-model="form.bonus_wallet_transfer_rule.blocked_label_ids"
                    :val="tag.value"
                    :label="tag.label"
                    class="q-mr-lg"
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 提款驗證KYC-->
          <q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("website_settings.kyc_withdrawal_verification_settings") }}</div>
            <div class="q-mt-xs link-container">
              <div class="row items-center q-gutter-md">
                <div>{{ $t("website_settings.enable_kyc_verification") }}：</div>
                <div class="enable">
                  <q-toggle
                    v-model="form.withdraw_kyc_verify"
                    :color="form.withdraw_kyc_verify ? 'positive' : 'negative'"
                    stack-label
                    size="lg"
                    :false-value="0"
                    :true-value="1"
                    :label="form.withdraw_kyc_verify ? $t('common.enable') : $t('common.disable')"
                  />
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- 存款訂單筆數設定 -->
          <div class="row items-center q-gutter-md q-mt-lg">
            <div>{{ $t("common.deposit_order_count_setting") }}：</div>
            <q-input
              v-model.number="form.max_pending_deposit"
              class="select-open-lobby"
              dense
              outlined
              type="number"
              min="0"
              step="1"
              style="max-width: 120px"
            />
          </div>

          <q-card-section class="q-pa-none q-mt-xl row justify-center">
            <q-btn color="primary" class="submit-btn" type="submit" :loading="isLoading">{{ $t("btn.save") }}</q-btn>
          </q-card-section>
        </q-card>
      </q-form>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watchEffect } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useCommon } from "src/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "src/stores/siteStore"
  import { getSettings, putSettings } from "src/api/common"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { OPEN_LOBBY_MODE, CUSTOMER_SERVICES, KYC_TYPE, BONUS_WALLET_TYPE } from "src/utils/constants"
  import { usePermission } from "@/hook/usePermission"
  import { useQueryStore } from "@/stores/queryStore"
  import SEOConfig from "./components/SEOConfig.vue"
  import EmailConfig from "./components/EmailConfig.vue"

  type SettingsForm = Request.PutSettings & {
    bonus_wallet_transfer_rule: Response.BonusWalletTransferRule
  }

  type FormInputValue = string | number | null
  type RawRemainingBalanceThreshold = Omit<Response.RemainingBalanceThreshold, "currency_id"> & {
    currency_id: number | string
  }

  const $q = useQuasar()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const { langList } = siteStore
  const queryStore = useQueryStore()

  const { stringEnumToArray, numberEnumToArray } = useCommon()

  // 活動類型
  const openLobbyModeDropdownList = computed(() =>
    stringEnumToArray(OPEN_LOBBY_MODE.Enums).map((e) => {
      return {
        label: t(OPEN_LOBBY_MODE.I18nKeys[e as OPEN_LOBBY_MODE.Enums]),
        value: e
      }
    })
  )

  // KYC 類型
  const kycTypeList = computed(() =>
    numberEnumToArray(KYC_TYPE.Enums).map((e) => {
      return {
        label: t(KYC_TYPE.I18nKeys[e as KYC_TYPE.Enums]),
        value: e
      }
    })
  )

  const memberLevelOptions = computed(() =>
    queryStore.memberLevel.map((level) => {
      return {
        label: level.label,
        value: Number(level.value)
      }
    })
  )

  const memberTagOptions = computed(() =>
    queryStore.memberTags.map((tag) => {
      return {
        label: tag.name,
        value: tag.id
      }
    })
  )

  function createDefaultBonusWalletTransferRule(): Response.BonusWalletTransferRule {
    return {
      active_downline: {
        enabled: false,
        min_count: 0,
        conditions: []
      },
      blocked_label_ids: [],
      eligibility_mode: "turnover",
      enabled: true,
      first_deposit_required: false,
      history_deposit_thresholds: [],
      kyc_required: false,
      min_vip_level: 0,
      remaining_balance_thresholds: [],
      single_transfer_limits: []
    }
  }

  function getValueType(value: unknown): string {
    if (value === null) {
      return "null"
    }
    if (Array.isArray(value)) {
      return "array"
    }
    return typeof value
  }

  function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
  }

  function parseBonusWalletTransferRule(
    rule: Response.BonusWalletTransferRuleResponse
  ): Response.BonusWalletTransferRule {
    const parsedRule: unknown = parseRawBonusWalletTransferRule(rule)

    if (!isPlainObject(parsedRule)) {
      throw new TypeError(`bonus_wallet_transfer_rule must be an object, received ${getValueType(parsedRule)}`)
    }

    return parsedRule as Response.BonusWalletTransferRule
  }

  function parseRawBonusWalletTransferRule(rule: Response.BonusWalletTransferRuleResponse): unknown {
    if (typeof rule !== "string") {
      return rule
    }

    try {
      return JSON.parse(rule)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new SyntaxError(`bonus_wallet_transfer_rule contains invalid JSON: ${message}`, { cause: error })
    }
  }

  function normalizeBonusWalletTransferRule(
    rule: Response.BonusWalletTransferRuleResponse
  ): Response.BonusWalletTransferRule {
    const defaultRule = createDefaultBonusWalletTransferRule()
    const parsedRule = parseBonusWalletTransferRule(rule)
    const activeDownline = parsedRule.active_downline ?? defaultRule.active_downline

    return {
      ...defaultRule,
      ...parsedRule,
      active_downline: {
        ...defaultRule.active_downline,
        ...activeDownline,
        enabled: isActiveDownlineEnabled(activeDownline.enabled),
        min_count: toInteger(activeDownline.min_count ?? defaultRule.active_downline.min_count),
        conditions: Array.isArray(activeDownline.conditions) ? activeDownline.conditions : []
      },
      blocked_label_ids: Array.isArray(parsedRule.blocked_label_ids) ? parsedRule.blocked_label_ids : [],
      enabled: true,
      history_deposit_thresholds: Array.isArray(parsedRule.history_deposit_thresholds)
        ? parsedRule.history_deposit_thresholds
        : [],
      remaining_balance_thresholds: Array.isArray(parsedRule.remaining_balance_thresholds)
        ? normalizeRemainingBalanceThresholds(parsedRule.remaining_balance_thresholds)
        : [],
      single_transfer_limits: Array.isArray(parsedRule.single_transfer_limits)
        ? normalizeSingleTransferLimits(parsedRule.single_transfer_limits)
        : []
    }
  }

  function buildBonusWalletTransferRulePayload(
    rule: Response.BonusWalletTransferRuleResponse
  ): Response.BonusWalletTransferRule {
    return normalizeBonusWalletTransferRule(rule)
  }

  function normalizeRemainingBalanceThresholds(
    thresholds: RawRemainingBalanceThreshold[]
  ): Response.RemainingBalanceThreshold[] {
    return thresholds
      .map((threshold) => {
        return {
          currency_id: Number(threshold.currency_id),
          amount: toAmountString(threshold.amount)
        }
      })
      .filter((threshold) => Number.isFinite(threshold.currency_id))
  }

  function normalizeSingleTransferLimits(
    limits: Response.BonusWalletTransferRule["single_transfer_limits"]
  ): Response.SingleTransferLimit[] {
    return limits
      .map((limit) => {
        return {
          currency_id: Number(limit.currency_id),
          amount: toAmountString(limit.amount)
        }
      })
      .filter((limit) => Number.isFinite(limit.currency_id))
  }

  function isActiveDownlineEnabled(value: boolean | string | undefined): boolean {
    return value === true || value === "1" || value === "true"
  }

  const { permission } = usePermission()
  const isLoading = ref(false)
  const splitterModel = ref(100)
  const form = reactive<SettingsForm>({
    // require_withdrawal_password: WITHDRAWAL_PASSWORD.Enums.Require,
    open_lobby_mode: OPEN_LOBBY_MODE.Enums.NEW_TAB,
    customer_services: {
      [CUSTOMER_SERVICES.Enums.Unus]: {
        appID: "",
        compID: "",
        enable: false
      },
      [CUSTOMER_SERVICES.Enums.TextLiveChat]: {
        appID: "",
        enable: false
      },
      [CUSTOMER_SERVICES.Enums.Tawk]: {
        appID: "",
        compID: "",
        enable: false
      }
    },
    kyc_setting: [],
    wallet_type_list: [] as BONUS_WALLET_TYPE.Enums[],
    bonus_wallet_transfer_rule: createDefaultBonusWalletTransferRule(),
    withdraw_kyc_verify: 0,
    max_pending_deposit: 0
  })

  const historyDepositEnabled = computed(() => form.bonus_wallet_transfer_rule.history_deposit_thresholds.length > 0)
  const singleTransferLimitEnabled = computed(() => form.bonus_wallet_transfer_rule.single_transfer_limits.length > 0)
  const vipLevelEnabled = computed(() => form.bonus_wallet_transfer_rule.min_vip_level > 0)
  const activeDownlineEnabled = computed(() =>
    isActiveDownlineEnabled(form.bonus_wallet_transfer_rule.active_downline.enabled)
  )
  const blockedLabelsEnabled = computed(() => form.bonus_wallet_transfer_rule.blocked_label_ids.length > 0)

  const rewardWalletEnabled = computed(() => form.wallet_type_list.includes(BONUS_WALLET_TYPE.Enums.REWARD))

  const maxBetRows = computed(() => {
    return queryStore.currencyList.map((c) => {
      return {
        currency_id: c.value,
        label: t(c.label)
      }
    })
  })

  function toAmountString(value: FormInputValue): string {
    if (value === null) {
      return ""
    }
    return String(value)
  }

  function toAmountNumber(value: FormInputValue): number {
    const amount = Number(value ?? 0)
    if (!Number.isFinite(amount)) {
      return 0
    }
    return amount
  }

  function toInteger(value: FormInputValue | undefined): number {
    return Math.trunc(toAmountNumber(value ?? 0))
  }

  function getRemainingBalanceAmount(currencyId: number): string {
    const item = form.bonus_wallet_transfer_rule.remaining_balance_thresholds.find(
      (threshold) => threshold.currency_id === currencyId
    )
    return item?.amount ?? "0"
  }

  function setRemainingBalanceAmount(currencyId: number, value: FormInputValue): void {
    const item = form.bonus_wallet_transfer_rule.remaining_balance_thresholds.find(
      (threshold) => threshold.currency_id === currencyId
    )
    if (item) {
      item.amount = toAmountString(value)
      return
    }
    form.bonus_wallet_transfer_rule.remaining_balance_thresholds.push({
      currency_id: currencyId,
      amount: toAmountString(value)
    })
  }

  function getHistoryDepositAmount(currencyId: number): number {
    const item = form.bonus_wallet_transfer_rule.history_deposit_thresholds.find(
      (threshold) => threshold.currency_id === currencyId
    )
    return item?.amount ?? 0
  }

  function setHistoryDepositAmount(currencyId: number, value: FormInputValue): void {
    const item = form.bonus_wallet_transfer_rule.history_deposit_thresholds.find(
      (threshold) => threshold.currency_id === currencyId
    )
    if (item) {
      item.amount = toAmountNumber(value)
      return
    }
    form.bonus_wallet_transfer_rule.history_deposit_thresholds.push({
      currency_id: currencyId,
      amount: toAmountNumber(value)
    })
  }

  function getSingleTransferLimitAmount(currencyId: number): string {
    const item = form.bonus_wallet_transfer_rule.single_transfer_limits.find(
      (limit) => limit.currency_id === currencyId
    )
    return item?.amount ?? "0"
  }

  function setSingleTransferLimitAmount(currencyId: number, value: FormInputValue): void {
    const item = form.bonus_wallet_transfer_rule.single_transfer_limits.find(
      (limit) => limit.currency_id === currencyId
    )
    if (item) {
      item.amount = toAmountString(value)
      return
    }
    form.bonus_wallet_transfer_rule.single_transfer_limits.push({
      currency_id: currencyId,
      amount: toAmountString(value)
    })
  }

  function getActiveDownlineDeposit(currencyId: number): number {
    const item = form.bonus_wallet_transfer_rule.active_downline.conditions.find(
      (condition) => condition.currency_id === currencyId
    )
    return item?.min_total_deposit ?? 0
  }

  function setActiveDownlineDeposit(currencyId: number, value: FormInputValue): void {
    const item = getActiveDownlineCondition(currencyId)
    item.min_total_deposit = toAmountNumber(value)
  }

  function getActiveDownlineValidBet(currencyId: number): number {
    const item = form.bonus_wallet_transfer_rule.active_downline.conditions.find(
      (condition) => condition.currency_id === currencyId
    )
    return item?.min_total_valid_bet ?? 0
  }

  function setActiveDownlineValidBet(currencyId: number, value: FormInputValue): void {
    const item = getActiveDownlineCondition(currencyId)
    item.min_total_valid_bet = toAmountNumber(value)
  }

  function getActiveDownlineCondition(currencyId: number): Response.ActiveDownlineCondition {
    const item = form.bonus_wallet_transfer_rule.active_downline.conditions.find(
      (condition) => condition.currency_id === currencyId
    )
    if (item) {
      return item
    }

    const condition = {
      currency_id: currencyId,
      min_total_deposit: 0,
      min_total_valid_bet: 0
    }
    form.bonus_wallet_transfer_rule.active_downline.conditions.push(condition)
    return condition
  }

  function toggleHistoryDepositThresholds(value: boolean): void {
    if (!value) {
      form.bonus_wallet_transfer_rule.history_deposit_thresholds = []
      return
    }
    queryStore.currencyList.forEach((currency) => {
      setHistoryDepositAmount(currency.value, getHistoryDepositAmount(currency.value))
    })
  }

  function toggleSingleTransferLimits(value: boolean): void {
    if (!value) {
      form.bonus_wallet_transfer_rule.single_transfer_limits = []
      return
    }
    queryStore.currencyList.forEach((currency) => {
      setSingleTransferLimitAmount(currency.value, getSingleTransferLimitAmount(currency.value))
    })
  }

  function toggleVipLevel(value: boolean): void {
    if (!value) {
      form.bonus_wallet_transfer_rule.min_vip_level = 0
      return
    }
    if (form.bonus_wallet_transfer_rule.min_vip_level === 0 && memberLevelOptions.value.length > 0) {
      form.bonus_wallet_transfer_rule.min_vip_level = memberLevelOptions.value[0].value
    }
  }

  function setVipLevel(value: number): void {
    form.bonus_wallet_transfer_rule.min_vip_level = Number(value)
  }

  function toggleActiveDownline(value: boolean): void {
    form.bonus_wallet_transfer_rule.active_downline.enabled = value
    if (!value) {
      return
    }
    queryStore.currencyList.forEach((currency) => {
      getActiveDownlineCondition(currency.value)
    })
  }

  function toggleBlockedLabels(value: boolean): void {
    if (!value) {
      form.bonus_wallet_transfer_rule.blocked_label_ids = []
      return
    }
    if (form.bonus_wallet_transfer_rule.blocked_label_ids.length === 0) {
      form.bonus_wallet_transfer_rule.blocked_label_ids = memberTagOptions.value.map((tag) => tag.value)
    }
  }

  function toggleRewardWallet(val: boolean) {
    if (val) {
      if (!form.wallet_type_list.includes(BONUS_WALLET_TYPE.Enums.REWARD)) {
        form.wallet_type_list.push(BONUS_WALLET_TYPE.Enums.REWARD)
      }
    } else {
      const idx = form.wallet_type_list.indexOf(BONUS_WALLET_TYPE.Enums.REWARD)
      if (idx !== -1) {
        form.wallet_type_list.splice(idx, 1)
      }
    }
  }

  function applySettingsToForm(result: Response.GetSettings): void {
    // if ("withdrawal_password" in result) {
    //   form.require_withdrawal_password = result.withdrawal_password
    // }

    if ("open_lobby_mode" in result) {
      form.open_lobby_mode = result.open_lobby_mode
    }

    if ("customer_services" in result) {
      const services = JSON.parse(result.customer_services)
      Object.keys(services).forEach((service) => {
        const serviceKey = service as CUSTOMER_SERVICES.Enums
        form.customer_services[serviceKey] = services[serviceKey]
      })
    }

    if ("kyc_setting" in result) {
      form.kyc_setting = JSON.parse(result.kyc_setting)
    }

    if ("wallet_type_list" in result) {
      form.wallet_type_list = result.wallet_type_list || []
    }

    if ("withdraw_kyc_verify" in result) {
      form.withdraw_kyc_verify = result.withdraw_kyc_verify
    }

    if ("max_pending_deposit" in result) {
      form.max_pending_deposit = result.max_pending_deposit ?? 0
    }

    if ("bonus_wallet_transfer_rule" in result) {
      form.bonus_wallet_transfer_rule = normalizeBonusWalletTransferRule(result.bonus_wallet_transfer_rule)
    }
  }

  async function loadSettings(): Promise<boolean> {
    const { search, tableData, status } = useSearch(getSettings)

    await search()

    if (!status.value) {
      return false
    }

    applySettingsToForm(tableData.value as Response.GetSettings)
    return true
  }

  function syncSiteStoreFromForm(): void {
    for (const key of Object.keys(siteStore.$state)) {
      if (key in form) {
        ;(siteStore as any)[key] = JSON.parse(JSON.stringify((form as any)[key]))
      }
    }
  }

  async function setSettings(): Promise<void> {
    const { search, status } = useSearch(putSettings)
    isLoading.value = true

    const payload: Request.PutSettings = {
      ...form,
      bonus_wallet_transfer_rule: buildBonusWalletTransferRulePayload(form.bonus_wallet_transfer_rule),
      max_pending_deposit: Math.max(0, Math.trunc(Number(form.max_pending_deposit ?? 0) || 0))
    }

    try {
      await search(payload)

      if (status.value) {
        const isSettingsLoaded = await loadSettings()
        if (!isSettingsLoaded) {
          return
        }

        // 同步 form 與 siteStore 共同欄位
        syncSiteStoreFromForm()
        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top",
          timeout: 300
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  function updateKycCard(index?: number) {
    if (index !== undefined) {
      form.kyc_setting.splice(index, 1)
    } else {
      form.kyc_setting.push({
        display: false,
        type: KYC_TYPE.Enums.ID,
        lang: []
      })
    }
  }

  onMounted(async () => {
    isLoading.value = true
    try {
      await Promise.all([queryStore.getCurrencyList(), queryStore.getMemberLevel(), queryStore.getMemberTag()])
      await loadSettings()
    } finally {
      isLoading.value = false
    }
  })

  watchEffect(() => {
    if (form.kyc_setting) {
      form.kyc_setting.forEach((kycSetting) => {
        langList.forEach((lang) => {
          const langExist = kycSetting.lang.find((item) => item.code === lang.label)

          if (!langExist) {
            kycSetting.lang.push({
              code: lang.label,
              title: "",
              description: ""
            })
          }
        })
      })
    }
  })
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  .form-container {
    max-width: 100%;
    .select-open-lobby {
      width: 14.125rem;
      height: 2.25rem;
      :deep(.q-field__control) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
        :deep(.q-field__native) {
          min-height: 2.25rem;
          height: 2.25rem;
        }
      }
      :deep(.q-field__append) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
      }
    }
    .input-url {
      width: 35.625rem;
      height: 2.25rem;
      :deep(.q-field__before) {
        width: 4.5625rem;
      }
      :deep(.q-field__control) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
        :deep(.q-field__native) {
          min-height: 2.25rem;
          height: 2.25rem;
        }
      }
      :deep(.q-field__append) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
      }
      :deep(.q-field__bottom) {
        bottom: -1rem;
      }
    }
    .enable {
      width: fit-content;
      height: fit-content;
      border: 1px solid #c2c2ca;
      border-radius: 6px;
      padding-right: 60px;
      :deep(.q-toggle) {
        width: 100px;
      }
    }
    .link-container {
      width: 43.75rem;
      border: 1px solid #c2c2ca;
      border-radius: 0.5rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      .link-row {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #040207e0;
      }
    }
    .bonus-transfer-container {
      width: 43.75rem;
      border: 1px solid #c2c2ca;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background: #fcf6ff;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      :deep(.q-checkbox__bg.absolute) {
        width: 40%;
        height: 40%;
      }
      :deep(.q-radio__bg) {
        width: 40%;
        height: 40%;
      }
    }
    .bonus-transfer-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .bonus-helper-text {
      color: red;
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1rem;
      margin-left: 3rem;
      margin-top: -1rem;
    }
    .bonus-transfer-label {
      min-width: 9.5rem;
      font-size: 0.875rem;
      color: #040207e0;
    }
    .bonus-condition-checkbox {
      width: fit-content;
    }
    .bonus-currency-inputs {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .bonus-currency-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }
    .bonus-amount-input {
      width: 6.75rem;
    }
    .bonus-vip-select {
      width: 8rem;
    }
    .bonus-active-settings {
      padding-left: 2.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .bonus-active-table {
      //max-width: 24rem;
      thead {
        background: #eaf6ff;
      }
      th,
      td {
        text-align: center;
      }
      :deep(.q-table th),
      :deep(.q-table td) {
        padding: 7px 8px;
      }
    }
    .bonus-table-input {
      max-width: 6.25rem;
      margin: 0 auto;
    }
    .kyc {
      .kyc-outline {
        width: 32.625rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        .kyc-container {
          border: 1px solid #c2c2ca;
          border-radius: 0.5rem;
          padding: 1rem;
          .kyc-select {
            height: 2.25rem;
            :deep(.q-field__control) {
              border-radius: 0.25rem;
              min-height: 2.25rem;
              height: 2.25rem;
              :deep(.q-field__native) {
                min-height: 2.25rem;
                height: 2.25rem;
              }
            }
            :deep(.q-field__append) {
              border-radius: 0.25rem;
              min-height: 2.25rem;
              height: 2.25rem;
            }
          }
          &.kyc-add {
            height: 100%;
            min-height: 20rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6rem;
            line-height: 0;
            cursor: pointer;
            &:hover {
              background-color: #c2c2ca;
            }
          }
        }
      }
    }
    .submit-btn {
      width: 12rem;
      height: 2.875rem;
      font-size: 1rem;
      border-radius: 6px;
    }
  }
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
</style>
