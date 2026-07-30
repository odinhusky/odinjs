<template>
  <q-page padding>
    <q-slide-transition>
      <div v-if="visible" class="search-container q-mb-md">
        <div class="search-area">
          <div class="first-item">
            <q-select class="input" dense outlined :options="['Frontend', 'Backend']" label="類型" />
            <q-input class="input" dense outlined label="工單號碼" />
            <q-input class="input" outlined dense label="標題" />
            <q-input class="input" outlined dense label="總代ID" />
            <q-input class="input" outlined dense label="進度" />
            <q-input class="input" outlined dense label="優先度" />
            <q-input class="input" outlined dense label="代理ID" />
            <q-input class="input" outlined dense label="測試人員" />
            <q-input class="input" outlined dense label="立單人員" />
            <q-input class="input" outlined dense label="評估人員" />
            <q-input class="input" outlined dense label="開發人員" />
            <q-input class="input" outlined dense label="日期" />
          </div>
          <div class="second-item">
            <q-btn class="button" color="purple">查詢</q-btn>
          </div>
        </div>
      </div>
    </q-slide-transition>
    <div class="visible-area q-mb-md">
      <div v-if="visible" @click="toggleVisibility">
        隱藏
        <q-icon class="icon" name="keyboard_arrow_down" />
      </div>
      <div v-else @click="toggleVisibility">
        顯示
        <q-icon class="icon" name="keyboard_arrow_down" />
      </div>
    </div>

    <div class="button-area q-mb-md">
      <q-btn icon-right="archive" label="匯出" class="icon" />
      <q-btn color="secondary" @click="openActionDialog">新增</q-btn>
    </div>

    <q-table :rows="row" :columns="column" hide-bottom class="no-shadow" separator="cell">
      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="action-area">
            <q-btn icon="edit" size="sm" flat dense @click="openActionDialog" />
            <q-btn icon="content_copy" size="sm" flat dense />
          </div>
        </q-td>
      </template>
    </q-table>

    <ListPagination />
    <ActionDialog v-model="show" />
  </q-page>
</template>

<script>
  import { defineComponent, defineAsyncComponent, ref } from "vue"
  import ActionDialog from "./components/ActionDialog.vue"
  import { exportFile } from "quasar"

  function wrapCsvValue(val, formatFn) {
    let formatted = formatFn !== void 0 ? formatFn(val) : val

    formatted = formatted === void 0 || formatted === null ? "" : String(formatted)

    formatted = formatted.split('"').join('""')
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`
  }

  export default defineComponent({
    name: "TicketList",
    components: {
      ListPagination: defineAsyncComponent(() => import("components/paginations/ListPagination.vue")),
      ActionDialog
    },
    setup() {
      const form = {
        type: ""
      }
      const show = ref(false)
      const visible = ref(true)
      const openActionDialog = () => {
        show.value = true
      }
      const toggleVisibility = () => {
        visible.value = !visible.value
      }

      const column = [
        { name: "center", align: "center", label: "工單號碼", field: "ticketNumber", sortable: false },
        { name: "Group", align: "left", label: "Group", field: "group", sortable: false },
        { name: "總代名稱", align: "left", label: "總代名稱", field: "masterAgentName", sortable: false },
        { name: "站點名稱", align: "left", label: "站點名稱", field: "operatorName", sortable: false },
        { name: "標題", align: "left", label: "標題", field: "subject", sortable: false },
        { name: "立單日期", align: "left", label: "立單日期", field: "createdDate", sortable: false },
        { name: "評估人", align: "left", label: "評估人", field: "appraiser", sortable: false },
        { name: "開發", align: "left", label: "開發", field: "programmer", sortable: false },
        { name: "測試", align: "left", label: "測試", field: "tester", sortable: false },
        { name: "進度", align: "left", label: "進度", field: "progress", sortable: false },
        { name: "完成時間", align: "left", label: "完成時間", field: "finishedDate", sortable: false },
        { name: "優先度", align: "left", label: "優先度", field: "priority", sortable: false },
        { name: "actions", align: "center", label: "功能", field: "actions", sortable: false }
        // ... more columns here
      ]

      const row = [
        {
          ticketNumber: "202301020001",
          group: "Frontend",
          masterAgentName: "168集團",
          operatorName: "澳門娛樂城",
          subject: "Sample Subject",
          createdDate: "2023-01-01",
          appraiser: "Jack",
          programmer: "Jack",
          tester: "QA1",
          progress: "Evaluated",
          finishedDate: "2023-01-10",
          priority: "High"
        }
      ]

      return {
        form,
        show,
        openActionDialog,
        visible,
        toggleVisibility,
        column,
        row,
        exportTable() {
          // naive encoding to csv format
          const content = [columns.map((col) => wrapCsvValue(col.label))]
            .concat(
              rows.map((row) =>
                columns
                  .map((col) =>
                    wrapCsvValue(
                      typeof col.field === "function"
                        ? col.field(row)
                        : row[col.field === void 0 ? col.name : col.field],
                      col.format
                    )
                  )
                  .join(",")
              )
            )
            .join("\r\n")

          const status = exportFile("table-export.csv", content, "text/csv")

          if (status !== true) {
            $q.notify({
              message: "Browser denied file download...",
              color: "negative",
              icon: "warning"
            })
          }
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  .action-area {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
</style>
