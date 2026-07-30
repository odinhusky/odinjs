<template>
  <div class="q-pr-md q-pl-md q-pb-md">
    <q-card class="editWrapper_v2 bg-white">
      <q-form style="padding-left: 6%; padding-right: 6%; max-width: 73rem" class="q-mx-auto">
        <q-card-section class="q-pt-lg">
          <div class="bold h1-bold text-center grey">{{ $t("menu.kyc_verification") }}</div>
        </q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <span class="label text-left">{{ $t("kyc_common.receipt_seq") }} : {{ form.number }}</span>
          </div>
          <div class="col-6">
            <span class="label text-left">{{ $t("website_settings_reg.account") }} : {{ form.member_account }}</span>
          </div>
          <div class="col-6">
            <span class="label text-left">{{ $t("kyc_common.phone_no") }} : {{ form.phone_number }}</span>
          </div>
          <div class="col-6">
            <span class="label text-left">{{ $t("website_settings_reg.email") }} : {{ form.email }}</span>
          </div>
        </div>
        <div class="h4-bold bold grey q-mb-md">{{ $t("kyc_common.KYC_profile") }}</div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.full_name") }}</div>
            <q-input
              disable
              v-model="form.profile.fullName"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.first_name") }}</div>
            <q-input
              disable
              v-model="form.profile.first_name"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.middle_name") }}</div>
            <q-input
              disable
              v-model="form.profile.middle_name"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.last_name") }}</div>
            <q-input
              disable
              v-model="form.profile.last_name"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.nationality") }}</div>
            <q-input
              disable
              v-model="form.profile.nationality"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.date_of_birth") }}</div>
            <q-input
              disable
              v-model="form.profile.date_of_birth"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.place_birth") }}</div>
            <q-input
              disable
              v-model="form.profile.place_of_birth"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.id_type") }}</div>
            <q-input disable v-model="document_type" outlined dense hide-bottom-space class="q-pt-none q-mb-md" />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.id_number") }}</div>
            <q-input
              v-model="form.profile.document_number"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
              :disable="
                ![PROCESS_STATUS.Enums.PROCESS_STATUS_PENDING, PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING].includes(
                  kycStatusDetail
                ) || !isReviewer
              "
            />
          </div>

          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.id_expired_date") }}</div>

            <DateTimePickerSingle
              v-if="
                [PROCESS_STATUS.Enums.PROCESS_STATUS_PENDING, PROCESS_STATUS.Enums.PROCESS_STATUS_PROCESSING].includes(
                  kycStatusDetail
                ) && isReviewer
              "
              class="q-pt-none q-mb-sm"
              :date-time-model="expired_at"
              :with-outlined="true"
              :with-borderless="true"
              :with-dense="true"
              :label="''"
              :on-update-date-time="(value:any) => onDateChange(value)"
            />
            <q-input
              v-else
              v-model="expired_at.dateTime"
              outlined
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
              disable
            />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.source_of_income") }}</div>
            <q-input disable v-model="sourceincome" outlined dense hide-bottom-space class="q-pt-none q-mb-sm" />
          </div>
          <div class="col-6">
            <div class="label text-left">{{ $t("kyc_common.nature_work") }}</div>
            <q-input disable v-model="national" outlined dense hide-bottom-space class="q-pt-none q-mb-sm" />
          </div>
          <div class="col-12">
            <div class="label text-left">{{ $t("kyc_common.current_address") }}</div>
            <q-input
              disable
              v-model="form.currentAddress"
              outlined
              type="textarea"
              autogrow
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
          <div class="col-12">
            <div class="label text-left">{{ $t("kyc_common.permanent_address") }}</div>
            <q-input
              disable
              v-model="form.permanentAddress"
              outlined
              type="textarea"
              autogrow
              dense
              hide-bottom-space
              class="q-pt-none q-mb-sm"
            />
          </div>
        </div>

        <div class="edit_area_style1 q-mb-md">
          <div class="row q-col-gutter-md" style="margin: 0 auto">
            <div class="col-4" v-for="(kycItem, index) in form.documents" :key="index">
              <img :src="`${VITE_APP_DYNAMIC_RESOURCE_URL}/${kycItem.storage_key}`" />
            </div>
          </div>
        </div>
        <div class="row q-col-gutter-md q-mb-md q-mt-">
          <div class="col-12">
            <div class="label text-left">{{ $t("menu.private_remark") }}</div>
            <q-input
              v-model="form.internal_note"
              outlined
              type="textarea"
              dense
              hide-bottom-space
              class="q-pt-none q-mb-md"
              :disable="!isReviewer"
            />
          </div>
          <div class="col-12">
            <div class="label text-left">{{ $t("kyc_common.remark_for_member") }}</div>
            <q-input
              v-model="form.reviewer_comment"
              outlined
              type="textarea"
              dense
              hide-bottom-space
              class="q-pt-none q-mb-md"
              :disable="!isReviewer"
            />
          </div>
        </div>
        <div class="h4-bold bold grey q-mb-md">{{ $t("kyc_common.KYC_review") }}</div>
        <div class="edit_area_style1 q-mb-md">
          <div class="status-selector row justify-center q-gutter-md q-pt-md q-pb-md">
            <div
              v-for="option in statusOptions"
              :key="option.value"
              class="status-card column items-center justify-center"
              :class="{
                active: kycStatus === option.value,
                disabled: !isReviewer
              }"
              @click="isReviewer && changeApproved(option.value)"
            >
              <q-icon :name="option.icon" :color="option.color" size="3rem" />
              <div class="text-subtitle2 q-mt-sm">
                {{ $t(option.label) }}
              </div>
            </div>
          </div>
        </div>
        <q-card-actions class="row q-gutter-md item-center justify-center">
          <q-btn outline color="main-color" class="btnCancel q-mr-md" :label="$t('btn.cancel')" @click="onCancel" />
          <q-btn
            color="main-color"
            class="btnSubmit"
            :label="$t('btn.check')"
            :loading="loading"
            @click="onSubmit"
            v-if="isReviewer"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>

  <!--<q-btn
              color="green"
              class="q-mr-md"
              @click="changeApproved(PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED)"
              :outline="kycStatus !== PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED"
              style="min-width: 7.5rem"
              :disable="!isReviewer"
            >
              <q-icon v-if="kycStatus === PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED" name="check" class="q-mr-xs" />
              {{ $t("kyc_status.approved") }}
            </q-btn>

            <q-btn
              color="red"
              class="q-mr-md"
              @click="changeApproved(PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED)"
              :outline="kycStatus !== PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED"
              style="min-width: 7.5rem"
              :disable="!isReviewer"
            >
              <q-icon v-if="kycStatus === PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED" name="check" class="q-mr-xs" />
              {{ $t("kyc_status.rejecteds") }}
            </q-btn>-->
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, watch } from "vue"
  import { useQuasar } from "quasar"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useSearch } from "@/hook/useSearch"
  import { useCommon } from "@/hook/useCommon"
  import { useImage } from "@/hook/useImage"
  import { useForm } from "@/hook/useForm"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import SubPage from "layouts/SubPage/Index.vue"
  import { KYC_IDTYPE, PROCESS_STATUS, KYC_NATIONAL, KYC_SOURCEINCOME } from "@/utils/constants"
  import { getMemberKycDetail, kycLock, updateMemberKyc } from "@/api/member"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { useSiteStore } from "@/stores/siteStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { useEnv } from "src/hook/useEnv"
  import KycCard from "./component/KycCard.vue"
  import DateTimePickerSingle from "@/components/query/dateTimePickerSingle.vue"

  const $q = useQuasar()
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const { envData } = useEnv()
  const { VITE_APP_BASE_API, VITE_APP_DYNAMIC_RESOURCE_URL } = envData()

  const siteStore = useSiteStore()
  const queryStore = useQueryStore()
  const kycStatus = ref(-1)
  const kycStatusDetail = ref(-1)

  const statusOptions = [
    {
      value: PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED,
      label: "kyc_status.approved",
      color: "positive",
      icon: "check_circle"
    },
    {
      value: PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED,
      label: "kyc_status.rejecteds",
      color: "negative",
      icon: "cancel"
    }
  ]
  const { search, tableData, status } = useSearch(getMemberKycDetail)
  const { formatDate, genTimeFormat } = useCommon()
  const loading = ref(false)

  const form = ref<Response.MemberKycDetailItem>({
    number: "",
    member_account: "",
    phone_number: "",
    email: "",
    status: 0,
    internal_note: "",
    reviewer_comment: "",
    profile: {
      fullName: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      nationality: "",
      date_of_birth: "",
      place_of_birth: "",
      document_type: "",
      document_number: "",
      document_expiry: "",
      source_of_income: "",
      nature_of_work: ""
    },
    addresses: {
      Type: "",
      address_line_1: "",
      address_line_2: ""
    },
    documents: {
      Type: "",
      side: "",
      storage_key: ""
    },
    trace_id: "",
    reviewer_id: "",
    currentAddress: "",
    permanentAddress: "",
    expired_at: { from: "", fromHms: "00:00:00", dateTime: "" }
  })
  const expired_at = reactive({ from: "", fromHms: "00:00:00", dateTime: "" })
  const isImgUploaded = ref(false)

  const canEdit = ref(false)

  const onImgUploaded = () => {
    isImgUploaded.value = true
  }
  // 允許可編輯的證件類型
  const editableDocs = [
    KYC_IDTYPE.Enums.PASSPORT,
    KYC_IDTYPE.Enums.DRIVERS_LICENSE,
    KYC_IDTYPE.Enums.PH_PRC_ID,
    KYC_IDTYPE.Enums.POSTAL_ID,
    KYC_IDTYPE.Enums.PH_BARANGAY_CERTIFICATION,
    KYC_IDTYPE.Enums.PH_ACR_ICR,
    KYC_IDTYPE.Enums.PH_OWWA_ID,
    KYC_IDTYPE.Enums.PH_OFW_ID,
    KYC_IDTYPE.Enums.PH_NBI_CLEARANCE,
    KYC_IDTYPE.Enums.POLICE_CLEARANCE,
    KYC_IDTYPE.Enums.SEAMANS_BOOK,
    KYC_IDTYPE.Enums.PH_FIREARMS_LICENSE
  ]
  const needExpire = computed(() => {
    return editableDocs.includes(form.value.profile.document_type)
  })
  async function onSubmit() {
    if (form.value.profile.document_number === "") {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_id"),
        position: "top",
        timeout: 300
      })
      return
    }
    if (needExpire.value && expired_at.dateTime === "") {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_enter_expiry_date"),
        position: "top",
        timeout: 300
      })
      return
    }
    if (
      kycStatus.value !== PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED &&
      kycStatus.value !== PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED
    ) {
      $q.notify({
        type: "negative",
        message: t("error_msg.please_select_kyc_review"),
        position: "top",
        timeout: 300
      })
      return
    }

    const includeExpiry = !(needExpire.value === false && expired_at.dateTime === "")
    const payload = {
      id: route.params.id as string,
      internal_note: form.value.internal_note,
      reviewer_comment: form.value.reviewer_comment,
      status: kycStatus.value,
      document_number: form.value.profile.document_number,
      ...(includeExpiry && {
        document_expiry: expired_at.dateTime ? formatDate(expired_at.dateTime, false, false) : ""
      })
    }
    loading.value = true

    const { search, status } = useSearch(updateMemberKyc)
    await search(payload)
    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })

      setTimeout(() => {
        router.back()
      }, 500)
    } else {
      loading.value = false
    }
  }

  function onCancel() {
    router.back()
  }
  async function onLock() {
    loading.value = true
    const { search, status } = useSearch(kycLock)
    await search(route.params.id as string)

    if (status.value) {
      isReviewer.value = true
    }
    loading.value = false
  }

  const isReviewer = ref(false)
  const userId = sessionStorage.getItem("userID")
  const document_type = ref("")
  const national = ref("")
  const sourceincome = ref("")

  onMounted(async () => {
    await search(route.params.id as string)
    if (status.value) {
      form.value = tableData.value
      form.value.profile.fullName =
        form.value.profile.last_name + " " + form.value.profile.first_name + " " + form.value.profile.middle_name

      document_type.value = t(KYC_IDTYPE.I18nKeys?.[form.value.profile.document_type as KYC_IDTYPE.Enums] ?? "") || ""
      sourceincome.value =
        t(KYC_SOURCEINCOME.I18nKeys?.[form.value.profile.source_of_income as KYC_SOURCEINCOME.Enums] ?? "") || ""
      national.value = t(KYC_NATIONAL.I18nKeys?.[form.value.profile.nature_of_work as KYC_NATIONAL.Enums] ?? "") || ""
      const expiry = form.value.profile.document_expiry
      if (expiry) {
        const formatted = genTimeFormat(expiry, "yyyy-MM-dd", false)
        expired_at.from = formatted
        expired_at.dateTime = formatted
      } else {
        expired_at.from = ""
        expired_at.dateTime = ""
      }
      mapAddresses(form.value.addresses)
      form.value.profile.date_of_birth = genTimeFormat(form.value.profile.date_of_birth, "yyyy-MM-dd", false)
      if (
        form.value.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_APPROVED &&
        form.value.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_REJECTED
      ) {
        if (form.value.reviewer_id != null && userId != null) {
          isReviewer.value = Number(form.value.reviewer_id) === Number(userId)
        } else {
          isReviewer.value = false
          onLock()
        }
      }

      kycStatus.value = form.value.status
      kycStatusDetail.value = form.value.status
    }
  })

  function formatAddress(address: any): string {
    const parts = [
      address.address_line_1,
      address.floor ? `${address.floor}` : "",
      address.city,
      address.postal_code

      /*address.address_line_2,
      address.unit ? ` ${address.unit}` : "",
      address.district,
      address.state,*/
    ].filter(Boolean)

    return parts.join(" ")
  }

  function mapAddresses(addresses: any) {
    addresses.forEach((addr: any) => {
      if (addr.type.toLowerCase() === "present") {
        // 現住
        form.value.currentAddress = formatAddress(addr)
      } else if (addr.type.toLowerCase() === "permanent") {
        // 永久
        form.value.permanentAddress = formatAddress(addr)
      }
    })
  }
  function onDateChange(value: { from: string; fromHms: string }) {
    //form.value.expired_at = { from: "", fromHms: "", dateTime: "" } // 確保它是物件

    //expired_at.dateTime = `${value.from} ${value.fromHms}`
    expired_at.dateTime = `${value.from}`
  }

  function changeApproved(newStatus: number) {
    kycStatus.value = kycStatus.value === newStatus ? -1 : newStatus
  }
  const imgPlaceholder =
    "data:image/png;base64,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"
</script>

<style lang="scss" scoped>
  @import "@/css/memberLevelSettings.scss";
  .tip {
    margin: 0.4rem 0 1.7rem 0;
  }
  ::v-deep(.q-table thead th) {
    border-right: 0.15vw solid rgba(255, 255, 255, 0.71) !important;
    border-bottom: 0.15vw solid rgba(255, 255, 255, 0.71) !important;
  }
  .avatarImg {
    background: #fff !important;
  }

  .status-card {
    width: 14.375rem;
    height: 8.8125rem;
    border-radius: 12px;
    background: #fff;
    transition: all 0.25s ease;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:hover {
      background: #f8f9fa;
    }

    &.active {
      border: 2px solid #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.15);
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
