<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.edit_payment") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pt-xs q-mt-md">
          <div v-if="customizePayment" class="text-subtitle2 text-bold q-pb-md">
            {{ $t("edit_form.front_end_information") }}
          </div>
          <div class="row q-col-gutter-md">
            <!-- 支付商名稱 -->
            <div class="col-4 q-mr-xl">
              <div class="q-pb-xs">{{ $t("table_header.payer_name") }}</div>
              <q-input v-model="form.name" dense square borderless class="edit-input" />
            </div>
            <!-- LOGO -->
            <div v-if="isAgentMode" class="col-4">
              <div class="q-pb-xs">LOGO</div>
              <PreviewImage
                :parentImage="form.logoImgUrl"
                :defaultImage="addPaymentLogoDefault()"
                :aspectRatio="'0/0'"
                :imgWidth="'unset'"
                @update:modelValue="updateLogoImgUrl"
                @update:imgFile="updateLogoImgFile"
                :maxFileSize="10240000"
              />
              <div class="row justify-evenly items-center q-mt-md">
                <div>{{ $t("edit_form.add_payment_logo_tip") }}</div>
                <q-btn outline color="red" icon-right="delete_outline" @click="deleteLogoImage">{{
                  $t("common.delete")
                }}</q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
        <!-- 啟停用 -->
        <q-card-section v-if="isAgentMode" class="row text-black q-pa-sm">
          <div class="col-12 q-ml-md q-mt-md">
            {{ $t("edit_form.front_end_display") }}
          </div>
          <q-card class="col-3 q-ml-md q-mt-md bg-transparent">
            <q-card-actions align="left">
              <q-toggle
                v-model="form.display"
                :color="form.display ? 'positive' : 'negative'"
                :false-value="false"
                :true-value="true"
                keep-color
                stack-label
                :loading="spinShow"
                :label="form.display ? $t('common.enable') : $t('common.disable')"
              />
            </q-card-actions>
          </q-card>
        </q-card-section>
        <q-card-section v-else class="row text-black q-pa-sm">
          <div class="col-12 q-ml-md q-mt-md">
            <span v-if="isGeneralAgentMode">{{ $t("table_header.agent") }}</span>
            {{ $t("table_header.active_disabled") }}
          </div>
          <q-card class="col-3 q-ml-md q-mt-md bg-transparent">
            <q-card-actions align="left">
              <q-toggle
                v-model="form.enable"
                :color="form.enable ? 'positive' : 'negative'"
                :false-value="false"
                :true-value="true"
                keep-color
                stack-label
                :loading="spinShow"
                :label="form.enable ? $t('common.enable') : $t('common.disable')"
              />
            </q-card-actions>
          </q-card>
        </q-card-section>
        <div class="row q-ml-md q-pt-md q-mb-md items-center">
          <div>
            {{ $t("common.supported_currencies") }}
          </div>
          <div class="col-3">
            <CurrencySelect
              v-model="form.currency"
              :readonly="true"
              label=""
              name="currency"
              :hideLabel="true"
              class="edit-input no-label"
            />
          </div>
        </div>
        <!-- 服務 -->
        <q-card-section>
          <div class="q-pb-xs">{{ $t("query_params.services") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-list bordered class="bg-white no-shadow text-black flex no-border">
                <q-item>
                  <q-item-section avatar>
                    <q-radio v-model="form.support_method_type" :val="1" color="primary" disable />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{ $t(SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.DepositFlow]) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-radio v-model="form.support_method_type" :val="2" color="primary" disable />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{ $t(SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.WithdrawalFlow]) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <!-- 出款銀行 -->
        <!-- <q-card-section v-if="!customizePayment">
          <div class="text-subtitle2 text-bold q-pb-md">{{ $t("edit_form.drawing_bank") }}</div>
          <div class="row q-col-gutter-md text-weight-regular">
            <div v-for="bank in tableData.support_bank" class="col-3">{{ bank }}</div>
          </div>
        </q-card-section> -->
        <!-- 金流類型 -->
        <q-card-section>
          <div class="q-pb-xs">{{ $t("query_params.fund_method") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-list bordered class="bg-white no-shadow text-black flex no-border">
                <q-item v-for="fundMethod in fundMethods" :key="fundMethod">
                  <q-item-section avatar>
                    <q-checkbox v-model="form.type" color="primary" :true-value="fundMethod" class="no-indet" disable />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{
                      $t(FUND_METHOD_TYPE.I18nKeys[fundMethod as FUND_METHOD_TYPE.Enums])
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <!-- 第三方渠道 -->
        <q-card-section v-if="form.type === 2">
          <div class="q-pb-xs">{{ $t("edit_form.third_party_channel") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-list bordered class="bg-white no-shadow text-black flex no-border">
                <q-item
                  v-for="setting in gatewaySettings"
                  :key="`${setting.payment_gateway_name}-${setting.payment_gateway_channel_code}`"
                >
                  <q-item-section avatar>
                    <q-radio
                      v-model="selectedGatewayKey"
                      :val="`${setting.payment_gateway_name}|${setting.payment_gateway_channel_code}`"
                      color="primary"
                      disable
                    />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{ setting.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <!-- 虛擬幣渠道 -->
        <q-card-section v-if="form.type === 7">
          <div class="q-pb-xs">{{ $t("edit_form.crypto_channel") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-list bordered class="bg-white no-shadow text-black flex no-border">
                <q-item
                  v-for="setting in cryptoGatewaySettings"
                  :key="`${setting.payment_gateway_name}-${setting.payment_gateway_channel_code}`"
                >
                  <q-item-section avatar>
                    <q-radio
                      v-model="selectedCryptoGatewayKey"
                      :val="`${setting.payment_gateway_name}|${setting.payment_gateway_channel_code}`"
                      color="primary"
                      disable
                    />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{ setting.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="(form.support_method_type === 1 && form.type === 3) || form.type === 7">
          <div class="text-h6 text-bold">{{ $t("edit_form.exchange_rate_setting") }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center" v-if="virtualCurrencyPayment">
            <div>
              {{ $t("table_header.virtual_currency") }}
            </div>
            <div class="col-3">
              <q-select
                v-model="form.crypto"
                borderless
                dense
                standout="bg-white text-black"
                rounded
                emit-value
                :options="cryptoDropdownList"
                :readonly="true"
                map-options
                class="edit-input no-label"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="form.type === 3 || form.type === 7">
          <div class="row">
            <div class="row items-center col-6 p_select">
              <span>{{ $t("table_header.exchange_rate") }}</span>
              <q-input
                type="number"
                v-model="config.usdt_rate"
                dense
                square
                borderless
                class="edit-input q-ml-md"
                @update:model-value="limitDecimalPlaces"
              />
            </div>
          </div>
        </q-card-section>
        <!-- 幣別及限額設定 -->
        <q-card-section class="q-pt-md">
          <div class="text-h6 text-bold">{{ $t("common.limit_settings") }}</div>

          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center" v-if="isAgentMode">
            <div class="row q-col-gutter-md items-center">
              <div
                class="col-6 row q-col-gutter-md items-center"
                v-if="form.support_method_type === 1 || form.support_method_type === 6"
              >
                <div>{{ $t("common.deposit_limit") }}</div>
                <div class="col-4">
                  <q-number
                    v-model="config.deposit_min"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input"
                  />
                </div>
                <div class="row items-center justify-center">~</div>
                <div class="col-4">
                  <q-number
                    v-model="config.deposit_max"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input"
                  />
                </div>
              </div>
              <div
                class="col-12 row q-col-gutter-md items-center"
                v-if="
                  (form.type === FUND_METHOD_TYPE.Enums.ThirdPartyPayment ||
                    form.type === FUND_METHOD_TYPE.Enums.CryptoWalletThird) &&
                  form.support_method_type === 2
                "
              >
                <div>{{ $t("common.withdrawal_limit") }}</div>
                <div class="col-4">
                  <q-number
                    v-model="config.withdraw_min"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input"
                  />
                </div>
                <div class="row items-center justify-center">~</div>
                <div class="col-4">
                  <q-number
                    v-model="config.withdraw_max"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input q-ml-md"
                  />
                </div>
              </div>
              <div class="col-6 row q-col-gutter-md items-center" v-if="form.support_method_type === 1">
                <div>{{ $t("edit_form.audit_ratio") }}</div>
                <div>
                  <q-number
                    v-model="config.audit_rate"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input"
                  />
                </div>
                <div>{{ $t("edit_form.multiple") }}</div>
              </div>
              <div class="col-12 row q-col-gutter-md items-center" v-if="form.support_method_type === 1">
                <div>{{ $t("edit_form.minimum_first_deposit") }}</div>
                <div class="row items-center">
                  <q-number
                    v-model="config.first_deposit_min"
                    :disable="!config.enable_first_deposit_check"
                    :options="generalOptions"
                    dense
                    square
                    borderless
                    class="edit-input"
                  >
                  </q-number>
                  <q-toggle v-model="config.enable_first_deposit_check" color="primary" />
                </div>
              </div>
              <div class="col-12 row q-col-gutter-md q-mt-md">
                <div class="q-pt-lg">{{ $t("edit_form.management_fees") }}</div>
                <div class="col-10">
                  <div class="row item-center">
                    <q-radio v-model="config.fee_type" :val="1" :label="$t('edit_form.fixed_amount')" class="col-3" />
                    <q-number
                      v-model="config.fee_amount"
                      :options="generalOptions"
                      dense
                      square
                      borderless
                      class="edit-input q-mx-md col-5"
                    />
                  </div>
                  <div class="row item-center q-mt-md">
                    <q-radio v-model="config.fee_type" :val="2" :label="$t('edit_form.ratio')" class="col-3" />
                    <q-number
                      v-model="config.fee_rate"
                      :options="generalOptions"
                      dense
                      square
                      borderless
                      class="edit-input q-mx-md col-5"
                    />
                    <span class="custom-font-size q-ml-xs custom-span">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <!-- 存款資訊 -->
        <q-card-section v-if="isAgentMode && customizePayment && !virtualCurrencyPayment" class="q-pt-md">
          <div class="text-subtitle2 text-bold q-pb-xs">{{ $t("edit_form.deposit_information") }}</div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center">
            <div>
              {{ $t("edit_form.branch_name") }}
            </div>
            <div class="col-3">
              <q-input
                v-model="bankInfo.name"
                square
                borderless
                dense
                class="edit-input q-ml-md"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center">
            <div>
              {{ $t("edit_form.bank_account") }}
            </div>
            <div class="col-3">
              <q-input
                v-model="bankInfo.account"
                square
                borderless
                dense
                class="edit-input q-ml-md"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md">
            <div>QR Code</div>
            <div class="col-3">
              <PreviewImage
                :parentImage="bankInfo.qrcodeImgUrl"
                :defaultImage="addQrcodeDefault()"
                :aspectRatio="'100/100'"
                @update:modelValue="updateQrcodeImgUrl"
                @update:imgFile="updateQrcodeImgFile"
              />
            </div>
            <div class="row items-end">
              <q-btn outline color="red" icon-right="delete_outline" class="q-ml-md" @click="deleteQrcodeImage">{{
                $t("common.delete")
              }}</q-btn>
            </div>
          </div>
        </q-card-section>

        <!--虛擬幣-->
        <q-card-section v-if="isAgentMode && customizePayment && virtualCurrencyPayment" class="q-pt-md">
          <div class="text-subtitle2 text-bold q-pb-xs">{{ $t("edit_form.deposit_information") }}</div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center">
            <div>
              {{ $t("edit_form.protocol") }}
            </div>
            <div class="col-3">
              <q-input
                v-model="crypto_info.chain"
                square
                borderless
                dense
                class="edit-input q-ml-md"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md items-center">
            <div>
              {{ $t("table_header.wallet_address") }}
            </div>
            <div class="col-3">
              <q-input
                v-model="crypto_info.wallet_address"
                square
                borderless
                dense
                class="edit-input q-ml-md"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-pt-md q-mb-md">
            <div>{{ $t("table_header.wallet_address") }}</div>
            <div class="col-3">
              <PreviewImage
                :parentImage="crypto_info.qrcodeImgUrl"
                :defaultImage="addQrcodeDefault()"
                :aspectRatio="'100/100'"
                @update:modelValue="updateQrcodeImgUrl"
                @update:imgFile="updateQrcodeImgFile"
              />
            </div>
            <div class="row items-end">
              <q-btn outline color="red" icon-right="delete_outline" class="q-ml-md" @click="deleteQrcodeImage">{{
                $t("common.delete")
              }}</q-btn>
            </div>
          </div>
        </q-card-section>
        <!-- 開放代理 -->
        <q-card-section v-if="isAdminMode || isGeneralAgentMode">
          <div class="text-subtitle2 text-boldq-pb-xs">{{ $t("table_header.activate_master_agent") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-list bordered class="bg-white no-shadow text-black flex no-border row">
                <q-item v-for="agent in agentList" :key="agent.id" class="col-4">
                  <q-item-section avatar>
                    <q-checkbox v-model="form.resultAgentIds" color="primary" :val="agent.id" />
                  </q-item-section>
                  <q-item-section class="text-body1 text-wrap">
                    <q-item-label>{{ agent.display_name }} ({{ agent.id }})</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <!-- 備註 -->
        <q-card-section
          v-if="
            (isAdminMode || customizePayment || virtualCurrencyPayment || form.type === 7 || form.type === 2) &&
            form.support_method_type !== 2
          "
        >
          <div class="q-pb-xs">{{ $t("table_header.remark") }}</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.remark" autogrow square borderless class="edit-input" />
            </div>
          </div>
        </q-card-section>

        <QuickAmountTable
          v-if="showQuickAmountTable"
          v-model="config.quick_amounts"
          :editable="quickAmountPermission.edit"
        />

        <!--存款備註-->
        <!-- <q-card-section
          v-if="(isAdminMode || customizePayment || virtualCurrencyPayment || form.type === 7 || form.type === 2) && form.support_method_type !== 2"
        >
          <div class="q-pb-xs">{{ $t("edit_form.deposit_remarks") }}</div> -->
        <!-- Conflict: Husky -->
        <q-card-section v-if="isAdminMode || customizePayment || virtualCurrencyPayment">
          <div class="row items-center">
            <div>{{ $t("edit_form.deposit_remarks") }}</div>
            <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
          </div>

          <div
            class="row q-col-gutter-md extra-remark-row"
            v-for="(extra_remark, extra_remarkIndex) in form.extra_remark"
            :key="extra_remarkIndex"
          >
            <div class="col-3" v-for="(langItem, langIndex) in extra_remark.titles" :key="langIndex">
              <span>{{ LANGUAGE_TYPE.Abbreviation[langItem.lang as keyof typeof LANGUAGE_TYPE.Abbreviation] }}</span>
              <q-input
                v-model="langItem.title"
                square
                borderless
                dense
                class="edit-input"
                :placeholder="$t('common.please_enter_content')"
              ></q-input>
            </div>
            <div class="col-1">
              <q-btn
                icon="delete"
                round
                flat
                style="margin-top: 20px"
                color="red"
                @click="form.extra_remark?.splice(extra_remarkIndex, 1)"
              />
            </div>
          </div>
          <div class="d-flex q-pt-md q-pb-lg">
            <q-btn outline color="main-color" icon="add" align="center" style="width: 100%" @click="addEntrance">
            </q-btn>
          </div>
        </q-card-section>

        <q-card-actions class="q-py-xl" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="goBack">
            {{ $t("btn.cancel") }}
          </q-btn>
          <q-btn
            v-if="isAgentMode"
            color="main-color"
            class="btnSubmit"
            :loading="isLoading"
            @click="handleAgentSubmitClick"
            >{{ $t("btn.check") }}</q-btn
          >
          <q-btn v-else color="main-color" class="btnSubmit" :loading="isLoading" @click="handleSubmitClick">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { equals, clone } from "ramda"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "@/hook/useEnv"
  import { useImage } from "@/hook/useImage"
  import { storeToRefs } from "pinia"
  import { useSiteStore } from "src/stores/siteStore"
  import CurrencySelect from "@/components/query/selects/currency.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { genEnumToArray } from "@/stores/queryStore"
  import { FUND_METHOD_TYPE, SERVICE_TYPE } from "@/utils/constants"
  import { getAdminAgentList, getGeneralAgentList } from "@/api/common"
  import {
    getGatewayDetail,
    setGatewayInfo,
    setGatewayMasterIds,
    setGatewayAgentIds,
    setAgentGatewayInfo,
    setGatewayConfig,
    setGatewayBank,
    setGatewayCrypto,
    uploadPaymentImage,
    getPaymentImage,
    getCryptoList,
    getGatewaySetting
  } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"
  import type * as Request from "@/api/request.type"
  import { LANGUAGE_TYPE } from "src/utils/constants"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"
  import QuickAmountTable from "./components/QuickAmountTable.vue"
  import {
    isQuickAmountSupportedService,
    normalizeQuickAmounts,
    validateQuickAmountsWithinLimit
  } from "./components/quickAmount"
  import { useQuickAmountPermission } from "./components/quickAmountPermission"

  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()
  const { t } = useI18n()
  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()
  const quickAmountPermission = useQuickAmountPermission()

  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)

  const customizePayment = computed(() => form.type === 1 || form.type === 3)
  const virtualCurrencyPayment = computed(() => form.type === 3 || form.type === 7) //虛擬幣

  const isLoading = ref(false)
  const gatewayId = ref(0)

  const titleLangObj = computed(() => {
    const langObj: Response.CmsLangTitle = {}
    langList.value.forEach((e) => {
      langObj[e.label] = ""
    })
    return langObj
  })

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }

  //取得虛擬幣選項
  type DropdownType = {
    label: string | number
    value: number
  }
  let cryptoDropdownList = ref<DropdownType[]>([])
  const loadings = ref(false)
  const getCrypto = async () => {
    const { data } = await getCryptoList()
    cryptoDropdownList.value = data.map((e: { id: number; code: string | number }) => {
      const label = e.code
      const value = e.id
      return {
        label,
        value
      }
    })
  }

  // Gateway Settings for Type 2 (Third Party)
  const gatewaySettings = ref<Response.GatewaySettingItem[]>([])
  const selectedGatewayKey = ref<string>("")

  const loadGatewaySettings = async () => {
    if (!form.currency || !form.support_method_type || form.type !== 2) {
      gatewaySettings.value = []
      return
    }

    try {
      const params: Request.GetGatewaySetting = {
        currency_id: form.currency,
        method_type: form.support_method_type,
        type: 2,
        is_crypto: false
      }
      const { code, data } = await getGatewaySetting(params)
      if (code === 0) {
        // 过滤掉 payment_gateway_channel_code 为 "default" 的项
        gatewaySettings.value = data
      }
    } catch (error) {
      console.error("Failed to load gateway settings:", error)
    }
  }

  // Crypto Gateway Settings for Type 7 (Crypto Third Party)
  const cryptoGatewaySettings = ref<Response.GatewaySettingItem[]>([])
  const selectedCryptoGatewayKey = ref<string>("")

  const loadCryptoGatewaySettings = async () => {
    if (!form.crypto || !form.support_method_type || form.type !== 7) {
      cryptoGatewaySettings.value = []
      return
    }

    try {
      const params: Request.GetGatewaySetting = {
        currency_id: form.crypto,
        method_type: form.support_method_type,
        type: 7,
        is_crypto: true
      }
      const { code, data } = await getGatewaySetting(params)
      if (code === 0) {
        // 过滤掉 payment_gateway_channel_code 为 "default" 的项
        cryptoGatewaySettings.value = data
      }
    } catch (error) {
      console.error("Failed to load crypto gateway settings:", error)
    }
  }

  type agentGatewayInfoKeys =
    | "name"
    | "currency"
    | "display"
    | "remark"
    | "logo_image_id"
    | "crypto"
    | "crypto_info"
    | "extra_remark"
  const form = reactive<
    Response.GatewatItemDetail & {
      support_bank: string[]
      originAgentIds: number[]
      resultAgentIds: number[]
      disable_agent_ids: number[]
      enable_agent_ids: number[]
      logoImgUrl: string
      logoImgFile?: File
      wallet_address: string
      chain: string
      image_id: number
      crypto: number
      extra_remark: Request.GatewayExtraItem[]
      support_method_type: number
      payment_gateway_name?: string
      payment_gateway_channel_code?: string
      crypto_info: { wallet_address: string; chain: string; image_id: number; id?: number | string }
      bank_info: { name: string; account: string; image_id: number }
      master_count: number
      agent_count: number
    }
  >({
    id: 1,
    name: "",
    type: 0,
    enable: false,
    deposit: false,
    display: false,
    withdraw: false,
    currency: 0,
    remark: "",
    payment_method: 0,
    master_count: 0,
    agent_count: 0,
    master_ids: [],
    agent_ids: [],
    support_bank: [],
    originAgentIds: [],
    resultAgentIds: [],
    disable_agent_ids: [],
    enable_agent_ids: [],
    operational_status: false,
    logo_image_id: 0,
    logoImgUrl: "",
    logoImgFile: undefined,
    wallet_address: "",
    chain: "",
    image_id: 0,
    crypto: 1,
    extra_remark: [],
    support_method_type: 1,
    payment_gateway_name: "",
    payment_gateway_channel_code: "",
    crypto_info: { wallet_address: "", chain: "", image_id: 0 },
    bank_info: { name: "", account: "", image_id: 0 },
    config: {
      deposit_min: "0.00",
      deposit_max: "0.00",
      withdraw_min: "0.00",
      withdraw_max: "0.00",
      audit_rate: "0.00",
      fee_type: 1,
      fee_amount: "0.00",
      fee_rate: "0.00",
      usdt_rate: "0.00",
      quick_amounts: [],
      first_deposit_min: "0.00",
      enable_first_deposit_check: false
    }
  })

  type configKeys = keyof Request.GatewayConfig
  const config = reactive<Request.GatewayConfig>({
    deposit_min: "0.00",
    deposit_max: "0.00",
    withdraw_min: "0.00",
    withdraw_max: "0.00",
    audit_rate: 0,
    fee_type: 1,
    fee_amount: 0,
    fee_rate: 0,
    usdt_rate: 0,
    first_deposit_min: "0.00",
    enable_first_deposit_check: false,
    quick_amounts: []
  })

  const showQuickAmountTable = computed(
    () => isAgentMode && quickAmountPermission.value.view && isQuickAmountSupportedService(form.support_method_type)
  )

  const { addQrcodeDefault, addPaymentLogoDefault } = useImage()
  type bankInfoKeys = keyof Request.GatewayBankInfo
  const bankInfo = reactive<
    Request.GatewayBankInfo & {
      qrcodeImgUrl: string
      qrcodeImgFile?: File
    }
  >({
    name: "",
    account: "",
    image_id: 0,
    qrcodeImgUrl: "",
    qrcodeImgFile: undefined
  })

  const crypto_info = reactive<
    Request.GatewayCryptoInfo & {
      qrcodeImgUrl: string
      qrcodeImgFile?: File
    }
  >({
    wallet_address: "",
    chain: "",
    image_id: 0,
    qrcodeImgUrl: "",
    qrcodeImgFile: undefined
  })

  //新增備註欄位
  const addEntrance = () => {
    const titles = Object.keys(titleLangObj.value).map((lang) => ({
      lang,
      title: ""
    }))
    let dtype = form.support_method_type
    const newRemark = {
      type: dtype,
      titles
    }
    form.extra_remark.push(newRemark)
  }

  const updateLogoImgFile = (value: File) => {
    form.logoImgFile = value
  }
  const updateLogoImgUrl = (value: string) => {
    form.logoImgUrl = value
  }
  const deleteLogoImage = () => {
    form.logoImgUrl = ""
    form.logoImgFile = undefined
    form.logo_image_id = 0
  }
  const updateQrcodeImgFile = (value: File) => {
    if (customizePayment.value && !virtualCurrencyPayment.value) {
      bankInfo.qrcodeImgFile = value
    } else {
      crypto_info.qrcodeImgFile = value
    }
  }
  const updateQrcodeImgUrl = (value: string) => {
    if (customizePayment.value && !virtualCurrencyPayment.value) {
      bankInfo.qrcodeImgUrl = value
    } else {
      crypto_info.qrcodeImgUrl = value
    }
  }
  const deleteQrcodeImage = () => {
    if (customizePayment.value && !virtualCurrencyPayment.value) {
      bankInfo.qrcodeImgUrl = ""
      bankInfo.qrcodeImgFile = undefined
      bankInfo.image_id = 0
    } else {
      crypto_info.qrcodeImgUrl = ""
      crypto_info.qrcodeImgFile = undefined
      crypto_info.image_id = 0
    }
  }

  const fundMethods = computed(() => {
    const methods = genEnumToArray(FUND_METHOD_TYPE.Enums)
    return methods.filter((method) => {
      if (form.support_method_type === 1) {
        return ![
          FUND_METHOD_TYPE.Enums.ApplePay,
          FUND_METHOD_TYPE.Enums.Paypal
          // FUND_METHOD_TYPE.Enums.CryptoWallet,
          // FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
        ].includes(method as FUND_METHOD_TYPE.Enums)
      } else {
        return ![
          FUND_METHOD_TYPE.Enums.MoneyTransfer,
          FUND_METHOD_TYPE.Enums.ApplePay,
          FUND_METHOD_TYPE.Enums.Paypal,
          FUND_METHOD_TYPE.Enums.CryptoWallet
          // FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
        ].includes(method as FUND_METHOD_TYPE.Enums)
      }
    })
  })
  const agentList = ref<Response.GetAdminAgentList>([])

  const { search, spinShow, isSuccess, tableData } = useSearch(getGatewayDetail)

  const handleAgentId = (originAgentIds: number[], resultAgentIds: number[]) => {
    const resultSet = new Set(resultAgentIds)
    form.enable_agent_ids = [...resultAgentIds]
    form.disable_agent_ids = originAgentIds.filter((item) => !resultSet.has(item))
  }

  const goBack = () => {
    router.push({ name: "CashFlowList" })
  }

  const showErrorMsg = (msg: string) => {
    $q.notify({
      type: "negative",
      message: msg,
      position: "top",
      timeout: 1000
    })
  }

  const validateQuickAmountRange = (): boolean => {
    const validation = validateQuickAmountsWithinLimit({
      amounts: config.quick_amounts || [],
      serviceType: form.support_method_type,
      depositRange: {
        min: config.deposit_min,
        max: config.deposit_max
      },
      withdrawRange: {
        min: config.withdraw_min,
        max: config.withdraw_max
      }
    })

    if (!validation.isValid) {
      showErrorMsg(t(validation.messageI18nKey))
      return false
    }

    return true
  }

  const canSendApi = (): boolean => {
    if (!form.currency) {
      $q.notify({
        type: "negative",
        message: `${t("table_header.please_select")}${t("edit_form.currency")}`,
        position: "top",
        timeout: 1000
      })
      return false
    }
    if (customizePayment.value || virtualCurrencyPayment.value) {
      if (!form.logo_image_id && !form.logoImgFile) {
        $q.notify({
          type: "negative",
          message: t("error_msg.logo_image_is_required"),
          position: "top",
          timeout: 1000
        })
        return false
      }
      /*if (!bankInfo.image_id && !bankInfo.qrcodeImgFile) {
        $q.notify({
          type: "negative",
          message: t("error_msg.qrcode_image_is_required"),
          position: "top",
          timeout: 1000
        })
        return false
      }*/
    }

    if (showQuickAmountTable.value && !validateQuickAmountRange()) {
      return false
    }

    return true
  }

  const handleAgentSubmitClick = async () => {
    if (!canSendApi()) {
      return
    }

    if (bankInfo.qrcodeImgFile) {
      const payload: Request.UploadPaymentImage = {
        image: bankInfo.qrcodeImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(payload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      bankInfo.image_id = data.image_id
    }
    //虛擬幣
    if (crypto_info.qrcodeImgFile) {
      const payload: Request.UploadPaymentImage = {
        image: crypto_info.qrcodeImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(payload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      crypto_info.image_id = data.image_id
    }

    if (form.logoImgFile) {
      const payload: Request.UploadPaymentImage = {
        image: form.logoImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(payload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      form.logo_image_id = data.image_id
    }
    const quickAmounts = normalizeQuickAmounts(config.quick_amounts || [])

    // 构建新的统一请求 payload - 按照新格式
    const payload: Request.SetAgentGatewayInfo = {
      id: gatewayId.value,
      display: form.display,
      name: form.name || "",
      remark: form.remark || "",
      logo_image_id: form.logo_image_id || 0,
      config: {
        deposit_min: config.deposit_min || "0.00",
        deposit_max: config.deposit_max || "0.00",
        withdraw_min: config.withdraw_min || "0.00",
        withdraw_max: config.withdraw_max || "0.00",
        audit_rate: Number(config.audit_rate) || 0,
        fee_type: Number(config.fee_type) || 1,
        fee_amount: Number(config.fee_amount) || 0,
        fee_rate: Number(config.fee_rate) || 0,
        first_deposit_min: config.first_deposit_min || "0.00",
        enable_first_deposit_check: config.enable_first_deposit_check || false,
        quick_amounts: quickAmounts,
        usdt_rate: Number(config.usdt_rate) || 0
      },
      extra_remark: form.extra_remark || []
    }

    // 添加虚拟币信息（虚拟币类型）
    if (virtualCurrencyPayment.value) {
      payload.crypto_info = {
        wallet_address: crypto_info.wallet_address || "",
        chain: crypto_info.chain || "",
        image_id: crypto_info.image_id || 0
      }
    }

    // 添加银行信息（非虚拟币支付）
    if (!virtualCurrencyPayment.value) {
      payload.bank_info = {
        name: bankInfo.name || "",
        account: bankInfo.account || "",
        image_id: bankInfo.image_id || 0
      }
    }

    // 发送统一请求
    const tasks: Promise<any>[] = [setAgentGatewayInfo(payload)]
    onSubmit(tasks)
  }

  const handleSubmitClick = async () => {
    const tasks: Promise<any>[] = []

    if (!equals(form.originAgentIds, form.resultAgentIds)) {
      handleAgentId(form.originAgentIds, form.resultAgentIds)
      const payload: Request.SetGatewayMasterIds = {
        id: gatewayId.value
      }
      if (isAdminMode) {
        payload.disable_master_ids = form.disable_agent_ids
        payload.enable_master_ids = form.enable_agent_ids
        tasks.push(setGatewayMasterIds(payload))
      }
      if (isGeneralAgentMode) {
        payload.disable_agent_ids = form.disable_agent_ids
        payload.enable_agent_ids = form.enable_agent_ids
        tasks.push(setGatewayAgentIds(payload))
      }
    }

    // 上传图片
    if (bankInfo.qrcodeImgFile) {
      const imgPayload: Request.UploadPaymentImage = {
        image: bankInfo.qrcodeImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(imgPayload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      bankInfo.image_id = data.image_id
    }

    // 上传虚拟币图片
    if (crypto_info.qrcodeImgFile) {
      const imgPayload: Request.UploadPaymentImage = {
        image: crypto_info.qrcodeImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(imgPayload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      crypto_info.image_id = data.image_id
    }

    // 上传logo图片
    if (form.logoImgFile) {
      const imgPayload: Request.UploadPaymentImage = {
        image: form.logoImgFile
      }
      const { code, data, msg } = await uploadPaymentImage(imgPayload)
      if (code !== 0) {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        return
      }
      form.logo_image_id = data.image_id
    }

    const quickAmounts = normalizeQuickAmounts(config.quick_amounts || [])

    // 构建新的统一请求 payload - 严格按照接口格式
    const payload: Request.SetGatewayInfo = {
      id: gatewayId.value,
      name: form.name || "",
      remark: form.remark || "",
      display: form.display,
      logo_image_id: form.logo_image_id || 0,
      extra_remark: form.extra_remark || [],
      enable: form.enable,
      config: {
        deposit_min: config.deposit_min || "0.00",
        deposit_max: config.deposit_max || "0.00",
        withdraw_min: config.withdraw_min || "0.00",
        withdraw_max: config.withdraw_max || "0.00",
        audit_rate: Number(config.audit_rate) || 0,
        fee_type: Number(config.fee_type) || 1,
        fee_amount: Number(config.fee_amount) || 0,
        fee_rate: Number(config.fee_rate) || 0,
        first_deposit_min: config.first_deposit_min || "0.00",
        enable_first_deposit_check: config.enable_first_deposit_check || false,
        quick_amounts: quickAmounts,
        usdt_rate: Number(config.usdt_rate) || 0
      },
      bank_info: {
        name: bankInfo.name || "",
        account: bankInfo.account || "",
        image_id: String(bankInfo.image_id || 0)
      },
      crypto_info: {
        wallet_address: crypto_info.wallet_address || "",
        chain: crypto_info.chain || "",
        image_id: crypto_info.image_id || 0
      }
    }

    tasks.push(setGatewayInfo(payload))
    onSubmit(tasks)
  }

  const onSubmit = async (tasks: Promise<any>[]) => {
    if (tasks.length > 0) {
      isLoading.value = true
      Promise.all(tasks)
        .then((results) => {
          const allApiCodeZero = results.every((e) => e.code === 0)
          if (allApiCodeZero) {
            $q.notify({
              color: "green",
              message: t("message.edit_success"),
              position: "top",
              timeout: 1000
            })
            goBack()
          } else {
            results.forEach((e) => {
              if (e.code !== 0) {
                $q.notify({
                  type: "negative",
                  message: e.msg,
                  position: "top",
                  timeout: 1000
                })
              }
            })
          }
          isLoading.value = false
        })
        .catch((e: any) => {
          // 取得資料失敗則踢回上一頁
          isLoading.value = false
        })
    } else {
      goBack()
    }
  }

  onMounted(() => {
    gatewayId.value = parseInt(route.params.id as string)

    const tasks: Promise<any>[] = [search({ id: gatewayId.value })]

    if (isAdminMode) {
      tasks.push(getAdminAgentList())
    }
    if (isGeneralAgentMode) {
      tasks.push(getGeneralAgentList())
    }

    tasks.push(getCrypto())

    Promise.all(tasks)
      .then(async (results) => {
        form.id = tableData.value.id
        form.name = tableData.value.name
        form.type = tableData.value.type
        form.enable = tableData.value.enable
        form.deposit = tableData.value.deposit
        form.withdraw = tableData.value.withdraw
        form.currency = tableData.value.currency
        form.remark = tableData.value.remark
        form.crypto = tableData.value.crypto
        form.support_method_type = tableData.value.support_method_type
        form.payment_gateway_name = tableData.value.payment_gateway_name
        form.payment_gateway_channel_code = tableData.value.payment_gateway_channel_code
        if (Array.isArray(tableData.value.config.quick_amounts)) {
          config.quick_amounts = tableData.value.config.quick_amounts
        }

        // Load gateway settings for type 2 (third party)
        if (form.type === 2 && form.currency && form.support_method_type) {
          await loadGatewaySettings()
          if (form.payment_gateway_name && form.payment_gateway_channel_code) {
            selectedGatewayKey.value = `${form.payment_gateway_name}|${form.payment_gateway_channel_code}`
          }
        }

        // Load crypto gateway settings for type 7 (crypto third party)
        if (form.type === 7 && form.crypto && form.support_method_type) {
          await loadCryptoGatewaySettings()
          if (form.payment_gateway_name && form.payment_gateway_channel_code) {
            selectedCryptoGatewayKey.value = `${form.payment_gateway_name}|${form.payment_gateway_channel_code}`
          }
        }
        if (isAdminMode) {
          form.originAgentIds = tableData.value.master_ids
          form.resultAgentIds = [...tableData.value.master_ids]
        }
        if (isGeneralAgentMode) {
          form.originAgentIds = tableData.value.agent_ids
          form.resultAgentIds = [...tableData.value.agent_ids]
        }
        if (isAgentMode) {
          form.display = tableData.value.display
          form.logo_image_id = tableData.value.logo_image_id
          // 从响应（字符串）转换到 config（数字）
          config.deposit_min = tableData.value.config.deposit_min
          config.deposit_max = tableData.value.config.deposit_max
          config.withdraw_min = tableData.value.config.withdraw_min
          config.withdraw_max = tableData.value.config.withdraw_max
          config.audit_rate = parseFloat(tableData.value.config.audit_rate)
          config.fee_type = tableData.value.config.fee_type
          config.fee_amount = parseFloat(tableData.value.config.fee_amount)
          config.fee_rate = parseFloat(tableData.value.config.fee_rate)
          config.usdt_rate = parseFloat(tableData.value.config.usdt_rate)
          config.first_deposit_min = tableData.value.config.first_deposit_min || "0.00"
          config.enable_first_deposit_check = tableData.value.config.enable_first_deposit_check || false
          bankInfo.name = tableData.value.bank_info.name
          bankInfo.account = tableData.value.bank_info.account
          bankInfo.image_id = tableData.value.bank_info.image_id

          form.crypto = tableData.value.crypto
          crypto_info.wallet_address = tableData.value.crypto_info.wallet_address
          crypto_info.chain = tableData.value.crypto_info.chain
          crypto_info.image_id = tableData.value.crypto_info.image_id
          form.extra_remark = tableData.value.extra_remark

          if (tableData.value.logo_image_id) {
            const { code, data } = await getPaymentImage(tableData.value.logo_image_id)
            if (code === 0) {
              form.logoImgUrl = data
            }
          }

          if (tableData.value.bank_info.image_id) {
            const { code, data } = await getPaymentImage(tableData.value.bank_info.image_id)
            if (code === 0) {
              bankInfo.qrcodeImgUrl = data
            }
          }
          if (tableData.value.crypto_info.image_id) {
            const { code, data } = await getPaymentImage(tableData.value.crypto_info.image_id)
            if (code === 0) {
              crypto_info.qrcodeImgUrl = data
            }
          }
        }

        if (results[1]) {
          const { code, data } = results[1]
          if (code !== 0) {
            goBack()
          }
          agentList.value = data.list
        }

        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        console.log("err", e)
        // goBack()
      })
  })

  const limitDecimalPlaces = (value: string | number | null) => {
    if (value === null || value === "") {
      config.usdt_rate = 0
      return
    }

    // 確保 value 是數字
    let num: number
    if (typeof value === "string") {
      num = parseFloat(value)
    } else {
      num = value
    }

    if (!isNaN(num)) {
      // 截斷小數點 6 位，不進位
      num = Math.floor(num * 1e6) / 1e6
      config.usdt_rate = num
    }
  }

  const applyLanguage = async () => {
    try {
      const payload = form.extra_remark
        .map((item) => {
          const title = item.titles.find((item) => !!item.title)?.title
          if (!title) return null
          return {
            input_text: title
          }
        })
        .filter((item) => !!item) as Array<{ input_text: string }>

      if (!payload.length) {
        $q.notify({
          type: "negative",
          message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
          position: "top",
          timeout: 300
        })
        return
      }

      $q.loading.show()
      const languages = langList.value.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        form.extra_remark.forEach((item, index) => {
          item.titles.forEach((title) => {
            title.title = data?.[index]?.translations?.[title.lang]
          })
        })

        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("applyLanguage error", error)
    } finally {
      $q.loading.hide()
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/form.scss";
  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  .extra-remark-row.q-col-gutter-md {
    margin-top: 16px;
  }
</style>
