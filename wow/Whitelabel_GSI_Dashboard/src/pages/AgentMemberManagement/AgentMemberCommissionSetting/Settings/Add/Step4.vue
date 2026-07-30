<template>
  <q-card class="no-shadow bg-transparent">
    <q-card-section align="center" class="q-pt-lg q-pb-lg">
      <div class="text-bold row items-baseline q-mb-md">
        <div class="col-12">
          <div class="text-subtitle2 text-bold q-pb-lg">{{ $t("edit_form.commission_ratio_setting") }}</div>
          <div class="d-flex">
            <span class="q-ml-md">{{ $t("edit_form.quick_settings") }}</span>
            <q-btn
              v-for="item in lvList"
              :key="item.value"
              :outline="item.value !== form.lv"
              color="main-color"
              class="b-radius q-mr-md"
              :class="{ 'bg-main-color': item.value === form.lv }"
              @click="setLv(item.value)"
            >
              {{ item.label }}
            </q-btn>
            <div class="row items-center no-wrap audit-multiple-container audit-multiple-bottom">
              <q-btn
                size="md"
                square
                flat
                @click="form.audit_multiple_lv ? (form.audit_multiple_lv -= auditMultipleStep) : 0"
                >-</q-btn
              >
              <q-number
                v-model="form.audit_multiple_lv"
                :options="generalOptions"
                dense
                borderless
                square
                class="audit-multiple"
              />
              <q-btn size="md" square flat @click="form.audit_multiple_lv += auditMultipleStep">+</q-btn>
            </div>
            <q-btn outline color="main-color" class="q-mr-md">
              {{ $t("btn.settings") }}
            </q-btn>
          </div>
          <div class="q-pt-md q-ml-md d-flex" style="justify-content: space-between">
            <div>
              <q-btn
                v-for="item in filteredGameTypeDropdownList"
                :key="item.value"
                :outline="item.value !== form.game_type"
                color="main-color"
                class="b-radius q-mr-md"
                :class="{ 'bg-main-color': item.value === form.game_type }"
                @click="setGameType(item.value)"
              >
                {{ item.label }}
              </q-btn>
            </div>
            <!--<div class="d-flex">
              <span class="q-mr-md">{{ $t("common.apply_to_other_categories") }}</span>
              <q-select
                v-model="form.other_type"
                :options="otherList"
                map-options
                dense
                outlined
                style="width: 165px"
              />
              <q-btn outline color="main-color" class="b-radius q-mr-md">
                {{ $t("btn.apply") }}
              </q-btn>
            </div>-->
          </div>
        </div>
        <!--col end-->
        <div class="col-12">
          <q-card-section class="q-pb-xs">
            <q-markup-table square separator="none">
              <thead class="bg-success">
                <tr>
                  <th width="80px">{{ $t("common.offline") }}</th>
                  <th v-for="item in currencyList" :key="item">{{ item }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lvData, lvKey) in form.lv_settings" :key="lvKey">
                  <td>{{ lvData.lv }}</td>
                  <td v-for="(currencyData, currencyKey) in lvData.currencies" :key="currencyKey">
                    <q-number v-model="currencyData.multiple" :options="optionsParcent" dense borderless square />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <div class="d-flex q-pt-md q-pb-lg">
              <q-btn outline color="main-color" icon="add" align="center" class="q-mr-md add_btn" @click="addLv">
              </q-btn>
              <q-btn outline color="red-6" icon="remove" align="center" class="add_btn" @click="minusLv"> </q-btn>
            </div>
          </q-card-section>
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, computed } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import type { CurrencyAmount } from "@/api/response.type"
  import { genEnumToDropdown } from "@/stores/queryStore"
  import { Enums } from "@/utils/constants/gameType"
  import { GAME_TYPE } from "@/utils/constants"
  import { useI18n } from "vue-i18n"

  const { nextPrevStep } = useStepper()
  const { t } = useI18n()

  const form = reactive({
    game_type: 1,
    lv: 1,
    audit_multiple_lv: 1,
    other_type: 1,
    lv_settings: [
      {
        lv: "lv1",
        currencies: [
          { name: "PHP", multiple: 0 },
          { name: "KVND", multiple: 0 },
          { name: "SGD", multiple: 0 },
          { name: "MYR", multiple: 0 },
          { name: "CNY", multiple: 0 },
          { name: "THB", multiple: 0 },
          { name: "USD", multiple: 0 },
          { name: "KRW", multiple: 0 },
          { name: "HKD", multiple: 0 },
          { name: "IDR", multiple: 0 }
        ]
      },
      {
        lv: "lv2",
        currencies: [
          { name: "PHP", multiple: 0 },
          { name: "KVND", multiple: 0 },
          { name: "SGD", multiple: 0 },
          { name: "MYR", multiple: 0 },
          { name: "CNY", multiple: 0 },
          { name: "THB", multiple: 0 },
          { name: "USD", multiple: 0 },
          { name: "KRW", multiple: 0 },
          { name: "HKD", multiple: 0 },
          { name: "IDR", multiple: 0 }
        ]
      }
    ]
  })
  // 稽核倍數
  const auditMultipleStep = 0.01
  const lvList = computed(() => [
    {
      label: "Lv1",
      value: 1
    },
    {
      label: "Lv2",
      value: 2
    },
    {
      label: "Lv3",
      value: 3
    },
    {
      label: "Lv4",
      value: 4
    },
    {
      label: "Lv5",
      value: 5
    },
    {
      label: "Lv6",
      value: 6
    },
    {
      label: "Lv7",
      value: 7
    },
    {
      label: "Lv8",
      value: 8
    },
    {
      label: "Lv9",
      value: 9
    },
    {
      label: "Lv10",
      value: 10
    }
  ])
  const otherList = computed(() => [
    {
      label: "p2p",
      value: 1
    },
    {
      label: "c2c",
      value: 2
    }
  ])
  type currencyKeys = keyof CurrencyAmount<undefined>
  const currencyList: currencyKeys[] = ["PHP", "KVND", "SGD", "MYR", "CNY", "THB", "USD", "KRW", "HKD", "IDR"]
  const currencyTags = computed(() =>
    currencyList.map((e) => {
      const label = e
      const value = e
      return { label, value }
    })
  )
  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2"
  }
  const optionsParcent = {
    suffix: "%",
    min: 0,
    max: 100,
    minimumFractionDigits: "2"
  }
  const setLv = (value: number) => {
    form.lv = value
  }
  const setGameType = (value: number) => {
    form.game_type = value
  }
  const gameTypeDropdownList = genEnumToDropdown(Enums, GAME_TYPE.I18nKeys).map((e) => {
    e.label = t(e.label)
    return e
  })
  const filteredGameTypeDropdownList = computed(() => {
    return gameTypeDropdownList.filter((item) => item.value !== 0)
  })
  const addLv = () => {
    form.lv_settings.push({
      lv: "lv" + (form.lv_settings.length + 1),
      currencies: [
        { name: "PHP", multiple: 0 },
        { name: "KVND", multiple: 0 },
        { name: "SGD", multiple: 0 },
        { name: "MYR", multiple: 0 },
        { name: "CNY", multiple: 0 },
        { name: "THB", multiple: 0 },
        { name: "USD", multiple: 0 },
        { name: "KRW", multiple: 0 },
        { name: "HKD", multiple: 0 },
        { name: "IDR", multiple: 0 }
      ]
    })
  }
  const minusLv = () => {
    if (form.lv_settings.length > 0) {
      form.lv_settings.pop() // 刪除最後一個 lv 對象
    }
  }
  onMounted(() => {})

  function onSubmit() {
    // 檢查欄位規則，不符合則return掉

    nextPrevStep(true)
  }
</script>
<style lang="scss" scoped>
  .d-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }

  .direction {
    flex-direction: row !important;
    align-items: center !important;
  }

  .d-center {
    display: flex;
    justify-content: flex-start;
  }
  .audit-multiple-container {
    width: 50%;
    border: 1px solid #999;
    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
  .audit-multiple-bottom {
    width: 150px;
  }
  .add_btn {
    width: 50%;
  }
  .b-radius {
    border-radius: 20px;
    padding: 0px 18px;
  }
  .q-markup-table.q-table__container {
    border-radius: 15px 15px 0 0;
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
          /* border-bottom: 1px solid #666 !important;*/
          text-align: end;
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
