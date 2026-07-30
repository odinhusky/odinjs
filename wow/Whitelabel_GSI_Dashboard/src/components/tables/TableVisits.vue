<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <q-card class="text-grey-8 no-shadow" bordered>
        <q-card-section class="q-pa-none">
          <q-table
            v-model:pagination="pagination"
            class="no-shadow"
            :rows="rows"
            :title="tableTitle"
            :hide-header="mode === 'grid'"
            :columns="columns"
            row-key="name"
            :filter="filter"
          >
            <template #top-right>
              <!-- <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input> -->

              <!-- <q-btn
                flat
                round
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
                v-if="mode === 'list'"
                class="q-px-sm"
              >
                <q-tooltip :disable="$q.platform.is.mobile" v-close-popup anchor="top middle" self="bottom middle"
                  >{{
                    props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'
                  }}
                </q-tooltip>
              </q-btn> -->

              <q-btn color="primary" icon-right="archive" :label="t('btn.export')" no-caps @click="exportTable" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed } from "vue"
  import { exportFile, useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

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

  const rows = [
    {
      id: "U0001",
      name: "12",
      date: "256",
      user_name: "46"
    },
    {
      id: "U0002",
      name: "14",
      date: "55",
      user_name: "788"
    },
    {
      id: "U0003",
      name: "96",
      date: "556",
      user_name: "37"
    },
    {
      id: "U0004",
      name: "85",
      date: "22",
      user_name: "177"
    },
    {
      id: "U0005",
      name: "797",
      date: "33",
      user_name: "45"
    }
  ]

  export default defineComponent({
    name: "TableVisits",
    props: ["title", "columns"],
    setup(props) {
      const tableTitle = computed(() => props.title)
      // const tableColumn = props.column;
      const $q = useQuasar()
      const filter = ref("")
      const { t } = useI18n()

      return {
        tableTitle,
        filter,
        mode: "list",
        // tableColumn,
        rows,
        t,
        pagination: {
          rowsPerPage: 10
        },

        exportTable() {
          // naive encoding to csv format
          const content = [props.columns.map((col) => wrapCsvValue(col.label))]
            .concat(
              rows.map((row) =>
                props.columns
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
