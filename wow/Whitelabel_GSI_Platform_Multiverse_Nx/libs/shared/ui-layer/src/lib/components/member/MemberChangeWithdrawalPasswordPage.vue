<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const { tabOptions, activeTabKey, handleTabChange } = useMemberProfileTabs()

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.PROFILE
)

const { form, hasSubmitted, errors, shouldShowOldPassword, isSubmitting, submit } = useMemberWithdrawalPasswordForm()

const handleSubmit = () => {
  handleGlobalClick({
    target: "handleMemberChangeWithdrawalPasswordSubmitClick",
    debounceTimer: 180,
    callback: async () => {
      await submit()
    }
  })
}
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="設定出款密碼"
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

    <div class="w-full h-full min-h-0 flex flex-col">
      <div class="flex flex-col gap-3">
        <BaseInput
          v-if="shouldShowOldPassword"
          v-model="form.oldPassword"
          type="password"
          label="Current Password"
          required
          placeholder="請輸入..."
          :invalid="hasSubmitted && Boolean(errors.oldPassword)"
          :error-message="hasSubmitted ? errors.oldPassword : ''"
        />

        <BaseInput
          v-model="form.newPassword"
          type="password"
          label="New Password"
          required
          placeholder="請輸入..."
          :invalid="hasSubmitted && Boolean(errors.newPassword)"
          :error-message="hasSubmitted ? errors.newPassword : ''"
        />

        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="Confirm Password"
          required
          placeholder="請輸入..."
          :invalid="hasSubmitted && Boolean(errors.confirmPassword)"
          :error-message="hasSubmitted ? errors.confirmPassword : ''"
        />
      </div>

      <div class="mt-auto pt-4">
        <BaseBtn class="w-full" size="xl" :loading="isSubmitting" @click="handleSubmit"> 確認 </BaseBtn>
      </div>
    </div>
  </MemberContainer>
</template>
