<template>
  <div class="q-pl-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>
  <div class="q-pa-md" style="padding-top: 0px">
    <q-card class="editWrapper_v2 bg-white">
      <q-form>
        <q-card-section>
          <div class="bold h1-bold text-center grey">{{ $t("common.add_tag") }}</div>
        </q-card-section>
        <q-card-section style="max-width: 63.75rem; margin: 0 auto">
          <div class="row q-col-gutter-md">
            <!-- 凍結 -->
            <div class="col-6">
              <span style="display: block">{{ $t("table_header.status") }}</span>
              <div class="q-mt-sm">
                <q-btn-toggle
                  v-model="form.enableStatus"
                  :hide-bottom-space="true"
                  class="btn_toggle_style"
                  toggle-color="primary"
                  unelevated
                  rounded
                  map-options
                  :options="[
                    { label: $t('common.disable'), value: false },
                    { label: $t('common.enable'), value: true }
                  ]"
                />
              </div>
            </div>
            <div class="col-6">
              <span>{{ $t("table_header.tag_category") }}</span>
              <div class="q-mt-sm">
                <q-select
                  v-model="form.memberTagType"
                  outlined
                  stack-label
                  :options="dropdownData.memberTagTypeList"
                  map-options
                  emit-value
                  class="default-input"
                />
              </div>
            </div>
            <div class="col-6">
              <span>{{ $t("table_header.name") }}</span>
              <div class="q-mt-sm">
                <q-input v-model="form.name" outlined type="text" stack-label class="default-input" />
              </div>
            </div>
            <div class="col-6">
              <span>{{ $t("table_header.remark") }}</span>
              <div class="q-mt-sm">
                <q-input v-model="form.remark" outlined stack-label class="default-input" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="center">
          <q-btn color="main-color" outline @click="onCancel" class="edit_btns">{{ $t("btn.cancel") }}</q-btn>

          <q-btn color="main-color" @click="onSubmit" :loading="isLoading" class="edit_btns q-ml-md">{{
            $t("btn.check")
          }}</q-btn>
        </q-card-section>
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
  import SubPage from "layouts/SubPage/Index.vue"

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
</style>
