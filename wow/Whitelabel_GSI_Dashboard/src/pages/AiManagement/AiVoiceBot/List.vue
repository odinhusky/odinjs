<template>
  <div class="q-pa-md">
    <div v-if="['zh-tw', 'zh-cn'].includes(locale)" class="row justify-around">
      <q-img class="w-48 q-mb-sm" src="./img/zh-tw/1.webp" alt="" srcset="" />
      <q-img class="w-48 q-mb-sm" src="./img/zh-tw/2.webp" alt="" srcset="" />
      <q-img class="col-6 q-mb-md" src="./img/zh-tw/3.webp" alt="" srcset="" />
      <q-img class="col-6 q-mb-md" src="./img/zh-tw/4.webp" alt="" srcset="" />
    </div>
    <div v-else class="row justify-around">
      <q-img class="w-48 q-mb-sm" src="./img/en/1.webp" alt="" srcset="" />
      <q-img class="w-48 q-mb-sm" src="./img/en/2.webp" alt="" srcset="" />
      <q-img class="col-6 q-mb-md" src="./img/en/3.webp" alt="" srcset="" />
      <q-img class="col-6 q-mb-md" src="./img/en/4.webp" alt="" srcset="" />
    </div>
    <div class="text-h6 text-grey-9 q-mb-sm">{{ t("menu.task_list") }}</div>
    <query v-model:total="tableData.length" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <!--語音助理-->
                <q-td key="task_name" :props="props">
                  {{ props.row.task_name }}
                </q-td>
                <!--語音助理-->
                <q-td key="voice_type" :props="props">
                  {{ props.row.voice_type }}
                </q-td>
                <!--撥出時間-->
                <q-td key="creation_time" :props="props">
                  {{ props.row.creation_time }}
                </q-td>
                <!--電話-->
                <q-td key="import_number" :props="props">
                  {{ props.row.import_number }}
                </q-td>
                <!--意向標籤-->
                <q-td key="answer_number" :props="props">
                  {{ props.row.answer_number }}
                </q-td>
                <!--狀態-->
                <q-td key="status" :props="props">
                  <q-toggle v-model="props.row.status" />
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="blue">
                    <q-icon class="q-mr-xs" size="xs" name="edit" />
                  </q-btn>
                  <q-btn flat fab-mini color="red">
                    <q-icon class="q-mr-xs" size="xs" name="delete" />
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { INTENT } from "@/utils/constants"

  const { t, locale } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useTaskName: true,
    useDatePicker: true,
    useTaskStatus: true,
    customDateTimeLabelI18nKey: "query_params.creation_time"
  })

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "task_name",
      label: t("table_header.task_name"),
      field: "task_name",
      sortable: false,
      align: "center"
    },
    {
      name: "voice_type",
      label: t("table_header.voice_bot_name"),
      field: "voice_type",
      sortable: false,
      align: "center"
    },
    {
      name: "creation_time",
      label: t("query_params.creation_time"),
      field: "creation_time",
      sortable: false,
      align: "center"
    },
    {
      name: "import_number",
      label: t("table_header.import_number"),
      field: "import_number",
      sortable: false,
      align: "center"
    },
    {
      name: "answer_number",
      label: t("table_header.answer_number"),
      field: "answer_number",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.status"),
      field: "status",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  const tableData = reactive([
    {
      task_name: "templatetest01",
      voice_type: "female_English_01",
      creation_time: "2023-01-01 12:00:00",
      import_number: 500,
      answer_number: 67,
      status: true,
      actions: ""
    },
    {
      task_name: "templatetest02",
      voice_type: "male_English_01",
      creation_time: "2023-01-02 12:00:00",
      import_number: 500,
      answer_number: 375,
      status: false,
      actions: ""
    },
    {
      task_name: "templatetest03",
      voice_type: "male_English_01",
      creation_time: "2023-01-02 12:00:00",
      import_number: 500,
      answer_number: 489,
      status: false,
      actions: ""
    },
    {
      task_name: "templatetest04",
      voice_type: "male_English_01",
      creation_time: "2023-01-02 12:00:00",
      import_number: 500,
      answer_number: 204,
      status: true,
      actions: ""
    },
    {
      task_name: "templatetest05",
      voice_type: "male_English_01",
      creation_time: "2023-01-02 12:00:00",
      import_number: 500,
      answer_number: 341,
      status: true,
      actions: ""
    },
    {
      task_name: "templatetest06",
      voice_type: "male_English_01",
      creation_time: "2023-01-02 12:00:00",
      import_number: 500,
      answer_number: 108,
      status: true,
      actions: ""
    }
  ])

  const onSubmit = () => {
    console.log("onSubmit")
  }
</script>
<style lang="scss" scoped>
  .required {
    :deep(.q-field__label) {
      &:after {
        content: " *";
        color: red;
      }
    }
  }

  .line {
    height: 1px;
    background-color: #595959;
  }

  .separatorText {
    text-align: center;
    color: #595959;
  }

  .phone_btn {
    font-size: 30px;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
    line-height: 80px;
    margin-bottom: 10px;
    user-select: none;
    cursor: pointer;
  }

  #progressBar {
    width: 60%;
    height: 10px;
    background: #aaaaaa;
    cursor: pointer;
    border-radius: 5px;
  }
  #progress {
    height: 100%;
    background: #6332c4;
    width: 0;
    border-radius: 5px;
  }
  #controls {
    display: flex;
    align-items: center;
  }
  #time {
    margin: 0 10px;
  }

  .message_wrapper {
    height: 600px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #6332c4;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: #aaaaaa;
      border-radius: 10px;
    }
  }

  .message {
    font-size: 14px;
    color: #333333;
    background: #f0faff;
    width: 400px;
    padding: 20px;
    border-radius: 10px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .avatar_lg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .w-48 {
    width: 48%;
  }

  .table-container {
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color: #fff;
  }
</style>
