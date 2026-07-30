<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section class="q-pt-xs">
      <div class="row q-col-gutter-md">
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
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <div class="row q-col-gutter-md">
        <div v-for="item in parent_permission.list" :key="item.id" class="col-6 q-mb-md">
          <div class="flex-column-top">
            <div class="custom-box">
              <div class="custom-box-label h4-bold bold q-mb-sm">
                {{ $t(PERMISSION.I18nKeys[item.id as PERMISSION.Enums] || "common.unknow") }}
              </div>
            </div>
          </div>
          <div class="flex-column ckeckbox-style">
            <div v-for="menu in item.sub_permission" :key="menu.id" class="custom-box2">
              <span class="h6-bold">
                {{ $t(PERMISSION.I18nKeys[menu.id as PERMISSION.Enums] || "common.unknow") }}
              </span>
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

    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color" class="edit_btns" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, defineEmits } from "vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"
  import type { adminAccountItem, adminAccountPermissionItem } from "@/api/response.type"
  import { getAdminAccountPermissionDetail, getAdminAccountPermission } from "@/api/adminAccount"
  import { PERMISSION } from "@/utils/constants"
  import { useSearch } from "@/hook/useSearch"
  interface IDropdownItem<T> {
    label: string
    value: T
  }
  let dropdownData = reactive({
    permissionLevelList: [] as IDropdownItem<number>[]
  })

  interface Permission {
    id: number
    name: string
    sub_permission: [{ id: number; actions: { edit: string; view: string; export: string } }]
  }

  const store = useQueryStore()
  const { t } = useI18n()
  const { nextPrevStep } = useStepper()
  const emits = defineEmits(["step2Submit"])
  const form = reactive<{ role_id: number }>({
    role_id: 0
  })
  /* const fake = reactive([
      {
        main: "account_management",
        editAll: false,
        checkAll: false,
        menus: [
          { name: "backoffice_account", edit: false, check: false },
          { name: "permission_setting", edit: false, check: false },
          { name: "user_action_log", edit: false, check: false }
        ]
      },
      {
        main: "product",
        editAll: false,
        checkAll: false,
        menus: [
          { name: "product_switch", edit: false, check: false },
          { name: "game_entrance_settings", edit: false, check: false },
          { name: "product_maintenance_settings", edit: false, check: false }
        ]
      }
    ] as Permission[])*/
  let permissionList: adminAccountPermissionItem[] = reactive([])

  //let parent_permission: Permission[] = reactive([])

  const parent_permission = reactive<{
    list?: Permission[]
  }>({
    list: [] as Permission[]
  })
  onMounted(() => {
    //取得權限設定列表
    getPermissionList()
  })
  const getPermissionList = async () => {
    const sendData = { name: "", offset: 0, size: 100 }
    const { data } = await getAdminAccountPermission(sendData)

    if (!data || !Object.keys(data).length) {
      return
    }
    /*var test = [
        {
          id: 1,
          name: "finance13",
          perm_count: 1,
          status: 1,
          remark: "report only"
        }
      ]*/
    Object.assign(permissionList, data.list)
    //取得下拉內容
    permissionList.forEach((item) => {
      dropdownData.permissionLevelList.push({
        label: item.name,
        value: item.id
      })
    })
    form.role_id = permissionList[0].id

    //取得該筆的權限內容
    getPermissionDetail()
  }
  const updateLevel = (id: number) => {
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

  function onSubmit() {
    emits("step2Submit", form.role_id)
  }
</script>

<style lang="scss" scoped>
  .p_select {
    display: flex;
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
  .green {
    color: #26bf94;
  }
  .red {
    color: #ff4343;
  }
  ::v-deep(.q-checkbox.disabled) {
    opacity: 1 !important;
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
