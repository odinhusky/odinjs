<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.edit_general_agency_management") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.general_agent_information") }}</div>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                v-model="form.master_agent_ID"
                outlined
                readonly
                stack-label
                :label="$t('table_header.master_agent_ID')"
                disable
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.master_agent_account"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.master_agent_account')"
                disable
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.password"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.password')"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.confirm_password"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.confirm_password')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.master_agent_name"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('table_header.master_agent_name')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.contact_person"
                outlined
                stack-label
                :loading="spinShow"
                :label="$t('common.contact_person')"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="form.phone"
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
            <div class="col-4 col-md-3 col-lg-auto">
              <q-toggle
                v-model="form.enable_or_disable"
                :color="form.enable_or_disable ? 'positive' : 'negative'"
                :false-value="false"
                :true-value="true"
                stack-label
                map-options
                :loading="spinShow"
                :label="form.enable_or_disable ? $t('common.enable') : $t('common.disable')"
              />
            </div>
            <div class="col-4 col-md-3 col-lg-auto">
              <q-toggle
                v-model="form.account_frozen"
                :color="form.account_frozen ? 'negative' : 'positive'"
                :false-value="false"
                :true-value="true"
                keep-color
                stack-label
                :loading="spinShow"
                :label="form.account_frozen ? $t('common.frozen') : $t('common.un_frozen')"
              />
            </div>
            <div class="col-4 col-md-3 col-lg-auto">
              <!-- <q-toggle
                v-model="form.binding"
                :color="form.binding ? 'negative' : 'positive'"
                :false-value="false"
                :true-value="true"
                keep-color
                stack-label
                :loading="spinShow"
                :label="form.binding ? $t('common.binding') : $t('common.not_bound')"
              /> -->

              <!-- <q-btn color="primary" :label="$t('common.unbind')" @click="onUnbind" /> -->
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("common.available_currencies") }}</div>
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <!-- 可開幣別 -->
          <SelectAllOptionGroup
            :parent-value="form.currency"
            :group-options="currencyList"
            :select-all-label="$t('btn.select_all')"
            @update:parentValue="handelCurrencyTags"
            :disableArray="form.disableArray"
          />
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <div class="text-h6 text-bold">{{ $t("table_header.product_setting") }}</div>
        </q-card-section>
        <q-card-section class="q-pb-xs">
          <!-- 产品设定 -->
          <SelectAllOptionGroup
            :parent-value="form.product"
            :group-options="productTag"
            :select-all-label="$t('btn.select_all')"
            @update:parentValue="handleProductTags"
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
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { getSingleGeneralAgencyManagement, UpdateSingleGeneralAgencyManagement } from "@/api/generalAgencyManagement"
  import type { GetSingleGeneralAgencyManagementItem } from "@/api/response.type"
  import type { updateSingleGeneralAgencyManagement } from "@/api/request.type"
  import { getCurrencyList } from "@/api/common"
  import { getProductDropdown } from "@/api/product"
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  interface newItemType {
    label: string
    value: number
  }

  interface productItem {
    product_code: number
    product_name: string
    game_type: string
  }

  const form = reactive<GetSingleGeneralAgencyManagementItem>({
    id: 0,
    master_agent_ID: "",
    master_agent_account: "",
    master_agent_name: "",
    password: "",
    confirm_password: "",
    contact_person: "",
    phone: "",
    email: "",
    remark: "",
    enable_or_disable: 0,
    account_frozen: 0,
    binding: 0,
    currency: [],
    disableArray: [],
    product: []
  })
  interface GameTag {
    label: string
    value: number
  }
  const currencyList = reactive<newItemType[]>([])
  const productTag = reactive<GameTag[]>([])
  const getCurrency = async () => {
    const { data } = await getCurrencyList()

    if (!data || !Object.keys(data).length) {
      currencyList.length = 0
      return
    }
    for (const [currency, value] of Object.entries(data)) {
      const newItem = {
        label: currency,
        value: value
      } as newItemType
      currencyList.push(newItem)
    }
  }

  const getProduct = async () => {
    const { data }: { data: productItem[] } = await getProductDropdown()

    if (data.length > 0) {
      for (const product of data) {
        const newItem = {
          label: product.product_name,
          value: product.product_code
        } as newItemType
        productTag.push(newItem)
      }
    } else {
      productTag.length = 0
    }
  }

  const handelCurrencyTags = (value: number[]) => {
    form.currency = value
  }
  const handleProductTags = (value: number[]) => {
    form.product = value
  }
  function goBack() {
    router.back()
  }
  const { search, spinShow, isSuccess, tableData } = useSearch(getSingleGeneralAgencyManagement)

  onMounted(async () => {
    const id = route.params.id as string
    await Promise.all([getCurrency(), getProduct(), search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }

        form.master_agent_ID = tableData.value.agent_code
        form.master_agent_account = tableData.value.display_name
        form.master_agent_name = tableData.value.title
        form.contact_person = tableData.value.contact
        form.phone = tableData.value.mobile
        form.email = tableData.value.email
        form.remark = tableData.value.remark
        form.enable_or_disable = tableData.value.enabled
        form.account_frozen = tableData.value.is_ban
        form.binding = tableData.value.unbind_2fa
        form.currency = tableData.value.currency_list
        // 已選的幣別無法更新非選幣別 做 disable 用
        form.disableArray = tableData.value.currency_list
        form.product = tableData.value.product_code_list
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  function onCancel() {
    router.push({ name: "GeneralAgencyManagementList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)

  const onSubmit = async () => {
    isLoading.value = true
    form.id = Number(route.params.id as string)
    const params: updateSingleGeneralAgencyManagement = {
      ...form,
      enable_or_disable: Boolean(form.enable_or_disable),
      account_frozen: Boolean(form.account_frozen),
      binding: Boolean(form.binding)
    }
    const res = await UpdateSingleGeneralAgencyManagement(params)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "GeneralAgencyManagementList" })
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
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
