<template>
  <q-card-section class="edit_area_bg p-3 q-mb-md q-ma-md">
    <div class="text-subtitle2 text-bold">{{ $t("edit_form.single_deposit_threshold") }}</div>
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
              v-model="item.condition"
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
  import { usePromotionStore } from "@/stores/promotionStore"
  import { storeToRefs } from "pinia"

  const promotionStore = usePromotionStore()
  const { promotionItem: form } = storeToRefs(promotionStore)
  console.log("form", form.value)
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const clearIfZero = (item: any) => {
    if (item.condition <= 0) {
      item.condition = ""
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
