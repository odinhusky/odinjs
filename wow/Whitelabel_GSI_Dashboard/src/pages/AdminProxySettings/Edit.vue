<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.edit_account") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.account_info") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                v-model="form.account"
                outlined
                readonly
                stack-label
                :label="$t('table_header.account')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.password"
                outlined
                type="password"
                stack-label
                :loading="spinShow"
                :label="$t('common.change_password')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.name"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.name')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.phone"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.phone_number')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.email"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.email')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.remark"
                outlined
                stack-label
                :loading="spinShow"
                type="textarea"
                :label="$t('table_header.remark')"
                :placeholder="$t('common.please_enter_content')"
              />
            </div>

            <q-card class="my-card col-3 q-mr-xl q-mt-sm bg-transparent">
              <q-card-section class="text-black q-pa-sm">
                <div>{{ $t("table_header.status") }}</div>
              </q-card-section>

              <q-card-actions align="left">
                <!--<q-btn-toggle
                  v-model="form.enable_or_disable"
                  toggle-color="main-color"
                  :options="[
                    {
                      label: t('common.enable'),
                      value: 0
                    },
                    { label: t('common.disable'), value: 1 }
                  ]"
                />-->
                <div class="enable">
                  <q-toggle
                    v-model="form.enabled"
                    :color="form.enabled ? 'positive' : 'negative'"
                    :false-value="false"
                    :true-value="true"
                    stack-label
                    :loading="spinShow"
                    :label="form.enabled ? $t('common.enable') : $t('common.disable')"
                  />
                </div>
              </q-card-actions>
            </q-card>
            <q-card class="my-card col-3 q-mr-xl q-mt-sm bg-transparent">
              <q-card-section class="text-black q-pa-sm">
                <div>{{ $t("query_params.account_status") }}</div>
              </q-card-section>

              <q-card-actions align="left">
                <q-btn-toggle
                  v-model="form.is_ban"
                  toggle-color="main-color"
                  :options="[
                    { label: $t('common.un_frozen'), value: false },
                    { label: $t('common.frozen'), value: true }
                  ]"
                />
              </q-card-actions>
            </q-card>
            <!-- <q-card class="my-card col-3 q-mr-xl q-mt-sm bg-transparent">
              <q-card-section class="text-black q-pa-sm">
                <div>{{ $t("common.verify_binding") }}</div>
              </q-card-section>

              <q-card-actions align="left">
                <q-btn-toggle
                  v-model="form.verify_binding"
                  toggle-color="main-color"
                  :options="[
                    { label: t('common.binding'), value: true },
                    { label: t('common.unbind'), value: false }
                  ]"
                />
              </q-card-actions>
              <q-btn
                color="primary"
                :label="$t('common.unbind')"
                @click="onUnbind"
                :disable="!form.ga_binded"
                class="q-mt-sm"
              />
            </q-card> -->

            <!-- <div class="col-6 col-md-3 col-lg-auto">
              <q-toggle
                v-model="form.enable_or_disable"
                :color="form.enable_or_disable ? 'positive' : 'negative'"
                :false-value="0"
                :true-value="1"

                stack-label
                :loading="spinShow"
                :label="form.enable_or_disable ? $t('common.enable') : $t('common.disable')"
              />
            </div>-->
          </div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.permission_information") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-4 p_select">
              <span>{{ $t("query_params.permission_level") }}</span>
              <q-select
                v-model="form.role_id"
                outlined
                emit-value
                map-options
                :options="dropdownData.permissionLevelList"
                @update:model-value="updateLevel"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div v-for="(item, index) in parent_permission.list" :key="item.id" class="col-6">
              <div class="flex-column-top">
                <div class="custom-box">
                  <div class="custom-box-label">
                    {{ $t(PERMISSION.I18nKeys[item.id as PERMISSION.Enums] || "common.unknow") }}
                  </div>
                </div>
              </div>
              <div class="flex-column">
                <div v-for="(menu, menuIndex) in item.sub_permission" :key="menu.id" class="custom-box">
                  <div class="custom-box-label2">
                    {{ $t(PERMISSION.I18nKeys[menu.id as PERMISSION.Enums] || "common.unknow") }}
                  </div>
                  <div class="custom-edit">
                    <!--<span class="btn_green q-mr-md" v-if="menu.actions.edit !== undefined">{{
                      $t("common.edit")
                    }}</span>

                    <span class="btn_green q-mr-md" v-if="menu.actions.view !== undefined">{{
                      $t("common.check")
                    }}</span>

                    <span class="btn_green q-mr-md" v-if="menu.actions.export !== undefined">{{
                      $t("common.export")
                    }}</span>-->
                    <q-checkbox
                      v-if="menu.actions.edit !== undefined"
                      v-model="menu.actions.edit"
                      :label="$t('common.edit')"
                      color="main-color"
                      :disable="true"
                    />
                    <q-checkbox
                      v-if="menu.actions.view !== undefined"
                      v-model="menu.actions.view"
                      :label="$t('common.check')"
                      color="main-color"
                      :disable="true"
                    />
                    <q-checkbox
                      v-if="menu.actions.export !== undefined"
                      v-model="menu.actions.export"
                      :label="$t('common.export')"
                      color="main-color"
                      :disable="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-py-md" align="center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
            {{ $t("btn.cancel") }}
          </q-btn>
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
    const { data } = await getAdminAccountPermissionDetail(sendData)
    if (!data || !Object.keys(data).length) {
      return
    }
    parent_permission.list = data.parent_permission
    parent_permission.list?.sort((a, b) => a.id - b.id)
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

    const res = await updateAccountAdminDetail(sendData)
    console.log(res)
    if (res.code === 0) {
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
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 300
      })
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
  .p_select {
    display: flex;
    span {
      align-items: center;
      display: flex;
      margin-right: 15px;
    }
    ::v-deep(.q-select) {
      width: 55%;
    }
  }
  ::v-deep(.q-textarea .q-field__control) {
    height: 56px;
  }
  ::v-deep(.q-select .q-field__control) {
    height: 56px;
  }

  ::v-deep(.q-checkbox.disabled) {
    opacity: 1 !important;
  }

  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
  }

  .custom-box-label {
    font-family: Noto Sans TC;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    margin-bottom: 12px;
  }

  .custom-box {
    border: none;
    border-radius: 0px;
    margin-bottom: 4px;
    padding: 2px 8px;
    text-align: left;
    cursor: pointer;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 15px;
    border-bottom: 1px solid #c2c2ca;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .custom-box:last-child {
    border-bottom: none;
  }
  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  ::v-deep(.q-checkbox__inner) {
    font-size: 36px;
  }
  .custom-edit {
    width: 60%;
    display: flex;
    justify-content: end;
  }
</style>
