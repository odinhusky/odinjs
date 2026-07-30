<template>
  <div class="q-pa-md" style="padding-top: 0">
    <q-card class="editWrapper_v2 bg-white">
      <q-form style="padding-left: 6%; padding-right: 6%; max-width: 73rem" class="q-mx-auto">
        <q-card-section class="q-pt-lg">
          <div class="bold h1-bold text-center grey">{{ $t("common.edit_account") }}</div>
        </q-card-section>
        <div class="row q-col-gutter-md edit_area_style1 q-mb-md">
          <q-card-section class="q-pb-sm col-12">
            <div class="h4-bold bold grey flex justify-center">{{ $t("common.account_info") }}</div>
          </q-card-section>
          <q-card class="col-6 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("table_header.account") }}</p>

            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.account"
                outlined
                readonly
                stack-label
                class="default-input"
                :placeholder="$t('common.please_enter_content')"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-6 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("common.change_password") }}</p>

            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.password"
                outlined
                type="password"
                stack-label
                :loading="spinShow"
                class="default-input"
                :placeholder="$t('common.please_enter_content')"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-6 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("table_header.name") }}</p>
            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.name"
                outlined
                stack-label
                :loading="spinShow"
                class="default-input"
                :placeholder="$t('common.please_enter_content')"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-6 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("table_header.phone_number") }}</p>
            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.phone"
                outlined
                stack-label
                :loading="spinShow"
                class="default-input"
                :placeholder="$t('common.please_enter_content')"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-6 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("table_header.email") }}</p>
            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.email"
                outlined
                stack-label
                :loading="spinShow"
                class="default-input"
                :placeholder="$t('common.please_enter_content')"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-12 bg-transparent q-mb-sm">
            <p class="h7-bold input-title">{{ $t("table_header.remark") }}</p>
            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-input
                v-model="form.remark"
                outlined
                stack-label
                :loading="spinShow"
                type="textarea"
                :placeholder="$t('common.please_enter_content')"
                style="width: 100%"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
            <p class="h7-bold input-title">{{ $t("table_header.status") }}</p>

            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-btn-toggle
                v-model="form.enabled"
                class="btn_toggle_style"
                toggle-color="primary"
                unelevated
                rounded
                map-options
                :options="[
                  { label: $t('common.enable'), value: true },
                  { label: $t('common.disable'), value: false }
                ]"
              />
            </q-card-actions>
          </q-card>
          <q-card class="col-4 bg-transparent q-pt-md q-mb-md">
            <p class="h7-bold input-title">{{ $t("query_params.account_status") }}</p>

            <q-card-actions class="q-px-none q-py-none h7-bold grey">
              <q-btn-toggle
                v-model="form.is_ban"
                class="btn_toggle_style"
                toggle-color="primary"
                unelevated
                rounded
                map-options
                :options="[
                  { label: $t('common.un_frozen'), value: false },
                  { label: $t('common.frozen'), value: true }
                ]"
              />
            </q-card-actions>
          </q-card>
        </div>
        <div class="row q-col-gutter-md q-mb-md edit_area_style1">
          <q-card-section class="q-pb-sm col-12">
            <div class="h4-bold bold grey flex justify-center">{{ $t("common.permission_information") }}</div>
          </q-card-section>
          <div style="width: 97%">
            <div class="row">
              <div class="col-6 p_select column">
                <span class="h7-bold q-mb-xs">{{ $t("query_params.permission_level") }}</span>
                <q-select
                  v-model="form.role_id"
                  outlined
                  emit-value
                  map-options
                  :options="dropdownData.permissionLevelList"
                  @update:model-value="updateLevel"
                  class="default-input"
                />
              </div>
            </div>
          </div>
          <q-card-section class="q-pt-xs q-mt-lg" style="padding-right: 0px; width: 100%">
            <div class="row q-col-gutter-md">
              <div v-for="(item, index) in parent_permission.list" :key="item.id" class="col-6 q-mb-md">
                <div class="flex-column-top">
                  <div class="custom-box">
                    <div class="custom-box-label h4-bold bold q-mb-sm">
                      {{ $t(PERMISSION.I18nKeys[item.id as PERMISSION.Enums] || "common.unknow") }}
                    </div>
                  </div>
                </div>
                <div class="flex-column ckeckbox-style">
                  <div v-for="(menu, menuIndex) in item.sub_permission" :key="menu.id" class="custom-box2">
                    <span class="h6-bold">{{
                      $t(PERMISSION.I18nKeys[menu.id as PERMISSION.Enums] || "common.unknow")
                    }}</span>
                    <div class="custom-edit grey">
                      <!--<span class="btn_green q-mr-md" v-if="menu.actions.edit !== undefined">{{ $t("common.edit") }}</span>

                <span class="btn_green q-mr-md" v-if="menu.actions.view !== undefined">{{ $t("common.check") }}</span>

                <span class="btn_green q-mr-md" v-if="menu.actions.export !== undefined">{{
                  $t("common.export")
                }}</span>-->
                      <q-checkbox
                        v-if="menu.actions.edit !== undefined"
                        v-model="menu.actions.edit"
                        :label="$t('common.edit')"
                        color="main-color"
                        :disable="true"
                        class="q-mr-sm"
                      />
                      <q-checkbox
                        v-if="menu.actions.view !== undefined"
                        v-model="menu.actions.view"
                        :label="$t('common.check')"
                        color="main-color"
                        :disable="true"
                        class="q-mr-sm"
                      />
                      <q-checkbox
                        v-if="menu.actions.export !== undefined"
                        v-model="menu.actions.export"
                        :label="$t('common.export')"
                        color="main-color"
                        :disable="true"
                        class="q-mr-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </div>
        <q-card-actions class="q-py-md" align="center">
          <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="unbindDialog" :configs="dialogConfigs.unbind" :loading="unbindLoading">
    <template #mainContent>
      <div>{{ $t("table_header.unbind_msg") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"
  import { PERMISSION } from "@/utils/constants"
  import { useSearch } from "@/hook/useSearch"
  import {
    getAccountAdminDetail,
    getAdminAccountPermission,
    getAdminAccountPermissionDetail,
    updateAccountAdminDetail,
    updateAccountAdminUnBind
  } from "@/api/adminAccount"

  import type { adminAccountItem, adminAccountPermissionItem } from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  const store = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const spinShow = ref(false)
  const { t } = useI18n()
  interface IDropdownItem<T> {
    label: string
    value: number | string
  }

  interface Permission {
    id: number
    name: string
    sub_permission: [{ id: number; actions: { edit: string; view: string; export: string } }]
  }

  let dropdownData = reactive({
    permissionLevelList: [] as IDropdownItem<number>[]
  })
  const checkBox = ref(false)
  const form = reactive<adminAccountItem>({
    id: 0,
    account: "",
    name: "",
    role_id: 0,
    enabled: false,
    is_ban: false,
    phone: "",
    email: "",
    password: "",
    remark: "",
    ga_binded: false
  })

  function goBack() {
    router.back()
  }
  let permissionList: adminAccountPermissionItem[] = reactive([])
  const parent_permission = reactive<{
    list?: Permission[]
  }>({
    list: [] as Permission[]
  })
  onMounted(() => {
    const id = parseInt(route.params.id as string)
    const sendData = { name: "", offset: 0, size: 100 }

    Promise.all([getAccountAdminDetail({ id }), getAdminAccountPermission(sendData)])
      .then(([detailResponse, permissionResponse]) => {
        form.id = detailResponse.data.id
        form.account = detailResponse.data.account
        form.password = detailResponse.data.password
        form.name = detailResponse.data.name
        form.phone = detailResponse.data.phone
        form.email = detailResponse.data.email
        form.remark = detailResponse.data.remark
        form.enabled = detailResponse.data.enabled
        form.is_ban = detailResponse.data.is_ban
        form.ga_binded = detailResponse.data.ga_binded

        Object.assign(permissionList, permissionResponse.data.list)
        //取得下拉內容

        permissionList.forEach((item) => {
          dropdownData.permissionLevelList.push({
            label: item.name,
            value: item.id
          })
        })

        form.role_id = detailResponse.data.role_id
        const foundRole = permissionList.find((role) => role.id === form.role_id)
        if (!foundRole) {
          //form.role_id = permissionList.length > 0 ? permissionList[0].id : ""
          form.role_id = ""
        }

        //取得該筆的權限內容
        getPermissionDetail()
      })
      .catch((e: any) => {
        goBack()
      })
  })
  const updateLevel = (id: number | string) => {
    if (id === "") {
      parent_permission.list = []
      return
    }
    form.role_id = id
    //取得該筆的權限內容
    getPermissionDetail()
  }
  const getPermissionDetail = async () => {
    // console.log(form.role_id)
    const sendData = { id: form.role_id }
    const { search, status, tableData } = useSearch(getAdminAccountPermissionDetail)
    await search(sendData)
    if (status.value) {
      parent_permission.list = tableData.value.parent_permission
      parent_permission.list?.sort((a, b) => a.id - b.id)
      parent_permission.list = parent_permission.list?.filter((parent) => {
        if (!PERMISSION.I18nKeys[parent.id as PERMISSION.Enums]) {
          return false
        }
        parent.sub_permission?.sort((a, b) => a.id - b.id)
        parent.sub_permission = parent.sub_permission?.filter((sub) => {
          if (PERMISSION.I18nKeys[sub.id as PERMISSION.Enums]) {
            return true // 保留
          }
          return false // 移除 sub_permission
        })

        return parent.sub_permission.length > 0 // 保留 parent
      })
    }
  }
  function onCancel() {
    router.push({ name: "BackofficeAccountList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  //8~20字內，至少包含1個大寫字母，1個小寫字母和1個號碼
  const passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,20}$/
  const onSubmit = async () => {
    isLoading.value = true

    if (form.password) {
      if (!passwordReg.test(form.password)) {
        $q.notify({
          type: "negative",
          message: t("error_msg.enter_member_pw_forbidden_error"),
          position: "top",
          timeout: 1000
        })
        isLoading.value = false
        return
      }
    } else if (form.role_id === "") {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_select_permission_level"),
        position: "top",
        timeout: 1000
      })
      isLoading.value = false
      return
    }
    const sendData = {
      id: form.id,
      password: form.password,
      enabled: form.enabled,
      is_ban: form.is_ban,
      role_id: form.role_id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      remark: form.remark
    }

    const { search, status } = useSearch(updateAccountAdminDetail)
    await search(sendData)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "BackofficeAccountList" })
      setTimeout(() => {
        history.go(0)
      }, 2000)
    } else {
      isLoading.value = false
    }
  }
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    unbind: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleUnbind
    }
  })

  const dialogData = reactive<{
    unbind: {
      id?: number
    }
  }>({
    unbind: { id: 0 }
  })
  const {
    dialog: unbindDialog,
    openDialog: openUnbindDialog,
    loading: unbindLoading,
    openLoading: openUnbindLoading,
    closeLoading: closeUnbindLoading,
    closeDialog: closeUnbind
  } = useDialog()

  function onUnbind() {
    const id = parseInt(route.params.id as string)
    dialogData.unbind.id = id
    openUnbindDialog(id)
  }

  async function handleUnbind() {
    openUnbindLoading()

    const res = await updateAccountAdminUnBind(dialogData.unbind)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.unbind_success"),
        position: "top",
        timeout: 300
      })
      closeUnbindLoading()
      closeUnbind()
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";

  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }

  .custom-box-label {
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    color: #086eff;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .custom-box2 {
    border: none;
    border-radius: 0px;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid #e5e5e5;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 9px;
  }

  .custom-box:last-child,
  .custom-box2:last-child {
    border-bottom: none;
  }

  .custom-edit {
    width: 60%;
    display: flex;
    justify-content: end;
  }
</style>
