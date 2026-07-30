<template>
  <q-card-section class="q-pb-xs">
    <div class="row q-col-gutter-md">
      <!-- 活躍會員 -->
      <div class="col-12 q-mb-md">
        <div class="text-bold q-mb-md text-left">
          {{ $t("edit_form.active_member_completion_method") }}

          <q-icon name="info" color="purple" size="20px" class="q-ml-xs">
            <q-tooltip anchor="center right" self="center left" class="bg-white text-body2 text-black shadow-4">
              {{ $t("edit_form.single_qualifies") }}
            </q-tooltip>
          </q-icon>
        </div>
        <q-markup-table square separator="none">
          <thead class="bg-success">
            <tr>
              <th rowspan="2">{{ $t("table_header.currency") }}</th>
              <th colspan="2" align="center">{{ $t("edit_form.active_criteria") }}</th>
            </tr>
            <tr>
              <th>{{ $t("table_header.validate_bet") }}</th>
              <th>{{ $t("table_header.deposit_amount") }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in queryStore.currencyList" :key="index">
              <!-- 幣別 -->
              <td>
                {{ $t(item.label) }}
              </td>

              <!-- valid_bet -->
              <td key="valid_bet">
                <q-number
                  v-model="getMetric(item.value).valid_bet"
                  :options="optionsLimit"
                  dense
                  borderless
                  square
                  :placeholder="$t('edit_form.max_input_placeholder')"
                  style="width: 80%; margin: 0 auto"
                  @focus="clearIfZero(item, 'valid_bet')"
                />
              </td>

              <!-- deposit -->
              <td key="deposit">
                <!--<q-number
                  v-model="getMetric(item.value).deposit"
                  :options="optionsLimit"
                  outlined
                  dense
                  hide-bottom-space
                  outline
                  borderless
                  :placeholder="$t('common.no_statistics')"
                  style="width: 80%; margin: 0 auto"
                  @focus="clearIfZero(item, 'deposit')"
                />-->
                <q-number
                  v-model="getMetric(item.value).deposit"
                  :options="optionsLimit"
                  dense
                  borderless
                  square
                  :placeholder="$t('edit_form.max_input_placeholder')"
                  style="width: 80%; margin: 0 auto"
                  @focus="clearIfZero(item, 'deposit')"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"
  import { storeToRefs } from "pinia"
  import { onMounted } from "vue"
  import { useQueryStore } from "@/stores/queryStore"

  const store = useInvitationBonusStore()
  const queryStore = useQueryStore()
  const { invitationBonusItem: form } = storeToRefs(store)

  const optionsLimit = {
    min: 0.0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const getMetric = (currencyId: number) => {
    return form.value.metrics.find((m) => m.currency_id === currencyId) || {}
  }

  type Field = "valid_bet" | "deposit"
  const clearIfZero = (item: any, field: Field) => {
    const metric = form.value.metrics.find((m) => m.currency_id === item.value)
    if (!metric) return

    if (metric[field] <= 0) {
      metric[field] = ""
    }
  }
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
    thead {
      tr {
        th {
          padding: 0;
          padding-right: 5px;
          border-bottom: white 1px solid;
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
          height: 50px !important;
          //border-right: none !important;
          border-right: 1px solid #fff !important;
          text-align: center;
          ::v-deep(.q-field__control) {
            padding-right: 5px;
          }
          ::v-deep(input.q-field__input) {
            text-align: end;
          }
        }
      }
    }
  }
  .tooltip {
    background-color: #fff;
    background: #fff;
  }
</style>
