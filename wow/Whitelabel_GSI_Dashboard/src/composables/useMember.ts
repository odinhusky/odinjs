import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"

import { storeToRefs } from "pinia"
import { useMemberStore } from "src/stores/memberStore"
import { useSearch } from "src/hook/useSearch"
import { useCommon } from "src/hook/useCommon"
import { getMemberColumn, addMemberAccount } from "src/api/member"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import type { MEMBER_COLUMN_TYPE } from "src/utils/constants"
import { MEMBER_COLUMN_NAME, INPUT_TYPE } from "src/utils/constants"

export function useMember() {
  const { t } = useI18n()
  const { isValidDateFormat } = useCommon()
  const memberStore = useMemberStore()
  const { memberAddForm } = storeToRefs(memberStore)
  const { initMemberAddForm } = memberStore

  const isLoading = ref(false)
  const memberColumn = ref<Response.MemberColumnList>([])
  const memberColumnList = computed(() => {
    return memberColumn.value.map((column) => {
      if (column.type === INPUT_TYPE.Enums.SELECT) {
        if (
          column.column_name !== MEMBER_COLUMN_NAME.Enums.MEMBER_LEVEL &&
          column.column_name !== MEMBER_COLUMN_NAME.Enums.COUNTRY
        ) {
          return {
            ...column,
            values: column.values.map((val) => ({
              ...val,
              label: t(`member_customize_column.${val.label}`)
            }))
          }
        }
      }
      return column
    })
  })
  const needCountryCodePhone = computed(
    () =>
      memberColumn.value.filter(
        (e) => e.column_name === MEMBER_COLUMN_NAME.Enums.COUNTRY || e.column_name === MEMBER_COLUMN_NAME.Enums.PHONE
      ).length === 2
  )
  const columnCountryCode = computed(() =>
    memberColumnList.value.find((e) => e.column_name === MEMBER_COLUMN_NAME.Enums.COUNTRY)
  )

  const memberColumnLabelI18n: Response.BaseMemberColumn = {
    account: "table_header.account",
    password: "table_header.password",
    ref_account: "table_header.recommender",
    fullname: "table_header.real_name",
    nickname: "table_header.nick_name",
    dob: "table_header.birthday",
    gender: "table_header.gender",
    country: "common.country_code",
    phone: "table_header.phone_number",
    email: "table_header.email",
    sns_account_1: "table_header.communication_software1",
    sns_account_2: "table_header.communication_software2",
    nationality: "website_settings_reg.nationality",
    place_of_birth: "website_settings_reg.place_of_birth",
    present_address: "website_settings_reg.present_address",
    permanent_address: "website_settings_reg.permanent_address",
    nature_of_work: "website_settings_reg.nature_of_work",
    source_of_income: "website_settings_reg.source_of_income",
    gaming_site: "website_settings_reg.gaming_site",
    member_level: "table_header.member_level"
  }

  async function handleGetMemberColumn(type: MEMBER_COLUMN_TYPE.Enums) {
    const { search, status, tableData } = useSearch(getMemberColumn)
    isLoading.value = true
    await search(type)
    isLoading.value = false
    if (status.value) {
      memberColumn.value = tableData.value
    }
  }
  async function handleAddMemberAccount(): Promise<{
    status: boolean
  }> {
    if (memberAddForm.value.dob && !isValidDateFormat(memberAddForm.value.dob)) {
      memberAddForm.value.dob = ""
    }

    const form = memberAddForm.value
    if (!form.account) {
      const country = typeof form.country === "string" ? form.country.trim() : ""
      const phone = typeof form.phone === "string" ? form.phone.trim() : ""
      if (country && phone) {
        form.account = `${country}${phone}`.replace(/^\+/, "")
      } else if (phone) {
        form.account = phone
      }
    }

    const { search, status } = useSearch(addMemberAccount)
    isLoading.value = true
    await search(form)
    isLoading.value = false

    return { status: status.value }
  }

  return {
    /** 會員資訊 */
    memberAddForm,

    /** 會員欄位 */
    memberColumnList,

    /** 同時開啟國碼、號碼 */
    needCountryCodePhone,

    /** 國碼欄位資料 */
    columnCountryCode,

    /** 會員欄位標籤i18n */
    memberColumnLabelI18n,

    /** 取得會員動態欄位 */
    handleGetMemberColumn,

    /** 新增會員 */
    handleAddMemberAccount,

    /** 初始化新增會員form */
    initMemberAddForm
  }
}
