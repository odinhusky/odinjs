<template>
  <div class="q-pa-md">
    <!--信用版不要顯示-->
    <q-card class="q-mb-md q-pb-md" v-if="!siteStore.isCredit">
      <q-form>
        <div class="q-pt-md q-pl-md">
          <div class="h2-bold bold row items-center" v-if="permission.edit">
            {{ $t("common.member_level_settings") }}
            <q-btn @click="onSettings()" :disable="allowEdit" class="q-ml-md btns btn-blue" :label="$t('btn.edit')" />
          </div>
        </div>

        <q-card-section class="relative" style="padding-top: 0px">
          <!-- 遮罩 -->
          <q-inner-loading :showing="!allowEdit">
            <div class="mask" />
          </q-inner-loading>
          <div class="row q-col-gutter-md q-mb-sm edit_area_style1">
            <!-- 結算週期 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.settle_cycle") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-option-group
                  v-model="levelSettings.settlement_type"
                  color="primary"
                  :options="settlementCycleList"
                  :disable="!allowEdit"
                >
                  <!-- 日結算 -->
                  <template v-slot:label-0="opt">
                    <div class="row items-center" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col q-ml-xs">00:00 - 23:59</div>
                    </div>
                  </template>

                  <!-- 週結算 -->
                  <template v-slot:label-1="opt">
                    <div class="row items-center text-left" style="min-width: 15rem">
                      <div>{{ opt.label }}</div>
                      <div class="col row items-center q-ml-xs">
                        {{ $t("common.every_week") }}
                        <q-select
                          v-model="levelSettings.settlement_week"
                          :options="dropdownData.weeks"
                          outlined
                          dense
                          emit-value
                          map-options
                          color="primary"
                          class="q-ml-sm default-input-sm"
                        >
                          <template #selected>
                            {{
                              dropdownData.weeks.filter((item) => item.value === levelSettings.settlement_week)[0]
                                ? $t(
                                    dropdownData.weeks.filter((item) => item.value === levelSettings.settlement_week)[0]
                                      .label
                                  )
                                : $t("common.unknow")
                            }}
                          </template>
                          <template #option="{ itemProps, opt, selected, toggleOption }">
                            <q-item v-bind="itemProps">
                              <q-item-section>
                                <q-item-label>{{ $t(opt.label) }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </template>
                </q-option-group>
              </q-card-actions>
            </q-card>
            <!-- 晉升條件 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("common.level_up_condition") }}</p>
              </div>
              <q-card-actions
                class="q-px-none q-py-none h7-bold grey column ckeckbox-style items-start"
                v-if="!loading"
              >
                <!--<q-checkbox
                  :model-value="levelSettings.promotion_condition === 1"
                  @update:model-value="(val) => (levelSettings.promotion_condition = val ? 1 : 0)"
                  :label="$t('table_header.validate_bet')"
                  :disable="!allowEdit"
                />
                <q-checkbox
                  :model-value="levelSettings.promotion_condition === 2"
                  @update:model-value="(val) => (levelSettings.promotion_condition = val ? 2 : 0)"
                  :label="$t('table_header.deposit_amount')"
                  :disable="!allowEdit"
                />-->
                <q-checkbox
                  :model-value="promotionCondition.includes(1)"
                  @update:model-value="(val) => updatePromotionConditions(1, val)"
                  :label="$t('table_header.validate_bet')"
                  :disable="!allowEdit"
                />
                <q-checkbox
                  :model-value="promotionCondition.includes(2)"
                  @update:model-value="(val) => updatePromotionConditions(2, val)"
                  :label="$t('table_header.deposit_amount')"
                  :disable="!allowEdit"
                />
              </q-card-actions>
            </q-card>
            <!-- 跳級 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("common.skip_level") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey column items-start" style="">
                <q-option-group
                  v-model="levelSettings.can_skip"
                  color="primary"
                  :options="skipList"
                  :disable="!allowEdit"
                />
              </q-card-actions>
            </q-card>
            <!-- 派發方式 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.reward_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey column items-start" style="">
                <q-option-group
                  v-model="levelSettings.auto_payout"
                  color="primary"
                  :options="sendTypeList"
                  :disable="!allowEdit"
                />
              </q-card-actions>
            </q-card>
            <!-- 重複派發 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("edit_form.repeat_distribution") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey column items-start" style="">
                <q-option-group
                  v-model="levelSettings.is_repeat"
                  color="primary"
                  :options="repeatDistributionTypeList"
                  :disable="!allowEdit"
                />
              </q-card-actions>
            </q-card>
            <!-- 稽核倍數 -->
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("common.audit_ratio") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <div class="row items-center no-wrap audit-multiple-container">
                  <q-btn size="md" square flat @click="addRatio(-0.5)" class="q-left">-</q-btn>
                  <q-number
                    v-model="levelSettings.audit_rate"
                    borderless
                    class="default-input audit-multiple"
                    :disable="!allowEdit"
                  />
                  <q-btn size="md" square flat @click="addRatio(0.5)" class="q-right">+</q-btn>
                </div>
              </q-card-actions>
            </q-card>
            <!-- 錢包類型 -->
            <q-card v-if="walletSwitch" class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("table_header.wallet_type") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey">
                <q-select
                  v-model="levelSettings.wallet_type"
                  :options="bounsDropdownList"
                  outlined
                  class="default-input"
                  emit-value
                  map-options
                />
              </q-card-actions>
            </q-card>
            <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
              <div>
                <p class="h7-bold">{{ $t("common.block_send_tag") }}</p>
              </div>
              <q-card-actions class="q-px-none q-py-none h7-bold grey ckeckbox-style" v-if="!loading">
                <memberTagOption :parent-value="levelSettings.block_lebel" @update:labelValue="handelBlockTags" />
              </q-card-actions>
            </q-card>
          </div>

          <!-- 領取期限 -->
          <!--
          <div class="text-bold row items-center q-mb-md">
            <div class="col-sm-1">{{ $t("edit_form.collection_period") }}</div>
            <div class="row items-center">
              {{ $t("edit_form.after_distribution") }}
              <q-input
                v-model.number="levelSettings.period"
                outlined
                dense
                hide-bottom-space
                :disable="!allowEdit"
                style="max-width: 10rem"
                class="text-center"
              >
                <template #before>
                  <q-btn round dense flat icon="remove" :disable="!allowEdit" @click="addPeriod(-0.01)" />
                </template>

                <template #after>
                  <q-btn round dense flat icon="add" :disable="!allowEdit" @click="addPeriod(0.01)" />
                </template>
              </q-input>
              <span>{{ $t("edit_form.day") }}，{{ $t("edit_form.automatically_receive") }}</span>
            </div>
            <div class="q-px-md">
              <q-select
                v-model="levelSettings.periodCurrency"
                :options="currencyTags"
                dense
                outlined
                emit-value
                map-options
                color="primary"
                :disable="!allowEdit"
                style="max-width: 10rem"
              />
            </div>
            <span>{{ $t("edit_form.gift_money") }}</span>
          </div>
        -->

          <div class="row item-center justify-end">
            <q-btn
              style="min-width: 4.875rem"
              outline
              :label="$t('btn.cancel')"
              color="success"
              class="q-ml-md btns detail-btn"
              :disable="!allowEdit"
              @click="onCancel"
            />
            <q-btn
              style="min-width: 4.875rem"
              :label="$t('btn.save')"
              :loading="loading"
              class="q-ml-md btns btn-blue"
              :disable="!allowEdit"
              @click="onSave"
            />
          </div>
        </q-card-section>
      </q-form>
    </q-card>

    <div class="row q-mb-md">
      <q-select
        class="q-mr-sm currency-select"
        v-model="levelSettings.currentCurrency"
        :options="store.currencyList"
        dense
        outlined
        emit-value
        map-options
        color="primary"
        style="max-width: 10rem"
        :option-label="(item) => (item && item.label ? $t(`${item.label}`) : item.value)"
        v-if="!siteStore.isCredit"
      />

      <q-btn @click="onAdd" v-if="permission.edit" class="btns btn-blue">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add_level") }}
      </q-btn>
    </div>
    <!--現金版-->
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="tableData"
      row-key="id"
      v-if="!siteStore.isCredit"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th rowspan="2">{{ $t("table_header.distribution_level") }}</q-th>
          <q-th rowspan="2">{{ $t("table_header.membership_level") }}</q-th>
          <q-th colspan="2">{{ $t("table_header.level_up_condition") }}</q-th>
          <q-th colspan="2">{{ $t("table_header.level_up_offer") }}</q-th>
          <q-th rowspan="2">{{ $t("table_header.remark") }}</q-th>
          <q-th rowspan="2" v-if="permission.edit">{{ $t("table_header.actions") }}</q-th>
        </q-tr>
        <q-tr>
          <q-th>{{ $t("table_header.validate_bet") }}</q-th>
          <q-th>{{ $t("table_header.deposit_amount") }}</q-th>
          <q-th>{{ $t("table_header.level_up_reward") }}</q-th>
          <q-th>{{ $t("table_header.birthday_reward") }}</q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <!-- 派發等級 -->
          <q-td>{{ props.row.level }}</q-td>
          <!-- 層級名稱 -->
          <q-td>{{ getDynamicLangValue(props.row.titles) }}</q-td>

          <!-- 有效投注 -->
          <q-td>{{ getCurrencyValue(props.row.condition, "valid_bet_amount") }}</q-td>

          <!-- 存款金額 -->
          <q-td>{{ getCurrencyValue(props.row.condition, "deposit_amount") }}</q-td>

          <!-- 晉級禮金 -->
          <q-td>
            {{ getCurrencyValue(props.row.reward, "promotion_bonus") }}
          </q-td>

          <!-- 生日禮金 -->
          <q-td>
            {{ getCurrencyValue(props.row.reward, "birthday_bonus") }}
          </q-td>
          <!-- 取款限額 -->
          <!-- <q-td>{{
            `${moneyFormat(getDynamicCurrencySingleWithdraw(props.row.single_withdraw_limit).min)} - ${moneyFormat(
              getDynamicCurrencySingleWithdraw(props.row.single_withdraw_limit).max
            )}`
          }}</q-td> -->

          <!-- 取款次數 -->
          <!-- <q-td>{{ moneyFormat(getDynamicCurrencyValue(props.row.withdraw_count)) }}</q-td> -->

          <!-- 備註 -->
          <q-td>{{ props.row.remark }}</q-td>

          <!-- 功能 -->
          <q-td v-if="permission.edit">
            <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onEdit(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
            </q-btn>
            <q-btn flat fab-mini icon="content_copy" class="copy" @click="onCopy(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.copy") }}</q-tooltip>
            </q-btn>
            <q-btn flat fab-mini icon="delete" class="del" @click="onDelete(props.row)" v-if="!props.row.is_default">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.delete") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm column">
          <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
          <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
        </div>
      </template>
    </q-table>
    <!--信用版-->
    <q-table square hide-pagination :rows-per-page-options="[0]" :rows="tableData" row-key="id" v-else>
      <template #header="props">
        <q-tr :props="props">
          <q-th rowspan="2">{{ $t("table_header.distribution_level") }}</q-th>
          <q-th rowspan="2">{{ $t("table_header.membership_level") }}</q-th>
          <q-th colspan="1">{{ $t("table_header.level_up_condition") }}</q-th>
          <q-th rowspan="2">{{ $t("table_header.remark") }}</q-th>
          <q-th rowspan="2" v-if="permission.edit">{{ $t("table_header.actions") }}</q-th>
        </q-tr>
        <q-tr>
          <q-th>{{ $t("table_header.validate_bet") }}</q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <!-- 派發等級 -->
          <q-td>{{ props.row.level }}</q-td>
          <!-- 層級名稱 -->
          <q-td>{{ getDynamicLangValue(props.row.titles) }}</q-td>

          <!-- 有效投注 -->
          <q-td>{{ moneyFormat(props.row.condition[0]?.valid_bet_amount) }}</q-td>

          <!-- 備註 -->
          <q-td>{{ props.row.remark }}</q-td>

          <!-- 功能 -->
          <q-td v-if="permission.edit">
            <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onEdit(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
            </q-btn>
            <q-btn flat fab-mini icon="content_copy" class="copy" @click="onCopy(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.copy") }}</q-tooltip>
            </q-btn>
            <q-btn flat fab-mini icon="delete" class="del" @click="onDelete(props.row)" v-if="!props.row.is_default">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.delete") }}</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm column no_data">
          <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
          <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
        </div>
      </template>
    </q-table>
  </div>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading" />
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive, computed, watchEffect, watch } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRouter } from "vue-router"
  import { clone } from "ramda"
  import { useMemberLevelStore } from "@/stores/memberLevel"
  import { useLanguageStore } from "@/stores/languageStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import {
    CURRENCY_TYPE,
    SETTLEMENT_CYCLE,
    SEND_TYPE,
    LEVEL_UP_CONDITION_SINCE,
    PROTECT_LEVEL,
    BLOCK_TAG,
    LANGUAGE_TYPE,
    REPEAT_DISTRIBUTION_TYPE,
    BONUS_WALLET_TYPE
  } from "@/utils/constants"
  import {
    getLevelSettings,
    getCashLevelSettings,
    getMemberLevelSingleDetail,
    updateMemberLevelDefaultSettings,
    getMemberLevelDefaultSettings,
    deleteMemberLevelSettings
  } from "@/api/memberLevel"
  import type * as Response from "@/api/response.type"
  import { getCurrencyList } from "@/api/common"
  import memberTagOption from "@/components/forms/memberTagOption.vue"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useSiteStore } from "@/stores/siteStore"
  import { useCurrencyStore } from "src/stores/currencyStore"

  const siteStore = useSiteStore()
  const { walletSwitch } = useWalletBouns()
  const { t } = useI18n()
  const { moneyFormat, genTimeFormat, roundTo, numberEnumToArray } = useCommon()
  const router = useRouter()
  const $q = useQuasar()
  const memberLevetStore = useMemberLevelStore()
  const languageStore = useLanguageStore()
  const store = useQueryStore()
  const { permission } = usePermission()
  const currencyStore = useCurrencyStore()

  const allowEdit = ref(false)
  const levelSettings = reactive({
    settlement_type: SETTLEMENT_CYCLE.Enums.Daily,
    settlement_week: 1,
    auto_payout: true,
    is_repeat: true,
    can_skip: true,
    promotion_condition: [1],
    audit_rate: 0 as number,
    block_lebel: [] as number[],
    currentCurrency: 0,
    wallet_type: BONUS_WALLET_TYPE.Enums.GENERALLY
  })

  const { search, tableData, totalSize } = useSearch(getLevelSettings)

  interface newItemType {
    label?: string
    value?: number
  }
  const handelBlockTags = (value: []) => {
    //formData.label = value
    levelSettings.block_lebel = value
  }

  const currencyList = reactive<newItemType[]>([])

  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      currencyList.length = 0
      return
    }
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      } as newItemType
      currencyList.push(newItem)
    }
  }
  const currencyTags = computed(() =>
    store.currencyList.map((e) => {
      const label = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]
      const value = e.value
      return { label, value }
    })
  )

  const settlementCycleList = computed(() =>
    Object.values(SETTLEMENT_CYCLE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(SETTLEMENT_CYCLE.I18nKeys[item as keyof typeof SETTLEMENT_CYCLE.I18nKeys]),
        value: item
      }))
      .slice(0, 3)
  )

  const sendTypeList = computed(() =>
    [true, false].map((item) => ({
      label: item ? t("send_type.auto") : t("send_type.manual"),
      value: item
    }))
  )

  const repeatDistributionTypeList = computed(() =>
    [true, false].map((item) => ({
      label: item ? t("repeat_distribution_type.repeat") : t("repeat_distribution_type.not_repeating"),
      value: item
    }))
  )

  const levelUpConditionSinceList = computed(() =>
    Object.values(LEVEL_UP_CONDITION_SINCE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(LEVEL_UP_CONDITION_SINCE.I18nKeys[item as keyof typeof LEVEL_UP_CONDITION_SINCE.I18nKeys]),
        value: item
      }))
  )

  const skipList = computed(() =>
    [true, false].map((item) => ({
      label: item ? t("common.allow_skip") : t("common.disallow_skip"),
      value: item
    }))
  )

  const protectLevelList = computed(() =>
    Object.values(PROTECT_LEVEL.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(PROTECT_LEVEL.I18nKeys[item as keyof typeof PROTECT_LEVEL.I18nKeys]),
        value: item
      }))
  )

  const blockTagList = computed(() =>
    Object.values(BLOCK_TAG.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(BLOCK_TAG.I18nKeys[item as keyof typeof BLOCK_TAG.I18nKeys]),
        value: item
      }))
  )
  //錢包類型
  const bounsDropdownList = computed(() => {
    return numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => {
      const label = t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || "common.unknow"
      return {
        label,
        value: item as number
      }
    })
  })
  const cycleSettings = reactive({
    week: 0,
    month: 0,
    season: 0,
    halfYear: 0
  })

  const { genWeeksStartSun, genMonths } = useCommon()
  const dropdownData = reactive({
    weeks: genWeeksStartSun(),
    months: genMonths()
  })

  function addRatio(num: number) {
    levelSettings.audit_rate = roundTo((levelSettings.audit_rate += num), 2)
  }

  let cacheLevelSettings: Partial<typeof levelSettings> = {}
  function onSettings() {
    cacheLevelSettings = clone(levelSettings)
    allowEdit.value = true
  }

  function onCancel() {
    Object.keys(levelSettings).forEach((column) => {
      ;(levelSettings as any)[column] = clone((cacheLevelSettings as any)[column])
    })
    allowEdit.value = false
  }

  const loading = ref(false)
  /*
  const isValidBettingChecked = computed(() => {
    return levelSettings.promotion_condition === 1
  })

  const isWithdrawAmountChecked = computed(() => {
    return levelSettings.promotion_condition === 2
  })*/
  const updatePromotionCondition = (value: number, isChecked: boolean) => {
    /*if (isChecked) {
        if (!levelSettings.promotion_condition.includes(value)) {
          levelSettings.promotion_condition.push(value)
        }
      } else {
        levelSettings.promotion_condition = levelSettings.promotion_condition.filter((item) => item !== value)
      }*/
    /*if (value === 1) {
      levelSettings.promotion_condition = isChecked ? 1 : 0
    } else if (value === 2) {
      levelSettings.promotion_condition = isChecked ? 2 : 0 // 如果需要更新为 2
    }*/
  }

  const adjustPromotionCondition = (promotionCondition: number[]) => {
    if (Array.isArray(promotionCondition)) {
      // 如果包含 1 和 2，改成 [3]
      if (promotionCondition.includes(1) && promotionCondition.includes(2)) {
        return 3
      }
      // 否則維持原本的排序
      return parseInt(promotionCondition.sort().join(","))
    }
    return promotionCondition // 非陣列時直接返回原值（防呆）
  }
  async function onSave() {
    loading.value = true
    //levelSettings.settlement_week = cycleSettings.week
    const payload = {
      ...levelSettings
    }
    payload.promotion_condition = adjustPromotionCondition(payload.promotion_condition)

    try {
      const { search, status } = useSearch(updateMemberLevelDefaultSettings)
      await search(payload)
      if (status.value) {
        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top",
          timeout: 300
        })
        getLevelSettingsList()
        allowEdit.value = false
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: t("message.edit_fail"),
        position: "top",
        timeout: 300
      })
    } finally {
      loading.value = false
    }
  }

  function getCurrencyValue(dataList: Array<any>, key: string): string {
    const currencyData = dataList.find((item) => item.currency_id === levelSettings.currentCurrency)

    if (currencyData?.[key] === "-1" && ["promotion_bonus", "birthday_bonus"].includes(key)) {
      return ""
    }

    return currencyData ? currencyData[key] : ""
  }

  watchEffect(() => {
    if (!levelSettings.audit_rate || isNaN(levelSettings.audit_rate) || levelSettings.audit_rate < 0) {
      levelSettings.audit_rate = 0
    }
  })
  // 防呆處理函數
  const processPromotionCondition = (condition: string | number) => {
    if (condition === 3) {
      return [1, 2]
    }
    if (typeof condition === "string") {
      // 將逗號分隔的字串轉換為數字陣列
      return condition
        .split(",")
        .map((item) => parseInt(item.trim(), 10)) // 去除空格並轉換為數字
        .filter((item) => !isNaN(item)) // 過濾掉非數字的值
    } else if (typeof condition === "number") {
      // 如果是數字，直接包裝為陣列
      return [condition]
    }
    // 預設為空陣列
    return []
  }
  //取得層級設定
  async function getLevelDefaultSettings() {
    loading.value = true
    const res = await getMemberLevelDefaultSettings()

    if (res?.code === 0) {
      console.log(res.data)

      levelSettings.settlement_type = res.data.settlement_type
      levelSettings.settlement_week = res.data.settlement_week === 0 ? 1 : res.data.settlement_week
      levelSettings.can_skip = res.data.can_skip
      levelSettings.auto_payout = res.data.auto_payout
      levelSettings.is_repeat = res.data.is_repeat
      levelSettings.audit_rate = res.data.audit_rate ? parseFloat(res.data.audit_rate) : 0
      levelSettings.wallet_type = res.data.wallet_type
      levelSettings.promotion_condition = processPromotionCondition(res.data.promotion_condition)
      levelSettings.block_lebel = res.data.block_lebel
      loading.value = false
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }

  //取得列表
  async function getLevelSettingsList() {
    //現金版
    if (!siteStore.isCredit) {
      const res = await getCashLevelSettings({ currency_id: levelSettings.currentCurrency })
      if (res?.code === 0) {
        tableData.value = res.data
      } else {
        $q.notify({
          type: "negative",
          message: res.msg,
          position: "top",
          timeout: 300
        })
      }
    } else {
      await search()
    }
  }

  onMounted(async () => {
    await store.getCurrencyList()

    const currency = parseInt(currencyStore.currentCurrency)
    levelSettings.currentCurrency = currency !== 0 ? currency : store.currencyList[0].value
    //取得上方的層級編輯資料
    if (!siteStore.isCredit) {
      getLevelDefaultSettings()
    }
    getLevelSettingsList()
  })

  // 更新多選邏輯
  const updatePromotionConditions = (condition: number, isChecked: boolean) => {
    if (isChecked) {
      if (!levelSettings.promotion_condition.includes(condition)) {
        levelSettings.promotion_condition.push(condition)
      }
    } else {
      levelSettings.promotion_condition = levelSettings.promotion_condition.filter((item) => item !== condition)
    }
  }

  // 用 computed 轉換為後端所需格式 (逗號分隔字串)
  const promotionCondition = computed({
    get: () => levelSettings.promotion_condition,
    set: (value: number[]) => {
      levelSettings.promotion_condition = value
    }
  })
  function onAdd() {
    memberLevetStore.initMemberLevelItem()
    router.push({
      name: "AddMemberLevelSetting"
    })
  }

  async function onCopy(item: Response.MemberLevelItem) {
    $q.loading.show()
    try {
      const { code, data, msg } = await getMemberLevelSingleDetail(item.id)
      if (code === 0) {
        memberLevetStore.initMemberLevelItem()
        await memberLevetStore.copyMemberLevelItem(data)
        router.push({
          name: "AddMemberLevelSetting"
        })
        $q.loading.hide()
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        $q.loading.hide()
      }
    } catch (error) {
      $q.loading.hide()
    }
  }
  function onEdit(item: Response.MemberLevelItem) {
    router.push({
      name: "EditMemberLevelSetting",
      params: {
        id: item.id
      }
    })
  }

  const dialogConfigs = reactive<{ delete: IDialogConfig }>({
    delete: {
      dialogLabelI18nKey: "common.sure_to_delete_member_level",
      type: DialogType.CONFIRM,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleDelete
    }
  })
  const dialogData = reactive({
    delete: {
      id: 0
    }
  })
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()

  function onDelete(item: Response.MemberLevelItem) {
    dialogData.delete.id = item.id
    openDeleteDialog(item)
  }

  async function handleDelete() {
    openDeleteLoading()

    const { search, status } = useSearch(deleteMemberLevelSettings)
    await search(dialogData.delete.id)
    if (status.value) {
      getLevelSettingsList()
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
    }

    closeDeleteLoading()
    closeDeleteDialog()
  }

  function getDynamicLangValue(data: Response.MemberLevelLangTitle): string {
    if (!data || typeof data !== "object") {
      console.error("Invalid data format:", data) // Log error
      return ""
    }

    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      // Log to check the available keys
      console.log("Available keys in data:", Object.keys(data))
      // If the specific language key is not found, return the first value
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return "N/A" // Default value if no valid key found
  }

  function getDynamicCurrencyValue(data: Response.CurrencyValue) {
    if (!data) return ""

    if ("MYR" in data) {
      return data["MYR"]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key]
      }
    }
    return ""
  }

  function getDynamicCurrencySingleWithdraw(data: Response.SingleWithdrawLimit) {
    if (!data)
      return {
        min: "",
        max: ""
      }

    if ("MYR" in data) {
      return data["MYR"]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key]
      }
    }
    return {
      min: "",
      max: ""
    }
  }

  watch(
    () => currencyStore.currentCurrency,
    (newValue) => {
      if (!newValue) {
        return
      }
      levelSettings.currentCurrency = newValue
    }
  )
</script>

<style lang="scss" scoped>
  :deep(.mask) {
    width: 100%;
    height: 100%;
    display: block;
    background: rgba(0, 0, 0, 0.05);
    cursor: not-allowed;
    z-index: 1;
  }
</style>
