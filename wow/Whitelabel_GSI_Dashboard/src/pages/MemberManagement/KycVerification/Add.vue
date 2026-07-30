<template>
  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg q-py-md" style="width: 500px">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark">{{ $t("common.add_tag") }}</div>
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-separator />
        </q-card-section>

        <q-card-section>
          <div class="col q-col-gutter-md">
            <q-card class="my-card col-12 bg-transparent">
              <q-card-section class="text-black q-pa-xs">
                <div>{{ $t("table_header.status") }}</div>
              </q-card-section>
              <q-card-actions class="full-width" align="left" style="padding: 0">
                <div class="enable">
                  <q-toggle
                    v-model="form.enableStatus"
                    :color="form.enableStatus ? 'positive' : 'negative'"
                    :false-value="false"
                    :true-value="true"
                    stack-label
                    :label="form.enableStatus ? $t('common.enable') : $t('common.disable')"
                  />
                </div>
              </q-card-actions>
            </q-card>
            <div class="col-12">
              <q-select
                v-model="form.memberTagType"
                :label="$t('table_header.tag_category')"
                outlined
                stack-label
                :options="dropdownData.memberTagTypeList"
                map-options
                emit-value
              />
            </div>

            <div class="col-12">
              <q-input v-model="form.name" outlined type="text" stack-label :label="$t('table_header.name')" />
            </div>



            <div class="col-12">
              <q-input v-model="form.remark" outlined stack-label :label="$t('table_header.remark')" />
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
  import { useQueryStore } from "@/stores/queryStore"
  import { MEMBER_TAG_TYPE } from "@/utils/constants"
  import type { GetMemberTagDetail } from "@/api/request.type"
  import { addMemberTag } from "@/api/member"

  const store = useQueryStore()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  interface IDropdownItem<T> {
    label: string
    value: T
  }

  let dropdownData = reactive({
    memberTagTypeList: [] as IDropdownItem<number>[]
  })
  const checkBox = ref(false)
  const form = reactive<GetMemberTagDetail>({
    id: 0,
    memberTagType: 1,
    enableStatus: true,
    name: "",
    remark: ""
  })

  function goBack() {
    router.back()
  }

  onMounted(() => {
    const id = route.params.id as string
    store.getMemberTagType()
    store.memberTagType.forEach((tagType) => {
      dropdownData.memberTagTypeList.push({
        label: t((MEMBER_TAG_TYPE.I18nKeys as any)[tagType] || "common.unknow"),
        value: tagType
      })
    })
  })

  function onCancel() {
    router.push({ name: "MemberTagList" })
  }

  const $q = useQuasar()
  const isLoading = ref(false)
  const onSubmit = async () => {
    isLoading.value = true

    if (form.name === "") {
      $q.notify({
        type: "negative",
        message: t("common.please_enter_name"),
        position: "top",
        timeout: 1000
      })
      isLoading.value = false
      return
    }

    const sendData = {
      memberTagType: form.memberTagType,
      name: form.name,
      enableStatus: form.enableStatus,
      remark: form.remark
    }

    const res = await addMemberTag(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })
      setTimeout(() => {
        router.push({ name: "MemberTagList" })
        isLoading.value = false
      }, 500)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }

    isLoading.value = false
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
    border-radius: 12px;
    padding: 7px 25px 3px 0px;
    width: 100%;
  }
</style>
