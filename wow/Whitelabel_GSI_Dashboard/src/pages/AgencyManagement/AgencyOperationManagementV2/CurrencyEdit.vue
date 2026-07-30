<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("table_header.platform_currency") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section>
          <div class="lang-container column">
            <div class="langs row items-start">
              <!-- 左側固定寬度標題 -->
              <div class="title self-start q-mr-md q-pt-sm" style="min-width: 100px">
                {{ $t("edit_form.open_currency") }}
              </div>

              <!-- 右側 checkbox，換行排版 -->
              <div class="row q-gutter-sm" style="flex-wrap: wrap; max-width: 700px">
                <q-checkbox
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :val="item.value"
                  :disable="form.disableArray ? disableValue(item.value) : false"
                  v-model="form.currency_ids"
                  class="uppercase-label"
                />
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
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"

  import { GetAgencyManagementDetail, UpdateAgencyManagementDetail } from "@/api/agencyManagement"

  import type { agencyManagementListItem } from "@/api/response.type"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { useQueryStore } from "@/stores/queryStore"

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

  const { search, spinShow, isSuccess, tableData } = useSearch(GetAgencyManagementDetail)

  onMounted(async () => {
    const id = route.params.id as string
    //getCurrency()
    await queryStore.getCurrencyList()

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
        form.currency_ids = tableData.value.currency_ids ? tableData.value.currency_ids : []
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

  const disableValue = (value: number) => Array.isArray(form.disableArray) && form.disableArray.includes(value)

  function onCancel() {
    router.push({ name: "AgencyOperationManagementList_v2" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)

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

    const res = await UpdateAgencyManagementDetail(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "AgencyOperationManagementList_v2" })
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
