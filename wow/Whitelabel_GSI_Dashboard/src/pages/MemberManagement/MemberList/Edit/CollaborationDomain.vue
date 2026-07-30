<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
          row-key="trans_code"
        >
          <template #body="props">
            <q-tr>
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="status" :props="props">
                <span v-if="props.row.status == 0" style="color: green">{{ $t("common.adding") }}</span>
                <span v-else-if="props.row.status == 1" style="color: blue">{{ $t("common.in_use") }}</span>
                <span v-else style="color: red">{{ $t("common.expired") }}</span>
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="expired_at" :props="props">
                <span v-if="props.row.status == 2" style="color: red"> {{ genTimeFormat(props.row.expired_at) }}</span>
                <span v-else> {{ genTimeFormat(props.row.expired_at) }}</span>
              </q-td>
              <!-- 功能 -->
              <!--<q-td key="actions" :props="props">
                <q-btn flat fab-mini color="blue" @click="onAction(props.row)">
                  {{ $t("btn.edit") }}
                </q-btn>
                <q-btn flat fab-mini color="red" @click="onRemove(props.row)">
                  {{ $t("btn.remove") }}
                </q-btn>
              </q-td>-->
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </q-card>

  <!-- 編輯彈窗 -->
  <!--<dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #label>
      <div>{{ $t("btn.add_note") }}</div>
    </template>
    <template #mainContent>
      <div class="row q-col-gutter-md items-baseline q-mb-md">
        <div class="col-12 col-sm-3">{{ $t("table_header.content") }}</div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.edit.content" type="textarea" outlined />
        </div>
      </div>
    </template>
  </dialog-comp> -->

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" :loading="addLoading" max-width="600px">
    <template #label>
      <div class="q-card__section q-card__section--vert">
        <div class="dialog_title">{{ $t("common.add_domain") }}</div>
      </div>
    </template>
    <template #mainContent>
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("common.pointing_location") }}</div>
        <div class="col-12 col-sm-9">
          <span style="display: inline-block" class="q-mr-md" id="pointingLocation">{{
            dialogData.add.pointingLocation
          }}</span>
          <q-btn round dense flat icon="content_copy" @click="onCopy()" />
        </div>
      </div>
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("table_header.domain") }}</div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.add.title" type="text" outlined class="default-input" />
        </div>
      </div>
      <div class="items-baseline q-mb-md">
        <div class="col-12 col-sm-3 dialog_title2">{{ $t("common.pointing_location") }}</div>
        <div class="col-12 col-sm-9">
          <q-input v-model="dialogData.add.name" type="text" outlined class="default-input" />
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 刪除彈窗 -->
  <!--<dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("table_header.delete_permission_content") }}</div>
    </template>
  </dialog-comp> -->
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { reactive, computed, ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import query, { IQueryConfig } from "@/components/query/common.vue"

  import { getCollaborationDomainList, addCollaborationDomain } from "@/api/member"
  import type { GetCollaborationDomain } from "@/api/request.type"
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

  const { genTimeFormat } = useCommon()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCollaborationDomain: true
    }
    return baseConfig
  })
  let catchQueryForm: GetCollaborationDomain

  const { search, tableData, totalSize } = useSearch(getCollaborationDomainList)
  async function onSubmit(queryForm: GetCollaborationDomain) {
    const id = route.params.id as string
    catchQueryForm = queryForm
    await search({ ...queryForm, ...{ member_id: parseInt(id) } })
    console.log(tableData.value)
  }

  onMounted(() => {})

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "title",
      label: t("table_header.domain_name"),
      field: "title",
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
      name: "name",
      label: t("table_header.domain"),
      field: "name",
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
      name: "expired_at",
      label: t("table_header.expiration_time"),
      field: "expired_at",
      sortable: false,
      align: "center"
    }
    /*{
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }*/
  ])

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    /*edit: {
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleedit
    },*/
    add: {
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    }
    /*remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }*/
  })

  const dialogData = reactive<{
    edit: {}
    remove: {}
    add: { pointingLocation: string; title: string; name: string; member_id: number }
  }>({
    edit: {},
    remove: {},
    add: { pointingLocation: "", title: "", name: "", member_id: 0 }
  })
  /*
  function onRemove(row: MemberRemarkItem) {
    dialogData.remove = row
    openRemoveDialog(row)
  }
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
  }*/

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    closeDialog: closeAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading
  } = useDialog()

  async function onAdd() {
    const id = route.params.id as string
    dialogData.add.title = ""
    dialogData.add.name = ""
    dialogData.add.member_id = parseInt(id)
    if (dialogData.add.pointingLocation === "") {
      const res = await getCollaborationDomainList({ ...catchQueryForm, ...{ member_id: parseInt(id) } })
      if (res.code === 0) {
        dialogData.add.pointingLocation = res.data.domain
      }
    }
    //dialogData.add.pointingLocation = allData.value.domain
    openAddDialog()
  }
  async function handleAdd() {
    if (dialogData.add.title === "") {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_domain_name"),
        position: "top",
        timeout: 1000
      })
      return
    } else if (dialogData.add.name === "") {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_domain"),
        position: "top",
        timeout: 1000
      })
      return
    }
    openAddLoading()
    const res = await addCollaborationDomain(dialogData.add)
    if (res.code === 0) {
      closeAddLoading()
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
      closeAddDialog()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
      closeAddLoading()
    }
  }

  function onCopy() {
    var range = document.createRange()
    var selection = window.getSelection()
    var textToCopy = document.getElementById("pointingLocation")
    if (textToCopy) {
      range.selectNodeContents(textToCopy)
      selection?.removeAllRanges()
      selection?.addRange(range)
      try {
        var successful = document.execCommand("copy")
        console.log(successful)
        $q.notify({
          type: "positive",
          message: t("message.copy_completed"),
          position: "top",
          timeout: 300
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
</style>
