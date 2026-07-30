import { useQuery, useQueryClient } from "@tanstack/vue-query"
import dayjs from "dayjs"
import { cloneDeep } from "lodash"
import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import * as userInfoApi from "src/api/userInfo"
import { useDynamicImage, DYNAMIC_IMAGE_DISPLAY_SIZE, squareCoverTransform } from "src/common/composables/useDynamicImage"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useApi } from "src/common/hooks/useApi"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { COLUMN_NAME, GENDER, INPUT_TYPE, KYC_VERIFIED, LOGIN_PROVIDER, WALLET_TYPE } from "src/common/utils/constants"
import { FIVE_MINUTES } from "src/common/utils/constants/durationTime"
import { QUERY_KEY } from "src/common/utils/constants/queryKeys"
import { adultMinDate } from "src/common/utils/dayjsUtils"
import { useEnvInfoStore } from "src/stores/envStore"
import { useUserInfoStore } from "src/stores/userInfoStore"
import { computed, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const memberColumnPlaceholderI18n: Response.BaseMemberColumn = {
  account: "member.register.username",
  password: "member.register.password",
  member_level: "member.register.member_level",
  ref_account: "member.profile.affiliate",
  fullname: "member.register.fullName",
  nickname: "member.profile.nickname",
  dob: "member.register.birthdate",
  gender: "member.register.gender",
  country: "member.profile.countryCode",
  phone: "member.register.phone",
  email: "member.register.email",
  sns_account_1: "member.register.contact1",
  sns_account_2: "member.register.contact2",
  nationality: "member.profile.nationality",
  place_of_birth: "member.profile.placeOfBirth",
  present_address: "member.profile.presentAddress",
  permanent_address: "member.profile.permanentAddress",
  nature_of_work: "member.profile.natureOfWork",
  source_of_income: "member.profile.sourceOfIncome",
  gaming_site: "member.profile.gamingSite",
  sms_otp: "member.register.sms_otp",
  self_exclusion_at: "member.profile.disableAccountDate",
  middle_name: "member.profile.middleName",
  last_name: "member.profile.lastName",
  city: "member.profile.city",
  country_name: "member.profile.countryName",
  region: "member.profile.region",
  province: "member.profile.province",
  area: "member.profile.area",
  postal_code: "member.profile.postalCode",
  job_type_details: "member.profile.jobTypeDetails",
  income_source_details: "member.profile.incomeSourceDetails",
  invite_code: "member.register.invite_code",
  approval_status: "",
  registered_ip: "member.profile.registeredIp",
  cert_expiry_date: "member.profile.cert_expiry_date" }
const memberColumnIconName: Response.BaseMemberColumn = {
  account: "fa-regular fa-circle-user",
  ref_account: "fa-regular fa-user",
  fullname: "fa-regular fa-address-card",
  nickname: "fa-regular fa-address-card",
  dob: "cake",
  gender: "fa-solid fa-venus-mars",
  country: "fa-solid fa-globe",
  phone: "phone_android",
  email: "mail_outline",
  sns_account_1: "fa-brands fa-skype",
  sns_account_2: "fa-brands fa-line",
  nationality: "fa-solid fa-earth-americas",
  place_of_birth: "fa-solid fa-location-dot",
  present_address: "fa-regular fa-building",
  permanent_address: "fa-regular fa-map",
  nature_of_work: "fa-solid fa-briefcase",
  source_of_income: "fa-solid fa-money-bill-wave",
  gaming_site: "fa-brands fa-fantasy-flight-games",
  sms_otp: "fa-solid fa-mobile-retro",
  self_exclusion_at: "fa-solid fa-ban",
  middle_name: "fa-regular fa-user",
  last_name: "fa-regular fa-user",
  city: "fa-regular fa-city",
  country_name: "fa-solid fa-globe",
  region: "fa-solid fa-map-location-dot",
  province: "fa-solid fa-map-location",
  area: "fa-solid fa-map-pin",
  postal_code: "fa-solid fa-mailbox",
  job_type_details: "fa-solid fa-briefcase",
  income_source_details: "fa-solid fa-sack-dollar",
  invite_code: "fa-regular fa-user",
  approval_status: "",
  registered_ip: "IP",
  cert_expiry_date: "fa-regular fa-address-card" }

export interface IWallet {
  [currency_code: string]: { [wallet_type: number]: Response.UserWallet }
}

export interface IInUseWallet { [wallet_type: number]: Response.UserWallet }

export function useUserInfo() {
  const $q = useQuasar()
  const router = useRouter()
  const { t, locale } = useI18n()
  const { isLogin, isOnBoarding, hasAuthToken, handleLogout } = useAuth()
  const { isGOG, isNBL1, isIDRToEUR } = useAgentCode()
  const userInfoStore = useUserInfoStore()
  const {
    userInfo,
    userInfo2,
    accountInfo,
    loginByUserClick,
    kycStatus,
    lastLoginTime,
    winLoseList,
    userWalletList,
    memberSummary,
    userRemark,
    userKyc,
    isKycVerified,
    userLevelsInfo } = storeToRefs(userInfoStore)
  const {
    setKycStatus,
    setStoreUserInfo,
    setStoreUserInfo2,
    setStoreAccountInfo,
    setUserBetHistoryTotal,
    setStoreUserWalletList,
    setStoreUserRemark,
    setStoreLevelsInfo,
    setStoreUserKyc,
    setLoginByUserClick,
    setMemberSummary } = userInfoStore
  const { isCredit, envData } = useEnv()
  const { isMemberKycEnabled } = storeToRefs(useEnvInfoStore())
  const { buildImageUrl } = useDynamicImage()
  const queryClient = useQueryClient()
  const isMayaLogin = computed(
    () =>
      userInfo.value.login_type === LOGIN_PROVIDER.Enums.PayMaya ||
      userInfo2.value.login_type === LOGIN_PROVIDER.Enums.PayMaya
  )
  const isGCashLogin = computed(
    () =>
      userInfo.value.login_type === LOGIN_PROVIDER.Enums.GCash ||
      userInfo2.value.login_type === LOGIN_PROVIDER.Enums.GCash
  )

  const { nowLang } = useLanguage()
  const isLoading = ref(false)

  type BasicInfoPayload = Response.BasicInfoResponse

  const mergeBasicInfoData = (data: BasicInfoPayload) => {
    const customizeData = data.customize || {}
    return {
      customizeData,
      mergedCustomizeData: {
        ...data,
        ...customizeData } as Response.GetUserInfo & Response.AccountInfo }
  }

  const mapBasicInfoToUserInfo = (data: BasicInfoPayload): Response.UserInfo => {
    const { mergedCustomizeData } = mergeBasicInfoData(data)
    return {
      username: data.username || mergedCustomizeData.account || "",
      real_name: data.real_name || mergedCustomizeData.fullname || "",
      nickname: data.nickname || mergedCustomizeData.nickname || "",
      email: data.email || mergedCustomizeData.email || "",
      phone: data.phone || mergedCustomizeData.phone || "",
      gender: data.gender ?? mergedCustomizeData.gender ?? GENDER.Enums.NotSpecified,
      date_of_birth: data.date_of_birth || mergedCustomizeData.dob || "",
      invite_code: data.invite_code || mergedCustomizeData.invite_code || "",
      contact: data.contact || {
        contact1: mergedCustomizeData.sns_account_1 || "",
        contact2: mergedCustomizeData.sns_account_2 || "" },
      empty_password: data.empty_password,
      member_level: data.member_level ?? mergedCustomizeData.member_level,
      has_withdrawal_password: data.has_withdrawal_password ?? mergedCustomizeData.has_withdrawal_password,
      avatar_path: data.avatar_path || mergedCustomizeData.avatar_path || "",
      show_avatar: data.show_avatar ?? mergedCustomizeData.show_avatar ?? true,
      self_exclusion_at: data.self_exclusion_at ?? mergedCustomizeData.self_exclusion_at ?? null,
      approval_status: data.approval_status ?? mergedCustomizeData.approval_status ?? false,
      login_provider: data.login_provider ?? mergedCustomizeData.login_provider,
      login_type: data.login_type ?? mergedCustomizeData.login_type,
      is_member_agent: data.is_member_agent ?? mergedCustomizeData.is_member_agent ?? false }
  }

  const syncBasicInfoToStores = async (data: BasicInfoPayload) => {
    const { mergedCustomizeData } = mergeBasicInfoData(data)
    setStoreUserInfo(mapBasicInfoToUserInfo(data))
    setStoreUserInfo2(mergedCustomizeData)
    await setStoreAccountInfo(mergedCustomizeData)
  }

  const fetchAndSyncBasicInfo = async () => {
    const { status, data } = await useApi(userInfoApi.getUserInfo)
    if (!status) { throw new Error("getUserInfo failed") }

    const basicInfo = data as BasicInfoPayload
    await syncBasicInfoToStores(basicInfo)
    return basicInfo
  }

  async function fetchBasicInfoCached(forceRefresh = false) {
    if (!isLogin.value) return null

    if (forceRefresh) {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.USER_BASIC_INFO })
    }

    const data = await queryClient.fetchQuery({
      queryKey: QUERY_KEY.USER_BASIC_INFO,
      queryFn: fetchAndSyncBasicInfo,
      staleTime: FIVE_MINUTES })

    return data
  }

  async function refreshBasicInfoStores() {
    const data = await fetchBasicInfoCached(true)
    if (!data) return
    await syncBasicInfoToStores(data)
  }

  //#region 動態欄位
  const memberColumn = ref<Response.MemberColumnList>([])
  const memberNoFilterColumnList = computed(() => {
    const cloneMemberColumn = cloneDeep(memberColumn.value)
    return cloneMemberColumn.map((column) => { return column })
  })
  const memberColumnList = computed(() => {
    const cloneMemberColumn = cloneDeep(memberColumn.value)
    return cloneMemberColumn.map((column) => {
      // select 選單翻譯label，國碼保留原始
      if (column.type === INPUT_TYPE.Enums.SELECT) {
        column.values = column.values.map((val) => {
          if (column.column_name !== COLUMN_NAME.Enums.COUNTRY) {
            val.label = t(`member_customize_column.${ val.label }`)
          }
          return val
        })
      }

      // column_label、placeholder 抓欄位名或字典檔
      if (memberColumnPlaceholderI18n[column.column_name as keyof Request.UserInfoForm]) { column.column_label = t(memberColumnPlaceholderI18n[column.column_name as keyof Request.UserInfoForm]) } else if (column.lang && column.lang[nowLang.value]) { column.column_label = column.lang[nowLang.value] } else {
        column.column_label = t(`member.register.${ column.column_name }`)
      }

      return column
    })
  })
  const needCountryCodePhone = computed(
    () =>
      memberColumn.value.filter(
        (e) => e.column_name === COLUMN_NAME.Enums.COUNTRY || e.column_name === COLUMN_NAME.Enums.PHONE
      ).length === 2
  )
  const columnCountryCode = computed(() =>
    memberColumnList.value.find((e) => e.column_name === COLUMN_NAME.Enums.COUNTRY)
  )
  function getSelectColumnValue(columnName: keyof Request.UserInfoForm) {
    const column = memberColumnList.value.find((e) => e.column_name === columnName)
    const formValue = userInfoForm2[columnName]
    if (!column) return formValue

    const { values } = column

    const value = values.find((e) => e.value === formValue)

    if (columnName === COLUMN_NAME.Enums.GAMING_SITE && !value) return ""
    if (!value) return formValue

    return value.label
  }

  const accountInfoForm = reactive<Request.AccountInfoForm>({ self_exclusion_at: null })

  async function getMemberColumn() {
    isLoading.value = true
    const { status, data } = await useApi(userInfoApi.getMemberColumn)
    isLoading.value = false

    if (!status) return

    if (!data || !data.length) { memberColumn.value.length = 0 }

    const normalizedColumns = data.map((column) => {
      if (column.column_name === "registered_ip") {
        return {
          ...column,
          edit: false }
      }

      return column
    })

    memberColumn.value = normalizedColumns

    normalizedColumns.forEach((e) => { accountInfoForm[e.column_name] = accountInfo.value[e.column_name] })

    // Fixed fields that are not part of dynamic member columns
    accountInfoForm.invite_code = accountInfo.value.invite_code
    accountInfoForm.nickname = accountInfo.value.nickname
  }

  function resetAccountInfoForm() {
    memberColumn.value.forEach((e) => { accountInfoForm[e.column_name] = accountInfo.value[e.column_name] })

    // Fixed fields that are not part of dynamic member columns
    accountInfoForm.invite_code = accountInfo.value.invite_code
    accountInfoForm.nickname = accountInfo.value.nickname
  }

  async function setAccountInfo(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.AccountInfoForm = {
        ...accountInfoForm,
        single: false,
        is_customize: true,
        dob: dayjs(accountInfoForm.dob).isValid() ? accountInfoForm.dob : "",
        self_exclusion_at: accountInfoForm.self_exclusion_at ? dayjs(accountInfoForm.self_exclusion_at).unix() : null }

      isLoading.value = true
      const { status } = await useApi(userInfoApi.setAccountInfo, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })

      // 自我排除 handler
      if (accountInfoForm.self_exclusion_at && dayjs(accountInfoForm.self_exclusion_at).isAfter(dayjs())) {
        await handleSelfExclusionExpired(accountInfoForm.self_exclusion_at)
        return { status }
      }

      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  async function setSingleAccountInfo(columnName: string): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.SetSingleAccountInfoForm = {
        single: true,
        is_customize: true,
        [columnName]: accountInfoForm[columnName] }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setSingleAccountInfo, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })

      // 自我排除 handler
      if (accountInfoForm.self_exclusion_at && dayjs(accountInfoForm.self_exclusion_at).isAfter(dayjs())) {
        await handleSelfExclusionExpired(accountInfoForm.self_exclusion_at)
        return { status }
      }

      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }
  //#endregion

  const userInfoForm = reactive<Response.UserInfo>({
    username: "",
    real_name: "",
    nickname: "",
    email: "",
    phone: "",
    gender: GENDER.Enums.NotSpecified,
    date_of_birth: "",
    invite_code: "",
    contact: {
      contact1: "",
      contact2: "" },
    member_level: 0,
    avatar_path: "",
    show_avatar: true,
    self_exclusion_at: 0,
    approval_status: false,
    is_member_agent: false })

  const userInfoForm2 = reactive<Request.UserInfoForm>({
    account: "", // 帳號
    ref_account: "", // 推薦人
    invite_code: "", // 推薦人
    fullname: "", // 真實姓名
    nickname: "", // 暱稱
    dob: "", // 生日
    gender: GENDER.Enums.NotSpecified, // 性別
    country: "", // 國碼
    phone: "", // 電話
    email: "", // 電子郵箱
    sns_account_1: "", // 通訊軟體1
    sns_account_2: "", // 通訊軟體2
    nationality: "", // 國籍
    place_of_birth: "", // 出生地
    present_address: "", // 現居地址
    permanent_address: "", // 永久地址
    nature_of_work: "", // 工作性質
    source_of_income: "", // 收入來源
    gaming_site: 0, // 遊戲場地
    self_exclusion_at: 0,
    middle_name: "",
    last_name: "",
    city: "",
    country_name: "",
    region: "",
    province: "",
    area: "",
    postal_code: "",
    job_type_details: "",
    income_source_details: "",
    sms_otp: "",
    is_sub_ad: false,
    approval_status: false,
    registered_ip: "", // 註冊IP
    cert_expiry_date: "",
    uid: "" })

  const userKycInfoForm = reactive<Request.UserKycInfoForm>({
    profile: {
      first_name: "",
      middle_name: "",
      last_name: "",
      nationality: "",
      date_of_birth: "",
      place_of_birth: "",
      document_type: "",
      source_of_income: "",
      nature_of_work: "" },
    addresses: [
      {
        type: "PRESENT",
        postal_code: "",
        city: "",
        address_line_1: "",
        floor: "" },
      {
        type: "PERMANENT",
        postal_code: "",
        city: "",
        address_line_1: "",
        floor: "" },
    ],
    documents: [] })

  const withdrawalPasswordForm = reactive<Request.Password>({
    old_password: "",
    new_password: "",
    confirm_password: "" })

  const passwordForm = reactive<Request.Password>({
    old_password: "",
    new_password: "",
    confirm_password: "" })

  const userWalletMap = computed(() => {
    const result: IWallet = {}

    userWalletList.value.forEach((item) => {
      const { currency_code, wallet_type } = item

      if (!result[currency_code]) {
        result[currency_code] = {}
      }

      result[currency_code][wallet_type] = item
    })

    return result
  })

  const isSingleWalletCurrency = computed(() => {
    if (Object.keys(userWalletMap.value).length === 1) return true

    return false
  })

  const activeWallet = computed<Response.UserWallet | null>(() => userWalletList.value.find((wallet) => wallet.in_use) ?? null)

  const activeWalletLabel = computed<string>(() => {
    if (isCredit.value) { return t("common.btn.point") }

    if (isGOG.value && activeWallet.value?.currency_code === "CNY") { return "USDT" }

    if (isIDRToEUR.value && activeWallet.value?.currency_code === "IDR") { return "EUR" }

    if (isNBL1.value && activeWallet.value?.currency_code === "IDR") { return "Rp" }

    return activeWallet.value?.currency_code || ""
  })

  const activeWalletCurrencyCode = computed<string>(() => activeWallet.value?.currency_code || "")
  const activeWalletCurrencyId = computed<number>(() => activeWallet.value?.currency_id || 0)
  const activeWalletType = computed<WALLET_TYPE.Enums | null>(() => activeWallet.value?.wallet_type ?? null)

  const inUseWallet = computed(() => {
    const inUseData: IInUseWallet = {}

    if (!activeWalletCurrencyCode.value) return null

    const currencyWalletMap = userWalletMap.value[activeWalletCurrencyCode.value]

    if (!currencyWalletMap) return null

    for (const walletType in currencyWalletMap) { inUseData[walletType] = currencyWalletMap[walletType] }

    if (Object.keys(inUseData).length === 0) { return null }

    return inUseData
  })

  const cashWallets = computed(() => userWalletList.value.filter((e) => e.wallet_type === WALLET_TYPE.Enums.Cash))
  const bonusWallets = computed(() => userWalletList.value.filter((e) => e.wallet_type === WALLET_TYPE.Enums.Bonus))
  const rewardWallets = computed(() => userWalletList.value.filter((e) => e.wallet_type === WALLET_TYPE.Enums.Reward))

  const userCurrentLevelsInfo = computed(() =>
    userLevelsInfo.value.map((item) => {
      const currentLang = locale.value as keyof typeof item.lang
      return {
        id: item.id,
        quota: item.quota,
        img: buildImageUrl(
          item.img,
          item.updated_time,
          squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.VIP_BADGE)
        ),
        lang: item.lang ? item.lang[currentLang] : "",
        remark: item.remark }
    })
  )

  const userActiveLevelsInfo = computed(() => {
    const result = userLevelsInfo.value.find((item) => item.id == userInfoForm.member_level)

    if (!result) {
      return {
        id: 0,
        quota: 0,
        img: "",
        lang: "",
        remark: "" }
    }
    const currentLang = locale.value as keyof typeof result.lang

    return {
      id: result.id,
      quota: result.quota,
      img: buildImageUrl(
        result.img,
        result.updated_time,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.VIP_BADGE)
      ),
      lang: result.lang ? result.lang[currentLang] : "",
      remark: result.remark }
  })

  const userCurrentRemark = computed(() => (userRemark.value ? userRemark.value.replace(/\n/g, "<br/>") : ""))

  function useBasicInfoQuery() {
    return useQuery({
      queryKey: QUERY_KEY.USER_BASIC_INFO,
      queryFn: fetchAndSyncBasicInfo,
      enabled: isLogin,
      staleTime: FIVE_MINUTES })
  }

  async function getLevelsInfo() {
    const { status, data } = await useApi(userInfoApi.getLevelsInfo)

    if (!status) return
    setStoreLevelsInfo(data)
  }

  function resetUserInfoForm() {
    userInfoForm.username = userInfo.value?.username
    userInfoForm.real_name = userInfo.value?.real_name
    userInfoForm.nickname = userInfo.value?.nickname
    userInfoForm.email = userInfo.value?.email
    userInfoForm.phone = userInfo.value?.phone
    userInfoForm.gender = userInfo.value?.gender
    userInfoForm.date_of_birth = userInfo.value?.date_of_birth
    userInfoForm.invite_code = userInfo.value?.invite_code
    userInfoForm.contact.contact1 = userInfo.value?.contact?.contact1
    userInfoForm.contact.contact2 = userInfo.value?.contact?.contact2
    userInfoForm.member_level = userInfo.value?.member_level
    userInfoForm.email = userInfo.value?.email
    userInfoForm.avatar_path = userInfo.value?.avatar_path
    userInfoForm.show_avatar = userInfo.value?.show_avatar ?? userInfoForm.show_avatar
    userInfoForm.self_exclusion_at = userInfo.value?.self_exclusion_at
    userInfoForm.approval_status = userInfo.value?.approval_status
    userInfoForm.is_member_agent = userInfo.value?.is_member_agent
  }
  function resetUserInfoForm2() {
    userInfoForm2.account = userInfo2.value?.account
    userInfoForm2.ref_account = userInfo2.value?.ref_account
    userInfoForm2.invite_code = userInfo2.value?.invite_code
    userInfoForm2.fullname = userInfo2.value?.fullname
    userInfoForm2.nickname = userInfo2.value?.nickname
    userInfoForm2.dob = userInfo2.value?.dob
    userInfoForm2.gender = userInfo2.value?.gender
    userInfoForm2.country = userInfo2.value?.country
    userInfoForm2.phone = userInfo2.value?.phone
    userInfoForm2.email = userInfo2.value?.email
    userInfoForm2.sns_account_1 = userInfo2.value?.sns_account_1
    userInfoForm2.sns_account_2 = userInfo2.value?.sns_account_2
    userInfoForm2.nationality = userInfo2.value?.nationality
    userInfoForm2.place_of_birth = userInfo2.value?.place_of_birth
    userInfoForm2.present_address = userInfo2.value?.present_address
    userInfoForm2.permanent_address = userInfo2.value?.permanent_address
    userInfoForm2.nature_of_work = userInfo2.value?.nature_of_work
    userInfoForm2.source_of_income = userInfo2.value?.source_of_income
    userInfoForm2.gaming_site = userInfo2.value?.gaming_site
    userInfoForm2.self_exclusion_at = userInfo2.value?.self_exclusion_at
    userInfoForm2.is_sub_ad = userInfo2.value?.is_sub_ad
    userInfoForm2.approval_status = userInfo2.value?.approval_status
    userInfoForm2.middle_name = userInfo2.value?.middle_name
    userInfoForm2.last_name = userInfo2.value?.last_name
    userInfoForm2.city = userInfo2.value?.city
    userInfoForm2.country_name = userInfo2.value?.country_name
    userInfoForm2.region = userInfo2.value?.region
    userInfoForm2.province = userInfo2.value?.province
    userInfoForm2.area = userInfo2.value?.area
    userInfoForm2.postal_code = userInfo2.value?.postal_code
    userInfoForm2.job_type_details = userInfo2.value?.job_type_details
    userInfoForm2.income_source_details = userInfo2.value?.income_source_details
    userInfoForm2.sms_otp = userInfo2.value?.sms_otp
    userInfoForm2.registered_ip = userInfo2.value?.registered_ip
    userInfoForm2.cert_expiry_date = userInfo2.value?.cert_expiry_date
    userInfoForm2.uid = userInfo2.value?.uid

    // 支援後端動態欄位（例如 swift_code、bank_address、iban），避免只靠固定鍵位造成值遺失
    Object.keys(userInfo2.value || {}).forEach((key) => { ;(userInfoForm2 as Record<string, unknown>)[key] = (userInfo2.value as Record<string, unknown>)[key] })
  }

  function qDateAdultOptions(date: string) { return date <= adultMinDate("YYYY/MM/DD") }

  const selfExclusionDateOptions = (date: string) => { return dayjs(date).isAfter(dayjs()) }

  async function handleSelfExclusionExpired(time: number) {
    await handleLogout()
    $q.loading.hide()
    router.replace({ path: "/" })

    $q.notify({
      type: "negative",
      message: t("common.alarm.selfExclusionAt", [dayjs(time).format("YYYY/MM/DD")]),
      position: "top",
      timeout: 1000 })
  }

  async function setUserInfo(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.UserInfo = {
        single: false,
        is_customize: false,
        real_name: userInfoForm.real_name,
        nickname: userInfoForm.nickname,
        gender: userInfoForm.gender,
        date_of_birth: dayjs(userInfoForm.date_of_birth).isValid() ? userInfoForm.date_of_birth : "",
        email: userInfoForm.email,
        contact: {
          contact1: userInfoForm.contact.contact1,
          contact2: userInfoForm.contact.contact2 },
        avatar_path: userInfoForm.avatar_path || "",
        show_avatar: userInfoForm.show_avatar ?? true, //頭像顯示隱藏
        self_exclusion_at: userInfoForm.self_exclusion_at ? dayjs(userInfoForm.self_exclusion_at).unix() : null }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserInfo, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })

      // 自我排除 handler
      if (dayjs(userInfoForm.self_exclusion_at).isAfter(dayjs())) {
        await handleLogout()
        $q.loading.hide()
        router.replace({ path: "/" })

        $q.notify({
          type: "negative",
          message: t("common.alarm.selfExclusionAt", [dayjs(userInfoForm.self_exclusion_at).format("YYYY/MM/DD")]),
          position: "top",
          timeout: 1000 })
        return { status }
      }

      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  /** setUserInfo2 已手動帶上的鍵；其餘由 memberColumn 從表單補上（後端動態欄位） */
  const setUserInfo2PayloadFixedKeys = new Set([
    "fullname",
    "nickname",
    "dob",
    "gender",
    "country",
    "phone",
    "email",
    "gaming_site",
    "sns_account_1",
    "sns_account_2",
    "nationality",
    "place_of_birth",
    "present_address",
    "permanent_address",
    "nature_of_work",
    "source_of_income",
    "is_sub_ad",
    "self_exclusion_at",
    "approval_status",
    "cert_expiry_date",
  ])

  async function setUserInfo2(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.SetUserInfo = {
        single: false,
        is_customize: true,
        fullname: userInfoForm2.fullname,
        nickname: userInfoForm2.nickname,
        dob: dayjs(userInfoForm2.dob).isValid() ? userInfoForm2.dob : "",
        gender: userInfoForm2.gender,
        country: userInfoForm2.country,
        phone: userInfoForm2.phone,
        email: userInfoForm2.email,
        gaming_site: userInfoForm2.gaming_site,
        sns_account_1: userInfoForm2.sns_account_1,
        sns_account_2: userInfoForm2.sns_account_2,
        nationality: userInfoForm2.nationality,
        place_of_birth: userInfoForm2.place_of_birth,
        present_address: userInfoForm2.present_address,
        permanent_address: userInfoForm2.permanent_address,
        nature_of_work: userInfoForm2.nature_of_work,
        source_of_income: userInfoForm2.source_of_income,
        is_sub_ad: userInfoForm2.is_sub_ad,
        self_exclusion_at: userInfoForm2.self_exclusion_at ? dayjs(userInfoForm2.self_exclusion_at).unix() : null,
        approval_status: userInfoForm2.approval_status,
        cert_expiry_date: dayjs(userInfoForm2.cert_expiry_date).isValid() ? userInfoForm2.cert_expiry_date : "" }

      const formRecord = userInfoForm2 as Record<string, unknown>
      memberColumn.value.forEach((col) => {
        const name = col.column_name as string
        if (!setUserInfo2PayloadFixedKeys.has(name)) { ;(payload as Record<string, unknown>)[name] = formRecord[name] }
      })
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserInfo2, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })

      // 自我排除 handler
      if (dayjs(userInfoForm2.self_exclusion_at).isAfter(dayjs())) {
        await handleLogout()
        $q.loading.hide()
        router.replace({ path: "/" })

        $q.notify({
          type: "negative",
          message: t("common.alarm.selfExclusionAt", [dayjs(userInfoForm2.self_exclusion_at).format("YYYY/MM/DD")]),
          position: "top",
          timeout: 1000 })
        return { status }
      }

      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  async function setSingleUserInfo(columnName: keyof Request.UserInfoForm): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.SetSingleUserInfo = {
        single: true,
        is_customize: true,
        [columnName]: userInfoForm2[columnName] }
      if (userInfoForm2.self_exclusion_at) { payload.self_exclusion_at = dayjs(userInfoForm2.self_exclusion_at).unix() }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setSingleUserInfo2, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })

      // 自我排除 handler
      if (dayjs(userInfoForm2.self_exclusion_at).isAfter(dayjs())) {
        await handleLogout()
        $q.loading.hide()
        router.replace({ path: "/" })

        $q.notify({
          type: "negative",
          message: t("common.alarm.selfExclusionAt", [dayjs(userInfoForm2.self_exclusion_at).format("YYYY/MM/DD")]),
          position: "top",
          timeout: 1000 })
        return { status }
      }

      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  async function setMemberCenterKyc(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()

      isLoading.value = true
      const { status } = await useApi(userInfoApi.setMemberCenterKyc, userKycInfoForm)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }

      $q.notify({
        type: "positive",
        message: t("common.alarm.successApplication"),
        position: "top",
        timeout: 1000 })

      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  function getUserAvatar(defaultImg?: string): string {
    if (userInfo.value.avatar_path) {
      return buildImageUrl(
        userInfo.value.avatar_path,
        undefined,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD)
      )
    }

    if (userInfo2.value.avatar_path) {
      return buildImageUrl(
        userInfo2.value.avatar_path,
        undefined,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD)
      )
    }

    if (accountInfo.value.avatar_path) {
      return buildImageUrl(
        accountInfo.value.avatar_path,
        undefined,
        squareCoverTransform(DYNAMIC_IMAGE_DISPLAY_SIZE.AVATAR_MD)
      )
    }

    return defaultImg || ""
  }

  async function setUserAvatar(img?: string): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.UserAvatar = { img: img ? img : userInfoForm.avatar_path }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserAvatar, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return { status }
      }
      $q.notify({
        type: "positive",
        message: t("common.alarm.editSuccess"),
        position: "top",
        timeout: 1000 })
      await refreshBasicInfoStores()
      $q.loading.hide()
      return { status }
    } catch (error) {
      $q.loading.hide()
      return { status: false }
    }
  }

  function resetWithdrawalPasswordForm() {
    withdrawalPasswordForm.old_password = ""
    withdrawalPasswordForm.new_password = ""
    withdrawalPasswordForm.confirm_password = ""
  }

  function resetPasswordForm() {
    passwordForm.old_password = ""
    passwordForm.new_password = ""
    passwordForm.confirm_password = ""
  }

  async function getUserBetHistoryTotal() {
    const { status, data } = await useApi(userInfoApi.getUserBetHistoryTotal)
    if (status) { setUserBetHistoryTotal(data) }
  }

  async function setUserWithdrawalPassword(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.Password = {
        old_password: withdrawalPasswordForm.old_password,
        new_password: withdrawalPasswordForm.new_password,
        confirm_password: withdrawalPasswordForm.confirm_password }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserWithdrawalPassword, payload)
      isLoading.value = false

      $q.loading.hide()
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.editSuccess"),
          position: "top",
          timeout: 1000 })

        await refreshBasicInfoStores()
        resetWithdrawalPasswordForm()
      }

      return Promise.resolve({ status })
    } catch (error) {
      $q.loading.hide()
      return Promise.resolve({ status: false })
    }
  }

  async function setUserPassword(): Promise<{ status: boolean }> {
    try {
      $q.loading.show()
      const payload: Request.Password = {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password }
      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserPassword, payload)
      isLoading.value = false

      $q.loading.hide()
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.editSuccess"),
          position: "top",
          timeout: 1000 })

        await refreshBasicInfoStores()
        resetPasswordForm()
      }

      return Promise.resolve({ status })
    } catch (error) {
      $q.loading.hide()
      return Promise.resolve({ status: false })
    }
  }

  async function refreshUserWalletList(): Promise<Response.UserWalletList | null> {
    if (!isLogin.value) return null

    isLoading.value = true
    const { status, data } = await useApi(userInfoApi.getUserWalletList)
    isLoading.value = false

    if (!status) return null

    setStoreUserWalletList(data)

    return data
  }

  async function initializeActiveWallet(walletList: Response.UserWalletList): Promise<void> {
    const firstWallet = walletList[0]

    if (!firstWallet || walletList.some((wallet) => wallet.in_use)) return

    await setUserActiveWallet({
      currency_id: firstWallet.currency_id,
      wallet_type: firstWallet.wallet_type })
  }

  async function getUserWalletList(): Promise<void> {
    const data = await refreshUserWalletList()

    if (!data) return

    await initializeActiveWallet(data)
  }

  // 使用 store 中的方法來管理回調函數
  const registerActiveWalletChangeFunc = (func: () => void | Promise<void>) => { userInfoStore.registerActiveWalletChangeFunc(func) }

  const unregisterActiveWalletChangeFunc = (func: () => void | Promise<void>) => { userInfoStore.unregisterActiveWalletChangeFunc(func) }

  const _excuteActiveWalletChangeFunc = async () => { await userInfoStore.executeActiveWalletChangeFunc() }

  async function setUserActiveWallet(payload: Request.SetUserActiveWallet) {
    try {
      $q.loading.show()

      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserActiveWallet, payload)
      isLoading.value = false

      if (!status) {
        $q.loading.hide()
        return
      }

      await refreshUserWalletList()

      // 執行切換activewallet時需要運行的function
      await userInfoStore.executeActiveWalletChangeFunc()

      $q.loading.hide()
    } catch (error) { $q.loading.hide() }
  }

  function getWalletLabel(wallet: Response.UserWallet) {
    if (isCredit.value) { return t("common.btn.point") }

    if (isGOG.value && wallet.currency_code === "CNY") { return "USDT" }

    if (isIDRToEUR.value && wallet.currency_code === "IDR") { return "EUR" }

    if (isNBL1.value && wallet.currency_code === "IDR") { return "Rp" }

    return wallet.currency_code
  }

  async function getUserRemark() {
    if (!isLogin.value) return

    isLoading.value = true
    const { status, data } = await useApi(userInfoApi.getUserRemark)
    isLoading.value = false

    if (!status || !data.remark) return

    setStoreUserRemark(data.remark)
  }

  async function getUserKycStatus() {
    if (!hasAuthToken.value) return

    const apiFunc = isOnBoarding.value ? userInfoApi.getKycStatusOnboarding : userInfoApi.getKycStatus
    isLoading.value = true
    const { status, data } = await useApi(apiFunc)
    isLoading.value = false

    if (status && data) {
      // 確保傳入的值是有效的枚舉值
      const kycStatusValue =
        typeof data.status === "number" && data.status >= 0 && data.status <= 5
          ? (data.status as KYC_VERIFIED.Enums)
          : KYC_VERIFIED.Enums.VERIFICATION_STATUS_NOT_STARTED
      setKycStatus(kycStatusValue)
    }
  }

  async function getUserKyc() {
    if (!hasAuthToken.value) return

    const apiFunc = isOnBoarding.value ? userInfoApi.getUserKycV2Onboarding : userInfoApi.getUserKycV2
    isLoading.value = true
    const { status, data } = await useApi(apiFunc)
    isLoading.value = false

    if (!status || !data) return

    setStoreUserKyc(data)

    return data
  }

  async function setUserKyc(data: Request.KycData): Promise<{ status: boolean }> {
    try {
      $q.loading.show()

      isLoading.value = true
      const { status } = await useApi(userInfoApi.setUserKyc, data)
      isLoading.value = false

      $q.loading.hide()
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.editSuccess"),
          position: "top",
          timeout: 1000 })
      }

      return Promise.resolve({ status })
    } catch (error) {
      $q.loading.hide()
      return Promise.resolve({ status: false })
    }
  }

  async function setUserKycV2(
    data: Request.KycV2Data,
    isUpdate: boolean
  ): Promise<{ status: boolean }> {
    try {
      $q.loading.show()

      let apiFunc

      if (isUpdate) { apiFunc = isOnBoarding.value ? userInfoApi.updateUserKycV2Onboarding : userInfoApi.updateUserKycV2 } else { apiFunc = isOnBoarding.value ? userInfoApi.setUserKycV2Onboarding : userInfoApi.setUserKycV2 }

      isLoading.value = true
      const { status } = await useApi(apiFunc, data)
      isLoading.value = false

      $q.loading.hide()
      if (status) {
        $q.notify({
          type: "positive",
          message: t("common.alarm.editSuccess"),
          position: "top",
          timeout: 1000 })
      }

      return Promise.resolve({ status })
    } catch (error) {
      $q.loading.hide()
      return Promise.resolve({ status: false })
    }
  }

  function inviteCodeUrl(item: { inviteCode: string; routerName?: string; redirect?: string }) {
    if (!item.inviteCode) return ""

    const resolved = router.resolve({
      name: item.routerName || "HomePage",
      query: {
        inviteCode: item.inviteCode,
        redirect: item.redirect || "register" } })

    const url = window.location.origin + resolved.href

    return url
  }

  const getMemberAgentQuotaMoneyHistory = async (params: Request.GetMemberAgentQuotaMoneyHistory) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentQuotaMoneyHistory, params)
    isLoading.value = false

    return { data }
  }

  const getCreditQuotaHistory = async (params: Request.GetCreditQuotaHistory) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getCreditQuotaHistory, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentQuotaList = async (params?: Request.GetMemberAgentQuotaList) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentQuotaList, params)
    isLoading.value = false

    return { data }
  }

  const updateMemberAgentQuotaBalance = async (params?: Request.UpdateMemberAgentQuotaBalance) => {
    isLoading.value = true
    const { status } = await useApi(userInfoApi.updateMemberAgentQuotaBalance, params)
    isLoading.value = false

    return { status }
  }

  const getMemberAgentQuotaAmount = async (params: Request.GetMemberAgentQuotaAmount) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentQuotaAmount, params)
    isLoading.value = false

    return { data }
  }

  const getLowerLevelMemberAgentQuotaList = async (params: Request.GetLowerLevelMemberAgentQuotaList) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getLowerLevelMemberAgentQuotaList, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentCustomizeColumn = async (params: Request.GetMemberAgentCustomizeColumn) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentCustomizeColumn, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentReferralList = async () => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentReferralList)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentTagList = async () => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentTagList)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentInfo = async (memberId: number) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentInfo, memberId)
    isLoading.value = false

    return { data }
  }

  const createMemberAgent = async (params: Request.CreateMemberAgent) => {
    isLoading.value = true
    const { status } = await useApi(userInfoApi.createMemberAgent, params)
    isLoading.value = false

    return { status }
  }

  const updateMemberAgent = async (params: Request.CreateMemberAgent) => {
    isLoading.value = true
    const { status } = await useApi(userInfoApi.updateMemberAgent, params)
    isLoading.value = false

    return { status }
  }

  const getMemberAgentBetReport = async (params: Request.GetMemberAgentBetReport) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentBetReport, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentWagerList = async (params: Request.GetMemberAgentWagerList) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentWagerList, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentWagerDetail = async (params: Request.GetMemberAgentWagerDetail) => {
    isLoading.value = true
    // silent：抑制全域錯誤 toast，改由呼叫端統一顯示「該遊戲商不支援查看詳情明細」提示
    const { data, code, status, msg } = await useApi(userInfoApi.getMemberAgentWagerDetail, params, {
      silent: true
    })
    isLoading.value = false

    return { data, code, status, msg }
  }

  const getMemberAgentReport = async (params: Request.GetMemberAgentReport) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberAgentReport, params)
    isLoading.value = false

    return { data }
  }

  const getMemberTeamAgentReport = async (params: Request.GetMemberTeamAgentReport) => {
    isLoading.value = true
    const { data } = await useApi(userInfoApi.getMemberTeamAgentReport, params)
    isLoading.value = false

    return { data }
  }

  const getMemberAgentReportDetail = async (params: Request.GetMemberAgentReportDetail) => {
    const { data } = await useApi(userInfoApi.getMemberAgentReportDetail, params)
    return { data }
  }

  const getMemberAgentTeamDetail = async (params: Request.GetMemberAgentTeamDetail) => {
    const { data, status } = await useApi(userInfoApi.getMemberAgentTeamDetail, params)
    return { data, status }
  }

  async function handleTransferBonusWallet(payload: Request.PostTransferBonusWallet): Promise<{
    status: boolean
    code?: number
  }> {
    if (isNaN(payload.amount) || !payload.amount) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.invalid_amount_format"),
        position: "top",
        timeout: 1000 })
      return { status: false }
    }

    if (!payload.currency_id) { payload.currency_id = activeWalletCurrencyId.value }

    const walletByCurrency = bonusWallets.value.find((e) => e.currency_id === payload.currency_id)

    let bonusWalletAmount = 0

    if (walletByCurrency) { bonusWalletAmount = Number(walletByCurrency.balance) }

    if (isNaN(bonusWalletAmount) || payload.amount > bonusWalletAmount) {
      $q.notify({
        type: "negative",
        message: t("common.alarm.amount_to_claim_exceeds_balance"),
        position: "top",
        timeout: 1000 })

      return { status: false }
    }

    isLoading.value = true
    const { status, code } = await useApi(userInfoApi.postTransferBonusWallet, payload)

    if (status) {
      $q.notify({
        type: "positive",
        message: t("common.alarm.successfullyClaimed"),
        position: "top",
        timeout: 1000 })
      await getUserWalletList()
    }
    isLoading.value = false
    return Promise.resolve({
      status,
      code })
  }

  const handleGetMemberSummary = async (params: Request.GetMemberSummary) => {
    isLoading.value = true

    const { status, data } = await useApi(userInfoApi.getMemberSummary, params)

    if (status) {
      if (data.withdraw.startsWith("-")) { data.withdraw = data.withdraw.slice(1) }

      const start = dayjs(params.start_time)
      const end = dayjs(params.end_time)
      const days: Response.GetMemberSummary["metrics"] = []
      for (let d = start; d.isBefore(end) || d.isSame(end, "day"); d = d.add(1, "day")) {
        days.push({
          date: d.format("YYYY-MM-DD"),
          deposit: "0",
          withdraw: "0" })
      }

      data.metrics.forEach((item) => {
        const itemDate = dayjs(item.date).format("YYYY-MM-DD")
        const target = days.find((d) => d.date === itemDate)
        if (target) {
          target.deposit = item.deposit
          target.withdraw = String(Math.abs(Number(item.withdraw)))
        }
      })
      data.metrics = days

      setMemberSummary(data)

      router.replace({
        query: {
          currency_id: params.currency_id,
          start_time: params.start_time,
          end_time: params.end_time } })
    }
    isLoading.value = false
  }
  return {
    /** api執行中 */
    isLoading,

    /** maya 登入 */
    isMayaLogin,

    /** GCash 登入 */
    isGCashLogin,
    /** 動態欄位會員基本資料 */
    accountInfo,

    /** 動態欄位會員基本資料表單 */
    accountInfoForm,

    /** 重置動態欄位會員基本資料 */
    resetAccountInfoForm,

    /** 會員基本資料 query（使用即觸發） */
    useBasicInfoQuery,

    /** 更新動態欄位會員基本資料 */
    setAccountInfo,

    /** 更新單筆動態欄位會員基本資料 */
    setSingleAccountInfo,

    /** 會員基本資料 */
    userInfo,

    /** 會員基本資料 */
    userInfo2,

    /** 會員基本資料form */
    userInfoForm,

    /** 重置會員基本資料form */
    resetUserInfoForm,

    /** 會員基本資料form2 */
    userInfoForm2,

    /** 重置會員基本資料form2 */
    resetUserInfoForm2,

    /** 會員KYC資料form */
    userKycInfoForm,

    /** q-date 限制18歲以上 */
    qDateAdultOptions,

    /** 取得會員層級資料 */
    getLevelsInfo,

    /** 會員層級資料 */
    userCurrentLevelsInfo,

    /** 會員當前層級資料 */
    userActiveLevelsInfo,

    /** 更新會員基本資料 */
    setUserInfo,

    /** 更新會員基本資料 */
    setUserInfo2,

    /** 更新會員中心KYC */
    setMemberCenterKyc,

    /** 更新會員單筆基本資料 */
    setSingleUserInfo,

    /** 更新會員頭像 */
    setUserAvatar,

    /** 取的server會員頭像 */
    getUserAvatar,

    /** 會員出款密碼form */
    withdrawalPasswordForm,

    /** 會員密碼form */
    passwordForm,

    /** 取得會員輸贏紀錄 */
    getUserBetHistoryTotal,

    /** 會員最新登入時間 */
    lastLoginTime,

    /** 會員各幣別輸贏數據 */
    winLoseList,

    /**  修改會員出款密碼 */
    setUserWithdrawalPassword,

    /** 修改會員密碼 */
    setUserPassword,

    /** 初始化password form */
    resetPasswordForm,

    /** 初始化 withdrawal password form */
    resetWithdrawalPasswordForm,

    /** 會員錢包列表 */
    userWalletList,

    /** 會員錢包清單 */
    userWalletMap,

    /** 是否只有一個幣別 */
    isSingleWalletCurrency,

    /** 會員當前使用幣別Label */
    activeWalletLabel,

    /** 會員當前使用幣別 code */
    activeWalletCurrencyCode,

    /** 會員當前使用幣別 id */
    activeWalletCurrencyId,

    /** Current active wallet type */
    activeWalletType,

    /** 會員當前使用錢包 */
    inUseWallet,

    /** 現金錢包 */
    cashWallets,

    /** 撲滿錢包 */
    bonusWallets,

    /** 贈金錢包 */
    rewardWallets,

    /** 取得會員錢包 */
    getUserWalletList,

    /** 註冊切換active wallet時需要運行的function */
    registerActiveWalletChangeFunc,

    /** 取消註冊切換active wallet時需要運行的function */
    unregisterActiveWalletChangeFunc,

    /** 更新會員當前使用錢包 */
    setUserActiveWallet,

    /** 取得錢包幣別Label */
    getWalletLabel,

    /** 會員備註 */
    userCurrentRemark,

    userRemark,

    /** 取得會員備註 */
    getUserRemark,

    /**KYC */
    setUserKyc,

    /** KYC v2 */
    setUserKycV2,

    /** 取得KYC */
    getUserKyc,

    /** 取得KYC驗證狀態 */
    getUserKycStatus,

    /** user 已上傳 kyc */
    userKyc,

    /** kyc是否通過驗證 */
    isKycVerified,

    /** kyc 驗證狀態 */
    kycStatus,

    /** 是否開啟 kyc 功能 */
    isKycEnabled: isMemberKycEnabled,

    /** 共用的客製化欄位placeholder */
    memberColumnPlaceholderI18n,

    /** 共用的客製化欄位memberColumnIconName */
    memberColumnIconName,

    /** 客製化欄位select value label轉換 */
    getSelectColumnValue,

    /** 客製化會員欄位 - 沒有map 過select 組件map */
    memberNoFilterColumnList,

    /** 客製化會員欄位 */
    memberColumnList,

    /** 取得客製化會員欄位 */
    getMemberColumn,

    /** 同時顯示國碼+電話號碼 */
    needCountryCodePhone,

    /** phone 動態欄位資訊 */
    columnCountryCode,

    /** 推薦碼url */
    inviteCodeUrl,

    /** 自我排除時間選擇條件 */
    selfExclusionDateOptions,

    /** 使用者透過click登入狀態 */
    loginByUserClick,

    /** 設定使用者透過click登入狀態 */
    setLoginByUserClick,

    /** 取得下級會員帳變明細 */
    getMemberAgentQuotaMoneyHistory,

    /** 取得額度帳變明細 */
    getCreditQuotaHistory,

    /** 取得下級會員列表 */
    getMemberAgentQuotaList,

    /** 調整下級會員餘額 */
    updateMemberAgentQuotaBalance,

    /** 取得代理加扣款餘額 */
    getMemberAgentQuotaAmount,

    /** 取得下級會員的 下級會員列表 */
    getLowerLevelMemberAgentQuotaList,

    /** 領取禮碼 */
    handleTransferBonusWallet,

    /** 取得後台會員資料自訂欄位 */
    getMemberAgentCustomizeColumn,

    /** 取得推薦人列表 */
    getMemberAgentReferralList,

    /** 取得標籤列表 */
    getMemberAgentTagList,

    /** 取得下級會員資料 */
    getMemberAgentInfo,

    /** 建立下級會員 */
    createMemberAgent,

    /** 編輯下級會員 */
    updateMemberAgent,

    /** 取得投注報表紀錄 */
    getMemberAgentBetReport,

    /** 取得投注紀錄查詢 */
    getMemberAgentWagerList,

    /** 取得派彩詳細頁面（第三方頁面） */
    getMemberAgentWagerDetail,

    /** 會員總攬 */
    memberSummary,

    /** 取得總攬 */
    handleGetMemberSummary,

    /** 取得代理報表 */
    getMemberAgentReport,

    /** 取得團隊代理報表 */
    getMemberTeamAgentReport,

    /** 取得代理報表自身數據細項 */
    getMemberAgentReportDetail,

    /** 取得團隊代理報表下級會員細項 */
    getMemberAgentTeamDetail }
}
