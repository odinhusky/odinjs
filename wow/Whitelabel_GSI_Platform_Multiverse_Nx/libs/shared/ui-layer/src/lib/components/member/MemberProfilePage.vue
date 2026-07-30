<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const { tabOptions, activeTabKey, handleTabChange } = useMemberProfileTabs()

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.PROFILE
)

const {
  formData,
  formErrors,
  profileFields,
  fieldLabelMap,
  phoneField,
  countryField,
  hasPhoneField,
  hasCountryField,
  phoneGroupAnchor,
  shouldSkipField,
  isMemberColumnLoading,
  isAccountInfoLoading,
  isSavingProfile,
  accountInfo,
  clearFieldError,
  submitProfile
} = useMemberProfileForm()

const accountSwitchOptions = [
  { label: "啟用", value: "enabled" },
  { label: "停用", value: "disabled" }
]

const accountSwitchValue = ref<string | number>("enabled")
const selfExclusionDate = ref<string | null>(null)
const selfExclusionMinDate = computed(() => new Date())

watch(
  () => accountInfo.value?.self_exclusion_at,
  (value) => {
    if (!value) {
      accountSwitchValue.value = "enabled"
      selfExclusionDate.value = null
      return
    }

    const millis = Number(value) > 1e12 ? Number(value) : Number(value) * 1000
    const date = new Date(millis)
    if (Number.isNaN(date.getTime())) {
      accountSwitchValue.value = "enabled"
      selfExclusionDate.value = null
      return
    }

    accountSwitchValue.value = "disabled"
    selfExclusionDate.value = date.toISOString().slice(0, 10)
  },
  { immediate: true }
)

watch(accountSwitchValue, (value) => {
  if (value === "enabled") {
    selfExclusionDate.value = null
  }
})

const handleUpdateProfileField = ({ key, value }: { key: string; value: unknown }) => {
  formData[key] = value as never
}

const handleSubmit = () => {
  handleGlobalClick({
    target: "handleMemberProfileInfoSubmitClick",
    debounceTimer: 180,
    callback: async () => {
      await submitProfile(accountSwitchValue.value === "disabled" ? selfExclusionDate.value : null)
    }
  })
}
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="個人資訊"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #top>
      <MemberProfileTopTabs :tab-options="tabOptions" :active-tab-key="activeTabKey" @change="handleTabChange" />
    </template>

    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.PROFILE" @select="handleAsideSelect" />
    </template>

    <div class="w-full h-full min-h-0 flex flex-col gap-4">
      <div v-if="isMemberColumnLoading || isAccountInfoLoading" class="h-full flex items-center justify-center">
        <div class="text-sm text-[var(--text-text-primary)] opacity-80">Loading...</div>
      </div>

      <div v-else class="grid grid-cols-2 gap-3 phone:grid-cols-1">
        <DynamicFields
          :fields="profileFields"
          :form-data="formData"
          :form-errors="formErrors"
          :field-label-map="fieldLabelMap"
          :phone-field="phoneField"
          :country-field="countryField"
          :has-phone-field="hasPhoneField"
          :has-country-field="hasCountryField"
          :phone-group-anchor="phoneGroupAnchor"
          :should-skip-field="shouldSkipField"
          register-info-type="center"
          :disable-by-edit="true"
          @update-field="handleUpdateProfileField"
          @clear-error="clearFieldError"
        />

        <MemberSelfExclusionControl
          v-model:status="accountSwitchValue"
          v-model:date="selfExclusionDate"
          :options="accountSwitchOptions"
          :min-date="selfExclusionMinDate"
        />
      </div>

      <div class="mt-auto pt-2">
        <BaseBtn class="w-full" size="xl" :loading="isSavingProfile" @click="handleSubmit"> 確認 </BaseBtn>
      </div>
    </div>
  </MemberContainer>
</template>
