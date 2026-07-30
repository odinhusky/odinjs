<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.agent_information") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.agent_information") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.agent_code" outlined readonly stack-label :label="$t('table_header.agent_ID')" />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.display_name"
                outlined
                readonly
                stack-label
                :loading="spinShow"
                :label="$t('table_header.agent_account')"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.password"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.password')"
                type="password"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.confirm_password"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.confirm_password')"
                type="password"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.title"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.agent_name')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.contact"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('common.contact_person')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.mobile"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('query_params.phone')"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.email"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.email')"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.remark"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.remark')"
              />
            </div>

            <div class="col-4">
              <span>{{ $t("table_header.enable_or_disable") }}</span>
              <div class="enable">
                <q-toggle
                  v-model="form.enabled"
                  :color="form.enabled ? 'positive' : 'negative'"
                  :false-value="false"
                  :true-value="true"
                  stack-label
                  map-options
                  :loading="spinShow"
                  :label="form.enabled ? $t('common.enable') : $t('common.disable')"
                />
              </div>
            </div>
            <div class="col-4">
              <span style="display: block">{{ $t("table_header.status") }}</span>
              <q-btn-toggle
                v-model="form.is_ban"
                toggle-color="main-color"
                map-options
                :options="[
                  { label: t('common.un_frozen'), value: false },
                  { label: t('common.frozen'), value: true }
                ]"
              />
            </div>
            <div class="col-4">
              <!-- <span style="display: block">{{ $t("table_header.two_factor_auth") }}</span> -->
              <!-- <q-btn-toggle
                v-model="form.unbind_2fa"
                toggle-color="main-color"
                map-options
                :options="[
                  { label: t('common.binding'), value: false },
                  { label: t('common.not_bound'), value: true }
                ]"
              />-->
              <!-- <q-btn color="primary" :label="$t('common.unbind')" @click="onUnbind" /> -->
            </div>
            <!--<div class="col-4 col-md-3 col-lg-auto">
              <q-toggle
                v-model="form.binding"
                :color="form.binding ? 'negative' : 'positive'"
                :false-value="0"
                :true-value="1"
                keep-color
                stack-label
                :loading="spinShow"
                :label="form.binding ? $t('common.binding') : $t('common.not_bound')"
              />
            </div>-->
          </div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <!-- 可開幣別 -->
          <SelectAllOptionGroup
            :parent-value="form.currency_ids"
            :group-options="currencyList"
            :select-all-label="$t('btn.select_all')"
            :title="$t('common.available_currencies')"
            @update:parentValue="handelCurrencyTags"
            :disableArray="form.disableArray"
            v-if="queryStore.currencyList.length"
          />
        </q-card-section>

        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section class="q-pb-xs" v-if="!spinShow">
          <SelectAllOptionGroup
            :parent-value="form.product_code_list"
            :group-options="productTag"
            :title="$t('table_header.product_setting')"
            @update:parentValue="handelproductTag"
          />
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
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"

  import {
    GetAgencyManagementDetail,
    UpdateAgencyManagementDetail,
    UpdateAgencyManagementUnbind
  } from "@/api/agencyManagement"

  import type { agencyManagementListItem } from "@/api/response.type"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { CURRENCY_TYPE } from "@/utils/constants"

  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "src/hook/useDialog"
  import { useQueryStore } from "@/stores/queryStore"
  import { getProductDropdown } from "@/api/product"

  const queryStore = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const tagLoading = ref(false)
  const form = reactive<agencyManagementListItem>({
    id: 0,
    agent_code: "",
    parent_id: 0,
    display_name: "",
    password: "",
    confirm_password: "",
    layer_id: 0,
    title: "",
    contact: "",
    mobile: "",
    email: "",
    remark: "",
    enabled: true,
    is_ban: true,
    is_running: true,
    unbind_2fa: true,
    created_at: "",
    user_id: 0,
    currency_ids: [],
    disableArray: [],
    product_code_list: []
  })

  function goBack() {
    router.back()
  }

  interface GameTag {
    label: string
    value: number
  }

  interface productItem {
    product_code: number
    product_name: string
    game_type: string
  }
  const productTag = reactive<GameTag[]>([])

  const handelCurrencyTags = (value: number[]) => {
    form.currency_ids = value
  }
  const { search, spinShow, isSuccess, tableData } = useSearch(GetAgencyManagementDetail)

  onMounted(async () => {
    const id = route.params.id as string
    //getCurrency()
    await queryStore.getCurrencyList()

    const { data }: { data: productItem[] } = await getProductDropdown()
    const fliterProducts = Array.from(new Set(data.map((p) => p.product_code))).map((code) => {
      return data.find((p) => p.product_code === code)
    })
    if (fliterProducts.length > 0) {
      for (const product of fliterProducts) {
        const newItem = {
          label: product?.product_name,
          value: product?.product_code
        } as GameTag
        productTag.push(newItem)
      }
    } else {
      productTag.length = 0
    }

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }

        form.agent_code = tableData.value.agent_code
        form.parent_id = tableData.value.parent_id
        form.display_name = tableData.value.display_name
        form.password = tableData.value.password
        form.layer_id = tableData.value.layer_id
        form.title = tableData.value.title
        form.contact = tableData.value.contact
        form.mobile = tableData.value.mobile
        form.email = tableData.value.email
        form.remark = tableData.value.remark
        form.enabled = tableData.value.enabled
        form.is_running = tableData.value.is_running
        form.created_at = tableData.value.created_at
        form.user_id = tableData.value.user_id
        form.currency_ids = tableData.value.currency_ids
        // 已選的幣別無法更新非選幣別 做 disable 用
        form.disableArray = tableData.value.currency_ids
        form.is_ban = tableData.value.is_ban
        form.unbind_2fa = tableData.value.unbind_2fa
        form.product_code_list = tableData.value.product_code_list ? tableData.value.product_code_list : []
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })
  const handelproductTag = (value: []) => {
    form.product_code_list = value
  }

  function onCancel() {
    router.push({ name: "AgencyOperationManagementList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  const rule = /^[a-zA-Z0-9]{4,}$/

  const onSubmit = async () => {
    isLoading.value = true
    const id = route.params.id as string

    const sendData = {
      id: parseInt(id),
      password: form.password,
      title: form.title,
      contact: form.contact,
      mobile: form.mobile,
      email: form.email,
      remark: form.remark,
      enabled: form.enabled,
      is_ban: form.is_ban,
      unbind_2fa: form.unbind_2fa,
      currency_ids: form.currency_ids,
      product_code_list: form.product_code_list
    }
    if (form.password) {
      if (!rule.test(form.password)) {
        errorMsg("error_msg.enter_agent_password_error")
        return
      } else if (form.confirm_password !== form.password) {
        errorMsg("common.confirm_password_error")
        return
      }
    }
    const res = await UpdateAgencyManagementDetail(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "AgencyOperationManagementList" })
      isLoading.value = false
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
  function errorMsg(msg: string) {
    $q.notify({
      type: "negative",
      message: t(msg),
      position: "top",
      timeout: 1000
    })
    isLoading.value = false
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

    const res = await UpdateAgencyManagementUnbind(dialogData.unbind)
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
  const currencyList = computed(() => {
    return queryStore.currencyList.map((e) => {
      const label = CURRENCY_TYPE.Enums[e.value as CURRENCY_TYPE.Enums]
      const value = e.value
      return { label, value }
    })
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  .enable {
    width: 47%;
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding-right: 20px;
  }
  .q-btn-group {
    box-shadow: none;
    border: 1px solid #6e39cb;
  }
</style>
