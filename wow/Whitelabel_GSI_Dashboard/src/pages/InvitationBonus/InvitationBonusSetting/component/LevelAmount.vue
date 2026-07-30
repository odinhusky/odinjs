<template>
  <!-- 優惠金額設定 -->
  <q-card-section class="q-pb-xs">
    <div class="text-subtitle2 text-bold q-mb-md">{{ $t("edit_form.tiered_reward_settings") }}</div>

    <q-markup-table no-hover square separator="none" 　class="no-hover">
      <thead class="bg-success">
        <tr>
          <th>{{ $t("edit_form.membership_level") }}</th>
          <th>{{ $t("edit_form.active_member_count") }}</th>
          <th v-for="item in checkCurreny">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lvData, lvKey) in form.levelData" :key="lvKey">
          <td align="center">LV {{ lvData.level }}</td>
          <td>
            <q-number
              v-model="lvData.active_member_count"
              dense
              borderless
              square
              :placeholder="$t('edit_form.please_enter_active_members')"
              :options="optionsLimit2"
              @focus="() => clearActiveIfZero(lvKey)"
              @update:model-value="handleActiveInput(lvKey)"
            />
          </td>
          <td v-for="(item, index) in lvData.rewards" :key="item.currency_id">
            <div class="threshold">
              <q-number
                v-model="item.reward_amount"
                dense
                borderless
                square
                :placeholder="$t('edit_form.please_enter_reward_amount')"
                :options="optionsLimit"
                @focus="() => clearIfZero(lvKey, index, 'reward_amount')"
                @update:model-value="handleInput(lvKey, index, 'condition')"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="d-flex q-pt-md q-pb-lg" style="text-align: center">
      <q-btn outline color="main-color" icon="add" align="center" class="q-mr-md add_btn" @click="addLv"> </q-btn>
      <q-btn outline color="red-6" icon="remove" align="center" class="add_btn" @click="minusLv"> </q-btn>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useInvitationBonusStore } from "@/stores/invitationBonusStore"

  import { computed, onMounted, reactive, ref, watch } from "vue"
  import { storeToRefs } from "pinia"
  import { EVENT_TYPE, CURRENCY_TYPE, PROMOTION_REWARD_TYPE } from "@/utils/constants"
  import { getCurrencyList } from "@/api/common"
  import type * as Request from "@/api/request.type"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const store = useInvitationBonusStore()
  const { invitationBonusItem: form } = storeToRefs(store)

  const optionsLimit = {
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const optionsLimit2 = {
    minimumFractionDigits: "0",
    nullValue: ""
  }
  const optionsParcent = {
    min: 0,
    max: 100,
    minimumFractionDigits: 0,
    nullValue: "0"
  }
  /*const optionsParcent = {
    suffix: "%",
    min: 0,
    max: 100,
    minimumFractionDigits: "0",
    nullValue: "%"
  }*/
  const $q = useQuasar()
  const { t } = useI18n()

  const checkCurreny = ref<CURRENCY_TYPE.Enums[]>([])
  type CurrencyList = { [currency: string]: number }
  const currencyList = ref<CurrencyList>({})

  onMounted(async () => {
    const { data } = await getCurrencyList()

    checkCurreny.value = Object.keys(data) as any as CURRENCY_TYPE.Enums[]

    currencyList.value = data
  })

  const addLv = () => {
    const currencies: { currency_id: number; reward_amount: string }[] = []
    Object.entries(currencyList.value).forEach(([currency, value]) => {
      const rewardObj = {
        currency_id: value,
        reward_amount: ""
      }
      currencies.push(rewardObj)
    })

    form.value.levelData.push({
      level_name: "LV" + (form.value.levelData.length + 1),
      level: form.value.levelData.length + 1,
      active_member_count: "",
      rewards: currencies
    })
  }
  const minusLv = () => {
    if (form.value.levelData.length > 1) {
      form.value.levelData.pop() // 刪除最後一個 lv 對象
    }
  }

  const clearIfZero = (lvKey: number, rewardIndex: number, field: "reward_amount") => {
    const val = form.value.levelData[lvKey].rewards[rewardIndex][field]

    if (val === 0 || val === "0.00") {
      form.value.levelData[lvKey].rewards[rewardIndex][field] = ""
    }
  }
  const clearActiveIfZero = (lvKey: number) => {
    const value = form.value.levelData[lvKey].active_member_count
    if (value === 0 || value === "0") {
      form.value.levelData[lvKey].active_member_count = ""
    }
  }

  const handleInput = (lvKey: number, index: number, field: CurrencyField) => {
    //const inputValue = form.value.levelData[lvKey].currency[index][field]
  }
  const handleActiveInput = (lvKey: number) => {
    const current = form.value.levelData[lvKey]
    const currentValue = Number(current.active_member_count)

    for (let i = lvKey - 1; i >= 0; i--) {
      const prev = form.value.levelData[i]
      const prevValue = Number(prev.active_member_count)

      if (currentValue <= prevValue) {
        $q.notify({
          color: "red",
          message: `${current.level_name}  ${t("error_msg.the_number_active_members_cannot_less")} ${prev.level_name}`,
          position: "top",
          timeout: 1000
        })
        break
      } else {
        continue
      }
    }
  }
</script>

<style lang="scss" scoped>
  .q-markup-table.q-table__container {
    thead {
      tr {
        th {
          border: none !important;
          text-align: center;
          padding: 0;
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 0 !important;
          border-right: none !important;
          border-bottom: 1px solid #666 !important;
          background-color: #fff !important;

          ::v-deep(.q-field__control) {
            &::before {
              border: 0 !important;
            }
          }
          ::v-deep(input.q-field__input) {
            text-align: center;
          }
        }
      }
    }
  }

  ::v-deep(.q-markup-table) {
    tbody {
      tr {
        td {
          &::before {
            background-color: transparent !important;
            transition: none !important;
          }
        }
      }
    }
  }
</style>
