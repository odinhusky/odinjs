<template>
  <div class="q-pl-md q-pt-md q-pr-md">
    <SubPage action-label-i18n-key="btn.add" />
  </div>

  <div class="q-pa-md">
    <q-card class="q-mx-auto editWrapper q-px-lg">
      <q-form>
        <q-card-section>
          <div class="text-h5 text-bold text-dark" v-if="!isEditMode">{{ t("btn.add") }}</div>
          <div class="text-h5 text-bold text-dark" v-else>{{ t("btn.edit") }}</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-separator />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.currency") }}</div>
            <div class="text-bold row items-center edit-input">
              <q-select
                v-model="formData.currency_id"
                :options="queryStore.currencyList"
                class="edit-select"
                outlined
                dense
                emit-value
                map-options
                :disable="isEditMode"
                standout="bg-white text-black"
                :option-label="(item) => (item && item.label ? t(`${item.label}`) : item.value)"
              />
            </div>
          </div>
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.alert_interval") }}</div>
            <div class="text-bold row items-center edit-input">
              <q-select
                v-model="formData.schedule_type"
                :options="[
                  { label: t('edit_form.realtime'), value: 1 },
                  { label: t('edit_form.daily'), value: 2 }
                ]"
                class="edit-select"
                emit-value
                map-options
                outlined
                dense
                standout="bg-white text-black"
              />
              <template v-if="formData.schedule_type === 2">
                <q-select
                  v-model="formData.alert_interval_hour"
                  :options="hourOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black "
                  class="q-ml-md"
                />
                <span class="q-ml-sm q-mr-sm">:</span>
                <q-select
                  v-model="formData.alert_interval_min"
                  :options="minuteOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  standout="bg-white text-black"
                />
              </template>
            </div>
          </div>
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.alert_lower_limit") }}</div>
            <div class="text-bold row items-center edit-input">
              <q-input
                type="number"
                v-model.trim="formData.lower_limit"
                outlined
                dense
                class="edit-select"
                standout="bg-white text-black"
              />
            </div>
          </div>
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.alert_upper_limit") }}</div>
            <div class="text-bold row items-center edit-input">
              <q-input
                type="number"
                v-model.trim="formData.upper_limit"
                outlined
                dense
                class="edit-select"
                standout="bg-white text-black"
              />
            </div>
          </div>
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.notification_content") }}</div>
            <div class="text-bold column edit-input">
              <q-input
                type="textarea"
                v-model.trim="formData.notification_message"
                outlined
                dense
                class="edit-select"
                standout="bg-white text-black"
                :maxlength="100"
              />
              <!-- 警告文字 -->
              <div v-if="formData.notification_message.length >= 100" class="text-negative text-caption q-mt-sm">
                {{ t("error_msg.can_enter_characters", { count: 100 }) }}
              </div>
            </div>
          </div>
          <div class="row items-center q-pt-lg q-pl-md">
            <div class="q-mr-md text-bold">{{ t("table_header.exclusion_list") }}</div>
            <div class="text-bold row items-center edit-input">
              <q-select
                v-model="formData.exclude_list"
                :options="accountOption"
                use-input
                use-chips
                multiple
                fill-input
                input-debounce="300"
                emit-value
                map-options
                @filter="filterAccount"
                outlined
                square
                borderless
                dense
                bottom-slots
                class="edit-select"
              >
                <template v-slot:append>
                  <q-icon name="search" @click.stop.prevent />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <!-- btns -->
        <q-card-actions class="q-mt-xl q-py-md" align="center">
          <q-btn color="main-color" class="col-2" size="md" type="btn" @click="handleSubmit()" :loading="isLoading">{{
            t("btn.save")
          }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import { useQueryStore } from "@/stores/queryStore"
  import SubPage from "layouts/SubPage/Index.vue"
  import { useI18n } from "vue-i18n"
  import { useRoute } from "vue-router"
  import { getMemberList, addWarringSetting, editWarringSetting, getWarringDetail } from "@/api/warningSetting"
  import { useSearch } from "@/hook/useSearch"

  import type { GetReferralCommissionSettingList } from "@/api/request.type"
  const router = useRouter()
  const route = useRoute()
  const queryStore = useQueryStore()
  const { t } = useI18n()
  const id = computed(() => Number(route.params.id) || 0)

  const isLoading = ref(false)
  const $q = useQuasar()

  const isEditMode = computed(() => {
    const routeName = route.name as string
    return routeName.toLowerCase().includes("edit")
  })

  const formData = ref({
    currency_id: 0,
    schedule_type: 1,
    schedule_trigger_time: "",
    alert_interval_hour: "00",
    alert_interval_min: "00",
    lower_limit: 0,
    upper_limit: 0,
    notification_message: "",
    exclude_list: [],
    setting_id: 0
  })
  const hourOptions = Array.from({ length: 25 }, (b, i) => {
    const label = i.toString().padStart(2, "0")
    return { label, value: label }
  })
  const minuteOptions = Array.from({ length: 60 }, (b, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0")
  }))
  interface StringOption {
    label: string
    value: number
  }
  const accountOption = ref<StringOption[]>([])

  onMounted(async () => {
    await queryStore.getCurrencyList()
    formData.value.currency_id = queryStore.currencyList[0].value
    if (id.value) {
      await handleGetDetail(id.value)
    } else {
      //initCmsForm(CMS_TYPE.Enums.HOME)
    }
  })

  async function handleGetDetail(id: number) {
    const { search, status, tableData } = useSearch(getWarringDetail)
    isLoading.value = true
    await search(id)
    isLoading.value = false

    if (status.value) {
      formData.value.currency_id = tableData.value.currency_id
      formData.value.schedule_type = tableData.value.schedule_type
      formData.value.schedule_trigger_time = tableData.value.schedule_trigger_time
      const [hour, minute, second] = formData.value.schedule_trigger_time.split(":")
      formData.value.alert_interval_hour = hour
      formData.value.alert_interval_min = minute
      formData.value.lower_limit = tableData.value.lower_limit
      formData.value.upper_limit = tableData.value.upper_limit
      formData.value.notification_message = tableData.value.notification_message
      ;(tableData.value.exclude_list ?? []).forEach((item: { member_account: string; member_id: number }) => {
        accountOption.value.push({
          label: item.member_account,
          value: item.member_id
        })
        formData.value.exclude_list.push(item.member_id as never)
      })
      formData.value.setting_id = id
      console.log(tableData.value)
    }
  }

  const filterAccount = async (val: string, update: Function, abort: Function) => {
    // 若輸入太短，就不要查
    if (!val || val.length < 2) {
      accountOption.value = []
      return
    }

    // debounce 已經在 QSelect 屬性 input-debounce 設為 300ms (可調)
    update(async () => {
      const list = await getMember(val)
      accountOption.value = list.map((item: any) => ({
        label: item.account,
        value: item.id
      }))
    })
  }

  const getMember = async (name: string) => {
    const sendData = {
      account: name + "%"
    }
    const { data } = await getMemberList(sendData)
    return (data as unknown as { list: { id: number; account: string }[] })?.list || []
  }

  const handleSubmit = async () => {
    const { search, status } = useSearch(isEditMode.value ? editWarringSetting : addWarringSetting)

    isLoading.value = true
    if (formData.value.lower_limit <= 0) {
      notifyError("error_msg.please_enter_lower_limit")
      return false
    }

    if (formData.value.upper_limit <= 0) {
      notifyError("error_msg.please_enter_upper_limit")
      return false
    }

    if (Number(formData.value.lower_limit) === Number(formData.value.upper_limit)) {
      notifyError("error_msg.the_upper_alarm_equal")
      return false
    }

    if (Number(formData.value.lower_limit) > Number(formData.value.upper_limit)) {
      notifyError("error_msg.the_lower_alarm_limit")
      return false
    }

    if (!formData.value.notification_message) {
      notifyError("error_msg.please_enter_notification_content")
      return false
    }

    /* if (formData.value.exclude_list.length === 0) {
      notifyError("error_msg.please_enter_the_exclusion_list")
      return false
    }*/
    await search(formData.value)
    isLoading.value = false
    if (status.value) {
      if (isEditMode.value) {
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

      router.push({ name: "AlertSettingsList" })

      /*if (routerName) {
        router.push({ name: "" })
        return
      }*/
    }
  }
  const notifyError = (msgKey: string) => {
    $q.notify({
      type: "negative",
      message: t(msgKey),
      position: "top",
      timeout: 1000
    })
    isLoading.value = false
  }
</script>

<style lang="scss" scoped>
  .edit-input {
    width: 75%;
    .edit-select {
      width: 40%;
    }
  }
</style>
