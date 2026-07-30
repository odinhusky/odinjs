<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md" style="width: 880px">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.edit_ip_whitelist") }}</div>
        </q-card-section>
        <q-card-section>
          <q-separator />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <!-- <div class="col-10">
              <q-input
                v-model="form.group_name"
                outlined
                type="text"
                stack-label
                :label="$t('table_header.group_name')"
              />
            </div>
            <div class="col-2">
              <div class="enable">
                <q-toggle
                  v-model="form.enable_or_disable"
                  :color="form.enable_or_disable ? 'positive' : 'negative'"
                  :false-value="0"
                  :true-value="1"
                  stack-label
                  :label="form.enable_or_disable ? $t('common.enable') : $t('common.disable')"
                />
              </div>
            </div> -->

            <div class="col-12 q-pt-xl">
              <q-input v-model="form.remark" type="textarea" outlined stack-label :label="$t('table_header.remark')" />
            </div>
            <div class="col-12 q-pt-xl">
              <q-input v-model="form.ip_list" outlined stack-label :label="$t('common.ip_input')" />
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
  import { ref, reactive, onMounted } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"

  import { useSearch } from "@/hook/useSearch"
  import { getIpWhiteListDetail, updateIpWhiteListDetail } from "@/api/systemSettings"

  import type { IpWhiteListItem } from "@/api/response.type"
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const form = reactive<IpWhiteListItem>({
    id: 0,
    group_name: "",
    creation_date: 0,
    enable_or_disable: 0,
    remark: "",
    ip_list: ""
  })

  function goBack() {
    router.back()
  }

  const { search, isSuccess, tableData } = useSearch(getIpWhiteListDetail)

  onMounted(() => {
    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
        form.remark = tableData.value.remark
        form.ip_list = tableData.value.ip_address
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  function onCancel() {
    router.push({ name: "IpWhiteList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  const onSubmit = async () => {
    isLoading.value = true
    const id = route.params.id as string
    const sendData = {
      id: parseInt(id),
      remark: form.remark,
      ip: form.ip_list
    }
    const res = await updateIpWhiteListDetail(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      router.push({ name: "IpWhiteList" })
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

  .bg-transparent {
    box-shadow: none;
    background-color: transparent;
  }

  .enable {
    border: 1px solid #c2c2ca;
    border-radius: 6px;
    padding: 7px 25px 3px 0px;
  }
</style>
