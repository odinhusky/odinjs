<template>
  <!-- 優惠金額設定 -->
  <q-card-section class="edit_area_bg p-3 q-ma-md">
    <div class="text-subtitle2 text-bold">{{ $t("edit_form.siscount_amount_setting") }}</div>
    <!-- 固定金額 -->
    <q-radio
      v-model="form.rewardType"
      :val="PROMOTION_REWARD_TYPE.Enums.FixedAmount"
      :label="$t('edit_form.fixed_amount')"
    />
    <q-markup-table square separator="none">
      <thead class="bg-success">
        <tr>
          <th v-for="item in form.reward" :key="item.currency">{{ item.currency }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="item in form.reward" :key="item.currency">
            <q-number
              v-model="item.amount"
              :options="optionsLimit"
              dense
              borderless
              square
              @focus="clearIfZero(item)"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <!-- 依倍率計算 -->
    <q-radio
      v-model="form.rewardType"
      :val="PROMOTION_REWARD_TYPE.Enums.Magnification"
      :label="$t('edit_form.calculated_based_on_magnification')"
    />
    <q-markup-table square separator="none">
      <thead class="bg-success">
        <tr>
          <th width="80px"></th>
          <th v-for="item in form.reward" :key="item.currency">{{ item.currency }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t("edit_form.magnification") }}</td>
          <td v-for="item in form.reward" :key="item.currency">
            <q-number v-model="item.amount" :options="optionsLimit" dense borderless square @focus="clearIfZero(item)">
              <template v-slot:append> % </template>
            </q-number>
          </td>
        </tr>
        <tr>
          <td>{{ $t("edit_form.upper_limit") }}</td>
          <td v-for="item in form.reward" :key="item.currency">
            <q-number
              v-model="item.limit"
              :options="optionsLimit"
              dense
              borderless
              square
              :placeholder="$t('edit_form.max_input_placeholder')"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"
  import { EVENT_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"

  const store = usePromotionStore()
  const { promotionItem: form } = storeToRefs(store)
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: 0
  }
  const optionsLimit = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const optionsParcent = {
    suffix: "%",
    min: 0,
    max: 100,
    minimumFractionDigits: "2",
    nullValue: 0
  }
  const clearIfZero = (item: { amount: any }) => {
    if (item.amount <= 0) {
      item.amount = ""
    }
  }
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
    thead {
      tr {
        th {
          border: none !important;
          text-align: end;
          padding: 0;
          padding-right: 5px;
        }
      }
    }

    tbody {
      tr {
        &:hover {
          background-color: #fff !important;
        }
        background-color: #fff !important;
        td {
          padding: 0 !important;
          border-right: none !important;
          border-bottom: 1px solid #666 !important;

          ::v-deep(.q-field__control) {
            &::before {
              border: 0 !important;
            }
            padding-right: 5px;
          }
          ::v-deep(input.q-field__input) {
            text-align: end;
          }
        }
      }
    }
  }
</style>
