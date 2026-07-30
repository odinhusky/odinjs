<template>
  <q-card class="no-shadow bg-transparent">
    <q-card-section align="center" style="max-width: 43.75rem" class="q-mx-auto">
      <!--現金版-->
      <div class="row q-col-gutter-md" v-if="!siteStore.isCredit">
        <!-- 晉級設置 -->
        <div class="col-12 q-mb-md">
          <div class="text-bold q-mb-md text-left">{{ $t("common.promotion_settings") }}</div>
          <div class="row items-center">
            <div class="text-bold q-mb-md text-left">{{ $t("table_header.promotion_calculation_method") }}</div>
            <q-option-group v-model="form.promotion_type" :options="levelUpTags" color="primary" class="row q-mb-md" />
          </div>
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th rowspan="2">{{ $t("table_header.currency") }}</th>
                <th colspan="2">{{ $t("table_header.level_up_condition") }}</th>
                <th colspan="2">{{ $t("table_header.level_up_offer") }}</th>
              </tr>
              <tr>
                <th>{{ $t("table_header.validate_bet") }}</th>
                <th>{{ $t("table_header.deposit_amount") }}</th>
                <th>{{ $t("table_header.level_up_reward") }}</th>
                <th>{{ $t("table_header.birthday_reward") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in queryStore.currencyList" :key="index">
                <!-- 幣別 -->
                <td>
                  {{ $t(item.label) }}
                </td>

                <!-- 有效投注 -->
                <td key="valid_betting">
                  <q-number
                    v-model.number="form.valid_bet_amount[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="generalOptions"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.please_enter_content')"
                    class="default-input"
                  />
                </td>

                <!-- 存款金額 -->
                <td key="deposit_amount">
                  <q-number
                    v-model.number="form.deposit_amount[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="generalOptions"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.please_enter_content')"
                    class="default-input"
                  />
                </td>

                <!-- 晉級禮金 -->
                <q-td key="level_up_reward">
                  <q-number
                    v-model="form.promotion_bonus[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="optionsLimit"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.no_statistics')"
                    class="default-input"
                  />
                </q-td>

                <!-- 生日禮金 -->
                <q-td key="birthday_reward">
                  <q-number
                    v-model="form.birthday_bonus[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="optionsLimit"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.no_statistics')"
                    class="default-input"
                  />
                </q-td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <!-- <div class="col-12 q-mb-md">
          <div class="text-bold q-mb-md text-left">{{ $t("table_header.gift_money_settings") }}</div>
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th rowspan="2">{{ $t("table_header.currency") }}</th>
                <th colspan="2">{{ $t("table_header.level_up_offer") }}</th>
              </tr>
              <tr>
                <th>{{ $t("table_header.level_up_reward") }}</th>
                <th>{{ $t("table_header.birthday_reward") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in queryStore.currencyList" :key="index">
                幣別
                <td>
                  {{ $t(item.label) }}
                </td>

                晉級禮金
                <q-td key="level_up_reward">
                  <q-number
                    v-model="form.promotion_bonus[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="optionsLimit"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.no_statistics')"
                  />
                </q-td>

                生日禮金
                <q-td key="birthday_reward">
                  <q-number
                    v-model="form.birthday_bonus[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="optionsLimit"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.no_statistics')"
                  />
                </q-td>
              </tr>
            </tbody>
          </q-markup-table>
        </div> -->
      </div>
      <!--信用版-->
      <div class="row q-col-gutter-md" v-else>
        <!-- 晉級設置 -->
        <div class="col-12 q-mb-md">
          <div class="text-bold q-mb-md text-left">{{ $t("common.promotion_settings") }}</div>
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th rowspan="2">{{ $t("table_header.currency") }}</th>
                <th colspan="2">{{ $t("table_header.level_up_condition") }}</th>
              </tr>
              <tr>
                <th>{{ $t("table_header.validate_bet") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in queryStore.currencyList" :key="index">
                <!-- 幣別 -->
                <td>
                  {{ $t(item.label) }}
                </td>
                <!-- 有效投注 -->
                <td key="valid_betting">
                  <q-number
                    v-model.number="form.valid_bet_amount[ CURRENCY_TYPE.Enums[item.value as CURRENCY_TYPE.Enums]]"
                    :options="generalOptions"
                    outlined
                    dense
                    hide-bottom-space
                    outline
                    borderless
                    :placeholder="$t('common.please_enter_content')"
                    class="default-input"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)" class="edit_btns">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md edit_btns" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { storeToRefs } from "pinia"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"
  import { useMemberLevelStore } from "@/stores/memberLevel"
  import { addMemberLevelSettings } from "@/api/memberLevel"
  import { useStepper } from "@/hook/useStepper"
  import { useCommon } from "@/hook/useCommon"
  import { LEVEL_UP_TYPE } from "@/utils/constants"
  import type * as Request from "@/api/request.type"
  import { useSiteStore } from "@/stores/siteStore"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { useSearch } from "@/hook/useSearch"

  const { nextPrevStep } = useStepper()
  const queryStore = useQueryStore()
  const memberLevelStore = useMemberLevelStore()
  const { memberLevelItem: form } = storeToRefs(memberLevelStore)
  const { t } = useI18n()
  const $q = useQuasar()
  const { objectFilterEmptyValues } = useCommon()
  const siteStore = useSiteStore()

  const generalOptions = {
    min: 0,
    precision: "0",
    nullValue: "0"
  }
  const optionsLimit = {
    nullValue: ""
  }

  const levelUpTags = computed(() =>
    Object.values(LEVEL_UP_TYPE.Enums)
      .filter((v) => !isNaN(Number(v)))
      .map((item) => ({
        label: t(LEVEL_UP_TYPE.I18nKeys[item as keyof typeof LEVEL_UP_TYPE.I18nKeys]),
        value: item
      }))
  )

  const validateAmounts = (payload: {
    [key: string]: {
      deposit_amount?: string | number
      valid_bet_amount?: string | number
    }
  }): boolean => {
    for (const [currency, values] of Object.entries(payload)) {
      for (const [key, value] of Object.entries(values)) {
        if (Number(value) === 0) {
          $q.notify({
            type: "negative",
            message: `${t("error_msg.the_amount_greater_than_0")} (${currency})`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }
    return true
  }
  const validateRewardAmount = (payload: {
    [key: string]: {
      promotion_bonus?: string | number
      birthday_bonus?: string | number
    }
  }): boolean => {
    for (const [currency, values] of Object.entries(payload)) {
      for (const [key, value] of Object.entries(values)) {
        if (Number(value) === 0) {
          $q.notify({
            type: "negative",
            message: `${t("error_msg.the_amount_greater_than_0")} (${currency})`,
            position: "top",
            timeout: 1000
          })
          return false
        }
      }
    }
    return true
  }
  async function onSubmit() {
    let payload: Request.AddMemberLevel = {
      img: form.value.img,
      titles: objectFilterEmptyValues(form.value.titles) as any,
      remark: form.value.remark,
      // 晉級計算方式
      promotion_type: form.value.promotion_type,
      // 每日取款次數
      withdraw_count: form.value.withdraw_count,
      condition: {},
      reward: {}
    }

    if (!siteStore.isCredit) {
      Object.keys(form.value.deposit_amount).forEach((currency) => {
        payload.condition[currency] = {
          deposit_amount: parseInt(form.value.deposit_amount[currency] as string) || 0,
          valid_bet_amount: parseInt(form.value.valid_bet_amount[currency] as string) || 0
        }
      })
      // 晉級設置
      Object.keys(form.value.promotion_bonus).forEach((currency) => {
        payload.reward[currency] = {
          promotion_bonus:
            form.value.promotion_bonus[currency] === "" ? -1 : parseInt(form.value.promotion_bonus[currency] as string),
          birthday_bonus:
            form.value.birthday_bonus[currency] === "" ? -1 : parseInt(form.value.birthday_bonus[currency] as string)
        }
      })
      //判斷輸入金額
      const isValid = validateAmounts(payload.condition)
      //const isValid2 = validateRewardAmount(payload.reward)
      //if (!isValid || !isValid2) {
      if (!isValid) {
        return
      }
    } else {
      //信用版
      Object.keys(form.value.valid_bet_amount).forEach((currency) => {
        payload.condition[currency] = {
          deposit_amount: parseInt(form.value.valid_bet_amount[currency] as string) || 0,
          valid_bet_amount: parseInt(form.value.valid_bet_amount[currency] as string) || 0
        }
      })
      //判斷輸入金額
      const isValid = validateAmounts(payload.condition)

      if (!isValid) {
        return
      }
    }

    console.log(payload)

    // 輸出結果
    const { search, status } = useSearch(addMemberLevelSettings)
    await search(payload)

    if (status.value) {
      nextPrevStep(true)
    }
  }
</script>
<style lang="scss" scoped></style>
