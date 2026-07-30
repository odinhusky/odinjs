<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <div class="row q-mb-md justify-start">
      <q-btn @click="onAdd" class="btns btn-blue">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="tableData"
      :columns="tableColumn"
      class="table_v2"
      row-key="id"
    >
      <template #body="props">
        <q-tr>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="remark" :props="props">
            <div class="pre-wrap" v-html="props.row.remark"></div>
          </q-td>
          <q-td key="created_at" :props="props">
            {{ genTimeFormat(props.row.created_at) }}
          </q-td>
          <q-td key="display_name" :props="props">
            {{ props.row.display_name }}
          </q-td>
        </q-tr>
      </template>

      <!-- 查無資料 -->
      <template #no-data>
        <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
      </template>
    </q-table>
  </q-card>

  <!-- 編輯彈窗 -->
  <dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="600px">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("btn.add_note") }}</div>
      </div>
    </template>
    <template #mainContent>
      <!-- 標題 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("table_header.content") }}</div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.edit.content" type="textarea" outlined />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" :loading="addLoading" max-width="600px">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("btn.add_note") }}</div>
      </div>
    </template>
    <template #mainContent>
      <!-- 內容 -->
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("table_header.content") }}</div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.add.content" type="textarea" outlined />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading" max-width="600px">
    <template #mainContent>
      <div class="text-red q-mb-lg">{{ $t("table_header.delete_permission_content") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { reactive, computed, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberRemarkList, addMemberRemark } from "@/api/member"
  import type { GetMemberRemarkList } from "@/api/request.type"
  import type { MemberRemarkItem } from "@/api/response.type"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"

  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  const $q = useQuasar()

  const { search: searchRemarkList, tableData } = useSearch(getMemberRemarkList)

  const { genTimeFormat } = useCommon()
  onMounted(() => {
    const id = route.params.id as string
    searchRemarkList(id)
  })
  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "id",
      label: t("table_header.id"),
      field: "id",
      sortable: false,
      align: "center"
    },
    {
      name: "remark",
      label: t("table_header.content"),
      field: "remark",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.created_on"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    {
      name: "display_name",
      label: t("table_header.add_personnel"),
      field: "display_name",
      sortable: false,
      align: "center"
    }
  ])

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    edit: {
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleedit
    },
    add: {
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })
  function onRemove(row: MemberRemarkItem) {
    dialogData.remove = row
    openRemoveDialog(row)
  }
  const dialogData = reactive<{
    edit: {
      member_id: number
      content: string
    }
    remove: {}
    add: { member_id: number; content: string }
  }>({
    edit: {
      member_id: Number(route.params.id as string),
      content: ""
    },
    remove: {},
    add: { member_id: Number(route.params.id as string), content: "" }
  })

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()
    // call api
    //onSubmit(catchQueryForm)
    $q.notify({
      type: "positive",
      message: t("message.delete_success"),
      position: "top",
      timeout: 300
    })
    closeRemoveLoading()
  }

  const {
    dialog: EditDialog,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    loading: editLoading,
    openLoading: openeditLoading,
    closeLoading: closeeditLoading
  } = useDialog()

  const onAction = (row: MemberRemarkItem) => {
    dialogData.edit.member_id = row.id
    dialogData.edit.content = row.content

    openEditDialog()
  }

  function handleedit() {
    openeditLoading()

    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })

    closeeditLoading()
  }

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    closeDialog: closeAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading
  } = useDialog()

  function onAdd() {
    dialogData.add.content = ""
    openAddDialog()
  }
  async function handleAdd() {
    openAddLoading()
    const res = await addMemberRemark(dialogData.add)
    if (res.code === 0) {
      closeAddLoading()
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      const id = route.params.id as string
      searchRemarkList(id)
      closeAddDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
    }
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
  ::v-deep(.q-table__container) {
    border-top-left-radius: inherit !important;
    border-top-right-radius: inherit !important;
  }
</style>
