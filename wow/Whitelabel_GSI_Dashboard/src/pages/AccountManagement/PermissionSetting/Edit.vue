<template>
  <div class="q-pa-md" style="padding-top: 0">
    <q-card class="editWrapper_v2 bg-white">
      <q-form>
        <q-card-section class="q-pt-lg">
          <div class="bold h1-bold text-center grey" v-if="type === 'edit'">{{ $t("common.edit_permission") }}</div>
          <div class="bold h1-bold text-center grey" v-else>{{ $t("common.copy_permission") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <p class="h7-bold input-title">{{ $t("table_header.role") }}</p>
              <q-input
                v-model="form.name"
                outlined
                :placeholder="$t('common.please_enter_content')"
                class="default-input"
              />
            </div>
            <div class="col-6">
              <p class="h7-bold input-title">{{ $t("table_header.remark") }}</p>
              <q-input
                v-model="form.remark"
                outlined
                :placeholder="$t('common.please_enter_content')"
                class="default-input"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div v-for="item in form.permission_all" :key="item.id" class="col-6">
              <div class="flex-column-top">
                <div class="custom-box">
                  <div class="custom-box-label h4-bold bold q-mb-sm">
                    {{ $t(PERMISSION.I18nKeys[item.id as PERMISSION.Enums] || "common.unknow") }}
                  </div>
                  <div
                    class="custom-edit ckeckbox-style grey"
                    style="padding-right: 0.625rem; margin-bottom: 0.3125rem"
                  >
                    <q-checkbox
                      v-model="item.editAll"
                      :label="$t('common.edit')"
                      color="main-color"
                      @click="AllToggle(item.id, 'edit')"
                      v-if="showAllCheckbox(item.sub_permission, 'edit')"
                      class="q-mr-sm"
                    />
                    <q-checkbox
                      v-model="item.viewAll"
                      :label="$t('common.check')"
                      color="main-color"
                      @click="AllToggle(item.id, 'view')"
                      v-if="showAllCheckbox(item.sub_permission, 'view')"
                      class="q-mr-sm"
                    />
                    <q-checkbox
                      v-model="item.exportAll"
                      :label="$t('common.export')"
                      color="main-color"
                      @click="AllToggle(item.id, 'export')"
                      v-if="showAllCheckbox(item.sub_permission, 'export')"
                      class="q-mr-sm"
                    />
                  </div>
                </div>
              </div>
              <div class="flex-column ckeckbox-style">
                <div v-for="menu in item.sub_permission" :key="menu.id" class="custom-box2">
                  <span class="h6-bold">{{
                    $t(PERMISSION.I18nKeys[menu.id as PERMISSION.Enums] || "common.unknow")
                  }}</span>
                  <div class="custom-edit grey">
                    <q-checkbox
                      v-if="menu.actions.edit !== undefined"
                      v-model="menu.actions.edit"
                      :label="$t('common.edit')"
                      color="main-color"
                      class="q-mr-sm"
                    />
                    <q-checkbox
                      v-if="menu.actions.view !== undefined"
                      v-model="menu.actions.view"
                      :label="$t('common.check')"
                      color="main-color"
                      class="q-mr-sm"
                    />
                    <q-checkbox
                      v-if="menu.actions.export !== undefined"
                      v-model="menu.actions.export"
                      :label="$t('common.export')"
                      color="main-color"
                      class="q-mr-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-py-md" align="center">
          <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useQueryStore } from "@/stores/queryStore"

  import {
    getAdminAccountPermissionDetail,
    getAdminAccountPermissionList,
    updateAdminAccountPermissionDetail,
    addAdminAccountPermission
  } from "@/api/adminAccount"
  import { PERMISSION } from "@/utils/constants"
  import type { adminAccountPermissionItem } from "@/api/response.type"
  import { useSearch } from "@/hook/useSearch"

  const store = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const type = route.params.type
  const { t } = useI18n()

  interface Permission {
    id: number
    name: string
    editAll: boolean
    viewAll: boolean
    exportAll: boolean
    sub_permission: { id: number; actions: any }[]
  }
  interface Parent_permission {
    id: number
    name: string
    editAll: boolean
    viewAll: boolean
    exportAll: boolean
    parent_permission: { name: string; actions: any }[]
  }
  const form = reactive<
    adminAccountPermissionItem & {
      parent_permission?: Permission[]
      permission_all?: Permission[]
    }
  >({
    id: 0,
    name: "",
    perm_count: 0,
    status: 0,
    remark: "",
    parent_permission: [] as Permission[],
    permission_all: [] as Permission[]
  })
  const menu = {
    home: [PERMISSION.Enums.A_M_HOME_MANAGEMENT],
    ai_tools: [PERMISSION.Enums.A_M_AI_MANAGEMENT],
    cash_flow: [
      PERMISSION.Enums.A_M_TRANSACTION_MANAGEMENT,
      PERMISSION.Enums.S_M_PAYMENT_MANAGEMENT,
      PERMISSION.Enums.M_M_PAYMENT_MANAGEMENT,
      PERMISSION.Enums.A_M_PAYMENT_MANAGEMENT
    ],
    member_management: [PERMISSION.Enums.A_M_MEMBER_MANAGEMENT],
    affiliate: [
      PERMISSION.Enums.A_M_AFFILIATE_MANAGEMENT,
      PERMISSION.Enums.A_M_REFERRAL_REBATE_MANAGEMENT,
      PERMISSION.Enums.A_M_SHAREHOLDER_MANAGEMENT,
      PERMISSION.Enums.A_M_COLLABORATION
    ],
    promotions: [
      PERMISSION.Enums.A_M_PROMOTION_MANAGEMENT,
      PERMISSION.Enums.A_M_REFERRAL_SIGNUP_MANAGEMENT,
      PERMISSION.Enums.A_M_REFERRAL_WHEEL_MANAGEMENT,
      PERMISSION.Enums.A_M_FREE_ROUND_MANAGEMENT,
      PERMISSION.Enums.A_M_GIFT,
      PERMISSION.Enums.A_M_REBATE_MANAGEMENT
    ],
    records: [
      PERMISSION.Enums.A_M_HISTORY_MANAGEMENT,
      PERMISSION.Enums.S_M_STATISTIC_REPORT,
      PERMISSION.Enums.M_M_STATISTIC_REPORT,
      PERMISSION.Enums.A_M_STATISTIC_REPORT
    ],
    cms: [
      PERMISSION.Enums.A_M_LAYOUT_SETTINGS,
      PERMISSION.Enums.A_M_MESSAGE_CENTER,
      PERMISSION.Enums.S_M_PRODUCT_MANAGEMENT,
      PERMISSION.Enums.M_M_PRODUCT_MANAGEMENT,
      PERMISSION.Enums.A_M_PRODUCT_MANAGEMENT,
      PERMISSION.Enums.S_M_CACHE_MANAGEMENT,
      PERMISSION.Enums.A_M_CACHE_MANAGEMENT_NEW
    ],
    settings: [
      PERMISSION.Enums.S_M_ACCOUNT_MANAGEMENT,
      PERMISSION.Enums.M_M_ACCOUNT_MANAGEMENT,
      PERMISSION.Enums.A_M_ACCOUNT_MANAGEMENT,
      PERMISSION.Enums.M_M_SYSTEM_MANAGEMENT,
      PERMISSION.Enums.A_M_SYSTEM_MANAGEMENT,
      PERMISSION.Enums.A_M_WEBSITE_MANAGEMENT
    ],
    documents: [
      PERMISSION.Enums.S_M_FILE_MANAGEMENT,
      PERMISSION.Enums.M_M_FILE_MANAGEMENT,
      PERMISSION.Enums.A_M_FILE_MANAGEMENT
    ]
  }
  onMounted(() => {
    const id = parseInt(route.params.id as string)
    const sendData = { name: "", offset: 0, size: 1000 }
    Promise.all([getAdminAccountPermissionList(sendData), getAdminAccountPermissionDetail({ id })])
      .then(([listResponse, detailResponse]) => {
        // 檢查所有權限列表的结果
        if (listResponse.code !== 0) {
          goBack()
          return
        }
        // 檢查該筆資料的詳細
        if (detailResponse.code !== 0) {
          goBack()
          return
        }
        form.permission_all = listResponse.data.parent_permission
        form.permission_all?.sort((a, b) => a.id - b.id)

        /*form.permission_all?.forEach((parent) => {
          parent.editAll = false
          parent.viewAll = false
          parent.exportAll = false
          //預設都改成false 沒有勾選的狀態
          parent.sub_permission?.forEach((sub) => {
            if (sub.actions.edit) {
              sub.actions.edit = false
            }
            if (sub.actions.view) {
              sub.actions.view = false
            }
            if (sub.actions.export) {
              sub.actions.export = false
            }
          })
        })*/
        form.permission_all = form.permission_all?.filter((parent) => {
          if (!PERMISSION.I18nKeys[parent.id as PERMISSION.Enums]) {
            return false
          }

          parent.editAll = false
          parent.viewAll = false
          parent.exportAll = false
          parent.sub_permission?.sort((a, b) => a.id - b.id)
          parent.sub_permission = parent.sub_permission?.filter((sub) => {
            if (PERMISSION.I18nKeys[sub.id as PERMISSION.Enums]) {
              if (sub.actions.edit) {
                sub.actions.edit = false
              }
              if (sub.actions.view) {
                sub.actions.view = false
              }
              if (sub.actions.export !== undefined) {
                sub.actions.export = false
              }
              return true // 保留
            }
            return false // 移除 sub_permission
          })

          return parent.sub_permission.length > 0 // 保留 parent
        })

        form.name = detailResponse.data.name
        form.remark = detailResponse.data.remark
        form.parent_permission = detailResponse.data.parent_permission

        form.parent_permission.forEach((itemB) => {
          //permission_all找到當前parent_permission數據匹配的項目
          const itemA = form.permission_all?.find((a) => a.id === itemB.id)

          if (itemA) {
            itemB.sub_permission.forEach((subItemB) => {
              // 在 permission_all的子權限中找到與當前 subItemB 數據子項相匹配的項目  有就讓他打勾
              const subItemA = itemA.sub_permission.find((sa) => sa.id === subItemB.id)
              if (subItemA && subItemB.actions.edit) {
                subItemA.actions.edit = true
              }
              if (subItemA && subItemB.actions.view) {
                subItemA.actions.view = true
              }
              if (subItemA && subItemB.actions.export) {
                subItemA.actions.export = true
              }
            })
          }
        })

        Object.entries(menu).forEach(([group, ids]) => {
          ids.forEach((id) => {
            const found = form.permission_all?.find((p) => p.id === id)
            if (found) {
              found.group = group
            }
          })
        })
      })
      .catch((e: any) => {
        //goBack()
      })
  })

  const groupedPermissionsDisplay = computed(() => {
    const groups: Record<string, any[]> = {}
    for (const item of form.permission_all) {
      const group = item.group || "others"
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
    }
    return groups
  })

  const AllToggle = (id: number, mode: string) => {
    const parentPermission = form.permission_all?.find((item) => item.id === id)
    if (parentPermission) {
      parentPermission.sub_permission.forEach((menu) => {
        if (mode == "edit") {
          if (Object.hasOwn(menu.actions, "edit")) {
            menu.actions.edit = parentPermission.editAll
          }
        } else if (mode == "view") {
          if (Object.hasOwn(menu.actions, "view")) {
            menu.actions.view = parentPermission.viewAll
          }
        } else if (mode == "export") {
          if (Object.hasOwn(menu.actions, "export")) {
            menu.actions.export = parentPermission.exportAll
          }
        }
      })
    }
  }

  //是否顯示全選
  const showAllCheckbox = (sub_permission: any, mode: string) => {
    if (mode == "edit") {
      return sub_permission.some((menu: any) => menu.actions.edit !== undefined)
    } else if (mode == "view") {
      return sub_permission.some((menu: any) => menu.actions.view !== undefined)
    } else if (mode == "export") {
      return sub_permission.some((menu: any) => menu.actions.export !== undefined)
    }
  }

  function actionStatus(list: Permission["sub_permission"], action: "edit" | "view" | "export") {
    const actionAbles = list.filter((e) => e.actions && Object.hasOwn(e.actions, action))

    return actionAbles.length > 0 && actionAbles.every((m) => m.actions![action] === true)
  }

  watch(
    form,
    (newValue, oldValue) => {
      //如果子checkbox都勾選時 要讓全選變true
      newValue.permission_all?.forEach((parent) => {
        const sub = parent.sub_permission ?? []

        const allEdit = actionStatus(sub, "edit")
        const allView = actionStatus(sub, "view")
        const allExport = actionStatus(sub, "export")

        parent.editAll = allEdit
        parent.viewAll = allView
        parent.exportAll = allExport
      })
    },
    { deep: true }
  )
  /*watch(
      () => form.parent_permission?.map((group: any) => ({ editAll: group.editAll, checkAll: group.checkAll })),
      (newValues, oldValues) => {
        newValues?.forEach((newVal: any, index: any) => {
          // 只在主選單發生變化時更新子選單
          if (newVal.editAll !== (oldValues && oldValues[index]?.editAll)) {
            form.parent_permission[index].menus.forEach((menu: any) => {
              menu.edit = newVal.editAll
            })
          }

          if (newVal.checkAll !== (oldValues && oldValues[index]?.checkAll)) {
            form.parent_permission[index].menus.forEach((menu: any) => {
              menu.check = newVal.checkAll
            })
          }
        })
      },
      { deep: true }
    )*/

  function onCancel() {
    router.push({ name: "PermissionSettingList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  const onSubmit = async () => {
    isLoading.value = true

    const id = route.params.id as string

    const permission: { sub_permission_id: number; actions: Record<string, boolean> }[] = []

    form.permission_all.forEach((item) => {
      item.sub_permission.forEach((subPerm) => {
        const hasTrue = Object.values(subPerm.actions).includes(true)
        if (hasTrue) {
          permission.push({
            sub_permission_id: subPerm.id,
            actions: Object.fromEntries(Object.entries(subPerm.actions).filter(([, v]) => v === true)) as Record<
              string,
              boolean
            >
          })
        }
      })
    })

    const forbiddenChars = /[^a-zA-Z0-9\u4e00-\u9fa5]/

    if (form.name === "") {
      errorMsg("common.please_enter_name")
      return
    } else if (form.name.length < 4) {
      errorMsg("error_msg.enter_name_four_characters_error")
      return
    } else if (permission.length <= 0) {
      errorMsg("error_msg.please_check_permissions")
      return
    }
    const targetExport = [PERMISSION.Enums.A_F_USER_ACTION_LOG, PERMISSION.Enums.A_F_FREE_ROUND_SETTING]
    const targetEdit = [
      PERMISSION.Enums.A_M_WEBSITE_ANALYTICS_MANAGEMENT,
      PERMISSION.Enums.A_F_COLLABORATION_SETTLEMENT_DETAIL
    ]

    const sendData = {
      id: parseInt(id),
      name: form.name,
      remark: form.remark,
      permission: permission
    }
    sendData.permission.forEach((item) => {
      if (targetExport.includes(item.sub_permission_id)) {
        delete item.actions.export
      }
      if (targetEdit.includes(item.sub_permission_id)) {
        delete item.actions.edit
      }
    })

    const apiFunc = type === "edit" ? updateAdminAccountPermissionDetail : addAdminAccountPermission
    const { search, status } = useSearch(apiFunc)
    await search(sendData)
    if (status.value) {
      router.push({ name: "PermissionSettingList" })

      if (type === "edit") {
        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top",
          timeout: 300
        })
      } else {
        $q.notify({
          type: "positive",
          message: t("message.add_success"),
          position: "top",
          timeout: 300
        })
      }
      setTimeout(() => {
        history.go(0)
      }, 2000)
    }

    isLoading.value = false
  }
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
    isLoading.value = false
  }
  function goBack() {
    router.back()
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
  ::v-deep(.q-checkbox__inner) {
    font-size: 36px;
  }
  .custom-edit {
    width: 60%;
    display: flex;
    justify-content: end;
  }

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
  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  .group-box {
    padding: 1rem;
  }

  .group-title {
    font-weight: bold;
    color: #555;
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
  }
</style>
