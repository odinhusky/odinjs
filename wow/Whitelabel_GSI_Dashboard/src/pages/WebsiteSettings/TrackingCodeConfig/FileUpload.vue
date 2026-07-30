<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <div class="msk" v-if="!permission.edit"></div>
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
              <template v-for="(kycSetting, i) in form.kyc_setting" :key="kycSetting">
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

          <!-- 贈金錢包  暫時隱藏-->
          <!--<q-card-section class="q-pa-none q-mt-lg">
            <div>{{ $t("website_settings.gift_wallet_settings") }}</div>
            <div class="q-mt-xs link-container">
              <div class="row items-center q-gutter-md">
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
            </div>
          </q-card-section>-->

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

          <q-card-section class="q-pa-none q-mt-xl row justify-end">
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
  import { useLanguage } from "@/composables/useLanguage"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import {
    WITHDRAWAL_PASSWORD,
    OPEN_LOBBY_MODE,
    CUSTOMER_SERVICES,
    KYC_TYPE,
    BONUS_WALLET_TYPE
  } from "src/utils/constants"
  import { usePermission } from "@/hook/usePermission"

  const $q = useQuasar()
  const { t } = useI18n()
  const { langList } = useSiteStore()

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

  const { permission } = usePermission()
  const isLoading = ref(false)
  const splitterModel = ref(100)
  const form = reactive<Request.PutSettings>({
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
      }
    },
    kyc_setting: [],
    wallet_type_list: [] as BONUS_WALLET_TYPE.Enums[],
    withdraw_kyc_verify: 0
  })

  const rewardWalletEnabled = computed(() => form.wallet_type_list.includes(BONUS_WALLET_TYPE.Enums.REWARD))

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

  async function setSettings() {
    const { search, status } = useSearch(putSettings)
    isLoading.value = true

    await search(form)
    isLoading.value = false

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
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
    const { search, tableData, status } = useSearch(getSettings)
    isLoading.value = true
    await search()
    isLoading.value = false

    if (status) {
      const result = tableData.value as Response.GetSettings

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
      padding-right: 45px;
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
