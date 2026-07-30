<template>
  <q-card-section class="q-pb-xs">
    <div class="q-mt-md q-mb-md d-flex">
      <!-- 新會員有效投注額條件 -->
      <div style="padding-top: 0.625rem">{{ $t("edit_form.new_member_valid_bet_amount") }}</div>
    </div>
    <q-markup-table square separator="none">
      <thead class="bg-success">
        <tr>
          <th v-for="item in form.active_member_settings" :key="item.currency_id">
            {{ item.currency_code }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="item in form.active_member_settings" :key="item.currency_id">
            <q-number
              v-model="item.valid_bet_amount"
              :options="generalOptions"
              dense
              borderless
              square
              @focus="clearIfZero(item)"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useCollaborationStore } from "@/stores/collaborationStore"
  import { storeToRefs } from "pinia"
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"

  const collaborationStore = useCollaborationStore()
  const { collaborationItem: form } = storeToRefs(collaborationStore)
  const { t } = useI18n()
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const clearIfZero = (item: any) => {
    if (item.valid_bet_amount <= 0) {
      item.valid_bet_amount = ""
    }
  }
</script>

<style lang="scss" scoped>
  .q-markup-table {
    overflow-x: auto;
    ::v-deep(.q-table) {
      width: 100%;
    }
  }
  .q-markup-table.q-table__container {
    thead {
      tr {
        th {
          border: none !important;
          text-align: end;
          padding: 0;
          padding-right: 5px;
          min-width: 150px;
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
  .d-flex {
    display: flex;
    align-items: center;
  }
</style>
