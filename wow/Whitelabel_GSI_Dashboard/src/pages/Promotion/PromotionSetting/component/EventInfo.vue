<template>
  <div>
    <!-- 沿用設定 - 只在新增模式下顯示 -->
    <q-card-section v-if="form.mode !== 'edit'">
      <div class="row items-center q-col-gutter-md">
        <div>{{ $t("edit_form.inherit_settings") }}</div>
        <div class="col-3">
          <q-select
            v-model="inheritEventId"
            :options="promotionDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            rounded
          />
        </div>
        <div>
          <!-- 複製內容到當前form -->
          <q-btn color="primary" size="16px" @click="copyPromotion">{{ $t("btn.copy") }}</q-btn>
        </div>
      </div>
    </q-card-section>

    <!-- 編輯模式提示 -->
    <!-- <q-card-section v-if="form.mode === 'edit'" class="bg-blue-1 q-pa-md">
      <div class="row items-center q-col-gutter-md">
        <q-icon name="info" color="blue" size="sm" />
        <div class="text-blue-8 text-body2">
          <strong>編輯模式提示：</strong
          >沿用設定功能已停用，避免重複獲取數據。如需複製其他優惠活動設定，請先保存當前編輯內容。
        </div>
      </div>
    </q-card-section> -->
    <!-- 標頭 -->
    <q-card-section v-if="!!slots['title']">
      <slot name="title"></slot>
    </q-card-section>

    <!-- 前端資訊tabs -->
    <q-card-section class="q-pb-xs">
      <div class="row tab-container">
        <div class="col-6">
          <q-tabs
            v-model="language.current"
            class="justify-start lang-tabs q-ml-md text-grey bg-transparent"
            indicator-color="light-blue-1"
            active-color="black"
            dense
          >
            <q-tab v-for="(lang, key) in language.list" :key="key" :name="lang.label" :label="lang.label" />
          </q-tabs>
        </div>

        <div class="q-pl-lg col-6 row items-center q-col-gutter-md justify-end">
          <AiLanguage class="mb-2" @applyLanguage="applyLanguage" />
        </div>
      </div>
      <q-tab-panels v-model="language.current" animated class="bg-edit-color q-pa-sm rounded-borders">
        <q-tab-panel v-for="item in form.info" :name="item.lang" class="q-px-none">
          <div class="row q-col-gutter-xl">
            <div class="col-6">
              <div>{{ $t("query_params.event_name") }}</div>
              <q-input v-model="item.title" square borderless dense class="edit-input" />
              <div class="q-mt-lg q-mb-xs">{{ $t("edit_form.promotion_event_banner") }}</div>
              <div class="row no-wrap">
                <div class="col-9 q-pt-xs">
                  <PreviewImage
                    :parentImage="item.image"
                    :defaultImage="promotionEventBanner()"
                    :aspectRatio="'236/132'"
                    @update:modelValue="updateImgUrl($event, item)"
                    imageToBase64
                    :maxFileSize="204800"
                  />
                </div>
                <div class="col-3">
                  <div class="column justify-end q-pl-md fit">
                    <q-btn class="q-mt-xs" color="red-5" @click="deleteImage(item)">{{ $t("common.delete") }}</q-btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div>{{ $t("edit_form.detailed_description_page") }}</div>
              <div>
                <Editor :model-value="item.content" @update:model-value="handelEditor($event, item)" />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <!-- 活動資訊 -->
    <q-card-section class="q-pa-md q-ma-md rounded-borders activity-info" style="background-color: #fcf8ff">
      <div class="row q-col-gutter-md">
        <!-- 活動類型 -->
        <div class="col-3">
          <div class="q-pb-xs">{{ $t("query_params.event_type") }}</div>
          <q-select
            v-model="form.type"
            :options="eventTypeDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            square
            :disable="form.mode === 'edit'"
          />
        </div>
        <!-- 會員端分類 -->
        <div class="col-3">
          <div class="q-pb-xs">{{ $t("edit_form.front_end_type") }}</div>
          <q-select
            v-model="form.category"
            :options="categoryDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            rounded
          />
        </div>
        <!-- 前端顯示 - 存款優惠 -->
        <div v-if="form.type !== EVENT_TYPE.Enums.CustomizeBonus" class="col-2">
          <div class="q-pb-xs">{{ $t("edit_form.front_end_display") }}</div>
          <q-btn-toggle
            v-model="form.show"
            toggle-color="primary"
            text-color="primary"
            size="16px"
            unelevated
            rounded
            class="btn_toggle_style"
            :options="[
              { label: $t('edit_form.show'), value: true },
              { label: $t('edit_form.do_not_show'), value: false }
            ]"
          />
        </div>
        <!--派獎類型-->
        <div v-if="form.type !== EVENT_TYPE.Enums.CustomizeBonus" class="col-2">
          <div class="q-pb-xs">{{ $t("table_header.prize_distribution_type") }}</div>
          <q-select
            v-model="form.prize_type"
            :options="prizeTypeDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            rounded
            :disable="form.mode === 'edit'"
          />
          <div v-if="form.prize_type === PRIZE_TYPE.Enums.FREE_GAME" class="q-pb-md q-pt-md text-red-14">
            {{ $t("message.free_round_tip_s") }}
          </div>
        </div>
        <!--錢包類型-->
        <div
          v-if="form.type !== EVENT_TYPE.Enums.CustomizeBonus && form.prize_type === PRIZE_TYPE.Enums.CASH"
          class="col-2"
        >
          <div class="q-pb-xs">{{ $t("table_header.wallet_type") }}</div>
          <q-select
            v-model="form.wallet_type"
            :options="bounsDropdownList"
            class="edit-input"
            borderless
            dense
            emit-value
            map-options
            standout="bg-white text-black"
            rounded
          />
        </div>
        <!-- 同IP重複派發 -->
        <div v-if="form.type === EVENT_TYPE.Enums.RegisterBonus" class="col-2">
          <div class="q-pb-xs">{{ $t("edit_form.allow_same_ip") }}</div>
          <q-toggle
            v-model="form.allow_same_ip"
            class="toggle"
            color="blue"
            keep-color
            size="lg"
            :label="$t('edit_form.prohibit')"
            :true-value="false"
            :false-value="true"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <!-- 活動日期 -->
        <div class="col-3">
          <div class="q-pb-xs">{{ $t("edit_form.event_date") }}</div>
          <DateTimePicker
            class="edit-input"
            label=""
            :date-time-model="dateTimeSelector"
            :on-update-date-time="onUpdateDateTime"
            :with-outlined="false"
            :with-borderless="true"
            :readonly="isDepositLifetimeEditMode"
          />
        </div>
        <!-- 派發金額 -->
        <div
          v-if="form.type === EVENT_TYPE.Enums.RegisterBonus && form.prize_type !== PRIZE_TYPE.Enums.FREE_GAME"
          class="col-3"
        >
          <div class="q-pb-xs">{{ $t("edit_form.distribution_amount") }}</div>
          <div class="row q-gutter-sm">
            <div class="col-5">
              <q-select
                v-model="reward.currency"
                :options="currencyDropdown.list"
                class="edit-input"
                borderless
                dense
                emit-value
                map-options
                standout="bg-white text-black"
                rounded
                :disable="form.mode === 'edit'"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="reward.amount"
                :options="generalOptions"
                dense
                square
                borderless
                type="number"
                class="edit-input"
                :disable="form.mode === 'edit'"
              />
            </div>
          </div>
        </div>
        <!-- 結算週期 -->
        <div v-if="form.type === EVENT_TYPE.Enums.BetBonus" class="col-3">
          <div class="q-pb-xs">{{ $t("table_header.settle_cycle") }}</div>
          <div class="q-pt-sm">
            <div class="row items-center col-12">
              <q-radio
                v-model="form.settlement_type"
                :val="1"
                :label="$t('settlement_cycle.daily')"
                :disable="form.mode === 'edit'"
              />
              <div class="q-ml-md">
                <q-icon name="schedule" class="q-mr-xs" />
                00:00
                <span class="q-mx-sm">-</span>
                <q-icon name="schedule" class="q-mr-xs" />
                23:59
              </div>
            </div>
            <div class="row items-center col-12">
              <q-radio
                v-model="form.settlement_type"
                :val="2"
                :label="$t('settlement_cycle.weekly')"
                :disable="form.mode === 'edit'"
              />
              <div class="q-ml-md row items-center">
                <span class="">{{ $t("common.every_week") }}</span>
                <q-select
                  v-model="form.settlement_week"
                  :options="weekDropdownList"
                  class="edit-input q-ml-md"
                  borderless
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black"
                  rounded
                  :disable="form.mode === 'edit'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 前端顯示 - 存款優惠 -->
        <div v-if="form.type === EVENT_TYPE.Enums.CustomizeBonus" class="col-2">
          <div class="q-pb-xs">{{ $t("edit_form.front_end_display") }}</div>
          <q-btn-toggle
            v-model="form.show"
            toggle-color="primary"
            text-color="primary"
            size="16px"
            :options="[
              { label: $t('edit_form.show'), value: true },
              { label: $t('edit_form.do_not_show'), value: false }
            ]"
          />
        </div>
        <!-- 派發方式 -->
        <div v-if="form.type !== EVENT_TYPE.Enums.CustomizeBonus" class="col-2">
          <div>{{ $t("query_params.distribution_type") }}</div>
          <div class="q-pt-sm">
            <q-option-group v-model="form.auto_payout" :options="autoPayoutOptions" color="primary" inline />
          </div>
        </div>

        <!-- 稽核倍數 -->
        <div
          v-if="form.type !== EVENT_TYPE.Enums.CustomizeBonus && form.prize_type !== PRIZE_TYPE.Enums.FREE_GAME"
          class="col-3"
        >
          <div>{{ $t("edit_form.audit_multiple") }}</div>
          <div class="q-mt-xs row items-center no-wrap audit-multiple-container">
            <q-btn size="md" square flat @click="subStep">-</q-btn>
            <q-number
              v-model="form.audit_rate"
              :options="generalOptions"
              dense
              borderless
              square
              class="audit-multiple"
            />
            <q-btn size="md" square flat @click="addStep">+</q-btn>
          </div>
        </div>
        <!-- 充值金額稽核 -->
        <div v-if="showAuditRateSource" class="col-4">
          <div class="q-pb-xs row items-center no-wrap audit-rate-source-title">
            <span>{{ $t("recharge_hint_title") }}</span>
            <q-icon name="info" color="black" size="16px" class="q-ml-xs">
              <q-tooltip anchor="center right" self="center left" class="bg-grey-3 text-body2 text-black shadow-4">
                <div style="white-space: nowrap">
                  {{ $t("recharge_hint_one") }}<br />
                  - {{ $t("recharge_hint_two") }}<br />
                  - {{ $t("recharge_hint_three") }}<br />
                  ※ {{ $t("recharge_hint_four") }}
                </div>
              </q-tooltip>
            </q-icon>
          </div>
          <q-option-group v-model="form.audit_rate_source" :options="auditRateSourceOptions" color="primary" inline />
        </div>
      </div>

      <!-- 免费游戏设置 - 当 prize_type = 2 且 type = 2 时显示 -->
      <div v-if="form.prize_type === PRIZE_TYPE.Enums.FREE_GAME && form.type === 2" class="row q-col-gutter-md q-mt-md">
        <!-- Wallet type -->
        <div class="col-3">
          <q-select
            v-model="form.reward[0].free_round_setting[0].wallet_type"
            :options="freeRoundWalletTypeOptions"
            emit-value
            map-options
            :label="`* ${$t('query_params.wallet_type')}`"
            outlined
            @update:model-value="onFreeRoundWalletTypeChange"
          />
        </div>
        <span v-show="false">{{ form.reward[0].free_round_setting[0] }}</span>
        <!-- 幣別 -->
        <div class="col-3">
          <q-select
            v-if="currencyList.length && isFormReady"
            v-model="form.reward[0].free_round_setting[0].currency_id"
            :options="currencyList"
            emit-value
            :label="`* ${$t('common.currency')}`"
            map-options
            outlined
            @update:model-value="onCurrencyChange"
          />
        </div>

        <!-- 產品 -->
        <div class="col-3">
          <q-select
            v-if="isFormReady"
            v-model="form.reward[0].free_round_setting[0].product_code"
            :options="productList"
            emit-value
            :label="`* ${$t('table_header.product')}`"
            map-options
            outlined
            :loading="productLoading"
            @update:model-value="onProductChange"
          />
        </div>

        <!-- 遊戲 -->
        <div class="col-3">
          <q-select
            v-if="isFormReady"
            v-model="form.reward[0].free_round_setting[0].game_code"
            :options="gameList"
            emit-value
            :label="`* ${$t('table_header.game')}`"
            map-options
            outlined
            :loading="gameLoading"
            @update:model-value="onGameChange"
          />
        </div>

        <!-- 投注額度 -->
        <div class="col-3">
          <q-select
            v-if="isFormReady && form.reward[0].free_round_setting[0].product_code === 1006"
            v-model="form.reward[0].free_round_setting[0].bet_per_line"
            :options="betPerLineList"
            emit-value
            :label="`* ${$t('query_params.betting_amount_per_line')}`"
            map-options
            outlined
            :loading="betPerLineLoading"
            :disable="
              !isFormReady ||
              !form.reward[0].free_round_setting[0].currency_id ||
              !form.reward[0].free_round_setting[0].product_code ||
              !form.reward[0].free_round_setting[0].game_code
            "
          />
          <q-select
            v-if="isFormReady && form.reward[0].free_round_setting[0].product_code === 1148"
            v-model="form.reward[0].free_round_setting[0].total_bet_amount"
            :options="totalBetScalesList"
            emit-value
            :label="`* ${$t('table_header.total_bet_amount')}`"
            map-options
            outlined
            :loading="betPerLineLoading"
            :disable="
              !isFormReady ||
              !form.reward[0].free_round_setting[0].currency_id ||
              !form.reward[0].free_round_setting[0].product_code ||
              !form.reward[0].free_round_setting[0].game_code
            "
          />
        </div>

        <!-- 開始時間 -->
        <div class="col-3">
          <DateTimePickerSingle
            :date-time-model="date.begin_date"
            :label="`* ${$t('query_params.start_time')}`"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="(value: any) => onDateChange(value, 'begin_date')"
          />
        </div>

        <!-- 結束時間 -->
        <div class="col-3">
          <DateTimePickerSingle
            :date-time-model="date.end_date"
            :label="`* ${$t('query_params.end_time')}`"
            :with-outlined="true"
            :with-borderless="false"
            :useTimePicker="true"
            :on-update-date-time="(value: any) => onDateChange(value, 'end_date')"
          />
        </div>

        <!-- 次數 -->
        <div class="col-3">
          <q-input
            v-if="isFormReady"
            v-model.trim="form.reward[0].free_round_setting[0].rounds"
            type="number"
            class=""
            outlined
            :min="1"
            :label="`* ${$t('table_header.given_time')}`"
            @keydown="onRoundsKeydown"
          />
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, useSlots, watch, onMounted, watchEffect } from "vue"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import { useLanguageStore } from "src/stores/languageStore"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useImage } from "@/hook/useImage"
  import { useDecimal } from "@/hook/useDecimal"
  import { useCommon } from "@/hook/useCommon"
  import { hydrateDepositLifetimeState } from "@/pages/Promotion/PromotionSetting/Add/depositLifetime"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { getPromotionList, getPromotionDetail } from "@/api/promotion"
  import { getCurrencyList } from "@/api/common"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import {
    EVENT_TYPE,
    CATEGORY_TYPE,
    CURRENCY_TYPE,
    PROMOTION_REWARD_TYPE,
    BONUS_WALLET_TYPE,
    PRIZE_TYPE
  } from "@/utils/constants"
  import DateTimePicker from "@/components/query/dateTimePicker.vue"
  import Editor from "@/components/editor/Editor.vue"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useSiteStore } from "@/stores/siteStore"
  import { useEnv } from "src/hook/useEnv"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"
  import { getFreeRoundProduct, getFreeRoundGamesBetScales } from "@/api/freeRound"
  import AiLanguage from "@/components/ai/aiLanguage.vue"
  import { translateAiText } from "@/api/ai"
  import {
    getFreeRoundWalletTypeOptions,
    normalizeSelectableFreeRoundWalletType,
    normalizeSelectableFreeRoundWalletTypeWhenReady
  } from "@/utils/freeRoundWalletType"
  const slots = useSlots()
  const { t } = useI18n()
  const $q = useQuasar()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const { genWeeks, numberEnumToArray, genTimeFormat } = useCommon()
  const siteStore = useSiteStore()
  const languageStore = useLanguageStore()
  const promotionStore = usePromotionStore()
  const { walletSwitch } = useWalletBouns()
  const { promotionItem: form } = storeToRefs(promotionStore)
  const { envData } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  // 沿用設定
  const inheritEventId = ref(0)
  const promotionList = ref<Response.GetPromotionList>([])
  const promotionDetail = ref<Response.PromotionDetail[]>([])
  // 免费游戏相关变量
  const productLoading = ref(false)
  const gameLoading = ref(false)
  const betPerLineLoading = ref(false)

  const productList = ref<{ label: string; value: number }[]>([
    {
      label: "PragmaticPlay",
      value: 1006
    },
    {
      label: "WOW Gaming",
      value: 1148
    }
  ])
  const gameList = ref<{ label: string; value: string }[]>([
    {
      label: "",
      value: ""
    }
  ])
  const betPerLineList = ref<{ label: string; value: number }[]>([])
  const totalBetScalesList = ref<{ label: string; value: number }[]>([])
  const currencyList = ref<{ label: string; value: number }[]>([])
  const freeRoundWalletTypeOptions = computed(() => getFreeRoundWalletTypeOptions(siteStore.wallet_type_list, t))

  // 監聽 prize_type 變化，當等於 FREE_GAME 時初始化 free_round_setting
  watch(
    () => form.value.prize_type,
    (newPrizeType) => {
      if (!form.value.reward || form.value.reward.length === 0) {
        form.value.reward = []
      }
      if (
        form.value.type === EVENT_TYPE.Enums.RegisterBonus &&
        newPrizeType === PRIZE_TYPE.Enums.FREE_GAME &&
        !form.value.reward[0]?.free_round_setting?.length
      ) {
        form.value.reward[0] = {}
        form.value.reward[0].free_round_setting = []
        form.value.reward[0].free_round_setting[0] = {
          begin_date: 0,
          end_date: 0,
          bet_per_line: "",
          total_bet_amount: "",
          currency_id: null,
          game_code: "",
          product_code: null,
          rounds: null,
          remark: "",
          wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
        }
      }
    },
    { immediate: true }
  )

  // 監聽 form.type 變化，確保 free_round_setting 結構被正確初始化
  watch(
    () => form.value.type,
    (newType) => {
      if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
        // 確保 reward 數組存在
        if (!form.value.reward || form.value.reward.length === 0) {
          form.value.reward = []
        }

        // 確保 reward[0] 存在
        if (!form.value.reward[0]) {
          form.value.reward[0] = {
            amount: 0,
            condition: 0,
            currency: "",
            level: 0,
            type: 2,
            limit: 0,
            free_round_setting: []
          }
        }

        // 確保 free_round_setting 數組存在
        if (!form.value.reward[0].free_round_setting) {
          form.value.reward[0].free_round_setting = []
        }

        // 確保 free_round_setting[0] 存在
        if (form.value.reward[0].free_round_setting.length === 0) {
          form.value.reward[0].free_round_setting.push({
            begin_date: 0,
            end_date: 0,
            bet_per_line: "",
            total_bet_amount: "",
            currency_id: null,
            game_code: "",
            product_code: null,
            rounds: null,
            remark: "",
            wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
          })
        }

        // 如果 free_round_setting[0] 是空對象，填充默認值
        const setting = form.value.reward[0].free_round_setting[0]
        if (setting && Object.keys(setting).length === 0) {
          Object.assign(setting, {
            begin_date: 0,
            end_date: 0,
            bet_per_line: "",
            total_bet_amount: "",
            currency_id: null,
            game_code: "",
            product_code: null,
            rounds: null,
            remark: "",
            wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
          })
        }
      }
    },
    { immediate: true }
  )

  // 監聽 form.prize_type 變化，當為 FREE_GAME 時確保 free_round_setting 結構完整
  watch(
    () => form.value.prize_type,
    (newPrizeType) => {
      // 當 prize_type 為 FREE_GAME 時，確保 free_round_setting 結構完整
      if (newPrizeType === PRIZE_TYPE.Enums.FREE_GAME) {
        // 確保 reward 數組存在
        if (!form.value.reward || form.value.reward.length === 0) {
          form.value.reward = []
        }

        // 確保 reward[0] 存在
        if (!form.value.reward[0]) {
          form.value.reward[0] = {
            amount: 0,
            condition: 0,
            currency: "",
            level: 0,
            type: 2,
            limit: 0,
            free_round_setting: []
          }
        }

        // 確保 free_round_setting 數組存在
        if (!form.value.reward[0].free_round_setting) {
          form.value.reward[0].free_round_setting = []
        }

        // 確保 free_round_setting[0] 存在
        if (form.value.reward[0].free_round_setting.length === 0) {
          form.value.reward[0].free_round_setting.push({
            begin_date: 0,
            end_date: 0,
            bet_per_line: "",
            total_bet_amount: "",
            currency_id: null,
            game_code: "",
            product_code: null,
            rounds: null,
            remark: "",
            wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
          })
        }

        // 如果 free_round_setting[0] 是空對象，填充默認值
        const setting = form.value.reward[0].free_round_setting[0]
        if (setting && Object.keys(setting).length === 0) {
          Object.assign(setting, {
            begin_date: 0,
            end_date: 0,
            bet_per_line: "",
            total_bet_amount: "",
            currency_id: null,
            game_code: "",
            product_code: null,
            rounds: null,
            remark: "",
            wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
          })
        }
      }
    },
    { immediate: true }
  )

  // 添加计算属性来检查表单是否准备好
  const isFormReady = computed(() => {
    return !!form.value?.reward?.[0]?.free_round_setting?.[0]
  })

  const isDepositLifetimeEditMode = computed(() => {
    return (
      form.value.mode === "edit" &&
      form.value.type === EVENT_TYPE.Enums.DepositBonus &&
      form.value.prize_type === PRIZE_TYPE.Enums.CASH
    )
  })

  let productData: any = null

  // 计算属性来处理日期格式转换
  const beginDateObject = computed(() => {
    if (!form.value.reward[0]?.free_round_setting?.[0]?.begin_date) {
      return { from: "", fromHms: "", dateTime: "" }
    }
    const date = new Date(form.value.reward[0].free_round_setting[0].begin_date * 1000)
    const from = date.toISOString().split("T")[0]
    const fromHms = date.toTimeString().split(" ")[0]
    return { from, fromHms, dateTime: `${from} ${fromHms}` }
  })

  const endDateObject = computed(() => {
    if (!form.value.reward[0]?.free_round_setting?.[0]?.end_date) {
      return { from: "", fromHms: "", dateTime: "" }
    }
    const date = new Date(form.value.reward[0].free_round_setting[0].end_date * 1000)
    const from = date.toISOString().split("T")[0]
    const fromHms = date.toTimeString().split(" ")[0]
    return { from, fromHms, dateTime: `${from} ${fromHms}` }
  })

  const promotionDropdownList = computed(() => {
    if (promotionList.value.length === 0) {
      return [
        {
          value: 0,
          label: ""
        }
      ]
    }
    return promotionList.value.map((e) => {
      const value = e.id
      const label = getDynamicLangValue(e.title)
      return {
        value,
        label
      }
    })
  })
  const weekDropdownList = computed(() => {
    const weeks = genWeeks()
    return weeks.map((e) => {
      const label = t(e.label)
      return {
        label,
        value: e.value
      }
    })
  })

  /*const getInfoImage = (item: Response.PromotionDetail) => {
    fetch(relativeToAbsoluteResource(item.image).href, { mode: "no-cors" })
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader()
        reader.onload = function () {
          var base64data = reader.result
          item.image = base64data as string
        }
        reader.readAsDataURL(blob)
      })
      .catch((error) => console.error("发生错误:", error))
  }*/

  const copyPromotion = async () => {
    form.value.show_component = false
    const { code, msg, data } = await getPromotionDetail(inheritEventId.value)
    if (code === 0) {
      form.value.type = data.type
      form.value.category = data.category
      form.value.show = data.show
      form.value.count_basis = data.count_basis
      form.value.start_date = genTimeFormat(new Date(data.start_date), "yyyy-MM-dd", false)
      form.value.end_date = genTimeFormat(new Date(data.end_date), "yyyy-MM-dd", false)
      form.value.allow_same_ip = data.allow_same_ip
      form.value.auto_payout = data.auto_payout
      form.value.audit_rate = parseFloat(data.audit_rate)
      form.value.audit_rate_source = data.audit_rate_source ?? 0
      form.value.prize_type = data.prize_type
      form.value.wallet_type = walletSwitch.value ? data.wallet_type : BONUS_WALLET_TYPE.Enums.GENERALLY
      /*form.value.info.forEach(async (e) => {
          if (e.image.includes("uploads")) {
            await getInfoImage(e)
          }
        })*/
      //API來的資料把沒有的語系資料過濾掉
      const validLangs = siteStore.langList.map((item) => item.label)
      let filtered = data.details.filter((item: any) => validLangs.includes(item.lang))
      //如果API來的資料沒有目前設定的語系要加上去
      const promotionId = data.details[0].promotions_id
      const newEntries = siteStore.langList
        .filter((item) => !filtered.some((a: { lang: string }) => a.lang === item.label))
        .map((lang) => {
          return {
            promotion_id: promotionId,
            lang: lang.label,
            title: "",
            content: "",
            image: ""
          }
        })
      filtered = [...filtered, ...newEntries]
      form.value.info = filtered.map((e: Response.PromotionDetail) => {
        delete e.promotions_id
        if (e.image.includes("uploads")) {
          e.image = `${VITE_APP_BASE_API}/${e.image}`
        }
        return e
      })

      form.value.block_label_ids = data.block_lebel.map((e) => e.label_id)
      form.value.member_levels = data.member_level.map((e) => e.level_id)

      if (form.value.type !== EVENT_TYPE.Enums.BetBonus) {
        form.value.reward = data.reward.map((e) => {
          form.value.rewardType = e.type
          return {
            currency: CURRENCY_TYPE.Enums[e.currency_id],
            condition: parseFloat(e.condition),
            type: e.type,
            amount: parseFloat(e.amount),
            limit: e.limit === "0" ? "" : e.limit,
            level: e.level,
            max_level: e.max_level,
            repeatable: e.repeatable
          }
        })
      } else {
        //投注優惠
        form.value.settlement_type = data.settlement_type
        form.value.settlement_week = data.settlement_week
        form.value.game_type = JSON.parse(data.game_type_json)
        form.value.product_code = JSON.parse(data.product_code_json)
        form.value.reward = data.reward.map((item: Response.PromotionRewardItem) => ({
          currency: CURRENCY_TYPE.Enums[item.currency_id],
          condition: parseFloat(item.condition),
          type: item.type,
          amount: parseFloat(item.amount),
          limit: item.limit === "0" ? "" : item.limit
        }))
      }

      hydrateDepositLifetimeState(form.value, data.reward_range_mode)
      formatReward(form.value)

      form.value.show_component = true
      $q.notify({
        type: "positive",
        message: "複製成功",
        position: "top",
        timeout: 1000
      })
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  function getDynamicLangValue(data: Response.PromotionLangTitle): string {
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

  // 多語系（套用）
  const languageList = computed(() => {
    const languageList = siteStore.langList
    return languageList.map((e) => {
      const label = e.label
      const value = e.value
      return {
        label,
        value
      }
    })
  })

  const language = reactive({
    list: languageList,
    current:
      languageStore.currentLanguageOption.backendKey || (languageList?.value[0] ? languageList?.value[0].label : 0),
    apply: languageList?.value[0] ? languageList?.value[0].value : 0
  })

  const applyLanguage = async () => {
    const fromItem = form.value.info?.find((e) => e.lang === language.current)
    if (!fromItem) return

    const payload = []

    if (fromItem.title) {
      payload.push({
        input_text: fromItem.title
      })
    }

    if (fromItem.content) {
      payload.push({
        input_text: fromItem.content
      })
    }

    if (!payload.length) {
      $q.notify({
        type: "negative",
        message: t("message.please_fill_the_first_language_content_before_using_ai_translation"),
        position: "top",
        timeout: 300
      })
      return
    }

    try {
      $q.loading.show()
      const languages = language.list.map((item) => item.label)
      const payloadWithLanguages = payload.map((item) => ({ ...item, languages }))
      const { status, data } = await translateAiText(payloadWithLanguages)
      if (status && Array.isArray(data) && data.length) {
        if (fromItem.title) {
          const titleTranslations = data?.[0]?.translations
          const contentTranslations = data?.[1]?.translations

          form.value.info?.forEach((item) => {
            item.title = titleTranslations?.[item.lang]
            item.image = fromItem.image
            if (contentTranslations) {
              item.content = contentTranslations?.[item.lang]
            } else {
              item.content = ""
            }
          })
        } else {
          form.value.info?.forEach((item) => {
            item.title = ""
            item.content = data?.[0]?.translations?.[item.lang]
            item.image = fromItem.image
          })
        }

        $q.notify({
          type: "positive",
          message: t("message.ai_translation_completed"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      console.error("翻譯 API 請求失敗:", error)
    } finally {
      $q.loading.hide()
    }
  }

  const formatDateTimeSelector = (data: Request.AddPromotionItem) => {
    dateTimeSelector.from = data.start_date
    dateTimeSelector.to = data.end_date
  }
  const formatReward = (data: Request.AddPromotionItem) => {
    if (form.value.reward.length > 0) {
      reward.currency = data.reward[0].currency
      reward.amount = `${data.reward[0].amount}`
    }
    //註冊獎金幣別預設
    /*if (form.value.type === EVENT_TYPE.Enums.RegisterBonus) {
      reward.currency = currencyDropdown.list[0].value
    }*/
  }

  // 上傳圖片
  const { promotionEventBanner } = useImage()
  const updateImgUrl = (value: string, item: Request.PromotionInfo) => {
    item.image = value
  }
  const deleteImage = (item: Request.PromotionInfo) => {
    item.image = ""
  }
  // 編輯器
  const handelEditor = (value: string, item: Request.PromotionInfo) => {
    item.content = value
  }
  // 活動類型
  const eventTypeDropdownList = computed(() =>
    genEnumToDropdown(EVENT_TYPE.Enums, EVENT_TYPE.I18nKeys).map((e) => {
      e.label = t(e.label)
      return e
    })
  )
  // 會員分類
  const categoryDropdownList = computed(() =>
    genEnumToDropdown(CATEGORY_TYPE.Enums, CATEGORY_TYPE.I18nKeys).map((e) => {
      e.label = t(e.label)
      return e
    })
  )

  // 活動日期
  const dateTimeSelector = reactive<{ from?: string; to?: string }>({
    from: undefined,
    to: undefined
  })
  const onUpdateDateTime = (newValue: { from: string; to: string }) => {
    if (!newValue) {
      dateTimeSelector.from = undefined
      dateTimeSelector.to = undefined
      return
    }
    dateTimeSelector.from = newValue.from
    dateTimeSelector.to = newValue.to
  }
  //派獎類型
  const prizeTypeDropdownList = computed(() => {
    const list = numberEnumToArray(PRIZE_TYPE.Enums).map((item) => {
      const label = t(PRIZE_TYPE.I18nKeys[item as keyof typeof PRIZE_TYPE.I18nKeys]) || "common.unknow"
      return {
        label,
        value: item as number
      }
    })
    return [...list]
  })
  //錢包類型
  const bounsDropdownList = ref<{ label: string; value: number; disable: boolean }[]>([])

  // 更新 bounsDropdownList 的函數
  const updateBounsDropdownList = () => {
    bounsDropdownList.value = numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => {
      const label = t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow"
      return {
        label,
        value: item as number,
        disable: !walletSwitch.value && item !== BONUS_WALLET_TYPE.Enums.GENERALLY
      }
    })
  }

  // 更新產品列表的函數
  const updateProductList = () => {
    if (productData?.products) {
      productList.value = productData.products.map((item: any) => ({
        label: item.product_name,
        value: item.product_code
      }))
    }
  }

  // 更新遊戲列表的函數
  const updateGameList = () => {
    if (productData?.products) {
      const selectedProduct = productData.products.find(
        (item: any) => item.product_code === form.value.reward[0]?.free_round_setting?.[0]?.product_code
      )
      if (selectedProduct?.game_list) {
        gameList.value = selectedProduct.game_list.map((item: any) => ({
          label: item.game_name,
          value: item.game_code
        }))
      }
    }
  }

  // 更新貨幣列表的函數
  const updateCurrencyList = async () => {
    try {
      const { data: currencyData } = await getCurrencyList()
      currencyList.value = Object.keys(currencyData).map((key) => ({
        value: currencyData[key] as number,
        label: t((CURRENCY_TYPE.I18nKeys as any)[currencyData[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key)
      }))
    } catch (error) {
      console.error("更新貨幣列表失敗:", error)
    }
  }

  // 監聽 walletSwitch 變化，強制更新 bounsDropdownList
  watch(
    walletSwitch,
    () => {
      updateBounsDropdownList()
    },
    { immediate: true }
  )

  // 監聽 siteStore 的變化，強制更新相關的 ref 屬性
  watch(
    () => siteStore.wallet_type_list,
    (newList) => {
      console.log("siteStore.wallet_type_list 已更新:", newList)
      // 延遲一下更新，確保 walletSwitch 已經同步
      setTimeout(() => {
        updateBounsDropdownList()
        normalizeCurrentFreeRoundWalletType()
      }, 50)
    },
    { immediate: true }
  )

  // 監聽語系切換，更新所有 label
  watch(
    () => languageStore.currentLanguageOption,
    () => {
      // 更新所有下拉列表的 label
      updateBounsDropdownList()
      updateProductList()
      updateGameList()
      updateCurrencyList()
    },
    { immediate: false }
  )
  // 自動派發
  const autoPayoutOptions = computed(() => [
    {
      label: t("reward_type.auto"),
      value: true
    },
    {
      label: t("reward_type.manual"),
      value: false
    }
  ])

  // 充值金額稽核
  const auditRateSourceOptions = computed(() => [
    {
      label: t("recharge_cashflow_option"),
      value: 0
    },
    {
      label: t("recharge_event_option"),
      value: 1
    }
  ])
  const showAuditRateSource = computed(
    () => form.value.type === EVENT_TYPE.Enums.DepositBonus && form.value.prize_type !== PRIZE_TYPE.Enums.FREE_GAME
  )

  // 计算属性来处理日期格式转换
  const date = ref({
    begin_date: { from: "", fromHms: "", dateTime: "" },
    end_date: { from: "", fromHms: "", dateTime: "" }
  })

  // 稽核倍數
  const auditMultipleStep = 0.5
  const generalOptions = {
    min: 0,
    precision: "2",
    nullValue: 0
  }
  function addStep() {
    form.value.audit_rate = preciseAdd(form.value.audit_rate, auditMultipleStep)
  }
  function subStep() {
    if (form.value.audit_rate) {
      form.value.audit_rate = preciseSubtract(form.value.audit_rate, auditMultipleStep)
    }
  }
  // 派發金額
  const reward = reactive<{
    currency: string
    amount: string
    reward: Request.PromotionRewardItem[]
  }>({})
  const currencyDropdown = reactive<{
    list: {
      label: string
      value: string
    }[]
  }>({
    list: []
  })

  // 监听 prize_type 的变化，初始化或重置 wallet_type
  watch(
    () => form.value.prize_type,
    (newPrizeType) => {
      if (newPrizeType === PRIZE_TYPE.Enums.CASH && !form.value.wallet_type) {
        // 现金类型：初始化为一般钱包
        form.value.wallet_type = BONUS_WALLET_TYPE.Enums.GENERALLY
      } else if (newPrizeType === PRIZE_TYPE.Enums.FREE_GAME) {
        // 免费游戏类型：设为 undefined
        form.value.wallet_type = 0

        // 如果 reward 沒有資料，初始化 FREE_GAME 的資料結構
        if (!form.value.reward || !form.value.reward.length) {
          form.value.reward = [
            {
              free_round_setting: [{}]
            }
          ]
        } else if (!form.value.reward[0]?.free_round_setting?.length) {
          // 如果 reward 存在但 free_round_setting 沒有資料，初始化 free_round_setting
          if (!form.value.reward[0].free_round_setting) {
            form.value.reward[0].free_round_setting = []
          }
          form.value.reward[0].free_round_setting[0] = {}
        }
      }
    },
    { immediate: true }
  )

  // 免费游戏相关函数
  const getCurrencyDropdown = async () => {
    const { data: currencyData } = await getCurrencyList()
    currencyList.value = Object.keys(currencyData).map((key) => ({
      value: currencyData[key] as number,
      label: t((CURRENCY_TYPE.I18nKeys as any)[currencyData[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key)
    }))
  }

  const normalizeCurrentFreeRoundWalletType = () => {
    const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
    if (!freeRoundSetting) {
      return
    }

    freeRoundSetting.wallet_type = normalizeSelectableFreeRoundWalletTypeWhenReady(
      freeRoundSetting.wallet_type,
      siteStore.wallet_type_list,
      siteStore.walletTypeListReady
    )
  }

  // 根據載入的資料初始化 free round 相關列表
  const initFreeRoundLists = async () => {
    const freeRoundSetting = form.value.reward[0]?.free_round_setting?.[0]
    if (!freeRoundSetting) return
    normalizeCurrentFreeRoundWalletType()

    // 如果有 currency_id，獲取產品列表
    if (freeRoundSetting.currency_id) {
      await getFreeRoundProductList(freeRoundSetting.currency_id)

      // 如果有 product_code，獲取遊戲列表
      if (freeRoundSetting.product_code) {
        await getFreeRoundGameList(freeRoundSetting.product_code)

        // 如果有 game_code，獲取投注額度列表
        if (freeRoundSetting.game_code) {
          await getFreeRoundBetScalesList(
            freeRoundSetting.currency_id,
            freeRoundSetting.product_code,
            freeRoundSetting.game_code
          )
        }
      }
    }
  }

  // 加载游戏列表的公共函数
  const loadGameList = async (currencyId: number, productCode: number) => {
    gameLoading.value = true
    try {
      const response = await getFreeRoundProduct(currencyId, productCode)
      if (response?.data) {
        productData = response.data
        const selectedProduct = response.data.products.find((item: any) => item.product_code === productCode)
        if (selectedProduct?.game_list) {
          gameList.value = selectedProduct.game_list.map((item: any) => ({
            label: item.game_name,
            value: item.game_code
          }))
        }
      }
    } catch (error) {
      console.error("获取游戏列表失败:", error)
    } finally {
      gameLoading.value = false
    }
  }

  // 獲取產品列表（已改为固定列表）
  const getFreeRoundProductList = async (currencyId: number) => {
    // 固定产品列表
    productList.value = [
      {
        label: "PragmaticPlay",
        value: 1006
      },
      {
        label: "WOW Gaming",
        value: 1148
      }
    ]

    // 如果币别和产品都有值，则获取游戏列表
    const productCode = form.value.reward[0]?.free_round_setting?.[0]?.product_code
    if (currencyId && productCode) {
      await loadGameList(currencyId, productCode)
    }
  }

  // 獲取遊戲列表
  const getFreeRoundGameList = async (productCode: number) => {
    const currencyId = form.value.reward[0]?.free_round_setting?.[0]?.currency_id
    if (productCode && currencyId) {
      await loadGameList(currencyId, productCode)
    }
  }

  // 獲取投注額度列表
  const getFreeRoundBetScalesList = async (currencyId: number, productCode: number, gameCode: string) => {
    betPerLineLoading.value = true
    try {
      const response = await getFreeRoundGamesBetScales({
        currency_id: currencyId,
        product_code: productCode,
        game_code: gameCode,
        wallet_type: normalizeSelectableFreeRoundWalletTypeWhenReady(
          form.value.reward[0].free_round_setting[0].wallet_type,
          siteStore.wallet_type_list,
          siteStore.walletTypeListReady
        )
      })
      if (response?.data?.betPerLineScales) {
        betPerLineList.value = response.data.betPerLineScales.map((item: any) => ({
          label: item.toString(),
          value: item
        }))
      }
      if (response?.data?.totalBetScales) {
        totalBetScalesList.value = response.data.totalBetScales.map((item: any) => ({
          label: item.toString(),
          value: item
        }))
      }
    } catch (error) {
      console.error("获取投注额度列表失败:", error)
    } finally {
      betPerLineLoading.value = false
    }
  }

  const normalizeFreeRoundDate = (value: string | number | null | undefined) => {
    if (typeof value === "number") {
      return value
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Math.floor(new Date(value).getTime() / 1000)
      return Number.isNaN(parsed) ? 0 : parsed
    }

    return 0
  }

  // 將時間戳轉換為日期格式的函數
  const convertTimestampToDate = (timestamp: string | number | null | undefined) => {
    const normalizedTimestamp = normalizeFreeRoundDate(timestamp)
    if (!normalizedTimestamp) {
      return { from: "", fromHms: "", dateTime: "" }
    }
    const date = new Date(normalizedTimestamp * 1000)

    // 使用本地时间，不调整时区
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const from = `${year}-${month}-${day}`

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const fromHms = `${hours}:${minutes}:${seconds}`

    console.log("timestamp", normalizedTimestamp, date, from, fromHms)
    return { from, fromHms, dateTime: `${from} ${fromHms}` }
  }

  function onDateChange(value: { from: string; fromHms: string }, key: "begin_date" | "end_date") {
    // 将日期时间字符串转换为 Unix 时间戳
    const dateTimeString = `${value.from} ${value.fromHms}`
    const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000)

    // 验证开始时间不能早于当前时间
    if (key === "begin_date") {
      const currentTime = Math.floor(Date.now() / 1000)
      if (timestamp < currentTime) {
        $q.notify({
          type: "negative",
          message: t("error_msg.start_date_cannot_than_today"),
          position: "top",
          timeout: 3000
        })
        // 验证不通过时，将开始时间设置为 0
        if (form.value.reward[0]?.free_round_setting?.[0]) {
          form.value.reward[0].free_round_setting[0].begin_date = 0
        }
        // 同时清空 date 值
        date.value.begin_date = { from: "", fromHms: "", dateTime: "" }
        return
      }

      const endTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.end_date)
      console.log(endTimestamp, timestamp)
      if (endTimestamp && endTimestamp > 0 && timestamp >= endTimestamp) {
        $q.notify({
          type: "negative",
          message: t("error_message.start_time_cannot_be_greater_than_end_time"),
          position: "top"
        })
        // 验证不通过时，将开始时间和结束时间都设置为 0
        if (form.value.reward[0]?.free_round_setting?.[0]) {
          form.value.reward[0].free_round_setting[0].begin_date = 0
          form.value.reward[0].free_round_setting[0].end_date = 0
        }
        // 同时清空 date 值
        date.value.begin_date = { from: "", fromHms: "", dateTime: "" }
        date.value.end_date = { from: "", fromHms: "", dateTime: "" }
        return
      }
    } else if (key === "end_date") {
      const beginTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.begin_date)
      console.log(beginTimestamp, timestamp)
      if (beginTimestamp && beginTimestamp > 0 && timestamp <= beginTimestamp) {
        $q.notify({
          type: "negative",
          message: t("error_message.end_time_cannot_be_less_than_start_time"),
          position: "top"
        })
        // 验证不通过时，将开始时间和结束时间都设置为 0
        if (form.value.reward[0]?.free_round_setting?.[0]) {
          form.value.reward[0].free_round_setting[0].begin_date = 0
          form.value.reward[0].free_round_setting[0].end_date = 0
        }
        // 同时清空 date 值
        date.value.begin_date = { from: "", fromHms: "", dateTime: "" }
        date.value.end_date = { from: "", fromHms: "", dateTime: "" }
        return
      }
    }
    if (!form.value.reward) {
      form.value.reward = []
    }
    if (!form.value.reward[0]) {
      form.value.reward[0] = {}
    }
    if (!form.value.reward[0].free_round_setting) {
      form.value.reward[0].free_round_setting = []
    }
    form.value.reward[0].free_round_setting[0][key] = timestamp

    // 同步更新 date 值，保持顯示一致
    date.value[key] = { from: value.from, fromHms: value.fromHms, dateTime: dateTimeString }
  }

  const initDateFromForm = () => {
    const beginTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.begin_date)
    const endTimestamp = normalizeFreeRoundDate(form.value.reward[0]?.free_round_setting?.[0]?.end_date)

    if (beginTimestamp && beginTimestamp > 0) {
      form.value.reward[0].free_round_setting[0].begin_date = beginTimestamp
      date.value.begin_date = convertTimestampToDate(beginTimestamp)
    }
    if (endTimestamp && endTimestamp > 0) {
      form.value.reward[0].free_round_setting[0].end_date = endTimestamp
      date.value.end_date = convertTimestampToDate(endTimestamp)
    }
  }

  const onCurrencyChange = async (currencyId: number) => {
    // 重置游戏选择
    form.value.reward[0].free_round_setting![0].game_code = ""
    form.value.reward[0].free_round_setting![0].bet_per_line = ""
    form.value.reward[0].free_round_setting![0].total_bet_amount = ""
    gameList.value = [
      {
        label: "",
        value: ""
      }
    ]
    betPerLineList.value = []
    totalBetScalesList.value = []
    productData = null

    // 固定产品列表
    productList.value = [
      {
        label: "PragmaticPlay",
        value: 1006
      },
      {
        label: "WOW Gaming",
        value: 1148
      }
    ]

    // 如果币别和产品都有值，则获取游戏列表
    if (currencyId && form.value.reward[0].free_round_setting![0].product_code) {
      await loadGameList(currencyId, form.value.reward[0].free_round_setting![0].product_code)
    }
  }

  const onProductChange = async (productCode: number) => {
    // 重置游戏和投注额度选择
    form.value.reward[0].free_round_setting![0].game_code = ""
    form.value.reward[0].free_round_setting![0].bet_per_line = ""
    form.value.reward[0].free_round_setting![0].total_bet_amount = ""
    gameList.value = []
    betPerLineList.value = []
    totalBetScalesList.value = []

    // 如果产品和币别都有值，则获取游戏列表
    const currencyId = form.value.reward[0]?.free_round_setting?.[0]?.currency_id
    if (productCode && currencyId) {
      await loadGameList(currencyId, productCode)
    }
  }

  const onFreeRoundWalletTypeChange = async (walletType: number) => {
    const freeRoundSetting = form.value.reward[0].free_round_setting![0]
    freeRoundSetting.wallet_type = normalizeSelectableFreeRoundWalletType(walletType, siteStore.wallet_type_list)
    freeRoundSetting.bet_per_line = ""
    freeRoundSetting.total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []

    if (freeRoundSetting.game_code && freeRoundSetting.currency_id && freeRoundSetting.product_code) {
      await getFreeRoundBetScalesList(
        freeRoundSetting.currency_id,
        freeRoundSetting.product_code,
        freeRoundSetting.game_code
      )
    }
  }

  const onGameChange = async (gameCode: string) => {
    // 重置投注额度选择
    form.value.reward[0].free_round_setting![0].bet_per_line = ""
    form.value.reward[0].free_round_setting![0].total_bet_amount = ""
    betPerLineList.value = []
    totalBetScalesList.value = []

    if (
      gameCode &&
      form.value.reward[0].free_round_setting![0].currency_id &&
      form.value.reward[0].free_round_setting![0].product_code
    ) {
      await getFreeRoundBetScalesList(
        form.value.reward[0].free_round_setting![0].currency_id,
        form.value.reward[0].free_round_setting![0].product_code,
        gameCode
      )
    }
  }

  function onRoundsKeydown(event: KeyboardEvent) {
    // 禁止输入负号和点号
    if (event.key === "-" || event.key === ".") {
      event.preventDefault()
      return false
    }

    // 只允许数字和功能键
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ]

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault()
      return false
    }
  }

  // 重新添加被删除的重要代码
  async function getCurrencyDropdownForReward() {
    const { data } = await getCurrencyList()
    if (!data || !Object.keys(data).length) {
      currencyDropdown.list.length = 0
      return
    }
    Object.keys(data).forEach((key) => {
      currencyDropdown.list.push({
        label: t(CURRENCY_TYPE.I18nKeys[data[key] as keyof typeof CURRENCY_TYPE.I18nKeys] ?? key),
        value: key
      })
    })
  }

  // 間聽清零
  watch(
    () => reward.amount,
    (newValue) => {
      if (newValue) {
        reward.amount = newValue.replace(/^0+/, "") || "0"
      }
    }
  )
  watch(
    form,
    (newValue) => {
      formatDateTimeSelector(newValue)
    },
    { deep: true }
  )
  watch(dateTimeSelector, (newValue) => {
    form.value.start_date = newValue.from || ""
    form.value.end_date = newValue.to || ""
  })
  //註冊優惠
  watch(
    reward,
    (newValue) => {
      if (form.value.type === EVENT_TYPE.Enums.RegisterBonus && form.value.mode !== "edit") {
        const rewardItem: Request.PromotionRewardItem = {
          currency: newValue.currency,
          amount: parseFloat(newValue.amount),
          type: PROMOTION_REWARD_TYPE.Enums.FixedAmount,
          condition: 0,
          limit: ""
        }
        if (form.value.prize_type === PRIZE_TYPE.Enums.CASH) {
          form.value.reward[0] = rewardItem
        }
        if (form.value.prize_type === PRIZE_TYPE.Enums.FREE_GAME) {
          form.value.reward[0] = rewardItem
          form.value.reward[0].free_round_setting = []
          form.value.reward[0].free_round_setting[0] = {
            begin_date: 0,
            end_date: 0,
            bet_per_line: "",
            total_bet_amount: "",
            currency_id: null,
            game_code: "",
            product_code: null,
            rounds: null,
            remark: "",
            wallet_type: normalizeSelectableFreeRoundWalletType(0, siteStore.wallet_type_list)
          }
        }
        ;``
      }
    },
    { deep: true }
  )
  watch(
    languageList,
    (newValue) => {
      // 优先使用当前语系，如果当前语系不在列表中则使用第一个
      language.current = newValue[0]?.label
    },
    { immediate: true }
  )

  watchEffect(async () => {
    // 在編輯模式下，跳過沿用設定的 API 調用，避免重複獲取數據
    if (form.value.mode === "edit") {
      return
    }

    // 沿用設定 - 只在新增模式下執行
    const payload = {
      type: form.value.type
    }

    const { code, data } = await getPromotionList(payload)
    if (code === 0) {
      promotionList.value = [...data.list]
      if (data.list.length > 0) {
        inheritEventId.value = data.list[0].id
      } else {
        inheritEventId.value = 0
      }
    }

    // 獲取沿用設定的詳細數據
    if (inheritEventId.value) {
      const { code, data } = await getPromotionDetail(inheritEventId.value)
      if (code === 0) {
        promotionDetail.value = [...data.details]

        if (data.details.length > 0) {
          inheritEventId.value = data.id
        } else {
          inheritEventId.value = 0
        }
      }
    }
  })

  onMounted(async () => {
    // 確保 siteStore 數據已初始化，這樣 walletSwitch 和 bounsDropdownList 才能正確更新
    if (!siteStore.langList.length) {
      // 這裡可以調用 updateSiteSetting 或者等待其他地方的初始化
      // 如果 siteStore 還沒有數據，我們可以等待一下
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    formatDateTimeSelector(form.value)
    await getCurrencyDropdownForReward()
    await getCurrencyDropdown()

    // 初始化時，只有在 form 中有資料時才轉換進 date
    initDateFromForm()
    formatReward(form.value)
    await initFreeRoundLists()
  })
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";

  .lang-tabs {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
      padding-left: 0.5rem;
      .q-tab {
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #f0f2f5;
        border-left: 1px solid #f0f2f5;
        border-right: 1px solid #f0f2f5;
        &--active {
          border: none;
        }
      }
    }
  }

  .tab-container {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
    }
    .q-tab--active {
      color: $mainColor;
    }
  }
  .edit-input {
    border: 0.0625rem solid #c2c2ca;
    border-radius: 0.25rem;
    padding: 0.0313rem 0.625rem;
    background-color: #fff;
    ::v-deep(.q-field__control) {
      box-shadow: none;
      min-height: 32px;
      height: 32px;
    }
    ::v-deep(.q-field__native) {
      height: 32px;
      min-height: 32px;
    }

    ::v-deep(.q-field__append) {
      height: 32px;
      min-height: 32px;
    }
  }
  .preview-image {
    aspect-ratio: 236/132;
    overflow: auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    cursor: pointer;
    img {
      width: 100%;
      height: auto;
    }
  }
  .audit-multiple-container {
    background-color: #fcf8ff;
    .q-btn {
      height: 1.25rem;
      background-color: #fff;
      font-size: 0.625rem;
    }
    .audit-multiple {
      min-height: 36px;
      height: 36px;
      background-color: #fff;
      border-top: 0.0625rem solid #999;
      border-bottom: 0.0625rem solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
    :deep(.q-field--dense) {
      min-height: 36px;
      height: 36px;
    }
  }

  :deep(.q-tab--active) {
    background-color: #eff7ff;
  }
  :deep(.q-tab__indicator) {
    display: none;
  }
  .apply-btn {
    min-height: 32px;
    height: 32px;
    font-size: 12px !important;
  }

  .activity-info {
  }

  .audit-multiple {
    ::v-deep(.q-field__control) {
      height: 34px;
      min-height: 34px;
    }
    :deep(.q-field__native) {
      height: 34px;
      min-height: 34px;
    }
  }
</style>
