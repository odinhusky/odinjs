<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start q-gutter-xs top_control_bar" v-if="permission.edit">
          <q-btn class="btn-purple q-ml-sm q-mt-sm" outline @click="batchSwitchSelected(true)">
            {{ $t("btn.batch_open") }}
          </q-btn>
          <q-btn class="btn-purple q-ml-sm q-mt-sm" outline @click="batchSwitchSelected(false)">
            {{ $t("btn.batch_close") }}
          </q-btn>
        </div>
        <q-table
          v-model:selected="selected"
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          row-key="id"
          table-header-class="bg-success"
          selection="multiple"
        >
          <template #body-cell-product="props">
            <q-td :props="props">
              {{ props.row.product_name }}
            </q-td>
          </template>
          <template #body-cell-game_code="props">
            <q-td :props="props">
              {{ props.row.code }}
            </q-td>
          </template>
          <template #body-cell-game_name="props">
            <q-td :props="props">
              {{ props.row.name }}
            </q-td>
          </template>

          <!-- New Hot toggle column -->
          <template #body-cell-hot="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.hot"
                color="red"
                :false-value="0"
                :true-value="1"
                :disable="!permission.edit"
                @update:model-value="updateGameHotStatus($event, [props.row.id])"
              />
            </q-td>
          </template>

          <!-- New New toggle column -->
          <template #body-cell-new="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.newly"
                color="blue"
                :false-value="0"
                :true-value="1"
                :disable="!permission.edit"
                @update:model-value="updateGameNewStatus($event, [props.row.id])"
              />
            </q-td>
          </template>

          <!-- Existing Personnel Switch toggle -->
          <template #body-cell-personnel_switch="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.status"
                color="green"
                :false-value="0"
                :true-value="1"
                :disable="!permission.edit"
                @update:model-value="updateGameStatus($event, [props.row.id])"
              />
            </q-td>
          </template>

          <!-- No data message -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useQueryStore } from "@/stores/queryStore"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getGameList, setGameStstus, setGameHot, setGameNewly, updateGameSort } from "@/api/game"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { useEnv } from "src/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"
  import { VueDraggableNext } from "vue-draggable-next"

  const { permission } = usePermission()
  const $q = useQuasar()
  const { t } = useI18n()
  const selected = ref<Response.GetProductGameSetting[]>([])
  let { isAgentMode } = useEnv()
  const queryStore = useQueryStore()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useGameCodeName: true,
      useGameType: true,
      useKeyword: true
    }

    return baseConfig
  })

  const { search, tableData, totalSize } = useSearch(getGameList)

  let catchQueryForm: Request.GetGameList
  async function onSubmit(queryForm: Request.GetGameList) {
    catchQueryForm = queryForm
    await search(queryForm)
    selected.value.length = 0
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    // { name: "id", label: t("table_header.sequence"), field: "id", sortable: false, align: "left" },

    {
      name: "product",
      label: t("table_header.product"),
      field: "product",
      sortable: false,
      align: "center"
    },
    {
      name: "game_code",
      label: t("table_header.game_code"),
      field: "game_code",
      sortable: false,
      align: "center"
    },
    {
      name: "game_name",
      label: t("table_header.game_name"),
      field: "game_name",
      sortable: false,
      align: "center"
    },
    {
      name: "hot",
      label: t("table_header.hot"),
      field: "hot",
      sortable: false,
      align: "center"
    },
    {
      name: "new",
      label: t("table_header.new"),
      field: "new",
      sortable: false,
      align: "center"
    },
    {
      name: "personnel_switch",
      label: t("table_header.personnel_switch"),
      field: "personnel_switch",
      sortable: false,
      align: "center"
    }
  ])

  const updateGameStatus = async (value: number, ids: number[]) => {
    const payload: Request.SetGameStatus = {
      ids,
      status: value === 1 ? true : false
    }
    $q.loading.show()
    try {
      const { code, msg } = await setGameStstus(payload)
      console.log("set Game status", payload)
      if (code === 0) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
      }
      onSubmit(catchQueryForm)
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  const updateGameHotStatus = async (value: number, ids: number[]) => {
    const payload: Request.SetGameHot = {
      ids,
      hot: value === 1 ? true : false
    }

    // Also toggle off 'newly' if 'hot' is being set to true
    if (value === 1) {
      await updateGameNewStatus(0, ids, false) // Set 'newly' to false
    }

    $q.loading.show()
    try {
      const { code, msg } = await setGameHot(payload)
      if (code === 0) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
      }
      onSubmit(catchQueryForm)
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  const updateGameNewStatus = async (value: number, ids: number[], toggleHot = true) => {
    const payload: Request.SetGameNew = {
      ids,
      newly: value === 1 ? true : false
    }

    // Also toggle off 'hot' if 'newly' is being set to true and toggleHot is true
    if (value === 1 && toggleHot) {
      await updateGameHotStatus(0, ids) // Set 'hot' to false
    }

    $q.loading.show()
    try {
      const { code, msg } = await setGameNewly(payload)
      if (code === 0) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
      }
      onSubmit(catchQueryForm)
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }

  function batchSwitchSelected(status: boolean) {
    const ids = selected.value.map((e) => e.id)
    if (!ids.length) return
    const numberStatus = status ? 1 : 0
    updateGameStatus(numberStatus, ids)
  }
</script>

<style>
  .top_control_bar .q-checkbox__inner--truthy {
    color: #6e39cb;
  }
</style>
