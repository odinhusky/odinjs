<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section>
      <div class="row items-center col-6 p_select">
        <span>{{ $t("edit_form.currency") }}</span>
        <div class="col-6">
          <CurrencySelect
            :hideLabel="true"
            v-model="form.currency"
            label=""
            name="currency"
            class="edit-input no-label q-ml-md"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="rounded-borders">
        <div class="q-pl-sm">
          {{ $t("edit_form.services") }}
        </div>
        <div class="row">
          <q-radio
            v-model="form.support_method_type"
            :val="1"
            :label="$t(SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.DepositFlow])"
            color="primary"
            class="q-mr-xl"
          />
          <q-radio
            v-model="form.support_method_type"
            :val="2"
            :label="$t(SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.WithdrawalFlow])"
            color="primary"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="rounded-borders">
        <div class="q-pl-sm">
          {{ $t("edit_form.fund_method") }}
        </div>
        <div class="row">
          <q-radio
            v-for="fundMethod in fundMethods"
            :key="`fundMethod-${fundMethod}`"
            v-model="form.type"
            :label="$t(FUND_METHOD_TYPE.I18nKeys[fundMethod as FUND_METHOD_TYPE.Enums])"
            :val="fundMethod"
            color="primary"
            class="q-mr-xl"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="form.type === 2 || form.type === 7">
      <div class="rounded-borders">
        <div class="q-pl-sm q-pb-md">
          {{ form.type === 2 ? $t("edit_form.third_party_channel") : $t("edit_form.crypto_channel") }}
        </div>
        <div class="row">
          <q-radio
            v-for="setting in gatewaySettings"
            :key="`gateway-${setting.payment_gateway_name}-${setting.payment_gateway_channel_code}`"
            v-model="selectedGatewayKey"
            :val="`${setting.payment_gateway_name}|${setting.payment_gateway_channel_code}`"
            :label="setting.name"
            color="primary"
            class="q-mr-xl"
            @update:model-value="onGatewaySettingChange"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="(form.support_method_type === 1 && form.type === 3) || form.type === 7">
      <div class="text-h6 text-bold">{{ $t("edit_form.exchange_rate_setting") }}</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="row items-center col-6 p_select" v-if="form.type === 3 || form.type === 7">
          <span>{{ $t("table_header.virtual_currency") }}</span>
          <div class="col-6" v-if="loadings">
            <q-select
              v-model="form.crypto"
              borderless
              dense
              standout="bg-white text-black"
              rounded
              emit-value
              :options="cryptoDropdownList"
              map-options
              class="edit-input no-label q-ml-md"
              :class="inputWidthLimitWithPlaceholder"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="form.type === 3 || form.type === 7">
      <div class="row">
        <div class="row items-center col-6 p_select">
          <span>{{ $t("table_header.exchange_rate") }}</span>
          <q-input
            type="number"
            v-model="form.usdt_rate"
            dense
            square
            borderless
            class="edit-input q-ml-md"
            @update:model-value="limitDecimalPlaces"
          />
        </div>
      </div>
    </q-card-section>
    <!-- <q-card-section v-if="form.type === 3 || form.type === 7">
      <div class="rounded-borders">
        <div class="q-pl-sm q-pb-md">{{ $t("edit_form.crypto_channel") }}</div>
        <div class="row">
          <q-radio
            v-for="setting in cryptoGatewaySettings"
            :key="`crypto-gateway-${setting.payment_gateway_channel_code}`"
            v-model="selectedCryptoGatewayKey"
            :val="setting.payment_gateway_channel_code"
            :label="setting.name"
            color="primary"
            class="q-mr-xl"
            @update:model-value="onCryptoGatewaySettingChange"
          />
        </div>
      </div>
    </q-card-section> -->
    <q-card-section>
      <div class="text-h6 text-bold">{{ $t("common.limit_settings") }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div v-if="form.support_method_type === 1" class="items-center col-5 p_select q-flex">
          <span>{{ $t("edit_form.deposit_limit") }}</span>
          <q-number
            v-model="form.deposit_min"
            :options="generalOptions"
            dense
            square
            borderless
            class="edit-input q-ml-md input-w"
          />
          <span class="q-mx-sm">~</span>
          <q-number
            v-model="form.deposit_max"
            :options="generalOptions"
            dense
            square
            borderless
            class="edit-input input-w"
          />
        </div>
        <div v-if="form.support_method_type === 2" class="items-center col-5 p_select q-flex">
          <span>{{ $t("edit_form.withdrawal_limit") }}</span>
          <q-number
            v-model="form.withdraw_min"
            :options="generalOptions"
            dense
            square
            borderless
            class="edit-input q-ml-md input-w"
          />
          <span class="q-mx-sm">~</span>
          <q-number
            v-model="form.withdraw_max"
            :options="generalOptions"
            dense
            square
            borderless
            class="edit-input q-ml-md input-w"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="row custom">
        <div v-if="form.support_method_type !== 2" class="row items-center col-5 p_select">
          <span>{{ $t("edit_form.audit_ratio") }}</span>
          <q-number
            v-model="form.audit_rate"
            :options="generalOptions"
            dense
            square
            borderless
            class="edit-input q-mx-md"
          />
          <span>{{ $t("edit_form.multiple") }}</span>
        </div>
        <div class="row col-6 item-center">
          <span class="q-pt-md q-ml-sm q-mr-md q-pb-sm">{{ $t("edit_form.management_fees") }}</span>
          <div class="col-10">
            <div class="row item-center">
              <q-radio v-model="form.fee_type" :val="1" :label="$t('edit_form.fixed_amount')" class="col-3" />
              <q-number
                v-model="form.fee_amount"
                :options="generalOptions"
                dense
                square
                borderless
                class="edit-input q-mx-md col-5"
              />
            </div>
            <div class="row item-center q-mt-md">
              <div>
                <q-radio v-model="form.fee_type" :val="2" :label="$t('edit_form.ratio')" class="col-3" />
              </div>

              <q-number
                v-model="form.fee_rate"
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
        <div v-if="form.support_method_type !== 2" class="col-12 row q-col-gutter-md items-center">
          <div>{{ $t("edit_form.minimum_first_deposit") }}</div>
          <div class="row items-center">
            <q-number
              v-model="form.first_deposit_min"
              :disable="!form.enable_first_deposit_check"
              :options="generalOptions"
              dense
              square
              borderless
              class="edit-input"
            >
            </q-number>
            <q-toggle v-model="form.enable_first_deposit_check" color="primary" />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="(form.support_method_type === 1 && form.type === 1) || form.type === 3">
      <div class="text-h6 text-bold">{{ $t("edit_form.deposit_information") }}</div>
    </q-card-section>
    <div v-if="form.type === 1 && form.support_method_type === 1">
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("edit_form.branch_name") }}</span>
            <q-input
              v-model="form.bank_name"
              square
              borderless
              dense
              class="edit-input q-ml-md"
              :class="inputWidthLimitWithPlaceholder"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("edit_form.bank_account") }}</span>
            <q-input
              v-model="form.bank_account"
              square
              borderless
              dense
              class="edit-input q-ml-md"
              :class="inputWidthLimitWithPlaceholder"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div>QR Code</div>
        <div class="row">
          <div class="col-2">
            <PreviewImage
              :parentImage="form.qrcodeImgUrl"
              :defaultImage="addQrcodeDefault()"
              :aspectRatio="'100/100'"
              @update:modelValue="updateImgUrl"
              @update:imgFile="updateImgFile"
            />
          </div>
          <div class="row items-end">
            <q-btn outline color="red" icon-right="delete_outline" class="q-ml-md" @click="deleteImage">{{
              $t("common.delete")
            }}</q-btn>
          </div>
        </div>
      </q-card-section>
    </div>
    <!--虛擬幣-->
    <div v-if="form.type === 3 && form.support_method_type !== 2">
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("edit_form.protocol") }}</span>
            <q-input
              :model-value="form.crypto_info?.chain"
              @update:model-value="
                (val) => {
                  if (!form.crypto_info) form.crypto_info = {}
                  form.crypto_info.chain = val ? String(val) : undefined
                }
              "
              square
              borderless
              dense
              class="edit-input q-ml-md"
              :class="inputWidthLimitWithPlaceholder"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("table_header.wallet_address") }}</span>
            <q-input
              :model-value="form.crypto_info?.wallet_address"
              @update:model-value="
                (val) => {
                  if (!form.crypto_info) form.crypto_info = {}
                  form.crypto_info.wallet_address = val ? String(val) : undefined
                }
              "
              square
              borderless
              dense
              class="edit-input q-ml-md"
              :class="inputWidthLimitWithPlaceholder"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div>{{ $t("table_header.wallet_address") }}</div>
        <div class="row">
          <div class="col-2">
            <PreviewImage
              :parentImage="form.qrcodeImgUrl"
              :defaultImage="addQrcodeDefault()"
              :aspectRatio="'100/100'"
              @update:modelValue="updateImgUrl"
              @update:imgFile="updateImgFile"
            />
          </div>
          <div class="row items-end">
            <q-btn outline color="red" icon-right="delete_outline" class="q-ml-md" @click="deleteImage">{{
              $t("common.delete")
            }}</q-btn>
          </div>
        </div>
      </q-card-section>
    </div>
    <!-- <div v-if="form.type === 2">
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("table_header.third_party_payment") }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="row items-center col-6 p_select">
            <span>{{ $t("table_header.wallet_address") }}</span>
            <q-input
              :model-value="form.crypto_info?.wallet_address"
              @update:model-value="
                (val) => {
                  if (!form.crypto_info) form.crypto_info = {}
                  form.crypto_info.wallet_address = val ? String(val) : undefined
                }
              "
              square
              borderless
              dense
              class="edit-input q-ml-md"
              :placeholder="$t('common.please_enter_content')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div>{{ $t("table_header.wallet_address") }}</div>
        <div class="row">
          <div class="col-2">
            <PreviewImage
              :parentImage="form.qrcodeImgUrl"
              :defaultImage="addQrcodeDefault()"
              :aspectRatio="'100/100'"
              @update:modelValue="updateImgUrl"
              @update:imgFile="updateImgFile"
            />
          </div>
          <div class="row items-end">
            <q-btn outline color="red" icon-right="delete_outline" class="q-ml-md" @click="deleteImage">{{
              $t("common.delete")
            }}</q-btn>
          </div>
        </div>
      </q-card-section>
    </div> -->
    <q-card-section v-if="form.support_method_type !== 2">
      <span>{{ $t("edit_form.remark") }}</span>
      <q-input
        v-model="form.remark"
        autogrow
        square
        borderless
        dense
        class="edit-input"
        :class="inputWidthLimitWithPlaceholder"
        :placeholder="t('common.please_enter_content')"
      />
    </q-card-section>
    <QuickAmountTable v-if="showQuickAmountTable" v-model="form.quick_amounts" :editable="quickAmountPermission.edit" />
    <!--存款備註-->
    <q-card-section v-if="form.support_method_type !== 2">
      <!-- <div class="q-pb-xs">{{ $t("edit_form.deposit_remarks") }}</div> -->
      <!-- Conflict: Husky -->
      <div class="row items-center">
        <div>{{ $t("edit_form.deposit_remarks") }}</div>
        <AiLanguage class="ml-4" @applyLanguage="applyLanguage" />
      </div>
      <div
        class="row q-col-gutter-md extra-remark-row"
        v-for="(extra_remark, extra_remarkIndex) in form.extra_remark || []"
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
            :class="inputWidthLimitWithPlaceholder"
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
        <q-btn outline color="main-color" icon="add" align="center" style="width: 100%" @click="addEntrance"> </q-btn>
      </div>
    </q-card-section>

    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color" class="q-px-xl" outline :disable="isSubmitting" @click="nextPrevStep(false)">{{
        $t("btn.prev_step")
      }}</q-btn>
      <q-btn
        class="q-ml-md q-px-xl"
        color="main-color"
        :loading="isSubmitting"
        :disable="isSubmitting"
        @click="onSubmit"
        >{{ $t("btn.next_step") }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useCashFlowStore } from "@/stores/cashflowStore"
  import { useStepper } from "@/hook/useStepper"
  import { useImage } from "@/hook/useImage"
  import { uploadPaymentImage, addGatewayItem, getCryptoList, getGatewaySetting } from "@/api/paymentGateway"
  import type * as Request from "@/api/request.type"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import CurrencySelect from "@/components/query/selects/currency.vue"
  import { FUND_METHOD_TYPE, SERVICE_TYPE } from "@/utils/constants"
  import { LANGUAGE_TYPE } from "src/utils/constants"
  import { useSiteStore } from "src/stores/siteStore"
  import type * as Response from "@/api/response.type"
  // import { clone } from "ramda"
  import { useSearch } from "@/hook/useSearch"
  import { genEnumToArray } from "@/stores/queryStore"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"
  import QuickAmountTable from "../components/QuickAmountTable.vue"
  import {
    isQuickAmountSupportedService,
    normalizeQuickAmounts,
    validateQuickAmountsWithinLimit
  } from "../components/quickAmount"
  import { useQuickAmountPermission } from "../components/quickAmountPermission"

  const inputWidthLimitWithPlaceholder = "w-[12.5rem]"

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()
  const $q = useQuasar()
  const cashFlowStore = useCashFlowStore()

  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)

  // 防止連續調用
  const isSubmitting = ref(false)

  const titleLangObj = computed(() => {
    const langObj: Response.CmsLangTitle = {}
    langList.value.forEach((e) => {
      langObj[e.label] = ""
    })
    return langObj
  })
  /*
    const bounsDropdownList = computed(() => {
      return numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => {
        const label = t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow"
        return {
          label,
          value: item as number
        }
      })
    })*/

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
  onMounted(async () => {
    await getCrypto()
    loadings.value = true
  })
  const { gatewayItem: form } = storeToRefs(cashFlowStore)
  const quickAmountPermission = useQuickAmountPermission()

  const showQuickAmountTable = computed(
    () => quickAmountPermission.value.view && isQuickAmountSupportedService(form.value.support_method_type)
  )

  const fundMethods = computed(() => {
    const methods = genEnumToArray(FUND_METHOD_TYPE.Enums)
    return methods.filter((method) => {
      if (form.value.support_method_type === 1) {
        return ![
          FUND_METHOD_TYPE.Enums.ApplePay,
          FUND_METHOD_TYPE.Enums.Paypal,
          // FUND_METHOD_TYPE.Enums.CryptoWallet,
          FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
        ].includes(method as FUND_METHOD_TYPE.Enums)
      } else {
        return ![
          FUND_METHOD_TYPE.Enums.MoneyTransfer,
          FUND_METHOD_TYPE.Enums.ApplePay,
          FUND_METHOD_TYPE.Enums.Paypal,
          FUND_METHOD_TYPE.Enums.CryptoWallet,
          FUND_METHOD_TYPE.Enums.ExternalChannelTransfer
        ].includes(method as FUND_METHOD_TYPE.Enums)
      }
    })
  })

  // Gateway Settings
  const gatewaySettings = ref<Response.GatewaySettingItem[]>([])
  const selectedGatewayKey = ref<string | null>(null)

  const loadGatewaySettings = async () => {
    if (!form.value.currency || !form.value.support_method_type || (form.value.type !== 2 && form.value.type !== 7)) {
      gatewaySettings.value = []
      selectedGatewayKey.value = null
      return
    }

    try {
      const params: Request.GetGatewaySetting = {
        currency_id: form.value.type === 7 ? form.value.crypto : form.value.currency,
        method_type: form.value.support_method_type,
        type: form.value.type,
        is_crypto: form.value.type === 7 ? true : false
      }
      const { code, data } = await getGatewaySetting(params)
      if (code === 0) {
        // 过滤掉 payment_gateway_channel_code 为 "default" 的项
        gatewaySettings.value = data
        console.log("gatewaySettings", gatewaySettings.value)
      }
    } catch (error) {
      console.error("Failed to load gateway settings:", error)
    }
  }

  const onGatewaySettingChange = (combinedKey: string) => {
    // 解析组合键: "payment_gateway_name|payment_gateway_channel_code"
    const [gatewayName, channelCode] = combinedKey.split("|")
    const setting = gatewaySettings.value.find(
      (item) => item.payment_gateway_name === gatewayName && item.payment_gateway_channel_code === channelCode
    )
    if (setting) {
      form.value.payment_gateway_name = setting.payment_gateway_name || ""
      form.value.payment_gateway_channel_code = setting.payment_gateway_channel_code || ""
      // if (setting.max_amount) {
      //   form.value.deposit_max = setting.max_amount
      // }
    }
  }

  // Crypto Gateway Settings (for type 7)
  const cryptoGatewaySettings = ref<Response.GatewaySettingItem[]>([])
  const selectedCryptoGatewayKey = ref<string | null>(null)

  const loadCryptoGatewaySettings = async () => {
    if (!form.value.crypto || !form.value.support_method_type || form.value.type !== 7) {
      cryptoGatewaySettings.value = []
      selectedCryptoGatewayKey.value = null
      return
    }

    try {
      const params: Request.GetGatewaySetting = {
        currency_id: form.value.crypto,
        method_type: form.value.support_method_type,
        type: 7,
        is_crypto: true
      }
      const { code, data } = await getGatewaySetting(params)
      if (code === 0) {
        // 过滤掉 payment_gateway_channel_code 为 "default" 的项
        cryptoGatewaySettings.value = data.filter((item) => item.payment_gateway_channel_code !== "default")
      }
    } catch (error) {
      console.error("Failed to load crypto gateway settings:", error)
    }
  }

  const onCryptoGatewaySettingChange = (combinedKey: string) => {
    // 解析组合键: "payment_gateway_name|payment_gateway_channel_code"
    const [gatewayName, channelCode] = combinedKey.split("|")
    const setting = cryptoGatewaySettings.value.find(
      (item) => item.payment_gateway_name === gatewayName && item.payment_gateway_channel_code === channelCode
    )
    if (setting) {
      form.value.payment_gateway_name = setting.payment_gateway_name || ""
      form.value.payment_gateway_channel_code = setting.payment_gateway_channel_code || ""
      // if (setting.max_amount) {
      //   form.value.deposit_max = setting.max_amount
      // }
    }
  }

  // Watch for changes in currency, support_method_type, or type
  watch(
    () => [form.value.currency, form.value.support_method_type, form.value.type],
    () => {
      if (form.value.type === 2 || form.value.type === 7) {
        loadGatewaySettings()
      } else {
        gatewaySettings.value = []
        selectedGatewayKey.value = null
      }
    },
    { immediate: true }
  )

  // Watch for changes in crypto, support_method_type, or type for crypto channels
  watch(
    () => [form.value.crypto, form.value.support_method_type, form.value.type],
    () => {
      if (form.value.type === 7) {
        loadCryptoGatewaySettings()
      } else {
        cryptoGatewaySettings.value = []
        selectedCryptoGatewayKey.value = null
      }
    },
    { immediate: true }
  )

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  // 上傳圖片
  const { addQrcodeDefault } = useImage()
  const updateImgFile = (value: File) => {
    form.value.qrcodeImgFile = value
  }
  const updateImgUrl = (value: string) => {
    form.value.qrcodeImgUrl = value
  }
  const deleteImage = () => {
    form.value.qrcodeImgUrl = ""
    form.value.qrcodeImgFile = undefined
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
      amounts: form.value.quick_amounts || [],
      serviceType: form.value.support_method_type,
      depositRange: {
        min: form.value.deposit_min,
        max: form.value.deposit_max
      },
      withdrawRange: {
        min: form.value.withdraw_min,
        max: form.value.withdraw_max
      }
    })

    if (!validation.isValid) {
      showErrorMsg(t(validation.messageI18nKey))
      return false
    }

    return true
  }

  //新增備註欄位
  const addEntrance = () => {
    const titles = Object.keys(titleLangObj.value).map((lang) => ({
      lang,
      title: ""
    }))
    let dtype = form.value.deposit ? 1 : 2
    const newRemark = {
      type: dtype,
      titles
    }
    if (!form.value.extra_remark) {
      form.value.extra_remark = []
    }
    form.value.extra_remark.push(newRemark)
  }

  const canSendApi = (): boolean => {
    if (!form.value.type) {
      const msg = `${t("table_header.please_select")}${t("edit_form.fund_method")}`
      showErrorMsg(msg)
      return false
    }
    if (!form.value.currency) {
      const msg = `${t("table_header.please_select")}${t("edit_form.currency")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.support_method_type === 1 && (!form.value.deposit_min || !form.value.deposit_max)) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.deposit_limit")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.support_method_type === 2 && (!form.value.withdraw_min || !form.value.withdraw_max)) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.withdrawal_limit")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.support_method_type === 1 && !form.value.fee_amount) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.management_fees")}${t("edit_form.fixed_amount")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.support_method_type === 1 && !form.value.fee_rate) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.management_fees")}${t("edit_form.ratio")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.support_method_type === 1 && !form.value.audit_rate) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.audit_ratio")}`
      showErrorMsg(msg)
      return false
    }
    if (form.value.type === 2 || form.value.type === 7) {
      if (!form.value.payment_gateway_name) {
        const msg = `${t("table_header.please_enter")}${
          form.value.type === 2 ? $t("edit_form.third_party_channel") : $t("edit_form.crypto_channel")
        }`
        showErrorMsg(msg)
        return false
      }
    }
    // usdt_rate 对于虚拟币类型是必填的
    if ((form.value.type === 3 || form.value.type === 7) && !form.value.usdt_rate) {
      const msg = `${t("table_header.please_enter")}${t("table_header.exchange_rate")}`
      showErrorMsg(msg)
      return false
    }
    if (!form.value.bank_name && form.value.type !== 3 && form.value.type !== 7 && form.value.type !== 2) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.branch_name")}`
      showErrorMsg(msg)
      return false
    }
    if (!form.value.bank_account && form.value.type !== 3 && form.value.type !== 7 && form.value.type !== 2) {
      const msg = `${t("table_header.please_enter")}${t("edit_form.bank_account")}`
      showErrorMsg(msg)
      return false
    }

    if (form.value.type === 3) {
      if (!form.value.crypto_info?.chain) {
        const msg = `${t("table_header.please_enter")}${t("edit_form.protocol")}`
        showErrorMsg(msg)
        return false
      }
      if (!form.value.crypto_info?.wallet_address) {
        const msg = `${t("table_header.please_enter")}${t("table_header.wallet_address")}`
        showErrorMsg(msg)
        return false
      }
    }

    /* if (!form.value.qrcode_image_id && !form.value.qrcodeImgFile) {
        const msg = t("error_msg.qrcode_image_is_required")
        showErrorMsg(msg)
        return false
      }*/
    if (showQuickAmountTable.value && !validateQuickAmountRange()) {
      return false
    }

    return true
  }

  const onSubmit = async () => {
    // 防止連續調用
    if (isSubmitting.value) {
      return
    }

    console.log("Step2 onSubmit - form data:", {
      name: form.value.name,
      logo_image_id: form.value.logo_image_id,
      display: form.value.display,
      type: form.value.type,
      currency: form.value.currency
    })
    if (!canSendApi()) {
      return
    }

    isSubmitting.value = true

    try {
      // 上传二维码图片
      if (form.value.qrcodeImgFile) {
        const payload: Request.UploadPaymentImage = {
          image: form.value.qrcodeImgFile
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
        form.value.qrcode_image_id = data.image_id
      }

      const quickAmounts: string[] | undefined = showQuickAmountTable.value
        ? normalizeQuickAmounts(form.value.quick_amounts || [])
        : undefined

      // 构建新的统一请求 payload
      const payload: Request.GatewayItemDetail = {
        name: form.value.name,
        type: form.value.type,
        display: form.value.display,
        currency: form.value.currency,
        remark: form.value.remark || "",
        support_method_type: form.value.support_method_type,
        deposit_min: form.value.deposit_min,
        deposit_max: form.value.deposit_max,
        withdraw_min: form.value.withdraw_min,
        withdraw_max: form.value.withdraw_max,
        audit_rate: form.value.audit_rate,
        fee_type: form.value.fee_type,
        fee_amount: form.value.fee_amount,
        fee_rate: form.value.fee_rate,
        first_deposit_min: form.value.first_deposit_min,
        enable_first_deposit_check: form.value.enable_first_deposit_check,
        extra_remark: form.value.extra_remark || [],
        logo_image_id: form.value.logo_image_id || 0,
        // usdt_rate 是必填的 string 类型，确保转换为字符串
        usdt_rate: form.value.usdt_rate?.toString() || "0"
      }

      if (quickAmounts !== undefined) {
        payload.quick_amounts = quickAmounts
      }

      // 添加支付网关信息（第三方支付）
      if (form.value.type === 2 || form.value.type === 7) {
        payload.payment_gateway_name = form.value.payment_gateway_name
        payload.payment_gateway_channel_code = form.value.payment_gateway_channel_code
      }

      // 添加虚拟币信息
      if (form.value.type === 3 || form.value.type === 7) {
        payload.crypto = form.value.crypto
        // 虚拟币类型使用实际的汇率值
        payload.usdt_rate = form.value.usdt_rate?.toString() || "0"
        payload.crypto_info = {
          chain: form.value.crypto_info?.chain,
          wallet_address: form.value.crypto_info?.wallet_address,
          image_id: form.value.qrcode_image_id
        }
      }

      // 添加银行信息（非虚拟币支付且非第三方支付）
      if (form.value.type !== 3 && form.value.type !== 7 && form.value.type !== 2) {
        payload.bank_info = {
          name: form.value.bank_name,
          account: form.value.bank_account,
          image_id: form.value.qrcode_image_id
        }
      }

      // 添加logo图片ID
      if (form.value.logo_image_id) {
        payload.logo_image_id = form.value.logo_image_id
      }

      // const { search, status } = useSearch(addGatewayItem)
      const response = await addGatewayItem(payload)
      console.log(response)
      if (response.code === 334005) {
        $q.notify({
          type: "negative",
          message: t("error_msg.error_code_334005"),
          position: "top"
        })
      } else if (response.code === 0) {
        $q.notify({
          type: "positive",
          message: t("message.add_success"),
          position: "top",
          timeout: 300
        })
        nextPrevStep(true)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  const limitDecimalPlaces = (value: string | number | null) => {
    if (value === null || value === "") {
      form.value.usdt_rate = "0"
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
      form.value.usdt_rate = num.toString()
    }
  }

  const applyLanguage = async () => {
    try {
      const payload = form.value.extra_remark
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
        form.value.extra_remark.forEach((item, index) => {
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
  @import "@/css/form.scss";
  .add_card {
    width: 1100px;
    margin: 0 auto;
    .custom-span {
      line-height: 1.8rem;
    }
  }
  .input-w {
    width: 100px;
  }
  .extra-remark-row.q-col-gutter-md {
    margin-top: 16px;
  }
</style>
