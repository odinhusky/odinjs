<template>
  <q-card-section class="q-pb-xs q-pt-none">
    <div class="row">
      <div class="col-12">
        <div class="bold h4-bold grey q-pb-sm">{{ $t("edit_form.active_commission_setting") }}</div>
        <div class="edit_area_bg p-3">
          <q-markup-table square separator="none">
            <thead class="bg-success">
              <tr>
                <th>
                  {{ $t("edit_form.active_level") }}
                </th>
                <th>
                  {{ $t("edit_form.total_active_members") }}
                </th>
                <th>
                  {{ $t("edit_form.maximum_commission_rate") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lvData, lvKey) in form.levelData" :key="lvKey">
                <td align="right" style="padding-right: 5px">Lv{{ lvKey + 1 }}</td>
                <td>
                  <div class="input_parcent">
                    <q-number
                      v-model.number="lvData.required_members"
                      dense
                      borderless
                      square
                      :options="optionsParcent"
                      @update:model-value="handleInput(lvKey, 'required_members')"
                      @focus="clearIfZero(lvData, 'required_members')"
                    />
                  </div>
                </td>
                <td>
                  <div class="input_parcent">
                    <q-number
                      v-model="lvData.rate"
                      dense
                      borderless
                      square
                      :options="optionsParcent"
                      @blur="handleInput(lvKey, 'rate')"
                      @focus="clearIfZero(lvData, 'rate')"
                      style="width: 70%"
                    />
                    <span> / {{ form.rate_base }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <div class="d-flex q-pt-md q-pb-sm" style="justify-content: center">
            <q-btn outline color="main-color" icon="add" align="center" class="q-mr-md add_btn" @click="addLv"> </q-btn>
            <q-btn outline color="red-6" icon="remove" align="center" class="add_btn" @click="minusLv"> </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
  import { useShareholderProxyStore } from "@/stores/shareholderProxyStore"

  import { onMounted, ref } from "vue"
  import { storeToRefs } from "pinia"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  const shareholderProxyStore = useShareholderProxyStore()
  const { proxyItem: form } = storeToRefs(shareholderProxyStore)

  const generalOptions = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }

  const optionsLimit = {
    minimumFractionDigits: "2",
    nullValue: ""
  }
  const optionsParcent = {
    min: 0,
    minimumFractionDigits: "2",
    nullValue: ""
  }

  const $q = useQuasar()
  const { t } = useI18n()

  onMounted(() => {
    // 防呆：如果是空陣列，新增一筆預設數據
    if (form.value.active_levels.length === 0) {
      form.value.active_levels.push({
        level: form.value.active_levels.length + 1,
        required_members: 0,
        rate: "0"
      })
    }
    form.value.levelData = form.value.active_levels
    /*const result = form.value.rebate_settings.map((item) => {

      return updatedItem
    })

    form.value.levelData = result*/
  })

  const addLv = () => {
    form.value.levelData.push({ level: form.value.levelData.length + 1, required_members: 0, rate: "0" })
  }
  const minusLv = () => {
    if (form.value.levelData.length > 1) {
      form.value.levelData.pop() // 刪除最後一個 lv 對象
    }
  }
  type CurrencyField = "required_members" | "rate"

  const clearIfZero = (item: any, field: CurrencyField) => {
    if (item[field] <= 0) {
      item[field] = ""
    }
  }
  const handleInput = (lvKey: number, field: CurrencyField) => {
    if (Number(form.value.levelData[lvKey].rate) > form.value.rate_base) {
      form.value.levelData[lvKey].rate = form.value.rate_base
    }

    for (let i = 1; i < form.value.levelData.length; i++) {
      const prev = form.value.levelData[i - 1]
      const curr = form.value.levelData[i]

      if (Number(curr.required_members) <= Number(prev.required_members) && field === "required_members") {
        $q.notify({
          color: "red",
          message: `LV${i + 1}  ${t("edit_form.active_member_count")}${t("error_msg.cannot_less_than_equa")}  LV${i}`,
          position: "top",
          timeout: 1000
        })
        return false
      }

      if (Number(curr.rate) <= Number(prev.rate) && field === "rate") {
        $q.notify({
          color: "red",
          message: `LV${i + 1}  ${t("edit_form.commission_rate")}${t("error_msg.cannot_less_than_equa")}  LV${i}`,
          position: "top",
          timeout: 1000
        })
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/setting.scss";
</style>
