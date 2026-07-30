<template>
  <q-card-section class="q-pb-xs">
    <div class="bold h4-bold grey q-pb-sm">{{ $t("edit_form.active_member_condition") }}</div>
    <div class="h7-bold grey q-pb-xs">
      {{ $t("edit_form.active_member_condition_tip") }}
    </div>
    <div class="edit_area_bg p-3">
      <q-markup-table square separator="none">
        <thead class="bg-success">
          <tr>
            <th></th>
            <th v-for="item in form.metrics" :key="item.currency_id">
              {{ item.currency_code }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 累積存款 -->
          <tr>
            <td>{{ $t("edit_form.accumulated_deposit") }}</td>
            <td v-for="item in form.metrics" :key="item.currency_id + '-deposit'">
              <q-number
                v-model="item.total_deposit"
                :options="generalOptions"
                dense
                borderless
                square
                @focus="clearIfZero(item, 'total_deposit')"
              />
            </td>
          </tr>

          <!-- 累積有效投注 -->
          <tr>
            <td>{{ $t("edit_form.accumulated_valid_bet") }}</td>
            <td v-for="item in form.metrics" :key="item.currency_id + '-valid_bet'">
              <q-number
                v-model="item.total_valid_bet"
                :options="generalOptions"
                dense
                borderless
                square
                @focus="clearIfZero(item, 'total_valid_bet')"
              />
            </td>
          </tr>

          <!-- 佣金派發上限 -->
          <tr>
            <td>{{ $t("edit_form.commission_payout_cap") }}</td>
            <td v-for="item in form.metrics" :key="item.currency_id + '-commission_cap'">
              <q-number
                v-model="item.commission_cap"
                :options="generalOptions"
                dense
                borderless
                square
                @focus="clearIfZero(item, 'commission_cap')"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-card-section>
  <q-card-section class="q-pb-xs">
    <div class="row q-col-gutter-md">
      <div class="col-12 q-mb-md">
        <div class="bold h4-bold grey q-pb-sm">{{ $t("edit_form.shareholder_commission_setting") }}</div>
        <div class="edit_area_bg p-3">
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th>
                  {{ $t("edit_form.starting_commission_shareholder") }}
                </th>
                <th>
                  {{ $t("edit_form.decreases_each_level") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="input_parcent">
                    <q-number
                      v-model="form.base_rate"
                      :options="optionsParcent"
                      dense
                      borderless
                      square
                      @focus="clearIfZero(form, 'base_rate')"
                      @blur="handleInput('base_rate')"
                      style="width: 70%"
                    />
                    <span> / {{ form.rate_base }}</span>
                  </div>
                </td>
                <td>
                  <div class="input_parcent">
                    <q-number
                      v-model="form.rate_decay"
                      :options="optionsParcent"
                      dense
                      borderless
                      square
                      @focus="clearIfZero(form, 'rate_decay')"
                      @blur="handleInput('rate_decay')"
                      style="width: 70%"
                    />
                    <span> / {{ form.rate_base }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useShareholderProxyStore } from "@/stores/shareholderProxyStore"
  import { storeToRefs } from "pinia"
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CURRENCY_TYPE } from "@/utils/constants"

  const shareholderProxyStore = useShareholderProxyStore()
  const { proxyItem: form } = storeToRefs(shareholderProxyStore)
  const { t } = useI18n()
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }

  const optionsParcent = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const clearIfZero = (item: any, key: string) => {
    if (item[key] <= 0) {
      item[key] = ""
    }
  }
  type Field = "base_rate" | "rate_decay"

  const handleInput = (field: Field) => {
    if (Number(form.value[field]) > form.value.rate_base) {
      form.value[field] = form.value.rate_base
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/setting.scss";
</style>
